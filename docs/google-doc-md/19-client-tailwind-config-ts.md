# client\tailwind.config.ts



``ts
import type { Config } from "tailwindcss";


export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#071014",
        panel: "#101a20",
        line: "#20303a",
        cyan: "#20d6c7",
        signal: "#a3e635",
        danger: "#fb7185",
        warn: "#facc15"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(32,214,199,.16), 0 20px 60px rgba(0,0,0,.25)"
      }
    }
  },
  plugins: []
} satisfies Config;


client\tsconfig.json
``json
{
"compilerOptions": {
"target": "ES2020",
"useDefineForClassFields": true,
"lib": ["DOM", "DOM.Iterable", "ES2020"],
"allowJs": false,
"skipLibCheck": true,
"esModuleInterop": true,
"allowSyntheticDefaultImports": true,
"strict": true,
"forceConsistentCasingInFileNames": true,
"module": "ESNext",
"moduleResolution": "Node",
"resolveJsonModule": true,
"isolatedModules": true,
"noEmit": true,
"jsx": "react-jsx"
},
"include": ["src"],
"references": []
}


