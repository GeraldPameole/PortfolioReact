# Arborescence (Sitemap)

> Hiérarchie des pages du site. Source : `src/pages/`. Pages dynamiques générées au build via les collections Astro.

## Vue d'ensemble

```
geraldpameole.vercel.app/
│
├── /                              Accueil
│   ├── Hero (fond WebGL Three.js)
│   ├── Services (3 cartes)
│   ├── Articles récents (grille)
│   ├── Newsletter (NewsletterBand)
│   └── CTA Collaboration
│
├── /about                         À propos
├── /skills                        Compétences (catégories, outils, certifications)
├── /cv                            CV (?print=1 pour version imprimable)
├── /contact                       Contact (formulaire Formspree)
├── /domaines                      Domaines d'expertise
├── /themes                        Thèmes
│
├── /projets                       Liste des projets
│   └── /projets/[slug]            Détail d'un projet
│
├── /livres                        Bibliothèque (sélection commentée)
│   └── /livres/[slug]             Détail d'un livre
│
├── /books/[slug]                  (Variante anglophone détail livre)
│
├── /blog                          Liste des articles (paginée)
│   ├── /blog/[slug]               Article détaillé
│   ├── /blog/[keyword]            Articles filtrés par mot-clé/tag
│   ├── /blog/themes               Toutes les thématiques
│   └── /blog/themes/[theme]       Articles d'une thématique
│
├── /mentions-legales              Mentions légales
├── /404                           Page d'erreur 404
│
├── /rss.xml                       Flux RSS enrichi (contenu complet)
├── /sitemap-index.xml             Sitemap (auto-généré)
└── /robots.txt                    Directives crawler
```

## Routes dynamiques

| Route | Source | Pages générées |
|---|---|---|
| `/blog/[...slug]` | Collection `articles` | ~95 |
| `/blog/themes/[theme]` | Liste distincte des `domain` d'articles | ~15 |
| `/blog/[keyword]` | Mots-clés / tags | variable |
| `/projets/[...slug]` | Collection `work` | quelques |
| `/livres/[slug]`, `/books/[slug]` | Collection `books` | ~10-15 |

## Composants partagés (en-tête / pied)

- **Header** (nav) : Accueil · Projets · Articles · Compétences · Livres · À propos · Contact · LinkedIn · GitHub
- **Footer** : tagline + Navigation + Contact + **Mini-formulaire newsletter** + mentions légales + tech stack

## Profondeur

3 niveaux maxi : Section → Liste → Détail. Pas de sous-rubriques imbriquées au-delà.

## Volumétrie au build

**249 pages HTML** générées (au 28 mai 2026).
