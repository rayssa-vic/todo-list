/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F9DCE7",
        surface: "#FFF2F7",
        line: "#1A1013",
        text: "#1A1013",
        muted: "#8C6272",
        pink: "#E5487D",
        pinkDeep: "#B22D5C",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
