import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F4F1",
        paperLight: "#F7F7F4",
        ink: "#1F1F1D",
        mist: "#D8D8D2",
        steel: "#6F7F8F",
        mutedRed: "#9B5C5F"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      boxShadow: {
        soft: "0 24px 70px rgba(31, 31, 29, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
