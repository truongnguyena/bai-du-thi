/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FFF0F5',
          100: '#FFE4EC',
          200: '#FFC8DB',
          300: '#FFB6C1',
          400: '#FF8FB3',
          500: '#FF69B4',
          600: '#FF4C9E',
          700: '#DB3F86',
          800: '#B3326E',
          900: '#8A2758',
        },
      },
    },
  },
  plugins: [],
}

