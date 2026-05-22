/**
 * Récapitulatif destiné à l'impression (visible uniquement via @media print).
 *
 * Ce composant est rendu dans le DOM en permanence mais masqué à l'écran
 * grâce à la classe `.screen-only` / `.print-only` définie dans index.css.
 * Lors du déclenchement de `window.print()`, seul ce bloc et les éléments
 * `.print-visible` restent affichés.
 *
 * Le composant consomme le contexte i18n pour refléter la langue active
 * dans le document imprimé.
 */

import type { CostBreakdown } from "@/lib/calculator"
import { formatEuros, formatKwh } from "@/lib/format"
import { getFilament, type FilamentId } from "@/lib/filaments"
import { getPrinter, type PrinterId } from "@/lib/printers"
import { useI18nContext } from "@/contexts/i18n"

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
  const { t, locale } = useI18nContext()
  const filament = getFilament(filamentId)
  const printer = getPrinter(printerId)
  const hasMargin = breakdown.marginAmount > 0

  const formattedDate = t.printSummary.formatDate(new Date())
  const generatedAt = t.printSummary.generatedAt(formattedDate)

  return (
    <div id="print-summary" aria-hidden="true">
      {/* En-tête du document imprimé */}
      <div className="print-header">
        <h1 className="print-title">{t.printSummary.documentTitle}</h1>
        <p className="print-date">{generatedAt}</p>
      </div>

      {/* Section paramètres */}
      <section className="print-section">
        <h2 className="print-section-title">{t.printSummary.sectionParams}</h2>
        <table className="print-table">
          <tbody>
            <PrintLine
              label={t.printSummary.paramFilament}
              value={filament.name}
              detail={`${filamentGrams} g · ${formatEuros(pricePerKg, locale)}/kg`}
            />
            <PrintLine
              label={t.printSummary.paramPrinter}
              value={
                printer.brand === "Autre"
                  ? printer.name
                  : `${printer.brand} ${printer.name}`
              }
              detail={`${printerPowerW} W`}
            />
            <PrintLine
              label={t.printSummary.paramDuration}
              value={t.printSummary.formatDuration(printHours)}
            />
            <PrintLine
              label={t.printSummary.paramElectricity}
              value={`${electricityPricePerKwh.toFixed(4)} ${t.printSummary.electricityUnit}`}
            />
            <PrintLine
              label={t.printSummary.paramWaste}
              value={`${wastePercent} ${t.printSummary.wasteUnit}`}
            />
            {hasMargin ? (
              <PrintLine
                label={t.printSummary.paramMargin}
                value={`${marginPercent} ${t.printSummary.marginUnit}`}
              />
            ) : null}
          </tbody>
        </table>
      </section>

      {/* Section détail du coût */}
      <section className="print-section">
        <h2 className="print-section-title">{t.printSummary.sectionCost}</h2>
        <table className="print-table">
          <tbody>
            <PrintLine
              label={t.printSummary.costFilament}
              value={formatEuros(breakdown.filamentCost, locale)}
            />
            <PrintLine
              label={t.printSummary.costElectricity}
              value={formatEuros(breakdown.electricityCost, locale)}
              detail={formatKwh(breakdown.energyKwh, locale)}
            />
            <PrintLine
              label={t.printSummary.costWaste}
              value={formatEuros(breakdown.wasteCost, locale)}
            />
            <PrintLine
              label={t.printSummary.costPrice}
              value={formatEuros(breakdown.costPrice, locale)}
              bold
            />
            {hasMargin ? (
              <>
                <PrintLine
                  label={t.printSummary.costMargin}
                  value={formatEuros(breakdown.marginAmount, locale)}
                />
                <PrintLine
                  label={t.printSummary.sellingPrice}
                  value={formatEuros(breakdown.sellingPrice, locale)}
                  bold
                />
              </>
            ) : null}
          </tbody>
        </table>
      </section>

      {/* Pied de page */}
      <footer className="print-footer">
        <p>{t.printSummary.footer}</p>
      </footer>
    </div>
  )
}
