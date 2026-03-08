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
        primary: {
          DEFAULT: "#165DFF",
          50: "#E8F0FF",
          100: "#D1E0FF",
          200: "#A3C1FF",
          300: "#75A2FF",
          400: "#4783FF",
          500: "#165DFF",
          600: "#0047D9",
          700: "#0035A6",
          800: "#002473",
          900: "#001240",
        },
        secondary: {
          DEFAULT: "#36CFC9",
          50: "#E6FFFE",
          100: "#B3FFFF",
          200: "#66FFFF",
          300: "#36CFC9",
          400: "#00B2AC",
          500: "#008D88",
          600: "#006864",
          700: "#004340",
          800: "#001E1D",
          900: "#000000",
        },
        accent: {
          DEFAULT: "#FF7D00",
          50: "#FFF7E6",
          100: "#FFE5CC",
          200: "#FFC299",
          300: "#FF9F66",
          400: "#FF7D00",
          500: "#E66A00",
          600: "#CC5700",
          700: "#994000",
          800: "#662A00",
          900: "#331500",
        },
        neutral: {
          100: "#F8F9FA",
          200: "#E9ECEF",
          300: "#DEE2E6",
          400: "#CED4DA",
          500: "#ADB5BD",
          600: "#6C757D",
          700: "#495057",
          800: "#343A40",
          900: "#212529",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        "hover-scale": "hoverScale 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        hoverScale: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.05)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
export default config;
