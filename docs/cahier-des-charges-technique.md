# Cahier des charges technique

> Description du **comment** : stack, architecture, contraintes de performance / accessibilité / sécurité, intégrations, conventions de code, déploiement.

## 1. Architecture

- **Type** : site statique (SSG — Static Site Generation).
- **Build** : 249 pages générées (~95 articles, ~10 pages dynamiques, livres, projets, thématiques).
- **Hébergement** : Vercel (free tier, edge CDN global, Brotli, cache immuable sur les assets hashés).
- **Source** : GitHub `GeraldPameole/PortfolioReact` (branche `main`, déploiement automatique sur push).
- **Domaine actuel** : `geraldpameole.vercel.app` (custom à brancher plus tard).
- **Adaptateur SSR** : aucun (build 100 % statique).

```
┌──────────────────────────┐
│ GitHub (source)          │
└──────────┬───────────────┘
           │ push main
           ▼
┌──────────────────────────┐
│ Vercel CI                │  npm install → npm run build
│ - astro build (~60s)     │
└──────────┬───────────────┘
           │ déploiement
           ▼
┌──────────────────────────┐
│ Vercel Edge CDN          │
│ - HTML/CSS/JS (immutable)│
│ - Brotli compression     │
└──────────┬───────────────┘
           │
           ▼ visiteur
       Navigateur
```

## 2. Stack technique

| Couche | Techno | Version |
|---|---|---|
| Framework | **Astro** | 4.16 |
| Styling | **Tailwind CSS** | 3.4 |
| Langage | **TypeScript** | 5.3 (config permissive — `astro/tsconfigs/base`) |
| Composants riches | **MDX**, **React 18** | (React utilisé ponctuellement) |
| Fond 3D | **Three.js** | 0.162 (auto-hébergé via npm, dynamique sur idle) |
| RSS enrichi | **markdown-it**, **sanitize-html** | rendu HTML complet du flux |
| Lint | **ESLint 10** flat config | + `eslint-plugin-astro` |
| Type-check | **`@astrojs/check`** | `npm test` |
| Optimisation images | **sharp** | scripts de recompression |
| Analytics | **Plausible** | privacy-first (data-domain `geraldpameole.vercel.app`) |
| Newsletter | **Buttondown** (embed-subscribe) | username `Apex_971` |
| Formulaire contact | **Formspree** | form ID `mgvklqra` |

## 3. Arborescence du repo

```
/
├── astro.config.mjs        # config Astro (site, intégrations, port dev = 3000)
├── tsconfig.json           # extends astro/tsconfigs/base + permissif
├── eslint.config.js        # flat config, ignore scripts/, dist/, .astro/
├── CLAUDE.md               # instructions assistants IA
├── package.json            # scripts : dev / build / preview / lint / test / check
├── docs/                   # cahiers des charges, chartes, backlog (ce dossier)
├── public/                 # assets statiques (favicons, robots.txt, images)
│   ├── images/themes/      # bannières par thématique (1280px max, WebP/JPG)
│   ├── assets/             # profil, projets, livres
│   └── robots.txt
├── src/
│   ├── pages/              # routes (file-based)
│   │   ├── index.astro     # accueil
│   │   ├── blog.astro      # liste articles
│   │   ├── blog/[...slug].astro  # article détail
│   │   ├── blog/themes.astro     # par thèmes
│   │   ├── blog/themes/[theme].astro
│   │   ├── blog/[keyword].astro
│   │   ├── projets.astro / projets/[...slug].astro
│   │   ├── livres.astro / livres/[...slug].astro / books/[...slug].astro
│   │   ├── about.astro, skills.astro, contact.astro, cv.astro
│   │   ├── themes.astro, domaines.astro
│   │   ├── mentions-legales.astro, 404.astro
│   │   └── rss.xml.ts      # flux RSS enrichi (markdown-it + sanitize-html)
│   ├── layouts/BaseLayout.astro   # layout principal (head, footer, etc.)
│   ├── components/         # composants (Hero, NewsletterBand, Footer, ArticleCard…)
│   ├── content/            # collections Astro (articles, books)
│   │   ├── config.ts       # schémas Zod
│   │   └── articles/<domaine>/<slug>.md
│   ├── styles/global.css   # design tokens + CSS global
│   ├── scripts/            # scripts utilitaires (non TS-checkés)
│   ├── utils/              # helpers (themeUtils, etc.)
│   ├── config/             # featured-articles, etc.
│   └── lib/                # (anciennes libs, nettoyées)
└── dist/                   # généré par npm run build (gitignored)
```

## 4. Contenu — collections Astro

Définies dans `src/content/config.ts` avec Zod.

### Collection `articles`
```ts
type: "article"            // discriminant obligatoire
title: string              // requis
description: string        // requis
publishDate: string        // requis (ISO ou YYYY-MM-DD)
tags?: string[]
domain?: string
image?: string             // chemin /images/themes/X.webp typiquement
readingTime?: number
featured?: boolean
keywords?: string[]
pillColor?: string
relatedArticles?: any[]
```

### Collection `books`
```ts
type: "book"               // discriminant obligatoire
title: string              // requis
description: string        // requis
author: string             // requis
profession: string         // requis
coverImage?: string
publishYear?: number
note?: number              // 0-5
amazonLink?: string
category?: string
relatedContent?: { title; url; type? }[]
```

⚠️ Le **build échoue** si un article/livre ne respecte pas son schéma. C'est la première ligne de défense de la qualité du contenu.

## 5. Performance — KPI cibles

Mesures de référence : DevTools (GPU réel), preset Desktop, build de prod.

| Métrique | Cible | Actuel |
|---|---|---|
| **FCP** | < 1.5 s | 0,3 s ✅ |
| **LCP** | < 2.5 s | 0,6 s ✅ |
| **CLS** | < 0,1 | 0,006 ✅ |
| **TBT** | < 600 ms | 440 ms ✅ |
| **Speed Index** | < 3 s | 1,7 s ✅ |
| **Score perf desktop** | ≥ 75 | 78 ✅ |
| Payload initial (Brotli) | < 100 KiB | ~36 KiB ✅ |
| Render-blocking | 0 | 0 ✅ |
| Three.js chunk (Brotli) | n/a (lazy) | 179 KiB (immuable, hors chemin critique) |

### Optimisations en place
- Polices Google : `media="print"` + `onload` (non bloquant).
- Three.js : auto-hébergé via `npm`, `import('three')` dynamique sur `requestIdleCallback`, pausé hors-vue (`IntersectionObserver`) et onglet caché (`visibilitychange`), framerate plafonné à ~30 fps, scène allégée mobile (`innerWidth < 768` → moins d'étoiles/particules + `pixelRatio: 1`), respect de `prefers-reduced-motion`.
- Images : recompressées (≤1280px, q72-74, WebP/JPG), `loading="lazy"` sur les grilles, `fetchpriority="high"` sur les images LCP des pages détail.
- CSS : minifié, purgé Tailwind.
- JS : minifié, code-split.
- Cache : `public, max-age=31536000, immutable` sur `/_astro/*` (assets hashés).

## 6. Accessibilité — WCAG AA visé

- **Contraste** : tous les tokens texte ≥ 4.5:1 sur fond sombre (`--text-3: #94a3b8`, `--text-4: #7e8da4`).
- **Ordre des titres** : séquentiel sur toutes les pages (pas de saut h1→h3, pas de page sans h1).
- **Navigation clavier** : focus visibles, `aria-label` sur les boutons icônes.
- **Réduction du mouvement** : si `prefers-reduced-motion: reduce`, le fond WebGL ne se charge pas.
- **Images** : `alt` significatif, `loading="lazy"` sur les hors-écran, `decoding="async"`.
- **Sémantique** : `<main>`, `<article>`, `<nav>`, `<footer>` correctement structurés.

## 7. SEO

- **Sitemap** auto via `@astrojs/sitemap`, référencé dans `robots.txt`.
- **Canonical URL** sur chaque page (via `BaseLayout`).
- **Open Graph** + **Twitter Card** sur toutes les pages.
- **JSON-LD** : `Person` schema sur toutes les pages + schemas custom sur les articles.
- **Flux RSS** : `<link rel="alternate" type="application/rss+xml">` dans le head.
- **Frontmatter** : `description` < 160 chars utilisé en meta description.

## 8. Sécurité

- **HTTPS** obligatoire (Vercel).
- **Pas de secrets** dans le repo. Les IDs Formspree / Buttondown / Plausible sont publics (visibles dans le HTML, c'est leur design).
- **CSP** : pas encore configurée (chantier d'évolution).
- **Headers** : par défaut Vercel.
- **Dépendances** : `npm audit` exécutée à chaque install ; remontées surveillées.
- **RGPD** : Plausible (no-cookie, conforme), Formspree/Buttondown explicitement nommés en mentions légales.

## 9. Intégrations externes (récap)

| Service | Rôle | Identifiant public |
|---|---|---|
| **Vercel** | Hébergement + CI | projet `geraldpameole` |
| **GitHub** | Source + auto-deploy webhook | `GeraldPameole/PortfolioReact` |
| **Formspree** | Endpoint formulaire contact | form `mgvklqra` |
| **Buttondown** | Liste newsletter + RSS-to-email | user `Apex_971` |
| **Plausible** | Analytics privacy-first | site `geraldpameole.vercel.app` |
| **Google Fonts** | Webfonts | Space Grotesk, Inter, JetBrains Mono |

## 10. Standards code & workflow

- **Branche unique** : `main` (solo dev). Déploiement automatique sur push.
- **Commits** : *Conventional Commits* en français — `feat:`, `fix:`, `perf:`, `refactor:`, `chore:`, `docs:`, `a11y:`, `style:`.
- **Lint** : `npm run lint` (ESLint 10 flat config + `eslint-plugin-astro`). Ignoré : `dist/`, `.astro/`, `node_modules/`, `scripts/`.
- **Types** : `npm test` / `npm run check` (= `astro check`). Baseline actuelle : 0 erreur, 24 hints (TS legacy non bloquants).
- **CI** : Vercel (`npm install && npm run build`).

## 11. Maintenance & évolution

- **Mises à jour deps** : `npm outdated` régulièrement (mensuel) ; vigilance sur Astro (mineur OK, majeur = chantier dédié).
- **Astro 5** : migration prévue (chantier dédié, breaking changes : Content Collections, ViewTransitions).
- **Refactor WebGL** : extraction en modules (`src/scripts/three-bg/`).
- **CMS / DB** : Keystatic ou headless CMS si évolution de l'édition.
- **Documentation** : ce dossier `docs/` + `CLAUDE.md` pour les assistants IA.

## 12. Critères de qualité (gates)

| Gate | Critère | Bloque le déploiement ? |
|---|---|---|
| `npm run build` réussit | erreur Astro = blocage | ✅ oui (CI Vercel échoue) |
| Schéma Zod valide | erreur de frontmatter = build cassé | ✅ oui |
| `npm test` | 0 erreur | ⛔ non bloquant (info) |
| `npm run lint` | 0 erreur (warnings tolérés) | ⛔ non bloquant |
| Lighthouse Perf desktop | ≥ 75 | ⛔ non (monitoring manuel) |
| Lighthouse A11y | ≥ 95 | ⛔ non |

## 13. Conventions de naming

- **Fichiers** : kebab-case (`mon-article.md`, `BlogCard.astro` exception pour les composants en PascalCase).
- **Branches** : pas applicable (mono-branche `main`).
- **Tokens CSS** : `--<groupe>-<niveau>` (ex. `--text-3`, `--bg-1`, `--violet`).
- **Composants** : PascalCase (`NewsletterBand`, `Hero`, `Footer`).
- **Utilitaires JS/TS** : camelCase (`themeUtils.ts`, `getFeaturedArticlesForDomain`).
