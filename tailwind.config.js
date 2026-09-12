/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#05070B",
          card: "#0B0F17",
          glass: "rgba(11, 15, 23, 0.85)",
          border: "#1A2234",
          cyan: "#00F0FF",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
          purple: "#A855F7",
          text: "#94A3B8",
          heading: "#F8FAFC"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 30px rgba(0, 240, 255, 0.2)',
        'emerald-glow': '0 0 30px rgba(16, 185, 129, 0.2)',
        'amber-glow': '0 0 30px rgba(245, 158, 11, 0.2)',
        'rose-glow': '0 0 30px rgba(244, 63, 94, 0.2)',
        'purple-glow': '0 0 30px rgba(168, 85, 247, 0.2)',
        'glass-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 10s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
