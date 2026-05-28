# Backlog produit

> Liste des chantiers identifiés, **priorisés** par impact × effort. Mise à jour : 28 mai 2026.

Format : `[priorité] · [impact] · [effort] — Titre — note`.

## 🔴 Priorité 1 — Actions externes à faire (hors-code)

| Tâche | Impact | Effort | Statut |
|---|---|---|---|
| **Buttondown : activer RSS-to-email** (automation hebdo) | Critique | 10 min côté Buttondown | ⏳ à faire |
| **Buttondown : poser le welcome email** (texte fourni `docs/guide-utilisateur.md`) | Critique | 5 min | ⏳ à faire |
| **Buttondown : test bout-en-bout** (inscription → réception confirmation) | Critique | 10 min | ⏳ à faire |
| **Plausible : enregistrer `geraldpameole.vercel.app`** | Bloque le tracking | 5 min | ⏳ à faire |
| **Décision domaine final** (`.fr` ou autre custom vs vercel.app) | Image pro | variable | ⏳ à décider |

## 🟠 Priorité 2 — Chantiers techniques fondations

| Tâche | Impact | Effort | Notes |
|---|---|---|---|
| **Migration Astro 5** | Débloque Content Layer (DB/CMS), perfs | 1/2 journée | breaking changes : Content Collections, `<ViewTransitions>` → `<ClientRouter>`, `entry.slug` → `entry.id` |
| **Refactor `ThreeBackground.astro`** en modules `src/scripts/three-bg/` | Maintenabilité, typage | 3-5 h | Lancé puis interrompu — à reprendre |
| **DB / CMS** | Confort d'édition, mutualisation 2 sites | 1 journée | Recommandé : **Keystatic** (git-backed) ou **headless CMS** (Directus, Sanity). À cadrer selon objectif. |
| **Nettoyage 45 erreurs TS legacy** | Qualité code | 1-2 h | `npm test` les liste. Bucketé en : schémas, types de retour, "implicit any" résiduel. |

## 🟡 Priorité 3 — Polissage & qualité

| Tâche | Impact | Effort | Notes |
|---|---|---|---|
| **A11y → 100** sur toutes les pages | Score Lighthouse + inclusion | 1-2 h | Actuellement 93. Reste : labels formulaires, `aria-label` exhaustifs. |
| **6 erreurs ESLint cosmétiques** (no-useless-assignment) | Hygiène | 30 min | Pré-existantes, non bloquantes. |
| **Mini-bug `BackButton`** (en bonus) | Robustesse | 15 min | Vérifier que `define:vars` fonctionne sur toutes les positions. |
| **CSP headers** (Vercel `vercel.json`) | Sécurité | 30 min | Restreindre les origines (Plausible, Buttondown, Formspree, Google Fonts). |
| **Tests** au-delà de `astro check` (Vitest unitaires sur utilitaires) | Confiance | 2-3 h | Optionnel pour un site statique solo. |

## 🔵 Priorité 4 — Évolutions produit

| Tâche | Impact | Effort | Notes |
|---|---|---|---|
| **Recherche full-text** côté blog | UX lecteur | 1 journée | Possible avec Pagefind (statique, parfait pour Astro). |
| **Page "Bibliothèque" enrichie** (filtres, recommandations) | Engagement | 1/2 journée | |
| **Mini-formulaire newsletter** déjà ajouté au footer ✅ | Conversion | livré | |
| **Pages "Études de cas"** détaillées par projet | Crédibilité | variable | Si commande client à présenter. |
| **Mode "imprimer un article"** | Confort lecteur | 2 h | CSS print spécifique. |
| **i18n (FR/EN)** | Audience internationale | 3-5 jours | Astro supporte nativement. |

## 🟢 Priorité 5 — Nice to have

| Tâche | Impact | Effort |
|---|---|---|
| Animation de transition entre pages plus poussée (ViewTransitions custom) | Polish | 2-3 h |
| Easter eggs sur la 404 / la console | Personnalité | 30 min |
| Page "Mes outils" (stack quotidienne) | SEO niche | 2 h |
| Newsletter : variations de templates pour articles | Diff visuelle | 1 h Buttondown |

## ❌ Hors-périmètre actuel (volontaire)

- **Pas de commentaires** sur les articles (volonté éditoriale → retours par email).
- **Pas de panier / e-commerce** (pas le métier).
- **Pas d'authentification / comptes utilisateurs**.
- **Pas de back-office WordPress-like** (le Markdown + git est la "vraie" interface).

## 📊 Suivi

Avancement à reporter ici en mettant à jour le statut. À chaque chantier livré : ligne dans `docs/CHANGELOG.md`.
