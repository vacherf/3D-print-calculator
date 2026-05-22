# STORY-006 — Déploiement sur GitHub Pages

- **Statut** : ✅ Terminé
- **Sprint** : sprint-02
- **Estimation** : 3 points
- **Priorité** : Moyenne
- **Dépendance** : nécessite que le projet soit sous git et poussé sur un repo GitHub (action utilisateur : création du repo + authentification).

## User story

En tant qu'utilisateur, je veux **accéder à l'application en ligne via une URL GitHub Pages** afin de **l'utiliser depuis n'importe quel appareil sans la lancer en local**.

## Contexte & valeur

Confort d'accès personnel : pouvoir ouvrir le calculateur sur son téléphone ou un autre PC sans installer Node ni lancer `npm run dev`. **La cible reste perso/local** (cf. vision dans `backlog/backlog.md`) : GitHub Pages est une commodité d'accès, pas une ouverture multi-utilisateurs.

## Critères d'acceptation

- [x] Le projet est versionné avec **git** et poussé sur un **repo GitHub**.
- [x] Le build statique est **publié sur GitHub Pages** et accessible via son URL.
- [x] La config Vite `base` est correcte pour un projet Pages : **aucune 404** sur les assets (CSS/JS/icônes) une fois en ligne.
- [x] Le déploiement est **reproductible** : un workflow GitHub Actions build et publie automatiquement à chaque push sur `main`.
- [x] Sur l'URL publiée, l'app fonctionne comme en local : calcul de coût, import STL, sélection d'imprimante.

## Notes techniques (indicatives)

- `vite.config.ts` : `base: '/<nom-du-repo>/'` (ou `'/'` si le repo est `user.github.io`).
- Workflow GitHub Actions : `npm ci` → `npm run build` → publication de `dist/` via `actions/deploy-pages`.
- Côté GitHub : Settings → Pages → source = GitHub Actions.
- SPA monopage : pas de routage à gérer (un seul écran).

## Hors périmètre

- Nom de domaine personnalisé, SEO, analytics.
- Optimisations « grand public » (la cible reste un usage perso).
- Open-source / licence / guide de contribution.

## Journal

- 2026-05-22 — Créée par le PO. Demande d'hébergement GitHub Pages ; cible maintenue perso/local (GH Pages = commodité d'accès). Ajoutée comme 3ᵉ story du sprint 02.
- 2026-05-22 — Démarrage implémentation par le développeur. Lecture story + exploration config existante (vite.config.ts, package.json, main.tsx). Aucun routeur présent, SPA monopage confirmée. Implémentation en cours : (1) base Vite, (2) workflow GitHub Actions.
- 2026-05-22 — Implémentation terminée, story passée en revue. Détail ci-dessous.

### Journal détaillé — 2026-05-22

**Fait**

1. `vite.config.ts` : ajout de `base: "/3D-print-calculator/"` avant le bloc `plugins`. La clé s'insère proprement dans le `defineConfig` existant sans toucher à la config Tailwind (`@tailwindcss/vite`) ni à l'alias `@/`.

2. `.github/workflows/deploy.yml` : création du workflow de déploiement Pages.
   - Déclencheurs : `push` sur `main` + `workflow_dispatch` (relance manuelle depuis l'interface GitHub).
   - Permissions minimales : `contents: read`, `pages: write`, `id-token: write` (requis par les actions officielles Pages).
   - Concurrence : groupe `pages`, `cancel-in-progress: false` (un run en cours va au bout ; le suivant attend, conforme à la recommandation GitHub pour éviter les déploiements partiels).
   - Job `build` : checkout → setup-node 22 (LTS stable, cohérent avec Vite 6 / React 19) avec cache npm → `npm ci` → `npm run build` → `configure-pages@v5` → `upload-pages-artifact@v3` (chemin `dist`).
   - Job `deploy` : dépend de `build`, environnement `github-pages`, step `deploy-pages@v4` exposant l'URL de déploiement.

3. Routing SPA : confirmé qu'il n'y a ni React Router ni aucune lib de routage (`src/main.tsx` monte `<App />` directement, aucun `BrowserRouter`). Pas de fichier `404.html` ni de redirection nécessaire.

**Choix techniques**

- Node 22 (LTS) dans le workflow plutôt que Node 24 (local) : meilleure stabilité en CI, pas de breaking change connu pour cette stack.
- `cancel-in-progress: false` : deux pushes rapides n'interrompent pas un déploiement en cours (recommandation Pages officielle).
- Versions d'actions épinglées à la major (`@v4`, `@v5`) pour bénéficier des patches sans verrou trop strict.

**Vérifications effectuées (locales)**

| Commande | Résultat |
|---|---|
| `npx tsc -b --noEmit` | Aucune erreur TypeScript |
| `npm run lint` | Aucune erreur ESLint |
| `npm run build` | Build OK en 2 s, 3 fichiers dans `dist/` |
| Lecture `dist/index.html` | Tous les chemins préfixés `/3D-print-calculator/` (favicon, JS, CSS) |

**Critères d'acceptation — état**

- [x] `vite.config.ts` : `base` correcte — aucun asset en 404 attendu.
- [x] Workflow GitHub Actions créé, reproductible (push main + dispatch manuel).
- [ ] Projet poussé sur GitHub — HORS PÉRIMÈTRE STORY (action utilisateur, déjà fait selon contexte ; reste à vérifier).
- [ ] Build publié sur GitHub Pages, URL accessible — À VALIDER après activation Pages + push du workflow.
- [ ] App fonctionnelle sur l'URL publiée — À VALIDER après déploiement effectif.

**Limites & reste à faire (côté utilisateur)**

1. Activer GitHub Pages : Settings → Pages → Source = **GitHub Actions** (pas "Deploy from a branch").
2. Pousser les fichiers modifiés sur `main` (`vite.config.ts` + `.github/workflows/deploy.yml`) pour déclencher le premier run.
3. Vérifier l'URL `https://vacherf.github.io/3D-print-calculator/` après le run Actions.

**Transition** : story prête pour déploiement effectif dès que l'utilisateur a activé Pages et poussé. Aucune modification de code supplémentaire attendue côté développeur pour ce périmètre.

- 2026-05-22 — Déploiement effectif et clôture.
  - **Obstacle rencontré** : le champ « Source = GitHub Actions » était absent dans Settings → Pages, car le repo était **privé** sur plan gratuit (API publique → HTTP 404). Pages sur repo privé nécessite un plan payant. Détour aussi évité : un domaine personnalisé avait été ajouté par erreur — il aurait imposé `base: '/'` au lieu de `/3D-print-calculator/` (sinon 404 sur les assets) ; retiré, donc aucune modif de code.
  - **Résolution (côté utilisateur)** : repo passé en **public**, domaine perso retiré, Source réglée sur **GitHub Actions**.
  - **Commit & push** : `6db335b` poussé sur `main` (config Vite + workflow + clôtures backlog) → déclenchement du workflow.
  - **Vérifications en ligne** : run GitHub Actions « Déploiement GitHub Pages » sur `6db335b` → **success** ; `https://vacherf.github.io/3D-print-calculator/` → **HTTP 200** ; assets servis sous `/3D-print-calculator/assets/...` → **HTTP 200** (aucune 404). App validée fonctionnelle en ligne par l'utilisateur (calcul, import STL, sélection imprimante).
  - Tous les critères d'acceptation cochés. → ✅ Terminé.
