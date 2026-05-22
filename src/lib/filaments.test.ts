import { describe, it, expect } from "vitest"

import {
  FILAMENTS,
  DEFAULT_FILAMENT_ID,
  getFilament,
  type FilamentId,
} from "@/lib/filaments"

describe("FILAMENTS", () => {
  it("expose les identifiants attendus dans l'ordre", () => {
    const ids = FILAMENTS.map((f) => f.id)
    expect(ids).toEqual([
      "pla",
      "petg",
      "abs",
      "asa",
      "tpu",
      "nylon",
      "pla-cf",
      "custom",
    ])
  })

  it("a des identifiants uniques", () => {
    const ids = FILAMENTS.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("renseigne nom, description, prix et densité pour chaque filament", () => {
    for (const f of FILAMENTS) {
      expect(f.name.length).toBeGreaterThan(0)
      expect(f.description.length).toBeGreaterThan(0)
      expect(Number.isFinite(f.pricePerKg)).toBe(true)
      expect(f.pricePerKg).toBeGreaterThan(0)
      expect(Number.isFinite(f.density)).toBe(true)
      expect(f.density).toBeGreaterThan(0)
    }
  })

  it("contient une option « custom » personnalisable", () => {
    const custom = FILAMENTS.find((f) => f.id === "custom")
    expect(custom).toBeDefined()
  })

  it("donne au PLA une densité de 1,24 g/cm³", () => {
    const pla = FILAMENTS.find((f) => f.id === "pla")
    expect(pla?.density).toBeCloseTo(1.24, 5)
  })
})

describe("DEFAULT_FILAMENT_ID", () => {
  it("vaut « pla »", () => {
    expect(DEFAULT_FILAMENT_ID).toBe("pla")
  })

  it("correspond à un filament existant", () => {
    expect(FILAMENTS.some((f) => f.id === DEFAULT_FILAMENT_ID)).toBe(true)
  })
})

describe("getFilament", () => {
  it("récupère un filament par son identifiant", () => {
    const petg = getFilament("petg")
    expect(petg.id).toBe("petg")
    expect(petg.name).toBe("PETG")
  })

  it("retourne la même référence que celle du référentiel", () => {
    const fromList = FILAMENTS.find((f) => f.id === "abs")
    expect(getFilament("abs")).toBe(fromList)
  })

  it("récupère chacun des identifiants déclarés", () => {
    for (const f of FILAMENTS) {
      expect(getFilament(f.id).id).toBe(f.id)
    }
  })

  it("lève une erreur explicite pour un identifiant inconnu", () => {
    expect(() => getFilament("inconnu" as FilamentId)).toThrow(
      /Filament inconnu/,
    )
  })
})
