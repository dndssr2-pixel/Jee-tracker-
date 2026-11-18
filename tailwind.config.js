/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        physics: {
          light: '#d1fae5',
          DEFAULT: '#10b981',
          dark: '#065f46',
        },
        chemistry: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#92400e',
        },
        maths: {
          light: '#dbeafe',
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
        },
        coaching: {
          light: '#f3e8ff',
          DEFAULT: '#a855f7',
          dark: '#6b21a8',
        },
        revision: {
          light: '#e0e7ff',
          DEFAULT: '#6366f1',
          dark: '#3730a3',
        },
      },
    },
  },
  plugins: [],
}
