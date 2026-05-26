import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#090d14",
        panel: "#111827",
        line: "#223047",
        cyan: "#38d9ff",
        acid: "#7cff9e",
        amber: "#f7c948",
        danger: "#ff5c7a"
      },
      boxShadow: {
        glow: "0 0 38px rgba(56, 217, 255, 0.12)"
      }
    }
  },
  plugins: []
} satisfies Config;
