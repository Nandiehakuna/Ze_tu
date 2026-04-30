import { NextResponse } from 'next/server';

const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
const ANTHROPIC_VERSION = '2023-06-01';

type WelcomeBody = {
  name?: string;
  recipientName?: string;
  recipientLanguage?: string;
  country?: string;
  rate?: number;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as WelcomeBody;

  const name = body.name?.trim() || 'friend';
  const recipientName = body.recipientName?.trim() || 'your loved one';
  const recipientLanguage = body.recipientLanguage?.trim() || 'their language';
  const country = body.country?.trim() || 'home';
  const rate = typeof body.rate === 'number' ? body.rate : 166;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      message: `Welcome ${name}. You're all set to send to ${recipientName} in ${country}.`,
    });
  }

  const prompt = `Write one warm personalised welcome sentence for Zetu.
Rules:
- Under 25 words.
- Mention recipient name naturally.
- Friendly, trusted tone.
- Sender name: ${name}
- Recipient name: ${recipientName}
- Recipient language: ${recipientLanguage}
- Country: ${country}
- Current GBP/KES rate: ${rate}
- Output only the sentence, no quotes.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 80,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        message: `Welcome ${name}. You can now send to ${recipientName} with confidence.`,
      });
    }

    const payload = (await response.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };

    const text =
      payload.content
        ?.filter((part) => part.type === 'text' && typeof part.text === 'string')
        .map((part) => part.text!.trim())
        .join(' ')
        .trim() || `Welcome ${name}. You can now send to ${recipientName} with confidence.`;

    return NextResponse.json({ message: text });
  } catch {
    return NextResponse.json({
      message: `Welcome ${name}. You can now send to ${recipientName} with confidence.`,
    });
  }
}
