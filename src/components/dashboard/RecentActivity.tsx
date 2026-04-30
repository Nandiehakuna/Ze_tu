'use client';

import { motion } from 'framer-motion';
import type { Recipient, Transaction } from '@/types';

interface RecentActivityProps {
  transactions: Transaction[];
  recipients: Recipient[];
}

const statusColors = {
  settled: 'bg-[#22c55e]',
  delivered: 'bg-[#22c55e]',
  confirmed: 'bg-[#22c55e]',
  pending: 'bg-amber-400',
  default: 'bg-[#f4a426]',
};

function getRelativeTime(dateValue?: string) {
  if (!dateValue) return 'just now';
  const value = new Date(dateValue).getTime();
  const deltaSeconds = Math.max(0, Math.floor((Date.now() - value) / 1000));
  if (deltaSeconds < 60) return 'just now';
  if (deltaSeconds < 3600) return `${Math.floor(deltaSeconds / 60)} min ago`;
  if (deltaSeconds < 86400) return `${Math.floor(deltaSeconds / 3600)} hrs ago`;
  return `${Math.floor(deltaSeconds / 86400)} days ago`;
}

export default function RecentActivity({ transactions, recipients }: RecentActivityProps) {
  const recipientById = new Map(recipients.map((recipient) => [recipient.id, recipient]));

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border border-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Recent Activity</h3>

      {transactions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-[#6b7280]">
          No transactions yet. Your history will appear after your first transfer.
        </div>
      ) : (
      <motion.div className="space-y-4" layout>
        {transactions.map((tx, idx) => {
          const recipient = recipientById.get(tx.recipient_id);
          const recipientName = recipient?.name || 'Recipient';
          const relationship = recipient?.relationship || 'Transfer';
          const status = tx.status || 'pending';
          const statusColor = statusColors[status as keyof typeof statusColors] || statusColors.default;

          return (
          <motion.div
            key={tx.id}
            layout
            className="pb-4 border-b border-gray-100 last:border-0"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + idx * 0.05, layout: { duration: 0.25 } }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f4a426] to-[#c4820a] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {recipientName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1a1a1a]">{recipientName}</p>
                  <p className="text-xs text-[#6b7280]">
                    {relationship} • {getRelativeTime(tx.created_at)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#1a1a1a]">
                  {Math.round(tx.amount_kes || 0).toLocaleString()} KES
                </p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${statusColor} text-white`}>
                  {status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* AI Confirmation Tag */}
            {tx.ai_confirmed && tx.ai_confirmation_quote && (
              <div className="ml-11 mt-2 p-2 bg-gradient-to-r from-[#f4a426]/10 to-[#c4820a]/5 rounded-lg border border-[#f4a426]/20">
                <p className="text-xs font-semibold text-[#f4a426] mb-1">
                  AI CONFIRMED IN {(tx.ai_confirmation_language || 'ENGLISH').toUpperCase()}
                </p>
                <p className="text-xs text-[#6b7280] italic">
                  &quot;{tx.ai_confirmation_quote}&quot;
                </p>
              </div>
            )}
          </motion.div>
        );})}
      </motion.div>
      )}

      <a href="/reports" className="block w-full mt-4 py-2 text-center text-sm font-semibold text-[#f4a426] hover:bg-[#f4a426]/5 rounded-lg transition">
        View All
      </a>
    </motion.div>
  );
}
