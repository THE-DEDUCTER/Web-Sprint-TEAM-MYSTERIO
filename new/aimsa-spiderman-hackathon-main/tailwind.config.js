/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef1ff',
          100: '#e0e4ff',
          200: '#c6cbff',
          300: '#a3a5ff',
          400: '#8078fc',
          500: '#6c4ff5',
          600: '#4F46E5',
          700: '#4338ca',
          800: '#372fa3',
          900: '#312c81',
        },
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'marquee-slow': 'marquee 45s linear infinite',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
