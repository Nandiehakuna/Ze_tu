import { NextResponse } from 'next/server';
import { getGBPKESRate } from '@/lib/fx';

export const revalidate = 600;

export async function GET() {
  const rate = await getGBPKESRate();

  return NextResponse.json(
    {
      base: rate.base,
      quote: rate.quote,
      rate: rate.rate,
      fetched_at: rate.fetched_at,
      source: rate.source,
    },
    { status: 200 }
  );
}
