/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Navy (Primary brand dark blue)
        navy: {
          DEFAULT: '#123047',
          light: '#1B4565',
          dark: '#0B1E2D',
          hover: '#0E2638',
        },
        // Ocean Blue
        ocean: {
          DEFAULT: '#087E8B',
          light: '#0CA6B7',
          dark: '#066772',
          hover: '#066772',
        },
        // Soft Teal
        teal: {
          DEFAULT: '#D9F3EF',
          light: '#EDFAF8',
          dark: '#0FA392',
        },
        accent: {
          DEFAULT: '#D9F3EF',
          dark: '#0FA392',
          coral: '#FF5A5F',
        },
        primary: {
          DEFAULT: '#087E8B',
          hover: '#066772',
          light: '#D9F3EF',
        },
        secondary: {
          DEFAULT: '#123047',
          hover: '#0B1E2D',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F8FAFC',
          card: '#FFFFFF',
        },
        brandText: {
          DEFAULT: '#123047',
          main: '#123047',
          muted: '#334155',
          light: '#475569',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.8125rem', { lineHeight: '1.25rem' }],   // 13px instead of 12px
        'sm': ['0.9375rem', { lineHeight: '1.4rem' }],    // 15px instead of 14px
        'base': ['1.0625rem', { lineHeight: '1.65rem' }], // 17px instead of 16px
        'lg': ['1.1875rem', { lineHeight: '1.75rem' }],   // 19px
        'xl': ['1.3125rem', { lineHeight: '1.85rem' }],   // 21px
        '2xl': ['1.625rem', { lineHeight: '2.1rem' }],    // 26px
        '3xl': ['2rem', { lineHeight: '2.4rem' }],        // 32px
        '4xl': ['2.5rem', { lineHeight: '2.8rem' }],      // 40px
        '5xl': ['3.25rem', { lineHeight: '3.6rem' }],     // 52px
        '6xl': ['4rem', { lineHeight: '4.4rem' }],        // 64px
      }
    },
  },
  plugins: [],
};
