import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"

import {
  SUPPORTED_LOCALES,
  DICTIONARIES,
  DEFAULT_LOCALE,
  LANG_STORAGE_KEY,
  loadLocale,
  saveLocale,
  type Locale,
} from "@/locales"

const CODES: Locale[] = ["fr", "en", "es", "de"]

/**
 * Fabrique un faux `localStorage` en mémoire pour les tests Node
 * (l'environnement Vitest est `node`, sans DOM ni Web Storage).
 */
function createMemoryStorage() {
  const store = new Map<string, string>()
  return {
    getItem: vi.fn((k: string) => (store.has(k) ? store.get(k)! : null)),
    setItem: vi.fn((k: string, v: string) => {
      store.set(k, v)
    }),
    removeItem: vi.fn((k: string) => {
      store.delete(k)
    }),
    clear: vi.fn(() => store.clear()),
    _store: store,
  }
}

describe("SUPPORTED_LOCALES", () => {
  it("liste les quatre langues fr / en / es / de dans l'ordre", () => {
    expect(SUPPORTED_LOCALES.map((l) => l.code)).toEqual(CODES)
  })

  it("renseigne label, labelNative et pays pour chaque langue", () => {
    for (const l of SUPPORTED_LOCALES) {
      expect(l.label.length).toBeGreaterThan(0)
      expect(l.labelNative.length).toBeGreaterThan(0)
      expect(l.country).toMatch(/^[A-Z]{2}$/)
    }
  })

  it("associe l'anglais au drapeau GB", () => {
    const en = SUPPORTED_LOCALES.find((l) => l.code === "en")
    expect(en?.country).toBe("GB")
  })
})

describe("DICTIONARIES", () => {
  it("expose un dictionnaire pour chaque langue supportée", () => {
    for (const code of CODES) {
      expect(DICTIONARIES[code]).toBeDefined()
    }
  })

  it("a exactement les clés correspondant à SUPPORTED_LOCALES", () => {
    expect(new Set(Object.keys(DICTIONARIES))).toEqual(
      new Set(SUPPORTED_LOCALES.map((l) => l.code)),
    )
  })

  it("partage la même structure de clés entre toutes les langues", () => {
    // On compare l'ensemble des chemins de clés à plat avec la langue de
    // référence (fr) pour détecter une traduction incomplète.
    const paths = (obj: unknown, prefix = ""): string[] => {
      if (typeof obj !== "object" || obj === null) return [prefix]
      return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
        paths(v, prefix ? `${prefix}.${k}` : k),
      )
    }
    const reference = paths(DICTIONARIES.fr).sort()
    for (const code of CODES) {
      expect(paths(DICTIONARIES[code]).sort()).toEqual(reference)
    }
  })

  it("ne contient aucune valeur de traduction vide", () => {
    const collectValues = (obj: unknown): string[] => {
      if (typeof obj === "string") return [obj]
      if (typeof obj !== "object" || obj === null) return []
      return Object.values(obj as Record<string, unknown>).flatMap(collectValues)
    }
    for (const code of CODES) {
      for (const v of collectValues(DICTIONARIES[code])) {
        expect(v.trim().length).toBeGreaterThan(0)
      }
    }
  })
})

describe("DEFAULT_LOCALE", () => {
  it("vaut « fr »", () => {
    expect(DEFAULT_LOCALE).toBe("fr")
  })

  it("fait partie des langues supportées", () => {
    expect(CODES).toContain(DEFAULT_LOCALE)
  })
})

describe("loadLocale / saveLocale", () => {
  let storage: ReturnType<typeof createMemoryStorage>

  beforeEach(() => {
    storage = createMemoryStorage()
    vi.stubGlobal("localStorage", storage)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("retourne null quand aucune préférence n'est stockée", () => {
    expect(loadLocale()).toBeNull()
  })

  it("relit chaque langue valide enregistrée par saveLocale", () => {
    for (const code of CODES) {
      saveLocale(code)
      expect(loadLocale()).toBe(code)
    }
  })

  it("écrit sous la clé dédiée LANG_STORAGE_KEY", () => {
    saveLocale("es")
    expect(storage._store.get(LANG_STORAGE_KEY)).toBe("es")
  })

  it("rejette une valeur stockée invalide (retourne null)", () => {
    storage._store.set(LANG_STORAGE_KEY, "it")
    expect(loadLocale()).toBeNull()
  })

  it("rejette une chaîne vide stockée", () => {
    storage._store.set(LANG_STORAGE_KEY, "")
    expect(loadLocale()).toBeNull()
  })

  it("retourne null sans planter si la lecture du localStorage échoue", () => {
    storage.getItem.mockImplementation(() => {
      throw new Error("accès refusé (mode privé)")
    })
    expect(loadLocale()).toBeNull()
  })

  it("ignore silencieusement une erreur d'écriture", () => {
    storage.setItem.mockImplementation(() => {
      throw new Error("quota dépassé")
    })
    expect(() => saveLocale("de")).not.toThrow()
  })
})
