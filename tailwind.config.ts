import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0d1322',
          muted: '#121a2e',
          elevated: '#1a2642',
          'elevated-hover': '#1f2d4f'
        },
        accent: {
          primary: '#7f5af0',
          secondary: '#58a6ff',
          tertiary: '#6ee7b7',
          pink: '#ec4899'
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
        glow: '0 0 40px 0 rgba(127, 90, 240, 0.35), 0 0 15px 0 rgba(88, 166, 255, 0.2)',
        panel: '0 20px 50px -20px rgba(15, 23, 42, 0.9), 0 8px 16px -8px rgba(127, 90, 240, 0.15)',
        'glow-strong': '0 30px 90px -30px rgba(88, 166, 255, 0.55), 0 20px 60px -20px rgba(127, 90, 240, 0.4)',
        'panel-hover': '0 25px 60px -20px rgba(127, 90, 240, 0.35), 0 10px 24px -8px rgba(88, 166, 255, 0.25)'
      },
      dropShadow: {
        halo: '0 30px 60px rgba(127, 90, 240, 0.25)'
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-8px) scale(1.02)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        },
        'slide-up-fade': {
          '0%': { opacity: '0', transform: 'translateY(15px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px 0 rgba(127, 90, 240, 0.3)' },
          '50%': { boxShadow: '0 0 35px 5px rgba(127, 90, 240, 0.6), 0 0 20px 0 rgba(88, 166, 255, 0.4)' }
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        'float-slow': 'float-slow 12s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'pulse-soft': 'pulse-soft 2.8s ease-in-out infinite',
        'slide-up-fade': 'slide-up-fade 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite'
      }
    }
  },
  plugins: []
};

export default config;
