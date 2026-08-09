import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ff5a1f",
          light: "#ff8a54",
          dark: "#e0430f",
          soft: "#2a1b12",
        },
        violet: {
          DEFAULT: "#7c5cff",
          soft: "#221c3a",
        },
        night: {
          DEFAULT: "#0a0a0c",
          soft: "#131316",
          alt: "#1a1a1e",
          border: "#232326",
        },
      },
    },
  },
  plugins: [],
};

export default config;
