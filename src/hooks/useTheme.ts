/**
 * Hook de gestion du thème clair / sombre.
 *
 * Ordre de priorité au chargement :
 *   1. Choix explicite de l'utilisateur, persisté dans le localStorage.
 *   2. Préférence système (`prefers-color-scheme: dark`).
 *   3. Thème clair par défaut.
 *
 * Le thème est appliqué en ajoutant / retirant la classe `.dark` sur
 * `document.documentElement`, conformément au mécanisme Tailwind v4 configuré
 * dans `src/index.css` (`@custom-variant dark (&:is(.dark *))`).
 *
 * La préférence est stockée sous une clé dédiée (`print3d-ui:theme`),
 * indépendante de la clé du calculateur, afin de ne pas affecter la
 * validation stricte de `PersistedState` dans `persistence.ts`.
 */

import { useEffect, useState } from "react"

/** Valeurs admises pour le thème. */
export type Theme = "light" | "dark"

/** Clé localStorage dédiée au thème — indépendante de la donnée calculateur. */
const THEME_STORAGE_KEY = "print3d-ui:theme"

/**
 * Lit la préférence de thème stockée dans le localStorage.
 * Retourne `null` si aucune préférence n'a encore été enregistrée
 * ou si la valeur est corrompue.
 */
function loadTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === "dark" || stored === "light") return stored
    return null
  } catch {
    // localStorage inaccessible (mode privé strict, etc.)
    return null
  }
}

/**
 * Enregistre la préférence de thème dans le localStorage.
 * Les erreurs (quota, mode privé) sont ignorées silencieusement.
 */
function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Échec silencieux
  }
}

/**
 * Détecte la préférence système de l'utilisateur via `prefers-color-scheme`.
 */
function getSystemTheme(): Theme {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark"
  }
  return "light"
}

/**
 * Détermine le thème initial au premier rendu :
 * priorité au choix explicite, sinon préférence système, sinon clair.
 */
function resolveInitialTheme(): Theme {
  const persisted = loadTheme()
  if (persisted !== null) return persisted
  return getSystemTheme()
}

/** Applique ou retire la classe `.dark` sur `<html>`. */
function applyThemeToDocument(theme: Theme): void {
  const root = document.documentElement
  if (theme === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}

export interface UseTheme {
  /** Thème actif : « light » ou « dark ». */
  theme: Theme
  /** Bascule entre le thème clair et le thème sombre. */
  toggleTheme: () => void
}

/**
 * Gère le thème clair / sombre de l'application.
 *
 * - Applique la classe `.dark` sur `<html>` à chaque changement.
 * - Persiste le choix dans le localStorage (clé `print3d-ui:theme`).
 * - Détecte la préférence système si aucun choix explicite n'existe.
 */
export function useTheme(): UseTheme {
  const [theme, setTheme] = useState<Theme>(resolveInitialTheme)

  // Applique la classe sur <html> et persiste à chaque changement de thème
  useEffect(() => {
    applyThemeToDocument(theme)
    saveTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return { theme, toggleTheme }
}
