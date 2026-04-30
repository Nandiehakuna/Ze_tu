import { NextResponse } from 'next/server';
import { confirmRecipientReceipt } from '@/lib/africastalking';
import { supabaseAdminClient } from '@/lib/supabase';
import { buildRecipientPrompt, resolveRecipientAudio } from '@/lib/voice';

function xmlResponse(xml: string) {
  return new NextResponse(xml, { status: 200, headers: { 'Content-Type': 'text/plain' } });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const queryTxId = url.searchParams.get('transactionId') || '';
  const form = await request.formData().catch(() => new FormData());

  const transactionId = String(form.get('clientRequestId') || form.get('transactionId') || queryTxId);
  const dtmf = String(form.get('dtmfDigits') || form.get('dtmf') || '');
  const isActive = String(form.get('isActive') || '1');

  if (!transactionId) return xmlResponse('<Response><Reject/></Response>');

  if (dtmf === '1') {
    await confirmRecipientReceipt(transactionId);
    return xmlResponse('<Response><Say>Asante. Imethibitishwa.</Say></Response>');
  }

  if (isActive === '0') {
    return xmlResponse('<Response><Hangup/></Response>');
  }

  const supabase = supabaseAdminClient();
  const { data: tx } = await supabase
    .from('transactions')
    .select('amount_kes, voice_message_url, recipients(name, language)')
    .eq('id', transactionId)
    .single();

  const prompt = buildRecipientPrompt({
    recipientName: tx?.recipients?.name || 'Ndugu',
    amountKES: tx?.amount_kes || 0,
    language: tx?.recipients?.language || 'swahili',
  });
  const audio = resolveRecipientAudio(tx?.recipients?.language || 'swahili', tx?.voice_message_url || null);

  const say = `<Say>${prompt.message}</Say>`;
  const languageAudio = audio.languageAudioUrl ? `<Play url="${audio.languageAudioUrl}" />` : '';
  const senderAudio = audio.senderVoiceUrl ? `<Play url="${audio.senderVoiceUrl}" />` : '';

  return xmlResponse(
    `<Response>${say}${languageAudio}${senderAudio}<GetDigits timeout="8" numDigits="1"><Say>Press 1 to confirm.</Say></GetDigits><Say>Goodbye.</Say></Response>`
  );
}
