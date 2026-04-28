'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabaseClient } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const client = supabaseClient();
      if (!client) {
        router.push('/onboarding');
        return;
      }
      
      const { data } = await client.auth.getSession();
      
      if (!data?.session) {
        router.push('/onboarding');
        return;
      }

      setUser(data.session.user);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-[#fafaf6]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#fafaf6] mb-2">Welcome to Zetu</h1>
          <p className="text-[#6b7280]">You're all set up and ready to send money home</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-[#f4a426] to-[#c4820a] rounded-2xl p-8 text-left text-[#0D0D0D] hover:shadow-lg transition"
          >
            <div className="text-3xl font-bold mb-2">£200</div>
            <div className="text-sm opacity-80">Your free first transfer</div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#242424] border border-[#333333] rounded-2xl p-8 text-left text-[#fafaf6] hover:border-[#f4a426] transition"
          >
            <div className="text-2xl font-bold mb-2">Send Money</div>
            <div className="text-sm text-[#6b7280]">Start your first transfer</div>
          </motion.button>
        </div>

        {/* Recent activity */}
        <div className="bg-[#242424] border border-[#333333] rounded-2xl p-8">
          <h2 className="text-xl font-bold text-[#fafaf6] mb-6">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#f4a426] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#0D0D0D]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-[#fafaf6] font-medium">Account verified</p>
                <p className="text-sm text-[#6b7280]">Your account is fully verified and ready</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#f4a426] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#0D0D0D]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-[#fafaf6] font-medium">Profile completed</p>
                <p className="text-sm text-[#6b7280]">Your profile information is saved</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#f4a426] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#0D0D0D]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-[#fafaf6] font-medium">Ready to transfer</p>
                <p className="text-sm text-[#6b7280]">You can now send money home immediately</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
