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
        'bg-dark': '#1a1a1a',
        'card-dark': '#242424',
        'elevated': '#2e2e2e',
        'gold-primary': '#f4a426',
        'gold-muted': '#c4820a',
        'text-primary': '#fafaf6',
        'text-muted': '#6b7280',
        'success': '#22c55e',
        'border-dark': '#333333',
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
