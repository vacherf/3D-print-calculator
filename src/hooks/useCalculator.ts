import { useEffect, useMemo, useState } from "react"

import { computeCost, type CostBreakdown } from "@/lib/calculator"
import { DEFAULT_ELECTRICITY_PRICE } from "@/lib/electricity"
import {
  DEFAULT_FILAMENT_ID,
  getFilament,
  type FilamentId,
} from "@/lib/filaments"
import {
  clearState,
  loadState,
  saveState,
} from "@/lib/persistence"
import {
  DEFAULT_PRINTER_ID,
  getPrinter,
  type PrinterId,
} from "@/lib/printers"

export interface CalculatorState {
  filamentId: FilamentId
  /** Prix au kilo saisi par l'utilisateur (prérempli depuis le filament). */
  pricePerKg: number
  filamentGrams: number
  printHours: number
  printerId: PrinterId
  /** Puissance en watts (prérenseignée depuis l'imprimante choisie). */
  printerPowerW: number
  electricityPricePerKwh: number
  wastePercent: number
  marginPercent: number
}

const defaultState: CalculatorState = {
  filamentId: DEFAULT_FILAMENT_ID,
  pricePerKg: getFilament(DEFAULT_FILAMENT_ID).pricePerKg,
  filamentGrams: 50,
  printHours: 3,
  printerId: DEFAULT_PRINTER_ID,
  printerPowerW: getPrinter(DEFAULT_PRINTER_ID).avgPowerW,
  electricityPricePerKwh: DEFAULT_ELECTRICITY_PRICE,
  wastePercent: 5,
  marginPercent: 0,
}

/**
 * Construit l'état initial : tente de restaurer depuis le localStorage,
 * retombe sur `defaultState` si absent ou invalide.
 */
function buildInitialState(): CalculatorState {
  const persisted = loadState()
  if (persisted !== null) {
    return {
      filamentId: persisted.filamentId,
      pricePerKg: persisted.pricePerKg,
      filamentGrams: persisted.filamentGrams,
      printHours: persisted.printHours,
      printerId: persisted.printerId,
      printerPowerW: persisted.printerPowerW,
      electricityPricePerKwh: persisted.electricityPricePerKwh,
      wastePercent: persisted.wastePercent,
      marginPercent: persisted.marginPercent,
    }
  }
  return defaultState
}

export interface UseCalculator {
  state: CalculatorState
  breakdown: CostBreakdown
  /** Met à jour un champ numérique. */
  setField: <K extends keyof CalculatorState>(
    key: K,
    value: CalculatorState[K],
  ) => void
  /** Change le filament et réinitialise le prix au kilo associé. */
  selectFilament: (id: FilamentId) => void
  /** Change l'imprimante et préremplit sa puissance moyenne. */
  selectPrinter: (id: PrinterId) => void
  reset: () => void
}

export function useCalculator(): UseCalculator {
  const [state, setState] = useState<CalculatorState>(buildInitialState)

  // Persiste l'état à chaque modification
  useEffect(() => {
    saveState(state)
  }, [state])

  const setField: UseCalculator["setField"] = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const selectFilament: UseCalculator["selectFilament"] = (id) => {
    setState((prev) => ({
      ...prev,
      filamentId: id,
      pricePerKg: getFilament(id).pricePerKg,
    }))
  }

  const selectPrinter: UseCalculator["selectPrinter"] = (id) => {
    setState((prev) => ({
      ...prev,
      printerId: id,
      printerPowerW: getPrinter(id).avgPowerW,
    }))
  }

  const reset = () => {
    clearState()
    setState(defaultState)
  }

  const breakdown = useMemo(
    () =>
      computeCost({
        filamentGrams: state.filamentGrams,
        filamentPricePerKg: state.pricePerKg,
        printHours: state.printHours,
        printerPowerW: state.printerPowerW,
        electricityPricePerKwh: state.electricityPricePerKwh,
        wastePercent: state.wastePercent,
        marginPercent: state.marginPercent,
      }),
    [state],
  )

  return { state, breakdown, setField, selectFilament, selectPrinter, reset }
}
