/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans'],
      },
      fontSize: {
        'xs': ['10px', '14px'],
        'sm': ['12px', '16px'],
        'md': ['14px', '18px'],
        'lg': ['18px', '24px'],
        'xl': ['24px', '32px'],
      },
      fontWeight: {
        regular: '400',
        semibold: '600',
        bold: '700',
      },
      // --- PALETA DE CORES CORRIGIDA ---
      colors: {
        'brand': {
          'base': '#2C46B1', // blue-base
          'dark': '#2C4091', // blue-dark
        },
        'danger': '#B12C4D', // danger
        'gray': {
          100: '#F9F9FB', // gray-100
          200: '#E4E6EC', // gray-200
          300: '#CDCFD5', // gray-300
          400: '#74798B', // gray-400
          500: '#4D505C', // gray-500
          600: '#1F2025', // gray-600
        },
        'white': '#FFFFFF', // white
      }
      // ---------------------------------
    },
  },
  plugins: [],
}