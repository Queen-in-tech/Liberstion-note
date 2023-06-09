/** @type {import('tailwindcss').Config} */
 export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          dGreen : "#6bb390",
          dYellow : "#ffff76",
          dBlue : "#292b4c"
        }
      },
    },
    plugins: [],
  }
