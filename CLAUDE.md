# CLAUDE.md — Calculateur d'impression 3D

> Orientation rapide chargée à chaque session. Spécification complète : **[docs/cahier-des-charges.md](docs/cahier-des-charges.md)**.

## En une phrase

Application web **multilingue (FR/EN/ES/DE)** qui estime le **coût de revient d'une impression 3D** (filament + électricité, marché français), avec import STL, sélection de l'imprimante, thème clair/sombre et interface robuste (ErrorBoundary).

- **Cible** : hobbyiste / usage personnel. Utilisable en local (`npm run dev`) ou via l'URL GitHub Pages : **https://vacherf.github.io/3D-print-calculator/**
- **Langue** : commentaires et docs en **français** ; UI disponible en FR (défaut), EN, ES, DE — bascule dans l'en-tête, persistée. Devise EUR invariante.

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

- **`src/lib/`** — logique métier **pure** (testable, sans React) : `calculator.ts` (moteur de coût), `stl.ts` (parseur + géométrie), `filaments.ts`, `printers.ts`, `electricity.ts`, `format.ts` (paramètre `locale` optionnel, devise EUR fixe), `persistence.ts` (lecture/écriture `localStorage`, clé versionnée `print3d-calc:v1`).
- **`src/locales/`** — dictionnaires de traductions TypeScript (`fr.ts`, `en.ts`, `es.ts`, `de.ts`, `index.ts`). `Locale = "fr" | "en" | "es" | "de"` ; `SUPPORTED_LOCALES` liste les quatre langues avec leur code pays (FR/GB/ES/DE) pour les drapeaux SVG. Pour ajouter une langue : créer le fichier implémentant `Translations` et l'enregistrer dans `SUPPORTED_LOCALES`.
- **`src/contexts/`** — couche i18n React : `I18nContextObject.ts` (objet contexte), `I18nContext.tsx` (`I18nProvider`), `i18n.ts` (hook `useI18nContext`). Découpé en trois fichiers par contrainte ESLint `react-refresh/only-export-components`.
- **`src/hooks/`** — `useCalculator.ts` (état global + dérivation du calcul), `useTheme.ts` (thème clair/sombre, clé `print3d-ui:theme`), `useI18n.ts` (langue active, dictionnaire `t`, clé `print3d-ui:lang`).
- **`src/components/`** — UI. `ui/` = primitives shadcn ; ne pas y mettre de logique métier. `ErrorBoundary.tsx` = composant de classe + `ErrorFallback` fonctionnel (accès au contexte i18n). `LanguageSelector.tsx` = sélecteur compact (drapeau + acronyme) FR/EN/ES/DE dans l'en-tête.
- **`src/main.tsx`** — ordre d'imbrication : `I18nProvider` > `ErrorBoundary` > `App` (le provider doit être au-dessus pour que le fallback soit traduit).

## Conventions

- Imports via l'alias **`@/`** (`@/lib/...`, `@/components/...`).
- Commentaires et docs en **français** ; libellés UI dans les dictionnaires `src/locales/` (FR = référence, EN/ES/DE = traductions). Formatage via `src/lib/format.ts` (€, kWh selon la locale active : `fr-FR`, `en-GB`, `es-ES`, `de-DE` — devise EUR invariante).
- Toute nouvelle règle de calcul va dans `src/lib/` sous forme de fonction pure.
- Tout nouveau libellé UI va dans les **quatre** dictionnaires (`fr.ts`, `en.ts`, `es.ts`, `de.ts`) simultanément (TypeScript vérifie l'exhaustivité).
- Préférences UI (thème, langue) : clés `localStorage` dédiées `print3d-ui:*`, indépendantes de `print3d-calc:v1`.
- Pas de dépendance lourde sans nécessité ; réutiliser l'existant (`NumberField`, `Select`, `Card`, `useCalculator`, `useI18nContext`).

## Modèle de calcul (résumé)

```
coût matière     = (masse_g / 1000) × prix_€/kg
énergie_kWh      = (puissance_W / 1000) × durée_h
coût électricité = énergie_kWh × prix_€/kWh
coût de base     = coût matière + coût électricité
coût de gâche    = coût de base × (gâche% / 100)
coût de revient  = coût de base + coût de gâche
marge            = coût de revient × (marge% / 100)
prix de vente    = coût de revient + marge
```

Détail du modèle STL (masse via « coque + remplissage », durée via débit volumétrique) : voir le cahier des charges.

## Organisation du travail

Process agile léger : **sprints de 2 semaines**, **user stories** dans `backlog/`, quatre rôles incarnés par des sous-agents Claude Code (`.claude/agents/`) :
- **`product-owner`** — rédige/priorise les stories, planifie les sprints (ne code pas).
- **`developer`** — implémente les stories, vérifie, met à jour les statuts.
- **`documentation`** — maintient la doc (README, CLAUDE.md, docs/, JSDoc) en phase avec le code.
- **`testeur`** — vérifie la qualité via tests Vitest (`src/lib/`), lance la chaîne complète et signale les bugs (ne modifie pas le code applicatif).

Voir **`backlog/README.md`** pour le process, la Definition of Done et l'avancement des sprints.
