/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        peach: {
          50: '#FFF8F1',
          100: '#FEECDC',
          200: '#FCD9BD',
          300: '#FDBA8C',
          400: '#FF8A4C',
          500: '#FFDAB9',
          600: '#E6C4A6',
          700: '#D4A574',
          800: '#B8956A',
          900: '#9C7F5F',
        },
        cream: {
          50: '#FFFBF7',
          100: '#FFF8DC',
          200: '#FFE4B5',
          300: '#FFEAA7',
          400: '#FDCB6E',
          500: '#E17055',
        },
        sage: {
          50: '#F6F8F6',
          100: '#E8F5E8',
          200: '#C3E6C3',
          300: '#9FD89F',
          400: '#81C784',
          500: '#66BB6A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(255, 218, 185, 0.1), 0 10px 20px -2px rgba(255, 218, 185, 0.04)',
        'glow': '0 0 20px rgba(255, 218, 185, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};