'use client';

import { motion } from 'framer-motion';
import type { Transaction } from '@/types';

interface ImpactCardProps {
  transactions: Transaction[];
}

export default function ImpactCard({ transactions }: ImpactCardProps) {
  const now = new Date();
  const sentThisMonth = transactions
    .filter((tx) => {
      if (!tx.created_at) return false;
      const date = new Date(tx.created_at);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, tx) => sum + (tx.amount_kes || 0), 0);
  const monthlyGoal = 500000; // Demo target baseline
  const percentageReached = (sentThisMonth / monthlyGoal) * 100;
  const transactionCount = transactions.length;
  const countries = new Set(
    transactions
      .map((tx) => tx.recipient_id)
      .filter(Boolean)
  ).size;

  return (
    <motion.div
      className="bg-[#1E1B4B] rounded-2xl p-8 text-white"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <p className="text-xs font-semibold text-[#f4a426] uppercase tracking-wide mb-3">
        Sent This Month
      </p>
      
      <div className="mb-6">
        <h2 className="text-5xl font-bold font-poppins mb-3">
          {(sentThisMonth / 1000).toFixed(0)}K
        </h2>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-2xl font-bold">{transactionCount}</p>
            <p className="text-xs text-gray-300">transactions</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{countries}</p>
            <p className="text-xs text-gray-300">countries</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-gray-300">Monthly Goal</p>
          <p className="text-xs font-semibold">{percentageReached.toFixed(0)}%</p>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#f4a426] to-[#c4820a]"
            initial={{ width: 0 }}
            animate={{ width: `${percentageReached}%` }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-300">
        {monthlyGoal - sentThisMonth > 0 
          ? `${((monthlyGoal - sentThisMonth) / 1000).toFixed(0)}K away from your goal`
          : 'Goal reached! 🎉'
        }
      </p>
    </motion.div>
  );
}
