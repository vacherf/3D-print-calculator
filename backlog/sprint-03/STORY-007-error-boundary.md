# STORY-007 — Protection contre les erreurs inattendues (ErrorBoundary)

- **Statut** : 🔜 À faire
- **Sprint** : sprint-03
- **Estimation** : 3 points
- **Priorité** : Haute

## User story

En tant qu'utilisateur, je veux que l'application **affiche un message d'erreur clair et récupérable** si quelque chose se passe mal, afin de **ne pas me retrouver face à un écran blanc inexpliqué**.

## Contexte & valeur

L'application parse des fichiers STL fournis par l'utilisateur et lit le `localStorage` au démarrage. Ces deux opérations peuvent produire des exceptions non anticipées (fichier corrompu d'une façon inattendue, erreur de rendu sur un composant, régression future). Sans garde-fou, une exception JavaScript non capturée dans l'arbre React fait disparaître toute l'interface sans explication. Pour un hobbyiste qui lance l'app en local, un écran blanc est incompréhensible et bloquant. Un `ErrorBoundary` à la racine intercepte ces erreurs et affiche un message lisible avec une option pour relancer.

## Critères d'acceptation

- [ ] Quand une erreur JavaScript non capturée se produit dans l'arbre React, l'application affiche un **message d'erreur en français** (ex. « Une erreur inattendue s'est produite ») à la place de l'écran blanc.
- [ ] Le message comprend un **bouton « Réessayer »** (ou équivalent) qui permet de recharger l'interface sans perdre les données persistées dans le `localStorage`.
- [ ] L'erreur exacte (nom + message) est **affichée ou accessible** dans l'interface (ex. en détail dépliable ou dans la console) pour faciliter le débogage.
- [ ] Le composant `ErrorBoundary` est **placé au niveau de `App` ou de `main.tsx`** de façon à protéger toute l'interface.
- [ ] Lorsque l'application fonctionne normalement (pas d'erreur), le comportement et l'apparence de l'interface sont **strictement identiques** à avant (pas de régression visible).
- [ ] `npx tsc -b --noEmit`, `npm run lint` et `npm run build` passent sans erreur.

## Notes techniques (indicatives)

- Un `ErrorBoundary` en React doit être une **classe** (les hooks ne peuvent pas capturer les erreurs de rendu). Il implémente `componentDidCatch` et `getDerivedStateFromError`.
- Fichier suggéré : `src/components/ErrorBoundary.tsx`. À envelopper autour de `<App />` dans `src/main.tsx`, ou autour du contenu de `App` si l'on veut conserver le header visible même en erreur.
- L'action « Réessayer » peut appeler `window.location.reload()` ou réinitialiser le state interne du boundary (`this.setState({ hasError: false })`). La première option est plus simple et suffisante ici : les données sont persistées dans le `localStorage`, donc le rechargement ne les efface pas.
- Aucune dépendance externe à ajouter : `React.Component` suffit.
- Si l'on souhaite afficher le message d'erreur dans une `Card` cohérente avec le reste de l'UI, réutiliser les primitives `Card` de `src/components/ui/`.

## Hors périmètre

- Rapport d'erreur automatique vers un service externe (Sentry, etc.) : outil personnel, inutile.
- Gestion des erreurs asynchrones (ex. `fetch`) : il n'y en a pas dans l'application actuelle.
- Tests automatisés du composant `ErrorBoundary` lui-même : la story suivante (STORY-008) couvre les tests de `persistence.ts` ; le boundary se valide manuellement.

## Journal

- 2026-05-22 — Créée par le PO (sprint-03, axe qualité & robustesse).
