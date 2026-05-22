# STORY-008 — Bascule thème clair / sombre

- **Statut** : 🔜 À faire
- **Sprint** : sprint-03
- **Estimation** : 3 points
- **Priorité** : Moyenne

## User story

En tant qu'utilisateur, je veux pouvoir **basculer entre le thème clair et le thème sombre**, et que **mon choix soit mémorisé**, afin de travailler dans le confort visuel qui me convient, que ce soit en pleine lumière ou dans l'obscurité.

## Contexte & valeur

L'application tourne en local (et sur GitHub Pages pour un usage perso) et peut être utilisée à n'importe quelle heure. Beaucoup d'utilisateurs préfèrent le thème sombre le soir ou sur un écran peu lumineux. La valeur est faible en fonctionnalité pure mais forte en confort d'usage quotidien — c'est pourquoi la story est classée Moyenne (effort modéré, bénéfice réel mais non bloquant).

Le système de design en place (Tailwind v4 + shadcn/ui) définit déjà **toutes les couleurs du thème sombre** dans `src/index.css` via la classe `.dark` sur `<html>` et les variables CSS oklch. L'infrastructure existe ; il reste à la piloter.

## Critères d'acceptation

- [ ] Un bouton ou une icône de bascule (soleil / lune, ou libellé explicite) est visible dans l'en-tête de l'application.
- [ ] Cliquer sur ce bouton bascule instantanément l'interface entre le thème clair et le thème sombre.
- [ ] Le thème sombre applique bien les couleurs définies dans la classe `.dark` de `src/index.css` — aucune couleur « dure » ne persiste hors thème.
- [ ] Au chargement de la page, la préférence système de l'utilisateur (`prefers-color-scheme: dark`) est détectée et appliquée comme valeur par défaut, si aucun choix explicite n'a encore été enregistré.
- [ ] Le choix explicite de l'utilisateur est **persisté** dans le `localStorage` et restauré au rechargement de la page.
- [ ] Le bouton « Réinitialiser » (qui purge la saisie calculateur) **ne remet pas à zéro la préférence de thème** — les deux préférences sont indépendantes.
- [ ] Le thème s'applique à **toute l'interface**, y compris les composants shadcn/ui (cards, selects, boutons, badges, séparateurs), l'importeur STL et le récapitulatif latéral.
- [ ] La zone d'impression (`@media print`) n'est pas affectée : le document imprimé reste toujours en noir & blanc sur fond blanc, quel que soit le thème actif.
- [ ] `npx tsc -b --noEmit`, `npm run lint` et `npm run build` passent sans erreur.

## Notes techniques (indicatives)

- Le mécanisme de Tailwind v4 pour le thème sombre repose sur la présence de la classe `.dark` sur l'élément `<html>`. La ligne `@custom-variant dark (&:is(.dark *))` dans `src/index.css` le confirme. Il suffit donc d'ajouter/retirer cette classe sur `document.documentElement`.
- **Persistance du thème** : deux approches possibles, sans impact fonctionnel — le développeur choisit la plus cohérente :
  - **Clé dédiée** (ex. `print3d-ui:theme`) : plus simple à isoler, aucun risque de casser la validation de `PersistedState` dans `persistence.ts`. Recommandée si l'on veut garder les deux couches séparées.
  - **Extension de la clé existante** `print3d-calc:v1` : nécessite d'incrémenter le schéma (`v2`) ou d'ajouter un champ optionnel avec migration — plus risqué pour un gain nul.
  - La clé dédiée est la piste recommandée par le PO ; arbitrage final laissé au développeur.
- **Détection système** : `window.matchMedia('(prefers-color-scheme: dark)').matches` au premier chargement, avant de lire le `localStorage`. Ordre de priorité : 1. choix explicite en `localStorage` ; 2. préférence système ; 3. thème clair par défaut.
- Le bouton de bascule peut être un simple `<Button variant="ghost" size="icon">` avec les icônes `Sun` / `Moon` de lucide-react (déjà dans les dépendances).
- Un petit hook `useTheme()` dans `src/hooks/` serait cohérent avec l'architecture existante (`useCalculator`).
- L'état du thème n'a pas besoin de transiter par `useCalculator` ; c'est une préférence d'affichage, pas une donnée de calcul.

## Hors périmètre

- Thèmes supplémentaires au-delà du clair et du sombre (ex. thème coloré, thème haute contrastе).
- Adaptation du thème pour le document imprimé : l'impression reste toujours en noir & blanc.
- Personnalisation des couleurs par l'utilisateur.

## Journal

- 2026-05-22 — Créée par le PO (sprint-03, axe expérience & robustesse de l'interface). Numéro 008 réutilisé : STORY-008-tests-persistence n'a jamais été implémentée et a été retirée du sprint.
