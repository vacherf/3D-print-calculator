/**
 * Hook de gestion de la langue de l'interface.
 *
 * Comportement :
 *   - Langue par défaut : français (`fr`), quelle que soit la langue du navigateur.
 *   - Si un choix a déjà été enregistré en localStorage (clé `print3d-ui:lang`),
 *     il est restauré au chargement.
 *   - Pas de détection automatique de `navigator.language` (hors périmètre STORY-009a).
 *
 * Conception cohérente avec `useTheme` : même pattern (localStorage + useState + useEffect).
 */

import { useEffect, useState } from "react"

import {
  DEFAULT_LOCALE,
  DICTIONARIES,
  loadLocale,
  saveLocale,
  type Locale,
  type Translations,
} from "@/locales"

export interface UseI18n {
  /** Code de langue actif : « fr » ou « en ». */
  locale: Locale
  /** Dictionnaire de traductions correspondant à la locale active. */
  t: Translations
  /** Change la langue et la persiste dans le localStorage. */
  setLocale: (locale: Locale) => void
}

/**
 * Détermine la locale initiale au premier rendu :
 * priorité au choix explicite en localStorage, sinon FR par défaut.
 * Pas de détection `navigator.language` (hors périmètre).
 */
function resolveInitialLocale(): Locale {
  const persisted = loadLocale()
  return persisted ?? DEFAULT_LOCALE
}

/**
 * Gère la langue active de l'interface.
 *
 * - Retourne le dictionnaire `t` typé (clés exhaustives), la locale courante
 *   et une fonction `setLocale` pour changer de langue.
 * - Persiste le choix dans le localStorage à chaque changement.
 */
export function useI18n(): UseI18n {
  const [locale, setLocaleState] = useState<Locale>(resolveInitialLocale)

  // Persiste la locale à chaque changement
  useEffect(() => {
    saveLocale(locale)
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
  }

  return {
    locale,
    t: DICTIONARIES[locale],
    setLocale,
  }
}
