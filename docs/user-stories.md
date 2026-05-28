# User Stories

> Parcours utilisateurs sous forme de stories. Format : *« En tant que [persona], je veux [action] afin de [bénéfice]. »*

## 🎯 Personas

- **V** : Visiteur / lecteur grand public.
- **L** : Lecteur engagé (suit le blog).
- **R** : Recruteur / DRH.
- **P** : Prospect / client potentiel.
- **A** : Auteur du site (Gérald — admin).

---

## 1. Découverte (V)

**US-01** En tant que **visiteur**, je veux **voir immédiatement qui est l'auteur et ce qu'il fait** afin de juger en quelques secondes si la page m'intéresse.
- ✅ Critère d'acceptation : Hero affiche nom + intitulé + 3 chiffres clés en < 1s.

**US-02** En tant que **visiteur**, je veux **percevoir une identité visuelle forte** afin de mémoriser le site.
- ✅ Fond WebGL animé, palette violet/cyan, gradients.

**US-03** En tant que **visiteur mobile**, je veux **une navigation rapide et claire** afin de ne pas être frustré sur petit écran.
- ✅ Menu responsive, fond WebGL allégé, images lazy-loaded.

## 2. Consultation contenu (V, L)

**US-04** En tant que **visiteur**, je veux **parcourir des articles classés par thème** afin de trouver vite ce qui m'intéresse.
- ✅ `/blog/themes` + filtre par thématique.

**US-05** En tant que **lecteur**, je veux **lire un article confortablement** afin de profiter du contenu sans frustration.
- ✅ Typographie soignée, ligne de mesure ~70 caractères, contraste AA, images responsives.

**US-06** En tant que **lecteur**, je veux **voir le temps de lecture estimé** afin de m'engager en connaissance de cause.
- ✅ Champ `readingTime` dans le frontmatter, affiché dans l'en-tête de l'article.

**US-07** En tant que **lecteur**, je veux **voir des articles liés en fin d'article** afin de continuer la lecture.
- ⚠️ Mécanique en place via `relatedArticles` mais à enrichir (Backlog P4).

**US-08** En tant que **lecteur d'un article avec schéma**, je veux **voir les graphiques s'afficher** afin de comprendre les données.
- ✅ SVG inline (fix appliqué le 28/05 pour 14 articles).

## 3. Conversion newsletter (L)

**US-09** En tant que **lecteur engagé**, je veux **m'abonner à la newsletter d'un clic** afin de recevoir les prochains articles.
- ✅ Bande newsletter sur home + `/blog` ; mini-formulaire en footer site-wide.
- ✅ Inscription via Buttondown (`Apex_971`), confirmation visuelle "Vous êtes inscrit !".

**US-10** En tant que **nouvel abonné**, je veux **recevoir un email de bienvenue** afin de comprendre à quoi je m'abonne.
- ⏳ Welcome email à activer dans Buttondown (texte prêt — `docs/guide-utilisateur.md`).

**US-11** En tant qu'**abonné**, je veux **recevoir automatiquement chaque nouvel article** afin de ne rien manquer.
- ⏳ RSS-to-email à activer dans Buttondown.

**US-12** En tant qu'**abonné**, je veux **me désabonner en un clic** afin de garder le contrôle.
- ✅ Lien de désabonnement géré par Buttondown.

## 4. Contact / prospection (R, P)

**US-13** En tant que **recruteur**, je veux **consulter le CV en ligne** ou le **télécharger en PDF** afin de l'archiver.
- ✅ Page `/cv` (rendu HTML) + `/cv?print=1` (version imprimable → Save as PDF via navigateur).

**US-14** En tant que **prospect**, je veux **voir les projets passés détaillés** afin d'évaluer la pertinence.
- ✅ Liste `/projets` + détail `/projets/[slug]`.

**US-15** En tant que **prospect**, je veux **envoyer un message rapide** afin de prendre contact.
- ✅ Formulaire `/contact` (Formspree `mgvklqra`).

**US-16** En tant que **prospect**, je veux **avoir l'email et le LinkedIn** afin de choisir mon canal préféré.
- ✅ Affichés en footer + page contact.

## 5. SEO / partage (V via Google ou réseau social)

**US-17** En tant que **visiteur depuis Google**, je veux **arriver sur une page pertinente** afin de trouver ce que je cherche.
- ✅ Sitemap + métadonnées + URLs sémantiques.

**US-18** En tant que **utilisateur partageant un article sur LinkedIn**, je veux **un aperçu propre** afin d'inciter au clic.
- ✅ Open Graph + Twitter Card sur toutes les pages, image partagée renseignée.

**US-19** En tant qu'**utilisateur RSS**, je veux **lire l'article complet dans mon lecteur** afin de ne pas avoir à cliquer.
- ✅ Flux `/rss.xml` enrichi avec contenu HTML complet (markdown-it + sanitize-html, URLs absolutisées).

## 6. Accessibilité (transverse — utilisateurs avec besoins spécifiques)

**US-20** En tant qu'**utilisateur préférant les animations réduites**, je veux **un site qui respecte mon réglage** afin de ne pas avoir de mouvements perturbants.
- ✅ `prefers-reduced-motion: reduce` désactive le fond WebGL.

**US-21** En tant qu'**utilisateur de lecteur d'écran**, je veux **une structure sémantique correcte** afin de naviguer efficacement.
- ✅ Titres séquentiels (h1→h2→h3), `<main>`, `<article>`, `<nav>`, `aria-label` sur boutons icônes.

**US-22** En tant qu'**utilisateur avec vision réduite**, je veux **un contraste suffisant** afin de lire confortablement.
- ✅ Tous les tokens texte ≥ 4.5:1 (AA).

## 7. Maintenance / admin (A)

**US-23** En tant qu'**auteur**, je veux **publier un nouvel article en quelques minutes** afin de garder le rythme.
- ✅ Workflow : créer `src/content/articles/<domaine>/<slug>.md` → commit → push → déploiement auto + envoi newsletter.

**US-24** En tant qu'**auteur**, je veux **être alerté si le build casse** afin de corriger vite.
- ✅ Vercel envoie un email d'échec de build. Schéma Zod validé au build.

**US-25** En tant qu'**auteur**, je veux **mesurer l'audience** sans cookies ni RGPD lourd.
- ✅ Plausible (privacy-first).

**US-26** En tant qu'**auteur**, je veux **archiver les conventions du site** pour me souvenir / aider un futur contributeur.
- ✅ `CLAUDE.md` + ce dossier `docs/`.
