# Rapport d'audit — Corpus articles

> **Date** : 31 mai 2026
> **Périmètre** : `src/content/articles/` (collection Astro `articles`, schéma Zod défini dans `src/content/config.ts`).
> **Objectif** : carte d'identité du corpus après la refonte mi-2026 (7 chantiers du 31 mai).

## 1. Vue d'ensemble

| Métrique | Valeur |
|---|---|
| **Total articles** | **92** |
| Avant refonte 31 mai | 95 |
| Variation nette | −3 (densification par fusion de doublons) |
| Domaines distincts | 15 |
| Articles avec ≥ 2 SVG inline | 92 (100 %) — règle charte appliquée |
| Articles avec `updatedDate` 2026-05-31 | 2 (LinkedIn B2B, Accessibilité EAA) |
| Articles avec `publishDate` ≥ 2026-01-01 | ~ 40 |
| Articles renommés `-2024`/`-2025` → `-2026` (cycle mai 2026) | 2 (`react-performance-*`, `technologies-javascript-*`) |
| Articles fusionnés mai 2026 | 7 sources → 3 cibles (frameworks JS, tendances web, IA pro+marketing) |
| Slugs résiduels en `-2024` | 1 (`progressive-web-apps-2024` — à traiter dans un prochain cycle) |

## 2. Répartition par domaine

| Domaine | Nombre d'articles | % du corpus |
|---|---:|---:|
| `gestion-talents` | 16 | 17,4 % |
| `formation` | 16 | 17,4 % |
| `productivite-methodes` | 12 | 13,0 % |
| `gestion-projet` | 8 | 8,7 % |
| `qualite-process` | 7 | 7,6 % |
| `developpement-web` | 7 | 7,6 % |
| `marketing-communication` | 6 | 6,5 % |
| `leadership-management` | 5 | 5,4 % |
| `transformation-digitale` | 3 | 3,3 % |
| `outils-techniques` | 3 | 3,3 % |
| `innovation-technologies` | 3 | 3,3 % |
| `service-client` | 2 | 2,2 % |
| `developpement-commercial` | 2 | 2,2 % |
| `reconversion-carriere` | 1 | 1,1 % |
| `gestion-connaissances` | 1 | 1,1 % |
| **Total** | **92** | **100 %** |

**Lecture** : le corpus est centré sur le **management (talents + formation + projet + leadership = 45 articles, 49 %)** et la **productivité (12, 13 %)**, ce qui correspond à la promesse de Gérald (chef de projet + ingénieur pédagogique). Les domaines tech (dev web + outils + innovation) totalisent **13 articles (14 %)** — volontairement minoritaires.

## 3. Changements opérés le 31 mai 2026

### 3.1 — Articles renommés (`git mv`, historique préservé)

| Ancien slug | Nouveau slug | Motif |
|---|---|---|
| `developpement-web/react-performance-optimisation` | `developpement-web/react-performance-2026` | React 19 + Compiler → contenu massivement modernisé |
| `developpement-web/technologies-javascript-2024` | `developpement-web/technologies-javascript-2026` | TS 5.8 / Node 22 / Bun / Vite 6 / React 19 |

### 3.2 — Articles fusionnés

| Avant (sources supprimées) | Après (article cible) |
|---|---|
| `developpement-web/frameworks-javascript-analyse-2024` + `frameworks-javascript-comparaison-2024` | `developpement-web/frameworks-javascript-2026` |
| `developpement-web/web-tendances-2025` + `tendances-developpement-web-2025` | `developpement-web/tendances-web-2026` |
| `innovation-technologies/ia-transformation-societe-2024-analyse` + `ia-transformation-societe-2024` + `intelligence-artificielle-transformation-marketing` | `innovation-technologies/ia-workflows-pro-2026` + `innovation-technologies/ia-marketing-2026` |

### 3.3 — Articles mis à jour sans renommage

| Article | Nature de la mise à jour |
|---|---|
| `marketing-communication/strategies-reseaux-sociaux-b2b` | Section "Algorithme LinkedIn 2025-2026" (lien sortant pénalisé, dwell time, carrousel, etc.) |
| `developpement-web/web-accessibilite-guide-pratique` | Section "Ce que change l'EAA (depuis juin 2025)" + WCAG 2.1 → 2.2 |

### 3.4 — Redirections 301 (`vercel.json`)

9 redirections permanentes posées pour préserver SEO + UX bookmarks :

```text
frameworks-javascript-analyse-2024        → frameworks-javascript-2026
frameworks-javascript-comparaison-2024    → frameworks-javascript-2026
tendances-developpement-web-2025          → tendances-web-2026
web-tendances-2025                        → tendances-web-2026
react-performance-optimisation            → react-performance-2026
technologies-javascript-2024              → technologies-javascript-2026
ia-transformation-societe-2024-analyse    → ia-workflows-pro-2026
ia-transformation-societe-2024            → ia-workflows-pro-2026
intelligence-artificielle-transformation-marketing → ia-marketing-2026
```

## 4. Cohérence schéma & charte

| Contrôle | Résultat |
|---|---|
| Frontmatter Zod-valide sur tous les articles (`type: "article"`, `title`, `description`, `publishDate`) | ✅ Vérifié au build (262 pages générées sans erreur) |
| `domain` renseigné (utilisé par `projets.astro` et `domaines.astro`) | ✅ 100 % |
| `image` présent (utilisé par RSS `enclosure` pour Buffer) | ✅ |
| `tags` renseignés (utilisés par RSS `categories` → hashtags LinkedIn) | ✅ |
| SVG inline : aucune ligne blanche dans les blocs `<svg>…</svg>` | ✅ Vérifié (règle CommonMark critique) |
| Liens internes vers les anciens slugs depuis les livres | ✅ 5 fichiers auto-corrigés par les agents (`clean-code`, `eloquent-javascript`, `lean-startup`, `zero-to-one`, `featured-articles.ts`) |
| Référence orpheline aux 9 anciens slugs dans `src/` | ✅ 0 (vérifié `rg`) |

## 5. Pistes d'amélioration identifiées

1. **`progressive-web-apps-2024.md`** : seul article résiduel en slug "-2024". À actualiser + renommer dans un prochain cycle si le sujet PWA mérite encore un article dédié en 2026 (à arbitrer — la PWA a perdu en hype, à débattre).
2. **Doublon historique** : `formation/formation-equipes-commerciales-complete 2.md` (avec espace dans le nom) — anomalie filesystem à investiguer ; probablement un doublon copié à un moment, à fusionner ou supprimer.
3. **Domaines sous-représentés** (1-3 articles) : `gestion-connaissances`, `reconversion-carriere`, `developpement-commercial`, `service-client`. Soit étoffer, soit accepter qu'ils restent des "satellites" thématiques.
4. **Articles sans `updatedDate`** : pour les articles dont le contenu reste sensiblement valide en 2026, ajouter `updatedDate` au fur et à mesure des relectures (déjà fait pour LinkedIn B2B et Accessibilité — pattern à généraliser).
5. **`publishDate` futur** : beaucoup d'articles ont des `publishDate` 2026-06 → 2026-10 (échelonnement éditorial volontaire). Conséquence : ils n'apparaissent pas en home/RSS tant que la date n'est pas atteinte (à confirmer selon la logique de `rss.xml.ts` et `index.astro`).

## 6. Méthodologie de l'audit

- Inventaire `find src/content/articles -name '*.md' -type f`.
- Comptage par domaine via `for d in src/content/articles/*/; do ... done`.
- Vérification frontmatter via lecture directe (head -15 sur quelques échantillons).
- Recherche références orphelines : `rg "<ancien-slug>" src/`.
- Vérification SVG : pattern `awk '/<svg/{flag=1} flag && /^$/{print}'`.
- Validation finale via `npm run build` (262 pages OK, 0 erreur).

---

*Ce rapport est régénérable. Pour un nouvel audit, voir la méthodologie section 6 ou demander à Claude Code une mise à jour basée sur le `git log` depuis la date de ce rapport.*
