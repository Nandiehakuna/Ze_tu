'use client';

import { useEffect, useState } from 'react';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { supabaseClient } from '@/lib/supabase';
import type { User } from '@/types';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    async function load() {
      try {
        const client = supabaseClient();
        if (!client) {
          setError('Authentication unavailable.');
          return;
        }
        const { data: sessionData } = await client.auth.getSession();
        const uid = sessionData?.session?.user?.id;
        if (!uid) {
          setError('No active session.');
          return;
        }
        const { data, error: queryError } = await client.from('users').select('*').eq('id', uid).single();
        if (queryError || !data) {
          setError('Failed to load profile.');
          return;
        }
        const row = data as User;
        setUser(row);
        setName(row.name || '');
        setLanguage(row.language || 'english');
      } catch {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!user || saving) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const client = supabaseClient();
      if (!client) throw new Error('Supabase unavailable');
      const { error: updateError } = await client
        .from('users')
        .update({ name: name || null, language })
        .eq('id', user.id);
      if (updateError) throw updateError;
      setSuccess('Profile updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      <DashboardNav />
      <main className="pt-20 px-4 md:px-8 pb-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Settings & Profile</h1>
          <p className="text-sm text-[#6b7280] mb-6">Manage your sender profile and language preferences.</p>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-56" />
          ) : error ? (
            <div className="bg-white rounded-2xl border border-red-200 p-6 text-red-700">{error}</div>
          ) : (
            <form onSubmit={onSave} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#6b7280] mb-2">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#6b7280] mb-2">Phone</label>
                <input
                  value={user?.phone || ''}
                  readOnly
                  className="w-full border border-gray-100 bg-[#f9fafb] rounded-lg px-4 py-3 text-[#6b7280]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#6b7280] mb-2">Preferred Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3"
                >
                  <option value="english">English</option>
                  <option value="swahili">Swahili</option>
                  <option value="dholuo">Dholuo</option>
                </select>
              </div>
              {success ? <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div> : null}
              <button disabled={saving} className="w-full bg-gradient-to-r from-[#f4a426] to-[#c4820a] text-[#1a1a1a] py-3 rounded-lg font-bold disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
