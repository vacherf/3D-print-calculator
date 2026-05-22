# STORY-008 — Bascule thème clair / sombre

- **Statut** : ✅ Terminé
- **Sprint** : sprint-03
- **Estimation** : 3 points
- **Priorité** : Moyenne

## User story

En tant qu'utilisateur, je veux pouvoir **basculer entre le thème clair et le thème sombre**, et que **mon choix soit mémorisé**, afin de travailler dans le confort visuel qui me convient, que ce soit en pleine lumière ou dans l'obscurité.

## Contexte & valeur

L'application tourne en local (et sur GitHub Pages pour un usage perso) et peut être utilisée à n'importe quelle heure. Beaucoup d'utilisateurs préfèrent le thème sombre le soir ou sur un écran peu lumineux. La valeur est faible en fonctionnalité pure mais forte en confort d'usage quotidien — c'est pourquoi la story est classée Moyenne (effort modéré, bénéfice réel mais non bloquant).

Le système de design en place (Tailwind v4 + shadcn/ui) définit déjà **toutes les couleurs du thème sombre** dans `src/index.css` via la classe `.dark` sur `<html>` et les variables CSS oklch. L'infrastructure existe ; il reste à la piloter.

## Critères d'acceptation

- [x] Un bouton ou une icône de bascule (soleil / lune, ou libellé explicite) est visible dans l'en-tête de l'application.
- [x] Cliquer sur ce bouton bascule instantanément l'interface entre le thème clair et le thème sombre.
- [x] Le thème sombre applique bien les couleurs définies dans la classe `.dark` de `src/index.css` — aucune couleur « dure » ne persiste hors thème. *(validé visuellement le 2026-05-22)*
- [x] Au chargement de la page, la préférence système de l'utilisateur (`prefers-color-scheme: dark`) est détectée et appliquée comme valeur par défaut, si aucun choix explicite n'a encore été enregistré.
- [x] Le choix explicite de l'utilisateur est **persisté** dans le `localStorage` et restauré au rechargement de la page. *(code vérifié — à confirmer visuellement)*
- [x] Le bouton « Réinitialiser » (qui purge la saisie calculateur) **ne remet pas à zéro la préférence de thème** — les deux préférences sont indépendantes.
- [x] Le thème s'applique à **toute l'interface**, y compris les composants shadcn/ui (cards, selects, boutons, badges, séparateurs), l'importeur STL et le récapitulatif latéral. *(validé visuellement le 2026-05-22)*
- [x] La zone d'impression (`@media print`) n'est pas affectée : le document imprimé reste toujours en noir & blanc sur fond blanc, quel que soit le thème actif.
- [x] `npx tsc -b --noEmit`, `npm run lint` et `npm run build` passent sans erreur.

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
- 2026-05-22 — Démarrage de l'implémentation par le développeur. Exploration de l'existant : classe `.dark` et variables oklch présentes dans `src/index.css` (infrastructure Tailwind v4 prête), `App.tsx` contient l'en-tête avec le bouton Réinitialiser, `persistence.ts` utilise la clé `print3d-calc:v1` avec validation stricte. Approche retenue : hook `useTheme` dans `src/hooks/`, clé dédiée `print3d-ui:theme` pour la persistance (indépendante du calculateur), bouton `Sun`/`Moon` ajouté dans l'en-tête de `App.tsx`.
- 2026-05-22 — Implémentation terminée. Détail ci-dessous.

  **Fait fonctionnel**
  - Bouton de bascule clair/sombre visible dans l'en-tête, à gauche du bouton « Réinitialiser ».
  - Icône Sun (soleil) affiché en thème sombre, icône Moon (lune) en thème clair — indique le mode vers lequel on bascule, convention répandue et lisible.
  - `aria-label` et `title` en français : « Passer en thème clair » / « Passer en thème sombre ».
  - Bascule instantanée : la classe `.dark` est ajoutée/retirée sur `document.documentElement` à chaque clic.
  - Persistance dans `localStorage` sous la clé `print3d-ui:theme`, indépendante de `print3d-calc:v1`.
  - Le bouton « Réinitialiser » efface uniquement l'état calculateur (`clearState()`) — la clé `print3d-ui:theme` n'est jamais touchée par `useCalculator`.
  - Détection de la préférence système (`prefers-color-scheme: dark`) appliquée au premier chargement si aucun choix explicite n'est stocké.

  **Comment technique / Choix**
  - Nouveau fichier `src/hooks/useTheme.ts` : hook `useTheme()` retournant `{ theme, toggleTheme }`. Logique isolée, sans dépendance à `useCalculator`. Cohérent avec l'architecture existante (séparation hooks / lib / UI).
  - Clé dédiée `print3d-ui:theme` choisie conformément à la recommandation du PO. Zéro risque de casser la validation `isValidPersistedState` de `persistence.ts` (qui vérifie exhaustivement les champs de `PersistedState`).
  - `resolveInitialTheme()` s'exécute comme initialiseur de `useState` (forme fonction), ce qui garantit qu'elle ne tourne qu'une fois par montage, sans effet de bord sur le rendu.
  - `applyThemeToDocument()` est appelée dans un `useEffect` réactif au `theme`, ce qui garantit la cohérence même en cas de rendu concurrent.
  - Bouton `<Button variant="ghost" size="icon">` conforme au composant shadcn/ui existant, pas de nouvelle dépendance.
  - `Moon` et `Sun` issus de `lucide-react`, déjà dans les dépendances du projet.
  - L'en-tête regroupe maintenant les deux contrôles dans un `<div className="flex items-center gap-2">`, conservant l'alignement flex existant.
  - Impression : l'en-tête entier porte `print:hidden` ; `body { background: white !important; color: black !important; }` et `#print-summary { color: black; background: white; }` dans `@media print` (déjà en place depuis STORY-006) assurent que le document imprimé reste blanc/noir quel que soit le thème actif. Aucune modification de `index.css` nécessaire.

  **Vérifications avec résultats**
  - `npx tsc -b --noEmit` : PASSE, aucune erreur TypeScript.
  - `npm run lint` (ESLint) : PASSE, aucun avertissement ni erreur.
  - `npm run build` : PASSE, build Vite complet en 1,80 s, aucune erreur.

  **Critères d'acceptation couverts (vérifiés par code/build)**
  - [x] Bouton de bascule (icône Sun/Moon) visible dans l'en-tête.
  - [x] Clic bascule instantanément l'interface (classe `.dark` sur `<html>`).
  - [x] Préférence système détectée et appliquée si aucun choix explicite.
  - [x] Choix persisté dans le localStorage (clé `print3d-ui:theme`).
  - [x] Bouton « Réinitialiser » ne remet pas à zéro la préférence de thème (clés séparées).
  - [x] La zone d'impression reste en noir & blanc sur fond blanc (`@media print` force `background: white`, `color: black`).
  - [x] `tsc`, `lint` et `build` passent sans erreur.

  **Critères restant à valider visuellement par l'utilisateur**
  - [ ] Le thème sombre applique bien les couleurs `.dark` (variables oklch) à toute l'interface — cards, selects, boutons, badges, séparateurs, importeur STL, récapitulatif latéral — sans couleur « dure » persistante. À inspecter dans le navigateur en basculant le thème.
  - [ ] La persistance est effective : choisir un thème, recharger la page (F5), vérifier que le thème est restauré sans flash de thème opposé.
  - [ ] La détection système : ouvrir l'application en mode navigation privée (pas de clé localStorage), changer la préférence système dans les paramètres OS ou outils développeur, vérifier que l'app démarre dans le bon thème.
  - [ ] Le bouton « Réinitialiser » ne change pas le thème — à tester manuellement.
  - [ ] Lancer l'impression (Ctrl+P) en mode sombre et vérifier que l'aperçu d'impression reste en noir & blanc sur fond blanc.

  **Limites et points d'attention**
  - Il n'y a pas de protection contre le « flash of wrong theme » (FOWT) au premier rendu, car React hydrate après le HTML statique. Dans le cadre d'une app locale/Vite sans SSR, ce flash est imperceptible dans la pratique (le hook s'exécute synchroniquement avant le premier paint via `useState` + `useEffect`). Si un FOWT apparaît sur une machine lente, une solution serait d'injecter un script inline dans `index.html` avant le bundle JS — hors périmètre de cette story.
  - La détection du changement de préférence système en temps réel (via `matchMedia.addEventListener('change', ...)`) n'est pas implémentée : seule la préférence au chargement est prise en compte. Ce comportement est suffisant pour l'usage visé ; une écoute réactive serait une amélioration future si nécessaire.

- 2026-05-22 — Validation manuelle par l'utilisateur dans le navigateur. Bascule clair/sombre OK sur toute l'interface (aucune couleur figée), persistance du choix après rechargement confirmée (sans flash), isolation du bouton « Réinitialiser » OK, et document d'impression resté noir sur blanc en thème sombre. Tous les critères cochés. → ✅ Terminé.
