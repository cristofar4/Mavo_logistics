/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: { DEFAULT: '#F7F2E8', deep: '#EEE7DA', soft: '#FBF8F2' },
        charcoal: { DEFAULT: '#1B2121', soft: '#262D2D', muted: '#555B59' },
        orange: { DEFAULT: '#EA6A1F', deep: '#C9560F', soft: '#FBE3D2' },
        navy: { DEFAULT: '#173F4E', deep: '#0F2C37' },
        olive: { DEFAULT: '#6F7458', soft: '#E3E3D3' },
        mist: '#D9D6CE',
      },
      fontFamily: {
        sans: ['"Manrope Variable"', 'Manrope', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      maxWidth: { site: '86rem' },
      boxShadow: {
        soft: '0 1px 2px rgba(27,33,33,.06), 0 12px 32px -12px rgba(27,33,33,.2)',
        lift: '0 2px 4px rgba(27,33,33,.06), 0 28px 60px -24px rgba(27,33,33,.4)',
      },
      transitionTimingFunction: { out: 'cubic-bezier(.22,1,.36,1)' },
    },
  },
  plugins: [],
}
