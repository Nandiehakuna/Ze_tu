'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { buttonVariants } from '@/lib/animations';

interface RecipientInputProps {
  loading: boolean;
  onSubmit: (data: { name: string; phone: string }) => void;
}

export default function RecipientInput({
  loading,
  onSubmit,
}: RecipientInputProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      onSubmit({ name, phone });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-[#6b7280]">Recipient name</label>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          autoFocus
          className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg px-4 py-3 text-[#fafaf6] placeholder-[#6b7280] focus:outline-none focus:border-[#f4a426] focus:ring-2 focus:ring-[#f4a426]/20 disabled:opacity-50 transition"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-[#6b7280]">Their phone number</label>
        <input
          type="tel"
          placeholder="+254 712 345 678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
          className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg px-4 py-3 text-[#fafaf6] placeholder-[#6b7280] focus:outline-none focus:border-[#f4a426] focus:ring-2 focus:ring-[#f4a426]/20 disabled:opacity-50 transition"
        />
      </div>

      <motion.button
        type="submit"
        disabled={loading || !name.trim() || !phone.trim()}
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
