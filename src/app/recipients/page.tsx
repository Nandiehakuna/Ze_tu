'use client';

import { useEffect, useState } from 'react';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { supabaseClient } from '@/lib/supabase';
import type { Recipient } from '@/types';

type FormState = {
  name: string;
  mpesa_number: string;
  relationship: string;
  language: string;
};

const initialForm: FormState = {
  name: '',
  mpesa_number: '',
  relationship: '',
  language: 'swahili',
};

export default function RecipientsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [senderId, setSenderId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  async function loadRecipients() {
    const client = supabaseClient();
    if (!client) return;
    const { data } = await client.from('recipients').select('*').eq('sender_id', senderId).order('created_at', { ascending: false });
    setRecipients((data ?? []) as Recipient[]);
  }

  useEffect(() => {
    async function load() {
      try {
        const client = supabaseClient();
        if (!client) {
          setError('Authentication unavailable.');
          setLoading(false);
          return;
        }
        const { data: sessionData } = await client.auth.getSession();
        const uid = sessionData?.session?.user?.id;
        if (!uid) {
          setError('No active session.');
          setLoading(false);
          return;
        }
        setSenderId(uid);
        const { data, error: qError } = await client
          .from('recipients')
          .select('*')
          .eq('sender_id', uid)
          .order('created_at', { ascending: false });
        if (qError) setError('Failed to load recipients.');
        setRecipients((data ?? []) as Recipient[]);
      } catch {
        setError('Failed to load recipients.');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  function startEdit(recipient: Recipient) {
    setEditingId(recipient.id);
    setForm({
      name: recipient.name,
      mpesa_number: recipient.mpesa_number,
      relationship: recipient.relationship || '',
      language: recipient.language || 'swahili',
    });
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!senderId || !form.name || !form.mpesa_number || saving) return;
    setSaving(true);
    setError(null);
    try {
      const client = supabaseClient();
      if (!client) throw new Error('Supabase unavailable');
      if (editingId) {
        const { error: updateError } = await client
          .from('recipients')
          .update({
            name: form.name,
            mpesa_number: form.mpesa_number,
            relationship: form.relationship || null,
            language: form.language,
          })
          .eq('id', editingId)
          .eq('sender_id', senderId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await client.from('recipients').insert([
          {
            sender_id: senderId,
            name: form.name,
            mpesa_number: form.mpesa_number,
            relationship: form.relationship || null,
            language: form.language,
            voice_method: form.language === 'dholuo' ? 'pre-recorded' : 'tts',
          },
        ]);
        if (insertError) throw insertError;
      }
      setForm(initialForm);
      setEditingId(null);
      await loadRecipients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save recipient.');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!senderId) return;
    const client = supabaseClient();
    if (!client) return;
    const { error: delError } = await client.from('recipients').delete().eq('id', id).eq('sender_id', senderId);
    if (delError) {
      setError('Failed to delete recipient.');
      return;
    }
    await loadRecipients();
  }

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      <DashboardNav />
      <main className="pt-20 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-6 h-fit">
            <h1 className="text-xl font-bold text-[#1a1a1a] mb-4">{editingId ? 'Edit Recipient' : 'Add Recipient'}</h1>
            <form onSubmit={onSave} className="space-y-4">
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Recipient name" className="w-full border border-gray-200 rounded-lg px-4 py-3" />
              <input value={form.mpesa_number} onChange={(e) => setForm((p) => ({ ...p, mpesa_number: e.target.value }))} placeholder="M-Pesa number" className="w-full border border-gray-200 rounded-lg px-4 py-3" />
              <input value={form.relationship} onChange={(e) => setForm((p) => ({ ...p, relationship: e.target.value }))} placeholder="Relationship (mum, sister...)" className="w-full border border-gray-200 rounded-lg px-4 py-3" />
              <select value={form.language} onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-3">
                <option value="swahili">Swahili</option>
                <option value="dholuo">Dholuo</option>
                <option value="english">English</option>
              </select>
              <button disabled={saving} className="w-full bg-gradient-to-r from-[#f4a426] to-[#c4820a] text-[#1a1a1a] py-3 rounded-lg font-bold disabled:opacity-50">
                {saving ? 'Saving...' : editingId ? 'Update Recipient' : 'Add Recipient'}
              </button>
              {editingId ? (
                <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); }} className="w-full border border-gray-200 py-3 rounded-lg font-semibold text-[#1a1a1a]">
                  Cancel Edit
                </button>
              ) : null}
            </form>
          </section>

          <section className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">Recipient Management</h2>
            {loading ? (
              <div className="animate-pulse h-64 rounded-lg bg-[#f9fafb]" />
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
            ) : recipients.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-[#6b7280]">
                No recipients yet. Add one using the form.
              </div>
            ) : (
              <div className="space-y-3">
                {recipients.map((recipient) => (
                  <div key={recipient.id} className="border border-gray-100 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#1a1a1a]">{recipient.name}</p>
                      <p className="text-sm text-[#6b7280]">{recipient.mpesa_number} · {recipient.language || 'swahili'}</p>
                      <p className="text-xs text-[#6b7280]">{recipient.relationship || 'Recipient'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(recipient)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold">Edit</button>
                      <button onClick={() => onDelete(recipient.id)} className="px-3 py-2 rounded-lg border border-red-200 text-red-700 text-sm font-semibold">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
