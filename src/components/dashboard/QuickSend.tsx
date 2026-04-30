'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { calculateTransfer, formatKES } from '@/lib/fx';
import type { Recipient } from '@/types';

interface QuickSendProps {
  recipients: Recipient[];
  defaultRecipientId?: string;
  initialRate: number;
  senderId: string;
}

export default function QuickSend({ recipients, defaultRecipientId, initialRate, senderId }: QuickSendProps) {
  const [amount, setAmount] = useState(50);
  const [rate] = useState(initialRate);
  const [selectedRecipientId, setSelectedRecipientId] = useState(defaultRecipientId || '');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [lastTransactionId, setLastTransactionId] = useState<string | null>(null);

  const quickAmounts = [30, 50, 75, 100, 150, 200];
  const transfer = useMemo(() => calculateTransfer(amount, rate), [amount, rate]);
  const selectedRecipient =
    recipients.find((recipient) => recipient.id === selectedRecipientId) || recipients[0];

  useEffect(() => {
    if (!selectedRecipientId && recipients[0]?.id) {
      setSelectedRecipientId(recipients[0].id);
    }
  }, [recipients, selectedRecipientId]);

  async function handleSend() {
    if (!selectedRecipient?.id || amount <= 0 || isSending) return;
    setIsSending(true);
    setStatus('');
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: selectedRecipient.id,
          amountGBP: amount,
          senderId,
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error || 'Transfer failed');
      }
      const payload = (await response.json().catch(() => ({}))) as { transaction?: { id?: string } };
      const txId = payload.transaction?.id || null;
      setLastTransactionId(txId);
      setStatus('Transfer created. Waiting for settlement...');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transfer failed';
      setStatus(message);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border border-gray-100"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Quick Send</h3>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#6b7280] mb-2 uppercase">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-lg font-bold text-[#1a1a1a]">£</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
            className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f4a426] focus:ring-2 focus:ring-[#f4a426]/20"
            placeholder="0"
          />
        </div>
        <p className="mt-2 text-xs text-[#6b7280]">
          {`${formatKES(transfer.amountKES)} at ${rate.toFixed(2)} GBP/KES`}
        </p>
      </div>

      {/* Currency Selector */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#6b7280] mb-2 uppercase">
          Send to
        </label>
        <select
          disabled={recipients.length === 0}
          value={selectedRecipient?.id || ''}
          onChange={(event) => setSelectedRecipientId(event.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f4a426] focus:ring-2 focus:ring-[#f4a426]/20"
        >
          {recipients.map((recipient) => (
            <option key={recipient.id} value={recipient.id}>
              {recipient.name} ({recipient.mpesa_number})
            </option>
          ))}
        </select>
        {selectedRecipient && (
          <p className="mt-2 text-xs text-[#6b7280]">
            Most recent recipient: {selectedRecipient.name}
          </p>
        )}
      </div>

      {/* Quick Amount Buttons */}
      <div className="mb-6 grid grid-cols-3 gap-2">
        {quickAmounts.map((qa) => (
          <button
            key={qa}
            onClick={() => setAmount(qa)}
            className={`py-2 rounded-lg text-xs font-semibold transition ${
              amount === qa
                ? 'bg-[#f4a426] text-[#1a1a1a]'
                : 'bg-gray-100 text-[#1a1a1a] hover:bg-gray-200'
            }`}
          >
            £{qa}
          </button>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={handleSend}
        disabled={!selectedRecipient?.id || amount <= 0 || isSending}
        className="w-full bg-gradient-to-r from-[#f4a426] to-[#c4820a] text-[#1a1a1a] py-3 rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50"
      >
        {isSending ? 'Sending...' : 'Send Money'}
      </button>
      {status ? <p className="mt-2 text-xs text-[#6b7280]">{status}</p> : null}
      {lastTransactionId ? (
        <a href={`/send/confirm/${lastTransactionId}`} className="mt-2 inline-block text-xs font-semibold text-[#f4a426]">
          Open transfer confirmation
        </a>
      ) : null}
    </motion.div>
  );
}
