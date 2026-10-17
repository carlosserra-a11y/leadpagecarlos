// Vite + React + Tailwind (v4) para a parte em React do portfólio.
// `npm run dev` abre a demonstração do PrismHero; `npm run build` gera a "ilha" que o site estático carrega:
// lib/prism-hero.min.js (script clássico, global PrismIsland) e css/prism-hero.css.
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath, URL } from "node:url"

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // no modo biblioteca o Vite não troca process.env sozinho; sem isso o React vai em modo de desenvolvimento
  define: command === "build" ? { "process.env.NODE_ENV": JSON.stringify("production") } : {},
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2020",
    lib: {
      entry: fileURLToPath(new URL("./src/island.tsx", import.meta.url)),
      name: "PrismIsland",
      formats: ["iife"],
      fileName: () => "prism-hero.min.js",
      cssFileName: "prism-hero",
    },
  },
}))
