# STORY-002 — Sélection de l'imprimante (puissance auto)

- **Statut** : ✅ Terminé
- **Sprint** : sprint-01
- **Estimation** : 3 points
- **Priorité** : Haute

## User story

En tant qu'utilisateur, je veux **choisir mon modèle d'imprimante dans une liste** afin que sa **puissance soit déterminée automatiquement**, plutôt que d'estimer un nombre de watts au hasard.

## Contexte & valeur

Peu d'utilisateurs connaissent la consommation réelle de leur imprimante. Une liste des modèles courants (Bambu Lab, Prusa, Creality, Anycubic, Elegoo) avec une puissance moyenne associée rend l'estimation du coût électrique fiable et sans effort.

## Critères d'acceptation

- [x] Le champ « Puissance imprimante » est remplacé par une **liste de modèles**.
- [x] Les modèles sont **regroupés par marque**.
- [x] Choisir un modèle applique automatiquement sa **puissance moyenne (W)** au calcul.
- [x] La puissance retenue est affichée à l'utilisateur (« ≈ X W »).
- [x] Une option **« Personnalisé »** permet de saisir sa propre puissance (wattmètre).
- [x] Le coût électrique se met à jour selon le modèle choisi.

## Notes techniques

- Catalogue dans `src/lib/printers.ts` (id, nom, marque, `avgPowerW`).
- Composant `src/components/PrinterSelector.tsx` (Select groupé par marque).
- État `printerId` + action `selectPrinter` dans `useCalculator`.

## Hors périmètre

- Profils de consommation détaillés (chauffe vs régime établi), import depuis le slicer.

## Journal

- 2026-05-22 — Créée par le PO.
- 2026-05-22 — Implémentée par le Dev (`printers.ts`, `PrinterSelector.tsx`, `useCalculator`). ~19 modèles, défaut Bambu Lab A1. `tsc` OK. → ✅ Terminé.
