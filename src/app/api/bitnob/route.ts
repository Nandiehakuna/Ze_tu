import { NextResponse } from 'next/server';
import { verifyBitnobWebhook } from '@/lib/bitnob';
import { supabaseAdminClient } from '@/lib/supabase';
import { triggerRecipientCall } from '@/lib/africastalking';

type BitnobWebhookPayload = {
  event?: string;
  type?: string;
  transactionId?: string;
  lightningHash?: string;
  data?: {
    id?: string;
    paymentHash?: string;
    lightningHash?: string;
    metadata?: Record<string, string>;
    status?: string;
  };
};

function resolveEvent(payload: BitnobWebhookPayload) {
  return (payload.event || payload.type || '').toLowerCase();
}

function resolveTransactionId(payload: BitnobWebhookPayload) {
  return payload.transactionId || payload.data?.metadata?.transactionId || payload.data?.metadata?.transaction_id;
}

function resolveLightningHash(payload: BitnobWebhookPayload) {
  return payload.lightningHash || payload.data?.paymentHash || payload.data?.lightningHash || payload.data?.id;
}

export async function POST(request: Request) {
  const rawPayload = await request.text();
  const signature = request.headers.get('x-bitnob-signature');

  // Allow internal simulation calls without signature header.
  const isInternalSimulation = !signature;
  const verified = isInternalSimulation || verifyBitnobWebhook(rawPayload, signature);

  if (!verified) {
    return NextResponse.json({ error: 'Invalid Bitnob signature' }, { status: 401 });
  }

  const payload = (rawPayload ? JSON.parse(rawPayload) : {}) as BitnobWebhookPayload;
  const event = resolveEvent(payload);
  const transactionId = resolveTransactionId(payload);
  const lightningHash = resolveLightningHash(payload);

  if (!event.includes('invoice') && !event.includes('settled') && !event.includes('payment')) {
    return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
  }

  const supabase = supabaseAdminClient();
  let txId = transactionId;

  if (!txId && lightningHash) {
    const { data: txByHash } = await supabase
      .from('transactions')
      .select('*')
      .eq('lightning_hash', lightningHash)
      .single();
    txId = txByHash?.id;
  }

  if (!txId) {
    return NextResponse.json({ ok: false, error: 'transaction not found' }, { status: 404 });
  }

  const { data: updatedTx } = await supabase
    .from('transactions')
    .update({
      status: 'settled',
      lightning_hash: lightningHash || undefined,
    })
    .eq('id', txId)
    .select('id, recipient_id')
    .single();

  if (updatedTx?.id && updatedTx.recipient_id) {
    await triggerRecipientCall(updatedTx.id);
  }

  return NextResponse.json({ ok: true, transactionId: txId, status: 'settled' }, { status: 200 });
}
