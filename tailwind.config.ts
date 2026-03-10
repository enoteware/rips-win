import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        logo: {
          start: "#00ae03",
          mid: "#b2fc15",
          end: "#f2fed7",
        },
        "background-dark": "#0a120a",
        "surface-dark": "#142614",
        "border-dark": "#1e3a1e",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        podium: {
          2: "var(--podium-2)",
          3: "var(--podium-3)",
        },
        social: {
          discord: "var(--social-discord)",
          instagram: "var(--social-instagram)",
        },
      },
      borderRadius: {
        lg: "0px",
        md: "0px",
        sm: "0px",
      },
      backgroundImage: {
        "logo-gradient": "var(--logo-gradient)",
        "social-instagram": "var(--social-instagram)",
      },
      boxShadow: {
        hard: "var(--shadow-hard)",
        "hard-lg": "var(--shadow-hard-lg)",
        glow: "var(--glow-primary)",
        "glow-lg": "var(--glow-lg)",
        "glow-logo": "var(--glow-logo)",
      },
      dropShadow: {
        "glow-logo": "var(--glow-logo)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        display: ["var(--font-display)", "var(--font-sans)"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
