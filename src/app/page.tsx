'use client';

import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('@/components/Hero'), { ssr: false });
const ProblemSection = dynamic(() => import('@/components/ProblemSection'), { ssr: false });
const HowItWorks = dynamic(() => import('@/components/HowItWorks'), { ssr: false });
const FeaturesSection = dynamic(() => import('@/components/FeaturesSection'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

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
