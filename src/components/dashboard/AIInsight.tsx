'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const insights = [
  {
    title: 'Optimal Sending Time',
    message: 'Send in the next 2 hours to get real-time delivery rates. After 3 PM UTC, rates may be higher.'
  },
  {
    title: 'Exchange Rate Alert',
    message: 'GBP/KES is 5% higher today. This is a great time to send to Kenya if you were planning to.'
  },
  {
    title: 'Your Pattern',
    message: 'You usually send on Fridays. Today is Thursday - want to send early for weekend delivery?'
  },
  {
    title: 'Recipient Confirmation',
    message: 'Grace confirmed receipt of your last 3 transfers in Kiswahili. The personal touch means a lot.'
  },
];

interface AIInsightProps {
  welcomeMessage?: string;
}

export default function AIInsight({ welcomeMessage = '' }: AIInsightProps) {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const insight =
    currentInsight === 0
      ? {
          title: 'Welcome',
          message:
            welcomeMessage ||
            'Welcome back. I am watching rates and your family activity so your next send is faster.',
        }
      : insights[currentInsight];

  return (
    <motion.div
      className="bg-gradient-to-br from-[#f4a426]/10 to-[#c4820a]/5 rounded-2xl p-6 border border-[#f4a426]/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <motion.div
          className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f4a426] to-[#c4820a] flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          animate={{ scale: isProcessing ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 1.5, repeat: isProcessing ? Infinity : 0 }}
        >
          Z
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-xs font-semibold text-[#f4a426] uppercase tracking-wide mb-1">
            Zetu is thinking{isProcessing && '...'}
          </p>
          
          <motion.div
            key={currentInsight}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <h4 className="text-sm font-bold text-[#1a1a1a] mb-1">
              {insight.title}
            </h4>
            <p className="text-xs text-[#6b7280] leading-relaxed">
              {insight.message}
            </p>
          </motion.div>

          {/* Animated dots */}
          <div className="flex items-center gap-1 mt-3">
            {[0, 1, 2].map((dot) => (
              <motion.div
                key={dot}
                className="w-1.5 h-1.5 rounded-full bg-[#f4a426]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  delay: dot * 0.2,
                  duration: 1.4,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
