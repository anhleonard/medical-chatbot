import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        transparent: "transparent",
        white: "#fff",
        logo: "#29ABE2",
        grey: {
          c900: "#4F4F4F",
          c800: "#5F5F5F",
          c700: "#6F6F6F",
          c600: "#7F7F7F",
          c500: "#8F8F8F",
          c400: "#9F9F9F",
          c300: "#AFAFAF",
          c200: "#CFCFCF",
          c100: "#EFEFEF",
          c50: "#F7F7F7",
        },
        primary: {
          c900: "#0883B7",
          c800: "#1A94C3",
          c700: "#2DA5CF",
          c600: "#40B5DB",
          c500: "#53C5E7",
          c400: "#66D4F3",
          c300: "#79E3FF",
          c200: "#A3EDFF",
          c100: "#CDF6FF",
          c50: "#E6FAFF",
          c10: "#F2F9FF",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        support: {
          c900: "#B31919",
          c800: "#C21E1E",
          c700: "#CF2929",
          c600: "#E03030",
          c500: "#F13232",
          c400: "#F64343",
          c300: "#FB5C5C",
          c200: "#FF7676",
          c100: "#FF9191",
          c50: "#FFB2B2",
          c10: "#FFEEEE",
        },
        button: {
          c10: "#E5F3FF",
          c50: "#DBEEFF",
          c100: "#C6E2FF",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        righteous: ["var(--font-righteous)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
} satisfies Config;

export default config;
