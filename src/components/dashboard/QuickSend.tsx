'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function QuickSend() {
  const [amount, setAmount] = useState(50);

  const quickAmounts = [30, 50, 75, 100, 150, 200];

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border border-gray-100"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Quick Send</h3>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#6b7280] mb-2 uppercase">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-lg font-bold text-[#1a1a1a]">£</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f4a426] focus:ring-2 focus:ring-[#f4a426]/20"
            placeholder="0"
          />
        </div>
      </div>

      {/* Currency Selector */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#6b7280] mb-2 uppercase">
          Send to
        </label>
        <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f4a426] focus:ring-2 focus:ring-[#f4a426]/20">
          <option>Kenya (KES)</option>
          <option>Uganda (UGX)</option>
          <option>Tanzania (TZS)</option>
          <option>Nigeria (NGN)</option>
        </select>
      </div>

      {/* Quick Amount Buttons */}
      <div className="mb-6 grid grid-cols-3 gap-2">
        {quickAmounts.map((qa) => (
          <button
            key={qa}
            onClick={() => setAmount(qa)}
            className={`py-2 rounded-lg text-xs font-semibold transition ${
              amount === qa
                ? 'bg-[#f4a426] text-[#1a1a1a]'
                : 'bg-gray-100 text-[#1a1a1a] hover:bg-gray-200'
            }`}
          >
            £{qa}
          </button>
        ))}
      </div>

      {/* CTA Button */}
      <button className="w-full bg-gradient-to-r from-[#f4a426] to-[#c4820a] text-[#1a1a1a] py-3 rounded-lg font-bold hover:shadow-lg transition">
        Send Money
      </button>
    </motion.div>
  );
}
