# STORY-001 — Import et analyse d'un fichier STL

- **Statut** : ✅ Terminé
- **Sprint** : sprint-01
- **Estimation** : 5 points
- **Priorité** : Haute

## User story

En tant qu'utilisateur, je veux **importer un fichier .STL** afin que la **quantité de filament et la durée d'impression soient préremplies automatiquement**, sans avoir à recopier les valeurs de mon slicer.

## Contexte & valeur

Saisir manuellement la masse et la durée est fastidieux et source d'erreurs. Le fichier STL contient la géométrie : on peut en déduire le volume et estimer la matière.

## Critères d'acceptation

- [x] Je peux importer un `.STL` par clic ou par glisser-déposer.
- [x] Les formats STL **ASCII et binaire** sont pris en charge.
- [x] L'app affiche les **dimensions** (X/Y/Z), le **volume**, la **surface** et le **nombre de triangles**.
- [x] La **quantité de filament (g)** et la **durée (h)** sont préremplies automatiquement.
- [x] Un **taux de remplissage** ajustable recalcule matière et durée en direct.
- [x] Un fichier invalide affiche un message d'erreur clair sans casser l'app.
- [x] L'estimation indique clairement qu'elle est approximative.

## Notes techniques

- Parseur pur dans `src/lib/stl.ts` (volume par tétraèdres signés, surface, bounding box).
- Composant `src/components/StlImporter.tsx`, intégré en tête de `CalculatorForm`.
- Masse via modèle « coque + remplissage » à partir de la densité du filament sélectionné.

## Hors périmètre

- Découpe réelle (slicing), supports, jupe/bordure, multi-pièces.

## Journal

- 2026-05-22 — Créée par le PO.
- 2026-05-22 — Implémentée par le Dev (`stl.ts`, `StlImporter.tsx`). Parseur validé sur un cube 10 mm (1 cm³, 6 cm²). `tsc` OK. → ✅ Terminé.
