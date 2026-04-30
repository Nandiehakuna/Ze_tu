'use client';

import { motion } from 'framer-motion';
import { buttonVariants } from '@/lib/animations';

interface OTPInputProps {
  loading: boolean;
  onSubmit: (otp: string) => void;
  value: string;
  onChange: (value: string) => void;
}

export default function OTPInput({
  loading,
  onSubmit,
  value,
  onChange,
}: OTPInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().length === 6) {
      onSubmit(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-[#6b7280]">Verification code</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
          disabled={loading}
          className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg px-4 py-3 text-center text-2xl tracking-widest text-[#fafaf6] placeholder-[#6b7280] focus:outline-none focus:border-[#f4a426] focus:ring-2 focus:ring-[#f4a426]/20 disabled:opacity-50 transition font-mono"
        />
      </div>

      <p className="text-xs text-[#6b7280]">
        Enter the 6-digit code sent to your phone
      </p>

      <motion.button
        type="submit"
        disabled={loading || value.length !== 6}
        variants={buttonVariants}
        initial="idle"
        whileHover={!loading ? "hover" : "idle"}
        whileTap={!loading ? "tap" : "idle"}
        className="w-full bg-[#f4a426] text-[#0D0D0D] font-semibold py-3 rounded-lg hover:bg-[#c4820a] disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Verifying...' : 'Verify'}
      </motion.button>
    </form>
  );
}
