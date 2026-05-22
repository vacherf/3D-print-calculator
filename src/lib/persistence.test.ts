import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"

import {
  loadState,
  saveState,
  clearState,
  STORAGE_KEY,
  type PersistedState,
} from "@/lib/persistence"

/**
 * Faux `localStorage` en mémoire — l'environnement Vitest est `node`,
 * sans Web Storage. On le stube via `vi` plutôt que d'ajouter jsdom.
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

/** État valide de référence. */
const validState: PersistedState = {
  filamentId: "pla",
  pricePerKg: 22,
  filamentGrams: 50,
  printHours: 3,
  printerId: "bambu-a1",
  printerPowerW: 110,
  electricityPricePerKwh: 0.1952,
  wastePercent: 5,
  marginPercent: 0,
}

describe("persistence", () => {
  let storage: ReturnType<typeof createMemoryStorage>

  beforeEach(() => {
    storage = createMemoryStorage()
    vi.stubGlobal("localStorage", storage)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe("aller-retour saveState / loadState", () => {
    it("relit fidèlement un état valide enregistré", () => {
      saveState(validState)
      expect(loadState()).toEqual(validState)
    })

    it("écrit sous la clé versionnée STORAGE_KEY", () => {
      saveState(validState)
      expect(storage._store.has(STORAGE_KEY)).toBe(true)
    })

    it("autorise 0 pour la gâche et la marge (pourcentages)", () => {
      const s = { ...validState, wastePercent: 0, marginPercent: 0 }
      saveState(s)
      expect(loadState()).toEqual(s)
    })
  })

  describe("loadState — robustesse", () => {
    it("retourne null en l'absence de données", () => {
      expect(loadState()).toBeNull()
    })

    it("retourne null sur un JSON corrompu", () => {
      storage._store.set(STORAGE_KEY, "{ ceci n'est pas du json")
      expect(loadState()).toBeNull()
    })

    it("retourne null si un champ requis manque", () => {
      const { pricePerKg: _omit, ...partial } = validState
      void _omit
      storage._store.set(STORAGE_KEY, JSON.stringify(partial))
      expect(loadState()).toBeNull()
    })

    it("retourne null pour un identifiant de filament inconnu", () => {
      storage._store.set(
        STORAGE_KEY,
        JSON.stringify({ ...validState, filamentId: "inconnu" }),
      )
      expect(loadState()).toBeNull()
    })

    it("retourne null pour un identifiant d'imprimante inconnu", () => {
      storage._store.set(
        STORAGE_KEY,
        JSON.stringify({ ...validState, printerId: "inconnu" }),
      )
      expect(loadState()).toBeNull()
    })

    it("rejette une valeur négative pour un champ devant être positif", () => {
      storage._store.set(
        STORAGE_KEY,
        JSON.stringify({ ...validState, pricePerKg: -1 }),
      )
      expect(loadState()).toBeNull()
    })

    it("rejette zéro pour un champ devant être strictement positif", () => {
      storage._store.set(
        STORAGE_KEY,
        JSON.stringify({ ...validState, filamentGrams: 0 }),
      )
      expect(loadState()).toBeNull()
    })

    it("rejette une gâche négative", () => {
      storage._store.set(
        STORAGE_KEY,
        JSON.stringify({ ...validState, wastePercent: -1 }),
      )
      expect(loadState()).toBeNull()
    })

    it("rejette un champ numérique de type incorrect (string)", () => {
      storage._store.set(
        STORAGE_KEY,
        JSON.stringify({ ...validState, printHours: "3" }),
      )
      expect(loadState()).toBeNull()
    })

    it("rejette une valeur non finie (NaN sérialisé en null)", () => {
      // JSON.stringify(NaN) === "null" → champ non numérique → invalide
      storage._store.set(
        STORAGE_KEY,
        JSON.stringify({ ...validState, printerPowerW: Number.NaN }),
      )
      expect(loadState()).toBeNull()
    })

    it("retourne null pour une valeur primitive non objet", () => {
      storage._store.set(STORAGE_KEY, JSON.stringify(42))
      expect(loadState()).toBeNull()
    })

    it("retourne null sans planter si la lecture échoue", () => {
      storage.getItem.mockImplementation(() => {
        throw new Error("accès refusé")
      })
      expect(loadState()).toBeNull()
    })
  })

  describe("clearState", () => {
    it("supprime l'entrée persistée", () => {
      saveState(validState)
      clearState()
      expect(loadState()).toBeNull()
    })

    it("ne plante pas si la suppression échoue", () => {
      storage.removeItem.mockImplementation(() => {
        throw new Error("indisponible")
      })
      expect(() => clearState()).not.toThrow()
    })
  })

  describe("saveState — robustesse", () => {
    it("ignore silencieusement une erreur d'écriture (quota, mode privé)", () => {
      storage.setItem.mockImplementation(() => {
        throw new Error("quota dépassé")
      })
      expect(() => saveState(validState)).not.toThrow()
    })
  })

  describe("loadState — cas limites supplémentaires", () => {
    it("retourne null pour un tableau JSON au lieu d'un objet", () => {
      storage._store.set(STORAGE_KEY, JSON.stringify([1, 2, 3]))
      expect(loadState()).toBeNull()
    })

    it("retourne null pour une chaîne JSON simple (non objet)", () => {
      storage._store.set(STORAGE_KEY, JSON.stringify("valeur"))
      expect(loadState()).toBeNull()
    })

    it("retourne null pour un objet vide {}", () => {
      storage._store.set(STORAGE_KEY, JSON.stringify({}))
      expect(loadState()).toBeNull()
    })

    it("retourne null si filamentId est null", () => {
      storage._store.set(
        STORAGE_KEY,
        JSON.stringify({ ...validState, filamentId: null }),
      )
      expect(loadState()).toBeNull()
    })

    it("retourne null si marginPercent est un flottant négatif", () => {
      storage._store.set(
        STORAGE_KEY,
        JSON.stringify({ ...validState, marginPercent: -0.01 }),
      )
      expect(loadState()).toBeNull()
    })

    it("accepte marginPercent = 100 (marge maximale autorisée)", () => {
      const s = { ...validState, marginPercent: 100 }
      saveState(s)
      expect(loadState()).toEqual(s)
    })

    it("accepte wastePercent = 100 (gâche maximale autorisée)", () => {
      const s = { ...validState, wastePercent: 100 }
      saveState(s)
      expect(loadState()).toEqual(s)
    })

    it("accepte des valeurs décimales réalistes (prix au kWh)", () => {
      const s = { ...validState, electricityPricePerKwh: 0.2065 }
      saveState(s)
      const loaded = loadState()
      expect(loaded?.electricityPricePerKwh).toBeCloseTo(0.2065, 5)
    })

    it("retourne null si printerPowerW est 0", () => {
      storage._store.set(
        STORAGE_KEY,
        JSON.stringify({ ...validState, printerPowerW: 0 }),
      )
      expect(loadState()).toBeNull()
    })

    it("retourne null si electricityPricePerKwh est 0", () => {
      storage._store.set(
        STORAGE_KEY,
        JSON.stringify({ ...validState, electricityPricePerKwh: 0 }),
      )
      expect(loadState()).toBeNull()
    })

    it("retourne null si printHours est une valeur Infinity (sérialisée en null)", () => {
      storage._store.set(
        STORAGE_KEY,
        JSON.stringify({ ...validState, printHours: null }),
      )
      expect(loadState()).toBeNull()
    })
  })

  describe("aller-retour saveState / loadState — variantes d'imprimantes", () => {
    it("persiste et relit l'imprimante « custom »", () => {
      const s = { ...validState, printerId: "custom" as const }
      saveState(s)
      expect(loadState()).toEqual(s)
    })

    it("persiste et relit une imprimante Prusa", () => {
      const s = { ...validState, printerId: "prusa-mk4s" as const }
      saveState(s)
      expect(loadState()).toEqual(s)
    })
  })
})
