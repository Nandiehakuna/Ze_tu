'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { supabaseClient } from '@/lib/supabase.client';
import type { Transaction } from '@/types';

type Row = Transaction & {
  recipients?: { name?: string; mpesa_number?: string; language?: string } | null;
  users?: { name?: string; phone?: string } | null;
};

export default function TransactionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = String(params?.id || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [row, setRow] = useState<Row | null>(null);

  useEffect(() => {
    async function load() {
      const client = supabaseClient();
      if (!client || !id) {
        setError('Transaction not found.');
        setLoading(false);
        return;
      }
      const { data, error: queryError } = await client
        .from('transactions')
        .select('*, recipients(name, mpesa_number, language), users(name, phone)')
        .eq('id', id)
        .single();
      if (queryError || !data) {
        setError('Transaction not found.');
      } else {
        setRow(data as Row);
      }
      setLoading(false);
    }
    void load();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      <DashboardNav />
      <main className="pt-20 px-4 md:px-8 pb-8">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-72" />
          ) : error ? (
            <div className="bg-white rounded-2xl border border-red-200 p-6 text-red-700">{error}</div>
          ) : row ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h1 className="text-2xl font-bold text-[#1a1a1a]">Transaction Detail</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><p className="text-[#6b7280]">Transaction ID</p><p className="font-semibold break-all">{row.id}</p></div>
                <div><p className="text-[#6b7280]">Status</p><p className="font-semibold uppercase">{row.status || 'pending'}</p></div>
                <div><p className="text-[#6b7280]">Sender</p><p className="font-semibold">{row.users?.name || row.users?.phone || 'Unknown'}</p></div>
                <div><p className="text-[#6b7280]">Recipient</p><p className="font-semibold">{row.recipients?.name || 'Unknown'}</p></div>
                <div><p className="text-[#6b7280]">Recipient Number</p><p className="font-semibold">{row.recipients?.mpesa_number || 'N/A'}</p></div>
                <div><p className="text-[#6b7280]">Recipient Language</p><p className="font-semibold">{row.recipients?.language || 'N/A'}</p></div>
                <div><p className="text-[#6b7280]">Amount</p><p className="font-semibold">£{row.amount_gbp.toFixed(2)}</p></div>
                <div><p className="text-[#6b7280]">KES</p><p className="font-semibold">{Math.round(row.amount_kes).toLocaleString()} KES</p></div>
                <div><p className="text-[#6b7280]">Fee</p><p className="font-semibold">£{row.fee_gbp.toFixed(2)}</p></div>
                <div><p className="text-[#6b7280]">FX Rate</p><p className="font-semibold">{row.fx_rate}</p></div>
                <div><p className="text-[#6b7280]">Lightning Invoice</p><p className="font-semibold break-all">{row.lightning_invoice || 'N/A'}</p></div>
                <div><p className="text-[#6b7280]">Lightning Hash</p><p className="font-semibold break-all">{row.lightning_hash || 'N/A'}</p></div>
              </div>
              <div>
                <p className="text-[#6b7280] text-sm mb-1">Voice Message URL</p>
                <p className="font-semibold text-sm break-all">{row.voice_message_url || 'No voice message attached'}</p>
              </div>
              <a href="/reports" className="inline-block text-[#f4a426] font-semibold">Back to History</a>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
