/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Coral-red accent — matches the CEPI CTA button
        coral: {
          50:  '#fff2f1',
          100: '#ffe0de',
          200: '#ffc4c1',
          300: '#ff9d99',
          400: '#ff7a75',
          500: '#ff5f58',   // PRIMARY — buttons, user bubble, icons
          600: '#f04840',   // hover state
          700: '#cc3028',
          800: '#a8261f',
          900: '#8a221c',
        },
        // Deep navy background scale — matches the CEPI page bg
        navy: {
          950: '#060c1a',
          900: '#0a1628',
          800: '#0d1e3a',
          700: '#12264e',
          600: '#172e60',
          500: '#1c3572',
        },
      },
      backgroundImage: {
        'page-gradient': 'linear-gradient(135deg, #0d1a3e 0%, #0a1628 50%, #0e1c3a 100%)',
      },
      animation: {
        'fade-in':  'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' },                           '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
