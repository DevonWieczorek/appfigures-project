import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: { 'brand-orange': '#ff4600' },
    },
  },
  plugins: [],
}
export default config