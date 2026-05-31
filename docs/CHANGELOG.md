# Changelog

> Historique des évolutions du site, dérivé du `git log`. Format inspiré de [Keep a Changelog](https://keepachangelog.com/).
> Type des commits : `feat` (nouvelle fonctionnalité), `fix` (correctif), `perf` (performance), `a11y` (accessibilité), `refactor`, `chore` (outillage), `docs`, `style`.

## 2026-06-01 — Sprint 2 : expertise terrain complète + 5 articles étoffés

### Ajouté

- **Sprint 2A — 7 retours d'expérience terrain injectés** dans les articles qui en manquaient. Couverture expertise : 90 % → **99 %** (91/92 articles). Le seul article résiduel sans expertise est `outils-techniques/pillcolor-guide.md`, légitimement (article méta sur le système de pill colors du site). Injections : `react-performance-2026` (ACTIV PARTNERS 8 sites WordPress + 40 % visibilité), `gestion-talents-zen` (KEOS 17 mainteneurs + astreintes), `formation-leadership` (SFR Superviseur 50 programmes), `management-diversite-inclusion` (KEOS multi-sites + plomberie inclusive), `marketing-content-strategies` (ACTIV PARTNERS mapping parcours acheteur), `gestion-stress-performance` (KEOS NOC/Terrain/Direction 98,7 %), `gestion-surcharge-informationnelle` (KEOS 15 KPIs hiérarchisés).
- **Sprint 2B+2C — 5 articles courts étoffés** (611-679 → 1100-1333 mots) :
  - `web-javascript-modern` : `||=`/`&&=`/`??=`, top-level await, `Object.hasOwn()`, array immuable (`toSorted`/`toReversed`/`with`), décorateurs TS 5.x, ES Modules patterns. Retour ACTIV PARTNERS : "30 % de lignes en moins, -40 % bugs undefined".
  - `transformation-numerique-entreprise` : cartographier avant l'appel d'offres, méthode en 4 phases, KPIs transformation. Retour KEOS FTTB (15 KPIs, 17 mainteneurs, MTTR -25 %).
  - `gestion-priorites-efficacite` : matrice Eisenhower détaillée (+ **nouveau SVG matrice remplie**), MoSCoW/ICE/RICE, règle des 3 priorités/jour, retour KEOS pilotage production.
  - `strategies-reseaux-sociaux-entreprises` : grille par objectif, spécificités plateformes 2026 (LinkedIn algo, TikTok, Threads/Bluesky), retour ACTIV PARTNERS sur les 8 refontes.
  - `gestion-qualite-certification` : 5 phases d'obtention ISO 9001 (état des lieux → audit AFNOR/Bureau Veritas/Apave/SGS/DEKRA), durée 9-12 mois, coût 8-25 k€, retour SFR qualité formateur (12 processus, +15 pts NPS), mention ISO 27001 et ISO 14001 + CSRD.

### Métriques

- **Corpus** : 92 articles (stable).
- **Mots / article moyenne** : 942 → **1 013** (+8 %).
- **Articles < 700 mots** : 8 → **2** (vs 8 le 31 mai matin).
- **Couverture expertise** : 90 % → **99 %**.

## 2026-05-31 (soir) — Sprint 1 + Sprint 3 : tags complets, PWA modernisé, anomalies résolues, service-client étoffé

### Ajouté

- **Sprint 1 — Tags complets** (47 articles taggés en 2 batches parallèles A+B). Couverture `tags:` 49 % → **100 %** (92/92). RSS sert désormais **364 `<category>`** sur 92 articles (~4 tags/article moyens) → Buffer aura ~4 hashtags suggérés par post LinkedIn auto-généré.
- **Sprint 3B — PWA modernisé + renommé** : `progressive-web-apps-2024.md` → `progressive-web-apps-2026.md` (Option A retenue car article substantiel, 1500 mots, retour ACTIV PARTNERS, 2 SVG). Contenu actualisé (Workbox v7 stable, vite-plugin-pwa, iOS 16.4+ Web Push, Bubblewrap/TWA, taux conversion home-screen 2-5 %). **10ᵉ redirection 301** ajoutée à `vercel.json`. Liens internes mis à jour (`featured-articles.ts`, `eloquent-javascript.md`).
- **Sprint 3C — service-client étoffé avec matériau Relation Client SFR 2005-2009** :
  - `service-client-excellence.md` : ~700 → ~1180 mots, section "Ce que j'ai appris sur la fidélisation chez SFR" (churn -52 %, NPS +15, rétention 92 %), **nouveau SVG tunnel de rétention** (accent rose `#f472b6`).
  - `service-client-performance.md` : ~575 → ~1190 mots, section "KPIs qui comptent vraiment" (ARPU +12 %/an, LTV 950 €, +25 % efficacité ciblée), **nouveau SVG KPIs vanity vs actionnables**.

### Corrigé

- **Sprint 3A — Anomalie filesystem `formation-equipes-commerciales-complete 2.md`** : fichier avec espace dans le nom (artefact macOS Finder). Investigation : les 2 articles concernés étaient **légitimement distincts** (un article terrain "ce qui marche" + un plan structuré 12 mois). Renommage propre `formation-equipes-commerciales-complete.md` (sans espace) plutôt que suppression.

### Coordination

- **5 agents parallèles** sans chevauchement de fichiers. 3 cas de coordination réussie : agent 1B a adapté son tagging au renommage simultané de PWA par 3B ; agent 3B a préservé les tags de PWA ajoutés par 1B avant de réécrire le frontmatter ; agent 3C a vérifié les tags existants sur service-client avant édition.

## 2026-05-31 — Métier Relation Client, automatisation LinkedIn, refonte du corpus mi-2026

### Ajouté

- **5ᵉ métier "Relation Client Premium" (SFR 2005-2009)** : nouvelle fiche `src/content/work/customer-care-officer.md` avec 5 axes (croissance ARPU, portefeuille VIP, fidélisation, data CRM, veille marché) et leurs KPIs. Entrée correspondante dans le CV (`cv.astro` EXPERIENCES) en pied de timeline chronologique. Mapping domaine `relation-client` (rose `#f472b6`, icône 💎) dans `projets.astro` (`CAT_COLOR` + `DOMAIN_TO_CAT`). Tagline et récit `about.astro` mis à jour : "Quatre métiers" → **"Cinq métiers"**. Visuel cover `public/assets/svg/customer-care.svg` (5 tuiles axes en charte rose). (`3929ee2`)
- **RSS enrichi pour Buffer/LinkedIn auto-drafts** : champs `enclosure` (image article absolutisée → visuel du post LinkedIn, engagement ×3 vs lien nu), `categories` (tags → hashtags suggérés), `author` (attribution propre). Le champ `content` (HTML complet) reste pour RSS-to-email Buttondown. 95 enclosures + 95 authors + 45 categories vérifiés au build. (`eafb43f`)
- **Redirections 301 Vercel** (`vercel.json`) pour les 9 anciens slugs supprimés ou renommés (préserve le jus SEO Google et évite les 404 sur les bookmarks existants). Couverture : 4 fusions (frameworks JS, tendances web, 3 IA), 2 renommages (`react-performance-optimisation` → `…-2026`, `technologies-javascript-2024` → `…-2026`). (`9e8b8a2`)

### Modifié

- **Fond des fiches métier renforcé** (`projets/[...slug].astro`) — chaque fiche a désormais une signature visuelle par couleur de métier propagée via CSS custom props (`--accent` / `--accent-rgb`) :
  - Image héro : opacity 0.25 → **0.55** (+120%), saturation 0.6 → 1.05.
  - 2 orbs colorés dans l'accent au héro + 2 dans le corps (radial-gradient teinté).
  - Titres `h2` : border + barre underline en accent. `h3`/`em`/`code`/`.metric` en accent.
  - Sidebar blocks : gradient bg + border + barre top en accent. Pills tech/tag en accent.
  - Mapping : `relation-client` rose `#f472b6`, `developpement-commercial` orange `#fb923c`, `gestion-projet` bleu `#60a5fa`, `developpement-web` vert `#34d399`, `qualite-process` violet `#a78bfa`, `formation` ambre `#fbbf24`. (`3a2ebcf`)
- **Refonte du corpus articles mi-2026 — 7 chantiers en parallèle** (`f94b6ff`). Bilan : 95 → **92 articles** (densification : fusion de 7 doublons en 3 articles modernes, renommage de 2 articles `-2024` en `-2026`).
  1. `strategies-reseaux-sociaux-b2b.md` — nouvelle section "Algorithme LinkedIn 2025-2026" (lien sortant pénalisé / 1er commentaire, dwell time, 3-5 hashtags optimum, carrousel PDF portée ×3, vidéo native, creator badges, engagement 60 min critiques, 1200+ caractères = bonus, recyclage 3-4 sem toléré). Sources Buffer State of Social 2025, Hootsuite Social Trends 2026.
  2. `web-accessibilite-guide-pratique.md` — nouvelle section "Ce que change l'EAA (depuis juin 2025)" : périmètre obligatoire (e-commerce, banque, transport, audiovisuel), seuil microentreprise 10 salariés ET CA < 2 M€, sanctions jusqu'à 250 000 €, référentiels (RGAA 4.1 + EN 301 549 + WCAG 2.2 AA). WCAG 2.1 → **WCAG 2.2** (juin 2023, 9 nouveaux critères tactile/cognitif).
  3. `react-performance-optimisation.md` → **`react-performance-2026.md`** (git mv) — avertissement frontal "si vous écrivez encore useMemo/useCallback partout, vous travaillez contre l'outil". Sections React Compiler (auto-memoization, gain ~50% JS client), Stack 2026 (Next 15 + Compiler/Turbopack OU Vite 6 + plugin), Hooks React 19 (`useOptimistic`, `useActionState`, `useFormStatus`, `use()`, Actions, ref-as-prop, Document Metadata native), Server Components + PPR. Diagnostic enrichi (`react-scan`, INP remplace FID).
  4. `technologies-javascript-2024.md` → **`technologies-javascript-2026.md`** (git mv) — TS 5.7/5.8 + `--isolatedDeclarations` + TC39 décorateurs. Node 22 LTS + `--experimental-strip-types` (TS sans build). Bun 1.x stable (avec nuances). Vite 6 + Environment API. Stack 2026 actualisée.
  5. **Fusion 2→1** : `frameworks-javascript-analyse-2024.md` + `frameworks-javascript-comparaison-2024.md` → **`frameworks-javascript-2026.md`** — combine "adoption réelle" (State of JS 2024-2025, npm trends) + "méthode de choix objective". Couvre React 19+Compiler, Next 15, Astro 5, Svelte 5+SvelteKit, Solid/SolidStart, TanStack Start, Vue 3/Nuxt 4, Qwik (honnêtement niche), Remix → React Router v7. Section "Ce que vous pouvez ignorer sans remords".
  6. **Fusion 2→1** : `web-tendances-2025.md` + `tendances-developpement-web-2025.md` → **`tendances-web-2026.md`** — état web mi-2026 : RSC mainstream, React Compiler stable, edge computing (Vercel/CF Workers + D1/Hyperdrive), Astro 5 Server Islands, View Transitions (retard Safari), AI-assisted dev (Cursor/Claude Code/Windsurf/Copilot Workspace), CSS moderne (Container Queries, `:has()`, Subgrid, Popover, Anchor Positioning), impact AEO/SGE.
  7. **Restructuration 3→2** : `ia-transformation-societe-2024-analyse.md` + `ia-transformation-societe-2024.md` + `intelligence-artificielle-transformation-marketing.md` → **`ia-workflows-pro-2026.md`** + **`ia-marketing-2026.md`** — article 1 : ère des agents (Operator/Claude Agent SDK/Manus), MCP standard de facto, coding agents (Claude Code/Cursor/Windsurf/Devin), orchestration LLM + outils. Article 2 : effondrement SEO informationnel (Google AI Overviews, Perplexity), AEO, contenu IA détectable et pénalisé, attribution cassée par LLMs, Claude Sonnet 4.6 / Opus 4.7 / Haiku 4.5, chute prix inférence ~10× depuis 2023.

### Cohérence

- **5 fichiers livre auto-corrigés** par les agents (liens internes vers les nouveaux slugs) : `clean-code.md`, `eloquent-javascript.md`, `lean-startup.md`, `zero-to-one.md`, `src/config/featured-articles.ts`.
- **0 référence orpheline** aux 9 anciens slugs dans `src/` (vérifié `rg`).
- **Charte SVG respectée** sur tous les nouveaux blocs : viewBox 700×320/360, palette charte (`#0a0f2e`, `#915EFF`, `#00cffd`, `#86efac`, `#fb923c`, `#fbbf24`), **0 ligne blanche** dans les blocs `<svg>…</svg>` (CommonMark fermerait le bloc HTML sinon).

### Métriques

- **Articles** : 95 → 92 (−3 doublons nets).
- **Pages buildées** : 250 → **262** (+12, nouvelles routes incluses).
- **Métiers** : 4 → **5** (Relation Client Premium ajouté).
- **Fiches métier** : 5 → **6** (`/projets/customer-care-officer/`).

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
