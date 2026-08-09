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
          light: "#ff7a45",
          dark: "#e0430f",
          soft: "#2a1b12",
        },
        night: {
          DEFAULT: "#0b0b0f",
          soft: "#151519",
          alt: "#1c1c22",
          border: "#2a2a32",
          bordersoft: "#232329",
        },
      },
      fontFamily: {
        display: [
          "Helvetica Neue",
          "Arial Black",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
