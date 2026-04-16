import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@material-tailwind/react/theme/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: { 'brand-orange': '#ff4600' },
    },
  },
  plugins: [],
}
export default config