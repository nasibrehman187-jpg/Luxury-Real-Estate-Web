/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neoma: {
          black: '#0B0B0B',
          dark: '#121212',
          surface: '#1A1A1A',
          card: '#222222',
          gold: '#D4AF37',
          'gold-light': '#F3E5AB',
          bronze: '#9A7B1C',
          ivory: '#F5F5F0',
          emerald: '#0F8A6C',
          'emerald-light': '#1CC29A',
          gray: {
            100: '#E5E5E5',
            300: '#A3A3A3',
            500: '#737373',
            700: '#404040',
            800: '#262626',
            900: '#171717',
          }
        }
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        amiri: ['var(--font-amiri)', 'serif'],
        tajawal: ['var(--font-tajawal)', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #9A7B1C 100%)',
        'gold-glow': 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(11,11,11,0) 70%)',
        'glass-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.2)',
        'emerald-glow': '0 0 25px rgba(15, 138, 108, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
