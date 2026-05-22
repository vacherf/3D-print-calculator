# STORY-009a — Infrastructure i18n + langues français et anglais

- **Statut** : ✅ Terminé
- **Sprint** : sprint-03
- **Estimation** : 5 points
- **Priorité** : Moyenne
- **Découpage** : issue du découpage de STORY-009 (8 pts) ; la suite (ES/DE) est STORY-009b, reportée au sprint-04.

## User story

En tant qu'utilisateur, je veux pouvoir **basculer l'interface entre le français et l'anglais** et que **mon choix soit mémorisé**, afin d'utiliser l'application dans ma langue de préférence.

## Contexte & valeur

L'application est accessible via GitHub Pages (STORY-006) et peut donc être découverte par des utilisateurs non francophones. Mettre en place l'infrastructure i18n et couvrir le binôme FR/EN représente l'essentiel de l'effort (extraction des libellés, mécanisme de bascule, persistance). Les langues supplémentaires (ES/DE — STORY-009b) s'ajouteront ensuite à coût marginal. Le français reste la langue par défaut et la cible principale ; l'EUR reste la devise unique.

## Critères d'acceptation

- [x] Un sélecteur de langue est visible dans l'en-tête de l'application (à proximité du bouton de thème si STORY-008 est livrée au même sprint).
- [x] Les langues disponibles dans le sélecteur sont : **français (FR)** et **anglais (EN)**. Le français est la valeur par défaut.
- [x] **Tous les libellés visibles** de l'interface sont traduits dans les deux langues : titres de sections, étiquettes de champs, textes d'aide (hints), placeholders, messages d'erreur, boutons, textes du récapitulatif latéral et du pied de page.
- [x] Changer la langue dans le sélecteur **met à jour instantanément** tous les libellés de l'interface, sans rechargement de page. *(validé visuellement le 2026-05-22)*
- [x] Le choix de langue est **persisté dans le `localStorage`** et restauré au chargement suivant.
- [x] En l'absence de choix enregistré, la langue par défaut est le **français**, quelle que soit la langue du navigateur (pas de détection automatique de `navigator.language`).
- [x] Le **formatage des nombres suit la locale active** via l'API `Intl` (ex. `Intl.NumberFormat`) : séparateurs décimaux et de milliers adaptés à la langue choisie (ex. `1 234,56` en FR, `1,234.56` en EN).
- [x] La **devise reste l'EUR quelle que soit la langue** : pas de conversion monétaire, pas de taux de change. Seul le format d'affichage change (ex. `1 234,56 €` en FR, `€1,234.56` en EN — même montant, même devise, présentation localisée).
- [x] Les **noms de filaments et d'imprimantes** (issus de `filaments.ts` et `printers.ts`) ne sont pas traduits — ce sont des noms propres/techniques invariants.
- [x] Les **libellés des tarifs EDF** (dans `src/lib/electricity.ts`) ne sont pas traduits ; seule l'interface autour l'est.
- [x] Le composant `PrintSummary` (rendu à l'impression) utilise également les traductions : le document imprimé reflète la langue active.
- [x] L'application passe `npx tsc -b --noEmit`, `npm run lint` et `npm run build` sans erreur.

## Notes techniques (indicatives)

**Formatage et devise — point de vigilance clé.**
`src/lib/format.ts` est aujourd'hui figé sur `Intl.NumberFormat("fr-FR", { currency: "EUR" })`. Il devra accepter une locale en paramètre (ex. `formatCurrency(value, locale)`) pour produire `1 234,56 €` en `fr-FR` et `€1,234.56` en `en-US`. La devise reste `EUR` dans les deux appels — seule la locale change. La conversion de devises (USD, GBP…) est explicitement **hors périmètre** et renvoie à l'item « Devises et tarifs internationaux » du backlog (non mûr).

**Architecture i18n recommandée.**
Un dictionnaire léger maison (objet TypeScript indexé par clé de traduction et par code langue) est préféré à une librairie lourde. Un fichier `src/lib/i18n.ts` ou un dossier `src/locales/` avec `fr.ts` et `en.ts` suffit pour deux langues. Le développeur peut opter pour une lib légère (ex. `typesafe-i18n`) si la maintenabilité des clés en TypeScript pur lui semble insuffisante.

**Hook.**
Un `useTranslation()` dans `src/hooks/` retournant la fonction `t(clé)` et le code de langue courant (`'fr' | 'en'`), cohérent avec l'architecture de `useCalculator`.

**Périmètre de l'extraction.**
Tous les textes en dur dans les composants `.tsx` : `App.tsx`, `CalculatorForm.tsx`, `CostSummary.tsx`, `StlImporter.tsx`, `PrintSummary.tsx`, `FilamentSelector.tsx`, `PrinterSelector.tsx`, `NumberField.tsx`.

**Persistance.**
Clé dédiée dans `localStorage` (ex. `print3d-ui:lang`), indépendante des données calculateur (même principe que STORY-008 pour le thème).

**Extension future.**
Concevoir le dictionnaire pour accueillir ES/DE (STORY-009b) sans refactoring : les clés doivent être les mêmes, seul un objet de traduction supplémentaire est ajouté par langue.

## Hors périmètre

- Langues espagnol (ES) et allemand (DE) — reportées en STORY-009b (sprint-04).
- Conversion de devise ou adaptation des tarifs selon la locale (périmètre de l'item « Devises et tarifs internationaux » du backlog, non mûr).
- Détection automatique de la langue du navigateur (`navigator.language`).
- Support des langues à écriture droite-à-gauche (RTL).
- Traduction des noms de filaments, d'imprimantes et des libellés des tarifs EDF (noms propres / données de référence).

## Journal

- 2026-05-22 — Créée par le PO à partir du découpage de STORY-009 (8 pts) ; arbitrage Option B validé par l'utilisateur. STORY-009a couvre l'infrastructure et les langues FR/EN (5 pts) ; STORY-009b couvre ES/DE (3 pts, sprint-04). Arbitrage formatage/devise acté : format suit la locale via `Intl`, devise EUR invariante.
- 2026-05-22 — Démarrage de l'implémentation par le développeur. Exploration de l'ensemble des composants portant des libellés FR : App.tsx, CalculatorForm.tsx, CostSummary.tsx, PrintSummary.tsx, StlImporter.tsx, PrinterSelector.tsx, FilamentSelector.tsx, NumberField.tsx, ErrorBoundary.tsx. Analyse de format.ts (figé en fr-FR) et de useTheme.ts (modèle de persistance à reproduire). Plan : 1) dictionnaire TypeScript src/locales/, 2) hook useI18n + contexte React, 3) adaptation format.ts avec locale en paramètre, 4) sélecteur de langue dans l'en-tête, 5) extraction de tous les libellés.
- 2026-05-22 — Implémentation complète par le développeur. Ci-dessous le détail.

  **Fait fonctionnel :**
  - Sélecteur de langue (FR / EN) dans l'en-tête, à gauche du bouton de thème.
  - Bascule instantanée de la totalité des libellés sans rechargement de page.
  - Persistance du choix en localStorage sous la clé `print3d-ui:lang`, indépendante des données calculateur.
  - Langue par défaut : français, sans détection de `navigator.language` (hors périmètre).
  - Formatage des nombres et des montants selon la locale active via `Intl.NumberFormat` : `1 234,56 €` en FR, `€1,234.56` en EN — devise EUR invariante dans les deux cas.
  - Document imprimé (`PrintSummary`) reflète la langue active : titres, libellés de paramètres, montants, date formatée.
  - Libellés traduits dans les deux langues : `ErrorBoundary`, `CostSummary`, `CalculatorForm`, `StlImporter`, `FilamentSelector`, `PrinterSelector`, `PrintSummary`, `App` (titre, sous-titre, pied de page, bouton reset, aria-labels du bouton thème).
  - Noms de filaments, noms/marques d'imprimantes et libellés des tarifs EDF non traduits (noms de référence techniques invariants — conforme au périmètre).
  - L'infrastructure est prête pour ES/DE (STORY-009b) : ajouter une langue = créer un fichier `de.ts` / `es.ts` implémentant `Translations` + l'ajouter à `SUPPORTED_LOCALES` et `DICTIONARIES`.

  **Comment technique :**
  - `src/locales/fr.ts` : interface `Translations` + implémentation FR. L'interface utilise `string` (pas de types littéraux) pour permettre à `en.ts` d'avoir ses propres valeurs.
  - `src/locales/en.ts` : implémentation EN typée `Translations` — TypeScript vérifie l'exhaustivité des clés à la compilation.
  - `src/locales/index.ts` : `Locale = "fr" | "en"`, constantes `SUPPORTED_LOCALES`, `DICTIONARIES`, helpers `loadLocale` / `saveLocale`.
  - `src/hooks/useI18n.ts` : hook `useI18n()` retournant `{ locale, t, setLocale }` — même pattern que `useTheme`.
  - `src/contexts/I18nContextObject.ts` : objet `createContext` isolé (exigence ESLint `react-refresh/only-export-components`).
  - `src/contexts/I18nContext.tsx` : composant `I18nProvider` (seul export de composant dans ce fichier).
  - `src/contexts/i18n.ts` : hook `useI18nContext()` (seul export de hook dans ce fichier).
  - `src/lib/format.ts` : `formatEuros(value, locale?)` et `formatKwh(value, locale?)` acceptent un paramètre locale optionnel (défaut `"fr"`). Formateurs mis en cache par locale BCP-47 pour éviter de recréer des `Intl.NumberFormat` à chaque rendu.
  - `src/components/LanguageSelector.tsx` : composant `<Select>` compact (largeur fixe `4.5rem`) affichant les noms natifs des langues.
  - `main.tsx` : `I18nProvider` placé au-dessus de `ErrorBoundary` pour que le contexte soit disponible lors de l'affichage du fallback d'erreur.
  - `ErrorBoundary.tsx` : le fallback UI extrait dans un composant fonctionnel `ErrorFallback` pour pouvoir utiliser `useI18nContext` (les hooks sont interdits dans les composants de classe).

  **Choix :**
  - Dictionnaire TypeScript maison (pas de lib externe) : suffisant pour 2 langues, typage complet des clés, zéro dépendance ajoutée.
  - Interface `Translations` définie avec des types `string` (pas `as const`) pour permettre des traductions libres tout en garantissant l'exhaustivité des clés.
  - Séparation en trois fichiers de contexte pour satisfaire la règle ESLint `react-refresh/only-export-components`.
  - `NumberField.tsx` : aucun libellé FR codé en dur — les `label`, `hint`, `unit` viennent tous du parent via props. Pas de modification nécessaire.

  **Vérifications avec résultats :**
  - `npx tsc -b --noEmit` : PASS (0 erreur)
  - `npm run lint` : PASS (0 erreur, 0 avertissement)
  - `npm run build` : PASS (354 kB JS / 108 kB gzip)

  **Critères d'acceptation couverts (techniques) :**
  - [x] Infrastructure i18n en place (dictionnaire, hook, contexte, persistance)
  - [x] Langues FR (défaut) et EN disponibles dans le sélecteur
  - [x] Tous les libellés visibles extraits et traduits dans les deux langues
  - [x] Persistance dans localStorage (clé `print3d-ui:lang`)
  - [x] Pas de détection automatique de `navigator.language`
  - [x] Formatage localisé via `Intl` (nombres + €), devise EUR invariante
  - [x] Noms de filaments / imprimantes / tarifs EDF non traduits (périmètre respecté)
  - [x] `PrintSummary` utilise les traductions
  - [x] `npx tsc -b --noEmit`, `npm run lint`, `npm run build` passent

  **Critères à valider visuellement par l'utilisateur :**
  - Bascule FR → EN → FR : tous les libellés changent instantanément dans : titre/sous-titre de l'en-tête, pied de page, section Filament (titre, desc, labels, hints), section Impression & électricité, section Paramètres avancés, récapitulatif latéral (CostSummary), aria-labels du bouton thème, bouton Réinitialiser/Reset.
  - Formatage des montants : `1 234,56 €` en FR → `€1,234.56` en EN (même valeur numérique).
  - Formatage des kWh : séparateur décimal adapté à la locale.
  - Persistance : choisir EN → recharger la page → l'interface reste en EN.
  - `PrintSummary` : déclencher une impression après bascule EN → document en anglais.
  - Sélecteur de langue : placement cohérent avec le bouton thème dans l'en-tête, pas de surcharge visuelle.
  - STL Importer : métriques de géométrie (dimensions, volume, surface, triangles) formatées selon la locale.

  **Limites et points à surveiller :**
  - `FilamentSelector` : la propriété `description` des filaments (ex. "Le plus courant, facile à imprimer") est affichée mais non traduite — c'est une donnée de référence technique, conforme au critère "noms de filaments non traduits". Si le PO souhaite traduire ces descriptions à l'avenir, cela demandera un refactoring de `filaments.ts`.
  - `ErrorBoundary` de classe : si une erreur se produit dans `I18nProvider` lui-même, le fallback ne pourra pas accéder au contexte i18n. Dans ce cas extrêmement rare, les textes de fallback seraient absents (erreur React). Ce risque est théoriquement nul car `useI18n` ne fait qu'appeler `useState` et `useEffect`.
  - Langues ES/DE (STORY-009b) : l'infrastructure est prête — aucun refactoring requis, uniquement ajouter des fichiers `es.ts` / `de.ts`.

  Transition : story passée en 👀 En revue.

- 2026-05-22 — Validation manuelle par l'utilisateur dans le navigateur. Bascule FR ⇄ EN instantanée sur toute l'interface (en-tête, formulaire, récapitulatif, pied de page, impression), formatage des montants/kWh adapté à la locale (devise EUR conservée), et persistance du choix après rechargement confirmées. Tous les critères cochés. → ✅ Terminé.
