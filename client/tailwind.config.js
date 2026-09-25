/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1B3B2B',
          light: '#27523C',
          dark: '#12291E'
        },
        pine: {
          DEFAULT: '#2D5A40',
          light: '#3C7555',
          dark: '#1F402D'
        },
        cream: {
          DEFAULT: '#FDFBF7',
          muted: '#F4EFE6',
          dark: '#E8E1D5'
        },
        terracotta: {
          DEFAULT: '#C85A32',
          light: '#DA6D45',
          dark: '#A54320'
        },
        saffron: {
          DEFAULT: '#E08A3C',
          light: '#EC9D53',
          dark: '#B86A22'
        },
        himalayan: {
          brown: '#4A3525',
          slate: '#2B303A'
        },
        charcoal: '#1F2421'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'serif']
      }
    }
  },
  plugins: []
};
