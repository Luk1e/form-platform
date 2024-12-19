/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        purple: {
          1: "#f9f0ff",
          2: "#efdbff",
          3: "#d3adf7",
          4: "#b37feb",
          5: "#9254de",
          6: "#722ed1",
          7: "#531dab",
          8: "#391085",
          9: "#22075e",
          10: "#120338",
        },
      },
    },
  },
  plugins: [],
};
