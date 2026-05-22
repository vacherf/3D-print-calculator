/**
 * Traductions françaises — langue par défaut de l'application.
 *
 * Clés organisées par composant / zone de l'interface pour faciliter
 * la maintenance. Toutes les clés doivent également exister dans en.ts.
 *
 * Le type `Translations` est défini ici car FR est la langue de référence.
 * Il utilise `string` (et non des types littéraux) pour permettre à `en.ts`
 * d'implémenter librement ses propres traductions.
 */

/** Type du dictionnaire de traductions. Toutes les clés sont requises. */
export interface Translations {
  // ---------- En-tête (App) ----------
  app: {
    title: string
    subtitle: string
    resetButton: string
    themeToggleToDark: string
    themeToggleToLight: string
    languageSelectorLabel: string
    footer: string
  }

  // ---------- STL Importer ----------
  stlImporter: {
    cardTitle: string
    cardDescription: string
    dropZoneIdle: string
    dropZoneFormats: string
    errorGeneric: string
    metricDimensions: string
    metricVolume: string
    metricSurface: string
    metricTriangles: string
    infillLabel: string
    infillHint: string
    infillNote: string
  }

  // ---------- Filament Card ----------
  filamentCard: {
    cardTitle: string
    cardDescription: string
    priceLabel: string
    priceHint: string
    priceUnit: string
    quantityLabel: string
    quantityHint: string
    quantityUnit: string
  }

  // ---------- Electricity Card ----------
  electricityCard: {
    cardTitle: string
    cardDescription: string
    durationLabel: string
    durationHint: string
    durationUnit: string
    electricityPriceLabel: string
    electricityPriceHint: string
    electricityPriceUnit: string
    printerPowerLabel: string
    printerPowerHint: string
    printerPowerUnit: string
  }

  // ---------- Advanced Card ----------
  advancedCard: {
    cardTitle: string
    cardDescription: string
    wasteLabel: string
    wasteHint: string
    wasteUnit: string
    marginLabel: string
    marginHint: string
    marginUnit: string
  }

  // ---------- Filament Selector ----------
  filamentSelector: {
    label: string
    placeholder: string
  }

  // ---------- Printer Selector ----------
  printerSelector: {
    label: string
    placeholder: string
    hintCustom: string
    hintEstimated: (avgPowerW: number) => string
  }

  // ---------- Cost Summary ----------
  costSummary: {
    cardTitle: string
    totalLabel: string
    filamentLine: string
    electricityLine: string
    wasteLine: string
    costPriceLine: string
    marginLine: string
    sellingPriceLine: string
    sellingPriceBadge: string
    printButton: string
    printButtonAriaLabel: string
  }

  // ---------- Print Summary ----------
  printSummary: {
    documentTitle: string
    generatedAt: (date: string) => string
    sectionParams: string
    sectionCost: string
    paramFilament: string
    paramPrinter: string
    paramDuration: string
    paramElectricity: string
    paramWaste: string
    paramMargin: string
    costFilament: string
    costElectricity: string
    costWaste: string
    costPrice: string
    costMargin: string
    sellingPrice: string
    footer: string
    /** Formate une date pour l'affichage dans le récapitulatif imprimé. */
    formatDate: (date: Date) => string
    /** Formate une durée en heures en texte lisible. */
    formatDuration: (hours: number) => string
    electricityUnit: string
    wasteUnit: string
    marginUnit: string
  }

  // ---------- Error Boundary ----------
  errorBoundary: {
    title: string
    description: string
    detailsLabel: string
    retryButton: string
  }
}

/** Traductions françaises. */
export const fr: Translations = {
  // ---------- En-tête (App) ----------
  app: {
    title: "Calculateur d'impression 3D",
    subtitle: "Coût de revient : filament + électricité (France)",
    resetButton: "Réinitialiser",
    themeToggleToDark: "Passer en thème sombre",
    themeToggleToLight: "Passer en thème clair",
    languageSelectorLabel: "Langue",
    footer:
      "Tarifs indicatifs : Tarif Bleu EDF (août 2025) et prix moyens de filament constatés en France en 2025. Modifiez les valeurs pour coller à votre situation réelle.",
  },

  // ---------- STL Importer ----------
  stlImporter: {
    cardTitle: "Importer un fichier STL",
    cardDescription:
      "Analyse le modèle 3D pour estimer automatiquement la matière et la durée. Sélectionnez d'abord votre filament ci-dessous.",
    dropZoneIdle: "Cliquez ou glissez un fichier .STL ici",
    dropZoneFormats: "Formats STL ASCII et binaire pris en charge",
    errorGeneric: "Impossible de lire ce fichier STL.",
    metricDimensions: "Dimensions",
    metricVolume: "Volume",
    metricSurface: "Surface",
    metricTriangles: "Triangles",
    infillLabel: "Taux de remplissage estimé",
    infillHint:
      "Ajustez selon votre réglage de slicer : la matière et la durée sont recalculées.",
    infillNote:
      "Estimation indicative (modèle coque + remplissage). Supports, purge et réglages fins ne sont pas pris en compte — vérifiez avec votre slicer pour un devis précis.",
  },

  // ---------- Filament Card ----------
  filamentCard: {
    cardTitle: "Filament",
    cardDescription:
      "Le type de matière et la quantité utilisée pour l'impression.",
    priceLabel: "Prix de la bobine",
    priceHint: "Prérempli avec un prix moyen — ajustez selon votre bobine.",
    priceUnit: "€/kg",
    quantityLabel: "Quantité de filament",
    quantityHint: "Masse indiquée par votre logiciel de découpe (slicer).",
    quantityUnit: "g",
  },

  // ---------- Electricity Card ----------
  electricityCard: {
    cardTitle: "Impression & électricité",
    cardDescription:
      "Durée et consommation pour estimer le coût de l'énergie (France).",
    durationLabel: "Durée d'impression",
    durationHint: "Temps estimé par le slicer.",
    durationUnit: "h",
    electricityPriceLabel: "Prix de l'électricité",
    electricityPriceHint: "Tarif Bleu EDF (août 2025). Repères ci-dessous.",
    electricityPriceUnit: "€/kWh",
    printerPowerLabel: "Puissance imprimante",
    printerPowerHint:
      "Puissance moyenne mesurée au wattmètre pendant l'impression.",
    printerPowerUnit: "W",
  },

  // ---------- Advanced Card ----------
  advancedCard: {
    cardTitle: "Paramètres avancés",
    cardDescription:
      "Gâche (impressions ratées) et marge commerciale optionnelle.",
    wasteLabel: "Taux de gâche",
    wasteHint: "Supports, ratés, purge… appliqué à la matière et l'énergie.",
    wasteUnit: "%",
    marginLabel: "Marge commerciale",
    marginHint:
      "Pour obtenir un prix de vente conseillé (0 = aucune marge).",
    marginUnit: "%",
  },

  // ---------- Filament Selector ----------
  filamentSelector: {
    label: "Type de filament",
    placeholder: "Choisir un filament",
  },

  // ---------- Printer Selector ----------
  printerSelector: {
    label: "Modèle d'imprimante",
    placeholder: "Choisir une imprimante",
    hintCustom: "Saisissez la puissance moyenne mesurée ci-dessous.",
    hintEstimated: (avgPowerW: number) =>
      `Puissance moyenne estimée : ≈ ${avgPowerW} W en impression.`,
  },

  // ---------- Cost Summary ----------
  costSummary: {
    cardTitle: "Coût de revient",
    totalLabel: "Coût total de l'impression",
    filamentLine: "Matière (filament)",
    electricityLine: "Électricité",
    wasteLine: "Gâche / réimpressions",
    costPriceLine: "Coût de revient",
    marginLine: "Marge commerciale",
    sellingPriceLine: "Prix de vente conseillé",
    sellingPriceBadge: "avec marge",
    printButton: "Imprimer / Exporter",
    printButtonAriaLabel: "Imprimer ou exporter le récapitulatif en PDF",
  },

  // ---------- Print Summary ----------
  printSummary: {
    documentTitle: "Récapitulatif d'impression 3D",
    generatedAt: (date: string) => `Généré le ${date}`,
    sectionParams: "Paramètres de l'impression",
    sectionCost: "Détail du coût",
    paramFilament: "Filament",
    paramPrinter: "Imprimante",
    paramDuration: "Durée d'impression",
    paramElectricity: "Tarif électricité",
    paramWaste: "Taux de gâche",
    paramMargin: "Marge commerciale",
    costFilament: "Matière (filament)",
    costElectricity: "Électricité",
    costWaste: "Gâche / réimpressions",
    costPrice: "Coût de revient",
    costMargin: "Marge commerciale",
    sellingPrice: "Prix de vente conseillé",
    footer: "Calcul indicatif — Calculateur d'impression 3D (usage personnel)",
    formatDate: (date: Date) =>
      date.toLocaleString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
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
    title: "Une erreur inattendue s'est produite",
    description:
      "L'application a rencontré un problème et n'a pas pu s'afficher correctement. Vos données saisies sont sauvegardées : cliquez sur « Réessayer » pour relancer l'interface.",
    detailsLabel: "Détails techniques",
    retryButton: "Réessayer",
  },
}
