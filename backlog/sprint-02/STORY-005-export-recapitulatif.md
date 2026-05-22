# STORY-005 — Export d'un récapitulatif imprimable

- **Statut** : ✅ Terminé
- **Sprint** : sprint-02 (planifié)
- **Estimation** : 5 points
- **Priorité** : Haute

## User story

En tant qu'utilisateur, je veux **exporter ou imprimer un récapitulatif de mon estimation** afin de **garder une trace de mon calcul ou le partager** (par exemple à un ami à qui j'imprime une pièce).

## Contexte & valeur

Pour un usage personnel, le calcul est souvent ponctuel : on veut pouvoir le conserver (PDF) ou le donner à quelqu'un, sans capture d'écran bricolée. Un récapitulatif propre et lisible suffit — ce n'est pas un devis commercial.

## Critères d'acceptation

- [x] Un bouton **« Imprimer / Exporter »** est accessible depuis le récapitulatif de coût.
- [x] Le récapitulatif reprend les **paramètres clés** (filament, imprimante, quantité, durée, tarif élec.) et le **détail du coût** (matière, énergie, gâche, marge, total).
- [x] L'export passe par l'**impression navigateur** (`window.print()`) avec une **mise en page dédiée** (styles `@media print` : on masque les contrôles, on garde un document propre).
- [x] Le résultat est **lisible en noir & blanc** et tient idéalement sur une page A4. *(validé visuellement par l'utilisateur le 2026-05-22)*
- [x] La date de génération apparaît sur le document.

## Notes techniques (indicatives)

- Privilégier `window.print()` + styles `@media print` (pas de dépendance PDF lourde pour rester simple).
- Réutiliser les helpers de `src/lib/format.ts` et les données de `CostSummary`.

## Hors périmètre

- Personnalisation (logo, coordonnées, mentions légales), envoi par e-mail, modèles de devis multiples.

## Journal

- 2026-05-22 — Créée par le PO (revue de backlog, cible hobbyiste — recadrée « récapitulatif » plutôt que « devis commercial »).
- 2026-05-22 — Démarrage de l'implémentation par le développeur. Exploration de l'existant : CostSummary, useCalculator, format.ts, filaments.ts, printers.ts, App.tsx. Plan : créer `src/components/PrintSummary.tsx` (section dédiée à l'impression avec tous les paramètres + bouton déclencheur), ajouter les styles `@media print` dans `index.css`, intégrer dans `CostSummary.tsx` ou `App.tsx`.
- 2026-05-22 — Implémentation complète. Passage en revue.

  **Fait fonctionnel**
  Un bouton « Imprimer / Exporter » (icône imprimante, variante `outline`) apparaît en bas du bloc récapitulatif de coût, accessible directement depuis l'interface principale. Un clic déclenche `window.print()`, ce qui ouvre la boîte de dialogue d'impression du navigateur (avec option « Enregistrer en PDF » dans les navigateurs modernes). Pendant l'impression, l'interface applicative (formulaire, en-tête, pied de page, carte récapitulatif) est intégralement masquée et un document imprimable structuré est affiché à la place. Ce document comprend : l'en-tête avec titre et date de génération formatée en français, une section « Paramètres de l'impression » (filament + grammage + prix/kg, imprimante + puissance, durée formatée en h/min, tarif électricité, taux de gâche, marge si applicable), et une section « Détail du coût » (filament, électricité + kWh, gâche, coût de revient en gras, marge et prix de vente si applicable).

  **Comment technique**
  - Nouveau composant `src/components/PrintSummary.tsx` : rendu conditionnel côté CSS uniquement (`display: none` dans le DOM normal, `display: block` via `@media print` + `print:block` Tailwind). Résolution des noms lisibles de filament et d'imprimante via `getFilament()` / `getPrinter()` (mêmes helpers que le reste de l'app). Formatage via `formatEuros`, `formatKwh` (format.ts existant), plus deux helpers locaux purs : `formatDuree()` (convertit les heures décimales en « X h Y min ») et `formatDateFr()` (date locale fr-FR avec heure).
  - `src/components/CostSummary.tsx` : ajout du bouton avec `handlePrint()` (fonction hors composant pour éviter une re-création à chaque rendu), icône `Printer` de lucide-react, séparateur avant le bouton pour le démarquer visuellement, et classe `print:hidden` sur la `Card` entière (la Card n'a aucune utilité dans le document imprimé).
  - `src/App.tsx` : classes `print:hidden` ajoutées sur `<header>`, `<main>`, `<footer>` ; bloc `<div className="hidden print:block">` encapsule `PrintSummary` et reçoit toutes les données de `state` + `breakdown` via props (pas de props drilling excessif car ces données sont déjà disponibles au niveau App).
  - `src/index.css` : bloc `@media print` avec `@page { size: A4 portrait; margin: 20mm 18mm }`, réinitialisation body (blanc/noir), suppression du dégradé et du max-width ; classes CSS pures pour les composants imprimés (`print-header`, `print-title`, `print-date`, `print-section`, `print-section-title`, `print-table`, `print-row`, `print-row-bold`, `print-td-label`, `print-td-value`, `print-detail`, `print-footer`). Mise en forme sobre : lignes alternées légèrement grisées, ligne totalisant en gras + fond légèrement grisé, colonnes 65/35 label/valeur.

  **Choix d'implémentation**
  - Pas de `ReactDOM.createPortal` ni de composant de dialogue : la stratégie CSS `print:hidden` / `print:block` est plus simple, n'introduit aucune dépendance, et est parfaitement compatible avec `window.print()`.
  - Les styles d'impression sont en CSS pur (pas de classes Tailwind utilitaires dans PrintSummary) car les utilitaires Tailwind seraient peu lisibles pour des réglages typographiques en `pt` et les variables CSS oklch ne sont pas garanties converties correctement sur toutes les imprimantes.
  - `aria-hidden="true"` sur le `#print-summary` pour que les lecteurs d'écran ne lisent pas le document en double (le contenu est déjà affiché par CostSummary à l'écran).

  **Vérifications**
  - `npx tsc -b --noEmit` : aucune erreur.
  - `npm run lint` : aucun avertissement ni erreur.
  - `npm run build` : build réussi en 2,01 s, CSS 29,36 kB (+ styles impression), JS 340 kB.

  **Critères couverts**
  - [x] Bouton « Imprimer / Exporter » accessible depuis le récapitulatif.
  - [x] Paramètres clés + détail du coût présents dans le document.
  - [x] `window.print()` + `@media print` (contrôles masqués, document propre).
  - [x] Date de génération présente (formatée en français).
  - [x] Lisibilité N&B et tenue sur A4 : assurée côté CSS (`@page A4`, couleurs noir/blanc, taille 11pt), **validée visuellement** par l'utilisateur (cf. entrée du 2026-05-22 ci-dessous).

  **Limites et reste à valider**
  - Le rendu réel dépend du navigateur et du pilote d'imprimante. Un test visuel dans Chrome/Firefox (Fichier > Imprimer ou Ctrl+P depuis l'application) est nécessaire pour valider la tenue sur une page et la lisibilité en noir & blanc.
  - Si le contenu dépasse une page A4 (cas avec beaucoup de paramètres), `page-break-inside: avoid` limite les coupures au milieu d'une section mais ne force pas la mise sur une seule page. Acceptable selon le périmètre défini.
  - Transition vers 👀 En revue.

- 2026-05-22 — Validation manuelle par l'utilisateur via l'aperçu avant impression du navigateur (Ctrl+P) : UI applicative bien masquée, document propre avec paramètres (noms lisibles de filament/imprimante) et détail du coût complet, date en français, lisible en noir & blanc, tient sur une page A4. → ✅ Terminé.
