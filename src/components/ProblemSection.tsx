'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';

export default function ProblemSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const [displayValue, setDisplayValue] = useState(1450);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : 'light';

  // Transform scroll progress to values
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest < 0.3) {
        setDisplayValue(1450);
        setAnimationPhase(0);
      } else if (latest < 0.5) {
        setDisplayValue(Math.round(1450 - (latest - 0.3) / 0.2 * 650)); // £14.50 to £8
        setAnimationPhase(1);
      } else if (latest < 0.7) {
        setDisplayValue(Math.round(800 - (latest - 0.5) / 0.2 * 400)); // £8 to £4
        setAnimationPhase(2);
      } else if (latest < 0.9) {
        setDisplayValue(Math.round(400 - (latest - 0.7) / 0.2 * 200)); // £4 to £2
        setAnimationPhase(3);
      } else {
        setDisplayValue(200);
        setAnimationPhase(4);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  const waveformToLightning = animationPhase >= 4 ? 1 : animationPhase * 0.25;

  const formatValue = (val: number) => {
    if (val >= 1000) return `£${(val / 100).toFixed(2)}`;
    if (val >= 100) return `£${(val / 100).toFixed(2)}`;
    return `£${(val / 100).toFixed(2)}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-h-screen py-20 px-4 overflow-hidden transition-colors duration-300 ${
        currentTheme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-[#fafaf6]'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full flex flex-col items-center justify-center">
        {/* Main Number - Animated Counter */}
        <motion.div style={{ opacity }} className="text-center space-y-8">
          <div className="text-9xl md:text-10xl font-bold text-[#f4a426] font-sans tabular-nums">
            {formatValue(displayValue)}
          </div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl md:text-2xl text-[#6b7280] max-w-2xl mx-auto"
          >
            That's what you lose sending £200 home. Every time.
          </motion.p>

          {/* "This is Zetu" revelation */}
          {animationPhase >= 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="pt-12"
            >
              <p className={`text-4xl md:text-5xl font-bold transition-colors duration-300 ${
                currentTheme === 'dark' ? 'text-[#fafaf6]' : 'text-[#1a1a1a]'
              }`}>
                This is Zetu.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Waveform to Lightning Animation */}
        <motion.div
          style={{
            opacity,
            marginTop: '80px',
          }}
          className="relative w-full max-w-md h-32 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 400 160"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Waveform Path - morphs into lightning */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Waveform (visible when animationPhase < 4) */}
            {animationPhase < 4 && (
              <motion.path
                d="M 0 80 Q 30 30 60 80 T 120 80 T 180 80 T 240 80 T 300 80 T 360 80 T 420 80"
                stroke="#f4a426"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                initial={{ opacity: 1, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 1.5 }}
              />
            )}

            {/* Lightning Bolt - emerges as animationPhase increases */}
            {animationPhase >= 3 && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: Math.max(0, animationPhase - 2.5) }}
                transition={{ duration: 0.6 }}
                filter="url(#glow)"
              >
                {/* Main bolt */}
                <path
                  d="M 200 20 L 180 70 L 200 70 L 160 160 M 200 20 L 220 70 L 200 70 L 240 160"
                  stroke="#f4a426"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Glow effect */}
                <circle cx="200" cy="20" r="8" fill="#f4a426" opacity="0.6" />
                <circle cx="200" cy="20" r="16" fill="#f4a426" opacity="0.2" />
              </motion.g>
            )}
          </svg>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <p className="text-[#6b7280] text-sm text-center">Scroll to reveal</p>
        <div className="flex justify-center mt-2">
          <svg className="w-5 h-5 text-[#f4a426]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
