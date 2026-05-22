# STORY-009a — Infrastructure i18n + langues français et anglais

- **Statut** : 🔜 À faire
- **Sprint** : sprint-03
- **Estimation** : 5 points
- **Priorité** : Moyenne
- **Découpage** : issue du découpage de STORY-009 (8 pts) ; la suite (ES/DE) est STORY-009b, reportée au sprint-04.

## User story

En tant qu'utilisateur, je veux pouvoir **basculer l'interface entre le français et l'anglais** et que **mon choix soit mémorisé**, afin d'utiliser l'application dans ma langue de préférence.

## Contexte & valeur

L'application est accessible via GitHub Pages (STORY-006) et peut donc être découverte par des utilisateurs non francophones. Mettre en place l'infrastructure i18n et couvrir le binôme FR/EN représente l'essentiel de l'effort (extraction des libellés, mécanisme de bascule, persistance). Les langues supplémentaires (ES/DE — STORY-009b) s'ajouteront ensuite à coût marginal. Le français reste la langue par défaut et la cible principale ; l'EUR reste la devise unique.

## Critères d'acceptation

- [ ] Un sélecteur de langue est visible dans l'en-tête de l'application (à proximité du bouton de thème si STORY-008 est livrée au même sprint).
- [ ] Les langues disponibles dans le sélecteur sont : **français (FR)** et **anglais (EN)**. Le français est la valeur par défaut.
- [ ] **Tous les libellés visibles** de l'interface sont traduits dans les deux langues : titres de sections, étiquettes de champs, textes d'aide (hints), placeholders, messages d'erreur, boutons, textes du récapitulatif latéral et du pied de page.
- [ ] Changer la langue dans le sélecteur **met à jour instantanément** tous les libellés de l'interface, sans rechargement de page.
- [ ] Le choix de langue est **persisté dans le `localStorage`** et restauré au chargement suivant.
- [ ] En l'absence de choix enregistré, la langue par défaut est le **français**, quelle que soit la langue du navigateur (pas de détection automatique de `navigator.language`).
- [ ] Le **formatage des nombres suit la locale active** via l'API `Intl` (ex. `Intl.NumberFormat`) : séparateurs décimaux et de milliers adaptés à la langue choisie (ex. `1 234,56` en FR, `1,234.56` en EN).
- [ ] La **devise reste l'EUR quelle que soit la langue** : pas de conversion monétaire, pas de taux de change. Seul le format d'affichage change (ex. `1 234,56 €` en FR, `€1,234.56` en EN — même montant, même devise, présentation localisée).
- [ ] Les **noms de filaments et d'imprimantes** (issus de `filaments.ts` et `printers.ts`) ne sont pas traduits — ce sont des noms propres/techniques invariants.
- [ ] Les **libellés des tarifs EDF** (dans `src/lib/electricity.ts`) ne sont pas traduits ; seule l'interface autour l'est.
- [ ] Le composant `PrintSummary` (rendu à l'impression) utilise également les traductions : le document imprimé reflète la langue active.
- [ ] L'application passe `npx tsc -b --noEmit`, `npm run lint` et `npm run build` sans erreur.

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
