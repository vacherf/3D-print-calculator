/**
 * English translations.
 *
 * Keys must mirror the `Translations` interface from fr.ts exactly —
 * TypeScript enforces exhaustiveness at compile time.
 */

import type { Translations } from "./fr"

export const en: Translations = {
  // ---------- Header (App) ----------
  app: {
    title: "3D Print Calculator",
    subtitle: "Cost estimate: filament + electricity",
    resetButton: "Reset",
    themeToggleToDark: "Switch to dark theme",
    themeToggleToLight: "Switch to light theme",
    languageSelectorLabel: "Language",
    footer:
      "Indicative rates: EDF Blue Tariff (August 2025) and average filament prices observed in France in 2025. Adjust the values to match your actual situation.",
  },

  // ---------- STL Importer ----------
  stlImporter: {
    cardTitle: "Import an STL file",
    cardDescription:
      "Analyses the 3D model to automatically estimate material and print time. Select your filament first below.",
    dropZoneIdle: "Click or drag an .STL file here",
    dropZoneFormats: "ASCII and binary STL formats supported",
    errorGeneric: "Unable to read this STL file.",
    metricDimensions: "Dimensions",
    metricVolume: "Volume",
    metricSurface: "Surface",
    metricTriangles: "Triangles",
    infillLabel: "Estimated infill rate",
    infillHint:
      "Adjust to match your slicer setting: material and time are recalculated.",
    infillNote:
      "Indicative estimate (shell + infill model). Supports, purge and fine settings are not accounted for — check with your slicer for a precise quote.",
  },

  // ---------- Filament Card ----------
  filamentCard: {
    cardTitle: "Filament",
    cardDescription: "The material type and quantity used for the print.",
    priceLabel: "Spool price",
    priceHint: "Pre-filled with an average price — adjust for your own spool.",
    priceUnit: "€/kg",
    quantityLabel: "Filament quantity",
    quantityHint: "Weight shown by your slicer software.",
    quantityUnit: "g",
  },

  // ---------- Electricity Card ----------
  electricityCard: {
    cardTitle: "Print & electricity",
    cardDescription: "Duration and consumption to estimate the energy cost.",
    durationLabel: "Print duration",
    durationHint: "Time estimated by the slicer.",
    durationUnit: "h",
    electricityPriceLabel: "Electricity price",
    electricityPriceHint: "EDF Blue Tariff (August 2025). Presets below.",
    electricityPriceUnit: "€/kWh",
    printerPowerLabel: "Printer power",
    printerPowerHint:
      "Average power measured with a wattmeter during printing.",
    printerPowerUnit: "W",
  },

  // ---------- Advanced Card ----------
  advancedCard: {
    cardTitle: "Advanced settings",
    cardDescription: "Waste (failed prints) and optional commercial margin.",
    wasteLabel: "Waste rate",
    wasteHint: "Supports, failures, purge… applied to both material and energy.",
    wasteUnit: "%",
    marginLabel: "Commercial margin",
    marginHint: "To obtain a suggested selling price (0 = no margin).",
    marginUnit: "%",
  },

  // ---------- Filament Selector ----------
  filamentSelector: {
    label: "Filament type",
    placeholder: "Choose a filament",
  },

  // ---------- Printer Selector ----------
  printerSelector: {
    label: "Printer model",
    placeholder: "Choose a printer",
    hintCustom: "Enter the average measured power below.",
    hintEstimated: (avgPowerW: number) =>
      `Estimated average power: ≈ ${avgPowerW} W during printing.`,
  },

  // ---------- Cost Summary ----------
  costSummary: {
    cardTitle: "Cost price",
    totalLabel: "Total print cost",
    filamentLine: "Material (filament)",
    electricityLine: "Electricity",
    wasteLine: "Waste / reprints",
    costPriceLine: "Cost price",
    marginLine: "Commercial margin",
    sellingPriceLine: "Suggested selling price",
    sellingPriceBadge: "with margin",
    printButton: "Print / Export",
    printButtonAriaLabel: "Print or export the summary as PDF",
  },

  // ---------- Print Summary ----------
  printSummary: {
    documentTitle: "3D Print Summary",
    generatedAt: (date: string) => `Generated on ${date}`,
    sectionParams: "Print parameters",
    sectionCost: "Cost breakdown",
    paramFilament: "Filament",
    paramPrinter: "Printer",
    paramDuration: "Print duration",
    paramElectricity: "Electricity rate",
    paramWaste: "Waste rate",
    paramMargin: "Commercial margin",
    costFilament: "Material (filament)",
    costElectricity: "Electricity",
    costWaste: "Waste / reprints",
    costPrice: "Cost price",
    costMargin: "Commercial margin",
    sellingPrice: "Suggested selling price",
    footer: "Indicative calculation — 3D Print Calculator (personal use)",
    /** Format a date for the printed summary. */
    formatDate: (date: Date) =>
      date.toLocaleString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    /** Format a duration in hours as readable text. */
    formatDuration: (hours: number): string => {
      if (!Number.isFinite(hours) || hours <= 0) return "0 h"
      const h = Math.floor(hours)
      const min = Math.round((hours - h) * 60)
      if (min === 0) return `${h} h`
      if (h === 0) return `${min} min`
      return `${h} h ${min} min`
    },
    electricityUnit: "€/kWh",
    wasteUnit: "%",
    marginUnit: "%",
  },

  // ---------- Error Boundary ----------
  errorBoundary: {
    title: "An unexpected error occurred",
    description:
      "The application encountered a problem and could not display correctly. Your entered data is saved: click « Retry » to reload the interface.",
    detailsLabel: "Technical details",
    retryButton: "Retry",
  },
}
