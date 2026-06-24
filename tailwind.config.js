/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF69B4',
        soft: '#FFC0CB',
        blush: '#FFE4E1',
        accent: '#FF1493',
      },
      boxShadow: {
        glow: '0 20px 80px rgba(255, 105, 180, 0.2)',
      },
      borderRadius: {
        xl: '28px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        shimmer: {
          '0%': { opacity: 0.15 },
          '50%': { opacity: 0.5 },
          '100%': { opacity: 0.15 },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
