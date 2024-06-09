/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
				'dark': "#202021",
				'gray': "#74757E",
				'white-gray': "#CDCED7",
				'white': "#fff",
				'input': "#F5F5F5",
				'red': "#FF2F00",
			}
    },
    fontFamily: {
      sans : ["'Neue'", ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [require('tailwind-scrollbar'), require('daisyui'),],
}