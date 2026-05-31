# État du projet — Portfolio React + Blog

> **Dernière mise à jour** : 1ᵉʳ juin 2026 (post Sprint 1+3+2)
> **Branche** : `main`
> **Production** : <https://geraldpameole.vercel.app/>

## 📊 Snapshot en chiffres

| Élément | Valeur |
|---|---|
| Articles publiés | **92** (corpus densifié — 7 doublons fusionnés mi-2026) |
| **Mots / article — moyenne** | **1 013** (corpus total : ~ 93 200 mots) |
| **Couverture `tags:` (RSS categories)** | **100 %** (92/92 articles) |
| **Expertise terrain détectée** | **99 %** (91/92 — `pillcolor-guide` légitimement sans) |
| Fiches métier | **6** (Relation client premium, Dev commercial, Formation, Qualité/Process, Dev web, Pilotage projet) |
| Pages buildées | **262** |
| Domaines blog | 15 |
| Livres en bibliothèque | 4 (`clean-code`, `eloquent-javascript`, `lean-startup`, `zero-to-one`) |
| Redirections 301 (`vercel.json`) | **10** |
| Erreurs TS (`npm test`) | **0** |
| Build (`npm run build`) | **OK** — ~33-48 s |
| Stack | Astro 4 (static) + Tailwind + MDX + React + Three.js |

## ✅ Travaux complétés

### Contenu

- **95 → 92 articles** : 7 doublons fusionnés en 3 articles modernes (frameworks JS 2026, tendances web 2026, IA workflows pro + IA marketing 2026).
- **9 anciens slugs `-2024`/`-2025`** redirigés en 301 via `vercel.json` (préserve SEO + évite 404 bookmarks).
- **2 articles renommés** via `git mv` (historique préservé) : `react-performance-2026`, `technologies-javascript-2026`.
- **SVG dans les articles** : 2 à 4 SVG par article, charte respectée (viewBox 700×320/360, palette `#0a0f2e`/`#915EFF`/`#00cffd`/`#86efac`/`#fb923c`/`#fbbf24`/`#ef4444`, polices monospace+sans-serif). **0 ligne blanche** dans les blocs `<svg>…</svg>` (règle CommonMark critique documentée dans CLAUDE.md).

### Métiers et CV

- **5ᵉ métier** ajouté : **Chargé de Développement Commercial — Relation Client Premium** (SFR, 2005-2009). Couleur dédiée : rose `#f472b6` (💎). Cinq axes documentés : croissance ARPU, portefeuille VIP, fidélisation, data CRM, veille marché.
- **Tagline `about`** : "Vingt ans. Cinq métiers. Une signature."
- **Fond des fiches métier** renforcé : chaque fiche a une signature visuelle propre via CSS custom props (orbs, gradients, accents) — voir [docs/CHANGELOG.md](docs/CHANGELOG.md) entrée 2026-05-31.

### Performance

- Three.js : version allégée mobile, 30 fps cap, IntersectionObserver pause, dynamic import same-origin.
- Polices : non-bloquantes (`<link media="print" onload="this.media='all'">`).
- Images : recompression `public/assets` (23 Mo → 6,1 Mo, −74%) + thèmes (4,3 Mo → 1,13 Mo, −74%) + lazy-loading + `decoding="async"`.

### Newsletter & RSS

- **Buttondown** actif sur home, `/blog` et footer (compte `Apex_971`, `tag=footer`).
- **RSS** (`/rss.xml`) enrichi pour Buffer/LinkedIn auto-drafts : `enclosure` (image article), `categories` (tags → hashtags), `author`, plus le `content` HTML complet pour RSS-to-email.

### Accessibilité & qualité

- **`npm test`** : 0 erreur TS (vs 45 baseline).
- **A11y** : ordres de titres corrigés sur 9 pages, contraste `--text-4` bumpé à `#7e8da4` (AA ~5:1).
- **Article accessibilité** mis à jour : EAA (28 juin 2025), WCAG 2.2 (juin 2023), RGAA 4.1, EN 301 549.

## 🔄 En cours / Prochaines étapes prévisibles

- **Lancement publication LinkedIn** via Buffer (RSS → 2 posts/sem mardi+jeudi 9h Europe/Paris) — premier post planifié mardi 2 juin sur `strategies-reseaux-sociaux-b2b`. Workflow hybride : Buffer crée des drafts, validation manuelle, lien en premier commentaire. Backlog 92 articles → vidé en ~11 mois à 2/sem, ou ~22 mois à 1/sem.
- **Vérifier `gestion-projet-agile.md` vs `gestion-projet-agile-meilleures-pratiques.md`** : possible doublon thématique à fusionner ou différencier explicitement.
- **Étoffer `productivite-professionnelle.md`** (694 mots) — c'est l'article qui doit porter le ton "2026" du domaine productivité.
- **Étoffer les domaines à 1 article** : `gestion-connaissances`, `reconversion-carriere` — matériau Gérald disponible.
- **Étoffer `developpement-commercial`** (2 articles) : pont naturel avec le 5e métier Relation Client SFR — article potentiel "Développer un portefeuille premium : la méthode SFR appliquée aujourd'hui".
- **Re-générer ETAT_PROJET.md à chaque session de travail majeure** (cf. ce fichier).

## 📚 Rapports liés

| Fichier | Rôle |
|---|---|
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | Historique chronologique des évolutions (dérivé du `git log`, format Keep a Changelog) |
| [RAPPORT_AUDIT_ARTICLES.md](RAPPORT_AUDIT_ARTICLES.md) | Audit corpus articles (répartition domaines, slugs, état mi-2026) |
| [docs/cahier-des-charges-fonctionnel.md](docs/cahier-des-charges-fonctionnel.md) | Spécifications fonctionnelles |
| [docs/cahier-des-charges-technique.md](docs/cahier-des-charges-technique.md) | Spécifications techniques |
| [docs/charte-graphique.md](docs/charte-graphique.md) | Palette, typographie, charte SVG des articles |
| [docs/charte-editoriale.md](docs/charte-editoriale.md) | Ton de voix, structure des articles, signature Gérald |
| [docs/checklist-livraison.md](docs/checklist-livraison.md) | QA avant push |
| [docs/sauvegarde-restauration.md](docs/sauvegarde-restauration.md) | Procédure backup/restore |
| [CLAUDE.md](CLAUDE.md) | Guide d'instructions Claude Code (règles projet) |

## 📁 Rapports historiques (obsolètes, conservés pour mémoire)

Les fichiers `RAPPORT_*` à la racine sont des snapshots de chantiers passés (complétion placeholders, audit métadonnées, etc.) — leur état chiffré ne reflète plus le corpus actuel ; voir le CHANGELOG ou ce fichier pour l'état à jour.
