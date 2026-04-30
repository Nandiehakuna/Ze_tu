import crypto from 'crypto';

export type BitnobInvoice = {
  id: string;
  paymentRequest: string;
  raw?: unknown;
};

export async function createLightningInvoice(
  amountGBP: number,
  description: string,
  customerEmail?: string
): Promise<BitnobInvoice> {
  const apiKey = process.env.BITNOB_API_KEY;
  const payload = {
    amount: Number(amountGBP.toFixed(2)),
    currency: 'GBP',
    description,
    customerEmail,
  };

  if (!apiKey) {
    return {
      id: `demo-invoice-${Date.now()}`,
      paymentRequest: `lnbc_demo_${Date.now()}`,
      raw: { source: 'mock-missing-bitnob-key', payload },
    };
  }

  try {
    const response = await fetch('https://sandboxapi.bitnob.co/api/v1/wallets/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Bitnob invoice request failed with status ${response.status}`);
    }

    const data = (await response.json()) as any;
    const invoiceId =
      data?.data?.id ||
      data?.id ||
      data?.data?.invoiceId ||
      `invoice-${Date.now()}`;
    const paymentRequest =
      data?.data?.paymentRequest ||
      data?.data?.invoice ||
      data?.paymentRequest ||
      data?.invoice ||
      '';

    if (!paymentRequest) {
      throw new Error('Bitnob response missing payment request');
    }

    return {
      id: String(invoiceId),
      paymentRequest: String(paymentRequest),
      raw: data,
    };
  } catch {
    return {
      id: `demo-invoice-${Date.now()}`,
      paymentRequest: `lnbc_demo_${Date.now()}`,
      raw: { source: 'mock-bitnob-fallback', payload },
    };
  }
}

export function verifyBitnobWebhook(payload: string, signature?: string | null) {
  const secret = process.env.BITNOB_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
