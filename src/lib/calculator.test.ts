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
})
