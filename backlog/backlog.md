# Backlog produit (stories non planifiées)

Idées formalisées en attente de planification dans un sprint. Triées par priorité.
Le PO les détaille (fichier dédié au format `template-story.md`) au moment de les intégrer à un sprint.

> **Vision produit** : outil simple pour **hobbyistes / usage personnel** — connaître vite et sans effort le coût d'une impression pour soi. Priorité au confort et à la clarté ; les fonctions « vente / facturation » restent secondaires. _(Décidé en revue PO du 2026-05-22.)_
>
> **Hébergement** : un déploiement sur GitHub Pages (STORY-006) est prévu **comme commodité d'accès personnel** (utiliser l'app depuis n'importe quel appareil). La cible reste perso/local : pas de promesse multi-utilisateurs, ni d'exigences SEO/perf/accessibilité ajoutées. _(Décidé le 2026-05-22.)_
>
> ✅ Synchro doc faite le 2026-05-22 par l'agent `documentation` : nuance reportée dans `docs/cahier-des-charges.md` §2.
>
> ✅ Décisions doc PO du 2026-05-22 (à appliquer par l'agent `documentation`) :
> 1. **Formule « coût de revient »** — uniformiser vers la forme développée du cahier des charges (coût de base / coût de gâche / coût de revient) dans `CLAUDE.md` (section « Modèle de calcul ») et `README.md` (section « Méthode de calcul »). Le cahier des charges reste inchangé, il est déjà correct.
> 2. **Lien `backlog/sprint-XX/`** — remplacer ce placeholder dans `CLAUDE.md` (section « Organisation du travail ») par un renvoi unique à `backlog/README.md`, qui est stable et sert déjà de point d'entrée vers les sprints.
>
> Prochain numéro de story disponible : **STORY-011**
>
> **Numérotation 009a/009b** : lors du découpage de STORY-009 (arbitrage du 2026-05-22), les sous-stories ont reçu les suffixes `a` et `b`. Ce mécanisme est réservé aux découpages en cours de sprint ; les nouvelles stories repartent à partir de STORY-010.
>
> **STORY-010** (2026-05-22) : sélecteur de langue compact (icône `Languages` + acronyme FR/EN dans le bouton, acronyme + nom natif dans le menu). Implémentation ad hoc réalisée avant formalisation. Placée en sprint-04 (axe i18n). Statut : 👀 En revue.

## Planifié (sprint 02)

- Sorties du backlog vers `sprint-02/` : **STORY-004** (persistance) et **STORY-005** (récapitulatif imprimable).

## Planifié (sprint 03)

- Sorties du backlog vers `sprint-03/` : **STORY-007** (ErrorBoundary), **STORY-008** (thème sombre), **STORY-009a** (i18n FR/EN, infrastructure).

## Planifié (sprint 04 — anticipé)

- **STORY-009b** (traductions ES/DE, 3 pts) : reportée du sprint-03, pré-affectée au sprint-04. Dépend de STORY-009a. Voir `backlog/sprint-04/STORY-009b-i18n-traductions-es-de.md`. Le reste du sprint-04 sera défini lors de la planification post-sprint-03.

## Qualité & fiabilité — filet « corriger vite »

Initiative transverse pour détecter et corriger les erreurs rapidement, menée progressivement :

1. ✅ **Tests automatisés (Vitest)** — suite sur `calculator.ts` et `stl.ts` (15 tests). Lancer `npm test` (watch) ou `npm run test:run`.
2. 🔜 **ErrorBoundary + garde-fous UI** — éviter l'écran blanc, message clair sur erreur d'exécution. Planifié en sprint-03 (STORY-007).
3. 📋 **Tests automatisés de la couche de persistance** — couvrir `persistence.ts` avec Vitest (mock `localStorage`). Piste retirée du sprint-03 faute de priorité ; à reprendre quand la couche persistance évoluera. _Note de STORY-004 : « Pas de test unitaire automatisé pour `persistence.ts` — nécessiterait un mock de `localStorage` dans l'environnement de test. »_
4. 📋 **Process bug / hotfix** — gabarit de bug (`backlog/template-bug.md`) et convention `backlog/hotfixes/` pour les corrections hors sprint. Piste retirée du sprint-03 ; à traiter si un bug bloquant survient avant d'être formalisé.

## Priorité moyenne

- **Paramètres STL avancés** — exposer dans l'UI l'épaisseur de paroi et le débit volumétrique (déjà des paramètres de `src/lib/stl.ts`) pour affiner masse et durée.
- **Bibliothèque de filaments personnalisée** — permettre d'ajouter/éditer ses propres bobines (prix, densité), utile à un hobbyiste fidèle à certaines marques.

## Priorité basse

- **Thème clair / sombre** — bascule de thème. _(Promu en sprint-03 : STORY-008.)_
- **Aperçu 3D du STL** — visualiser le modèle importé (ex. Three.js).
- **Amortissement imprimante / usure** — intégrer l'amortissement et l'usure (buse, plateau) au coût de revient. _Plus pertinent pour un usage pro → basse pour la cible hobbyiste actuelle._

## Idées à challenger (pas encore mûres)

- **Multi-pièces / lot** — additionner plusieurs STL ou N exemplaires. _Surtout utile en contexte de vente en série → en attente, hors cible actuelle._
- **Devises et tarifs internationaux** — sortir de l'hypothèse « France / EUR ».
