/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  corePlugins: {
    preflight: false
  },
  theme: {
    fontFamily: {
      display: ["Inter"],
    },
    extend: {},
  },
  plugins: [],
}

