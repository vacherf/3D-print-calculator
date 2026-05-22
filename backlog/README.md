# Backlog & sprints — Calculateur d'impression 3D

Ce dossier organise le travail en **stories** regroupées en **sprints**, avec deux rôles incarnés par des sous-agents Claude Code.

## Rôles

| Rôle | Agent | Responsabilité |
|------|-------|----------------|
| **Product Owner** | `product-owner` | Rédige et priorise les stories, définit les critères d'acceptation, planifie les sprints. Ne code pas. |
| **Développeur** | `developer` | Implémente les stories, vérifie (typecheck/build), met à jour leur statut. |
| **Rédacteur technique** | `documentation` | Maintient la documentation (README, CLAUDE.md, docs/, JSDoc) en phase avec le code. Ne décide pas du produit. |

### Comment les invoquer
- « **PO**, écris une story pour permettre l'export du devis en PDF. »
- « **PO**, planifie le sprint 2 avec les stories prioritaires du backlog. »
- « **Dev**, implémente la STORY-003. »
- « **Doc**, mets à jour la documentation après la STORY-002. »

Claude délègue alors au bon sous-agent (défini dans `.claude/agents/`).

## Structure

```
backlog/
  README.md            ← ce fichier (process & règles)
  template-story.md    ← gabarit à copier pour toute nouvelle story
  backlog.md           ← stories non encore planifiées, par priorité
  sprint-01/           ← un dossier par sprint, une story par fichier
    STORY-001-....md
```

## Cycle de vie d'une story

```
📋 Backlog → 🔜 À faire → 🚧 En cours → 👀 En revue → ✅ Terminé
```

- **📋 Backlog** : idée formalisée, pas encore planifiée (dans `backlog.md`).
- **🔜 À faire** : intégrée à un sprint, prête à être prise.
- **🚧 En cours** : le développeur travaille dessus.
- **👀 En revue** : implémentée, en attente de validation des critères.
- **✅ Terminé** : tous les critères d'acceptation cochés et vérifiés.

## Conventions

- **Numérotation** continue et unique : `STORY-001`, `STORY-002`, …
- **Fichier** : `STORY-00X-titre-en-kebab-case.md`.
- **Estimation** en points (Fibonacci) : `1, 2, 3, 5, 8`. Au-delà de 8 → découper.
- **Priorité** : Haute / Moyenne / Basse.

## Définition de « Terminé » (Definition of Done)

Une story est `✅ Terminé` quand :

- [ ] Tous les critères d'acceptation sont cochés.
- [ ] `npx tsc -b --noEmit` passe sans erreur.
- [ ] `npm run lint` passe sans erreur.
- [ ] `npm run build` réussit (si la story touche le code applicatif).
- [ ] Le code respecte les conventions du projet (alias `@/`, libellés FR, logique pure dans `src/lib/`).
- [ ] La fonctionnalité a été constatée fonctionnelle (manuellement ou via build).
- [ ] Le journal de la story est à jour.

## Cadence

Sprints de **2 semaines**. Chaque sprint a un **objectif** unique en tête de dossier (voir le `STORY-000` ou l'en-tête du premier fichier du sprint).

## Clôture de sprint

Quand toutes les stories d'un sprint sont `✅ Terminé`, la clôture se déroule ainsi :

1. **Bilan** — le `product-owner` rédige le bilan détaillé dans le `SPRINT.md` (objectif, réalisé, reporté, faits marquants, enseignements, suite) et passe le sprint en `Clôturé` avec sa date.
2. **Mise à jour de la doc** — l'agent `documentation` met la documentation en phase avec le code livré pendant le sprint (`README.md`, `CLAUDE.md`, `docs/`, JSDoc). **Cette étape est systématique à chaque fin de sprint**, même si aucune story ne semblait « documentaire » : nouvelles fonctionnalités, modules, commandes ou évolutions de périmètre doivent s'y refléter.

> Cette double étape (bilan PO + synchro doc) fait partie intégrante de la clôture : un sprint n'est pas considéré clos tant que la doc n'a pas été passée en revue.
