'use client';

import { motion } from 'framer-motion';
import { buttonVariants } from '@/lib/animations';
import type { OnboardingData } from '@/types';

interface ConfirmationStepProps {
  loading: boolean;
  onSubmit: () => void;
  formData: OnboardingData;
}

export default function ConfirmationStep({
  loading,
  onSubmit,
  formData,
}: ConfirmationStepProps) {
  const summaryItems = [
    { label: 'Name', value: formData.full_name },
    { label: 'Phone', value: formData.phone },
    { label: 'Recipient', value: formData.recipient_name },
    { label: 'Recipient language', value: formData.recipient_language },
    { label: 'Country', value: formData.country },
    { label: 'Monthly amount', value: formData.monthly_amount ? `£${formData.monthly_amount}` : undefined },
    { label: 'Payment method', value: formData.payment_method },
  ];

  return (
    <motion.div className="space-y-6">
      {/* Celebration icon */}
      <motion.div
        className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#f4a426] to-[#c4820a] flex items-center justify-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <svg
          className="w-8 h-8 text-[#0D0D0D]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </motion.div>

      {/* Summary */}
      <div className="space-y-3 bg-[#1a1a1a] rounded-lg p-4">
        {summaryItems.map((item, index) => (
          item.value && (
            <motion.div
              key={index}
              className="flex justify-between items-center py-2 border-b border-[#333333] last:border-b-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="text-[#6b7280] text-sm">{item.label}</span>
              <span className="text-[#fafaf6] font-medium">{item.value}</span>
            </motion.div>
          )
        ))}
      </div>

      {/* Benefits callout */}
      <div className="bg-[#1a1a1a] rounded-lg p-4 space-y-3">
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <svg className="w-5 h-5 text-[#f4a426] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-[#fafaf6]">Your first £200 transfer is free</span>
        </motion.div>
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <svg className="w-5 h-5 text-[#f4a426] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-[#fafaf6]">Fast, secure transfers with real-time tracking</span>
        </motion.div>
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <svg className="w-5 h-5 text-[#f4a426] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-[#fafaf6]">Support in your language</span>
        </motion.div>
      </div>

      <motion.button
        onClick={onSubmit}
        disabled={loading}
        variants={buttonVariants}
        initial="idle"
        whileHover={!loading ? "hover" : "idle"}
        whileTap={!loading ? "tap" : "idle"}
        className="w-full bg-[#f4a426] text-[#0D0D0D] font-semibold py-3 rounded-lg hover:bg-[#c4820a] disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Setting up account...' : 'Go to Dashboard'}
      </motion.button>
    </motion.div>
  );
}
