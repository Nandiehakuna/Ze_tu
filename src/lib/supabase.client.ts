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

// Register a user record on the server (via API) and create an auth account
export async function registerAndSignInWithPhone(phone: string) {
  try {
    const client = supabaseBrowserClient();
    if (!client) throw new Error('Supabase browser client not initialized');

    // 1) Ensure server-side users table has the phone record (upsert)
    await fetch('/api/onboarding/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    }).catch(() => null);

    // 2) Construct email from phone digits and random password
    const digits = phone.replace(/\D/g, '');
    const email = `${digits}@zetu.app`;
    const password = typeof crypto !== 'undefined' && (crypto as any).randomUUID
      ? (crypto as any).randomUUID()
      : `${Math.random().toString(36).slice(2)}${Date.now()}`;

    // 3) Sign up via Supabase auth (creates auth user)
    const { error: signUpError } = await client.auth.signUp({ email, password });
    if (signUpError && signUpError.message.indexOf('already registered') === -1) {
      // if it's some other error, surface it
      return { success: false, error: signUpError.message };
    }

    // 4) Immediately sign in to establish session
    const { data: signInData, error: signInError } = await client.auth.signInWithPassword({ email, password });
    if (signInError) return { success: false, error: signInError.message };

    const userId = signInData?.user?.id;
    if (userId && typeof localStorage !== 'undefined') {
      localStorage.setItem('zetu_user_id', userId);
    }

    return { success: true, userId };
  } catch (err) {
    console.error('registerAndSignInWithPhone error', err);
    return { success: false, error: (err as Error)?.message || 'unknown' };
  }
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
