import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0d1322',
          muted: '#121a2e',
          elevated: '#17223b'
        },
        accent: {
          primary: '#7f5af0',
          secondary: '#58a6ff'
        }
      },
      backgroundImage: {
        'halo-glow':
          'radial-gradient(circle at top left, rgba(127, 90, 240, 0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(88, 166, 255, 0.18), transparent 50%)'
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif'
        ]
      },
      boxShadow: {
        glow: '0 0 35px 0 rgba(127, 90, 240, 0.25)',
        panel: '0 18px 45px -25px rgba(15, 23, 42, 0.85)',
        'glow-strong': '0 30px 80px -40px rgba(88, 166, 255, 0.45)'
      },
      dropShadow: {
        halo: '0 30px 60px rgba(127, 90, 240, 0.25)'
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '1' }
        },
        'slide-up-fade': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'float-slow': 'float-slow 12s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'pulse-soft': 'pulse-soft 2.6s ease-in-out infinite',
        'slide-up-fade': 'slide-up-fade 320ms ease forwards'
      }
    }
  },
  plugins: []
};

export default config;
