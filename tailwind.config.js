/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ocean: "#087E8B",
        navy: "#123047",
        teal: { soft: "#D9F3EF" },
        canvas: "#F7FAFC",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: { card: "0 10px 30px -12px rgba(18,48,71,.25)" },
    },
  },
  plugins: [],
};
