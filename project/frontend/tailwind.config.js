/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        background: '#0d131f',
        'dark-background': '#111827',
      }
    }
  },
  plugins: [],
}

