/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060B18',
          900: '#0B132B',
          850: '#131D38',
          800: '#1C2541',
          700: '#2A3B5C',
          600: '#3A506B',
          500: '#5C769D'
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
