# STORY-009b — Traductions espagnol et allemand (i18n)

- **Statut** : 📋 Backlog
- **Sprint** : sprint-04 (planifié)
- **Estimation** : 5 points
- **Priorité** : Moyenne
- **Dépendance** : STORY-009a (infrastructure i18n + FR/EN) doit être terminée.
- **Découpage** : complément de STORY-009a ; ensemble elles constituent l'i18n complète à 4 langues (8 pts d'origine).

## User story

En tant qu'utilisateur hispanophone ou germanophone, je veux pouvoir **choisir l'espagnol ou l'allemand** dans le sélecteur de langue, afin de naviguer dans l'application dans ma langue maternelle.

## Contexte & valeur

L'infrastructure i18n et les traductions FR/EN sont posées par STORY-009a. Ajouter ES et DE est un effort de développement modéré : deux nouveaux fichiers de traduction, l'extension de quelques constantes et mappings, et la relecture humaine des termes techniques. Cette story complète l'ambition initiale d'un accès à 4 langues. L'estimation est portée à 5 points (au lieu de 3) pour tenir compte de la validation humaine du glossaire technique (point 6 ci-dessous), qui sort du pur développement et nécessite une relecture active.

## Critères d'acceptation

- [ ] Le sélecteur de langue (mis en place par STORY-009a) propose désormais quatre options : **français (FR)**, **anglais (EN)**, **espagnol (ES)**, **allemand (DE)**.
- [ ] Le sélecteur affiche le **drapeau de l'Espagne** (ES) pour l'espagnol et le **drapeau de l'Allemagne** (DE) pour l'allemand, de la même façon que FR et GB sont affichés pour le français et l'anglais.
- [ ] Tous les libellés de l'interface traduits en FR/EN (STORY-009a) sont également disponibles en **espagnol** et en **allemand** : titres, étiquettes, hints, placeholders, messages d'erreur, boutons, récapitulatif, pied de page.
- [ ] Changer la langue vers ES ou DE **met à jour instantanément** tous les libellés, sans rechargement de page.
- [ ] La persistance de la langue ES ou DE est **vérifiable** : après avoir sélectionné ES puis DE (dans cet ordre ou l'inverse) et rechargé l'application dans un onglet vierge (sans historique de navigation), la dernière langue choisie est bien restaurée depuis le `localStorage`.
- [ ] Le **formatage des nombres suit la locale active** pour ES (`es-ES`) et DE (`de-DE`) : séparateurs décimaux et de milliers adaptés (ex. `1.234,56 €` en DE).
- [ ] La **devise reste EUR** pour ES et DE, sans conversion monétaire.
- [ ] La fonction `formatDate` dans les fichiers de traduction ES et DE (utilisée par `PrintSummary`) emploie respectivement `es-ES` et `de-DE` comme locale `Intl`, pas seulement le formatage des nombres — les noms de mois et l'ordre jour/mois/année sont localisés.
- [ ] L'attribut `lang` de la balise `<html>` reflète la locale active (`fr`, `en`, `es` ou `de`) à chaque changement de langue, afin d'informer correctement les lecteurs d'écran et les outils d'accessibilité.
- [ ] Les traductions ES et DE des **termes techniques clés** (voir le glossaire en notes techniques) ont été relues et validées — elles ne sont pas livrées en traduction automatique brute non relue. Toute traduction incertaine est signalée dans le code par un commentaire `// TODO: à confirmer par un locuteur natif`.
- [ ] Aucune étiquette de l'interface ne déborde ou n'est tronquée en allemand sur **viewport mobile (~375 px de large)** ni sur viewport desktop standard — contrôle visuel dans le navigateur avec la locale `de` active.
- [ ] Le composant `PrintSummary` reflète la langue active en ES et en DE.
- [ ] L'application passe `npx tsc -b --noEmit`, `npm run lint` et `npm run build` sans erreur dans les quatre langues.

## Notes techniques (indicatives)

### Fichiers à créer

- `src/locales/es.ts` — dictionnaire espagnol, implémente le type `Translations`.
- `src/locales/de.ts` — dictionnaire allemand, implémente le type `Translations`.

### Fichiers à modifier

- **`src/locales/index.ts`**
  - Étendre le type `Locale` : `"fr" | "en" | "es" | "de"`.
  - Ajouter `es` et `de` dans `SUPPORTED_LOCALES` avec `country: "ES"` et `country: "DE"`.
  - Ajouter `es` et `de` dans le dictionnaire `DICTIONARIES`.
  - Corriger `loadLocale` : la liste de validation (`if (stored === "fr" || stored === "en")`) doit inclure `"es"` et `"de"`, sinon la persistance de ces langues est silencieusement ignorée au rechargement.

- **`src/components/LanguageSelector.tsx`**
  - Importer les composants SVG `ES` et `DE` depuis `country-flag-icons/react/3x2/ES` et `.../DE`.
  - Les enregistrer dans la map `FLAGS` : `{ FR, GB, ES, DE }`. Cohérent avec le pattern établi par STORY-010.

- **`src/lib/format.ts`**
  - Étendre `LOCALE_MAP` avec `es: "es-ES"` et `de: "de-DE"`.
  - Les formateurs `Intl.NumberFormat` et `Intl.DateTimeFormat` utiliseront ces locales automatiquement.

### Attribut `lang` sur `<html>`

L'attribut `lang` de `<html>` n'est pas mis à jour aujourd'hui lors du changement de langue. Il devra être synchronisé via `document.documentElement.lang = locale` dans le hook ou le composant racine qui gère la locale active. Ceci est nécessaire pour l'accessibilité (lecteurs d'écran, outils de traduction navigateur).

### Mots composés allemands et mise en page

L'allemand forme des composés longs (`Druckdauer`, `Materialkosten`, `Stromverbrauch`, `Füllrate`, `Druckerleistung`…). Vérifier sur viewport mobile (~375 px) que rien ne déborde, en particulier dans les cartes `CalculatorForm`, `CostSummary` et le sélecteur d'imprimante. Utiliser `overflow-wrap: break-word` ou des abréviations balisées (`<abbr>`) si nécessaire — la décision appartient au développeur.

### Glossaire de référence FR → ES → DE

Les termes ci-dessous sont les plus sensibles à une mauvaise traduction automatique. Les traductions proposées sont indicatives ; celles marquées d'un astérisque (*) sont à confirmer par un locuteur natif ou une relecture soignée.

| Terme FR | Espagnol (ES) | Allemand (DE) |
|---|---|---|
| Coût de revient | Coste de producción | Herstellungskosten |
| Taux de gâche | Tasa de desperdicio * | Ausschussrate * |
| Taux de remplissage | Porcentaje de relleno | Füllrate |
| Débit volumétrique | Caudal volumétrico * | Volumendurchfluss * |
| Coque (périmètre) | Perímetro / carcasa * | Schale / Perimeter * |
| Durée d'impression | Duración de impresión | Druckdauer |
| Puissance imprimante | Potencia de la impresora | Druckerleistung |
| Prix de vente conseillé | Precio de venta recomendado | Empfohlener Verkaufspreis * |
| Filament | Filamento | Filament |
| Bobine | Bobina | Spule |

> Les termes marqués `*` sont issus d'une traduction automatique et doivent être confirmés. Cette table sert de référence au développeur et au relecteur ; elle ne constitue pas une obligation de libellé exact dans l'UI si une formulation plus naturelle est identifiée.

## Hors périmètre

- Ajout de nouvelles langues au-delà de FR, EN, ES, DE.
- Conversion de devise ou adaptation des tarifs selon la locale.
- Support RTL.
- **Adaptation du contenu du pied de page selon la locale** : la mention « Tarif Bleu EDF / France » restera identique dans toutes les langues. L'application cible le marché français ; adapter ce contenu à la locale ES ou DE est un sujet distinct, hors périmètre de cette story.

## Journal

- 2026-05-22 — Créée par le PO lors du découpage de STORY-009 (arbitrage Option B). Reportée au sprint-04 ; dépend de STORY-009a. Le sprint-04 ne sera détaillé qu'au moment de sa planification.
- 2026-05-22 — Enrichissement suite à revue PO : ajouts 1 à 7 intégrés (drapeaux ES/DE dans `FLAGS`, correction de `loadLocale` pour la persistance, attribut `lang` sur `<html>`, `formatDate` localisée es-ES/de-DE, extension de `LOCALE_MAP` dans `format.ts` et mention de `loadLocale`/`FLAGS` dans les notes, glossaire technique FR → ES → DE avec termes à confirmer, critère de vérification visuelle DE sur mobile). Point 8 (pied de page contextualisé) explicitement hors périmètre. Estimation portée de 3 à 5 points pour tenir compte de la relecture humaine du glossaire.
