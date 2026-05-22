/**
 * Objet contexte React pour i18n — séparé du Provider pour satisfaire la règle
 * ESLint `react-refresh/only-export-components`.
 *
 * Ce fichier n'exporte que l'objet contexte (non-composant).
 * Le Provider est dans `I18nContext.tsx`, l'accesseur hook dans `i18n.ts`.
 */

import { createContext } from "react"

import type { UseI18n } from "@/hooks/useI18n"

/** Contexte i18n partagé dans l'arbre React. */
export const I18nContext = createContext<UseI18n | null>(null)
