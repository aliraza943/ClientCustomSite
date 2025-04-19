/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}", // Include all React component files
    ],
    theme: {
      extend: {
        fontFamily: {
          cursive: ['"Comic Sans MS"', 'cursive'],
          fantasy: ['"Papyrus"', 'fantasy'],
        },
      },
    },
    plugins: [],
  }