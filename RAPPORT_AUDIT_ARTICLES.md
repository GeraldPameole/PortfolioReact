# Rapport d'audit — Corpus articles

> **Date** : 1ᵉʳ juin 2026 (soirée — post Sprints 1+3+2 + P1/P2/P3)
> **Périmètre** : `src/content/articles/` (collection Astro `articles`, schéma Zod défini dans `src/content/config.ts`).
> **Objectif** : carte d'identité du corpus après les 4 vagues de chantiers du 31 mai → 1ᵉʳ juin 2026.

## 1. Vue d'ensemble

| Métrique | Valeur |
|---|---|
| **Total articles** | **95** |
| Avant refonte 31 mai | 95 |
| Évolution nette | 0 (densification −3 fusions + créations +3 P3a/b/c + renames neutres) |
| **Mots totaux du corpus** | **98 703** |
| **Mots / article — moyenne** | **1 038** |
| Domaines distincts | 15 (tous à ≥ 2 articles désormais) |
| Articles avec ≥ 2 SVG inline | 95 (100 %) — règle charte appliquée |
| Articles avec `updatedDate` récent (mai-juin 2026) | 14+ (LinkedIn B2B, EAA, etc.) |
| Articles avec `publishDate` ≥ 2026-01-01 | ~ 43 |
| Articles renommés `-2024`/`-2025` → `-2026` (cycle mai-juin 2026) | 4 (`react-performance-*`, `technologies-javascript-*`, `progressive-web-apps-*`, `gestion-projet-agile` → `agile-infrastructure-telecom`) |
| Articles fusionnés mai 2026 | 7 sources → 3 cibles (frameworks JS, tendances web, IA pro+marketing) |
| Slugs résiduels en `-2024`/`-2025` | **0** ✅ |
| Redirections 301 (`vercel.json`) | 11 |

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

### ✅ Résolu au 1ᵉʳ juin 2026

- **`progressive-web-apps-2024.md`** → modernisé et renommé `progressive-web-apps-2026.md` (Sprint 3 du 31 mai). 10ᵉ redirection 301 ajoutée à `vercel.json`.
- **Doublon filesystem `formation-equipes-commerciales-complete 2.md`** → renommé sans l'espace (les 2 articles étaient légitimement distincts, simple artefact macOS Finder).
- **9 articles sans expertise terrain** → 8 enrichis avec retours KEOS / SFR / ACTIV PARTNERS (Sprint 2A du 1ᵉʳ juin). Reste 1 article légitimement sans expertise : `outils-techniques/pillcolor-guide.md` (article méta sur le système de pill colors du site).
- **8 articles courts (<700 mots)** → 6 étoffés à 1100-1300 mots (Sprints 3C + 2B + 2C). Reste 2 articles courts : `gestion-projet-agile.md` (689) et `productivite-professionnelle.md` (694).
- **47 articles sans `tags:`** → 100 % de couverture désormais (Sprint 1 du 31 mai).

### ✅ Tous résolus au 1ᵉʳ juin (soirée)

- **Doublon agile** : résolu par renommage (`gestion-projet-agile.md` → `agile-infrastructure-telecom.md` — angle télécom KEOS, vs `gestion-projet-agile-meilleures-pratiques.md` — angle méthode généraliste). 11ᵉ redirection 301 ajoutée à `vercel.json`.
- **Domaines sous-représentés** : tous étoffés via 3 nouveaux articles (P3a/b/c) → `gestion-connaissances` (1 → 2), `reconversion-carriere` (1 → 2), `developpement-commercial` (2 → 3). Plus aucun domaine à 1 article.
- **`updatedDate` pattern** : étendu à tous les articles étoffés/modifiés depuis le 31 mai (14+ articles).

### 📋 Restant à arbitrer (priorité basse)

1. **`agile-infrastructure-telecom.md` à 689 mots** — seul article du corpus encore < 700 mots. Angle bien posé (terrain KEOS), enrichissement marginal possible si occasion.
2. **`publishDate` futur** : beaucoup d'articles ont des `publishDate` 2026-06 → 2026-10 (échelonnement éditorial volontaire). Conséquence : ils n'apparaissent pas en home/RSS tant que la date n'est pas atteinte (à confirmer selon la logique de `rss.xml.ts` et `index.astro`).
3. **Stabilité iCloud du repo** : ✅ **Résolu le 1ᵉʳ juin 2026 (soirée)** : repo déplacé de `~/Desktop/PortfolioReact` vers `~/code/PortfolioReact` (hors diCloud Drive). Patterns `*.icloud`, `* 2.md` etc. ajoutés au `.gitignore` pour immunisation. Voir [docs/CHANGELOG.md](docs/CHANGELOG.md) entrée 2026-06-01 (soirée) pour la cause racine documentée.

## 6. Méthodologie de l'audit

- Inventaire `find src/content/articles -name '*.md' -type f`.
- Comptage par domaine via `for d in src/content/articles/*/; do ... done`.
- Vérification frontmatter via lecture directe (head -15 sur quelques échantillons).
- Recherche références orphelines : `rg "<ancien-slug>" src/`.
- Vérification SVG : pattern `awk '/<svg/{flag=1} flag && /^$/{print}'`.
- Validation finale via `npm run build` (262 pages OK, 0 erreur).

---

*Ce rapport est régénérable. Pour un nouvel audit, voir la méthodologie section 6 ou demander à Claude Code une mise à jour basée sur le `git log` depuis la date de ce rapport.*
