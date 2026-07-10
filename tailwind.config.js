/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F9D7E7',
        soft: '#FCE7F2',
        blush: '#FFF2F7',
        accent: '#F8B8D3',
      },
      boxShadow: {
        glow: '0 20px 80px rgba(248, 184, 211, 0.18)',
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
