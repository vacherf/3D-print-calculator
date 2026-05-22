/**
 * Helpers de formatage localisé (euros, kWh…).
 *
 * La devise est toujours EUR (pas de conversion monétaire).
 * Le format d'affichage suit la locale active : séparateurs décimaux et de
 * milliers adaptés (ex. `1 234,56 €` en fr-FR, `€1,234.56` en en-US,
 * `1.234,56 €` en de-DE).
 *
 * Correspondance locale ↔ code BCP-47 :
 *   "fr" → "fr-FR"
 *   "en" → "en-US"
 *   "es" → "es-ES"
 *   "de" → "de-DE"
 *
 * Les formateurs sont mis en cache par locale pour éviter de recréer des
 * objets `Intl.NumberFormat` à chaque appel.
 */

import type { Locale } from "@/locales"

/** Mapping code langue court → locale BCP-47 complète. */
const LOCALE_MAP: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-US",
  es: "es-ES",
  de: "de-DE",
}

/** Locale par défaut utilisée quand aucune n'est précisée. */
const DEFAULT_BCP47 = "fr-FR"

/** Cache des formateurs monétaires indexés par locale BCP-47. */
const eurosFormatters = new Map<string, Intl.NumberFormat>()

/** Cache des formateurs numériques indexés par locale BCP-47. */
const numberFormatters = new Map<string, Intl.NumberFormat>()

function getEurosFormatter(bcp47: string): Intl.NumberFormat {
  let f = eurosFormatters.get(bcp47)
  if (!f) {
    f = new Intl.NumberFormat(bcp47, {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    eurosFormatters.set(bcp47, f)
  }
  return f
}

function getNumberFormatter(bcp47: string): Intl.NumberFormat {
  let f = numberFormatters.get(bcp47)
  if (!f) {
    f = new Intl.NumberFormat(bcp47, {
      maximumFractionDigits: 3,
    })
    numberFormatters.set(bcp47, f)
  }
  return f
}

/**
 * Formate une valeur en euros selon la locale active.
 * La devise est EUR dans tous les cas — seul le format change.
 *
 * @param value  Montant en euros.
 * @param locale Code de langue de l'application ("fr" | "en"). Défaut : "fr".
 *
 * @example
 *   formatEuros(1234.56, "fr") // "1 234,56 €"
 *   formatEuros(1234.56, "en") // "€1,234.56"
 */
export function formatEuros(value: number, locale?: Locale): string {
  const bcp47 = locale ? LOCALE_MAP[locale] : DEFAULT_BCP47
  return getEurosFormatter(bcp47).format(Number.isFinite(value) ? value : 0)
}

/**
 * Formate une valeur en kWh selon la locale active.
 *
 * @param value  Quantité d'énergie en kilowattheures.
 * @param locale Code de langue de l'application ("fr" | "en"). Défaut : "fr".
 */
export function formatKwh(value: number, locale?: Locale): string {
  const bcp47 = locale ? LOCALE_MAP[locale] : DEFAULT_BCP47
  return `${getNumberFormatter(bcp47).format(Number.isFinite(value) ? value : 0)} kWh`
}
