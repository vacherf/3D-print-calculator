# STORY-004 — Persistance de la saisie

- **Statut** : ✅ Terminé
- **Sprint** : sprint-02
- **Estimation** : 3 points
- **Priorité** : Haute

## User story

En tant qu'utilisateur, je veux que **mes valeurs soient conservées quand je reviens sur l'application** afin de **ne pas tout ressaisir à chaque visite**.

## Contexte & valeur

Un hobbyiste réutilise souvent les mêmes réglages (son imprimante, son filament habituel, son tarif d'électricité). Repartir de zéro à chaque rechargement est frustrant. Conserver l'état localement supprime cette friction.

## Critères d'acceptation

- [x] Les champs saisis (filament, prix, quantité, durée, imprimante, puissance, tarif élec., gâche, marge) sont **conservés après rechargement** de la page.
- [x] La persistance est **locale au navigateur** (`localStorage`), sans compte ni serveur.
- [x] Le bouton **« Réinitialiser » efface aussi les valeurs persistées** et revient aux valeurs par défaut.
- [x] Une montée de version du format de stockage **ne casse pas l'app** (valeurs invalides ou anciennes ignorées proprement → retour aux défauts).
- [x] L'import d'un STL et la sélection d'imprimante continuent de fonctionner avec l'état restauré.

## Notes techniques (indicatives)

- État centralisé dans `src/hooks/useCalculator.ts` — point d'accroche naturel pour lire/écrire `localStorage`.
- Prévoir une clé versionnée (ex. `print3d-calc:v1`) et une validation à la lecture.

## Hors périmètre

- Synchronisation multi-appareils, comptes utilisateurs, historique de plusieurs estimations.

## Journal

- 2026-05-22 — Créée par le PO (revue de backlog, cible hobbyiste).
- 2026-05-22 — Démarrage de l'implémentation par le développeur (statut → En cours).
- 2026-05-22 — Implémentation terminée (statut → En revue). Détail ci-dessous.

### Entrée de revue — 2026-05-22

#### Fait fonctionnel

Tous les champs du calculateur (filament, prix/kg, quantité en grammes, durée, imprimante, puissance, tarif électricité, gâche, marge) sont désormais sauvegardés automatiquement dans le `localStorage` à chaque modification. Au rechargement de la page, les valeurs sont restaurées. Le bouton « Réinitialiser » supprime l'entrée dans le `localStorage` puis remet l'état React aux valeurs par défaut. Si les données stockées sont absentes, corrompues ou correspondant à un ancien schéma (IDs de filament/imprimante inconnus, valeurs non numériques, nombres infinis…), l'application retombe silencieusement sur ses valeurs par défaut sans afficher d'erreur.

#### Comment technique

Deux fichiers modifiés / créés :

1. **`src/lib/persistence.ts`** (nouveau) — module pur (sans React) contenant :
   - La constante `STORAGE_KEY = "print3d-calc:v1"` (versionnée).
   - L'interface `PersistedState` (miroir de `CalculatorState` pour v1).
   - La fonction de validation `isValidPersistedState` qui vérifie le type de chaque champ, les bornes numériques (positif strict ou >= 0 pour les pourcentages) et l'appartenance des IDs aux Sets `FILAMENT_IDS` / `PRINTER_IDS` construits à partir des référentiels existants.
   - `loadState()` : lit, parse et valide ; retourne `PersistedState | null`.
   - `saveState(state)` : sérialise en JSON et écrit dans le `localStorage`.
   - `clearState()` : supprime l'entrée. Toutes les opérations `localStorage` sont enveloppées dans un `try/catch` silencieux (quota dépassé, mode privé strict, etc.).

2. **`src/hooks/useCalculator.ts`** (modifié) :
   - `defaultState` renommé depuis `initialState` (sémantique plus claire, utilisé aussi dans `reset`).
   - `buildInitialState()` : fonction appelée en lazy init de `useState` — appelle `loadState()` et retourne l'état persisté ou `defaultState`.
   - `useEffect([state])` : appelle `saveState(state)` à chaque changement d'état.
   - `reset()` : appelle `clearState()` avant de remettre `defaultState`.

#### Choix

- **Lazy init** (`useState(buildInitialState)`) plutôt que `useState(buildInitialState())` : la fonction n'est appelée qu'une fois au montage, évitant une lecture `localStorage` à chaque render.
- **`useEffect` sur `[state]`** : synchronisation simple, lisible, sans debounce. Pour un hobbyiste en local, écrire quelques octets de JSON à chaque frappe est négligeable.
- **Module `persistence.ts` séparé** (pas inline dans le hook) : respecte la convention du projet (logique pure dans `src/lib/`), facilite un futur test unitaire de la validation.
- **Pas de migration automatique** entre versions : si la clé change (v1 → v2), les anciennes données sont simplement ignorées. C'est suffisant pour un outil personnel ; une migration serait sur-engineering.
- **Aucune dépendance ajoutée** : API `localStorage` native.

#### Vérifications avec résultats

| Commande | Résultat |
|---|---|
| `npx tsc -b --noEmit` | Aucune erreur |
| `npm run lint` | Aucun avertissement |
| `npm run build` | Build réussi (337 kB JS gzip 104 kB, aucun warning Vite) |

#### Critères couverts

- [x] Champs conservés après rechargement — `saveState` dans `useEffect`, `loadState` au montage.
- [x] Persistance locale uniquement (`localStorage`) — pas de réseau.
- [x] « Réinitialiser » efface le localStorage (`clearState()`) et revient aux défauts.
- [x] Données invalides / ancien format ignorées proprement (`isValidPersistedState`, retour `null`).
- [x] Import STL et sélection imprimante continuent de fonctionner — aucun changement sur `StlImporter`, `PrinterSelector`, `selectFilament`, `selectPrinter` ; ces fonctions mettent à jour `state` normalement, ce qui déclenche la sauvegarde via `useEffect`.

#### Critères non couverts

Aucun : les 5 critères sont satisfaits.

#### Limites et reste à faire

- Pas de test unitaire automatisé pour `persistence.ts` (hors périmètre de cette story — nécessiterait un mock de `localStorage` dans l'environnement de test).
- Le debounce de la sauvegarde n'est pas nécessaire en v1 mais pourrait l'être si de nombreux champs numériques sont modifiés rapidement sur un appareil très lent.
- La validation est stricte (tous les champs doivent être présents et valides) : un champ manquant fait retomber sur les défauts. C'est le comportement intentionnel pour la v1.

#### Transition de statut

En cours → En revue. Tous les critères d'acceptation sont couverts ; aucune régression détectée aux vérifications statiques et au build.

- 2026-05-22 — Validation manuelle par l'utilisateur dans le navigateur (http://localhost:5173). Scénario joué : (1) modification de plusieurs champs — filament, prix/kg, quantité, durée, imprimante, tarif élec., gâche, marge — puis F5 → valeurs conservées ; (2) présence de la clé `print3d-calc:v1` (JSON) dans Local Storage ; (3) « Réinitialiser » → retour aux défauts **et** disparition de la clé, confirmé après rechargement ; (4) clé corrompue manuellement → app ne plante pas, retour aux défauts. Tous les points ✅. → ✅ Terminé.
