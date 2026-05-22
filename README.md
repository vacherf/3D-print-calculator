# Calculateur de coût d'impression 3D

Application web qui calcule le **coût de revient d'une impression 3D** en
fonction du type de filament, de la quantité utilisée et du **coût de
l'électricité en France**. Construite avec **Vite + React + TypeScript** et
**[shadcn/ui](https://ui.shadcn.com/)** (Tailwind CSS v4).

**Application en ligne** : https://vacherf.github.io/3D-print-calculator/

## Fonctionnalités

- **Import d'un fichier STL** (ASCII ou binaire) par clic ou glisser-déposer :
  analyse de la géométrie (volume, surface, dimensions) pour préremplir
  automatiquement la masse de filament et la durée, avec un taux de remplissage
  ajustable.
- Sélection du type de filament (PLA, PETG, ABS, ASA, TPU, Nylon, PLA-CF…)
  avec prix moyen prérempli et modifiable.
- **Sélection de l'imprimante** dans une liste de modèles courants (Bambu Lab,
  Prusa, Creality, Anycubic, Elegoo…) : la puissance moyenne est appliquée
  automatiquement, ou saisie à la main via l'option « Personnalisé ».
- Calcul du coût matière à partir de la masse (g) et du prix au kilo.
- Calcul du coût de l'électricité à partir de la durée d'impression, de la
  puissance de l'imprimante et du tarif du kWh (raccourcis Tarif Bleu EDF :
  Base / Heures pleines / Heures creuses).
- Taux de gâche (impressions ratées, supports) et marge commerciale optionnelle
  pour obtenir un prix de vente conseillé.
- Récapitulatif détaillé en temps réel.
- **Persistance automatique de la saisie** : les valeurs sont conservées dans le
  `localStorage` du navigateur (clé `print3d-calc:v1`) et restaurées au
  rechargement. Le bouton « Réinitialiser » purge le stockage et revient aux
  valeurs par défaut.
- **Export / impression** : bouton « Imprimer / Exporter » qui déclenche
  `window.print()`. L'interface applicative est masquée ; un document structuré
  (paramètres + détail du coût + date de génération) s'affiche à la place,
  formaté A4 portrait en noir & blanc — exportable en PDF via le navigateur.

## Démarrage

```bash
npm install
npm run dev       # serveur de développement
npm run build     # build de production (tsc + vite)
npm run preview   # prévisualiser le build
npm test          # tests unitaires (Vitest, mode watch)
npm run test:run  # tests unitaires (exécution unique)
```

## Structure du projet

```
src/
├── App.tsx                  # Composition de la page
├── components/
│   ├── CalculatorForm.tsx   # Formulaire de saisie
│   ├── CostSummary.tsx      # Récapitulatif chiffré (+ bouton Imprimer)
│   ├── PrintSummary.tsx     # Document réservé à l'impression (@media print)
│   ├── StlImporter.tsx      # Import & analyse d'un fichier STL
│   ├── FilamentSelector.tsx # Sélecteur de filament
│   ├── PrinterSelector.tsx  # Sélecteur d'imprimante (par marque)
│   ├── NumberField.tsx      # Champ numérique réutilisable
│   └── ui/                  # Primitives shadcn/ui
├── hooks/
│   └── useCalculator.ts     # État + dérivation du calcul
└── lib/
    ├── calculator.ts        # Moteur de calcul (fonctions pures)
    ├── calculator.test.ts   # Tests du moteur de calcul
    ├── stl.ts               # Parseur STL + estimations (masse, durée)
    ├── stl.test.ts          # Tests du parseur STL
    ├── electricity.ts       # Tarifs électricité France
    ├── filaments.ts         # Référentiel des filaments
    ├── persistence.ts       # Lecture/écriture localStorage (clé print3d-calc:v1)
    ├── printers.ts          # Référentiel des imprimantes
    ├── format.ts            # Formatage (€, kWh) à la française
    └── utils.ts             # cn() (classes Tailwind)
```

Documentation et organisation : [`CLAUDE.md`](CLAUDE.md) (orientation rapide),
[`docs/cahier-des-charges.md`](docs/cahier-des-charges.md) (spécification) et
[`backlog/`](backlog/) (sprints & user stories).

## Déploiement

L'application est publiée automatiquement sur **GitHub Pages** à chaque push sur
la branche `main` via le workflow `.github/workflows/deploy.yml` (GitHub Actions).

**URL** : https://vacherf.github.io/3D-print-calculator/

### Fonctionnement du workflow

1. Déclencheur : push sur `main` ou lancement manuel (`workflow_dispatch`).
2. Job `build` : `npm ci` → `npm run build` → upload de `dist/` comme artefact Pages.
3. Job `deploy` : publication de l'artefact via `actions/deploy-pages`.

### Rôle de `base` dans `vite.config.ts`

GitHub Pages sert le site sous un sous-chemin (`/3D-print-calculator/`). La
propriété `base: '/3D-print-calculator/'` dans `vite.config.ts` préfixe tous
les chemins d'assets générés par Vite pour éviter les erreurs 404.

> **Prérequis** : le repo doit être **public** pour que GitHub Pages soit
> disponible sur un plan GitHub gratuit (Settings → Pages → Source = GitHub
> Actions).

## Méthode de calcul

```
coût matière      = (masse_g / 1000) × prix_€/kg
énergie_kWh       = (puissance_W / 1000) × durée_h
coût électricité  = énergie_kWh × prix_€/kWh
coût de revient   = (coût matière + coût électricité) × (1 + gâche%)
prix de vente     = coût de revient × (1 + marge%)
```

### Estimation depuis un STL (indicative)

À l'import, la masse et la durée sont estimées à partir de la géométrie du
maillage (modèle « coque + remplissage ») :

```
coque_cm³      = min(surface_cm² × épaisseur_paroi_cm, volume_cm³)   # paroi ≈ 1,2 mm
cœur_cm³       = max(volume_cm³ − coque_cm³, 0)
volume_extrudé = coque_cm³ + cœur_cm³ × remplissage%
masse_g        = volume_extrudé × densité_filament
durée_h        ≈ volume_extrudé_mm³ / débit_volumétrique (~10 mm³/s) / 3600
```

Ces valeurs sont des ordres de grandeur (supports, jupe/bordure, purge et
réglages fins non modélisés) — un slicer reste plus précis.

## Données de référence (2025, indicatives)

- **Électricité** — Tarif Bleu EDF (TTC, août 2025) : Base 0,1952 €/kWh,
  Heures pleines 0,2065 €/kWh, Heures creuses 0,1579 €/kWh.
- **Filaments** — bobine 1 kg : PLA ~22 €, PETG ~25 €, ABS ~25 €, ASA ~30 €,
  TPU ~35 €, Nylon ~40 €.

Ces valeurs sont des moyennes modifiables directement dans l'interface.
