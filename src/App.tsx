import { Moon, Printer, RotateCcw, Sun } from "lucide-react"

import { CalculatorForm } from "@/components/CalculatorForm"
import { CostSummary } from "@/components/CostSummary"
import { PrintSummary } from "@/components/PrintSummary"
import { Button } from "@/components/ui/button"
import { useCalculator } from "@/hooks/useCalculator"
import { useTheme } from "@/hooks/useTheme"

export default function App() {
  const calculator = useCalculator()
  const { state, breakdown } = calculator
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* En-tête (masqué en impression) */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex size-11 items-center justify-center rounded-xl">
              <Printer className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Calculateur d'impression 3D
              </h1>
              <p className="text-muted-foreground text-sm">
                Coût de revient : filament + électricité (France)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Passer en thème clair"
                  : "Passer en thème sombre"
              }
              title={
                theme === "dark"
                  ? "Passer en thème clair"
                  : "Passer en thème sombre"
              }
            >
              {theme === "dark" ? (
                <Sun className="size-5" />
              ) : (
                <Moon className="size-5" />
              )}
            </Button>
            <Button variant="outline" onClick={calculator.reset}>
              <RotateCcw />
              Réinitialiser
            </Button>
          </div>
        </header>

        {/* Corps : formulaire + récapitulatif (masqués en impression) */}
        <main className="grid gap-6 lg:grid-cols-[1fr_22rem] print:hidden">
          <CalculatorForm calculator={calculator} />
          <aside>
            <CostSummary breakdown={breakdown} />
          </aside>
        </main>

        {/* Pied de page (masqué en impression) */}
        <footer className="text-muted-foreground mt-10 text-center text-xs leading-relaxed print:hidden">
          <p>
            Tarifs indicatifs : Tarif Bleu EDF (août 2025) et prix moyens de
            filament constatés en France en 2025. Modifiez les valeurs pour
            coller à votre situation réelle.
          </p>
        </footer>

        {/* Récapitulatif réservé à l'impression (invisible à l'écran) */}
        <div className="hidden print:block">
          <PrintSummary
            filamentId={state.filamentId}
            printerId={state.printerId}
            filamentGrams={state.filamentGrams}
            pricePerKg={state.pricePerKg}
            printHours={state.printHours}
            printerPowerW={state.printerPowerW}
            electricityPricePerKwh={state.electricityPricePerKwh}
            wastePercent={state.wastePercent}
            marginPercent={state.marginPercent}
            breakdown={breakdown}
          />
        </div>
      </div>
    </div>
  )
}
