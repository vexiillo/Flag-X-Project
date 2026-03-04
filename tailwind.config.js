/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",      // File HTML utama
    "./*.js",            // Tanda * artinya: SCAN SEMUA file yang akhiran .js di folder ini
    "./src/**/*.{js,html}" // Scan semua file js/html di dalam folder src (kalau ada)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
    }
