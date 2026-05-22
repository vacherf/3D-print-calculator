/**
 * Récapitulatif destiné à l'impression (visible uniquement via @media print).
 *
 * Ce composant est rendu dans le DOM en permanence mais masqué à l'écran
 * grâce à la classe `.screen-only` / `.print-only` définie dans index.css.
 * Lors du déclenchement de `window.print()`, seul ce bloc et les éléments
 * `.print-visible` restent affichés.
 */

import type { CostBreakdown } from "@/lib/calculator"
import { formatEuros, formatKwh } from "@/lib/format"
import { getFilament, type FilamentId } from "@/lib/filaments"
import { getPrinter, type PrinterId } from "@/lib/printers"

interface PrintSummaryProps {
  filamentId: FilamentId
  printerId: PrinterId
  filamentGrams: number
  pricePerKg: number
  printHours: number
  printerPowerW: number
  electricityPricePerKwh: number
  wastePercent: number
  marginPercent: number
  breakdown: CostBreakdown
}

/** Ligne de tableau pour le récapitulatif imprimé. */
function PrintLine({
  label,
  value,
  detail,
  bold,
}: {
  label: string
  value: string
  detail?: string
  bold?: boolean
}) {
  return (
    <tr className={bold ? "print-row-bold" : "print-row"}>
      <td className="print-td-label">
        {label}
        {detail ? <span className="print-detail"> ({detail})</span> : null}
      </td>
      <td className="print-td-value">{value}</td>
    </tr>
  )
}

/** Formate une durée en heures en texte lisible (ex. "1 h 30 min"). */
function formatDuree(heures: number): string {
  if (!Number.isFinite(heures) || heures <= 0) return "0 h"
  const h = Math.floor(heures)
  const min = Math.round((heures - h) * 60)
  if (min === 0) return `${h} h`
  if (h === 0) return `${min} min`
  return `${h} h ${min} min`
}

/** Formate une date en français (ex. "22 mai 2026 à 14:35"). */
function formatDateFr(date: Date): string {
  return date.toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Section du document réservée à l'impression.
 * Masquée à l'écran, affichée lors de `window.print()`.
 */
export function PrintSummary({
  filamentId,
  printerId,
  filamentGrams,
  pricePerKg,
  printHours,
  printerPowerW,
  electricityPricePerKwh,
  wastePercent,
  marginPercent,
  breakdown,
}: PrintSummaryProps) {
  const filament = getFilament(filamentId)
  const printer = getPrinter(printerId)
  const hasMargin = breakdown.marginAmount > 0
  const generatedAt = formatDateFr(new Date())

  return (
    <div id="print-summary" aria-hidden="true">
      {/* En-tête du document imprimé */}
      <div className="print-header">
        <h1 className="print-title">Récapitulatif d'impression 3D</h1>
        <p className="print-date">Généré le {generatedAt}</p>
      </div>

      {/* Section paramètres */}
      <section className="print-section">
        <h2 className="print-section-title">Paramètres de l'impression</h2>
        <table className="print-table">
          <tbody>
            <PrintLine
              label="Filament"
              value={filament.name}
              detail={`${filamentGrams} g · ${formatEuros(pricePerKg)}/kg`}
            />
            <PrintLine
              label="Imprimante"
              value={printer.brand === "Autre" ? printer.name : `${printer.brand} ${printer.name}`}
              detail={`${printerPowerW} W`}
            />
            <PrintLine
              label="Durée d'impression"
              value={formatDuree(printHours)}
            />
            <PrintLine
              label="Tarif électricité"
              value={`${electricityPricePerKwh.toFixed(4)} €/kWh`}
            />
            <PrintLine
              label="Taux de gâche"
              value={`${wastePercent} %`}
            />
            {hasMargin ? (
              <PrintLine
                label="Marge commerciale"
                value={`${marginPercent} %`}
              />
            ) : null}
          </tbody>
        </table>
      </section>

      {/* Section détail du coût */}
      <section className="print-section">
        <h2 className="print-section-title">Détail du coût</h2>
        <table className="print-table">
          <tbody>
            <PrintLine
              label="Matière (filament)"
              value={formatEuros(breakdown.filamentCost)}
            />
            <PrintLine
              label="Électricité"
              value={formatEuros(breakdown.electricityCost)}
              detail={formatKwh(breakdown.energyKwh)}
            />
            <PrintLine
              label="Gâche / réimpressions"
              value={formatEuros(breakdown.wasteCost)}
            />
            <PrintLine
              label="Coût de revient"
              value={formatEuros(breakdown.costPrice)}
              bold
            />
            {hasMargin ? (
              <>
                <PrintLine
                  label="Marge commerciale"
                  value={formatEuros(breakdown.marginAmount)}
                />
                <PrintLine
                  label="Prix de vente conseillé"
                  value={formatEuros(breakdown.sellingPrice)}
                  bold
                />
              </>
            ) : null}
          </tbody>
        </table>
      </section>

      {/* Pied de page */}
      <footer className="print-footer">
        <p>
          Calcul indicatif — Calculateur d'impression 3D (usage personnel)
        </p>
      </footer>
    </div>
  )
}
