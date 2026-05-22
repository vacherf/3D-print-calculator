/**
 * Persistance locale de l'état du calculateur via `localStorage`.
 *
 * Stratégie de versioning : la clé porte le numéro de version du schéma.
 * Toute donnée lue sous une clé inconnue ou dont le contenu ne satisfait
 * pas la validation est silencieusement ignorée ; l'appelant retombe alors
 * sur les valeurs par défaut.
 *
 * Format stocké : JSON, objet plat `PersistedState`.
 */

import { FILAMENTS, type FilamentId } from "@/lib/filaments"
import { PRINTERS, type PrinterId } from "@/lib/printers"

/** Clé localStorage versionnée — à incrémenter si le schéma change. */
export const STORAGE_KEY = "print3d-calc:v1"

/**
 * Sous-ensemble de `CalculatorState` sérialisé dans le localStorage.
 * Identique à `CalculatorState` pour la v1 — extrait ici pour découpler
 * la couche persistance de l'interface React.
 */
export interface PersistedState {
  filamentId: FilamentId
  pricePerKg: number
  filamentGrams: number
  printHours: number
  printerId: PrinterId
  printerPowerW: number
  electricityPricePerKwh: number
  wastePercent: number
  marginPercent: number
}

/** Identifiants de filaments valides. */
const FILAMENT_IDS = new Set<string>(FILAMENTS.map((f) => f.id))
/** Identifiants d'imprimantes valides. */
const PRINTER_IDS = new Set<string>(PRINTERS.map((p) => p.id))

/**
 * Vérifie qu'une valeur est un nombre fini et strictement positif.
 * `allowZero` autorise 0 pour les pourcentages.
 */
function isFinitePositive(v: unknown, allowZero = false): v is number {
  return typeof v === "number" && Number.isFinite(v) && (allowZero ? v >= 0 : v > 0)
}

/**
 * Valide l'objet brut parsé depuis le localStorage.
 * Retourne `true` uniquement si tous les champs sont présents et cohérents.
 */
function isValidPersistedState(raw: unknown): raw is PersistedState {
  if (typeof raw !== "object" || raw === null) return false

  const r = raw as Record<string, unknown>

  return (
    typeof r.filamentId === "string" &&
    FILAMENT_IDS.has(r.filamentId) &&
    isFinitePositive(r.pricePerKg) &&
    isFinitePositive(r.filamentGrams) &&
    isFinitePositive(r.printHours) &&
    typeof r.printerId === "string" &&
    PRINTER_IDS.has(r.printerId) &&
    isFinitePositive(r.printerPowerW) &&
    isFinitePositive(r.electricityPricePerKwh) &&
    isFinitePositive(r.wastePercent, true) &&
    isFinitePositive(r.marginPercent, true)
  )
}

/**
 * Lit et valide l'état persisté depuis le `localStorage`.
 *
 * @returns L'état restauré, ou `null` si absent / invalide / format ancien.
 */
export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null

    const parsed: unknown = JSON.parse(raw)
    if (!isValidPersistedState(parsed)) return null

    return parsed
  } catch {
    // JSON.parse peut échouer sur une valeur corrompue — on l'ignore
    return null
  }
}

/**
 * Sérialise et enregistre l'état dans le `localStorage`.
 * Les erreurs (quota dépassé, mode privé bloqué…) sont ignorées silencieusement.
 */
export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Échec silencieux (quota, mode privé strict…)
  }
}

/**
 * Supprime l'entrée versionnée du `localStorage`.
 */
export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Échec silencieux
  }
}
