/**
 * Point d'entrée du module de localisation.
 *
 * Exporte les dictionnaires de toutes les langues disponibles et les types
 * associés. Pour ajouter une langue (ex. ES, DE — STORY-009b), il suffit :
 *   1. de créer `es.ts` / `de.ts` implémentant le type `Translations`,
 *   2. de l'ajouter au tableau `SUPPORTED_LOCALES` et à la map `DICTIONARIES`.
 */

import { fr } from "./fr"
import { en } from "./en"
import { es } from "./es"
import { de } from "./de"

export type { Translations } from "./fr"

/** Codes de langue supportés. Extensible sans refactoring du consommateur. */
export type Locale = "fr" | "en" | "es" | "de"

/** Clé localStorage dédiée à la langue — indépendante des données calculateur. */
export const LANG_STORAGE_KEY = "print3d-ui:lang"

/** Langue par défaut de l'application. */
export const DEFAULT_LOCALE: Locale = "fr"

/** Liste des langues disponibles, dans l'ordre d'affichage du sélecteur. */
export const SUPPORTED_LOCALES: ReadonlyArray<{
  code: Locale
  label: string
  labelNative: string
  /** Code pays ISO 3166-1 alpha-2 du drapeau associé à la langue (ex. "GB" pour l'anglais). */
  country: string
}> = [
  { code: "fr", label: "Français", labelNative: "Français", country: "FR" },
  { code: "en", label: "English", labelNative: "English", country: "GB" },
  { code: "es", label: "Español", labelNative: "Español", country: "ES" },
  { code: "de", label: "Deutsch", labelNative: "Deutsch", country: "DE" },
] as const

/** Dictionnaires indexés par code de langue. */
export const DICTIONARIES: Record<Locale, typeof fr> = {
  fr,
  en,
  es,
  de,
} as const

/**
 * Lit la préférence de langue stockée dans le localStorage.
 * Retourne `null` si aucune préférence ou si la valeur est invalide.
 */
export function loadLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY)
    if (stored === "fr" || stored === "en" || stored === "es" || stored === "de")
      return stored
    return null
  } catch {
    return null
  }
}

/**
 * Enregistre la préférence de langue dans le localStorage.
 * Les erreurs (quota, mode privé) sont ignorées silencieusement.
 */
export function saveLocale(locale: Locale): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, locale)
  } catch {
    // Échec silencieux
  }
}
