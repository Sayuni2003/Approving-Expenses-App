/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", // expo-router pages
    "./components/**/*.{js,jsx,ts,tsx}", // your components
    "./App.{js,jsx,ts,tsx}", // if you have App.(ts|js)x
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#E07136",
        secondary: "#4a5568",
        background: "#faf8f5",
      },
    },
  },
  plugins: [],
};
