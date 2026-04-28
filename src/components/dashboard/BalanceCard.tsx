'use client';

import { motion } from 'framer-motion';

export default function BalanceCard() {
  const balance = 1250; // GBP
  const balanceKES = 187500; // Approximate KES

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border border-gray-100"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <p className="text-xs font-semibold text-[#f4a426] uppercase tracking-wide mb-3">
        Total Balance
      </p>
      <div className="mb-4">
        <h2 className="text-4xl font-bold text-[#1a1a1a] font-poppins">£{balance.toLocaleString()}</h2>
        <p className="text-sm text-[#6b7280] mt-2">
          {balanceKES.toLocaleString()} KES
        </p>
      </div>
      
      <button className="w-full bg-gradient-to-r from-[#f4a426] to-[#c4820a] text-[#1a1a1a] py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition">
        Add Funds
      </button>
    </motion.div>
  );
}
