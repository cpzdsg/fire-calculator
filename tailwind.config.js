/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          red: '#ff0055',
          green: '#00ff88',
          yellow: '#ffdd00',
        },
      },
    },
  },
  plugins: [],
}

