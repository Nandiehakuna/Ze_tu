export interface User {
  id: string;
  phone: string;
  name?: string | null;
  telegram_chat_id?: string | null;
  language?: string | null;
  created_at?: string;
}

export interface Recipient {
  id: string;
  sender_id: string;
  name: string;
  relationship?: string | null;
  mpesa_number: string;
  language?: string | null;
  voice_method?: string | null;
  usual_amount?: number | null;
  usual_send_day?: number | null;
  country?: string | null;
  created_at?: string;
}

export interface Transaction {
  id: string;
  sender_id: string;
  recipient_id: string;
  amount_gbp: number;
  amount_kes: number;
  fee_gbp: number;
  fx_rate: number;
  lightning_invoice?: string | null;
  lightning_hash?: string | null;
  status?: string | null;
  voice_message_url?: string | null;
  voice_played?: boolean;
  ai_confirmed?: boolean;
  ai_confirmation_quote?: string | null;
  ai_confirmation_language?: string | null;
  created_at?: string;
}

export interface Message {
  id: string;
  user_id: string;
  role: 'user' | 'assistant' | string;
  content: string;
  created_at?: string;
}

export interface VoiceMessage {
  id: string;
  transaction_id: string;
  sender_id: string;
  audio_url: string;
  duration_seconds?: number | null;
  played?: boolean;
  played_at?: string | null;
  created_at?: string;
}

export interface TransferIntent {
  sender_id?: string;
  recipient_name?: string;
  recipient_id?: string;
  recipient_phone?: string;
  amount_gbp: number;
  amount_kes?: number;
  currency?: string;
  note?: string;
  urgent?: boolean;
  language?: string;
}

export interface OnboardingData {
  id?: string;
  phone: string;
  email?: string;
  full_name?: string;
  country?: string;
  purpose?: string;
  monthly_amount?: number;
  recipient_name?: string;
  recipient_phone?: string;
  recipient_language?: string;
  payment_method?: string;
  created_at?: string;
  completed_at?: string;
}

export interface FXRate {
  base: string;
  quote: string;
  rate: number;
  fetched_at: string;
  source?: string;
}
