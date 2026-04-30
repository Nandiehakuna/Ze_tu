'use client';

import { useEffect, useMemo, useState } from 'react';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { supabaseClient } from '@/lib/supabase';
import type { Transaction } from '@/types';

type Row = Transaction & {
  recipients?: { name?: string; relationship?: string } | null;
};

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function load() {
      try {
        const client = supabaseClient();
        if (!client) {
          setError('Authentication unavailable.');
          setLoading(false);
          return;
        }
        const { data: sessionData } = await client.auth.getSession();
        const senderId = sessionData?.session?.user?.id;
        if (!senderId) {
          setError('No active session.');
          setLoading(false);
          return;
        }
        const { data, error: queryError } = await client
          .from('transactions')
          .select('*, recipients(name, relationship)')
          .eq('sender_id', senderId)
          .order('created_at', { ascending: false });
        if (queryError) {
          setError('Failed to load transaction history.');
        } else {
          setRows((data ?? []) as Row[]);
        }
      } catch {
        setError('Failed to load transaction history.');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return rows;
    return rows.filter((row) => (row.status || '').toLowerCase() === statusFilter);
  }, [rows, statusFilter]);

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      <DashboardNav />
      <main className="pt-20 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a1a]">Transaction History</h1>
              <p className="text-sm text-[#6b7280]">All remittance transactions and delivery states.</p>
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 bg-white"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="settled">Settled</option>
              <option value="delivered">Delivered</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-64" />
          ) : error ? (
            <div className="bg-white rounded-2xl border border-red-200 p-6 text-red-700">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-6 text-[#6b7280]">
              No transactions found for this filter.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#f9fafb] text-[#6b7280]">
                    <tr>
                      <th className="text-left px-4 py-3">Recipient</th>
                      <th className="text-left px-4 py-3">Amount</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-left px-4 py-3">Date</th>
                      <th className="text-left px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <tr key={row.id} className="border-t border-gray-100">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#1a1a1a]">{row.recipients?.name || 'Recipient'}</p>
                          <p className="text-xs text-[#6b7280]">{row.recipients?.relationship || 'Transfer'}</p>
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#1a1a1a]">£{row.amount_gbp.toFixed(2)}</td>
                        <td className="px-4 py-3 uppercase text-xs font-semibold text-[#6b7280]">{row.status || 'pending'}</td>
                        <td className="px-4 py-3 text-[#6b7280]">{new Date(row.created_at || '').toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <a href={`/reports/${row.id}`} className="text-[#f4a426] font-semibold">View detail</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
