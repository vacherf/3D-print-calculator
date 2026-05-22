/**
 * Traductions espagnoles.
 *
 * Les clés doivent correspondre exactement à l'interface `Translations` de fr.ts —
 * TypeScript garantit l'exhaustivité à la compilation.
 *
 * Termes techniques issus du glossaire de référence (STORY-009b) :
 *   - Termes marqués "TODO: à confirmer par un locuteur natif" : taux de gâche,
 *     débit volumétrique, coque/périmètre, prix de vente conseillé.
 */

import type { Translations } from "./fr"

export const es: Translations = {
  // ---------- Encabezado (App) ----------
  app: {
    title: "Calculadora de impresión 3D",
    subtitle: "Coste de producción: filamento + electricidad (Francia)",
    resetButton: "Restablecer",
    themeToggleToDark: "Cambiar al tema oscuro",
    themeToggleToLight: "Cambiar al tema claro",
    languageSelectorLabel: "Idioma",
    footer:
      "Tarifas orientativas: Tarifa Azul EDF (agosto 2025) y precios medios de filamento observados en Francia en 2025. Ajuste los valores según su situación real.",
  },

  // ---------- Importador STL ----------
  stlImporter: {
    cardTitle: "Importar un archivo STL",
    cardDescription:
      "Analiza el modelo 3D para estimar automáticamente el material y la duración. Seleccione primero su filamento a continuación.",
    dropZoneIdle: "Haga clic o arrastre un archivo .STL aquí",
    dropZoneFormats: "Formatos STL ASCII y binario compatibles",
    errorGeneric: "No se puede leer este archivo STL.",
    metricDimensions: "Dimensiones",
    metricVolume: "Volumen",
    metricSurface: "Superficie",
    metricTriangles: "Triángulos",
    infillLabel: "Porcentaje de relleno estimado",
    infillHint:
      "Ajuste según su configuración de slicer: el material y la duración se recalculan.",
    infillNote:
      "Estimación indicativa (modelo carcasa + relleno). Soportes, purga y ajustes finos no se tienen en cuenta — verifique con su slicer para un presupuesto preciso.",
  },

  // ---------- Tarjeta de filamento ----------
  filamentCard: {
    cardTitle: "Filamento",
    cardDescription: "El tipo de material y la cantidad utilizada para la impresión.",
    priceLabel: "Precio de la bobina",
    priceHint: "Prerrellenado con un precio medio — ajuste según su bobina.",
    priceUnit: "€/kg",
    quantityLabel: "Cantidad de filamento",
    quantityHint: "Masa indicada por su software de corte (slicer).",
    quantityUnit: "g",
  },

  // ---------- Tarjeta de electricidad ----------
  electricityCard: {
    cardTitle: "Impresión y electricidad",
    cardDescription: "Duración y consumo para estimar el coste de la energía.",
    durationLabel: "Duración de impresión",
    durationHint: "Tiempo estimado por el slicer.",
    durationUnit: "h",
    electricityPriceLabel: "Precio de la electricidad",
    electricityPriceHint: "Tarifa Azul EDF (agosto 2025). Referencias a continuación.",
    electricityPriceUnit: "€/kWh",
    printerPowerLabel: "Potencia de la impresora",
    printerPowerHint:
      "Potencia media medida con vatímetro durante la impresión.",
    printerPowerUnit: "W",
  },

  // ---------- Tarjeta avanzada ----------
  advancedCard: {
    cardTitle: "Parámetros avanzados",
    cardDescription:
      "Tasa de desperdicio (impresiones fallidas) y margen comercial opcional.",
    wasteLabel: "Tasa de desperdicio", // TODO: à confirmer par un locuteur natif
    wasteHint: "Soportes, fallos, purga… aplicado al material y la energía.",
    wasteUnit: "%",
    marginLabel: "Margen comercial",
    marginHint: "Para obtener un precio de venta recomendado (0 = sin margen).",
    marginUnit: "%",
  },

  // ---------- Selector de filamento ----------
  filamentSelector: {
    label: "Tipo de filamento",
    placeholder: "Elegir un filamento",
  },

  // ---------- Selector de impresora ----------
  printerSelector: {
    label: "Modelo de impresora",
    placeholder: "Elegir una impresora",
    hintCustom: "Introduzca la potencia media medida a continuación.",
    hintEstimated: (avgPowerW: number) =>
      `Potencia media estimada: ≈ ${avgPowerW} W durante la impresión.`,
  },

  // ---------- Resumen de costes ----------
  costSummary: {
    cardTitle: "Coste de producción",
    totalLabel: "Coste total de la impresión",
    filamentLine: "Material (filamento)",
    electricityLine: "Electricidad",
    wasteLine: "Desperdicio / reimpresiones",
    costPriceLine: "Coste de producción",
    marginLine: "Margen comercial",
    sellingPriceLine: "Precio de venta recomendado", // TODO: à confirmer par un locuteur natif
    sellingPriceBadge: "con margen",
    printButton: "Imprimir / Exportar",
    printButtonAriaLabel: "Imprimir o exportar el resumen en PDF",
  },

  // ---------- Resumen de impresión ----------
  printSummary: {
    documentTitle: "Resumen de impresión 3D",
    generatedAt: (date: string) => `Generado el ${date}`,
    sectionParams: "Parámetros de impresión",
    sectionCost: "Desglose de costes",
    paramFilament: "Filamento",
    paramPrinter: "Impresora",
    paramDuration: "Duración de impresión",
    paramElectricity: "Tarifa de electricidad",
    paramWaste: "Tasa de desperdicio", // TODO: à confirmer par un locuteur natif
    paramMargin: "Margen comercial",
    costFilament: "Material (filamento)",
    costElectricity: "Electricidad",
    costWaste: "Desperdicio / reimpresiones",
    costPrice: "Coste de producción",
    costMargin: "Margen comercial",
    sellingPrice: "Precio de venta recomendado", // TODO: à confirmer par un locuteur natif
    footer: "Cálculo indicativo — Calculadora de impresión 3D (uso personal)",
    /** Formatea una fecha para el resumen impreso. */
    formatDate: (date: Date) =>
      date.toLocaleString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    /** Formatea una duración en horas como texto legible. */
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

  // ---------- Límite de errores ----------
  errorBoundary: {
    title: "Se ha producido un error inesperado",
    description:
      "La aplicación ha encontrado un problema y no ha podido mostrarse correctamente. Sus datos introducidos están guardados: haga clic en «Reintentar» para recargar la interfaz.",
    detailsLabel: "Detalles técnicos",
    retryButton: "Reintentar",
  },
}
