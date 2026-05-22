# STORY-006 — Déploiement sur GitHub Pages

- **Statut** : 🔜 À faire
- **Sprint** : sprint-02 (planifié)
- **Estimation** : 3 points
- **Priorité** : Moyenne
- **Dépendance** : nécessite que le projet soit sous git et poussé sur un repo GitHub (action utilisateur : création du repo + authentification).

## User story

En tant qu'utilisateur, je veux **accéder à l'application en ligne via une URL GitHub Pages** afin de **l'utiliser depuis n'importe quel appareil sans la lancer en local**.

## Contexte & valeur

Confort d'accès personnel : pouvoir ouvrir le calculateur sur son téléphone ou un autre PC sans installer Node ni lancer `npm run dev`. **La cible reste perso/local** (cf. vision dans `backlog/backlog.md`) : GitHub Pages est une commodité d'accès, pas une ouverture multi-utilisateurs.

## Critères d'acceptation

- [ ] Le projet est versionné avec **git** et poussé sur un **repo GitHub**.
- [ ] Le build statique est **publié sur GitHub Pages** et accessible via son URL.
- [ ] La config Vite `base` est correcte pour un projet Pages : **aucune 404** sur les assets (CSS/JS/icônes) une fois en ligne.
- [ ] Le déploiement est **reproductible** : un workflow GitHub Actions build et publie automatiquement à chaque push sur `main`.
- [ ] Sur l'URL publiée, l'app fonctionne comme en local : calcul de coût, import STL, sélection d'imprimante.

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
