# STORY-009b — Traductions espagnol et allemand (i18n)

- **Statut** : 📋 Backlog
- **Sprint** : sprint-04 (planifié)
- **Estimation** : 3 points
- **Priorité** : Moyenne
- **Dépendance** : STORY-009a (infrastructure i18n + FR/EN) doit être terminée.
- **Découpage** : complément de STORY-009a ; ensemble elles constituent l'i18n complète à 4 langues (8 pts d'origine).

## User story

En tant qu'utilisateur hispanophone ou germanophone, je veux pouvoir **choisir l'espagnol ou l'allemand** dans le sélecteur de langue, afin de naviguer dans l'application dans ma langue maternelle.

## Contexte & valeur

L'infrastructure i18n et les traductions FR/EN sont posées par STORY-009a. Ajouter ES et DE est un effort marginal (3 pts) : il suffit d'écrire deux nouveaux fichiers de traduction et de les enregistrer dans le dictionnaire existant. Cette story complète l'ambition initiale d'un accès à 4 langues, sans risquer le sprint-03.

## Critères d'acceptation

- [ ] Le sélecteur de langue (mis en place par STORY-009a) propose désormais quatre options : **français (FR)**, **anglais (EN)**, **espagnol (ES)**, **allemand (DE)**.
- [ ] Tous les libellés de l'interface traduits en FR/EN (STORY-009a) sont également disponibles en **espagnol** et en **allemand** : titres, étiquettes, hints, placeholders, messages d'erreur, boutons, récapitulatif, pied de page.
- [ ] Changer la langue vers ES ou DE **met à jour instantanément** tous les libellés, sans rechargement de page.
- [ ] Le choix d'une langue ES ou DE est **persisté dans le `localStorage`** et restauré au chargement suivant.
- [ ] Le **formatage des nombres suit la locale active** pour ES (`es-ES`) et DE (`de-DE`) : séparateurs décimaux et de milliers adaptés (ex. `1.234,56 €` en DE).
- [ ] La **devise reste EUR** pour ES et DE, sans conversion monétaire.
- [ ] Le composant `PrintSummary` reflète la langue active en ES et en DE.
- [ ] L'application passe `npx tsc -b --noEmit`, `npm run lint` et `npm run build` sans erreur dans les quatre langues.

## Notes techniques (indicatives)

- Ajouter `es.ts` et `de.ts` (ou les équivalents selon le choix d'architecture de STORY-009a) dans `src/locales/` ou l'équivalent.
- Étendre le type du code de langue (`'fr' | 'en' | 'es' | 'de'`) et la liste des options du sélecteur.
- Les traductions peuvent s'appuyer sur des outils de traduction automatique, à valider sur les termes techniques (« taux de gâche », « coût de revient », « remplissage », « vitesse d'impression »).
- Locales `Intl` recommandées : `es-ES` pour l'espagnol, `de-DE` pour l'allemand.

## Hors périmètre

- Ajout de nouvelles langues au-delà de FR, EN, ES, DE.
- Conversion de devise ou adaptation des tarifs selon la locale.
- Support RTL.

## Journal

- 2026-05-22 — Créée par le PO lors du découpage de STORY-009 (arbitrage Option B). Reportée au sprint-04 ; dépend de STORY-009a. Le sprint-04 ne sera détaillé qu'au moment de sa planification.
