'use client';

import { motion } from 'framer-motion';
import { buttonVariants } from '@/lib/animations';

interface CurrencyInputProps {
  loading: boolean;
  onSubmit: (value: number) => void;
  value: string;
  onChange: (value: string) => void;
}

export default function CurrencyInput({
  loading,
  onSubmit,
  value,
  onChange,
}: CurrencyInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(value);
    if (amount > 0) {
      onSubmit(amount);
    }
  };

  const commonAmounts = [100, 200, 500, 1000];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl text-[#f4a426] font-semibold">£</span>
          <input
            type="number"
            placeholder="0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={loading}
            autoFocus
            min="1"
            step="0.01"
            className="flex-1 bg-[#1a1a1a] border border-[#333333] rounded-lg px-4 py-3 text-[#fafaf6] placeholder-[#6b7280] focus:outline-none focus:border-[#f4a426] focus:ring-2 focus:ring-[#f4a426]/20 disabled:opacity-50 transition text-lg"
          />
        </div>
      </div>

      {/* Quick select buttons */}
      <div className="grid grid-cols-4 gap-2">
        {commonAmounts.map((amount) => (
          <motion.button
            key={amount}
            type="button"
            onClick={() => onChange(amount.toString())}
            disabled={loading}
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
            className="bg-[#1a1a1a] border border-[#333333] rounded-lg px-3 py-2 text-sm text-[#f4a426] hover:border-[#f4a426] disabled:opacity-50 transition"
          >
            £{amount}
          </motion.button>
        ))}
      </div>

      <motion.button
        type="submit"
        disabled={loading || parseFloat(value) <= 0}
        variants={buttonVariants}
        initial="idle"
        whileHover={!loading ? "hover" : "idle"}
        whileTap={!loading ? "tap" : "idle"}
        className="w-full bg-[#f4a426] text-[#0D0D0D] font-semibold py-3 rounded-lg hover:bg-[#c4820a] disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Processing...' : 'Continue'}
      </motion.button>
    </form>
  );
}
