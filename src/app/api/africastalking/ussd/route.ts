import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const form = await request.formData().catch(() => new FormData());
  const text = String(form.get('text') || '');
  const level = text.split('*').filter(Boolean).length;

  if (level === 0) {
    return new NextResponse('CON Zetu USSD\n1. Check latest transfer\n2. Replay voice message', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  if (text === '1') {
    return new NextResponse('END Latest transfer was delivered. Call Zetu to confirm receipt.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  if (text === '2') {
    return new NextResponse('END We will call you now to replay your latest voice message.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return new NextResponse('END Invalid selection', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
