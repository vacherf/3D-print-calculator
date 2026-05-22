# Sprint 01

- **Période** : 2026-05-19 → 2026-05-30 (2 semaines)
- **Objectif** : Fiabiliser l'estimation d'entrée — préremplir le calculateur depuis un fichier STL et depuis un modèle d'imprimante réel, plutôt que des saisies manuelles approximatives.

## Stories

| Story | Titre | Points | Statut |
|-------|-------|:------:|--------|
| STORY-001 | Import et analyse d'un fichier STL | 5 | ✅ Terminé |
| STORY-002 | Sélection de l'imprimante (puissance auto) | 3 | ✅ Terminé |
| STORY-003 | Configuration ESLint du projet | 2 | ✅ Terminé |

## Bilan

- **Objectif** : **atteint.** L'estimation d'entrée ne repose plus sur des saisies manuelles approximatives : la matière et la durée se préremplissent depuis un fichier STL, et la puissance électrique vient du modèle d'imprimante choisi. Les deux sources d'incertitude visées par le sprint sont couvertes.
- **Réalisé** : **10/10 points livrés** (3 stories sur 3, vélocité = engagement).
  - **STORY-001 — Import & analyse STL (5 pts)** : l'utilisateur importe un `.STL` (ASCII ou binaire, clic ou glisser-déposer) ; l'app affiche dimensions, volume, surface et nombre de triangles, et préremplit masse (g) et durée (h) avec un taux de remplissage ajustable. Parseur pur dans `src/lib/stl.ts`, composant `StlImporter.tsx`.
  - **STORY-002 — Sélection d'imprimante (3 pts)** : le champ « puissance » devient une liste d'environ 19 modèles regroupés par marque (défaut Bambu Lab A1), avec affichage de la puissance retenue et option « Personnalisé » pour saisir un relevé wattmètre. Catalogue dans `src/lib/printers.ts`, composant `PrinterSelector.tsx`.
  - **STORY-003 — Configuration ESLint (2 pts)** : config « flat » React 19 + TS opérationnelle, dépendances installées et épinglées ; `npm run lint` passe et le lint entre dans la Definition of Done.
- **Non terminé / reporté** : aucun. Périmètre du sprint entièrement livré.
- **Faits marquants** :
  - Le script `lint` du `package.json` était cassé (aucune config ESLint) ; STORY-003 a fiabilisé l'outillage et **durci la DoD** pour les sprints suivants.
  - 2 erreurs Fast Refresh sur les primitives shadcn (`badge.tsx`, `button.tsx`, co-export `cva`) **assumées** : règle désactivée uniquement sur `src/components/ui/**`, sans toucher au code applicatif.
  - Estimation STL validée sur un cas témoin (cube 10 mm → 1 cm³, 6 cm²) ; elle reste **volontairement approximative** (modèle « coque + remplissage », pas de slicing réel) — limite connue et à communiquer dans l'UI.
  - Vérifications vertes en fin de sprint : `tsc` OK, `npm run lint` 0 erreur, 15/15 tests.
- **Enseignements** : découper l'outillage (lint) en story dédiée a évité de polluer les stories fonctionnelles ; la validation sur un cas témoin chiffré pour le parseur STL est à reconduire pour toute logique de `src/lib/`.
- **Suite** : socle d'estimation fiable en place → le sprint 02 peut se concentrer sur le confort et la restitution (persistance de la saisie, récapitulatif imprimable, déploiement). Attention à la **dépendance externe** de STORY-006 (création du repo GitHub par l'utilisateur).
- **Sprint 01 clôturé** le 2026-05-22.
