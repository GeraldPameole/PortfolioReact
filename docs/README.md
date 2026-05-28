# Documentation du projet

> Index des documents projet pour le portfolio + blog **Gérald Paméole**.
> Tous au format Markdown, versionnés avec le code, à jour au **28 mai 2026**.

## 📚 Index

### Avant / cadrage

| Document | Pour quoi |
|---|---|
| [Cahier des charges fonctionnel](./cahier-des-charges-fonctionnel.md) | Le **quoi** : objectifs, audiences, périmètre, parcours, contenus, critères d'acceptation |
| [Cahier des charges technique](./cahier-des-charges-technique.md) | Le **comment** : stack, architecture, KPI perf, accessibilité, intégrations |
| [Arborescence](./arborescence.md) | Sitemap des pages |
| [Charte graphique](./charte-graphique.md) | Tokens couleur, typographies, composants, fond WebGL |
| [Charte éditoriale](./charte-editoriale.md) | Ton, style, format des articles, règles d'écriture |
| [User stories](./user-stories.md) | Parcours utilisateurs sous forme de stories |

### Pendant / pilotage

| Document | Pour quoi |
|---|---|
| [Backlog produit](./backlog.md) | Liste des chantiers, priorisée par impact/effort |
| [Changelog](./CHANGELOG.md) | Historique daté des évolutions |

### Livraison / opérations

| Document | Pour quoi |
|---|---|
| [Documentation technique](./documentation-technique.md) | Référence ops/maintenance/debug |
| [Guide utilisateur](./guide-utilisateur.md) | Comment publier un article, gérer la newsletter, etc. (côté admin) |
| [Checklist de livraison](./checklist-livraison.md) | Vérification systématique avant prod |
| [Sauvegarde & restauration](./sauvegarde-restauration.md) | Procédures de backup et de recovery |

### Hors du `docs/`

| Fichier | Où | Pour quoi |
|---|---|---|
| `CLAUDE.md` | racine | Instructions pour assistants IA (Claude Code, etc.) |
| `README.md` | racine | Présentation rapide du projet (état d'avancement) |
| `eslint.config.js` | racine | Configuration ESLint |
| `tsconfig.json` | racine | Configuration TypeScript |

## 📝 Documents *non* produits (et pourquoi)

Inspirés d'une liste classique de documents projet web. Beaucoup ne s'appliquent pas à un **portfolio solo déjà déployé**.

| Document classique | Statut ici | Raison |
|---|---|---|
| **Brief créatif** | ❌ | Design déjà existant, identité visuelle figée (cf. charte graphique). Pertinent en début de projet client, pas en rétro. |
| **Wireframes** | ❌ | Site déjà construit ; les wireframes auraient précédé la mise en code. À refaire en cas de refonte majeure. |
| **Moodboard** | ❌ | Idem — exploration visuelle pré-design. À faire en cas de refonte. |
| **Maquettes graphiques (mockups)** | ❌ | Site déjà en prod = la maquette = le code. |
| **Prototypes interactifs (Figma)** | ❌ | Idem. |
| **Planning (Gantt/roadmap)** | ⚠️ | Pas de projet client avec deadline. La `backlog.md` joue ce rôle. |
| **Contrat de prestation** | ❌ | Projet solo, pas de contrat. |
| **Backlog produit** | ✅ | `backlog.md` |
| **User stories** | ✅ | `user-stories.md` |
| **Rapport de tests** | ⚠️ | `npm test` + `npm run lint` jouent ce rôle au quotidien ; pas de rapport formel. |
| **Compte-rendu de réunion** | ❌ | Projet solo. |
| **Changelog** | ✅ | `CHANGELOG.md` |
| **Bon de livraison** | ❌ | Pas de client à qui livrer formellement. |
| **Guide utilisateur** | ✅ | `guide-utilisateur.md` (pour l'admin/auteur) |
| **Documentation technique** | ✅ | `documentation-technique.md` |
| **Procédures sauvegarde/restauration** | ✅ | `sauvegarde-restauration.md` |
| **Contrat de maintenance** | ❌ | Pas applicable. |
| **PV de recette** | ⚠️ | `checklist-livraison.md` joue ce rôle. |
| **Facture finale** | ❌ | Pas applicable. |
| **Checklist de livraison** | ✅ | `checklist-livraison.md` |

## 🔄 Maintenir cette documentation

- Mettre à jour `CHANGELOG.md` à chaque évolution livrée.
- Mettre à jour `backlog.md` quand un chantier est terminé ou ajouté.
- Reviewer `cahier-des-charges-*` annuellement (objectifs, périmètre).
- `charte-*` : seulement quand l'identité change.

Quand un assistant IA travaille sur le projet, lui pointer ce dossier `docs/` + `CLAUDE.md` à la racine pour qu'il ait le contexte complet.
