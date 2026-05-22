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
  const hasMargin = breakdown.marginAmount > 0

  return (
    <Card className="sticky top-6 print:hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="size-5 text-primary" />
          Coût de revient
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Montant principal mis en avant */}
        <div className="bg-primary/5 rounded-lg border border-primary/20 p-4 text-center">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Coût total de l'impression
          </p>
          <p className="text-primary mt-1 text-4xl font-bold tabular-nums">
            {formatEuros(breakdown.costPrice)}
          </p>
        </div>

        <div className="grid gap-3">
          <Line
            label="Matière (filament)"
            value={formatEuros(breakdown.filamentCost)}
          />
          <Line
            label="Électricité"
            detail={formatKwh(breakdown.energyKwh)}
            value={formatEuros(breakdown.electricityCost)}
          />
          <Line
            label="Gâche / réimpressions"
            value={formatEuros(breakdown.wasteCost)}
          />
        </div>

        <Separator />

        <Line
          label="Coût de revient"
          value={formatEuros(breakdown.costPrice)}
          emphasis
        />

        {hasMargin ? (
          <>
            <Line
              label="Marge commerciale"
              value={formatEuros(breakdown.marginAmount)}
            />
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <p className="font-medium">Prix de vente conseillé</p>
                <Badge variant="secondary">avec marge</Badge>
              </div>
              <p className="text-primary text-lg font-bold tabular-nums">
                {formatEuros(breakdown.sellingPrice)}
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
          aria-label="Imprimer ou exporter le récapitulatif en PDF"
        >
          <Printer />
          Imprimer / Exporter
        </Button>
      </CardContent>
    </Card>
  )
}
