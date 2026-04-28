'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabaseClient } from '@/lib/supabase';
import DashboardNav from '@/components/dashboard/DashboardNav';
import BalanceCard from '@/components/dashboard/BalanceCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ImpactCard from '@/components/dashboard/ImpactCard';
import YourPeople from '@/components/dashboard/YourPeople';
import QuickSend from '@/components/dashboard/QuickSend';
import SavedRecipients from '@/components/dashboard/SavedRecipients';
import AIInsight from '@/components/dashboard/AIInsight';

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
      <div className="min-h-screen bg-[#F0F4FF] flex items-center justify-center">
        <div className="text-[#1a1a1a]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      <DashboardNav />
      
      <main className="pt-20 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Balance & Activity */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <BalanceCard />
            <RecentActivity />
          </motion.div>

          {/* Center Column - Impact & People */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ImpactCard />
            <YourPeople />
          </motion.div>

          {/* Right Column - Quick Actions & AI */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <QuickSend />
            <SavedRecipients />
            <AIInsight />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
