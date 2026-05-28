# Cahier des charges fonctionnel

> Description du **quoi** : objectifs, audiences, périmètre fonctionnel, parcours utilisateur, contenus, critères d'acceptation.

## 1. Objet et contexte

Portfolio professionnel + blog de **Gérald Paméole**, *Pilote d'activité & Expert en digitalisation* (20 ans d'expérience en télécom, management et formation).

- **URL de production** : <https://geraldpameole.vercel.app>
- **Repo** : <https://github.com/GeraldPameole/PortfolioReact>
- **Site complémentaire** : <https://lescarnetsdup.vercel.app> (blog dédié aux sujets de formation, leadership, gestion de projet)


| # | Objectif | Indicateur |
|---|---|---|
| 1 | **Vitrine d'expertise** crédible (recruteurs, clients) | Pages projets/CV/À propos lisibles |
| 2 | **Acquisition** prospects via newsletter & contact | Abonnés Buttondown, messages Formspree |
| 3 | **Référencement organique** sur les sujets cœur | Trafic blog (mesuré Plausible) |
| 4 | **Différenciation** par l'identité visuelle | Mémorabilité (fond WebGL signature) |

## 3. Audiences

| Persona | Besoin | Page d'entrée typique |
|---|---|---|
| **Recruteur / DRH** | Évaluer un profil rapidement | Accueil, CV, À propos |
| **Client / prospect** | Comprendre l'offre de services | Accueil, Projets, Contact |
| **Pair / lecteur** | Consommer du contenu utile | Blog, article direct, newsletter |
| **Réseau LinkedIn** | Suivre l'actu | Blog, abonnement newsletter |

## 4. Périmètre fonctionnel

### 4.1 Pages publiques
- **Accueil** : hero + pitch + 3 services + articles récents + CTA + newsletter
- **Blog** : liste paginée des articles, filtre par thème
- **Article détaillé** : contenu Markdown, image en-tête, métadonnées, articles liés
- **Thèmes/domaines** : pages d'archive par thématique
- **Projets** : liste + page détail (description, technos, période)
- **Compétences** : groupes de compétences + outils + certifications
- **Livres** : sélection de livres recommandés + page détail
- **À propos** : parcours, signature, valeurs
- **Contact** : formulaire (Formspree) + email + LinkedIn
- **CV** : page imprimable (`/cv?print=1`)
- **Mentions légales**
- **404**

### 4.2 Fonctionnalités transverses
- **Recherche / filtres** (par thème, sur la liste blog).
- **Inscription newsletter** : formulaire compact (footer, site-wide) + bande complète (home et `/blog`), envoi vers Buttondown.
- **Partage social** : Open Graph + Twitter Card sur toutes les pages.
- **Flux RSS** (`/rss.xml`) : titres + contenu complet (pour RSS-to-email).
- **Sitemap** auto-généré.
- **Téléchargement du CV** (PDF généré côté impression via le navigateur).
- **Cycle nuit visible** : fond WebGL animé (planètes, constellations, nébuleuses), désactivé si `prefers-reduced-motion`.

### 4.3 Hors-périmètre actuel
- Pas de compte utilisateur, pas d'authentification.
- Pas de commentaires (volonté éditoriale : retours par email).
- Pas de panier / e-commerce.
- Pas de back-office d'édition (le contenu est en Markdown versionné dans Git).
- Pas de chat / messagerie en temps réel.

## 5. Parcours utilisateurs (high-level)

### 5.1 Découverte → abonnement
1. Visiteur arrive sur la home (recruteur via LinkedIn, lecteur via SEO).
2. Il consulte 1-2 articles dans la section "Articles récents".
3. Il voit la bande newsletter (home + footer).
4. Il s'inscrit → l'email arrive dans Buttondown → email de bienvenue.
5. Chaque semaine : un nouvel article publié → envoi automatique via Buttondown RSS-to-email.

### 5.2 Prospect → contact
1. Visiteur arrive (souvent depuis recherche pro).
2. Il parcourt Projets, Compétences, CV.
3. Il clique « Prendre contact ».
4. Il remplit le formulaire → message reçu via Formspree.
5. Gérald répond sous 24 h.

### 5.3 Lecture article
1. Lien direct (réseau social, newsletter, recherche).
2. Lecture (temps moyen, image, schémas SVG si présents).
3. CTA fin d'article : newsletter / autre article / contact.

## 6. Contenus éditoriaux

### 6.1 Articles (95 à ce jour)
- Format : Markdown avec frontmatter Zod (`src/content/articles/<domaine>/<slug>.md`).
- Champs obligatoires : `title`, `description`, `type: "article"`, `publishDate`.
- Champs optionnels : `tags`, `image`, `domain`, `readingTime`, `featured`, `keywords`, `pillColor`, `relatedArticles`.
- 15 domaines : développement web, formation, leadership-management, gestion-projet, gestion-talents, transformation-digitale, etc.
- Cadence cible : **1 article par semaine**.

### 6.2 Livres (collection `books`)
- Champs obligatoires : `title`, `description`, `type: "book"`, `author`, `profession`.
- Optionnels : `coverImage`, `publishYear`, `note`, `amazonLink`, `category`, `relatedContent`.

### 6.3 Projets, compétences, CV
- Données structurées dans `src/content/work/` et configurations dans `src/config/`.

## 7. Spécifications UX/UI (haut niveau)

- **Identité visuelle** : sombre "futuriste" — palette violet (`#915EFF`) / cyan (`#00CFFD`) sur fond bleu nuit (`#050816`).
- **Typographies** : Space Grotesk (sans serif, titres), Inter (corps), JetBrains Mono (mono).
- **Composants signature** : cards en glassmorphism, gradients, fond WebGL 3D animé, badges flottants.
- **Mobile-first** responsive (breakpoints à 640/768/900px).
- **Accessibilité visée** : WCAG AA (contraste 4.5:1, navigation clavier, focus visibles, `prefers-reduced-motion`).

## 8. Critères d'acceptation fonctionnels

| Critère | Cible |
|---|---|
| Pages accessibles 24/7 | ≥ 99,9 % (Vercel) |
| Newsletter : inscription → apparition dans Buttondown | < 30 s |
| Newsletter : nouvel article → envoi auto | dans l'heure suivant la publication |
| Formulaire de contact : message livré | < 1 min (Formspree) |
| Rendu correct mobile (< 768px) | iOS Safari + Chrome Android |
| Rendu correct desktop (≥ 768px) | Chrome / Firefox / Safari / Edge dernières versions |
| Lighthouse Perf (desktop, GPU réel) | ≥ 75 (actuel : 78) |
| Lighthouse SEO / Best Practices | 100 / 100 |
| Lighthouse Accessibilité | ≥ 95 (actuel : 93, cible 100) |
| RGPD : pas de cookies sans consentement | ✅ (Plausible, no-cookie) |
| Désabonnement newsletter | en 1 clic (lien Buttondown) |

## 9. Workflows éditoriaux

### 9.1 Publier un nouvel article
1. Créer `src/content/articles/<domaine>/<slug>.md` avec le frontmatter Zod.
2. Rédiger en Markdown (avec éventuels SVG inline — pas de lignes vides à l'intérieur des blocs HTML bruts !).
3. `git add` + `git commit -m "feat(article): <titre>"` + `git push origin main`.
4. Vercel redéploie automatiquement (~2 min).
5. Buttondown détecte le nouvel item RSS → envoie aux abonnés.

### 9.2 Modifier une page statique (Accueil, À propos…)
1. Éditer `src/pages/*.astro` ou `src/components/*.astro`.
2. Build local (`npm run build`) pour valider.
3. Commit + push → Vercel redéploie.

## 10. Évolutions identifiées (pas encore livrées)

- **Migration Astro 5** : fondation pour intégration DB/CMS via Content Layer.
- **Domaine custom** (`.fr` ou autre) : actuellement sur `*.vercel.app`.
- **CMS d'édition** (Keystatic recommandé) : UI pour éditer les articles sans toucher au Markdown.
- **Refactor du composant WebGL** : extraction en modules, suppression de code obsolète.
- **Tests automatisés** : passer de la baseline TS à 100 % vert (45 erreurs legacy à nettoyer).
- **Recherche full-text** côté blog.

Voir `docs/backlog.md` pour le détail des priorités.
