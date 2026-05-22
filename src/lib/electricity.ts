/**
 * Tarifs de l'électricité en France (Tarif Réglementé de Vente « Tarif Bleu »
 * d'EDF). Valeurs TTC au 1er août 2025, à titre indicatif et modifiables par
 * l'utilisateur.
 *
 * Source : tarif réglementé de vente — révisé une à deux fois par an
 * (généralement au 1er février et au 1er août).
 */

export interface ElectricityTariff {
  id: string
  /** Libellé affiché. */
  label: string
  /** Prix du kWh en euros TTC. */
  pricePerKwh: number
}

export const ELECTRICITY_TARIFFS: ElectricityTariff[] = [
  { id: "base", label: "Tarif Bleu — Base", pricePerKwh: 0.1952 },
  { id: "hp", label: "Tarif Bleu — Heures pleines", pricePerKwh: 0.2065 },
  { id: "hc", label: "Tarif Bleu — Heures creuses", pricePerKwh: 0.1579 },
]

/** Tarif par défaut : option Base, le cas le plus représentatif. */
export const DEFAULT_ELECTRICITY_PRICE = 0.1952
