import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0D0D0D', deep: '#000000', card: '#141414', elev: '#1A1A1A' },
        ink: { DEFAULT: '#FFFFFF', muted: '#A0A0A0', dim: '#666666' },
        brand: {
          50: '#FFF4ED',
          100: '#FFE4D4',
          200: '#FFC9A8',
          300: '#FFA870',
          400: '#FF8533',
          500: '#FF6600',
          600: '#FF5500',
          700: '#E64A00',
          800: '#CC4200',
          900: '#993200',
          950: '#661F00',
        },
        cyan: {
          400: '#FF8533',
          500: '#FF6600',
          600: '#FF5500',
        },
        gold: {
          300: '#FFB380',
          400: '#FF8533',
          500: '#FF6600',
          600: '#FF5500',
        },
        casino: {
          red: '#FF4444',
          green: '#22C55E',
          emerald: '#16A34A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Poppins', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace'],
      },
      backgroundImage: {
        'mesh-1':
          'radial-gradient(ellipse at top left, rgba(255,102,0,0.12), transparent 50%), radial-gradient(ellipse at bottom right, rgba(255,85,0,0.08), transparent 50%)',
        'mesh-2':
          'radial-gradient(circle at 20% 0%, rgba(255,102,0,0.15), transparent 40%), radial-gradient(circle at 80% 100%, rgba(255,85,0,0.1), transparent 40%)',
        'gradient-brand': 'linear-gradient(135deg, #FF6600 0%, #FF5500 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FF8533 0%, #FF6600 50%, #FF5500 100%)',
        shimmer: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
        'dot-pattern':
          'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        dots: '24px 24px',
      },
      boxShadow: {
        'glow-brand': '0 0 0 1px rgba(255,102,0,0.3), 0 8px 32px -8px rgba(255,102,0,0.5)',
        'glow-cyan': '0 0 0 1px rgba(255,102,0,0.3), 0 8px 32px -8px rgba(255,102,0,0.5)',
        'glow-gold': '0 0 0 1px rgba(255,102,0,0.3), 0 8px 32px -8px rgba(255,102,0,0.5)',
        card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px -8px rgba(0,0,0,0.6)',
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%,100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
