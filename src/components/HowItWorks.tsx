'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';
import { useState, useEffect } from 'react';

export default function HowItWorks() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : 'light';
  const steps = [
    {
      number: '01',
      title: 'Say It',
      description: 'Use WhatsApp voice to tell Zetu exactly what you want to send. No downloads, no apps.',
      emoji: '🎤',
    },
    {
      number: '02',
      title: 'We Get It',
      description: 'Our AI understands your voice, your language, your intent. Instant confirmation.',
      emoji: '⚡',
    },
    {
      number: '03',
      title: 'Money Moves',
      description: 'Bitcoin settlement in seconds. Your family gets local currency in minutes.',
      emoji: '🚀',
    },
    {
      number: '04',
      title: 'You Save',
      description: '1% fees instead of 6-9%. That means more money reaches home.',
      emoji: '💰',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <div className={`w-full transition-colors duration-300 py-20 px-4 ${
      currentTheme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-[#fafaf6]'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors duration-300 ${
            currentTheme === 'dark' ? 'text-[#fafaf6]' : 'text-[#1a1a1a]'
          }`}>
            How It Works
          </h2>
          <p className="text-[#6b7280] text-lg max-w-2xl mx-auto">
            Four simple steps. One powerful idea. Money home on your terms.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`rounded-2xl p-8 hover:border-[#f4a426] transition-all duration-300 hover:shadow-lg hover:shadow-[#f4a426]/10 ${
                currentTheme === 'dark'
                  ? 'bg-[#242424] border border-[#333333]'
                  : 'bg-white border border-[#e8e4dc]'
              }`}
            >
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-[#f4a426] font-sans">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-16 bg-gradient-to-b from-[#f4a426] to-transparent mt-4"></div>
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
                    currentTheme === 'dark' ? 'text-[#fafaf6]' : 'text-[#1a1a1a]'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-[#6b7280] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Visual Storytelling Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16"
        >
          {/* Left: Narrative */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`rounded-2xl p-8 transition-colors duration-300 ${
              currentTheme === 'dark'
                ? 'bg-[#242424] border border-[#333333]'
                : 'bg-white border border-[#e8e4dc]'
            }`}>
              <p className="text-[#f4a426] text-sm font-semibold uppercase tracking-widest mb-4">
                The Story Behind Zetu
              </p>
              <h3 className={`text-3xl font-bold mb-6 transition-colors duration-300 ${
                currentTheme === 'dark' ? 'text-[#fafaf6]' : 'text-[#1a1a1a]'
              }`}>
                Remittances the way your family talks.
              </h3>
              <p className="text-[#6b7280] text-lg leading-relaxed mb-4">
                Every day, millions of diaspora members send money home. They use WhatsApp to check in with family. They speak to transfer. Yet remittance apps still demand endless taps, verification codes, and fees that would make your grandmother faint.
              </p>
              <p className="text-[#6b7280] text-lg leading-relaxed">
                Zetu bridges that gap. Your voice. Your language. Your currency. One message. Done.
              </p>
            </div>

            {/* Device Mockup - Smartphone */}
            <div className={`rounded-2xl p-6 flex items-center justify-center min-h-80 transition-colors duration-300 ${
              currentTheme === 'dark'
                ? 'bg-[#242424] border border-[#333333]'
                : 'bg-white border border-[#e8e4dc]'
            }`}>
              <div className="relative w-full max-w-xs">
                <div className="bg-gradient-to-b from-[#333333] to-[#242424] rounded-3xl overflow-hidden border-8 border-[#1a1a1a] shadow-2xl">
                  {/* Phone Screen */}
                  <div className="bg-[#2e2e2e] aspect-video flex items-center justify-center relative">
                    <div className="space-y-4 w-full px-4">
                      <div className="bg-[#1a1a1a] rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center border-4 border-[#f4a426]">
                        <div className="w-4 h-4 bg-[#f4a426] rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-[#fafaf6] text-sm text-center font-medium">
                        Listening...
                      </p>
                      <p className="text-[#6b7280] text-xs text-center">
                        "Send £200 to Mama"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Features */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className={`rounded-2xl p-6 hover:border-[#f4a426] transition-all ${
                currentTheme === 'dark'
                  ? 'bg-[#242424] border border-[#333333]'
                  : 'bg-white border border-[#e8e4dc]'
              }`}
            >
              <div className="text-3xl mb-3">🎯</div>
              <h4 className={`font-bold mb-2 transition-colors duration-300 ${
                currentTheme === 'dark' ? 'text-[#fafaf6]' : 'text-[#1a1a1a]'
              }`}>Intent-Driven</h4>
              <p className="text-sm text-[#6b7280]">
                AI understands context. Not just voice commands.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`rounded-2xl p-6 hover:border-[#f4a426] transition-all ${
                currentTheme === 'dark'
                  ? 'bg-[#242424] border border-[#333333]'
                  : 'bg-white border border-[#e8e4dc]'
              }`}
            >
              <div className="text-3xl mb-3">🔒</div>
              <h4 className={`font-bold mb-2 transition-colors duration-300 ${
                currentTheme === 'dark' ? 'text-[#fafaf6]' : 'text-[#1a1a1a]'
              }`}>Secure</h4>
              <p className="text-sm text-[#6b7280]">
                Bitcoin settlement. No middlemen. No delays.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`rounded-2xl p-6 hover:border-[#f4a426] transition-all ${
                currentTheme === 'dark'
                  ? 'bg-[#242424] border border-[#333333]'
                  : 'bg-white border border-[#e8e4dc]'
              }`}
            >
              <div className="text-3xl mb-3">🌍</div>
              <h4 className={`font-bold mb-2 transition-colors duration-300 ${
                currentTheme === 'dark' ? 'text-[#fafaf6]' : 'text-[#1a1a1a]'
              }`}>Borderless</h4>
              <p className="text-sm text-[#6b7280]">
                Works for any diaspora. Any receiving country.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={`rounded-2xl p-6 hover:border-[#f4a426] transition-all ${
                currentTheme === 'dark'
                  ? 'bg-[#242424] border border-[#333333]'
                  : 'bg-white border border-[#e8e4dc]'
              }`}
            >
              <div className="text-3xl mb-3">⚡</div>
              <h4 className={`font-bold mb-2 transition-colors duration-300 ${
                currentTheme === 'dark' ? 'text-[#fafaf6]' : 'text-[#1a1a1a]'
              }`}>Instant</h4>
              <p className="text-sm text-[#6b7280]">
                Settlement in seconds. Local currency in minutes.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
