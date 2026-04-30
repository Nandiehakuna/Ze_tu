'use client';

import { motion } from 'framer-motion';
import type { Recipient } from '@/types';

interface SavedRecipientsProps {
  recipients: Recipient[];
}

export default function SavedRecipients({ recipients }: SavedRecipientsProps) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border border-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Saved Recipients</h3>

      {recipients.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-[#6b7280]">
          No recipients saved yet.
        </div>
      ) : (
      <div className="space-y-3">
        {recipients.map((recipient, idx) => (
          <motion.div
            key={recipient.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + idx * 0.05 }}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-xl">👤</span>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a]">{recipient.name}</p>
                <p className="text-xs text-[#6b7280]">{recipient.mpesa_number}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5 text-[#f4a426]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </motion.div>
        ))}
      </div>
      )}

      <a href="/recipients" className="block w-full mt-4 py-2 text-center text-sm font-semibold text-[#f4a426] hover:bg-[#f4a426]/5 rounded-lg transition">
        Manage Recipients
      </a>
    </motion.div>
  );
}
