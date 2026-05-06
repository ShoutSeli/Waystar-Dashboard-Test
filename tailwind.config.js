/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          50: "#F6F4FC",
          100: "#E6E4FF",
          200: "#BBB7EB",
          300: "#8B86BF",
          400: "#6B6699",
          600: "#5B5999",
          700: "#3D3B5B",
          800: "#2D2B45",
          900: "#1D1B2F",
        },
      },
      fontFamily: { nohemi: ["Nohemi", "sans-serif"] },
      boxShadow: {
        card: "0 1px 3px rgba(61, 59, 91, 0.08)",
        "card-hover": "0 4px 12px rgba(61, 59, 91, 0.12)",
        soft: "0 2px 8px rgba(61, 59, 91, 0.06)",
      },
      spacing: {
        'table-compact': '0.5rem',
        'table-normal': '1rem',
        'table-relaxed': '1.5rem',
      },
    },
  },
  plugins: [],
};