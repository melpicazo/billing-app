/** @type {import('tailwindcss').Config} */
import theme from "./tailwind-theme.ts";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: { ...theme },
  },
  plugins: [],
};
