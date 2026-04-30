'use client';

import { motion } from 'framer-motion';
import type { Recipient, Transaction } from '@/types';

interface YourPeopleProps {
  recipients: Recipient[];
  transactions: Transaction[];
}

export default function YourPeople({ recipients, transactions }: YourPeopleProps) {
  const latestByRecipient = new Map<string, Transaction>();
  for (const transaction of transactions) {
    if (!latestByRecipient.has(transaction.recipient_id)) {
      latestByRecipient.set(transaction.recipient_id, transaction);
    }
  }

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border border-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Your People</h3>
      
      {recipients.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-[#6b7280]">
          Add your first recipient to build your family hub.
        </div>
      ) : (
      <div className="space-y-3">
        {recipients.map((person, idx) => {
          const latest = latestByRecipient.get(person.id);
          const lastSent = latest?.amount_gbp ? `£${latest.amount_gbp}` : '—';
          return (
          <motion.div
            key={person.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + idx * 0.05 }}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f4a426] to-[#c4820a] flex items-center justify-center text-white font-semibold">
                {person.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a]">{person.name}</p>
                <p className="text-xs text-[#6b7280]">{person.relationship || 'Recipient'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#1a1a1a]">Last sent</p>
              <p className="text-xs text-[#6b7280]">{lastSent}</p>
            </div>
          </motion.div>
        );})}
      </div>
      )}

      <a href="/recipients" className="block w-full mt-4 py-2 text-center text-sm font-semibold text-[#f4a426] hover:bg-[#f4a426]/5 rounded-lg transition">
        Add Person
      </a>
    </motion.div>
  );
}
