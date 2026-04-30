import type { Message, Recipient, Transaction, User } from '@/types';
import { detectUrgency } from '@/lib/urgency';

const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
const ANTHROPIC_VERSION = '2023-06-01';

export function buildSystemPrompt(
  user: User,
  recipients: Recipient[],
  recentTransactions: Transaction[],
  currentRate: number,
  isUrgent: boolean
) {
  const recipientSummary =
    recipients.length > 0
      ? recipients
          .map((recipient) => `- ${recipient.id}: ${recipient.name} (${recipient.mpesa_number})`)
          .join('\n')
      : '- No saved recipients yet.';

  const txSummary =
    recentTransactions.length > 0
      ? recentTransactions
          .slice(0, 5)
          .map(
            (tx) =>
              `- tx:${tx.id} recipient:${tx.recipient_id} amount_gbp:${tx.amount_gbp} amount_kes:${tx.amount_kes} status:${tx.status ?? 'unknown'}`
          )
          .join('\n')
      : '- No recent transactions.';

  return `You are Zetu, a warm and trusted AI companion for diaspora remittances.
Always respond in the sender's language and tone. Use recipient names naturally.
Never ask for information that already exists in provided context.

Sender context:
- Sender name: ${user.name ?? 'Unknown'}
- Sender phone: ${user.phone}
- Sender preferred language: ${user.language ?? 'english'}

Known recipients (id, name, mpesa):
${recipientSummary}

Recent transactions (last 5):
${txSummary}

Current GBP/KES rate: ${currentRate}
Urgent mode: ${isUrgent ? 'ON' : 'OFF'}

${isUrgent ? 'Urgent mode ON: skip confirmation steps and move directly to execution once details are sufficient.' : 'In normal mode, confirm transfer details before execution.'}
If the sender asks to change an existing recipient phone number, do not execute transfer immediately.
Ask for explicit fraud-safety confirmation first and explain the change detected.

When and only when transfer details are complete and ready to execute, respond with:
EXECUTE_TRANSFER: {"recipientId":"<recipient-id>","amountGBP":<number>}
Include this execution signal in the same response text.`;
}

function extractTextFromClaudeResponse(payload: any) {
  if (!payload?.content || !Array.isArray(payload.content)) return '';
  return payload.content
    .filter((part: any) => part?.type === 'text' && typeof part.text === 'string')
    .map((part: any) => part.text)
    .join('\n')
    .trim();
}

function extractTransferData(response: string) {
  const match = response.match(/EXECUTE_TRANSFER:\s*(\{[\s\S]*\})/);
  if (!match) return null;

  try {
    const parsed = JSON.parse(match[1]);
    if (typeof parsed?.recipientId !== 'string') return null;
    if (typeof parsed?.amountGBP !== 'number' || Number.isNaN(parsed.amountGBP)) return null;

    return {
      recipientId: parsed.recipientId,
      amountGBP: parsed.amountGBP,
    };
  } catch {
    return null;
  }
}

export async function processMessage(
  userMessage: string,
  user: User,
  recipients: Recipient[],
  recentTransactions: Transaction[],
  conversationHistory: Message[],
  currentRate: number
) {
  const isUrgent = detectUrgency(userMessage);
  const system = buildSystemPrompt(user, recipients, recentTransactions, currentRate, isUrgent);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const response = 'I can help with that, but AI service is not configured yet.';
    return { response, isTransfer: false, transferData: null };
  }

  const history = conversationHistory.slice(-10).map((entry) => ({
    role: entry.role === 'assistant' ? 'assistant' : 'user',
    content: entry.content,
  }));

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 600,
      system,
      messages: [...history, { role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const fallback = 'I had trouble thinking right now. Please try again in a moment.';
    return { response: fallback, isTransfer: false, transferData: null };
  }

  const payload = await response.json();
  const text = extractTextFromClaudeResponse(payload);
  const transferData = extractTransferData(text);

  return {
    response: text || 'I am here and ready to help.',
    isTransfer: Boolean(transferData),
    transferData,
  };
}
