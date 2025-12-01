export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': {
          900: '#0a1628',
          800: '#0f1f3a',
          700: '#152944',
        }
      }
    },
  },
  plugins: [],
}
