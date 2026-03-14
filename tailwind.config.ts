import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'IBM Plex Sans Arabic', 'sans-serif'],
      },
      colors: {
        cream: '#F5F5F5',
        'sandy-gold': '#E0E0E0',
        teal: '#00DE51',
        terracotta: '#00DE51',
        dark: '#1A1A1A',
      },
    },
  },
  plugins: [],
};
export default config;
