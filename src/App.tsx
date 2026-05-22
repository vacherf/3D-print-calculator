import { Moon, Printer, RotateCcw, Sun } from "lucide-react"

import { CalculatorForm } from "@/components/CalculatorForm"
import { CostSummary } from "@/components/CostSummary"
import { LanguageSelector } from "@/components/LanguageSelector"
import { PrintSummary } from "@/components/PrintSummary"
import { Button } from "@/components/ui/button"
import { useI18nContext } from "@/contexts/i18n"
import { useCalculator } from "@/hooks/useCalculator"
import { useTheme } from "@/hooks/useTheme"

export default function App() {
  const calculator = useCalculator()
  const { state, breakdown } = calculator
  const { theme, toggleTheme } = useTheme()
  const { t, locale, setLocale } = useI18nContext()

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
                {t.app.title}
              </h1>
              <p className="text-muted-foreground text-sm">
                {t.app.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Sélecteur de langue */}
            <LanguageSelector
              locale={locale}
              ariaLabel={t.app.languageSelectorLabel}
              onChange={setLocale}
            />
            {/* Bascule thème clair / sombre */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? t.app.themeToggleToLight
                  : t.app.themeToggleToDark
              }
              title={
                theme === "dark"
                  ? t.app.themeToggleToLight
                  : t.app.themeToggleToDark
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
              {t.app.resetButton}
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
          <p>{t.app.footer}</p>
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
