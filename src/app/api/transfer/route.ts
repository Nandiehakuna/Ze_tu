import { NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase';
import { getGBPKESRate, calculateTransfer } from '@/lib/fx';
import { createLightningInvoice } from '@/lib/bitnob';
import { validateTransferRequest } from '@/lib/transfer';

type TransferRequest = {
  recipientId?: string;
  amountGBP?: number;
  senderId?: string;
  voiceMessageUrl?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as TransferRequest;
  const recipientId = body.recipientId;
  const senderId = body.senderId;
  const amountGBP = body.amountGBP;
  const voiceMessageUrl = body.voiceMessageUrl ?? null;

  const validation = validateTransferRequest({ recipientId, senderId, amountGBP });
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }

  try {
    const supabase = supabaseAdminClient();

    const [{ data: recipient, error: recipientError }, { data: sender, error: senderError }] =
      await Promise.all([
        supabase.from('recipients').select('*').eq('id', recipientId).single(),
        supabase.from('users').select('*').eq('id', senderId).single(),
      ]);

    if (recipientError || !recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }
    if (senderError || !sender) {
      return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
    }
    if (recipient.sender_id !== sender.id) {
      return NextResponse.json({ error: 'Recipient does not belong to sender' }, { status: 403 });
    }

    const fx = await getGBPKESRate();
    const transfer = calculateTransfer(amountGBP, fx.rate);
    const invoice = await createLightningInvoice(
      transfer.totalGBP,
      `Zetu transfer to ${recipient.name}`,
      `${sender.phone}@zetu.local`
    );

    const { data: inserted, error: insertError } = await supabase
      .from('transactions')
      .insert([
        {
          sender_id: senderId,
          recipient_id: recipientId,
          amount_gbp: transfer.amountGBP,
          amount_kes: transfer.amountKES,
          fee_gbp: transfer.feeGBP,
          fx_rate: fx.rate,
          lightning_invoice: invoice.paymentRequest,
          lightning_hash: invoice.id,
          status: 'pending',
          voice_message_url: voiceMessageUrl,
        },
      ])
      .select('*')
      .single();

    if (insertError || !inserted) {
      return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
    }

    return NextResponse.json(
      {
        transaction: inserted,
        invoice: {
          id: invoice.id,
          paymentRequest: invoice.paymentRequest,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: 'Transfer creation failed' }, { status: 500 });
  }
}
