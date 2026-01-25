/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['"LXGW WenKai"', 'serif'],
        display: ['"ZCOOL XiaoWei"', 'serif']
      }
    }
  },
  plugins: []
}
