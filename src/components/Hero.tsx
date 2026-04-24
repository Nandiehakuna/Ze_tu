'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';

export default function Hero() {
  const { theme, toggleTheme } = useTheme();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="relative w-full min-h-screen pt-20 pb-20 px-4">
      {/* Premium spotlight glow - centered on headline */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[#f4a426] via-[#f4a426]/5 to-transparent opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#f4a426] to-transparent opacity-10 blur-2xl rounded-full"></div>
      </div>
      {/* Header Navigation */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-[#333333] bg-[#1a1a1a]/95 backdrop-blur"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold text-[#f4a426]">ZETU</div>
          <nav className="hidden md:flex items-center gap-12">
            <a href="#" className="text-[#fafaf6] text-sm hover:text-[#f4a426] transition border-b-2 border-[#f4a426]">
              HERITAGE
            </a>
            <a href="#" className="text-[#6b7280] text-sm hover:text-[#fafaf6] transition">
              ARCHIVES
            </a>
            <a href="#" className="text-[#6b7280] text-sm hover:text-[#fafaf6] transition">
              VOICES
            </a>
            <a href="#" className="text-[#6b7280] text-sm hover:text-[#fafaf6] transition">
              LEGACY
            </a>
          </nav>
          <button className="bg-[#f4a426] text-[#1a1a1a] px-6 py-2 rounded-lg font-semibold hover:bg-[#c4820a] transition text-sm">
            Record Your Story
          </button>
        </div>
      </motion.header>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto pt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.p
              variants={itemVariants}
              className="text-[#f4a426] text-sm font-semibold tracking-widest uppercase"
            >
              The Voice Thread
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold text-[#fafaf6] leading-tight"
            >
              Send money home in your language, with your voice.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-[#6b7280] italic"
            >
              "Tuma pesa nyumbani"
            </motion.p>

            {/* Waveform SVG */}
            <motion.div
              variants={itemVariants}
              className="py-8"
            >
              <svg
                viewBox="0 0 400 100"
                className="w-full h-24"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0 50 Q 25 20 50 50 T 100 50 T 150 50 T 200 50 T 250 50 T 300 50 T 350 50 T 400 50"
                  stroke="#f4a426"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              variants={itemVariants}
              className="pt-4"
            >
              <button className="relative group bg-[#f4a426] text-[#1a1a1a] px-8 py-4 rounded-xl font-semibold hover:bg-[#c4820a] transition text-lg w-full sm:w-auto border-4 border-transparent hover:border-[#f4a426] hover:bg-[#1a1a1a] hover:text-[#f4a426]">
                Send your first £200 free
              </button>
              <p className="text-[#6b7280] text-sm mt-3">
                No app download. Works on WhatsApp.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Content - Chat Interface Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-[#242424] rounded-3xl border border-[#333333] p-6 shadow-2xl">
              {/* Chat Header */}
              <div className="flex items-center gap-3 pb-6 border-b border-[#333333]">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f4a426] to-[#c4820a] rounded-full flex items-center justify-center text-[#1a1a1a] font-bold">
                  Z
                </div>
                <div>
                  <p className="text-[#fafaf6] font-semibold text-sm">Zetu Voice Transfer</p>
                  <p className="text-[#22c55e] text-xs">ONLINE NOW</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 mt-6">
                <div className="flex justify-end">
                  <div className="bg-[#f4a426] bg-opacity-20 text-[#fafaf6] rounded-2xl px-4 py-3 max-w-xs text-sm">
                    Got it! Sending £200** to Mama's MPESA wallet in Nairobi.
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-[#2e2e2e] text-[#fafaf6] rounded-2xl px-4 py-3 max-w-xs text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-1 bg-[#22c55e] rounded-full"></div>
                      <span className="text-xs text-[#6b7280]">0:12</span>
                    </div>
                    <p className="font-semibold text-sm mb-2">Recipient</p>
                    <p className="text-[#fafaf6]">Rosa K.</p>
                    <p className="text-[#f4a426] font-semibold mt-2">£200.00</p>
                  </div>
                </div>

                <div className="text-center text-[#6b7280] text-xs mt-6">
                  Transfer Complete. The Voice Thread has reached home. ✨
                </div>

                <div className="text-center mt-8 pb-4">
                  <p className="text-[#fafaf6] text-sm mb-4">
                    Say "Send £200 to Mama"
                  </p>
                  <button className="bg-[#22c55e] rounded-full w-12 h-12 flex items-center justify-center mx-auto hover:bg-[#16a34a] transition">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 5V3a1 1 0 01-1-1z" />
                      <path d="M15 16.004a1 1 0 001.304-.995c-.133-1.555-.909-2.989-2.134-3.975a1 1 0 10-1.367 1.464c.878.833 1.466 1.987 1.546 3.242a1 1 0 00.651.264z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
