import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { OnboardingData } from '@/types';

let browserClient: SupabaseClient | null = null;

function getPublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return { url, anonKey };
}

// Browser client (singleton)
export function supabaseBrowserClient() {
  if (typeof window === 'undefined') return null;

  if (!browserClient) {
    const { url, anonKey } = getPublicEnv();
    browserClient = createBrowserClient(url, anonKey);
  }

  return browserClient;
}

// Backward-compatible alias used by existing UI code.
export function supabaseClient() {
  return supabaseBrowserClient();
}

// Step 1: Send OTP to phone
export async function sendOTP(phone: string) {
  try {
    const client = supabaseBrowserClient();
    if (!client) throw new Error('Supabase browser client not initialized');

    const { data, error } = await client.auth.signInWithOtp({ phone });
    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send OTP',
    };
  }
}

// Step 2: Verify OTP
export async function verifyOTP(phone: string, token: string) {
  try {
    const client = supabaseBrowserClient();
    if (!client) throw new Error('Supabase browser client not initialized');

    const { data, error } = await client.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify OTP',
    };
  }
}

// Step 9: Persist onboarding to users + recipients
export async function saveOnboardingData(data: OnboardingData) {
  try {
    const client = supabaseBrowserClient();
    if (!client) throw new Error('Supabase browser client not initialized');

    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError) throw sessionError;

    const userId = sessionData?.session?.user?.id;
    if (!userId) throw new Error('User not authenticated');

    const { error: userError } = await client.from('users').upsert(
      [
        {
          id: userId,
          phone: data.phone,
          name: data.full_name ?? null,
          language: 'english',
        },
      ],
      { onConflict: 'id' }
    );
    if (userError) throw userError;

    if (data.recipient_name && data.recipient_phone) {
      const { error: recipientError } = await client.from('recipients').upsert(
        [
          {
            sender_id: userId,
            name: data.recipient_name,
            relationship: data.purpose ?? null,
            mpesa_number: data.recipient_phone,
            language: (data.recipient_language || 'swahili').toLowerCase(),
            voice_method:
              (data.recipient_language || '').toLowerCase() === 'dholuo' ? 'pre-recorded' : 'tts',
            usual_amount: data.monthly_amount ?? null,
          },
        ],
        { onConflict: 'sender_id,mpesa_number' }
      );
      if (recipientError) throw recipientError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save data',
    };
  }
}
