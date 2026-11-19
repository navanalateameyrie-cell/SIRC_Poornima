/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', '"Noto Serif Tamil"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
