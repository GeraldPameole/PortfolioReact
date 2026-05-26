# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

Portfolio + blog de Gérald Paméole — **Astro 4 en build statique** (pas d'adaptateur SSR), déployé sur `geraldpameole.fr`. Intégrations : Tailwind, MDX, React, RSS, sitemap.

Le contenu et l'UI sont **en français** — rédige commentaires, textes et messages de commit en français.

## Commandes

- `npm run dev` — serveur de dev sur **http://localhost:3000** (port 3000 forcé dans `astro.config.mjs`, `host: true`), **pas** le 4321 par défaut d'Astro.
- `npm run build` — génère `dist/` (~249 pages).
- `npm run preview` — sert le build (port 4321 par défaut, car le bloc `server` ne s'applique qu'au dev).

Pas de lint ni de tests configurés.

## Contenu (collections Astro)

Les schémas Zod sont dans `src/content/config.ts` — collections `articles` et `books`.

- Tout article/livre **doit** respecter son schéma, dont le discriminant `type: "article"` ou `type: "book"`. Champs requis article : `title`, `description`, `type`, `publishDate` ; livre : `title`, `description`, `type`, `author`, `profession`.
- Les articles sont rangés par domaine : `src/content/articles/<domaine>/<slug>.md` (ex. `developpement-web/`, `gestion-projet/`). Garde cette arborescence pour un nouvel article.

## Style & design

- Les **design tokens** (couleurs, polices) vivent dans `src/styles/global.css` sous forme de variables CSS : `--bg-*`, `--font-sans` (Space Grotesk), `--font-body` (Inter), `--font-mono` (JetBrains Mono). Utilise ces variables, ne code pas les couleurs/polices en dur.
- **Polices (perf)** : chargées en non-bloquant dans `src/layouts/BaseLayout.astro` (`<link media="print" onload="this.media='all'">`). Ne **jamais** réintroduire un `@import` Google Fonts dans `global.css` — ça rechaîne la requête derrière le CSS et bloque le rendu.

## Git

Commits *conventional commits* en français : `feat:`, `fix:`, `chore:`, `refactor:` (voir l'historique). Branche par défaut : `main`.
