# STORY-010 — Sélecteur de langue compact : drapeau et acronyme

- **Statut** : ✅ Terminé
- **Sprint** : sprint-04
- **Estimation** : 2 points
- **Priorité** : Moyenne

## User story

En tant qu'utilisateur, je veux que le sélecteur de langue affiche le drapeau de la langue sélectionnée et un acronyme court (FR, EN…) plutôt que le nom complet de la langue, afin d'identifier la langue active d'un coup d'œil et de gagner de la place dans l'en-tête.

## Contexte & valeur

Le sélecteur de langue livré en STORY-009a affichait les noms natifs complets (« Français », « English ») dans le bouton. Sur des écrans étroits ou avec plusieurs contrôles dans l'en-tête (bouton de thème, bouton de langue), un libellé long surcharge la barre de navigation.

L'approche initiale de la story prévoyait une icône générique (`Languages` de lucide-react) + un acronyme. Suite à une décision de l'utilisateur (2026-05-22), l'icône a été remplacée par le **drapeau SVG** de la langue, ce qui apporte une identification encore plus immédiate.

Remplacer le libellé par un drapeau + un acronyme de deux lettres (FR, EN, ES, DE) apporte trois bénéfices :
- **Identification visuelle immédiate** : le drapeau signale la langue active sans lire de texte.
- **Gain de place** : le bouton est deux fois plus compact, l'en-tête reste aéré.
- **Scalabilité** : l'acronyme est dérivé mécaniquement du code de langue (`code.toUpperCase()`) et le drapeau d'un champ `country` dans `SUPPORTED_LOCALES`, donc l'ensemble s'étend aux langues ES/DE de STORY-009b sans restructuration.

Dans le menu déroulant, afficher « drapeau + FR Français » (drapeau + acronyme en gras + nom natif) maintient la lisibilité pour l'utilisateur qui ne reconnaît pas un acronyme isolé.

### Note de vigilance produit

Associer un drapeau national à une langue est un raccourci ergonomique, non une vérité linguistique. Une langue n'appartient pas à un seul pays : l'anglais est parlé aux États-Unis, en Australie, au Canada, en Inde, etc. Le choix d'un drapeau est donc une **convention d'affichage assumée**, pas une déclaration d'appartenance géographique.

Pour ce projet (marché français, usage personnel), les choix retenus sont :
- **FR** → drapeau de la France
- **EN** → drapeau du **Royaume-Uni** (Union Jack) — décision explicite de l'utilisateur ; ce choix est cohérent avec la variante d'anglais la plus neutre en Europe

Ces choix pourront être révisés si d'autres marchés cibles sont envisagés.

## Critères d'acceptation

- [x] Le bouton du sélecteur de langue affiche le drapeau SVG de la langue active à gauche de l'acronyme (ex. : drapeau français + « FR » pour le français, drapeau britannique + « EN » pour l'anglais).
- [x] L'acronyme affiché dans le bouton est en majuscules et correspond au code de langue ISO 639-1 sur 2 lettres.
- [x] Le menu déroulant affiche pour chaque option : le drapeau SVG + l'acronyme en caractères gras + le nom natif complet de la langue en texte discret (ex. : drapeau + « FR Français », drapeau + « EN English »).
- [x] Pour la langue anglaise, le drapeau affiché est celui du **Royaume-Uni** (Union Jack), et non celui des États-Unis.
- [x] Les drapeaux sont rendus en **SVG** (via la librairie `country-flag-icons`), et non en emoji unicode, afin d'assurer un affichage correct sous Windows (où les emojis-drapeaux ne sont pas supportés nativement).
- [x] La bascule de langue fonctionne toujours correctement : choisir une langue dans le menu change instantanément tous les libellés de l'interface, sans rechargement de page.
- [x] Aucune régression sur les comportements de STORY-009a : persistance du choix dans le `localStorage`, langue par défaut français, formatage des nombres selon la locale.
- [x] Lorsque STORY-009b aura ajouté ES et DE, les nouvelles langues apparaissent avec leur drapeau (Espagne, Allemagne) en ajoutant uniquement le champ `country` dans `SUPPORTED_LOCALES` et en enregistrant le composant SVG dans la map `FLAGS` de `LanguageSelector.tsx` — sans modifier la structure du composant.
- [x] `npx tsc -b --noEmit`, `npm run lint` et `npm run build` passent sans erreur.
- [x] L'impact sur la taille du bundle reste marginal (ordre de grandeur : quelques kilo-octets, les imports SVG étant ciblés par drapeau pour bénéficier du tree-shaking).

## Notes techniques (indicatives)

- Fichier concerné : `src/components/LanguageSelector.tsx`.
- Librairie de drapeaux : `country-flag-icons` (dépendance ajoutée au projet) — imports ciblés par drapeau (ex. `FR`, `GB`) pour minimiser le bundle via tree-shaking, plutôt qu'un import du set complet.
- Mapping langue → pays : champ `country` (ISO 3166-1 alpha-2) ajouté dans `SUPPORTED_LOCALES` (`src/locales/index.ts`) : `fr → FR`, `en → GB`.
- Map `FLAGS` dans `LanguageSelector.tsx` : associe chaque code `country` au composant SVG correspondant importé depuis `country-flag-icons`.
- Acronyme : `code.toUpperCase()` suffit pour FR, EN, ES, DE — pas de table de correspondance ad hoc.
- Le nom natif de la langue reste disponible dans `SUPPORTED_LOCALES` et est affiché en discret dans chaque option du menu.

## Hors périmètre

- Choix du drapeau par l'utilisateur (le mapping langue → pays est fixé par le projet).
- Traduction du nom de la langue dans la langue active (ex. : « Anglais » en FR, « French » en EN).
- Détection automatique de la langue du navigateur (`navigator.language`).
- Tout changement au mécanisme de bascule ou de persistance de la langue (couvert par STORY-009a).

## Journal

- 2026-05-22 — Story créée par le PO pour formaliser une amélioration déjà implémentée. La version initiale de la story prévoyait une **icône générique** (`Languages` de lucide-react) + acronyme dans le bouton. Suite à une décision de l'utilisateur, le périmètre a évolué : l'icône est remplacée par un **drapeau SVG** par langue. La librairie `country-flag-icons` a été ajoutée aux dépendances du projet (impact bundle mesuré : +~2 kB, jugé acceptable). Le choix EN = drapeau du Royaume-Uni (Union Jack) est une décision explicite de l'utilisateur. Un champ `country` (ISO 3166-1 alpha-2) a été ajouté à `SUPPORTED_LOCALES` pour le mapping langue → drapeau. L'implémentation a passé `npx tsc -b --noEmit`, `npm run lint` et `npm run build` sans erreur. Estimation réévaluée de 1 à 2 points (ajout d'une dépendance externe, mapping, rendu SVG). Story en 👀 En revue — reste la **validation visuelle par l'utilisateur** (rendu des drapeaux dans le navigateur, lisibilité dans le menu, cohérence avec le thème sombre/clair).
- 2026-05-22 — Validation manuelle par l'utilisateur dans le navigateur : drapeaux SVG nets dans le bouton et le menu (🇫🇷 FR / 🇬🇧 EN), bascule de langue OK, rendu correct en thèmes clair et sombre. Tous les critères cochés. → ✅ Terminé.
