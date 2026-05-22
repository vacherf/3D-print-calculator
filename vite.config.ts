import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  // base pour GitHub Pages : le repo s'appelle "3D-print-calculator",
  // donc les assets sont servis sous ce chemin de sous-répertoire.
  base: "/3D-print-calculator/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
