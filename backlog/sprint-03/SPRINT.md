# Sprint 03 — 🚧 en cours

- **Période** : 2026-05-23 → 2026-06-05 (2 semaines)
- **Statut** : 🚧 En cours
- **Cible produit** : hobbyistes / usage personnel.

## Objectif du sprint

**Expérience et robustesse de l'interface** — rendre l'application plus confortable, plus résiliente aux erreurs inattendues, et accessible à un public non francophone (FR/EN).

Ce sprint a trois axes complémentaires :
1. **Robustesse** (STORY-007) : plus d'écran blanc inexpliqué si une erreur JavaScript survient.
2. **Confort visuel** (STORY-008) : bascule clair/sombre, avec mémorisation et détection de la préférence système.
3. **Accessibilité linguistique** (STORY-009a) : infrastructure i18n + interface disponible en français et en anglais.

## Stories du sprint

| Story | Titre | Points | Priorité | Statut |
|-------|-------|:------:|----------|--------|
| STORY-007 | Protection contre les erreurs inattendues (ErrorBoundary) | 3 | Haute | ✅ Terminé |
| STORY-008 | Bascule thème clair / sombre | 3 | Moyenne | 🔜 À faire |
| STORY-009a | Infrastructure i18n + langues français et anglais | 5 | Moyenne | 🔜 À faire |

**Charge totale : 11 points** — dans la vélocité habituelle (10–11 pts par sprint).

> STORY-009b (traductions ES/DE, 3 pts) est reportée au sprint-04 — arbitrage Option B validé le 2026-05-22. Voir `backlog/sprint-04/STORY-009b-i18n-traductions-es-de.md`.

## Ordre de développement suggéré

1. **STORY-007** (ErrorBoundary, 3 pts) — rapide, filet de sécurité à poser en premier.
2. **STORY-008** (thème, 3 pts) — indépendante, infrastructure CSS déjà en place.
3. **STORY-009a** (i18n FR/EN, 5 pts) — la plus longue ; à commencer une fois les deux premières livrées.

Les trois stories sont indépendantes et peuvent être développées dans n'importe quel ordre, mais cet ordre minimise les risques.

## Dépendances et risques

| Risque | Probabilité | Impact | Mitigation |
|--------|:-----------:|:------:|-----------|
| STORY-009a sous-estimée — extraction des libellés de 8 composants peut prendre plus de temps qu'anticipé | Moyenne | Moyen | Découpage déjà appliqué : ES/DE sortis du sprint ; FR/EN seul = 5 pts raisonnables |
| STORY-008 et STORY-009a ajoutent toutes deux un élément dans l'en-tête — risque de surcharge visuelle | Basse | Faible | Le développeur groupe les deux contrôles (thème + langue) dans une zone dédiée |
| `format.ts` à refactorer pour accepter une locale — risque de régression sur les montants affichés | Basse | Moyen | Précisé dans les critères et notes de STORY-009a ; la devise EUR reste invariante |
