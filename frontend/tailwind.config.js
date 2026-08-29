/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        comfort: {
          great: "#16a34a",
          good: "#65a30d",
          fair: "#ca8a04",
          poor: "#ea580c",
          bad: "#dc2626",
        },
      },
    },
  },
  plugins: [],
};
