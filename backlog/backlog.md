# Backlog produit (stories non planifiées)

Idées formalisées en attente de planification dans un sprint. Triées par priorité.
Le PO les détaille (fichier dédié au format `template-story.md`) au moment de les intégrer à un sprint.

> **Vision produit** : outil simple pour **hobbyistes / usage personnel** — connaître vite et sans effort le coût d'une impression pour soi. Priorité au confort et à la clarté ; les fonctions « vente / facturation » restent secondaires. _(Décidé en revue PO du 2026-05-22.)_
>
> **Hébergement** : un déploiement sur GitHub Pages (STORY-006) est prévu **comme commodité d'accès personnel** (utiliser l'app depuis n'importe quel appareil). La cible reste perso/local : pas de promesse multi-utilisateurs, ni d'exigences SEO/perf/accessibilité ajoutées. _(Décidé le 2026-05-22.)_
>
> ✅ Synchro doc faite le 2026-05-22 par l'agent `documentation` : nuance reportée dans `docs/cahier-des-charges.md` §2.
>
> Prochain numéro de story disponible : **STORY-007**

## Planifié (sprint 02)

- ✅ Sorties du backlog vers `sprint-02/` : **STORY-004** (persistance) et **STORY-005** (récapitulatif imprimable).

## Qualité & fiabilité — filet « corriger vite » (en cours)

Initiative transverse pour détecter et corriger les erreurs rapidement, menée progressivement :

1. ✅ **Tests automatisés (Vitest)** — suite sur `calculator.ts` et `stl.ts` (15 tests). Lancer `npm test` (watch) ou `npm run test:run`.
2. 🔜 **ErrorBoundary + garde-fous UI** — éviter l'écran blanc, message clair sur erreur d'exécution.
3. 🔜 **Process bug / hotfix** — gabarit de bug + voie rapide hors cycle de sprint.

## Priorité moyenne

- **Paramètres STL avancés** — exposer dans l'UI l'épaisseur de paroi et le débit volumétrique (déjà des paramètres de `src/lib/stl.ts`) pour affiner masse et durée.
- **Bibliothèque de filaments personnalisée** — permettre d'ajouter/éditer ses propres bobines (prix, densité), utile à un hobbyiste fidèle à certaines marques.

## Priorité basse

- **Thème clair / sombre** — bascule de thème.
- **Aperçu 3D du STL** — visualiser le modèle importé (ex. Three.js).
- **Amortissement imprimante / usure** — intégrer l'amortissement et l'usure (buse, plateau) au coût de revient. _Plus pertinent pour un usage pro → basse pour la cible hobbyiste actuelle._

## Idées à challenger (pas encore mûres)

- **Multi-pièces / lot** — additionner plusieurs STL ou N exemplaires. _Surtout utile en contexte de vente en série → en attente, hors cible actuelle._
- **Devises et tarifs internationaux** — sortir de l'hypothèse « France / EUR ».
