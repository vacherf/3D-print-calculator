# Sprint 02 — Clôturé

- **Période** : 2026-05-22 → 2026-05-22 (sprint intensif, tout livré en une journée)
- **Date de clôture** : 2026-05-22
- **Cible produit** : hobbyistes / usage personnel.
- **Objectif** : Confort, restitution & accès — conserver la saisie entre deux visites, produire un récapitulatif imprimable du coût, et rendre l'app accessible en ligne (GitHub Pages) pour un usage perso multi-appareils.

## Stories

| Story | Titre | Points | Statut |
|-------|-------|:------:|--------|
| STORY-004 | Persistance de la saisie | 3 | ✅ Terminé |
| STORY-005 | Export d'un récapitulatif imprimable | 5 | ✅ Terminé |
| STORY-006 | Déploiement sur GitHub Pages | 3 | ✅ Terminé |

> Charge totale ~11 points (sprint chargé, assumé pour un projet solo). STORY-006 avait une **dépendance externe** : création du repo GitHub par l'utilisateur.

## Bilan

- **Objectif** : **atteint.** Les trois axes du sprint sont couverts : la saisie persiste entre les visites, l'utilisateur peut exporter un récapitulatif imprimable propre, et l'application est accessible en ligne via une URL stable sur GitHub Pages.

- **Réalisé** : **11/11 points livrés** (3 stories sur 3, vélocité = engagement).
  - **STORY-004 — Persistance de la saisie (3 pts)** : tous les champs du calculateur (filament, prix, grammage, durée, imprimante, puissance, tarif élec., gâche, marge) sont sauvegardés automatiquement dans le `localStorage` sous la clé versionnée `print3d-calc:v1`. Au rechargement, l'état est restauré. Le bouton « Réinitialiser » purge le `localStorage` et remet les valeurs par défaut. Les données corrompues ou issues d'un format ancien sont ignorées silencieusement (retour aux défauts). Validé manuellement dans le navigateur (F5, clé corrompue, reset).
  - **STORY-005 — Export d'un récapitulatif imprimable (5 pts)** : un bouton « Imprimer / Exporter » déclenche `window.print()`. Pendant l'impression, l'interface applicative est intégralement masquée ; un document structuré (composant `PrintSummary`) la remplace, avec noms lisibles de filament et d'imprimante, paramètres clés, détail du coût (matière, énergie + kWh, gâche, marge, total), et date de génération en français. Mise en page A4 portrait (marges 20 mm × 18 mm, 11 pt, noir & blanc) définie par un bloc `@media print` dans `index.css`. Validé visuellement par l'utilisateur via l'aperçu avant impression du navigateur.
  - **STORY-006 — Déploiement sur GitHub Pages (3 pts)** : `vite.config.ts` configure `base: "/3D-print-calculator/"`, un workflow GitHub Actions (`.github/workflows/deploy.yml`) build et publie `dist/` à chaque push `main` ainsi que sur déclenchement manuel. L'application est en ligne sur `https://vacherf.github.io/3D-print-calculator/` ; HTTP 200 sur la page et les assets (aucun 404) ; fonctionnalités validées en ligne (calcul, import STL, sélection imprimante).

- **Non terminé / reporté** : aucun. Le périmètre du sprint est intégralement livré.

- **Faits marquants** :
  - **STORY-006 — repo privé, Pages indisponible** : la dépendance externe identifiée à la planification (création du repo GitHub) s'est confirmée avec une friction supplémentaire — le repo était initialement privé, ce qui rend GitHub Pages indisponible sur le plan gratuit (aucune option « Source = GitHub Actions » visible dans Settings → Pages). Résolution : repo passé en public.
  - **STORY-006 — domaine personnalisé ajouté par erreur** : un domaine perso avait été configuré dans GitHub Pages, ce qui aurait imposé de changer `base` de `/3D-print-calculator/` vers `'/'` (sinon 404 sur tous les assets). Retiré avant le push ; aucune modification de code nécessaire.
  - **STORY-006 — premier run Actions réussi** : commit `6db335b` poussé sur `main`, run « Déploiement GitHub Pages » → success, HTTP 200 vérifié sur la page et les assets.
  - **STORY-005 — stratégie CSS pure retenue** : le composant `PrintSummary` n'utilise ni librairie de génération PDF ni portal React. La technique `print:hidden` / `print:block` (Tailwind + `@media print`) s'est avérée suffisante et n'introduit aucune dépendance externe. Les styles d'impression sont écrits en CSS pur (pas de classes Tailwind utilitaires) car les couleurs oklch ne sont pas garanties converties sur tous les pilotes d'imprimante.
  - **STORY-004 — module `persistence.ts` isolé** : la logique de lecture/écriture `localStorage` a été placée dans `src/lib/persistence.ts` (module pur, sans React), conformément à la convention du projet. Facilite un futur test unitaire.
  - **Vérifications vertes** sur les trois stories : `npx tsc -b --noEmit` 0 erreur, `npm run lint` 0 avertissement, `npm run build` success.

- **Enseignements** :
  - **Valider les prérequis d'hébergement en amont** : visibilité du repo (public vs privé) et réglages Pages auraient pu être vérifiés avant le sprint pour éviter un blocage en fin de livraison. À ajouter comme point de checklist pour tout sprint avec dépendance d'infrastructure externe.
  - **La dépendance externe était bien signalée** (note « repo GitHub à créer par l'utilisateur » dans le SPRINT.md et dans la story) ; le vrai obstacle (plan gratuit + repo privé) n'était pas anticipé, mais la friction est restée limitée grâce à la résolution rapide.
  - **La stratégie CSS `@media print` est à reconduire** pour tout futur besoin d'export léger : simple, sans dépendance, portable d'un navigateur à l'autre.

- **Suite** : le sprint 02 est le dernier sprint planifié. Le backlog produit contient des pistes pour la suite, à arbitrer selon la motivation et la valeur perçue :
  - **Priorité moyenne** : ErrorBoundary + garde-fous UI (écran blanc sur erreur) ; paramètres STL avancés (épaisseur de paroi, débit volumétrique exposés dans l'UI) ; bibliothèque de filaments personnalisée.
  - **Priorité basse** : thème clair/sombre, aperçu 3D du STL, amortissement imprimante.
  - **Idées non mûres** : multi-pièces/lot, devises internationales.

  Un sprint 03 éventuel pourrait se concentrer sur la qualité et la robustesse (ErrorBoundary, tests additionnels sur `persistence.ts`, process bug/hotfix) — socle utile avant d'ajouter des fonctions.

- **Sprint 02 clôturé** le 2026-05-22.
