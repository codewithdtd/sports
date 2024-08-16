/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
   // These paths are just examples, customize them to match your project structure
  purge: [
     './index.html',
     './src/**/*.{js,jsx,ts,tsx,vue}',
   ],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        greenPrimary: "#22FF53",
        greenSeconday: "#125511",
      },
    },
  },
  plugins: [],
}

