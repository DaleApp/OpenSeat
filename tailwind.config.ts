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
        brand: {
          DEFAULT: "#0D9488",
          light: "#E1F5EE",
          dark: "#085041",
        },
        text: {
          primary: "#1E293B",
          secondary: "#64748B",
          tertiary: "#94A3B8",
        },
        surface: {
          primary: "#FFFFFF",
          secondary: "#F1F5F9",
        },
        border: {
          DEFAULT: "#E2E8F0",
          focus: "#0D9488",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        pill: "20px",
      },
      spacing: {
        "nav-height": "64px",
        "safe-bottom": "16px",
      },
    },
  },
  plugins: [],
};
export default config;
