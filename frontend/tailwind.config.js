/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1. Dusty Rose (#D26E7B)
        dustyRose: {
          50: '#fcf4f5',
          100: '#f9eaec',
          200: '#f4d6d9',
          300: '#ebb6bc',
          400: '#df8e98',
          500: '#D26E7B', // Primary Dusty Rose
          600: '#be5361',
          700: '#9f414e',
          800: '#843843',
          900: '#6f323b',
        },
        // 2. Lavender Pink (#ECCEE6)
        lavenderPink: {
          50: '#fcf8fb',
          100: '#f9f0f7',
          200: '#ECCEE6', // Primary Lavender Pink
          300: '#e1b0d7',
          400: '#d18bc3',
          500: '#be6aac',
          600: '#a35091',
          700: '#863e75',
          800: '#6f3661',
          900: '#5e3052',
        },
        // 3. Butter Pale Yellow (#EFE89F)
        butterYellow: {
          50: '#fdfdf6',
          100: '#fbfbe9',
          200: '#EFE89F', // Primary Butter Yellow
          300: '#e6db73',
          400: '#dac94e',
          500: '#c5b134',
          600: '#a89228',
          700: '#867023',
          800: '#705c22',
          900: '#5f4d21',
        },
        // 4. Sage Celadon Green (#C5D88F)
        sageGreen: {
          50: '#f7faf2',
          100: '#edf4e1',
          200: '#C5D88F', // Primary Sage Green
          300: '#a8c668',
          400: '#8db249',
          500: '#709433',
          600: '#567527',
          700: '#435a22',
          800: '#384920',
          900: '#1E4E42', // Deep Forest / Slate
        },
        // 5. Vanilla Cream (#FEFCE7)
        vanillaCream: {
          50: '#fffef9',
          100: '#fffdf0',
          200: '#FEFCE7', // Primary Vanilla Cream
          300: '#fef7be',
          400: '#fde98a',
          500: '#f9d356',
          600: '#edb332',
          700: '#c78a24',
          800: '#9e6a23',
          900: '#835722',
        },
        // 6. Periwinkle Blue (#92AFEC)
        periwinkleBlue: {
          50: '#f4f7fd',
          100: '#e8effb',
          200: '#d6e2f8',
          300: '#92AFEC', // Primary Periwinkle Blue
          400: '#7194e4',
          500: '#5578dc',
          600: '#3f5dcf',
          700: '#354ab9',
          800: '#2e3e97',
          900: '#2a3777',
        },
        // 4. Bistre (#5D372A)
        bistre: {
          50: '#faf6f5',
          100: '#f4eae7',
          200: '#edd8d2',
          300: '#debcb3',
          400: '#cb988b',
          500: '#ba7b6d',
          600: '#a86455',
          700: '#8b4f42',
          800: '#744339',
          900: '#5D372A', // Exact Bistre
          950: '#381e16',
        },
        // 5. Flame (#EA672D)
        flame: {
          50: '#fef6f2',
          100: '#fde9df',
          200: '#fcd3be',
          300: '#fab593',
          400: '#f6895c',
          500: '#EA672D', // Exact Flame
          600: '#dc4f20',
          700: '#b73b1a',
          800: '#92321c',
          900: '#782c1b',
        }
      },
      fontFamily: {
        serif: ['Calistoga', 'Fraunces', 'DM Serif Display', 'Playfair Display', 'Georgia', 'serif'],
        display: ['Calistoga', 'Fraunces', 'serif'],
        sans: ['Plus Jakarta Sans', 'Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        handwriting: ['Caveat', 'cursive']
      }
    },
  },
  plugins: [],
}
