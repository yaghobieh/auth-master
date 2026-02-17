/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../src/**/*.{js,ts,jsx,tsx}',
    '../node_modules/@forgedevstack/bear/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#ec4899',
        secondary: '#8b5cf6',
      },
    },
  },
  plugins: [],
};
