import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#FAFAFA',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B6B6B',
        'border': '#E0E0E0',
        'accent': '#404040',
        'link': '#2C2C2C',
        'link-hover': '#000000',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      fontSize: {
        'h1': '3rem',
        'h2': '1.75rem',
        'h3': '1.5rem',
        'base': '1.125rem',
        'small': '0.875rem',
      },
      maxWidth: {
        'content': '800px',
        'reading': '65ch',
      },
    },
  },
  plugins: [],
};

export default config;
