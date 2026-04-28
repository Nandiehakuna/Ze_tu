'use client';

import { motion } from 'framer-motion';

interface Transaction {
  id: string;
  recipient: string;
  type: string;
  time: string;
  amount: string;
  status: 'sent' | 'delivered' | 'pending';
  aiConfirmation?: {
    language: string;
    quote: string;
  };
  aiTag?: string;
}

const transactions: Transaction[] = [
  {
    id: '1',
    recipient: 'Mama Grace',
    type: 'Personal',
    time: '2 hours ago',
    amount: '50,000',
    status: 'delivered',
    aiConfirmation: {
      language: 'KISWAHILI',
      quote: 'Asante sana mwanangu, nimepata pesa yako'
    }
  },
  {
    id: '2',
    recipient: 'Brother Juma',
    type: 'Medical',
    time: '1 day ago',
    amount: '35,500',
    status: 'delivered',
    aiTag: 'AI RECURRING MONTHLY'
  },
  {
    id: '3',
    recipient: 'Aunt Zainab',
    type: 'School fees',
    time: '3 days ago',
    amount: '75,000',
    status: 'delivered'
  },
];

const statusColors = {
  sent: 'bg-[#f4a426]',
  delivered: 'bg-[#22c55e]',
  pending: 'bg-amber-400'
};

const statusText = {
  sent: 'Sent',
  delivered: 'Delivered',
  pending: 'Pending'
};

export default function RecentActivity() {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border border-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {transactions.map((tx, idx) => (
          <motion.div
            key={tx.id}
            className="pb-4 border-b border-gray-100 last:border-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + idx * 0.05 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f4a426] to-[#c4820a] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {tx.recipient.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1a1a1a]">{tx.recipient}</p>
                  <p className="text-xs text-[#6b7280]">{tx.type} • {tx.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#1a1a1a]">{tx.amount} KES</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${statusColors[tx.status]} text-white`}>
                  {statusText[tx.status]}
                </span>
              </div>
            </div>

            {/* AI Confirmation Tag */}
            {tx.aiConfirmation && (
              <div className="ml-11 mt-2 p-2 bg-gradient-to-r from-[#f4a426]/10 to-[#c4820a]/5 rounded-lg border border-[#f4a426]/20">
                <p className="text-xs font-semibold text-[#f4a426] mb-1">
                  AI CONFIRMED IN {tx.aiConfirmation.language}
                </p>
                <p className="text-xs text-[#6b7280] italic">
                  "{tx.aiConfirmation.quote}"
                </p>
              </div>
            )}

            {/* AI Recurring Tag */}
            {tx.aiTag && (
              <div className="ml-11 mt-2 inline-block">
                <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {tx.aiTag}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm font-semibold text-[#f4a426] hover:bg-[#f4a426]/5 rounded-lg transition">
        View All
      </button>
    </motion.div>
  );
}
