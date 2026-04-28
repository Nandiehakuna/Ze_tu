import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    return null; // Server-side, return null
  }

  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }

  return supabase;
}

// Export a reference for compatibility
export function supabaseClient() {
  return getSupabaseClient();
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
  payment_method?: string;
  created_at?: string;
  completed_at?: string;
}

// Step 1: Send OTP to phone
export async function sendOTP(phone: string) {
  try {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client not initialized');
    
    const { data, error } = await client.auth.signInWithOtp({
      phone: phone,
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send OTP' };
  }
}

// Step 2: Verify OTP
export async function verifyOTP(phone: string, token: string) {
  try {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client not initialized');
    
    const { data, error } = await client.auth.verifyOtp({
      phone: phone,
      token: token,
      type: 'sms',
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to verify OTP' };
  }
}

// Step 9: Save onboarding data
export async function saveOnboardingData(data: OnboardingData) {
  try {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client not initialized');
    
    const { data: session } = await client.auth.getSession();
    
    if (!session?.session?.user?.id) {
      throw new Error('User not authenticated');
    }

    const { error } = await (client
      .from('onboarding_data') as any)
      .insert([
        {
          user_id: session.session.user.id,
          phone: data.phone,
          email: data.email,
          full_name: data.full_name,
          country: data.country,
          purpose: data.purpose,
          monthly_amount: data.monthly_amount,
          recipient_name: data.recipient_name,
          recipient_phone: data.recipient_phone,
          payment_method: data.payment_method,
          completed_at: new Date().toISOString(),
        }
      ]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save data' };
  }
}
