# 3. Core Layer Design Styles (frontend/src/index.css)

CSS
@tailwind base;
@tailwind components;
@tailwind utilities;


@layer base {
  body {
    @apply bg-slate-950 text-slate-100 overflow-hidden antialiased selection:bg-emerald-500/30 selection:text-emerald-300;
  }
}


/* Custom dark scrollbar optimization */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #020617;
}
::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}


