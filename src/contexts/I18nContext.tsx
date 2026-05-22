/**
 * Fournisseur du contexte i18n.
 *
 * À placer à la racine de l'application (dans `main.tsx`) pour que tous
 * les composants descendants puissent accéder au dictionnaire de traductions.
 *
 * L'objet contexte est dans `I18nContextObject.ts` et l'accesseur hook
 * dans `i18n.ts` — séparation requise par la règle ESLint
 * `react-refresh/only-export-components`.
 */

import type { ReactNode } from "react"

import { I18nContext } from "@/contexts/I18nContextObject"
import { useI18n } from "@/hooks/useI18n"

/** Fournisseur du contexte i18n. À placer à la racine de l'application. */
export function I18nProvider({ children }: { children: ReactNode }) {
  const i18n = useI18n()

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>
}
