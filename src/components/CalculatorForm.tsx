import { Boxes, Plug, SlidersHorizontal } from "lucide-react"

import { FilamentSelector } from "@/components/FilamentSelector"
import { NumberField } from "@/components/NumberField"
import { PrinterSelector } from "@/components/PrinterSelector"
import { StlImporter } from "@/components/StlImporter"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ELECTRICITY_TARIFFS } from "@/lib/electricity"
import type { UseCalculator } from "@/hooks/useCalculator"

/** Formulaire de saisie : filament, impression, paramètres avancés. */
export function CalculatorForm({ calculator }: { calculator: UseCalculator }) {
  const { state, setField, selectFilament, selectPrinter } = calculator

  return (
    <div className="grid gap-6">
      {/* --- Import STL --- */}
      <StlImporter calculator={calculator} />

      {/* --- Filament --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Boxes className="size-5 text-primary" />
            Filament
          </CardTitle>
          <CardDescription>
            Le type de matière et la quantité utilisée pour l'impression.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FilamentSelector
            value={state.filamentId}
            onChange={selectFilament}
          />
          <NumberField
            label="Prix de la bobine"
            value={state.pricePerKg}
            onChange={(v) => setField("pricePerKg", v)}
            unit="€/kg"
            step={0.5}
            hint="Prérempli avec un prix moyen — ajustez selon votre bobine."
          />
          <NumberField
            label="Quantité de filament"
            value={state.filamentGrams}
            onChange={(v) => setField("filamentGrams", v)}
            unit="g"
            step={1}
            hint="Masse indiquée par votre logiciel de découpe (slicer)."
          />
        </CardContent>
      </Card>

      {/* --- Impression / électricité --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="size-5 text-primary" />
            Impression & électricité
          </CardTitle>
          <CardDescription>
            Durée et consommation pour estimer le coût de l'énergie (France).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Durée d'impression"
            value={state.printHours}
            onChange={(v) => setField("printHours", v)}
            unit="h"
            step={0.25}
            hint="Temps estimé par le slicer."
          />
          <PrinterSelector value={state.printerId} onChange={selectPrinter} />
          {state.printerId === "custom" ? (
            <NumberField
              label="Puissance imprimante"
              value={state.printerPowerW}
              onChange={(v) => setField("printerPowerW", v)}
              unit="W"
              step={10}
              hint="Puissance moyenne mesurée au wattmètre pendant l'impression."
            />
          ) : null}
          <div className="sm:col-span-2">
            <NumberField
              label="Prix de l'électricité"
              value={state.electricityPricePerKwh}
              onChange={(v) => setField("electricityPricePerKwh", v)}
              unit="€/kWh"
              step={0.001}
              hint="Tarif Bleu EDF (août 2025). Repères ci-dessous."
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {ELECTRICITY_TARIFFS.map((tariff) => (
                <button
                  key={tariff.id}
                  type="button"
                  onClick={() =>
                    setField("electricityPricePerKwh", tariff.pricePerKwh)
                  }
                  className="border-input hover:bg-accent rounded-md border px-2.5 py-1 text-xs transition-colors"
                >
                  {tariff.label} · {tariff.pricePerKwh.toFixed(4)} €
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Paramètres avancés --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-primary" />
            Paramètres avancés
          </CardTitle>
          <CardDescription>
            Gâche (impressions ratées) et marge commerciale optionnelle.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Taux de gâche"
            value={state.wastePercent}
            onChange={(v) => setField("wastePercent", v)}
            unit="%"
            step={1}
            hint="Supports, ratés, purge… appliqué à la matière et l'énergie."
          />
          <NumberField
            label="Marge commerciale"
            value={state.marginPercent}
            onChange={(v) => setField("marginPercent", v)}
            unit="%"
            step={5}
            hint="Pour obtenir un prix de vente conseillé (0 = aucune marge)."
          />
        </CardContent>
      </Card>
    </div>
  )
}
