import { describe, it, expect } from "vitest"

import {
  ELECTRICITY_TARIFFS,
  DEFAULT_ELECTRICITY_PRICE,
} from "@/lib/electricity"

describe("ELECTRICITY_TARIFFS", () => {
  it("contient les trois options Tarif Bleu (base, hp, hc)", () => {
    const ids = ELECTRICITY_TARIFFS.map((t) => t.id)
    expect(ids).toEqual(["base", "hp", "hc"])
  })

  it("expose un id, un libellé et un prix pour chaque tarif", () => {
    for (const t of ELECTRICITY_TARIFFS) {
      expect(typeof t.id).toBe("string")
      expect(t.id.length).toBeGreaterThan(0)
      expect(typeof t.label).toBe("string")
      expect(t.label.length).toBeGreaterThan(0)
      expect(typeof t.pricePerKwh).toBe("number")
    }
  })

  it("a des prix au kWh finis et strictement positifs", () => {
    for (const t of ELECTRICITY_TARIFFS) {
      expect(Number.isFinite(t.pricePerKwh)).toBe(true)
      expect(t.pricePerKwh).toBeGreaterThan(0)
    }
  })

  it("a des identifiants uniques", () => {
    const ids = ELECTRICITY_TARIFFS.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("place les heures creuses moins chères que les heures pleines", () => {
    const hp = ELECTRICITY_TARIFFS.find((t) => t.id === "hp")
    const hc = ELECTRICITY_TARIFFS.find((t) => t.id === "hc")
    expect(hp).toBeDefined()
    expect(hc).toBeDefined()
    expect(hc!.pricePerKwh).toBeLessThan(hp!.pricePerKwh)
  })
})

describe("DEFAULT_ELECTRICITY_PRICE", () => {
  it("correspond au prix de l'option Base", () => {
    const base = ELECTRICITY_TARIFFS.find((t) => t.id === "base")
    expect(base).toBeDefined()
    expect(DEFAULT_ELECTRICITY_PRICE).toBe(base!.pricePerKwh)
  })

  it("est un nombre fini strictement positif", () => {
    expect(Number.isFinite(DEFAULT_ELECTRICITY_PRICE)).toBe(true)
    expect(DEFAULT_ELECTRICITY_PRICE).toBeGreaterThan(0)
  })
})
