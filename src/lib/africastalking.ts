import { supabaseAdminClient } from '@/lib/supabase.server';
import { buildRecipientPrompt, resolveRecipientAudio } from '@/lib/voice';
import { sendTelegramMessage } from '@/lib/telegram';

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  );
}

function getAuthHeader() {
  const apiKey = process.env.AFRICASTALKING_API_KEY;
  if (!apiKey) return null;
  return { apiKey, username: process.env.AFRICASTALKING_USERNAME || 'sandbox' };
}

export async function triggerRecipientCall(transactionId: string) {
  const auth = getAuthHeader();
  if (!auth) return { ok: false, reason: 'missing-africastalking-env' };

  const supabase = supabaseAdminClient();
  const { data: tx } = await supabase
    .from('transactions')
    .select('*, recipients(*), users(*)')
    .eq('id', transactionId)
    .single();

  const recipient = Array.isArray(tx?.recipients) ? tx?.recipients[0] : tx?.recipients;
  if (!recipient?.mpesa_number) return { ok: false, reason: 'recipient-not-found' };
  const to = recipient.mpesa_number;
  const callbackUrl = `${getBaseUrl()}/api/africastalking/voice?transactionId=${encodeURIComponent(transactionId)}`;
  const notification = buildRecipientPrompt({
    recipientName: recipient?.name || 'Ndugu',
    amountKES: tx.amount_kes,
    language: recipient?.language || 'swahili',
  });
  const audio = resolveRecipientAudio(recipient?.language || 'swahili', tx.voice_message_url || null);

  const body = new URLSearchParams({
    username: auth.username,
    to: to.includes(',') ? to : to,
    from: process.env.AFRICASTALKING_CALLER_ID || '',
    clientRequestId: transactionId,
    callBackUrl: callbackUrl,
    metadata: JSON.stringify({
      transactionId,
      message: notification.message,
      language: notification.language,
      senderVoiceUrl: audio.senderVoiceUrl,
      languageAudioUrl: audio.languageAudioUrl,
    }),
  });

  const response = await fetch('https://api.africastalking.com/version1/call', {
    method: 'POST',
    headers: {
      apiKey: auth.apiKey,
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    return { ok: false, reason: `call-request-failed-${response.status}` };
  }

  await supabase
    .from('transactions')
    .update({ status: 'delivered', delivered_at: new Date().toISOString() })
    .eq('id', transactionId);
  return { ok: true };
}

export async function confirmRecipientReceipt(transactionId: string) {
  const supabase = supabaseAdminClient();
  const { data: tx } = await supabase
    .from('transactions')
    .update({ status: 'confirmed', voice_played: true, confirmed_at: new Date().toISOString() })
    .eq('id', transactionId)
    .select('id, users(telegram_chat_id), recipients(name)')
    .single();

  const user = Array.isArray(tx?.users) ? tx?.users[0] : tx?.users;
  const recipient = Array.isArray(tx?.recipients) ? tx?.recipients[0] : tx?.recipients;
  const chatId = user?.telegram_chat_id;
  if (chatId) {
    await sendTelegramMessage(
      String(chatId),
      `${recipient?.name || 'Your recipient'} confirmed receipt and heard your voice message.`
    );
  }
}
