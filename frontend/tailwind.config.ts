import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",   
        secondary: "#14b8a6", 
        accent: "#f59e0b",   
      },
    },
  },
  plugins: [
    require("tw-animate-css"),
  ],
};

export default config;
