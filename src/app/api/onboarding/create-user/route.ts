import { NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase.server';

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { phone?: string };
    const phone = body.phone;
    if (!phone) return NextResponse.json({ success: false, error: 'missing-phone' }, { status: 400 });

    const supabase = supabaseAdminClient();

    const normalized = phone.replace(/\D/g, '');

    const { error } = await supabase.from('users').upsert([
      {
        phone: normalized,
      },
    ], { onConflict: 'phone' });

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || 'unknown' }, { status: 500 });
  }
}
