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
import { useI18nContext } from "@/contexts/i18n"
import { ELECTRICITY_TARIFFS } from "@/lib/electricity"
import type { UseCalculator } from "@/hooks/useCalculator"

/** Formulaire de saisie : filament, impression, paramètres avancés. */
export function CalculatorForm({ calculator }: { calculator: UseCalculator }) {
  const { state, setField, selectFilament, selectPrinter } = calculator
  const { t } = useI18nContext()

  return (
    <div className="grid gap-6">
      {/* --- Import STL --- */}
      <StlImporter calculator={calculator} />

      {/* --- Filament --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Boxes className="size-5 text-primary" />
            {t.filamentCard.cardTitle}
          </CardTitle>
          <CardDescription>{t.filamentCard.cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FilamentSelector
            value={state.filamentId}
            onChange={selectFilament}
          />
          <NumberField
            label={t.filamentCard.priceLabel}
            value={state.pricePerKg}
            onChange={(v) => setField("pricePerKg", v)}
            unit={t.filamentCard.priceUnit}
            step={0.5}
            hint={t.filamentCard.priceHint}
          />
          <NumberField
            label={t.filamentCard.quantityLabel}
            value={state.filamentGrams}
            onChange={(v) => setField("filamentGrams", v)}
            unit={t.filamentCard.quantityUnit}
            step={1}
            hint={t.filamentCard.quantityHint}
          />
        </CardContent>
      </Card>

      {/* --- Impression / électricité --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="size-5 text-primary" />
            {t.electricityCard.cardTitle}
          </CardTitle>
          <CardDescription>{t.electricityCard.cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label={t.electricityCard.durationLabel}
            value={state.printHours}
            onChange={(v) => setField("printHours", v)}
            unit={t.electricityCard.durationUnit}
            step={0.25}
            hint={t.electricityCard.durationHint}
          />
          <PrinterSelector value={state.printerId} onChange={selectPrinter} />
          {state.printerId === "custom" ? (
            <NumberField
              label={t.electricityCard.printerPowerLabel}
              value={state.printerPowerW}
              onChange={(v) => setField("printerPowerW", v)}
              unit={t.electricityCard.printerPowerUnit}
              step={10}
              hint={t.electricityCard.printerPowerHint}
            />
          ) : null}
          <div className="sm:col-span-2">
            <NumberField
              label={t.electricityCard.electricityPriceLabel}
              value={state.electricityPricePerKwh}
              onChange={(v) => setField("electricityPricePerKwh", v)}
              unit={t.electricityCard.electricityPriceUnit}
              step={0.001}
              hint={t.electricityCard.electricityPriceHint}
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
                  {/* Les libellés des tarifs EDF ne sont pas traduits — noms de référence invariants */}
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
            {t.advancedCard.cardTitle}
          </CardTitle>
          <CardDescription>{t.advancedCard.cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label={t.advancedCard.wasteLabel}
            value={state.wastePercent}
            onChange={(v) => setField("wastePercent", v)}
            unit={t.advancedCard.wasteUnit}
            step={1}
            hint={t.advancedCard.wasteHint}
          />
          <NumberField
            label={t.advancedCard.marginLabel}
            value={state.marginPercent}
            onChange={(v) => setField("marginPercent", v)}
            unit={t.advancedCard.marginUnit}
            step={5}
            hint={t.advancedCard.marginHint}
          />
        </CardContent>
      </Card>
    </div>
  )
}
