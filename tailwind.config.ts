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
        display: ["var(--font-josefin)", "sans-serif"],
        accent: ["var(--font-yellowtail)", "cursive"],
        script: ["var(--font-yellowtail)", "cursive"],
        sans: ["var(--font-josefin)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
