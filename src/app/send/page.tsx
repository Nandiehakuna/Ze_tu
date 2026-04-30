'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { supabaseClient } from '@/lib/supabase.client';
import { calculateTransfer, formatKES } from '@/lib/fx';
import type { Recipient, User } from '@/types';

export default function SendPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [rate, setRate] = useState(166);
  const [amount, setAmount] = useState(100);
  const [recipientId, setRecipientId] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const client = supabaseClient();
        if (!client) {
          router.push('/onboarding');
          return;
        }
        const { data: sessionData, error: sessionError } = await client.auth.getSession();
        if (sessionError || !sessionData?.session?.user?.id) {
          router.push('/onboarding');
          return;
        }

        const { data: appUser } = await client
          .from('users')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .single();
        if (!appUser) {
          router.push('/onboarding');
          return;
        }
        setUser(appUser as User);

        const [recipientsRes, fxRes] = await Promise.all([
          client.from('recipients').select('*').eq('sender_id', appUser.id).order('created_at', { ascending: false }),
          fetch('/api/fx').then(async (response) => {
            if (!response.ok) return { rate: 166 };
            return (await response.json()) as { rate?: number };
          }),
        ]);
        if (recipientsRes.error) {
          setError('Failed to load recipients.');
        }
        const recipientRows = (recipientsRes.data ?? []) as Recipient[];
        setRecipients(recipientRows);
        setRecipientId(recipientRows[0]?.id || '');
        setRate(typeof fxRes.rate === 'number' ? fxRes.rate : 166);
      } catch {
        setError('Unable to load send flow.');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [router]);

  const transfer = useMemo(() => calculateTransfer(amount, rate), [amount, rate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user || !recipientId || sending) return;
    setSending(true);
    setError(null);
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          recipientId,
          amountGBP: amount,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        transaction?: { id?: string };
        error?: string;
      };
      if (!response.ok || !payload.transaction?.id) {
        throw new Error(payload.error || 'Transfer could not be created');
      }
      router.push(`/send/confirm/${payload.transaction.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      <DashboardNav />
      <main className="pt-20 px-4 md:px-8 pb-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Send Money</h1>
          <p className="text-sm text-[#6b7280] mb-6">Create a transfer with live conversion and fee breakdown.</p>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-64" />
          ) : recipients.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-6 text-sm text-[#6b7280]">
              You do not have recipients yet. Add one from the recipients page first.
              <div className="mt-3">
                <a href="/recipients" className="text-[#f4a426] font-semibold">Go to Recipients</a>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#6b7280] mb-2">Recipient</label>
                <select
                  value={recipientId}
                  onChange={(event) => setRecipientId(event.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3"
                >
                  {recipients.map((recipient) => (
                    <option key={recipient.id} value={recipient.id}>
                      {recipient.name} ({recipient.mpesa_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#6b7280] mb-2">Amount (GBP)</label>
                <input
                  value={amount}
                  onChange={(event) => setAmount(Math.max(0, Number(event.target.value) || 0))}
                  type="number"
                  min={1}
                  step="0.01"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3"
                />
              </div>

              <div className="rounded-lg bg-[#f9fafb] border border-gray-100 p-4 text-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#6b7280]">Recipient receives</span>
                  <span className="font-semibold">{formatKES(transfer.amountKES)}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#6b7280]">Fee</span>
                  <span className="font-semibold">£{transfer.feeGBP.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#6b7280]">Total</span>
                  <span className="font-semibold">£{transfer.totalGBP.toFixed(2)}</span>
                </div>
                <p className="text-xs text-[#6b7280] mt-2">Live rate: {rate.toFixed(2)} GBP/KES</p>
              </div>

              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              ) : null}

              <button
                disabled={sending || amount < 1}
                className="w-full bg-gradient-to-r from-[#f4a426] to-[#c4820a] text-[#1a1a1a] py-3 rounded-lg font-bold disabled:opacity-50"
              >
                {sending ? 'Creating transfer...' : 'Review and Continue'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
