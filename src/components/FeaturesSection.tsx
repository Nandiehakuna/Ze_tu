'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function FeaturesSection() {
  const router = useRouter();
  const rates = [
    {
      name: 'Traditional Banks',
      fee: '6-9%',
      speed: '3-5 days',
      description: 'Hidden fees, slow processing',
      highlight: false,
    },
    {
      name: 'Money Transfer Services',
      fee: '4-8%',
      speed: '1-2 days',
      description: 'Better but still expensive',
      highlight: false,
    },
    {
      name: 'Zetu',
      fee: '1%',
      speed: 'Minutes',
      description: 'Transparent. Fast. Fair.',
      highlight: true,
    },
  ];

  const features = [
    {
      title: 'Voice-First Design',
      description: 'No app required. WhatsApp. That\'s it.',
    },
    {
      title: 'Multi-Language Support',
      description: 'English, Swahili, Twi, Hausa, and more.',
    },
    {
      title: 'Real-Time Rates',
      description: 'Bitcoin rates, no markup. Ever.',
    },
    {
      title: 'Instant Settlement',
      description: 'Your family receives in local currency.',
    },
    {
      title: 'Mobile-First',
      description: 'Works on any phone. Smartphone or feature phone.',
    },
    {
      title: 'Transaction History',
      description: 'Full transparency. Every transfer recorded.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut'as const},
    },
  };

  return (
    <div className="w-full bg-[#1a1a1a] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Rates Comparison */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, margin: '-100px' }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#fafaf6] mb-4">
              The Real Cost of Sending Money Home
            </h2>
            <p className="text-[#6b7280] text-lg">
              Zetu vs. Everyone Else
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rates.map((rate, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: '-50px' }}
                className={`rounded-2xl p-8 border transition-all ${
                  rate.highlight
                    ? 'bg-gradient-to-br from-[#f4a426]/20 to-[#c4820a]/10 border-[#f4a426] shadow-lg shadow-[#f4a426]/20'
                    : 'bg-[#242424] border-[#333333]'
                }`}
              >
                {rate.highlight && (
                  <div className="absolute top-0 right-0 bg-[#f4a426] text-[#1a1a1a] px-4 py-1 rounded-bl-xl text-xs font-bold">
                    ZETU
                  </div>
                )}

                <h3 className="text-xl font-bold text-[#fafaf6] mb-2">
                  {rate.name}
                </h3>
                <p className="text-[#6b7280] text-sm mb-6">
                  {rate.description}
                </p>

                <div className="space-y-4 pt-6 border-t border-[#333333]">
                  <div>
                    <p className="text-[#6b7280] text-sm mb-1">Fee</p>
                    <p className={`text-3xl font-bold ${
                      rate.highlight ? 'text-[#f4a426]' : 'text-[#fafaf6]'
                    }`}>
                      {rate.fee}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6b7280] text-sm mb-1">Speed</p>
                    <p className="text-lg font-semibold text-[#fafaf6]">
                      {rate.speed}
                    </p>
                  </div>
                </div>

                {rate.highlight && (
                  <button onClick={() => router.push('/onboarding')} className="w-full mt-8 bg-[#f4a426] text-[#1a1a1a] py-3 rounded-xl font-semibold hover:bg-[#c4820a] transition">
                    Get Started
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, margin: '-100px' }}
          className="border-t border-[#333333] pt-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#fafaf6] mb-12 text-center">
            What Makes Zetu Different
          </h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-[#242424] border border-[#333333] rounded-2xl p-6 hover:border-[#f4a426] transition-all group"
              >
                <div className="w-10 h-10 bg-[#f4a426] rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-[#f4a426]/50 transition-all">
                  <svg
                    className="w-6 h-6 text-[#1a1a1a]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#fafaf6] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#6b7280]">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, margin: '-100px' }}
          className="mt-20 bg-gradient-to-r from-[#242424] to-[#2e2e2e] border border-[#333333] rounded-2xl p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-[#f4a426] mb-2">95%</p>
              <p className="text-[#6b7280]">Less than traditional methods</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-[#f4a426] mb-2">1min</p>
              <p className="text-[#6b7280]">Average transfer time</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-[#f4a426] mb-2">30+</p>
              <p className="text-[#6b7280]">Countries supported</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, margin: '-100px' }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-[#fafaf6] mb-6">
            Ready to send money differently?
          </h3>
          <p className="text-[#6b7280] mb-8 text-lg">
            Your first £200 transfer is free. No credit card required.
          </p>
          <button onClick={() => router.push('/onboarding')} className="bg-[#f4a426] text-[#1a1a1a] px-8 py-4 rounded-xl font-semibold hover:bg-[#c4820a] transition text-lg">
            Get Started with Zetu
          </button>
        </motion.div>
      </div>
    </div>
  );
}
