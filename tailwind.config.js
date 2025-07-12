/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cosno-primary': '#5556ec',
        'cosno-dark': '#04041e',
        'cosno-blue': '#062b67',
        'cosno-purple': '#5556ec',
        'cosno-light': '#c8cacb',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'bounce': 'bounce 1s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'star-pattern': "url('https://ext.same-assets.com/3546354360/3218586608.png')",
        'gradient-cosno': 'linear-gradient(180deg, #04041e 0%, #062b67 100%)',
      }
    },
  },
  plugins: [],
}