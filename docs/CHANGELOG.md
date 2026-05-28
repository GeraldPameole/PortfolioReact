# Changelog

> Historique des évolutions du site, dérivé du `git log`. Format inspiré de [Keep a Changelog](https://keepachangelog.com/).
> Type des commits : `feat` (nouvelle fonctionnalité), `fix` (correctif), `perf` (performance), `a11y` (accessibilité), `refactor`, `chore` (outillage), `docs`, `style`.

## 2026-05-28 — Robustesse contenu, types et UX

### Corrigé
- **Schémas SVG inline cassés** dans 14 articles (formation/, gestion-talents/) : retrait des lignes vides à l'intérieur des blocs SVG qui cassaient le parseur Markdown. Les courbes/points/légendes des graphes réapparaissent. (`9e2a44f`)
- **Erreurs TypeScript** : `npm test` passe de 45 erreurs à **0** :
  - Suppression `src/lib/firebase.ts` (orphelin).
  - Ajout de champs optionnels à `ThemeConfig`, `PageBanner`, `BaseLayout`.
  - `BackButton` : passage par `define:vars` pour le prop `position` (interpolation cassée en script `is:inline` corrigée).
  - Type de retour `readonly string[]` pour `getFeaturedArticlesForDomain`.
  - `articlesByTheme` correctement typé.
  - **Vrai bug** : `themes.astro` passait `buttonUrl` à `<CallToAction>` qui attend `buttonLink` → bouton sans URL. Corrigé.
  - `blog/themes.astro` : `book.data.cover` → `book.data.coverImage` + accès `.color.X` → `.X` (refactor schéma jamais propagé). (`1ffe7ed`)
- Silencing du bruit TS non bloquant (`@ts-nocheck` sur `ThreeBackground.astro`, tsconfig relax). (`26d40a3`)

### Ajouté
- `npm test` / `npm run check` (= `astro check`) + `tsconfig.json` permissif. (`7d3c62e`)
- **Accessibilité** : ordres de titres corrigés sur 9 pages (skills, projets, livres, themes, blog/themes, etc.) + `--text-4` bumpé à `#7e8da4` (AA ~5:1). (`582670d`)
- **Mini-formulaire newsletter** dans le footer (site-wide, Buttondown `Apex_971`, `tag=footer`). (`46c9959`)
- `eslint.config.js` : ignore `scripts/`, fix `var i → let i` dans `blog.astro`. (`b3a8503`)

## 2026-05-27 — Performance images + activation newsletter

### Performance
- **Lazy-loading** + `decoding="async"` sur les images de cartes en grille (thèmes). (`d9d31ac`)
- **Recompression images** :
  - `public/assets` (profil, projets, livres, articles) : 23 Mo → 6,1 Mo (−74%, 58 images). (`f8fd9d1`)
  - Images de thèmes : 2560×1536 → 1280px, q72-74 : 4,3 Mo → 1,13 Mo (−74%). (`b911c03`)
- Three.js : version allégée sur mobile (étoiles 900, pixelRatio 1, nébuleuses moins denses). (`c6b45f8`)

### Hero
- Suppression de l'**ancienne animation canvas-2D morte** (~3 Ko de JS inutile, plus erreurs ESLint). (`2f9f11f`)

### Newsletter
- **Inscription via Buttondown** activée sur la home et `/blog` (endpoint embed-subscribe, envoi `no-cors`, succès optimiste). (`00ec1b6`)
- Validation native d'email avant envoi (ne plus cacher le form sur soumission vide). (`db5e4a1`)
- Libellé propre sur le bouton pendant l'envoi (`Inscription…` au lieu de `…`). (`2f49e3b`)

### RSS
- **Contenu complet** des articles inclus dans le flux RSS (markdown-it + sanitize-html, URLs absolutisées). Exploitable pour RSS-to-email. (`82f4ce6`)

### Domaine
- Bascule du domaine canonique sur **`geraldpameole.vercel.app`** (config, RSS, canonical, sitemap, robots, Plausible). (`25b47fd`)

## 2026-05-26 → 2026-05-27 — Sortie WebGL du chemin critique + optimisations

### Performance Three.js
- `import('three')` dynamique sur `requestIdleCallback`, hors du chemin critique.
- Pause hors-vue (`IntersectionObserver`) et onglet caché (`visibilitychange`).
- Framerate plafonné à ~30 fps.
- Allègement scène : pixelRatio 2 → 1.5, ~230 draw calls économisés par frame (constellations inactives en `visible=false`, fusion des 90 nœuds en un seul `Points`, sphères 32→16 segments, étoiles 3000 → 1800, etc.).
- Cache des dimensions du canvas pour éviter le *forced reflow*.
- Découpage de l'init de scène en tâches courtes (réduit TBT et long tasks).

### Polices
- Chargement non bloquant via `<link media="print" onload>` (fini le render-blocking de 220ms). (`b895f2e`)

### Accessibilité
- Premier passage : saut de titre h4→h3 + token `--text-3` bumpé à `#94a3b8` pour AA. (`1729b61`)

### Outillage
- `CLAUDE.md` (instructions assistants IA), ESLint flat config + plugin Astro, allowlist Claude. (`0bcb55f`, `a5f1e6a`)

## 2026-05-23 → 2026-05-26 — Refonte hero & contenu

- Refonte hero alignée sur le CV PDF, fond Three.js interactif.
- Page CV imprimable (Save as PDF via navigateur).
- 17 constellations, 9 planètes (Mercure → Pluton), Lune, orbites visualisées.
- Voie lactée en fond, nébuleuses synchronisées.
- Étiquettes flottantes (pills) sur les objets célestes.
- Identité "Pilote d'activité & Expert en digitalisation" harmonisée.

## Antérieur

Historique blog/livres, structure initiale du portfolio Astro. Voir `git log --oneline` pour le détail complet.

---

## Convention de commit

Les commits suivent **Conventional Commits** en français :

```
<type>(<scope optionnel>): <résumé impératif>

<description longue optionnelle>

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>  (si IA-assisté)
```

Types utilisés : `feat`, `fix`, `perf`, `a11y`, `refactor`, `chore`, `docs`, `style`.
