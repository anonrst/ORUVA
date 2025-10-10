/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Material 3 inspired color palette for Web3
        primary: {
          50: '#0f172a',
          100: '#1e293b',
          200: '#334155',
          300: '#475569',
          400: '#64748b',
          500: '#0ea5e9',
          600: '#38bdf8',
          700: '#7dd3fc',
          800: '#bae6fd',
          900: '#e0f2fe',
        },
        surface: {
          50: '#0a0a0a',
          100: '#111111',
          200: '#1a1a1a',
          300: '#262626',
          400: '#404040',
          500: '#525252',
          600: '#737373',
          700: '#a3a3a3',
          800: '#d4d4d4',
          900: '#f5f5f5',
        },
        success: {
          50: '#0c1f17',
          100: '#14532d',
          200: '#166534',
          300: '#15803d',
          400: '#16a34a',
          500: '#22c55e',
          600: '#4ade80',
          700: '#86efac',
          800: '#bbf7d0',
          900: '#dcfce7',
        },
        warning: {
          50: '#1c1917',
          100: '#78350f',
          200: '#92400e',
          300: '#b45309',
          400: '#d97706',
          500: '#f59e0b',
          600: '#fbbf24',
          700: '#fcd34d',
          800: '#fde68a',
          900: '#fef3c7',
        },
        error: {
          50: '#1f1315',
          100: '#7f1d1d',
          200: '#991b1b',
          300: '#b91c1c',
          400: '#dc2626',
          500: '#ef4444',
          600: '#f87171',
          700: '#fca5a5',
          800: '#fecaca',
          900: '#fee2e2',
        },
        // Web3 specific colors
        accent: {
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          pink: '#ec4899',
          orange: '#f97316',
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        'material': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'material-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'material-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'material-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
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
}