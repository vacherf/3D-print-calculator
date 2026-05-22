import path from "path"
import { defineConfig } from "vitest/config"

// Configuration de test isolée : on ne charge pas les plugins Vite (React,
// Tailwind) car les tests portent sur la logique métier pure de `src/lib/`.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
})
