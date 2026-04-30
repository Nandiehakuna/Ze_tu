import type { FXRate } from '@/types';

const TEN_MINUTES_MS = 10 * 60 * 1000;
const FALLBACK_RATE = 166;

let cachedRate: FXRate | null = null;
let cachedAt = 0;

export async function getGBPKESRate(): Promise<FXRate> {
  const now = Date.now();
  if (cachedRate && now - cachedAt < TEN_MINUTES_MS) {
    return cachedRate;
  }

  const apiKey = process.env.EXCHANGERATE_API_KEY;
  if (!apiKey) {
    const fallback = cachedRate ?? {
      base: 'GBP',
      quote: 'KES',
      rate: FALLBACK_RATE,
      fetched_at: new Date().toISOString(),
      source: 'fallback-missing-api-key',
    };
    cachedRate = fallback;
    cachedAt = now;
    return fallback;
  }

  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/GBP`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`ExchangeRate API failed with status ${response.status}`);
    }

    const payload = (await response.json()) as {
      conversion_rates?: { KES?: number };
    };
    const rate = payload.conversion_rates?.KES;

    if (!rate || Number.isNaN(rate)) {
      throw new Error('Invalid KES rate in API response');
    }

    const nextRate: FXRate = {
      base: 'GBP',
      quote: 'KES',
      rate,
      fetched_at: new Date().toISOString(),
      source: 'exchangerate-api',
    };

    cachedRate = nextRate;
    cachedAt = now;
    return nextRate;
  } catch {
    const fallback = cachedRate ?? {
      base: 'GBP',
      quote: 'KES',
      rate: FALLBACK_RATE,
      fetched_at: new Date().toISOString(),
      source: cachedRate ? 'cached' : 'fallback-hardcoded',
    };

    if (!cachedRate) {
      cachedRate = fallback;
      cachedAt = now;
    }

    return fallback;
  }
}

export function calculateTransfer(amountGBP: number, rate: number) {
  const normalizedAmount = Number.isFinite(amountGBP) ? Math.max(0, amountGBP) : 0;
  const feeGBP = Number((normalizedAmount * 0.01).toFixed(2));
  const totalGBP = Number((normalizedAmount + feeGBP).toFixed(2));
  const amountKES = Math.round(normalizedAmount * rate);

  return {
    amountGBP: Number(normalizedAmount.toFixed(2)),
    feeGBP,
    amountKES,
    totalGBP,
  };
}

export function formatKES(amount: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount);
}
