/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark "OLED" smart-home palette (semantic tokens)
        bg: "#0F172A",          // page background (deep navy)
        surface: "#1E293B",     // card base (used with opacity for glass)
        surface2: "#273449",    // raised elements (inputs, knobs)
        border: "#334155",      // hairline borders
        foreground: "#F8FAFC",  // primary text
        muted: "#94A3B8",       // secondary text
        accent: "#22C55E",      // ON / active / primary (status green)
        "accent-soft": "#16A34A",
        danger: "#EF4444",      // OFF / destructive
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 30px rgba(0, 0, 0, 0.35)",
        "glow-accent": "0 0 18px rgba(34, 197, 94, 0.45)",
      },
      keyframes: {
        "card-in": {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.35)" },
          "50%": { boxShadow: "0 0 16px 2px rgba(34, 197, 94, 0.35)" },
        },
      },
      animation: {
        "card-in": "card-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
