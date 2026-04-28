'use client';

import { motion } from 'framer-motion';
import { generateWordVariants, wordVariants } from '@/lib/animations';

interface AIMessageProps {
  message: string;
}

export default function AIMessage({ message }: AIMessageProps) {
  const words = generateWordVariants(message);

  return (
    <div className="flex items-start gap-3 mb-6">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#f4a426] to-[#c4820a] flex items-center justify-center mt-1">
        <svg
          className="w-5 h-5 text-[#0D0D0D]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 1C5.03 1 1 5.03 1 10s4.03 9 9 9 9-4.03 9-9S14.97 1 10 1zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm3-10H9v4l3.25 1.94.75-1.23-2-1.19V7z" />
        </svg>
      </div>

      {/* Message text with word-by-word animation */}
      <div className="flex-1 flex flex-wrap gap-1">
        {words.map((item, index) => (
          <motion.span
            key={index}
            custom={item.delay}
            variants={wordVariants}
            initial="hidden"
            animate="visible"
            className="text-[#fafaf6] text-sm leading-relaxed"
          >
            {item.word}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
