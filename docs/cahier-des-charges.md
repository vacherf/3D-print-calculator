# Cahier des charges — Calculateur de coût d'impression 3D

- **Version** : 1.0
- **Date** : 2026-05-22
- **Statut** : socle de référence (vivant — à mettre à jour avec le produit)

Ce document décrit le *quoi* et le *pourquoi* du projet. Le *comment* (conventions de code, commandes) est résumé dans [`../CLAUDE.md`](../CLAUDE.md) ; l'avancement vit dans [`../backlog/`](../backlog/).

---

## 1. Contexte & objectif

Estimer le **coût de revient réel d'une impression 3D** (procédé FDM/dépôt de fil) n'est pas évident : il faut additionner le coût du filament consommé et celui de l'électricité, en tenant compte des impressions ratées. Les makers le font souvent « au doigt mouillé ».

**Objectif** : fournir un outil simple qui donne rapidement ce coût, en limitant la saisie manuelle (import STL, modèles d'imprimantes préremplis) et en s'appuyant sur des valeurs de référence du marché français.

## 2. Public cible & cadre d'usage

- **Cible** : **hobbyiste / usage personnel** — quelqu'un qui imprime pour soi et veut savoir ce que ça coûte.
- **Cadre** : **outil perso/local**, lancé sur la machine de l'utilisateur (`npm run dev` / build statique).
- **Hébergement** : un déploiement sur **GitHub Pages** est prévu (STORY-006) comme **simple commodité d'accès personnel** (utiliser l'app depuis n'importe quel appareil). Cela **ne change pas la cible** : pas de promesse multi-utilisateurs, ni d'exigences SEO / performance / accessibilité « grand public » ajoutées.
- **Conséquence** : priorité à la **simplicité** et au **confort**. Les fonctions orientées « vente / facturation » (devis commercial, séries, amortissement) restent **secondaires**.

## 3. Périmètre fonctionnel

### 3.1 Calcul du coût de revient (cœur)

Saisie : type/prix du filament, masse, durée, imprimante (→ puissance), tarif électricité, taux de gâche, marge optionnelle. Sortie : un récapitulatif chiffré en temps réel (matière, électricité, gâche, coût de revient, et prix de vente conseillé si marge > 0).

### 3.2 Référentiel filaments

Liste des filaments courants (PLA, PETG, ABS, ASA, TPU, Nylon, PLA-CF, + Personnalisé) avec **prix moyen au kilo** et **densité** préremplis, modifiables. La densité sert à l'estimation de masse depuis un STL.

### 3.3 Sélection de l'imprimante

Liste de modèles populaires **regroupés par marque** (Bambu Lab, Prusa, Creality, Anycubic, Elegoo, + Personnalisé). Chaque modèle porte une **puissance moyenne en impression** appliquée automatiquement au calcul d'énergie. Option « Personnalisé » pour saisir une puissance mesurée.

### 3.4 Tarifs électricité (France)

Raccourcis Tarif Bleu EDF (Base / Heures pleines / Heures creuses), valeur modifiable.

### 3.5 Import & analyse STL

Import d'un fichier `.STL` (par clic ou glisser-déposer, formats **ASCII et binaire**) qui analyse la géométrie et **préremplit automatiquement** la masse de filament et la durée d'impression, avec un taux de remplissage ajustable.

## 4. Exigences fonctionnelles détaillées

### EF-1 — Moteur de coût (`src/lib/calculator.ts`)

```
coût matière      = (masse_g / 1000) × prix_€/kg
énergie_kWh       = (puissance_W / 1000) × durée_h
coût électricité  = énergie_kWh × prix_€/kWh
coût de base      = coût matière + coût électricité
coût de gâche     = coût de base × (gâche% / 100)
coût de revient   = coût de base + coût de gâche
marge             = coût de revient × (marge% / 100)
prix de vente     = coût de revient + marge
```

- Les entrées invalides ou négatives sont neutralisées (traitées comme 0).
- La gâche s'applique **à la matière ET à l'énergie** (sur le coût de base).
- La marge est optionnelle (0 = pas de prix de vente affiché).

### EF-2 — Analyse STL (`src/lib/stl.ts`)

- **Géométrie mesurée** : volume solide (méthode des tétraèdres signés), surface totale, boîte englobante (dimensions X/Y/Z), nombre de triangles.
- **Estimation de masse** — modèle « coque + remplissage » :
  ```
  coque_cm³    = min(surface_cm² × épaisseur_paroi_cm, volume_cm³)   // épaisseur paroi défaut ≈ 1,2 mm
  cœur_cm³     = max(volume_cm³ − coque_cm³, 0)
  volume_extrudé = coque_cm³ + cœur_cm³ × (remplissage% / 100)
  masse_g      = volume_extrudé × densité_filament
  ```
- **Estimation de durée** : `volume_extrudé_mm³ / débit_volumétrique / 3600`, débit par défaut ≈ 10 mm³/s.
- Un fichier illisible affiche une erreur claire sans casser l'application.

### EF-3 — Pré-remplissage & recalcul

L'import STL renseigne masse + durée ; modifier le taux de remplissage recalcule les deux en direct. La sélection d'imprimante renseigne la puissance. Le récapitulatif se met à jour en temps réel à chaque changement.

## 5. Exigences non fonctionnelles

| # | Exigence | Détail |
|---|----------|--------|
| ENF-1 | **100 % client** | Aucun backend ; tout le calcul se fait dans le navigateur. Fonctionne hors-ligne une fois la page chargée. |
| ENF-2 | **Localisation** | Interface disponible en **4 langues** : français (défaut), anglais, espagnol, allemand — sélecteur dans l'en-tête (drapeau + acronyme), bascule instantanée, persistée (`print3d-ui:lang`). L'attribut `lang` de `<html>` suit la langue active (accessibilité). Formatage selon la locale via `Intl.NumberFormat` (`fr-FR`, `en-GB`, `es-ES`, `de-DE`) ; devise **EUR** invariante ; références marché **France**. Certaines formulations techniques ES/DE sont balisées `// TODO` dans les dictionnaires pour confirmation par un locuteur natif (dette mineure, non bloquante). |
| ENF-3 | **Simplicité** | Un seul écran, lisible, sans configuration. Pas de compte, pas d'analytics, pas de SEO requis (usage local). |
| ENF-4 | **Réactivité** | Calcul instantané ; analyse STL fluide pour des fichiers courants (jusqu'à ~plusieurs centaines de milliers de triangles). |
| ENF-5 | **Responsive** | Utilisable sur desktop et mobile. |
| ENF-6 | **Qualité du code** | TypeScript strict, logique métier pure et isolée dans `src/lib/`, conventions du projet (voir `CLAUDE.md`). |
| ENF-7 | **Transparence** | Les estimations approximatives (STL, puissances) sont signalées comme telles dans l'UI. |
| ENF-8 | **Robustesse** | Un `ErrorBoundary` de classe React enveloppe l'application ; toute erreur JavaScript non capturée affiche un écran de repli traduit plutôt qu'un écran blanc. |
| ENF-9 | **Confort visuel** | Bascule thème clair / sombre dans l'en-tête, persistée (`print3d-ui:theme`), avec détection initiale de `prefers-color-scheme`. L'impression reste en noir & blanc. |

## 6. Hypothèses & contraintes

- Les **données de référence** (tarifs électricité, prix filaments, puissances imprimantes) sont des **moyennes 2025 indicatives**, modifiables par l'utilisateur, et à **réactualiser** dans le temps.
- L'estimation STL **ne remplace pas un slicer** : supports, jupe/bordure, purge, vitesses et chevauchements ne sont pas modélisés. Elle donne un ordre de grandeur.
- Les **puissances d'imprimante** sont des moyennes en régime établi, pas des mesures wattmètre.
- Le procédé visé est **FDM (dépôt de fil)** ; la résine (SLA/DLP) n'est pas couverte.

## 7. Hors périmètre (à ce stade)

- Slicing réel, supports, multi-matériaux / multi-couleurs.
- **Amortissement de l'imprimante et usure** (buse, plateau) — _backlog, priorité basse (orienté pro)._
- **Multi-pièces / impression en lot** — _backlog, hors cible actuelle._
- **Devises autres qu'EUR** — _hors périmètre ; la devise est EUR invariante même en mode anglais/espagnol/allemand._
- Comptes utilisateurs, synchronisation cloud, historique de plusieurs estimations.
- Génération de devis commercial avec branding (logo, mentions légales).

## 8. Organisation du projet

Process agile léger :

- **Sprints de 2 semaines**, avec un objectif unique chacun.
- **User stories** au format `backlog/template-story.md`, suivies dans `backlog/sprint-XX/`.
- Trois **rôles** incarnés par des sous-agents Claude Code (`.claude/agents/`) :
  - **Product Owner** (`product-owner`) — rédige/priorise les stories, planifie (ne code pas).
  - **Développeur** (`developer`) — implémente, vérifie, met à jour les statuts.
  - **Rédacteur technique** (`documentation`) — maintient la doc (README, CLAUDE.md, docs/, JSDoc) en phase avec le code (ne décide pas du produit).
- **Definition of Done** et cycle de vie des stories : voir `backlog/README.md`.

## 9. Roadmap (instantané au 2026-05-22)

- **Sprint 01** ✅ — Fiabiliser l'estimation d'entrée : import STL, sélection d'imprimante, configuration ESLint. Clôturé le 2026-05-22.
- **Sprint 02** ✅ — Confort, restitution & accès : persistance de la saisie (`localStorage`), récapitulatif imprimable (`window.print()` + `@media print`), déploiement GitHub Pages. Clôturé le 2026-05-22. Application accessible sur https://vacherf.github.io/3D-print-calculator/
- **Sprint 03** ✅ — Expérience et robustesse : `ErrorBoundary` (écran de repli FR/EN), thème clair/sombre (persisté, détection système), infrastructure i18n + interface FR/EN. Clôturé le 2026-05-22.
- **Sprint 04** ✅ (clôturé 2026-05-22) — Traductions ES/DE (STORY-009b) + sélecteur de langue drapeau/acronyme (STORY-010). Interface disponible en 4 langues FR/EN/ES/DE.
- **Backlog** — paramètres STL avancés, bibliothèque de filaments personnalisée, aperçu 3D… (voir `backlog/backlog.md`).

## 10. Glossaire

- **FDM** — *Fused Deposition Modeling*, impression par dépôt de fil fondu.
- **Filament** — bobine de matière plastique (PLA, PETG…) consommée par l'imprimante.
- **STL** — format de fichier décrivant un objet 3D par un maillage de triangles.
- **Remplissage (infill)** — densité interne de la pièce, en % (une pièce n'est presque jamais pleine).
- **Coque** — parois + couches du dessus/dessous, imprimées en plein.
- **Débit volumétrique** — volume de matière extrudée par seconde (mm³/s).
- **Gâche** — surcoût des impressions ratées, supports, purges.
- **Coût de revient** — coût total pour produire la pièce (matière + énergie + gâche), hors marge.
- **Tarif Bleu** — tarif réglementé d'électricité d'EDF en France.
- **kWh** — kilowattheure, unité d'énergie facturée par le fournisseur d'électricité.
