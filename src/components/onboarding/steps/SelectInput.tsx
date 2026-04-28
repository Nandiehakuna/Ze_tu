'use client';

import { motion } from 'framer-motion';

interface SelectInputProps {
  options: string[];
  onSubmit: (value: string) => void;
  loading: boolean;
}

export default function SelectInput({
  options,
  onSubmit,
  loading,
}: SelectInputProps) {
  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <motion.button
          key={index}
          onClick={() => !loading && onSubmit(option)}
          disabled={loading}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          whileHover={!loading ? { x: 4, scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className="w-full text-left bg-[#1a1a1a] border border-[#333333] rounded-lg px-4 py-3 text-[#fafaf6] hover:border-[#f4a426] hover:bg-[#1a1a1a]/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {option}
        </motion.button>
      ))}
    </div>
  );
}
