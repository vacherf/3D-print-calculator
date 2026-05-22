import { describe, it, expect } from "vitest"

import {
  PRINTERS,
  PRINTER_BRANDS,
  DEFAULT_PRINTER_ID,
  getPrinter,
  type PrinterId,
} from "@/lib/printers"

describe("PRINTERS", () => {
  it("a des identifiants uniques", () => {
    const ids = PRINTERS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("renseigne nom, marque et puissance moyenne pour chaque imprimante", () => {
    for (const p of PRINTERS) {
      expect(p.name.length).toBeGreaterThan(0)
      expect(p.brand.length).toBeGreaterThan(0)
      expect(Number.isFinite(p.avgPowerW)).toBe(true)
      expect(p.avgPowerW).toBeGreaterThan(0)
    }
  })

  it("contient une option « custom » personnalisable", () => {
    expect(PRINTERS.some((p) => p.id === "custom")).toBe(true)
  })
})

describe("PRINTER_BRANDS", () => {
  it("liste les marques sans doublon, dans l'ordre d'apparition", () => {
    expect(PRINTER_BRANDS).toEqual([
      "Bambu Lab",
      "Prusa",
      "Creality",
      "Anycubic",
      "Elegoo",
      "Autre",
    ])
  })

  it("couvre exactement l'ensemble des marques présentes dans PRINTERS", () => {
    const fromPrinters = new Set(PRINTERS.map((p) => p.brand))
    expect(new Set(PRINTER_BRANDS)).toEqual(fromPrinters)
  })
})

describe("DEFAULT_PRINTER_ID", () => {
  it("vaut « bambu-a1 »", () => {
    expect(DEFAULT_PRINTER_ID).toBe("bambu-a1")
  })

  it("correspond à une imprimante existante", () => {
    expect(PRINTERS.some((p) => p.id === DEFAULT_PRINTER_ID)).toBe(true)
  })
})

describe("getPrinter", () => {
  it("récupère une imprimante par son identifiant", () => {
    const p = getPrinter("bambu-x1c")
    expect(p.id).toBe("bambu-x1c")
    expect(p.name).toBe("X1 Carbon")
    expect(p.avgPowerW).toBe(150)
  })

  it("retourne la même référence que celle du référentiel", () => {
    const fromList = PRINTERS.find((p) => p.id === "prusa-mini")
    expect(getPrinter("prusa-mini")).toBe(fromList)
  })

  it("récupère chacun des identifiants déclarés", () => {
    for (const p of PRINTERS) {
      expect(getPrinter(p.id).id).toBe(p.id)
    }
  })

  it("lève une erreur explicite pour un identifiant inconnu", () => {
    expect(() => getPrinter("inconnu" as PrinterId)).toThrow(
      /Imprimante inconnue/,
    )
  })
})
