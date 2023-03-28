/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
      isra: ['Isra', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
};
