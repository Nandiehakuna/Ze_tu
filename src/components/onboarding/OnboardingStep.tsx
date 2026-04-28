'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AIMessage from './AIMessage';
import PhoneInput from './steps/PhoneInput';
import OTPInput from './steps/OTPInput';
import TextInput from './steps/TextInput';
import SelectInput from './steps/SelectInput';
import CurrencyInput from './steps/CurrencyInput';
import RecipientInput from './steps/RecipientInput';
import ConfirmationStep from './steps/ConfirmationStep';
import { OnboardingData } from '@/lib/supabase';

interface OnboardingStepProps {
  step: any;
  currentStep: number;
  totalSteps: number;
  formData: OnboardingData;
  loading: boolean;
  error: string | null;
  onPhoneSubmit: (phone: string) => void;
  onOTPSubmit: (otp: string) => void;
  onFieldSubmit: (field: string, value: any) => void;
  onRecipientSubmit: (data: { name: string; phone: string }) => void;
  onConfirmation: () => void;
}

export default function OnboardingStep({
  step,
  currentStep,
  totalSteps,
  formData,
  loading,
  error,
  onPhoneSubmit,
  onOTPSubmit,
  onFieldSubmit,
  onRecipientSubmit,
  onConfirmation,
}: OnboardingStepProps) {
  const [inputValue, setInputValue] = useState('');

  const cardGradient =
    'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(244, 164, 38, 0.10) 0%, rgba(244, 164, 38, 0.03) 40%, #0D0D0D 70%)';

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Progress bar */}
      <div className="mb-8 flex gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <motion.div
            key={i}
            className="h-1 flex-1 rounded-full bg-[#1a1a1a]"
            animate={{
              background: i < currentStep ? '#f4a426' : '#1a1a1a',
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Card with radial gradient background */}
      <motion.div
        className="rounded-3xl border border-[#333333] p-8 backdrop-blur-md"
        style={{
          background: cardGradient,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* AI Message */}
        <div className="mb-8">
          <AIMessage message={step.ai_message} />
        </div>

        {/* Step title and description */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#fafaf6] mb-2">
            {step.title}
          </h2>
          <p className="text-[#6b7280]">{step.description}</p>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Step-specific input */}
        <div className="space-y-4">
          {step.type === 'phone' && (
            <PhoneInput
              loading={loading}
              onSubmit={onPhoneSubmit}
              value={inputValue}
              onChange={setInputValue}
            />
          )}

          {step.type === 'otp' && (
            <OTPInput
              loading={loading}
              onSubmit={onOTPSubmit}
              value={inputValue}
              onChange={setInputValue}
            />
          )}

          {step.type === 'text' && (
            <TextInput
              loading={loading}
              onSubmit={(value) => onFieldSubmit(step.field, value)}
              value={inputValue}
              onChange={setInputValue}
            />
          )}

          {step.type === 'select' && (
            <SelectInput
              options={step.options}
              onSubmit={(value) => onFieldSubmit(step.field, value)}
              loading={loading}
            />
          )}

          {step.type === 'currency' && (
            <CurrencyInput
              loading={loading}
              onSubmit={(value) => onFieldSubmit(step.field, value)}
              value={inputValue}
              onChange={setInputValue}
            />
          )}

          {step.type === 'recipient' && (
            <RecipientInput
              loading={loading}
              onSubmit={onRecipientSubmit}
            />
          )}

          {step.type === 'confirmation' && (
            <ConfirmationStep
              loading={loading}
              onSubmit={onConfirmation}
              formData={formData}
            />
          )}
        </div>

        {/* Step counter */}
        <div className="mt-8 text-center text-[#6b7280] text-sm">
          Step {currentStep} of {totalSteps}
        </div>
      </motion.div>
    </motion.div>
  );
}
