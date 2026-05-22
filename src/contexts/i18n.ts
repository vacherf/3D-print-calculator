/**
 * Accesseur du contexte i18n — fichier séparé pour satisfaire la règle
 * ESLint `react-refresh/only-export-components` qui interdit de mélanger
 * exports de composants et de hooks/fonctions dans le même fichier.
 *
 * Usage dans les composants enfants d'`<I18nProvider>` :
 *   import { useI18nContext } from "@/contexts/i18n"
 *   const { t, locale, setLocale } = useI18nContext()
 */

import { useContext } from "react"

import { I18nContext } from "@/contexts/I18nContextObject"
import type { UseI18n } from "@/hooks/useI18n"

/**
 * Accède au contexte i18n depuis n'importe quel composant enfant de `<I18nProvider>`.
 * Lève une erreur claire si appelé hors contexte.
 */
export function useI18nContext(): UseI18n {
  const ctx = useContext(I18nContext)
  if (ctx === null) {
    throw new Error(
      "useI18nContext doit être appelé à l'intérieur d'un <I18nProvider>",
    )
  }
  return ctx
}
