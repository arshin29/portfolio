import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#09101a",
          900: "#0d1726", // core atmospheric deep navy background
          850: "#101d30",
          800: "#15253d",
          750: "#1a2c48",
          700: "#213657",
          600: "#2d4974",
          500: "#4167a1",
          400: "#608cd0",
          300: "#8fb3ec",
          200: "#bfd4f6",
          100: "#e2ecfa",
          50: "#f3f7fd",
        },
        skyText: {
          ink: "#f6f8fd",
          secondary: "#a7b8cf",
          muted: "#6e829d",
        },
        glass: {
          surface: "rgba(255, 255, 255, 0.07)",
          surfaceHover: "rgba(255, 255, 255, 0.12)",
          border: "rgba(255, 255, 255, 0.13)",
          borderSubtle: "rgba(255, 255, 255, 0.07)",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "var(--font-geist-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        serif: [
          "var(--font-instrument-serif)",
          "Newsreader",
          "Georgia",
          "serif",
        ],
        handwriting: [
          "var(--font-kalam)",
          "Caveat",
          "cursive",
        ],
      },
      maxWidth: {
        narrow: "692px",
        content: "740px",
        page: "860px",
      },
      letterSpacing: {
        tightest: "-0.045em",
        tighter: "-0.035em",
      },
    },
  },
  plugins: [],
};

export default config;
