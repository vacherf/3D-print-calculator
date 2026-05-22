import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"

// Config « flat » pour Vite + React 19 + TypeScript.
// react-hooks v7 expose encore ses presets en `plugins: [...]` (format legacy),
// incompatible avec le flat config : on enregistre le plugin nous-mêmes et on
// ne réutilise que ses règles. react-refresh fournit une config flat dédiée Vite.
export default tseslint.config(
  { ignores: ["dist"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      "react-hooks": reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs["recommended-latest"].rules,
    },
  },
  // Fichiers de config exécutés par Node (Vite, Vitest).
  {
    files: ["*.config.{ts,js}"],
    languageOptions: {
      globals: globals.node,
    },
  },
  // Primitives shadcn/ui : le co-export d'un helper de variantes (cva) à côté du
  // composant est volontaire (convention shadcn). On y neutralise la règle Fast
  // Refresh, sans l'assouplir pour le reste du code.
  {
    files: ["src/components/ui/**"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
)
