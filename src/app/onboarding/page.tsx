'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import OnboardingStep from '@/components/onboarding/OnboardingStep';
import { cardTransitionVariants } from '@/lib/animations';
import { registerAndSignInWithPhone, saveOnboardingData } from '@/lib/supabase.client';
import type { OnboardingData } from '@/types';

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Phone number',
    description: 'Let\'s get started. What\'s your phone number?',
    type: 'phone',
    ai_message: 'Welcome to Zetu! We\'re excited to help you send money home seamlessly. Let\'s start with your phone number so we can verify your account.',
  },
  {
    id: 3,
    title: 'Your name',
    description: 'What should we call you?',
    type: 'text',
    field: 'full_name',
    ai_message: 'Thanks for verifying! Now, what\'s your full name? We want to make sure we send money to the right person.',
  },
  {
    id: 4,
    title: 'Where are you sending to?',
    description: 'Select your recipient\'s country',
    type: 'select',
    field: 'country',
    options: [
      'Kenya',
      'Uganda',
      'Tanzania',
      'Rwanda',
      'Ghana',
      'Nigeria',
      'Senegal',
      'South Africa',
      'Ethiopia',
      'Zambia',
    ],
    ai_message: 'Great! Now, which country is your recipient in? We support transfers across Africa.',
  },
  {
    id: 5,
    title: 'Purpose of transfer',
    description: 'What is this money for?',
    type: 'select',
    field: 'purpose',
    options: [
      'Family support',
      'Education',
      'Healthcare',
      'Business',
      'Emergency',
      'Savings',
      'Other',
    ],
    ai_message: 'Understanding the purpose helps us serve you better. What\'s this transfer for?',
  },
  {
    id: 6,
    title: 'Monthly transfer amount',
    description: 'How much do you typically send per month?',
    type: 'currency',
    field: 'monthly_amount',
    ai_message: 'This helps us understand your needs and provide the best rates. What\'s your typical monthly amount?',
  },
  {
    id: 7,
    title: 'Recipient details',
    description: 'Who are we sending to?',
    type: 'recipient',
    field: 'recipient_name',
    ai_message: 'We need to know who the money is going to. What\'s your recipient\'s name?',
  },
  {
    id: 8,
    title: 'Recipient language',
    description: 'Which language should we use when calling them?',
    type: 'select',
    field: 'recipient_language',
    options: ['Swahili', 'Dholuo', 'English'],
    ai_message: 'Which language should Zetu use when calling your recipient after settlement?',
  },
  {
    id: 9,
    title: 'How they receive',
    description: 'How should they get the money?',
    type: 'select',
    field: 'payment_method',
    options: [
      'Mobile money (M-Pesa, AirtelMoney, etc)',
      'Bank transfer',
      'Cash pickup',
      'Wallet',
    ],
    ai_message: 'Perfect! How would they prefer to receive the money? We support multiple payment methods.',
  },
  {
    id: 10,
    title: 'You\'re all set!',
    description: 'Your onboarding is complete',
    type: 'confirmation',
    ai_message: 'Congratulations! You\'re ready to send money home with Zetu. Your first transfer of £200 is free. Let\'s go to your dashboard!',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = ONBOARDING_STEPS[currentStep];

  const handlePhoneSubmit = async (phone: string) => {
    setLoading(true);
    setError(null);

    // create or upsert users table entry via server API and register an auth account
    const registerResult = await registerAndSignInWithPhone(phone);

    setLoading(false);

    if (registerResult.success) {
      setFormData({ ...formData, phone });
      // Move directly to the name step (previously OTP was step 2)
      setCurrentStep(1);
    } else {
      setError(registerResult.error || 'An error occurred');
    }
  };

  const handleFieldSubmit = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setCurrentStep(currentStep + 1);
  };

  const handleRecipientSubmit = (data: { name: string; phone: string }) => {
    setFormData({
      ...formData,
      recipient_name: data.name,
      recipient_phone: data.phone,
    });
    setCurrentStep(currentStep + 1);
  };

  const handleConfirmation = async () => {
    setLoading(true);
    setError(null);

    const result = await saveOnboardingData(formData);

    if (result.success) {
      try {
        const rateResponse = await fetch('/api/fx');
        const ratePayload = (await rateResponse.json().catch(() => ({}))) as { rate?: number };
        const rate = typeof ratePayload.rate === 'number' ? ratePayload.rate : 166;

        const welcomeResponse = await fetch('/api/claude-welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.full_name,
            recipientName: formData.recipient_name,
            recipientLanguage: formData.recipient_language || 'Swahili',
            country: formData.country,
            rate,
          }),
        });

        const welcomePayload = (await welcomeResponse.json().catch(() => ({}))) as { message?: string };
        if (welcomePayload.message) {
          localStorage.setItem('zetu_welcome_message', welcomePayload.message);
        }
      } catch {
        // Continue to dashboard even if welcome generation fails.
      }

      setLoading(false);
      // Navigate to dashboard
      router.push('/dashboard');
    } else {
      setLoading(false);
      setError(result.error || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      {/* Background radial gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#1a1a1a] to-[#0D0D0D]"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`step-${currentStep}`}
            variants={cardTransitionVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <OnboardingStep
              step={step}
              currentStep={currentStep + 1}
              totalSteps={ONBOARDING_STEPS.length}
              formData={formData}
              loading={loading}
              error={error}
              onPhoneSubmit={handlePhoneSubmit}
              onFieldSubmit={handleFieldSubmit}
              onRecipientSubmit={handleRecipientSubmit}
              onConfirmation={handleConfirmation}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
