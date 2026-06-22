/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#04050a',
        abyss: '#020308',
        ink: '#0a0c16',
        steel: '#111426',
        neon: {
          purple: '#a855f7',
          violet: '#7c3aed',
          indigo: '#6366f1',
          blue: '#3b82f6',
          cyan: '#22d3ee',
          magenta: '#9b5cff',
          ember: '#ff6a00',
          flame: '#ff2d00',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Rajdhani', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.35em',
        widest3: '0.55em',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatSlow: {
          '0%,100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-22px) translateX(8px)' },
        },
        flicker: {
          '0%,18%,22%,25%,53%,57%,100%': { opacity: '1' },
          '20%,24%,55%': { opacity: '0.4' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        pulseGlow: {
          '0%,100%': { opacity: '0.55', filter: 'blur(18px)' },
          '50%': { opacity: '1', filter: 'blur(26px)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        rise: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 11s ease-in-out infinite',
        flicker: 'flicker 6s linear infinite',
        scan: 'scan 6s linear infinite',
        marquee: 'marquee 38s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
        'pulse-glow': 'pulseGlow 4.5s ease-in-out infinite',
        'spin-slow': 'spinSlow 26s linear infinite',
        rise: 'rise 0.7s cubic-bezier(0.2,0.7,0.2,1) both',
      },
    },
  },
  plugins: [],
}
