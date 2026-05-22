import { describe, it, expect } from "vitest"

import { formatEuros, formatKwh } from "@/lib/format"
import type { Locale } from "@/locales"

/**
 * Remplace les espaces insécables (U+00A0) et les espaces fines insécables
 * (U+202F) par une espace normale, pour comparer les chaînes de façon stable
 * quelle que soit l'implémentation d'Intl de l'environnement de test.
 */
function normaliserEspaces(s: string): string {
  return s.replace(/[\u00a0\u202f]/g, " ")
}

describe("formatEuros", () => {
  it("formate en fr-FR : virgule décimale, symbole € après, espace milliers", () => {
    expect(normaliserEspaces(formatEuros(1234.56, "fr"))).toBe("1 234,56 €")
  })

  it("formate en en-GB : point décimal, symbole € avant", () => {
    expect(normaliserEspaces(formatEuros(1234.56, "en"))).toBe("€1,234.56")
  })

  it("formate en de-DE : virgule décimale, point milliers, symbole € après", () => {
    expect(normaliserEspaces(formatEuros(1234.56, "de"))).toBe("1.234,56 €")
  })

  it("formate en es-ES : virgule décimale et symbole € après", () => {
    // NB : le séparateur de milliers de es-ES dépend de la version d'ICU
    // (groupement à partir de 10 000 dans certaines), on ne le teste donc pas ici.
    const s = normaliserEspaces(formatEuros(1234.56, "es"))
    expect(s.endsWith("€")).toBe(true)
    expect(s).toContain(",56")
  })

  it("utilise fr-FR par défaut quand aucune locale n'est fournie", () => {
    expect(normaliserEspaces(formatEuros(1234.56))).toBe(
      normaliserEspaces(formatEuros(1234.56, "fr")),
    )
  })

  it("affiche toujours exactement deux décimales", () => {
    expect(normaliserEspaces(formatEuros(2, "fr"))).toBe("2,00 €")
    expect(normaliserEspaces(formatEuros(2.5, "fr"))).toBe("2,50 €")
  })

  it("arrondit à deux décimales", () => {
    expect(normaliserEspaces(formatEuros(1.005, "fr"))).toBe("1,01 €")
    expect(normaliserEspaces(formatEuros(1.004, "fr"))).toBe("1,00 €")
  })

  it("gère zéro", () => {
    expect(normaliserEspaces(formatEuros(0, "fr"))).toBe("0,00 €")
  })

  it("gère les montants négatifs", () => {
    expect(normaliserEspaces(formatEuros(-3.5, "fr"))).toBe("-3,50 €")
  })

  it("remplace une valeur non finie par 0 (NaN)", () => {
    expect(normaliserEspaces(formatEuros(Number.NaN, "fr"))).toBe("0,00 €")
  })

  it("remplace une valeur non finie par 0 (Infinity)", () => {
    expect(normaliserEspaces(formatEuros(Number.POSITIVE_INFINITY, "fr"))).toBe(
      "0,00 €",
    )
  })

  it("conserve la devise EUR (€) pour toutes les locales", () => {
    const locales: Locale[] = ["fr", "en", "es", "de"]
    for (const l of locales) {
      expect(formatEuros(10, l)).toContain("€")
    }
  })
})

describe("formatKwh", () => {
  it("ajoute le suffixe « kWh » et formate selon fr-FR", () => {
    expect(normaliserEspaces(formatKwh(1234.5, "fr"))).toBe("1 234,5 kWh")
  })

  it("formate selon en-GB", () => {
    expect(normaliserEspaces(formatKwh(1234.5, "en"))).toBe("1,234.5 kWh")
  })

  it("formate selon de-DE (séparateur décimal virgule, milliers point)", () => {
    expect(normaliserEspaces(formatKwh(1234.5, "de"))).toBe("1.234,5 kWh")
  })

  it("formate selon es-ES (termine par « kWh »)", () => {
    const result = normaliserEspaces(formatKwh(1234.5, "es"))
    expect(result.endsWith("kWh")).toBe(true)
    expect(result).toContain(",5")
  })

  it("utilise fr-FR par défaut", () => {
    expect(normaliserEspaces(formatKwh(1234.5))).toBe(
      normaliserEspaces(formatKwh(1234.5, "fr")),
    )
  })

  it("conserve jusqu'à trois décimales", () => {
    expect(normaliserEspaces(formatKwh(0.123, "fr"))).toBe("0,123 kWh")
  })

  it("tronque l'affichage au-delà de trois décimales (arrondi)", () => {
    expect(normaliserEspaces(formatKwh(0.1235, "fr"))).toBe("0,124 kWh")
  })

  it("gère zéro", () => {
    expect(normaliserEspaces(formatKwh(0, "fr"))).toBe("0 kWh")
  })

  it("remplace une valeur non finie par 0", () => {
    expect(normaliserEspaces(formatKwh(Number.NaN, "fr"))).toBe("0 kWh")
  })

  it("remplace Infinity par 0", () => {
    expect(normaliserEspaces(formatKwh(Number.POSITIVE_INFINITY, "fr"))).toBe(
      "0 kWh",
    )
  })

  it("formate une valeur typique d'impression (0,36 kWh)", () => {
    // 120 W × 3 h = 0,36 kWh
    expect(normaliserEspaces(formatKwh(0.36, "fr"))).toBe("0,36 kWh")
  })
})

describe("formatEuros — cas limites supplémentaires", () => {
  it("formate un très grand montant en fr-FR", () => {
    const result = normaliserEspaces(formatEuros(1000000, "fr"))
    expect(result).toContain("1")
    expect(result).toContain("€")
    expect(result).toContain("000")
  })

  it("formate une valeur infime proche de zéro (< 0,005) → 0,00 €", () => {
    expect(normaliserEspaces(formatEuros(0.001, "fr"))).toBe("0,00 €")
  })

  it("formate un montant typique d'impression (1,17 €)", () => {
    // 50 g PLA + 3 h à 120 W (coût de base réaliste)
    const result = normaliserEspaces(formatEuros(1.17, "fr"))
    expect(result).toBe("1,17 €")
  })
})
