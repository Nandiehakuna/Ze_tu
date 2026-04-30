'use client';

import { motion } from 'framer-motion';
import { buttonVariants } from '@/lib/animations';

interface TextInputProps {
  loading: boolean;
  onSubmit: (value: string) => void;
  value: string;
  onChange: (value: string) => void;
}

export default function TextInput({
  loading,
  onSubmit,
  value,
  onChange,
}: TextInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().length > 0) {
      onSubmit(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Enter your response"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          autoFocus
          className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg px-4 py-3 text-[#fafaf6] placeholder-[#6b7280] focus:outline-none focus:border-[#f4a426] focus:ring-2 focus:ring-[#f4a426]/20 disabled:opacity-50 transition"
        />
      </div>

      <motion.button
        type="submit"
        disabled={loading || value.trim().length === 0}
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
