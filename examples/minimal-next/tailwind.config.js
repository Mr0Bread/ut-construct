/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@uploadthing-construct/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

