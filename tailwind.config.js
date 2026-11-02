/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: { DEFAULT: '#F5F2EA', deep: '#ECE7DA', soft: '#FAF8F3' },
        charcoal: { DEFAULT: '#202321', soft: '#2C302D', muted: '#575B57' },
        orange: { DEFAULT: '#D96936', deep: '#B9542A', soft: '#F3D9CB' },
        olive: { DEFAULT: '#6F7458', soft: '#E3E3D3' },
        mist: '#D9D6CE',
      },
      fontFamily: {
        sans: ['"Manrope Variable"', 'Manrope', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      maxWidth: { site: '84rem' },
      boxShadow: {
        soft: '0 1px 2px rgba(32,35,33,.06), 0 12px 32px -12px rgba(32,35,33,.18)',
        lift: '0 2px 4px rgba(32,35,33,.06), 0 28px 60px -24px rgba(32,35,33,.35)',
      },
      transitionTimingFunction: { out: 'cubic-bezier(.22,1,.36,1)' },
    },
  },
  plugins: [],
}
