import type { Config } from "tailwindcss";

// tailwind.config.js

const buttonStyle =
  "bg-gray-600 py-1 px-2 m-2 rounded hover:bg-blue-500 text-white min-h-full";

const buttonStyleLight =
  "bg-gray-200 py-1 px-2 m-2 rounded hover:bg-blue-200 text-black min-h-full";


const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // Adding custom button styles
      components: {
        '.btn': buttonStyle,
        '.btn-light': buttonStyleLight,
      },
    },
  },
  plugins: [],
};
export default config;
