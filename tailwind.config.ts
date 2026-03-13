import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFFBF5',
        'sandy-gold': '#D4A574',
        teal: '#0891B2',
        terracotta: '#C2410C',
        dark: '#1C1917',
      },
    },
  },
  plugins: [],
};
export default config;
