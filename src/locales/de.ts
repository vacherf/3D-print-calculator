/**
 * Deutsche Übersetzungen.
 *
 * Die Schlüssel müssen exakt mit dem `Translations`-Interface aus fr.ts übereinstimmen —
 * TypeScript garantiert die Vollständigkeit beim Kompilieren.
 *
 * Technische Begriffe aus dem Referenzglossar (STORY-009b) :
 *   - Mit "TODO: à confirmer par un locuteur natif" markierte Begriffe: Ausschussrate,
 *     Volumendurchfluss, Schale/Perimeter, empfohlener Verkaufspreis.
 *
 * Hinweis zu langen Komposita: Deutsch bildet lange zusammengesetzte Wörter
 * (Druckdauer, Materialkosten, Stromverbrauch, Füllrate, Druckerleistung…).
 * Die Klassen `break-words` / `overflow-wrap: break-word` im Layout verhindern
 * Überlauf auf mobilen Viewports (~375 px) — visuelle Kontrolle erforderlich.
 */

import type { Translations } from "./fr"

export const de: Translations = {
  // ---------- Kopfzeile (App) ----------
  app: {
    title: "3D-Druck-Kalkulator",
    subtitle: "Herstellungskosten: Filament + Strom (Frankreich)",
    resetButton: "Zurücksetzen",
    themeToggleToDark: "Zum dunklen Design wechseln",
    themeToggleToLight: "Zum hellen Design wechseln",
    languageSelectorLabel: "Sprache",
    footer:
      "Richtwerte: EDF-Blauerif (August 2025) und durchschnittliche Filamentpreise in Frankreich 2025. Passen Sie die Werte an Ihre tatsächliche Situation an.",
  },

  // ---------- STL-Importer ----------
  stlImporter: {
    cardTitle: "STL-Datei importieren",
    cardDescription:
      "Analysiert das 3D-Modell, um Material und Druckdauer automatisch zu schätzen. Wählen Sie zunächst Ihr Filament unten aus.",
    dropZoneIdle: "Klicken oder .STL-Datei hierher ziehen",
    dropZoneFormats: "ASCII- und Binär-STL-Formate unterstützt",
    errorGeneric: "Diese STL-Datei kann nicht gelesen werden.",
    metricDimensions: "Abmessungen",
    metricVolume: "Volumen",
    metricSurface: "Oberfläche",
    metricTriangles: "Dreiecke",
    infillLabel: "Geschätzte Füllrate",
    infillHint:
      "An Ihre Slicer-Einstellung anpassen: Material und Dauer werden neu berechnet.",
    infillNote:
      "Richtwert (Schalen- + Füllungsmodell). Stützstrukturen, Spülung und Feineinstellungen werden nicht berücksichtigt — prüfen Sie mit Ihrem Slicer für ein genaues Angebot.",
  },

  // ---------- Filament-Karte ----------
  filamentCard: {
    cardTitle: "Filament",
    cardDescription: "Materialtyp und verwendete Menge für den Druck.",
    priceLabel: "Spulenpreis",
    priceHint: "Mit Durchschnittspreis vorausgefüllt — an Ihre Spule anpassen.",
    priceUnit: "€/kg",
    quantityLabel: "Filamentmenge",
    quantityHint: "Vom Slicer angegebene Masse.",
    quantityUnit: "g",
  },

  // ---------- Strom-Karte ----------
  electricityCard: {
    cardTitle: "Druck & Strom",
    cardDescription: "Dauer und Verbrauch zur Schätzung der Energiekosten.",
    durationLabel: "Druckdauer",
    durationHint: "Vom Slicer geschätzte Zeit.",
    durationUnit: "h",
    electricityPriceLabel: "Strompreis",
    electricityPriceHint: "EDF-Blauerif (August 2025). Richtwerte unten.",
    electricityPriceUnit: "€/kWh",
    printerPowerLabel: "Druckerleistung",
    printerPowerHint:
      "Durchschnittliche Leistung, gemessen mit einem Wattmeter während des Drucks.",
    printerPowerUnit: "W",
  },

  // ---------- Erweiterte Karte ----------
  advancedCard: {
    cardTitle: "Erweiterte Parameter",
    cardDescription:
      "Ausschussrate (fehlgeschlagene Drucke) und optionale Handelsmarge.",
    wasteLabel: "Ausschussrate", // TODO: à confirmer par un locuteur natif
    wasteHint: "Stützen, Fehldrucke, Spülung… auf Material und Energie angewendet.",
    wasteUnit: "%",
    marginLabel: "Handelsmarge",
    marginHint: "Für einen empfohlenen Verkaufspreis (0 = keine Marge).",
    marginUnit: "%",
  },

  // ---------- Filament-Auswahl ----------
  filamentSelector: {
    label: "Filamenttyp",
    placeholder: "Filament wählen",
  },

  // ---------- Drucker-Auswahl ----------
  printerSelector: {
    label: "Druckermodell",
    placeholder: "Drucker wählen",
    hintCustom: "Geben Sie unten die gemessene Durchschnittsleistung ein.",
    hintEstimated: (avgPowerW: number) =>
      `Geschätzte Durchschnittsleistung: ≈ ${avgPowerW} W beim Drucken.`,
  },

  // ---------- Kostenzusammenfassung ----------
  costSummary: {
    cardTitle: "Herstellungskosten",
    totalLabel: "Gesamtdruckkosten",
    filamentLine: "Material (Filament)",
    electricityLine: "Strom",
    wasteLine: "Ausschuss / Nachdrucke",
    costPriceLine: "Herstellungskosten",
    marginLine: "Handelsmarge",
    sellingPriceLine: "Empfohlener Verkaufspreis", // TODO: à confirmer par un locuteur natif
    sellingPriceBadge: "mit Marge",
    printButton: "Drucken / Exportieren",
    printButtonAriaLabel: "Zusammenfassung drucken oder als PDF exportieren",
  },

  // ---------- Druckzusammenfassung ----------
  printSummary: {
    documentTitle: "3D-Druckzusammenfassung",
    generatedAt: (date: string) => `Erstellt am ${date}`,
    sectionParams: "Druckparameter",
    sectionCost: "Kostenaufstellung",
    paramFilament: "Filament",
    paramPrinter: "Drucker",
    paramDuration: "Druckdauer",
    paramElectricity: "Stromtarif",
    paramWaste: "Ausschussrate", // TODO: à confirmer par un locuteur natif
    paramMargin: "Handelsmarge",
    costFilament: "Material (Filament)",
    costElectricity: "Strom",
    costWaste: "Ausschuss / Nachdrucke",
    costPrice: "Herstellungskosten",
    costMargin: "Handelsmarge",
    sellingPrice: "Empfohlener Verkaufspreis", // TODO: à confirmer par un locuteur natif
    footer: "Richtwert-Kalkulation — 3D-Druck-Kalkulator (persönlicher Gebrauch)",
    /** Formatiert ein Datum für die gedruckte Zusammenfassung. */
    formatDate: (date: Date) =>
      date.toLocaleString("de-DE", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    /** Formatiert eine Dauer in Stunden als lesbaren Text. */
    formatDuration: (hours: number): string => {
      if (!Number.isFinite(hours) || hours <= 0) return "0 Std."
      const h = Math.floor(hours)
      const min = Math.round((hours - h) * 60)
      if (min === 0) return `${h} Std.`
      if (h === 0) return `${min} Min.`
      return `${h} Std. ${min} Min.`
    },
    electricityUnit: "€/kWh",
    wasteUnit: "%",
    marginUnit: "%",
  },

  // ---------- Fehlerbegrenzung ----------
  errorBoundary: {
    title: "Ein unerwarteter Fehler ist aufgetreten",
    description:
      "Die Anwendung hat ein Problem festgestellt und konnte nicht korrekt angezeigt werden. Ihre eingegebenen Daten sind gespeichert: Klicken Sie auf «Wiederholen», um die Oberfläche neu zu laden.",
    detailsLabel: "Technische Details",
    retryButton: "Wiederholen",
  },
}
