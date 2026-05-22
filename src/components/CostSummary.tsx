import { Printer, Receipt } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useI18nContext } from "@/contexts/i18n"
import type { CostBreakdown } from "@/lib/calculator"
import { formatEuros, formatKwh } from "@/lib/format"

interface LineProps {
  label: string
  value: string
  /** Détail secondaire affiché en petit sous le libellé. */
  detail?: string
  emphasis?: boolean
}

function Line({ label, value, detail, emphasis }: LineProps) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div>
        <p className={emphasis ? "font-medium" : "text-sm"}>{label}</p>
        {detail ? (
          <p className="text-muted-foreground text-xs">{detail}</p>
        ) : null}
      </div>
      <p
        className={
          emphasis ? "font-semibold tabular-nums" : "text-sm tabular-nums"
        }
      >
        {value}
      </p>
    </div>
  )
}

/** Déclenche l'impression navigateur. */
function handlePrint() {
  window.print()
}

/** Récapitulatif chiffré du coût de revient et du prix de vente conseillé. */
export function CostSummary({ breakdown }: { breakdown: CostBreakdown }) {
  const { t, locale } = useI18nContext()
  const hasMargin = breakdown.marginAmount > 0

  return (
    <Card className="sticky top-6 print:hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="size-5 text-primary" />
          {t.costSummary.cardTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Montant principal mis en avant */}
        <div className="bg-primary/5 rounded-lg border border-primary/20 p-4 text-center">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            {t.costSummary.totalLabel}
          </p>
          <p className="text-primary mt-1 text-4xl font-bold tabular-nums">
            {formatEuros(breakdown.costPrice, locale)}
          </p>
        </div>

        <div className="grid gap-3">
          <Line
            label={t.costSummary.filamentLine}
            value={formatEuros(breakdown.filamentCost, locale)}
          />
          <Line
            label={t.costSummary.electricityLine}
            detail={formatKwh(breakdown.energyKwh, locale)}
            value={formatEuros(breakdown.electricityCost, locale)}
          />
          <Line
            label={t.costSummary.wasteLine}
            value={formatEuros(breakdown.wasteCost, locale)}
          />
        </div>

        <Separator />

        <Line
          label={t.costSummary.costPriceLine}
          value={formatEuros(breakdown.costPrice, locale)}
          emphasis
        />

        {hasMargin ? (
          <>
            <Line
              label={t.costSummary.marginLine}
              value={formatEuros(breakdown.marginAmount, locale)}
            />
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <p className="font-medium">{t.costSummary.sellingPriceLine}</p>
                <Badge variant="secondary">{t.costSummary.sellingPriceBadge}</Badge>
              </div>
              <p className="text-primary text-lg font-bold tabular-nums">
                {formatEuros(breakdown.sellingPrice, locale)}
              </p>
            </div>
          </>
        ) : null}

        <Separator />

        {/* Bouton d'impression */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handlePrint}
          aria-label={t.costSummary.printButtonAriaLabel}
        >
          <Printer />
          {t.costSummary.printButton}
        </Button>
      </CardContent>
    </Card>
  )
}
