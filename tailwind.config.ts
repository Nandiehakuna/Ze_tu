import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'zetu-black': '#1a1a1a',
        'zetu-card': '#242424',
        'zetu-elevated': '#2e2e2e',
        'zetu-border': '#333333',
        'zetu-gold': '#f4a426',
        'zetu-gold-muted': '#c4820a',
        'zetu-cream': '#fafaf6',
        'zetu-muted': '#6b7280',
        'zetu-green': '#22c55e',
        'zetu-panel': '#2e2e2e',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  plugins: [],
};

export default config;
