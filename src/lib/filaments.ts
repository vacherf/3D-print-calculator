/**
 * Référentiel des filaments d'impression 3D les plus courants.
 *
 * Les prix sont des moyennes constatées sur le marché français en 2025 pour
 * une bobine standard de 1 kg (diamètre 1,75 mm), marques grand public.
 * Ils servent de valeurs par défaut : l'utilisateur peut toujours saisir le
 * prix exact de sa propre bobine.
 *
 * `density` (g/cm³) permet de convertir une longueur de filament en masse,
 * utile lorsque le slicer ne donne qu'une longueur.
 */

export type FilamentId =
  | "pla"
  | "petg"
  | "abs"
  | "asa"
  | "tpu"
  | "nylon"
  | "pla-cf"
  | "custom"

export interface Filament {
  id: FilamentId
  /** Nom affiché. */
  name: string
  /** Description courte de l'usage typique. */
  description: string
  /** Prix moyen indicatif d'une bobine de 1 kg, en euros TTC. */
  pricePerKg: number
  /** Masse volumique en g/cm³ (pour la conversion longueur ↔ masse). */
  density: number
}

export const FILAMENTS: Filament[] = [
  {
    id: "pla",
    name: "PLA",
    description: "Le plus courant, facile à imprimer, objets décoratifs.",
    pricePerKg: 22,
    density: 1.24,
  },
  {
    id: "petg",
    name: "PETG",
    description: "Résistant et un peu souple, pièces fonctionnelles.",
    pricePerKg: 25,
    density: 1.27,
  },
  {
    id: "abs",
    name: "ABS",
    description: "Résistant à la chaleur, nécessite un caisson.",
    pricePerKg: 25,
    density: 1.04,
  },
  {
    id: "asa",
    name: "ASA",
    description: "Comme l'ABS mais résistant aux UV, usage extérieur.",
    pricePerKg: 30,
    density: 1.07,
  },
  {
    id: "tpu",
    name: "TPU (flexible)",
    description: "Caoutchouteux, joints, coques de protection.",
    pricePerKg: 35,
    density: 1.21,
  },
  {
    id: "nylon",
    name: "Nylon (PA)",
    description: "Très résistant et résilient, pièces techniques.",
    pricePerKg: 40,
    density: 1.14,
  },
  {
    id: "pla-cf",
    name: "PLA fibre de carbone",
    description: "Rigide et esthétique mat, plus abrasif.",
    pricePerKg: 35,
    density: 1.3,
  },
  {
    id: "custom",
    name: "Personnalisé",
    description: "Saisissez votre propre prix au kilo.",
    pricePerKg: 25,
    density: 1.24,
  },
]

export const DEFAULT_FILAMENT_ID: FilamentId = "pla"

export function getFilament(id: FilamentId): Filament {
  const found = FILAMENTS.find((f) => f.id === id)
  if (!found) {
    throw new Error(`Filament inconnu : ${id}`)
  }
  return found
}
