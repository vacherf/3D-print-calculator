# CLAUDE.md — Calculateur d'impression 3D

> Orientation rapide chargée à chaque session. Spécification complète : **[docs/cahier-des-charges.md](docs/cahier-des-charges.md)**.

## En une phrase

Application web qui estime le **coût de revient d'une impression 3D** (filament + électricité, marché français), avec import d'un fichier STL pour préremplir la matière/durée et sélection de l'imprimante pour la puissance.

- **Cible** : hobbyiste / usage personnel. Utilisable en local (`npm run dev`) ou via l'URL GitHub Pages : **https://vacherf.github.io/3D-print-calculator/**
- **Langue** : tout en **français** (UI, commentaires, docs). Marché France, devise EUR.

## Stack

Vite 6 · React 19 · TypeScript (strict) · Tailwind CSS v4 · composants shadcn/ui (`src/components/ui`) · icônes lucide-react.

## Commandes

```bash
npm run dev        # serveur de dev (Vite, HMR) — souvent déjà lancé, ne pas relancer inutilement
npm run build      # tsc -b && vite build
npm run preview    # prévisualiser le build
npx tsc -b --noEmit  # typecheck seul (à faire avant de clore une story)
npm run lint       # ESLint (config flat eslint.config.js — opérationnel)
```

## Architecture

Séparation nette des responsabilités :

- **`src/lib/`** — logique métier **pure** (testable, sans React) : `calculator.ts` (moteur de coût), `stl.ts` (parseur + géométrie), `filaments.ts`, `printers.ts`, `electricity.ts`, `format.ts`, `persistence.ts` (lecture/écriture `localStorage`, clé versionnée `print3d-calc:v1`).
- **`src/hooks/useCalculator.ts`** — état global de la saisie + dérivation du calcul.
- **`src/components/`** — UI. `ui/` = primitives shadcn ; ne pas y mettre de logique métier.

## Conventions

- Imports via l'alias **`@/`** (`@/lib/...`, `@/components/...`).
- Libellés UI et commentaires en **français** ; formatage via `src/lib/format.ts` (€, kWh à la française).
- Toute nouvelle règle de calcul va dans `src/lib/` sous forme de fonction pure.
- Pas de dépendance lourde sans nécessité ; réutiliser l'existant (`NumberField`, `Select`, `Card`, `useCalculator`).

## Modèle de calcul (résumé)

```
coût matière     = (masse_g / 1000) × prix_€/kg
énergie_kWh      = (puissance_W / 1000) × durée_h
coût électricité = énergie_kWh × prix_€/kWh
coût de revient  = (coût matière + coût électricité) × (1 + gâche%)
prix de vente    = coût de revient × (1 + marge%)
```

Détail du modèle STL (masse via « coque + remplissage », durée via débit volumétrique) : voir le cahier des charges.

## Organisation du travail

Process agile léger : **sprints de 2 semaines**, **user stories** dans `backlog/`, deux rôles incarnés par des sous-agents Claude Code (`.claude/agents/`) :
- **`product-owner`** — rédige/priorise les stories, planifie les sprints (ne code pas).
- **`developer`** — implémente les stories, vérifie, met à jour les statuts.
- **`documentation`** — maintient la doc (README, CLAUDE.md, docs/, JSDoc) en phase avec le code.

Voir **`backlog/README.md`** pour le process et la Definition of Done, et **`backlog/sprint-XX/`** pour l'avancement.
