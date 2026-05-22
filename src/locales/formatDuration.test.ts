/**
 * Tests des fonctions `formatDuration` et `formatDate` embarquées
 * dans chaque dictionnaire de locale.
 *
 * Ces fonctions sont de la logique pure (pas de React, pas de DOM)
 * mais n'étaient pas couvertes par la précédente passe QA.
 */

import { describe, it, expect } from "vitest"

import { DICTIONARIES } from "@/locales"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Codes de toutes les locales disponibles. */
const CODES = ["fr", "en", "es", "de"] as const

// ---------------------------------------------------------------------------
// formatDuration — tests partagés par toutes les locales
// ---------------------------------------------------------------------------

describe("formatDuration (toutes locales)", () => {
  it("retourne une valeur non vide pour 1 heure pile", () => {
    for (const code of CODES) {
      const result = DICTIONARIES[code].printSummary.formatDuration(1)
      expect(result.length).toBeGreaterThan(0)
    }
  })

  it("retourne une valeur non vide pour 1,5 heure", () => {
    for (const code of CODES) {
      const result = DICTIONARIES[code].printSummary.formatDuration(1.5)
      expect(result.length).toBeGreaterThan(0)
    }
  })

  it("retourne une valeur non vide pour 0,5 heure (30 min)", () => {
    for (const code of CODES) {
      const result = DICTIONARIES[code].printSummary.formatDuration(0.5)
      expect(result.length).toBeGreaterThan(0)
    }
  })

  it("gère une durée nulle (retourne la valeur de repos, non vide)", () => {
    for (const code of CODES) {
      const result = DICTIONARIES[code].printSummary.formatDuration(0)
      expect(result.length).toBeGreaterThan(0)
    }
  })

  it("gère une durée négative (traitée comme durée nulle ou zéro)", () => {
    for (const code of CODES) {
      const result = DICTIONARIES[code].printSummary.formatDuration(-1)
      expect(result.length).toBeGreaterThan(0)
    }
  })

  it("gère NaN (retourne la valeur de repos)", () => {
    for (const code of CODES) {
      const result = DICTIONARIES[code].printSummary.formatDuration(Number.NaN)
      expect(result.length).toBeGreaterThan(0)
    }
  })

  it("gère Infinity (retourne la valeur de repos)", () => {
    for (const code of CODES) {
      const result = DICTIONARIES[code].printSummary.formatDuration(
        Number.POSITIVE_INFINITY,
      )
      expect(result.length).toBeGreaterThan(0)
    }
  })
})

// ---------------------------------------------------------------------------
// formatDuration FR — comportement précis de référence
// ---------------------------------------------------------------------------

describe("formatDuration FR — comportement précis", () => {
  const fmt = DICTIONARIES.fr.printSummary.formatDuration

  it("retourne « 0 h » pour 0", () => {
    expect(fmt(0)).toBe("0 h")
  })

  it("retourne « 0 h » pour une durée négative", () => {
    expect(fmt(-5)).toBe("0 h")
  })

  it("retourne « 0 h » pour NaN", () => {
    expect(fmt(Number.NaN)).toBe("0 h")
  })

  it("retourne « 1 h » pour 1 heure exacte", () => {
    expect(fmt(1)).toBe("1 h")
  })

  it("retourne « 2 h » pour 2 heures exactes", () => {
    expect(fmt(2)).toBe("2 h")
  })

  it("retourne « 30 min » pour 0,5 heure", () => {
    expect(fmt(0.5)).toBe("30 min")
  })

  it("retourne « 1 h 30 min » pour 1,5 heure", () => {
    expect(fmt(1.5)).toBe("1 h 30 min")
  })

  it("retourne « 2 h 15 min » pour 2,25 heures", () => {
    expect(fmt(2.25)).toBe("2 h 15 min")
  })

  it("retourne « 10 h » pour 10 heures (impression longue)", () => {
    expect(fmt(10)).toBe("10 h")
  })

  it("retourne « 24 h » pour 24 heures", () => {
    expect(fmt(24)).toBe("24 h")
  })

  it("arrondit les minutes au plus proche (0,583 h ≈ 35 min)", () => {
    // 0,583… h = 35 min exactement
    expect(fmt(35 / 60)).toBe("35 min")
  })
})

// ---------------------------------------------------------------------------
// formatDuration EN — comportement de référence
// ---------------------------------------------------------------------------

describe("formatDuration EN — comportement précis", () => {
  const fmt = DICTIONARIES.en.printSummary.formatDuration

  it("retourne « 0 h » pour 0", () => {
    expect(fmt(0)).toBe("0 h")
  })

  it("retourne « 1 h » pour 1 heure", () => {
    expect(fmt(1)).toBe("1 h")
  })

  it("retourne « 30 min » pour 0,5 heure", () => {
    expect(fmt(0.5)).toBe("30 min")
  })

  it("retourne « 1 h 30 min » pour 1,5 heure", () => {
    expect(fmt(1.5)).toBe("1 h 30 min")
  })
})

// ---------------------------------------------------------------------------
// formatDuration DE — comportement spécifique (Std. / Min.)
// ---------------------------------------------------------------------------

describe("formatDuration DE — comportement spécifique", () => {
  const fmt = DICTIONARIES.de.printSummary.formatDuration

  it("retourne « 0 Std. » pour 0", () => {
    expect(fmt(0)).toBe("0 Std.")
  })

  it("retourne « 1 Std. » pour 1 heure", () => {
    expect(fmt(1)).toBe("1 Std.")
  })

  it("retourne « 30 Min. » pour 0,5 heure", () => {
    expect(fmt(0.5)).toBe("30 Min.")
  })

  it("retourne « 1 Std. 30 Min. » pour 1,5 heure", () => {
    expect(fmt(1.5)).toBe("1 Std. 30 Min.")
  })
})

// ---------------------------------------------------------------------------
// formatDuration ES — comportement de référence
// ---------------------------------------------------------------------------

describe("formatDuration ES — comportement précis", () => {
  const fmt = DICTIONARIES.es.printSummary.formatDuration

  it("retourne « 0 h » pour 0", () => {
    expect(fmt(0)).toBe("0 h")
  })

  it("retourne « 1 h » pour 1 heure", () => {
    expect(fmt(1)).toBe("1 h")
  })

  it("retourne « 30 min » pour 0,5 heure", () => {
    expect(fmt(0.5)).toBe("30 min")
  })

  it("retourne « 1 h 30 min » pour 1,5 heure", () => {
    expect(fmt(1.5)).toBe("1 h 30 min")
  })
})

// ---------------------------------------------------------------------------
// formatDate — tests de robustesse partagés par toutes les locales
// ---------------------------------------------------------------------------

describe("formatDate (toutes locales) — robustesse", () => {
  const dateRef = new Date(2025, 7, 1, 14, 30) // 1er août 2025 à 14h30

  it("retourne une chaîne non vide pour une date valide", () => {
    for (const code of CODES) {
      const result = DICTIONARIES[code].printSummary.formatDate(dateRef)
      expect(typeof result).toBe("string")
      expect(result.length).toBeGreaterThan(0)
    }
  })

  it("contient l'année 2025 pour toutes les locales", () => {
    for (const code of CODES) {
      const result = DICTIONARIES[code].printSummary.formatDate(dateRef)
      expect(result).toContain("2025")
    }
  })
})

// ---------------------------------------------------------------------------
// generatedAt — teste la fonction d'encapsulation de date
// ---------------------------------------------------------------------------

describe("generatedAt (toutes locales)", () => {
  it("intègre la chaîne de date dans le résultat", () => {
    const dateStr = "1 août 2025 à 14:30"
    for (const code of CODES) {
      const result = DICTIONARIES[code].printSummary.generatedAt(dateStr)
      expect(result).toContain(dateStr)
      expect(result.length).toBeGreaterThan(dateStr.length)
    }
  })
})

// ---------------------------------------------------------------------------
// hintEstimated — teste la fonction de texte de l'indicateur de puissance
// ---------------------------------------------------------------------------

describe("hintEstimated printerSelector (toutes locales)", () => {
  it("intègre la puissance en watts dans le texte", () => {
    for (const code of CODES) {
      const result = DICTIONARIES[code].printerSelector.hintEstimated(120)
      expect(result).toContain("120")
    }
  })

  it("fonctionne avec une puissance de 0 W", () => {
    for (const code of CODES) {
      const result = DICTIONARIES[code].printerSelector.hintEstimated(0)
      expect(result).toContain("0")
    }
  })
})
