import { supabaseAdminClient } from '@/lib/supabase.server';

type PromptInput = {
  recipientName: string;
  amountKES: number;
  language: string;
};

const DHOLOU_NOTIFICATION =
  process.env.DHOLOU_NOTIFICATION_AUDIO_URL ||
  'https://example.com/audio/dholuo-transfer-notification.mp3';

export function buildRecipientPrompt(input: PromptInput) {
  const language = (input.language || 'swahili').toLowerCase();
  if (language === 'dholuo') {
    return {
      language,
      message: `Nyingi? pesa mar KES ${Math.round(input.amountKES)} ochopo ni ${input.recipientName}. Dii 1 mondo iyie.`,
    };
  }
  if (language === 'english') {
    return {
      language: 'english',
      message: `Hello ${input.recipientName}. You have received ${Math.round(
        input.amountKES
      )} Kenya shillings. Press 1 to confirm.`,
    };
  }

  return {
    language: 'swahili',
    message: `Habari ${input.recipientName}. Umepokea shilingi elfu ${Math.round(
      input.amountKES / 1000
    )}. Bonyeza 1 kuthibitisha kupokea.`,
  };
}

export function resolveRecipientAudio(language: string, senderVoiceUrl: string | null) {
  const normalized = (language || 'swahili').toLowerCase();
  return {
    languageAudioUrl: normalized === 'dholuo' ? DHOLOU_NOTIFICATION : null,
    senderVoiceUrl,
  };
}

export async function ingestVoiceFromUrl(senderId: string, voiceUrl: string) {
  const response = await fetch(voiceUrl);
  if (!response.ok) {
    return { storageUrl: voiceUrl, storagePath: null };
  }
  const arrayBuffer = await response.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const path = `${senderId}/${Date.now()}.oga`;
  const supabase = supabaseAdminClient();
  const { error } = await supabase.storage.from('voice-messages').upload(path, bytes, {
    contentType: 'audio/ogg',
    upsert: false,
  });
  if (error) {
    return { storageUrl: voiceUrl, storagePath: null };
  }
  const { data } = supabase.storage.from('voice-messages').getPublicUrl(path);
  return { storageUrl: data.publicUrl || voiceUrl, storagePath: path };
}
