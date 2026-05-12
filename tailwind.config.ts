import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0a0d18', deep: '#070912', card: '#11162a', elev: '#161c33' },
        ink: { DEFAULT: '#f1f5f9', muted: '#94a3b8', dim: '#64748b' },
        brand: {
          50: '#f4f1ff', 100: '#e9e3ff', 200: '#d4c6ff', 300: '#b69aff',
          400: '#9466ff', 500: '#7a3fff', 600: '#6a25ff', 700: '#5818eb',
          800: '#4a13c4', 900: '#3e119f', 950: '#23066b'
        },
        cyan: {
          400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2'
        },
        gold: {
          300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706'
        },
        casino: {
          red: '#ef4444', green: '#10b981', emerald: '#059669'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace']
      },
      backgroundImage: {
        'mesh-1': 'radial-gradient(ellipse at top left, rgba(122,63,255,0.18), transparent 50%), radial-gradient(ellipse at bottom right, rgba(6,182,212,0.15), transparent 50%), radial-gradient(ellipse at center, rgba(245,158,11,0.05), transparent 60%)',
        'mesh-2': 'radial-gradient(circle at 20% 0%, rgba(122,63,255,0.25), transparent 40%), radial-gradient(circle at 80% 100%, rgba(6,182,212,0.2), transparent 40%)',
        'gradient-brand': 'linear-gradient(135deg, #7a3fff 0%, #06b6d4 100%)',
        'gradient-gold': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)'
      },
      boxShadow: {
        'glow-brand': '0 0 0 1px rgba(122,63,255,0.3), 0 8px 32px -8px rgba(122,63,255,0.5)',
        'glow-cyan': '0 0 0 1px rgba(6,182,212,0.3), 0 8px 32px -8px rgba(6,182,212,0.5)',
        'glow-gold': '0 0 0 1px rgba(245,158,11,0.3), 0 8px 32px -8px rgba(245,158,11,0.5)',
        'card': '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px -8px rgba(0,0,0,0.6)'
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite'
      },
      keyframes: {
        'gradient-x': { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        'shimmer': { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
        'float': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        'pulse-glow': { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } }
      }
    }
  },
  plugins: []
};
export default config;
