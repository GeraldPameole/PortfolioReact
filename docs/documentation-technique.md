# Documentation technique (opérations & maintenance)

> Référence pour la maintenance, le débogage et les évolutions. Cible : tout dev (toi-même dans 6 mois, un assistant IA, un futur collaborateur).

## 1. Démarrer sur la machine

### Pré-requis
- Node.js ≥ 20 (testé sous Node 22).
- npm ≥ 10.
- Compte GitHub avec accès au repo `GeraldPameole/PortfolioReact`.
- (Optionnel) Compte Vercel pour suivre les déploiements.

### Installation
```bash
git clone https://github.com/GeraldPameole/PortfolioReact.git
cd PortfolioReact
npm install
npm run dev        # http://localhost:3000
```

### Scripts npm
| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de dev (port 3000), HMR |
| `npm run build` | Build de prod (génère `dist/`, ~60 s) |
| `npm run preview` | Sert le build (port 4321 par défaut) |
| `npm run lint` | ESLint sur le projet (sauf `scripts/`) |
| `npm test` / `npm run check` | `astro check` (types + schémas + templates) |

## 2. Stack et architecture

Voir `docs/cahier-des-charges-technique.md`.

## 3. Déploiement

### Pipeline
1. Push sur `main` → webhook GitHub → Vercel.
2. Vercel exécute `npm install && npm run build`.
3. Si succès → mise en ligne sur `geraldpameole.vercel.app` (~1-3 min total).
4. Si échec → email d'alerte Vercel.

### Rollback
- Dashboard Vercel → projet → **Deployments** → clic sur un déploiement précédent → **Promote to Production**.
- Ou en CLI Vercel : `vercel rollback`.

### Forcer un re-déploiement
- Push d'un commit vide : `git commit --allow-empty -m "chore: trigger redeploy" && git push`.
- Ou via dashboard Vercel : *Redeploy*.

## 4. Variables d'environnement

**Actuellement aucune** (toutes les valeurs sont publiques et hardcodées dans le code) :
- Buttondown username `Apex_971` → `NewsletterBand.astro`, `Footer.astro`.
- Formspree ID `mgvklqra` → `contact.astro`.
- Plausible domaine `geraldpameole.vercel.app` → `BaseLayout.astro`.

Si un jour besoin d'env vars : créer un `.env` (gitignored) et utiliser `import.meta.env.PUBLIC_X` côté Astro. Reproduire dans Vercel : Settings → Environment Variables.

## 5. Intégrations — où, comment

### Buttondown (newsletter)
- **Composants** : `src/components/NewsletterBand.astro` (bande complète), `src/components/Footer.astro` (mini-form).
- **Endpoint** : `https://buttondown.com/api/emails/embed-subscribe/Apex_971`.
- **Méthode** : `fetch(action, { method: 'POST', mode: 'no-cors', body: FormData })` + état "Inscrit ✓" optimiste.
- **Tag** : champ caché `tag` (= `newsletter-band`, `footer`, `site-web`) pour distinguer la provenance.

**Configuration côté Buttondown** (à faire dans le dashboard) :
- Settings → **Automations / RSS** : ajouter `https://geraldpameole.vercel.app/rss.xml`, activer "send new RSS items as email".
- Settings → **Emails → Welcome email** : coller le texte de `docs/guide-utilisateur.md`.
- Settings → vérifier l'opt-in (double opt-in recommandé).

### Formspree (contact)
- Composant : `src/pages/contact.astro`.
- Endpoint : `https://formspree.io/f/mgvklqra`.
- Submission classique (form action) ou fetch JSON.

### Plausible (analytics)
- Inclus via script `defer` en fin de `<body>` (`BaseLayout.astro`).
- `data-domain="geraldpameole.vercel.app"` doit correspondre au site enregistré dans Plausible.
- Pas de cookies (no consent banner needed).

## 6. Contenu — workflows

### Ajouter un article
```bash
# 1. Créer le fichier dans le bon domaine
touch src/content/articles/leadership-management/mon-article.md
```
Frontmatter minimal :
```markdown
---
title: "Mon article"
description: "Description en moins de 160 caractères."
publishDate: "2026-MM-DD"
type: article
domain: "leadership-management"
tags: ["management"]
image: "/images/themes/management.webp"
readingTime: 8
---

## Mon contenu en Markdown
```

⚠️ **Règle critique pour les SVG inline** : pas de lignes vides à l'intérieur d'un bloc `<svg>...</svg>` ! Sinon le parseur Markdown casse le bloc HTML brut à la première ligne vide et tout ce qui suit (polylines, circles…) est strippé. (Bug rencontré le 28/05/26 sur 14 articles — voir `CHANGELOG.md`.)

### Modifier le schéma de contenu
- Édite `src/content/config.ts`.
- Le build échoue si un fichier existant ne respecte plus le schéma → on remarque vite.
- Ajoute des champs optionnels (`?`) par défaut pour éviter les ruptures.

## 7. Gestion des images

### Optimisation manuelle (gros lot)
Voir le script `_optimg.mjs` (utilisé ponctuellement, pas committé). Pattern :
```js
import sharp from 'sharp';
// resize ≤ 1280px + q72-74 webp/jpeg, overwrite in place
```

### Conventions
- **Bannières de thèmes** : `public/images/themes/<theme>.webp` (1280×768 max, ~80-130 Ko).
- **Profil/projets/livres** : `public/assets/<nom>.jpg|.webp` (1280px max).
- **Article banner** : référencer une image existante de `themes/` (mutualisation) plutôt qu'ajouter une nouvelle.

## 8. Performance — opérations

### Mesurer
1. **Lighthouse DevTools** (Chrome, navigation privée) sur `https://geraldpameole.vercel.app` (preset Desktop).
2. **PageSpeed Insights** : <https://pagespeed.web.dev/> (quota par jour sans clé API).
3. Eviter Lighthouse sur le serveur de dev (`npm run dev`) — sans valeur, sert du code non minifié + HMR.

### Cibles
Voir `docs/cahier-des-charges-technique.md` § Performance.

### Régressions courantes à surveiller
- Polices Google rajoutées en `@import` dans un CSS = bloque le rendu.
- `<img>` ajouté sans `loading="lazy"` (sauf LCP) ou `decoding="async"`.
- Three.js : ne pas re-rendre eager / sur tout le site.
- Images > 200 Ko en `public/` (passer par sharp).

## 9. Accessibilité — opérations

### Vérifier
- Lighthouse Accessibility (DevTools).
- Outil de validation HTML.
- Navigation clavier manuelle (Tab dans toutes les pages, vérifier focus visibles).
- Avec `prefers-reduced-motion` activé : pas de WebGL.

### Maintenir
- Ordre des titres séquentiel (h1→h2→h3, jamais de saut).
- Contraste ≥ 4.5:1 sur le texte normal.
- `alt` significatif sur les images, `aria-label` sur boutons icônes.

## 10. SEO — opérations

### À chaque article
- `title` 40-65 caractères.
- `description` 120-160 caractères, accrocheuse.
- Slug court et sémantique.
- Lien interne vers articles connexes.

### Pages
- Toutes ont OG + Twitter card via `BaseLayout`.
- Sitemap auto, pas d'action manuelle.
- Indexation Google : Search Console → vérifier le sitemap.

## 11. Sécurité — opérations

### Surveillance
- `npm audit` régulièrement (mensuel).
- Vercel signale les CVE.
- Pas de secret dans le repo (vérifier avant chaque commit).

### Dépendances majeures
- Avant d'upgrade : lire les release notes, tester en local, vérifier `npm run build && npm test`.
- Astro 4 → 5 = chantier dédié (breaking changes documentés).

## 12. Debug — recettes

### Le build échoue avec une erreur de schéma Zod
- Lire le message : il indique le fichier et le champ fautif.
- Corriger le frontmatter de l'article concerné.
- Re-build : `npm run build`.

### Une image n'apparaît pas dans le RSS
- Vérifier qu'elle est référencée en chemin absolu OU root-relative (`/images/...`).
- `src/pages/rss.xml.ts` absolutise `/images/...` → `https://geraldpameole.vercel.app/images/...`.

### Un SVG dans un article ne s'affiche pas (axes seuls)
- Voir § 6.1 ci-dessus : **lignes vides dans le bloc SVG** = parseur Markdown casse le bloc.
- Fix : compacter le SVG (script `_fix-svg.mjs` utilisé sur 14 articles).

### Le déploiement Vercel échoue
- Onglet **Deployments** → cliquer sur le déploiement échoué → lire les logs.
- Causes fréquentes : nouvelle erreur Astro (build cassé), package manquant, schéma de contenu changé.
- Tester `npm run build` localement.

### La newsletter ne reçoit pas mon test
- Vérifier la console navigateur → erreur lors du `fetch` ?
- Vérifier dans Buttondown → Subscribers que l'email est bien arrivé.
- Vérifier l'opt-in : si double opt-in actif, l'utilisateur doit confirmer son email.

## 13. Sauvegarde & restauration

Voir `docs/sauvegarde-restauration.md`.

## 14. Conventions de commit

Voir `CHANGELOG.md` § Convention.

## 15. Contacts / responsables

- **Auteur / mainteneur** : Gérald Paméole — gerald.pameole@gmail.com.
- **Hébergement** : Vercel (compte personnel).
- **Domaine** : Vercel (sous-domaine `vercel.app`) — pas de registrar externe pour le moment.
