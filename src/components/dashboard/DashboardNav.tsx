'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function DashboardNav() {
  const router = useRouter();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => router.push('/')} className="text-2xl font-bold text-[#1a1a1a]">
          Zetu
        </button>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="/dashboard" className="text-sm font-medium text-[#f4a426] border-b-2 border-[#f4a426]">
            Dashboard
          </a>
          <a href="/send" className="text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a] transition">
            Send Money
          </a>
          <a href="/recipients" className="text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a] transition">
            Recipients
          </a>
          <a href="/reports" className="text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a] transition">
            Reports
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <svg className="w-5 h-5 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f4a426] to-[#c4820a] flex items-center justify-center text-white font-semibold text-sm">
            U
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
