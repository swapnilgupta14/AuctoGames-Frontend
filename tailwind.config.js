/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "custom-card": "0 6px 10px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
};
