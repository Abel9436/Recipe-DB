import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'text-slide-up': 'textSlideUp 0.5s ease-out',
        'text-slide-up-delayed': 'textSlideUp 0.5s ease-out 0.1s',
        'text-slide-up-delayed-2': 'textSlideUp 0.5s ease-out 0.2s',
        'text-slide-up-delayed-3': 'textSlideUp 0.5s ease-out 0.3s',
        'text-slide-up-delayed-4': 'textSlideUp 0.5s ease-out 0.4s',
        'text-slide-up-delayed-5': 'textSlideUp 0.5s ease-out 0.5s',
        'text-slide-up-delayed-6': 'textSlideUp 0.5s ease-out 0.6s',
        'card-slide-up': 'cardSlideUp 0.5s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        textSlideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        cardSlideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
export default config 