'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabaseClient } from '@/lib/supabase.client';
import DashboardNav from '@/components/dashboard/DashboardNav';
import BalanceCard from '@/components/dashboard/BalanceCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ImpactCard from '@/components/dashboard/ImpactCard';
import YourPeople from '@/components/dashboard/YourPeople';
import QuickSend from '@/components/dashboard/QuickSend';
import SavedRecipients from '@/components/dashboard/SavedRecipients';
import AIInsight from '@/components/dashboard/AIInsight';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import type { Recipient, Transaction, User } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rate, setRate] = useState<number>(166);
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const client = supabaseClient();
      if (!client) {
        router.push('/onboarding');
        return;
      }

      const { data, error } = await client.auth.getSession();
      if (error || !data?.session) {
        router.push('/onboarding');
        return;
      }

      const phoneFromStorage =
        localStorage.getItem('zetu_phone') || localStorage.getItem('onboarding_phone');
      const phoneFromSession = data.session.user.phone ?? null;
      const lookupPhone = phoneFromStorage || phoneFromSession;

      let appUser: User | null = null;
      if (lookupPhone) {
        const { data: byPhone } = await client.from('users').select('*').eq('phone', lookupPhone).single();
        appUser = byPhone as User | null;
      }

      if (!appUser) {
        const { data: byId } = await client.from('users').select('*').eq('id', data.session.user.id).single();
        appUser = byId as User | null;
      }

      if (!appUser) {
        router.push('/onboarding');
        return;
      }

      setUser(appUser);

      const [recipientsRes, txRes, fxRes] = await Promise.all([
        client.from('recipients').select('*').eq('sender_id', appUser.id).order('created_at', { ascending: false }),
        client
          .from('transactions')
          .select('*, recipients(name, relationship)')
          .eq('sender_id', appUser.id)
          .order('created_at', { ascending: false })
          .limit(10),
        fetch('/api/fx').then(async (response) => {
          if (!response.ok) return { rate: 166 };
          return (await response.json()) as { rate?: number };
        }),
      ]);

      setRecipients((recipientsRes.data ?? []) as Recipient[]);
      setTransactions((txRes.data ?? []) as Transaction[]);
      setRate(typeof fxRes.rate === 'number' ? fxRes.rate : 166);
      if (recipientsRes.error || txRes.error) {
        setError('Failed to load some dashboard data. Please refresh.');
      }

      const storedWelcome = localStorage.getItem('zetu_welcome_message')?.trim() || '';
      setWelcomeMessage(storedWelcome);

      const channel = client
        .channel(`dashboard-transactions-${appUser.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
            filter: `sender_id=eq.${appUser.id}`,
          },
          async (payload) => {
            if (payload.eventType === 'INSERT' && payload.new) {
              const inserted = payload.new as Transaction;
              setTransactions((prev) => [inserted, ...prev].slice(0, 10));
              return;
            }

            if (payload.eventType === 'UPDATE' && payload.new) {
              const updated = payload.new as Transaction;
              setTransactions((prev) =>
                prev.map((tx) => (tx.id === updated.id ? { ...tx, ...updated } : tx))
              );
            }
          }
        )
        .subscribe();

      setLoading(false);

      return () => {
        client.removeChannel(channel);
      };
    };

    let cleanup: (() => void) | undefined;
    loadDashboard().then((fn) => {
      cleanup = fn;
    }).catch(() => {
      setError('Failed to load dashboard.');
      setLoading(false);
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [router]);

  const mostRecentRecipientId = transactions[0]?.recipient_id || recipients[0]?.id;

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      <DashboardNav />
      
      <main className="pt-20 px-4 md:px-8 pb-8">
        {error ? (
          <div className="max-w-7xl mx-auto mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Balance & Activity */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <BalanceCard transactions={transactions} />
            <RecentActivity transactions={transactions} recipients={recipients} />
          </motion.div>

          {/* Center Column - Impact & People */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ImpactCard transactions={transactions} />
            <YourPeople recipients={recipients} transactions={transactions} />
          </motion.div>

          {/* Right Column - Quick Actions & AI */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <QuickSend
              initialRate={rate}
              recipients={recipients}
              defaultRecipientId={mostRecentRecipientId}
              senderId={user?.id || ''}
            />
            <SavedRecipients recipients={recipients} />
            <AIInsight welcomeMessage={welcomeMessage} />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
