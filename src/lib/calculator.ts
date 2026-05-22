/**
 * Moteur de calcul du coût de revient d'une impression 3D.
 *
 * Tout est ici sous forme de fonctions pures (aucun état, aucun rendu) pour
 * être facilement testable et réutilisable. L'interface ne fait qu'appeler
 * `computeCost`.
 */

export interface CostInputs {
  /** Masse de filament utilisée, en grammes. */
  filamentGrams: number
  /** Prix de la bobine de filament, en euros pour 1 kg. */
  filamentPricePerKg: number
  /** Durée d'impression, en heures (peut être décimale). */
  printHours: number
  /** Puissance moyenne consommée par l'imprimante, en watts. */
  printerPowerW: number
  /** Prix de l'électricité, en euros par kWh. */
  electricityPricePerKwh: number
  /** Taux d'échec/gâche en pourcentage (réimpressions, supports ratés…). */
  wastePercent: number
  /** Marge à appliquer sur le coût de revient, en pourcentage (0 = aucune). */
  marginPercent: number
}

export interface CostBreakdown {
  /** Coût de la matière (filament) en euros. */
  filamentCost: number
  /** Énergie consommée en kWh. */
  energyKwh: number
  /** Coût de l'électricité en euros. */
  electricityCost: number
  /** Surcoût lié au taux de gâche, en euros. */
  wasteCost: number
  /** Coût de revient total (matière + élec + gâche), en euros. */
  costPrice: number
  /** Montant de la marge appliquée, en euros. */
  marginAmount: number
  /** Prix de vente conseillé (coût de revient + marge), en euros. */
  sellingPrice: number
}

/** Convertit une valeur potentiellement invalide en nombre positif. */
function safePositive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0
}

/**
 * Convertit une longueur de filament (en mètres) en masse (en grammes)
 * à partir du diamètre du filament (en mm) et de la densité (g/cm³).
 */
export function lengthToGrams(
  lengthMeters: number,
  diameterMm: number,
  density: number,
): number {
  const radiusCm = diameterMm / 2 / 10
  const lengthCm = lengthMeters * 100
  const volumeCm3 = Math.PI * radiusCm * radiusCm * lengthCm
  return volumeCm3 * density
}

/** Calcule le coût de revient détaillé d'une impression. */
export function computeCost(inputs: CostInputs): CostBreakdown {
  const grams = safePositive(inputs.filamentGrams)
  const pricePerKg = safePositive(inputs.filamentPricePerKg)
  const hours = safePositive(inputs.printHours)
  const powerW = safePositive(inputs.printerPowerW)
  const pricePerKwh = safePositive(inputs.electricityPricePerKwh)
  const waste = Math.max(0, inputs.wastePercent) / 100
  const margin = Math.max(0, inputs.marginPercent) / 100

  const filamentCost = (grams / 1000) * pricePerKg
  const energyKwh = (powerW / 1000) * hours
  const electricityCost = energyKwh * pricePerKwh

  const baseCost = filamentCost + electricityCost
  const wasteCost = baseCost * waste
  const costPrice = baseCost + wasteCost

  const marginAmount = costPrice * margin
  const sellingPrice = costPrice + marginAmount

  return {
    filamentCost,
    energyKwh,
    electricityCost,
    wasteCost,
    costPrice,
    marginAmount,
    sellingPrice,
  }
}
