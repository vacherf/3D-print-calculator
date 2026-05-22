import { describe, it, expect } from "vitest"

import { computeCost, lengthToGrams, type CostInputs } from "@/lib/calculator"

const baseInputs: CostInputs = {
  filamentGrams: 50,
  filamentPricePerKg: 22,
  printHours: 3,
  printerPowerW: 120,
  electricityPricePerKwh: 0.1952,
  wastePercent: 5,
  marginPercent: 0,
}

describe("computeCost", () => {
  it("calcule le coût matière, l'énergie et l'électricité", () => {
    const r = computeCost(baseInputs)
    // 50 g à 22 €/kg = 1,10 €
    expect(r.filamentCost).toBeCloseTo(1.1, 5)
    // 120 W × 3 h = 0,36 kWh
    expect(r.energyKwh).toBeCloseTo(0.36, 5)
    expect(r.electricityCost).toBeCloseTo(0.36 * 0.1952, 5)
  })

  it("applique la gâche à la matière ET à l'énergie", () => {
    const r = computeCost(baseInputs)
    const base = 1.1 + 0.36 * 0.1952
    expect(r.wasteCost).toBeCloseTo(base * 0.05, 5)
    expect(r.costPrice).toBeCloseTo(base * 1.05, 5)
  })

  it("n'ajoute pas de prix de vente quand la marge est nulle", () => {
    const r = computeCost(baseInputs)
    expect(r.marginAmount).toBe(0)
    expect(r.sellingPrice).toBeCloseTo(r.costPrice, 10)
  })

  it("calcule le prix de vente avec une marge", () => {
    const r = computeCost({ ...baseInputs, marginPercent: 20 })
    expect(r.marginAmount).toBeCloseTo(r.costPrice * 0.2, 10)
    expect(r.sellingPrice).toBeCloseTo(r.costPrice * 1.2, 10)
  })

  it("neutralise les entrées invalides ou négatives (traitées comme 0)", () => {
    const r = computeCost({
      ...baseInputs,
      filamentGrams: Number.NaN,
      filamentPricePerKg: -10,
      printHours: 0,
    })
    expect(r.filamentCost).toBe(0)
    expect(r.energyKwh).toBe(0)
    expect(r.electricityCost).toBe(0)
    expect(r.costPrice).toBe(0)
  })

  it("la gâche négative est ramenée à 0", () => {
    const r = computeCost({ ...baseInputs, wastePercent: -50 })
    expect(r.wasteCost).toBe(0)
    expect(r.costPrice).toBeCloseTo(1.1 + 0.36 * 0.1952, 5)
  })
})

describe("computeCost — cas limites supplémentaires", () => {
  it("tous les champs à 0 renvoie un breakdown entièrement nul", () => {
    const r = computeCost({
      filamentGrams: 0,
      filamentPricePerKg: 0,
      printHours: 0,
      printerPowerW: 0,
      electricityPricePerKwh: 0,
      wastePercent: 0,
      marginPercent: 0,
    })
    expect(r.filamentCost).toBe(0)
    expect(r.energyKwh).toBe(0)
    expect(r.electricityCost).toBe(0)
    expect(r.wasteCost).toBe(0)
    expect(r.costPrice).toBe(0)
    expect(r.marginAmount).toBe(0)
    expect(r.sellingPrice).toBe(0)
  })

  it("neutralise un prix d'électricité négatif (traité comme 0)", () => {
    const r = computeCost({ ...baseInputs, electricityPricePerKwh: -0.5 })
    expect(r.electricityCost).toBe(0)
  })

  it("neutralise une puissance imprimante négative (traitée comme 0)", () => {
    const r = computeCost({ ...baseInputs, printerPowerW: -200 })
    expect(r.energyKwh).toBe(0)
    expect(r.electricityCost).toBe(0)
  })

  it("neutralise une durée d'impression Infinity (traitée comme 0)", () => {
    const r = computeCost({
      ...baseInputs,
      printHours: Number.POSITIVE_INFINITY,
    })
    expect(r.energyKwh).toBe(0)
  })

  it("neutralise une masse de filament Infinity (traitée comme 0)", () => {
    const r = computeCost({
      ...baseInputs,
      filamentGrams: Number.POSITIVE_INFINITY,
    })
    expect(r.filamentCost).toBe(0)
  })

  it("marge négative ramenée à 0 : sellingPrice = costPrice", () => {
    const r = computeCost({ ...baseInputs, marginPercent: -30 })
    expect(r.marginAmount).toBe(0)
    expect(r.sellingPrice).toBeCloseTo(r.costPrice, 10)
  })

  it("gâche de 100 % double le coût de base", () => {
    const r = computeCost({ ...baseInputs, wastePercent: 100 })
    const base = 1.1 + 0.36 * 0.1952
    expect(r.costPrice).toBeCloseTo(base * 2, 5)
  })

  it("marge de 100 % double le coût de revient", () => {
    const r = computeCost({ ...baseInputs, marginPercent: 100 })
    expect(r.sellingPrice).toBeCloseTo(r.costPrice * 2, 10)
  })

  it("très grande masse de filament (impression industrielle 1 kg)", () => {
    const r = computeCost({
      ...baseInputs,
      filamentGrams: 1000,
      filamentPricePerKg: 22,
    })
    // 1 000 g × 22 €/kg ÷ 1000 = 22 €
    expect(r.filamentCost).toBeCloseTo(22, 5)
  })

  it("vérifie l'identité sellingPrice = costPrice + marginAmount", () => {
    const r = computeCost({ ...baseInputs, wastePercent: 7, marginPercent: 15 })
    expect(r.sellingPrice).toBeCloseTo(r.costPrice + r.marginAmount, 10)
  })

  it("vérifie l'identité costPrice = baseCost + wasteCost", () => {
    const r = computeCost({ ...baseInputs, wastePercent: 7, marginPercent: 15 })
    const baseCost = r.filamentCost + r.electricityCost
    expect(r.costPrice).toBeCloseTo(baseCost + r.wasteCost, 10)
  })
})

describe("lengthToGrams", () => {
  it("convertit une longueur de filament 1,75 mm en masse", () => {
    // 1 m de PLA (densité 1,24) en 1,75 mm.
    const grams = lengthToGrams(1, 1.75, 1.24)
    expect(grams).toBeCloseTo(2.983, 2)
  })

  it("est proportionnelle à la longueur", () => {
    expect(lengthToGrams(2, 1.75, 1.24)).toBeCloseTo(
      2 * lengthToGrams(1, 1.75, 1.24),
      10,
    )
  })

  it("convertit une longueur de filament 2,85 mm en masse", () => {
    // 1 m de PLA (densité 1,24) en 2,85 mm : rayon = 0,1425 cm
    // volume = π × 0,1425² × 100 ≈ 6,379 cm³ → 6,379 × 1,24 ≈ 7,910 g
    const grams = lengthToGrams(1, 2.85, 1.24)
    const radiusCm = 2.85 / 2 / 10
    const expected = Math.PI * radiusCm * radiusCm * 100 * 1.24
    expect(grams).toBeCloseTo(expected, 5)
  })

  it("est proportionnelle au carré du diamètre", () => {
    // Doubler le diamètre → quadrupler la masse
    const g175 = lengthToGrams(1, 1.75, 1.24)
    const g350 = lengthToGrams(1, 3.5, 1.24)
    expect(g350).toBeCloseTo(g175 * 4, 5)
  })

  it("est proportionnelle à la densité", () => {
    const gLow = lengthToGrams(1, 1.75, 1.0)
    const gHigh = lengthToGrams(1, 1.75, 2.0)
    expect(gHigh).toBeCloseTo(gLow * 2, 10)
  })

  it("retourne 0 pour une longueur nulle", () => {
    expect(lengthToGrams(0, 1.75, 1.24)).toBe(0)
  })

  it("retourne 0 pour un diamètre nul", () => {
    expect(lengthToGrams(1, 0, 1.24)).toBe(0)
  })
})
