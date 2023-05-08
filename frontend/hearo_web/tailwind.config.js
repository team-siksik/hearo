/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      chewy: ["Chewy", "cursive"],
      nanum: ["Nanum Pen Script", "cursive"],
    },
    extend: {
      colors: {
        "blue-main": "#1A73E8",
        "red-main": "#E63E43",
        "red-sub": "#F35D61",
        "red-error": "#BF191E",
        "red-1": "#E25252",
        "gray-20": "#F8F4EB",
        "gray-50": "#EFE6E6",
        "gray-100": "#DFCCCC",
        "yellow-sub": "#FFC542",
        "green-sub": "#3ED598",
        "red-sub": "#F35D61",
        "red-error": "#BF191E",
        "primary-100": "#FFE1E0",
        "primary-300": "#FFA6A3",
        "primary-500": "#FF6B66",
        "secondary-400": "#FFCD5B",
        "secondary-500": "#FFC132",
      },
    },
    screens: {
      sm: "768px",
      desktop: "1920px",
    },
  },
  plugins: [],
};
