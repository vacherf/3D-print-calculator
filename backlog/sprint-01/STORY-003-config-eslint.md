# STORY-003 — Configuration ESLint du projet

- **Statut** : ✅ Terminé
- **Sprint** : sprint-01
- **Estimation** : 2 points
- **Priorité** : Moyenne

## User story

En tant que **développeur**, je veux **un linter fonctionnel** afin de **détecter les erreurs et garder un style cohérent** avant chaque livraison.

## Contexte & valeur

Le `package.json` expose un script `lint` (`eslint .`) mais aucun fichier de configuration ESLint n'existe : la commande échoue. La Definition of Done gagnerait à inclure le lint.

## Critères d'acceptation

- [x] Une config ESLint « flat » (`eslint.config.js`) existe, adaptée à React 19 + TypeScript.
- [x] `npm run lint` s'exécute sans erreur de configuration.
- [x] Les règles couvrent TypeScript, les hooks React et `react-refresh`.
- [x] Les éventuelles erreurs remontées sur le code existant sont corrigées (ou justifiées).
- [x] Le lint est ajouté à la Definition of Done dans `backlog/README.md`.

## Notes techniques (indicatives)

- Stack Vite + React + TS : envisager `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.
- Vérifier la version d'ESLint résolue (le projet n'épingle pas la dépendance dans `devDependencies`).

## Hors périmètre

- Mise en place de Prettier ou d'un hook de pre-commit.

## Journal

- 2026-05-22 — Créée par le PO.
- 2026-05-22 — Implémentée par le Dev. Dépendances installées (`eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`) et épinglées dans `devDependencies`. Config flat `eslint.config.js` (JS + TS + react-hooks + react-refresh/vite + globals Node pour les fichiers de config). 2 erreurs Fast Refresh sur les primitives shadcn (`badge.tsx`, `button.tsx`, co-export `cva`) **justifiées** : règle désactivée pour `src/components/ui/**` uniquement. `npm run lint` → 0 erreur ; `tsc` OK ; 15/15 tests. Lint ajouté à la DoD. → ✅ Terminé.
