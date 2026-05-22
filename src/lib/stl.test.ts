import { describe, it, expect } from "vitest"

import {
  analyzeStl,
  estimateFilamentGrams,
  estimatePrintHours,
  StlParseError,
} from "@/lib/stl"

/** Les 12 triangles d'un cube de 10 mm (volume 1 cm³, surface 6 cm²). */
const CUBE_TRIANGLES: number[][] = [
  [0, 0, 0, 10, 10, 0, 10, 0, 0],
  [0, 0, 0, 0, 10, 0, 10, 10, 0],
  [0, 0, 10, 10, 0, 10, 10, 10, 10],
  [0, 0, 10, 10, 10, 10, 0, 10, 10],
  [0, 0, 0, 10, 0, 0, 10, 0, 10],
  [0, 0, 0, 10, 0, 10, 0, 0, 10],
  [0, 10, 0, 0, 10, 10, 10, 10, 10],
  [0, 10, 0, 10, 10, 10, 10, 10, 0],
  [0, 0, 0, 0, 0, 10, 0, 10, 10],
  [0, 0, 0, 0, 10, 10, 0, 10, 0],
  [10, 0, 0, 10, 10, 0, 10, 10, 10],
  [10, 0, 0, 10, 10, 10, 10, 0, 10],
]

function buildBinaryCube(): ArrayBuffer {
  const n = CUBE_TRIANGLES.length
  const buffer = new ArrayBuffer(84 + n * 50)
  const dv = new DataView(buffer)
  dv.setUint32(80, n, true)
  let o = 84
  for (const t of CUBE_TRIANGLES) {
    o += 12 // normale ignorée
    for (const c of t) {
      dv.setFloat32(o, c, true)
      o += 4
    }
    o += 2 // attribut
  }
  return buffer
}

function buildAsciiCube(): ArrayBuffer {
  let s = "solid cube\n"
  for (const t of CUBE_TRIANGLES) {
    s += "facet normal 0 0 0\n outer loop\n"
    s += `  vertex ${t[0]} ${t[1]} ${t[2]}\n`
    s += `  vertex ${t[3]} ${t[4]} ${t[5]}\n`
    s += `  vertex ${t[6]} ${t[7]} ${t[8]}\n`
    s += " endloop\nendfacet\n"
  }
  s += "endsolid cube\n"
  return new TextEncoder().encode(s).buffer
}

describe("analyzeStl", () => {
  it("analyse un cube binaire (volume 1 cm³, surface 6 cm², 10×10×10 mm)", () => {
    const a = analyzeStl(buildBinaryCube())
    expect(a.triangleCount).toBe(12)
    expect(a.volumeCm3).toBeCloseTo(1, 5)
    expect(a.surfaceAreaCm2).toBeCloseTo(6, 5)
    expect(a.bounds).toEqual({ x: 10, y: 10, z: 10 })
  })

  it("donne le même résultat pour le format ASCII", () => {
    const a = analyzeStl(buildAsciiCube())
    expect(a.triangleCount).toBe(12)
    expect(a.volumeCm3).toBeCloseTo(1, 5)
    expect(a.surfaceAreaCm2).toBeCloseTo(6, 5)
    expect(a.bounds).toEqual({ x: 10, y: 10, z: 10 })
  })

  it("rejette un fichier trop petit", () => {
    expect(() => analyzeStl(new ArrayBuffer(8))).toThrow(StlParseError)
  })

  it("rejette un contenu sans triangle", () => {
    const empty = new TextEncoder().encode("solid vide\nendsolid vide\n").buffer
    expect(() => analyzeStl(empty)).toThrow(StlParseError)
  })
})

describe("estimateFilamentGrams", () => {
  const cube = () => analyzeStl(buildBinaryCube())

  it("applique le modèle coque + remplissage", () => {
    const { grams, extrudedVolumeCm3 } = estimateFilamentGrams(cube(), {
      density: 1.24,
      infillPercent: 15,
    })
    // coque = min(6 × 0,12, 1) = 0,72 ; cœur = 0,28 ; extrudé = 0,72 + 0,28×0,15
    expect(extrudedVolumeCm3).toBeCloseTo(0.762, 5)
    expect(grams).toBeCloseTo(0.762 * 1.24, 5)
  })

  it("ne dépasse jamais le volume solide (coque plafonnée)", () => {
    const { extrudedVolumeCm3 } = estimateFilamentGrams(cube(), {
      density: 1.24,
      infillPercent: 100,
      wallThicknessMm: 50, // paroi absurde → coque = volume entier
    })
    expect(extrudedVolumeCm3).toBeCloseTo(1, 5)
  })
})

describe("estimatePrintHours", () => {
  it("convertit le volume extrudé en heures via le débit", () => {
    // 0,762 cm³ = 762 mm³ ; à 10 mm³/s → 76,2 s ≈ 0,0212 h
    expect(estimatePrintHours(0.762)).toBeCloseTo(762 / 10 / 3600, 6)
  })
})
