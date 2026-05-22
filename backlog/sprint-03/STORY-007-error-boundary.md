# STORY-007 — Protection contre les erreurs inattendues (ErrorBoundary)

- **Statut** : ✅ Terminé
- **Sprint** : sprint-03
- **Estimation** : 3 points
- **Priorité** : Haute

## User story

En tant qu'utilisateur, je veux que l'application **affiche un message d'erreur clair et récupérable** si quelque chose se passe mal, afin de **ne pas me retrouver face à un écran blanc inexpliqué**.

## Contexte & valeur

L'application parse des fichiers STL fournis par l'utilisateur et lit le `localStorage` au démarrage. Ces deux opérations peuvent produire des exceptions non anticipées (fichier corrompu d'une façon inattendue, erreur de rendu sur un composant, régression future). Sans garde-fou, une exception JavaScript non capturée dans l'arbre React fait disparaître toute l'interface sans explication. Pour un hobbyiste qui lance l'app en local, un écran blanc est incompréhensible et bloquant. Un `ErrorBoundary` à la racine intercepte ces erreurs et affiche un message lisible avec une option pour relancer.

## Critères d'acceptation

- [x] Quand une erreur JavaScript non capturée se produit dans l'arbre React, l'application affiche un **message d'erreur en français** (ex. « Une erreur inattendue s'est produite ») à la place de l'écran blanc.
- [x] Le message comprend un **bouton « Réessayer »** (ou équivalent) qui permet de recharger l'interface sans perdre les données persistées dans le `localStorage`.
- [x] L'erreur exacte (nom + message) est **affichée ou accessible** dans l'interface (ex. en détail dépliable ou dans la console) pour faciliter le débogage.
- [x] Le composant `ErrorBoundary` est **placé au niveau de `App` ou de `main.tsx`** de façon à protéger toute l'interface.
- [x] Lorsque l'application fonctionne normalement (pas d'erreur), le comportement et l'apparence de l'interface sont **strictement identiques** à avant (pas de régression visible). *(validé visuellement par l'utilisateur le 2026-05-22)*
- [x] `npx tsc -b --noEmit`, `npm run lint` et `npm run build` passent sans erreur.

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
- 2026-05-22 — Démarrage de l'implémentation par le développeur. Exploration de `main.tsx`, `App.tsx`, primitives `Card`/`Button` shadcn, conventions Tailwind v4 + CSS variables thème clair/sombre. Création de `src/components/ErrorBoundary.tsx` (composant de classe React) et intégration dans `src/main.tsx`.
- 2026-05-22 — Implémentation terminée. Voir détail ci-dessous.

### Entrée de journal détaillée — 2026-05-22

**Fait fonctionnel**
Un composant `ErrorBoundary` protège désormais toute l'application. Si une erreur JavaScript non capturée survient dans l'arbre React (erreur de rendu dans un composant, exception dans un hook, fichier STL corrompu produisant une exception au moment du rendu…), l'interface affiche un écran de repli clair en français au lieu d'un écran blanc inexpliqué. L'écran comprend : un titre d'alerte (`« Une erreur inattendue s'est produite »`), un message rassurant indiquant que les données sont sauvegardées, une section « Détails techniques » dépliable affichant le nom et le message de l'erreur, et un bouton « Réessayer » qui déclenche `window.location.reload()`.

**Comment technique**
- `src/components/ErrorBoundary.tsx` : composant de classe React (obligatoire pour capturer les erreurs de rendu — les hooks ne le permettent pas). Implémente `getDerivedStateFromError` (mise à jour du state, déclenchement de l'écran de repli) et `componentDidCatch` (journalisation dans la console avec `componentStack`). Le state contient `hasError`, `errorName`, `errorMessage`.
- L'écran de repli réutilise les primitives shadcn/ui (`Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`, `Button`) et l'icône `AlertTriangle` / `RefreshCw` de lucide-react, comme partout dans le projet. Le fond reprend le gradient `from-muted/40 to-background` de `App.tsx` pour une cohérence visuelle.
- `src/main.tsx` : `<ErrorBoundary>` enveloppe `<App />` à l'intérieur de `<StrictMode>`, ce qui protège toute l'interface.

**Choix et décisions**
- Placement dans `main.tsx` autour de `<App />` plutôt qu'à l'intérieur de `App.tsx` : couvre toute l'interface (y compris les hooks au niveau App), conforme à la note technique de la story.
- Action « Réessayer » = `window.location.reload()` (option simple recommandée par la story) : le localStorage est conservé, les données saisies sont donc retrouvées après rechargement.
- Détails techniques dans un `<details>` natif HTML (dépliable) : pas de dépendance supplémentaire, accessible, discret pour l'utilisateur final mais disponible pour le débogage.
- Pas de `any` utilisé ; `error.name` et `error.message` peuvent être `undefined` dans certains edge cases, gérés par des fallbacks (`?? "Erreur"`, `?? "Aucun détail disponible."`).

**Vérifications avec résultats**
- `npx tsc -b --noEmit` : PASS — aucune erreur TypeScript.
- `npm run lint` : PASS — aucun avertissement ESLint.
- `npm run build` : PASS — build de production généré en 1.82 s, aucune erreur.

**Critères couverts (statiquement vérifiés)**
- Message d'erreur en français : oui (`« Une erreur inattendue s'est produite »`, message explicatif).
- Bouton « Réessayer » avec `window.location.reload()` : oui.
- Détails techniques dépliables + journalisation console : oui.
- Placement au niveau `main.tsx` couvrant toute l'interface : oui.
- Build/typecheck/lint sans erreur : oui.

**Critères non encore couverts (à valider visuellement)**
- Absence de régression en fonctionnement normal : à vérifier dans le navigateur. Le composant est transparent quand `hasError === false` (rend simplement `this.props.children`), donc il ne devrait y avoir aucune régression — mais cela requiert une confirmation visuelle.
- Déclenchement réel de l'écran de repli : à tester manuellement (voir ci-dessous).

**Limites et reste à valider manuellement**
L'`ErrorBoundary` ne capture PAS les erreurs asynchrones (Promise rejetée, setTimeout) ni les erreurs dans les gestionnaires d'événements — c'est le comportement standard de React et c'est explicitement hors périmètre (la story le précise).

**Comment provoquer une erreur de test**
Ajouter temporairement dans `src/App.tsx` un composant qui lance une exception au rendu :
```tsx
function ComposantBuggé() {
  throw new Error("Erreur de test ErrorBoundary")
}
// puis dans le JSX de App : <ComposantBuggé />
```
Lancer `npm run dev`, ouvrir le navigateur : l'écran de repli doit s'afficher avec le titre rouge, le message rassurant, les détails dépliables (`TypeError : Erreur de test ErrorBoundary`), et le bouton « Réessayer ». Retirer ensuite le composant de test avant de fusionner.

**Transition de statut** : `🚧 En cours` → `👀 En revue`

- 2026-05-22 — Validation manuelle par l'utilisateur dans le navigateur (http://localhost:5173/3D-print-calculator/). Un composant de test lançant une exception au rendu a été ajouté temporairement dans `App.tsx` : l'écran de repli de l'`ErrorBoundary` s'est bien affiché à la place de l'écran blanc (message en français, détails, bouton « Réessayer »). Fonctionnement normal de l'app confirmé sans régression. Composant de test retiré ensuite (`tsc` repassé OK, aucune trace résiduelle). Tous les critères cochés. → ✅ Terminé.
