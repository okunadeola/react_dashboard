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
        'primary-blue': 'var(--primary-blue)',
        'secondary-red': 'var(--secondary-red)',
        'text-gray': 'var(--text-gray)',
        'border-gray': 'var(--border-gray)',
      },
    },
  },
  plugins: [],
}

