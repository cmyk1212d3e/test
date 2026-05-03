import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#24313d",
        muted: "#61717d",
        line: "#dbe6e7",
        paper: "#fffdf8",
        mist: "#eaf7f4",
        mint: "#70c8b4",
        teal: "#168b86",
        coral: "#f36f55",
        gold: "#f5bd4f"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 58, 66, 0.14)"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Microsoft YaHei",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};

export default config;
