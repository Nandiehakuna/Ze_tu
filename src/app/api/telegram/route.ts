import { NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase.server';
import { processMessage } from '@/lib/claude';
import { getGBPKESRate } from '@/lib/fx';
import { phoneVariants } from '@/lib/phone';
import { sendTelegramMessage } from '@/lib/telegram';
import { ingestVoiceFromUrl } from '@/lib/voice';

type TelegramUpdate = {
  message?: {
    chat?: { id?: number };
    text?: string;
    voice?: { file_id?: string };
  };
};

function ok() {
  return NextResponse.json({ ok: true }, { status: 200 });
}

async function getTelegramVoiceUrl(fileId: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return null;

  const fileResponse = await fetch(
    `https://api.telegram.org/bot${botToken}/getFile?file_id=${encodeURIComponent(fileId)}`
  );

  if (!fileResponse.ok) return null;
  const payload = (await fileResponse.json()) as { result?: { file_path?: string } };
  const filePath = payload.result?.file_path;
  if (!filePath) return null;

  return `https://api.telegram.org/file/bot${botToken}/${filePath}`;
}

function extractLatestVoiceUrl(
  conversationMessages: Array<{ content?: string | null }>
) {
  for (const message of conversationMessages) {
    const content = message.content ?? '';
    if (content.startsWith('VOICE_ASSET:')) {
      try {
        const parsed = JSON.parse(content.replace('VOICE_ASSET:', '').trim()) as {
          storageUrl?: string;
          originalUrl?: string;
        };
        if (parsed.storageUrl) return parsed.storageUrl;
        if (parsed.originalUrl) return parsed.originalUrl;
      } catch {
        // Ignore malformed message payload.
      }
    }
    if (content.startsWith('VOICE_URL:')) {
      return content.replace('VOICE_URL:', '').trim();
    }
  }
  return null;
}

function extractPhoneLike(text: string) {
  const match = text.match(/(\+?\d[\d\s-]{8,}\d)/);
  if (!match) return null;
  return match[1].replace(/\s|-/g, '');
}

function detectRecipientPhoneChangeRisk(
  text: string,
  recipients: Array<{ name: string; mpesa_number: string }>
) {
  const phoneInMessage = extractPhoneLike(text);
  if (!phoneInMessage) return null;
  const lowered = text.toLowerCase();
  for (const recipient of recipients) {
    if (!recipient?.name) continue;
    if (lowered.includes(recipient.name.toLowerCase())) {
      const existing = recipient.mpesa_number.replace(/\s|-/g, '');
      if (existing !== phoneInMessage) {
        return recipient;
      }
    }
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const update = (await request.json().catch(() => ({}))) as TelegramUpdate;
    const chatIdRaw = update.message?.chat?.id;
    const text = update.message?.text?.trim() ?? '';
    const voiceFileId = update.message?.voice?.file_id;

    if (!chatIdRaw) return ok();
    const chatId = String(chatIdRaw);

    const supabase = supabaseAdminClient();
    let { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_chat_id', chatId)
      .single();

    if (!user) {
      const linkMatch = text.match(/^(?:\/link|link)\s+(.+)$/i);
      const candidatePhone = linkMatch?.[1]?.trim();
      if (candidatePhone) {
        const variants = phoneVariants(candidatePhone);
        for (const variant of variants) {
          const { data: foundUser } = await supabase
            .from('users')
            .select('*')
            .eq('phone', variant)
            .single();
          if (foundUser) {
            await supabase.from('users').update({ telegram_chat_id: chatId }).eq('id', foundUser.id);
            user = { ...foundUser, telegram_chat_id: chatId };
            await sendTelegramMessage(
              chatId,
              'Linked. You can now send money by typing here.'
            );
            break;
          }
        }
      }
    }

    if (!user) {
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-app-url.com');

      await sendTelegramMessage(
        chatId,
        `Welcome to Zetu. Complete onboarding at ${appUrl}/onboarding, then link this chat with: /link +2547XXXXXXXX`
      );
      return ok();
    }

    if (voiceFileId) {
      const voiceUrl = await getTelegramVoiceUrl(voiceFileId);
      if (voiceUrl) {
        const storedVoice = await ingestVoiceFromUrl(user.id, voiceUrl);
        await supabase.from('messages').insert([
          {
            user_id: user.id,
            role: 'user',
            content: `VOICE_ASSET:${JSON.stringify({
              originalUrl: voiceUrl,
              storageUrl: storedVoice.storageUrl,
              storagePath: storedVoice.storagePath,
            })}`,
          },
        ]);
      }

      await sendTelegramMessage(
        chatId,
        'Voice note received. I will attach it to your next transfer.'
      );
      return ok();
    }

    if (!text) return ok();

    const [recipientsResult, txResult, messagesResult, fx] = await Promise.all([
      supabase.from('recipients').select('*').eq('sender_id', user.id),
      supabase
        .from('transactions')
        .select('*')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),
      getGBPKESRate(),
    ]);

    const recipients = recipientsResult.data ?? [];
    const transactions = txResult.data ?? [];
    const conversationHistory = messagesResult.data ?? [];
    const latestVoiceMessageUrl = extractLatestVoiceUrl(conversationHistory);

    const recipientPhoneChangeRisk = detectRecipientPhoneChangeRisk(text, recipients);
    if (recipientPhoneChangeRisk) {
      await sendTelegramMessage(
        chatId,
        `Safety check: you mentioned a different number for ${recipientPhoneChangeRisk.name}. Please confirm intentionally changing from ${recipientPhoneChangeRisk.mpesa_number} before I proceed.`
      );
      return ok();
    }

    await supabase.from('messages').insert([
      {
        user_id: user.id,
        role: 'user',
        content: text,
      },
    ]);

    const ai = await processMessage(
      text,
      user,
      recipients,
      transactions,
      conversationHistory,
      fx.rate
    );

    await supabase.from('messages').insert([
      {
        user_id: user.id,
        role: 'assistant',
        content: ai.response,
      },
    ]);

    if (ai.isTransfer && ai.transferData) {
      const origin = new URL(request.url).origin;
      await fetch(`${origin}/api/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: ai.transferData.recipientId,
          amountGBP: ai.transferData.amountGBP,
          senderId: user.id,
          voiceMessageUrl: latestVoiceMessageUrl,
        }),
      });
    }

    await sendTelegramMessage(chatId, ai.response);
    return ok();
  } catch {
    return ok();
  }
}
