'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { supabaseClient } from '@/lib/supabase.client';
import type { Transaction } from '@/types';

type TransactionWithRecipient = Transaction & {
  recipients?: { name?: string; mpesa_number?: string } | null;
};

export default function TransferConfirmationPage() {
  const params = useParams<{ id: string }>();
  const id = String(params?.id || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tx, setTx] = useState<TransactionWithRecipient | null>(null);

  useEffect(() => {
    async function load() {
      const client = supabaseClient();
      if (!client || !id) {
        setError('Invalid transfer.');
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await client
        .from('transactions')
        .select('*, recipients(name, mpesa_number)')
        .eq('id', id)
        .single();

      if (queryError || !data) {
        setError('Transfer not found.');
      } else {
        setTx(data as TransactionWithRecipient);
      }
      setLoading(false);
    }
    void load();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      <DashboardNav />
      <main className="pt-20 px-4 md:px-8 pb-8">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-64" />
          ) : error ? (
            <div className="bg-white rounded-2xl border border-red-200 p-6 text-red-700">{error}</div>
          ) : tx ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#22c55e] mb-2">Transfer Created</p>
              <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">Confirmation</h1>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[#6b7280]">Recipient</span><span className="font-semibold">{tx.recipients?.name || 'Recipient'}</span></div>
                <div className="flex justify-between"><span className="text-[#6b7280]">Amount</span><span className="font-semibold">£{tx.amount_gbp.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-[#6b7280]">KES Value</span><span className="font-semibold">{Math.round(tx.amount_kes).toLocaleString()} KES</span></div>
                <div className="flex justify-between"><span className="text-[#6b7280]">Fee</span><span className="font-semibold">£{tx.fee_gbp.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-[#6b7280]">Status</span><span className="font-semibold uppercase">{tx.status || 'pending'}</span></div>
                <div className="flex justify-between"><span className="text-[#6b7280]">Lightning Hash</span><span className="font-semibold">{tx.lightning_hash || 'Pending settlement'}</span></div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href={`/reports/${tx.id}`} className="text-center flex-1 bg-[#1a1a1a] text-white py-3 rounded-lg font-semibold">View Transaction Detail</a>
                <a href="/dashboard" className="text-center flex-1 border border-gray-200 py-3 rounded-lg font-semibold text-[#1a1a1a]">Back to Dashboard</a>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
