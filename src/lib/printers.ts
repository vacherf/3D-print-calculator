/**
 * Référentiel des imprimantes 3D FDM les plus répandues.
 *
 * `avgPowerW` correspond à la puissance *moyenne réellement consommée* pendant
 * une impression en régime établi (chauffe du plateau + buse + moteurs +
 * électronique), en watts. Ce n'est ni la puissance crête (atteinte lors de la
 * chauffe initiale) ni la puissance nominale de l'alimentation : c'est une
 * moyenne représentative servant à estimer le coût de l'énergie.
 *
 * Les valeurs sont des ordres de grandeur constatés ; un caisson fermé et un
 * grand plateau chauffant tirent davantage. L'option « Personnalisé » permet
 * de saisir sa propre valeur (wattmètre).
 */

export type PrinterId =
  | "bambu-a1-mini"
  | "bambu-a1"
  | "bambu-p1p"
  | "bambu-p1s"
  | "bambu-x1c"
  | "prusa-mini"
  | "prusa-mk4s"
  | "prusa-mk3s"
  | "prusa-core-one"
  | "prusa-xl"
  | "ender-3-v2"
  | "ender-3-s1"
  | "ender-3-v3"
  | "creality-k1"
  | "creality-k1-max"
  | "anycubic-kobra-2"
  | "anycubic-kobra-3"
  | "elegoo-neptune-4"
  | "elegoo-neptune-4-pro"
  | "custom"

export interface Printer {
  id: PrinterId
  /** Nom du modèle affiché. */
  name: string
  /** Marque, utilisée pour regrouper la liste déroulante. */
  brand: string
  /** Puissance moyenne consommée en impression, en watts. */
  avgPowerW: number
}

export const PRINTERS: Printer[] = [
  // --- Bambu Lab ---
  { id: "bambu-a1-mini", name: "A1 mini", brand: "Bambu Lab", avgPowerW: 95 },
  { id: "bambu-a1", name: "A1", brand: "Bambu Lab", avgPowerW: 110 },
  { id: "bambu-p1p", name: "P1P", brand: "Bambu Lab", avgPowerW: 125 },
  { id: "bambu-p1s", name: "P1S", brand: "Bambu Lab", avgPowerW: 140 },
  { id: "bambu-x1c", name: "X1 Carbon", brand: "Bambu Lab", avgPowerW: 150 },

  // --- Prusa Research ---
  { id: "prusa-mini", name: "MINI+", brand: "Prusa", avgPowerW: 70 },
  { id: "prusa-mk4s", name: "MK4S", brand: "Prusa", avgPowerW: 110 },
  { id: "prusa-mk3s", name: "MK3S+", brand: "Prusa", avgPowerW: 120 },
  { id: "prusa-core-one", name: "CORE One", brand: "Prusa", avgPowerW: 140 },
  { id: "prusa-xl", name: "XL (1 tête)", brand: "Prusa", avgPowerW: 160 },

  // --- Creality ---
  { id: "ender-3-v2", name: "Ender 3 V2", brand: "Creality", avgPowerW: 130 },
  { id: "ender-3-s1", name: "Ender 3 S1", brand: "Creality", avgPowerW: 140 },
  { id: "ender-3-v3", name: "Ender 3 V3", brand: "Creality", avgPowerW: 110 },
  { id: "creality-k1", name: "K1", brand: "Creality", avgPowerW: 160 },
  { id: "creality-k1-max", name: "K1 Max", brand: "Creality", avgPowerW: 200 },

  // --- Anycubic ---
  { id: "anycubic-kobra-2", name: "Kobra 2", brand: "Anycubic", avgPowerW: 120 },
  { id: "anycubic-kobra-3", name: "Kobra 3", brand: "Anycubic", avgPowerW: 120 },

  // --- Elegoo ---
  { id: "elegoo-neptune-4", name: "Neptune 4", brand: "Elegoo", avgPowerW: 120 },
  { id: "elegoo-neptune-4-pro", name: "Neptune 4 Pro", brand: "Elegoo", avgPowerW: 130 },

  // --- Autre ---
  { id: "custom", name: "Autre / Personnalisé", brand: "Autre", avgPowerW: 120 },
]

export const DEFAULT_PRINTER_ID: PrinterId = "bambu-a1"

export function getPrinter(id: PrinterId): Printer {
  const found = PRINTERS.find((p) => p.id === id)
  if (!found) {
    throw new Error(`Imprimante inconnue : ${id}`)
  }
  return found
}

/** Marques dans l'ordre d'apparition, pour regrouper la liste déroulante. */
export const PRINTER_BRANDS: string[] = [...new Set(PRINTERS.map((p) => p.brand))]
