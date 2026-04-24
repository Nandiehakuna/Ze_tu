'use client';

export const dynamic = 'force-dynamic';

import Hero from '@/components/Hero';
import ProblemSection from '@/components/ProblemSection';
import HowItWorks from '@/components/HowItWorks';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
