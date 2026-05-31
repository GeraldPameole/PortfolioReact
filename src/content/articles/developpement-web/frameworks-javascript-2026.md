---
title: "Frameworks JavaScript en 2026 : adopter ou attendre"
description: "React 19 + Compiler, Next.js 15, Astro 5, Svelte 5, SolidStart, TanStack Start, Nuxt 4, Qwik, Remix / React Router v7 — adoption réelle, méthode de choix objective et ce que vous pouvez ignorer."
publishDate: "2025-01-27"
type: article
domain: developpement-web
image: "/images/themes/dev-web.webp"
pillColor: green
theme: technologie
tags:
  - developpement
  - javascript
  - frameworks
  - react
---

Chez ACTIV PARTNERS, j'ai démarré plusieurs projets sous WordPress puis React parce que c'était la norme implicite de l'équipe. Rétrospectivement, deux de ces projets auraient été plus rapides à livrer avec Vue, et un troisième serait parti directement en Astro si j'avais eu le recul que j'ai aujourd'hui. Pas parce que React est mauvais — il est excellent — mais parce qu'on avait choisi l'outil par réflexe, pas par analyse.

Mi-2026, l'écosystème JavaScript est arrivé à un point intéressant : la guerre des frameworks est terminée sur les fondamentaux (rendu virtuel ou compilation, hydratation partielle ou totale, signaux ou re-renders), et chaque outil a trouvé une niche où il dépasse les autres. Le problème n'est plus "quel est le meilleur framework" mais "lequel mérite que vous y investissiez 18 mois de maintenance". Voici ce qui mérite votre attention, et ce que vous pouvez ignorer sans remords.

## Ce que l'adoption réelle dit vraiment

Le débat frameworks ressemble souvent à une dispute religieuse : les défenseurs de React accusent Vue d'être trop simple, les fans de Svelte moquent le bundle size, les développeurs Angular regardent tout ça de loin avec leur architecture en béton armé. Aucune de ces postures n'aide à décider dans un contexte réel. Pour couper court, il faut regarder l'usage déclaré (State of JS 2024-2025), les téléchargements npm, et la réalité des offres d'emploi.

Le constat est sans surprise. React reste la valeur dominante — autour de 60 % d'usage déclaré, plus de 25 millions de téléchargements hebdomadaires sur `react-dom`. Vue tient sa base autour de 22-24 % avec une présence très forte en France, en Asie et dans la sphère Laravel. Svelte continue sa montée régulière (17 %) mais reste un choix d'équipe, pas un standard industriel. Astro est passé de "curiosité" à "outil sérieux" pour les sites de contenu : sa progression côté GitHub et dans les benchmarks Core Web Vitals est l'événement silencieux des deux dernières années. SolidStart et TanStack Start sont visibles dans les discussions mais marginaux en production. Qwik, malgré l'élégance théorique de la resumability, peine toujours à dépasser les 3 % d'usage.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="28" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Adoption déclarée — State of JS 2018-2025 (% usage)</text>
  <line x1="60" y1="290" x2="660" y2="290" stroke="#1e2a4a" stroke-width="2"/>
  <line x1="60" y1="70" x2="60" y2="290" stroke="#1e2a4a" stroke-width="2"/>
  <text x="50" y="294" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="end">0%</text>
  <text x="50" y="240" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="end">20%</text>
  <text x="50" y="186" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="end">40%</text>
  <text x="50" y="132" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="end">60%</text>
  <text x="50" y="78" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="end">80%</text>
  <line x1="60" y1="240" x2="660" y2="240" stroke="#1e2a4a" stroke-width="1" stroke-dasharray="4,4"/>
  <line x1="60" y1="186" x2="660" y2="186" stroke="#1e2a4a" stroke-width="1" stroke-dasharray="4,4"/>
  <line x1="60" y1="132" x2="660" y2="132" stroke="#1e2a4a" stroke-width="1" stroke-dasharray="4,4"/>
  <line x1="60" y1="78" x2="660" y2="78" stroke="#1e2a4a" stroke-width="1" stroke-dasharray="4,4"/>
  <text x="60" y="308" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2018</text>
  <text x="146" y="308" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2019</text>
  <text x="232" y="308" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2020</text>
  <text x="318" y="308" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2021</text>
  <text x="404" y="308" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2022</text>
  <text x="490" y="308" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2023</text>
  <text x="576" y="308" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2024</text>
  <text x="660" y="308" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2025</text>
  <polyline points="60,154 146,150 232,146 318,140 404,136 490,132 576,130 660,127" fill="none" stroke="#915EFF" stroke-width="2.5"/>
  <circle cx="60" cy="154" r="4" fill="#915EFF"/>
  <circle cx="660" cy="127" r="4" fill="#915EFF"/>
  <polyline points="60,212 146,206 232,206 318,212 404,218 490,221 576,224 660,226" fill="none" stroke="#00cffd" stroke-width="2.5"/>
  <circle cx="60" cy="212" r="4" fill="#00cffd"/>
  <circle cx="660" cy="226" r="4" fill="#00cffd"/>
  <polyline points="60,286 146,284 232,280 318,274 404,270 490,264 576,260 660,256" fill="none" stroke="#fbbf24" stroke-width="2"/>
  <circle cx="60" cy="286" r="4" fill="#fbbf24"/>
  <circle cx="660" cy="256" r="4" fill="#fbbf24"/>
  <polyline points="318,288 404,284 490,278 576,270 660,260" fill="none" stroke="#f97316" stroke-width="2"/>
  <circle cx="318" cy="288" r="4" fill="#f97316"/>
  <circle cx="660" cy="260" r="4" fill="#f97316"/>
  <polyline points="404,287 490,285 576,283 660,281" fill="none" stroke="#a78bfa" stroke-width="2" stroke-dasharray="3,3"/>
  <circle cx="660" cy="281" r="4" fill="#a78bfa"/>
  <line x1="60" y1="335" x2="82" y2="335" stroke="#915EFF" stroke-width="2.5"/>
  <text x="88" y="339" fill="#fff" font-family="sans-serif" font-size="11">React</text>
  <line x1="138" y1="335" x2="160" y2="335" stroke="#00cffd" stroke-width="2.5"/>
  <text x="166" y="339" fill="#fff" font-family="sans-serif" font-size="11">Vue</text>
  <line x1="208" y1="335" x2="230" y2="335" stroke="#fbbf24" stroke-width="2"/>
  <text x="236" y="339" fill="#fff" font-family="sans-serif" font-size="11">Svelte</text>
  <line x1="290" y1="335" x2="312" y2="335" stroke="#f97316" stroke-width="2"/>
  <text x="318" y="339" fill="#fff" font-family="sans-serif" font-size="11">Astro</text>
  <line x1="368" y1="335" x2="390" y2="335" stroke="#a78bfa" stroke-width="2" stroke-dasharray="3,3"/>
  <text x="396" y="339" fill="#fff" font-family="sans-serif" font-size="11">Solid / Qwik</text>
  <text x="500" y="339" fill="#64748b" font-family="sans-serif" font-size="10">Source : State of JS — usage déclaré</text>
</svg></div>

## Méthode : comment choisir objectivement

La plupart des benchmarks comparent le rendu d'une liste de 10 000 éléments ou le FCP sur un hello world. Ces métriques sont réelles mais ne reflètent rien des contraintes d'un projet en production avec des développeurs de niveaux hétérogènes, des dépendances tierces et de la dette qui s'accumule. Pour choisir un framework sans se mentir, il faut définir les critères avant de regarder les outils — et pas l'inverse.

Les axes qui comptent vraiment :

- **Maturité** : combien d'années de production sérieuse derrière l'outil ? Les bugs connus sont-ils résolus ou contournés en folklore ?
- **Écosystème** : routing, formulaires, i18n, auth — sont-ce des choix triviaux ou des décisions à 40 heures ?
- **Courbe d'apprentissage réelle** : pas "écrire un Hello World" mais "être autonome sur un projet de taille réelle avec state, routing et tests" en six semaines.
- **Performance utile** : runtime *et* bundle initial. Sur la plupart des apps métier, l'écart React/Vue/Svelte est imperceptible pour l'utilisateur final ; sur un e-commerce ou un média, Svelte ou Astro reprennent leur avantage.
- **Hiring** : combien de devs compétents sur le marché si vous devez recruter dans six mois ? Sur ce critère, React domine sans ambiguïté.
- **Coût de maintenance à 18 mois** : un framework peu opinionné impose plus de discipline à l'équipe. Si cette discipline n'est pas naturelle, un framework opinionné rendra service même si la courbe initiale est plus raide.

## Le tour d'horizon mi-2026

### React 19 + React Compiler

Le compilateur est passé en stable courant 2025 et c'est, pour moi, l'événement React le plus important depuis les hooks. Le gain n'est pas spectaculaire en performance pure — il est dans la productivité quotidienne. Plus besoin de manuellement décorer chaque fonction de `useMemo` ou `useCallback` pour éviter les re-renders : le compilateur s'en occupe. Les codebases React 19 sont plus lisibles, et les juniors écrivent du code performant sans avoir à maîtriser les pièges des hooks.

Server Components sont enfin matures dans Next.js et arrivent dans d'autres méta-frameworks. Mon retour terrain : c'est un excellent paradigme, mais la courbe d'apprentissage est réelle. Ne pas migrer un projet existant juste pour suivre la mode — attendre une refonte naturelle.

### Next.js 15

Turbopack est stable pour le dev et arrive en build (toujours en preview pour les apps très complexes). PPR (Partial Prerendering) sort progressivement de preview. L'App Router est désormais mature, mais reste verbeux : un projet Next.js 15 demande plus de fichiers qu'un projet Astro ou SvelteKit équivalent. C'est le prix de la flexibilité. Si vous faites du React full-stack, c'est encore le choix par défaut le plus sûr en 2026.

### Astro 5

C'est l'outil qui a le plus évolué. **Server Islands** permet de mélanger statique et dynamique sur la même page sans tout passer en SSR — exactement le cas d'usage qui manquait aux sites de contenu avec quelques zones personnalisées (panier, badge utilisateur, prix dynamiques). **Content Layer** rend la gestion de contenu typée et performante, même avec des sources externes (CMS headless, API). Astro 5 devient un vrai concurrent SSR pour les sites mixtes contenu + interactivité — pas pour une SaaS lourde, mais pour 70 % des sites d'entreprise, oui.

### Svelte 5 + SvelteKit

Les **Runes** (`$state`, `$derived`, `$effect`) remplacent l'ancienne syntaxe magique. L'adoption est progressive parce que ça oblige à réapprendre les patterns, mais le résultat est plus prévisible et plus proche de Solid. SvelteKit reste excellent : un projet petit/moyen part plus vite qu'avec Next.js, le code est plus lisible six mois après. Le frein reste le vivier de développeurs disponibles — beaucoup plus restreint que React.

### Solid.js / SolidStart

Les signaux fine-grained de Solid sont convaincants techniquement, et SolidStart est utilisable en production. Mais l'écosystème reste petit. Je le recommande pour une équipe technique qui maîtrise React et veut un gain de performance mesurable — pas pour un projet client classique où vous aurez du mal à recruter.

### TanStack Start

Sortie en RC fin 2024, stable en 2025. C'est l'alternative full-stack à Next.js construite par l'équipe TanStack (Query, Router, Table, Form). L'expérience développeur est excellente, le typage de bout en bout est sans équivalent, et le router est plus puissant que celui de Next. Le défaut : c'est jeune, donc moins d'exemples en production, moins de retours sur des cas tordus. À garder à l'œil pour les projets démarrés mi-2026 si l'équipe est solide.

### Vue 3 / Nuxt 4

Vue reste très pertinent, surtout en France, en Asie et dans l'écosystème Laravel/PHP. Nuxt 4 a stabilisé l'app directory et amélioré le DX. Pour une équipe qui connaît déjà Vue ou qui vient du backend, c'est un choix raisonnable et durable. La Composition API est devenue la norme et rend le code beaucoup plus maintenable que les options API du Vue 2.

### Qwik

Intéressant en théorie : resumability au lieu d'hydratation, JS quasi nul au démarrage. En pratique, l'adoption reste très limitée (< 3 %), l'écosystème est mince, et le modèle mental demande un vrai effort. Je l'évoque par honnêteté intellectuelle, mais je ne l'utiliserais pas sur un projet client en 2026. À reconsidérer dans deux ans si la communauté tient.

### Remix / React Router v7

L'annonce de la fusion Remix dans React Router v7 fin 2024 a clarifié le paysage : Remix v3 a été annulé, les bonnes idées de Remix vivent désormais dans "React Router framework". Si vous aviez du code Remix, la migration vers React Router v7 est documentée. Si vous démarrez un projet React full-stack en 2026, le choix est entre Next.js (écosystème, Vercel, déploiement clé en main), TanStack Start (DX, typage), et React Router v7 (simplicité, philosophie web-standards). Les trois sont des choix défendables.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="28" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Matrice comparative — frameworks mi-2026</text>
  <rect x="20" y="45" width="170" height="32" fill="#1e2a4a" rx="2"/>
  <rect x="195" y="45" width="125" height="32" fill="#1e2a4a" rx="2"/>
  <rect x="325" y="45" width="120" height="32" fill="#1e2a4a" rx="2"/>
  <rect x="450" y="45" width="115" height="32" fill="#1e2a4a" rx="2"/>
  <rect x="570" y="45" width="110" height="32" fill="#1e2a4a" rx="2"/>
  <text x="105" y="65" fill="#94a3b8" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Critère</text>
  <text x="257" y="65" fill="#915EFF" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">React 19</text>
  <text x="385" y="65" fill="#00cffd" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Vue 3</text>
  <text x="507" y="65" fill="#fbbf24" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Svelte 5</text>
  <text x="625" y="65" fill="#f97316" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Astro 5</text>
  <rect x="20" y="82" width="170" height="38" fill="#0f1635" rx="2"/>
  <rect x="195" y="82" width="125" height="38" fill="#1a0a3a" rx="2"/>
  <rect x="325" y="82" width="120" height="38" fill="#0a1a20" rx="2"/>
  <rect x="450" y="82" width="115" height="38" fill="#0f1635" rx="2"/>
  <rect x="570" y="82" width="110" height="38" fill="#1a1a0a" rx="2"/>
  <text x="105" y="100" fill="#fff" font-family="sans-serif" font-size="11" text-anchor="middle">Maturité</text>
  <text x="105" y="113" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">production sérieuse</text>
  <text x="257" y="105" fill="#86efac" font-family="sans-serif" font-size="11" text-anchor="middle">Très mature</text>
  <text x="385" y="105" fill="#86efac" font-family="sans-serif" font-size="11" text-anchor="middle">Très mature</text>
  <text x="507" y="105" fill="#fbbf24" font-family="sans-serif" font-size="11" text-anchor="middle">Mature</text>
  <text x="625" y="105" fill="#fbbf24" font-family="sans-serif" font-size="11" text-anchor="middle">Mature</text>
  <rect x="20" y="125" width="170" height="38" fill="#121a38" rx="2"/>
  <rect x="195" y="125" width="125" height="38" fill="#1a1030" rx="2"/>
  <rect x="325" y="125" width="120" height="38" fill="#0a1a20" rx="2"/>
  <rect x="450" y="125" width="115" height="38" fill="#0f1635" rx="2"/>
  <rect x="570" y="125" width="110" height="38" fill="#1a1a0a" rx="2"/>
  <text x="105" y="143" fill="#fff" font-family="sans-serif" font-size="11" text-anchor="middle">Écosystème</text>
  <text x="105" y="156" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">libs + ressources</text>
  <text x="257" y="148" fill="#86efac" font-family="sans-serif" font-size="11" text-anchor="middle">Sans rival</text>
  <text x="385" y="148" fill="#86efac" font-family="sans-serif" font-size="11" text-anchor="middle">Solide</text>
  <text x="507" y="148" fill="#fbbf24" font-family="sans-serif" font-size="11" text-anchor="middle">Correct</text>
  <text x="625" y="148" fill="#fbbf24" font-family="sans-serif" font-size="11" text-anchor="middle">En croissance</text>
  <rect x="20" y="168" width="170" height="38" fill="#0f1635" rx="2"/>
  <rect x="195" y="168" width="125" height="38" fill="#1a0a3a" rx="2"/>
  <rect x="325" y="168" width="120" height="38" fill="#0a1a20" rx="2"/>
  <rect x="450" y="168" width="115" height="38" fill="#0f1635" rx="2"/>
  <rect x="570" y="168" width="110" height="38" fill="#1a1a0a" rx="2"/>
  <text x="105" y="186" fill="#fff" font-family="sans-serif" font-size="11" text-anchor="middle">Courbe d'apprentissage</text>
  <text x="105" y="199" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">autonomie 6 semaines</text>
  <text x="257" y="190" fill="#fbbf24" font-family="sans-serif" font-size="11" text-anchor="middle">Modérée (RSC)</text>
  <text x="385" y="190" fill="#86efac" font-family="sans-serif" font-size="11" text-anchor="middle">Douce</text>
  <text x="507" y="190" fill="#86efac" font-family="sans-serif" font-size="11" text-anchor="middle">Douce (Runes)</text>
  <text x="625" y="190" fill="#86efac" font-family="sans-serif" font-size="11" text-anchor="middle">Très douce</text>
  <rect x="20" y="211" width="170" height="38" fill="#121a38" rx="2"/>
  <rect x="195" y="211" width="125" height="38" fill="#1a1030" rx="2"/>
  <rect x="325" y="211" width="120" height="38" fill="#0a1a20" rx="2"/>
  <rect x="450" y="211" width="115" height="38" fill="#0a1f0a" rx="2"/>
  <rect x="570" y="211" width="110" height="38" fill="#0a1f0a" rx="2"/>
  <text x="105" y="229" fill="#fff" font-family="sans-serif" font-size="11" text-anchor="middle">Performance utile</text>
  <text x="105" y="242" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">runtime + bundle</text>
  <text x="257" y="233" fill="#fbbf24" font-family="sans-serif" font-size="11" text-anchor="middle">Bon (Compiler)</text>
  <text x="385" y="233" fill="#fbbf24" font-family="sans-serif" font-size="11" text-anchor="middle">Bon</text>
  <text x="507" y="233" fill="#86efac" font-family="sans-serif" font-size="11" text-anchor="middle">Excellent</text>
  <text x="625" y="233" fill="#86efac" font-family="sans-serif" font-size="11" text-anchor="middle">Excellent</text>
  <rect x="20" y="254" width="170" height="38" fill="#0f1635" rx="2"/>
  <rect x="195" y="254" width="125" height="38" fill="#0a1f0a" rx="2"/>
  <rect x="325" y="254" width="120" height="38" fill="#0a1a20" rx="2"/>
  <rect x="450" y="254" width="115" height="38" fill="#121a38" rx="2"/>
  <rect x="570" y="254" width="110" height="38" fill="#1a1a0a" rx="2"/>
  <text x="105" y="272" fill="#fff" font-family="sans-serif" font-size="11" text-anchor="middle">Hiring (FR / EU)</text>
  <text x="105" y="285" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">vivier disponible</text>
  <text x="257" y="275" fill="#86efac" font-family="sans-serif" font-size="11" text-anchor="middle">Excellent</text>
  <text x="385" y="275" fill="#86efac" font-family="sans-serif" font-size="11" text-anchor="middle">Bon (FR)</text>
  <text x="507" y="275" fill="#fbbf24" font-family="sans-serif" font-size="11" text-anchor="middle">Limité</text>
  <text x="625" y="275" fill="#fbbf24" font-family="sans-serif" font-size="11" text-anchor="middle">Limité</text>
  <rect x="20" y="297" width="170" height="38" fill="#121a38" rx="2"/>
  <rect x="195" y="297" width="125" height="38" fill="#1a1030" rx="2"/>
  <rect x="325" y="297" width="120" height="38" fill="#0a1a20" rx="2"/>
  <rect x="450" y="297" width="115" height="38" fill="#0f1635" rx="2"/>
  <rect x="570" y="297" width="110" height="38" fill="#0a1f0a" rx="2"/>
  <text x="105" y="315" fill="#fff" font-family="sans-serif" font-size="11" text-anchor="middle">Maintenance 18 mois</text>
  <text x="257" y="318" fill="#fbbf24" font-family="sans-serif" font-size="11" text-anchor="middle">Selon conventions</text>
  <text x="385" y="318" fill="#86efac" font-family="sans-serif" font-size="11" text-anchor="middle">Bonne lisibilité</text>
  <text x="507" y="318" fill="#fbbf24" font-family="sans-serif" font-size="11" text-anchor="middle">Bonne</text>
  <text x="625" y="318" fill="#86efac" font-family="sans-serif" font-size="11" text-anchor="middle">Très prévisible</text>
</svg></div>

## Arbre de décision : voici ce que vous pouvez ignorer

Avant de choisir, je pose quatre questions. La quatrième est celle qu'on oublie : est-ce que ce projet a besoin d'un framework du tout ? Pour une application CRUD basique, un rendu serveur (Laravel, Django, Rails) avec un peu de JavaScript vanilla reste parfaitement défendable en 2026.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="28" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Arbre de décision — quel framework selon le projet</text>
  <rect x="270" y="55" width="160" height="40" fill="#1e2a4a" rx="6" stroke="#94a3b8" stroke-width="1"/>
  <text x="350" y="78" fill="#fff" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Quel type de projet ?</text>
  <line x1="350" y1="95" x2="120" y2="125" stroke="#1e2a4a" stroke-width="1.5"/>
  <line x1="350" y1="95" x2="350" y2="125" stroke="#1e2a4a" stroke-width="1.5"/>
  <line x1="350" y1="95" x2="580" y2="125" stroke="#1e2a4a" stroke-width="1.5"/>
  <rect x="35" y="125" width="170" height="34" fill="#1a1a0a" rx="4"/>
  <text x="120" y="146" fill="#fbbf24" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Site contenu / vitrine</text>
  <rect x="265" y="125" width="170" height="34" fill="#1a0a3a" rx="4"/>
  <text x="350" y="146" fill="#915EFF" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">App / SPA / SaaS</text>
  <rect x="495" y="125" width="170" height="34" fill="#0a1f1a" rx="4"/>
  <text x="580" y="146" fill="#86efac" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Prototype / MVP</text>
  <line x1="120" y1="159" x2="120" y2="185" stroke="#1e2a4a" stroke-width="1.5"/>
  <line x1="350" y1="159" x2="280" y2="185" stroke="#1e2a4a" stroke-width="1.5"/>
  <line x1="350" y1="159" x2="420" y2="185" stroke="#1e2a4a" stroke-width="1.5"/>
  <line x1="580" y1="159" x2="580" y2="185" stroke="#1e2a4a" stroke-width="1.5"/>
  <rect x="35" y="185" width="170" height="50" fill="#0f1635" rx="4"/>
  <text x="120" y="205" fill="#f97316" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Astro 5</text>
  <text x="120" y="222" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">Server Islands,</text>
  <text x="120" y="234" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">Content Layer</text>
  <rect x="210" y="185" width="140" height="50" fill="#0f1635" rx="4"/>
  <text x="280" y="205" fill="#915EFF" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Équipe React ?</text>
  <text x="280" y="222" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">Next.js 15 ou</text>
  <text x="280" y="234" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">TanStack Start</text>
  <rect x="355" y="185" width="140" height="50" fill="#0f1635" rx="4"/>
  <text x="425" y="205" fill="#00cffd" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Équipe Vue ?</text>
  <text x="425" y="222" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">Nuxt 4</text>
  <text x="425" y="234" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">(FR / Laravel)</text>
  <rect x="495" y="185" width="170" height="50" fill="#0f1635" rx="4"/>
  <text x="580" y="205" fill="#fbbf24" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">SvelteKit</text>
  <text x="580" y="222" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">ou Astro selon</text>
  <text x="580" y="234" fill="#94a3b8" font-family="sans-serif" font-size="10" text-anchor="middle">interactivité</text>
  <line x1="120" y1="235" x2="120" y2="260" stroke="#1e2a4a" stroke-width="1.5"/>
  <line x1="350" y1="235" x2="350" y2="260" stroke="#1e2a4a" stroke-width="1.5"/>
  <line x1="580" y1="235" x2="580" y2="260" stroke="#1e2a4a" stroke-width="1.5"/>
  <rect x="35" y="260" width="170" height="34" fill="#0a1f1a" rx="4"/>
  <text x="120" y="281" fill="#86efac" font-family="sans-serif" font-size="10" text-anchor="middle">Ignorer : Next, Nuxt</text>
  <rect x="265" y="260" width="170" height="34" fill="#0a1f1a" rx="4"/>
  <text x="350" y="281" fill="#86efac" font-family="sans-serif" font-size="10" text-anchor="middle">Ignorer : Qwik, Solid</text>
  <rect x="495" y="260" width="170" height="34" fill="#0a1f1a" rx="4"/>
  <text x="580" y="281" fill="#86efac" font-family="sans-serif" font-size="10" text-anchor="middle">Ignorer : Angular, Remix v3</text>
  <rect x="20" y="310" width="660" height="34" fill="#121a38" rx="4"/>
  <text x="350" y="331" fill="#94a3b8" font-family="sans-serif" font-size="11" text-anchor="middle">Règle Gérald : si le framework n'a pas 2 ans de production dans des boîtes comparables à la mienne, je prototype mais je ne livre pas client.</text>
</svg></div>

## Ce que vous pouvez ignorer sans remords en 2026

- **Remix v3** : annulé. Inutile d'attendre. Migrez vers React Router v7.
- **Qwik en production client** : modèle élégant, écosystème trop mince. Revoyez dans deux ans.
- **AngularJS (1.x)** : si vous avez encore du code dessus, planifiez la migration sérieusement, c'est devenu un risque sécurité.
- **Les benchmarks de manipulation DOM** : ils ne reflètent pas la perf perçue de votre app.
- **Le mythe "Svelte tue React"** : Svelte est excellent dans sa niche, React garde l'écosystème et le hiring. Ils coexistent.
- **Le mythe inverse "React Compiler tue tous les autres"** : le Compiler est génial pour React, il ne change rien aux gains structurels de Svelte ou Astro.

## Ce que je fais concrètement sur mes projets

Sur les projets WordPress + WooCommerce chez ACTIV PARTNERS, l'usage de React se limitait aux composants réellement interactifs — configurateurs, filtres complexes — le reste restait du PHP templating. Cette approche hybride reste souvent la plus pragmatique : ne pas tout récrire dans le framework du moment, identifier les zones où le gain est réel.

Pour les nouveaux projets de contenu (blog, portfolio, sites institutionnels avec quelques zones dynamiques), je pars en Astro 5 par défaut. Le Content Layer et les Server Islands couvrent 90 % des besoins sans le coût d'un Next.js. Pour une SaaS ou une app métier React, Next.js 15 reste mon choix par défaut, avec un œil sur TanStack Start pour les projets démarrés avec une équipe technique solide.

TypeScript est non-négociable dès deux développeurs. Pas par mode, mais parce que la complétion automatique et les erreurs au moment de l'écriture économisent des heures de débogage sur la durée. Le vrai critère que j'applique en 2026 reste le même qu'en 2020 : quel est le coût de maintenance dans 18 mois ?

> **Pour conclure sans platitude** — En 2026, il n'y a plus de "meilleur framework" : il y a des outils qui dépassent les autres dans leur niche. React 19 + Compiler reste le choix par défaut pour les apps complexes et les équipes qui doivent recruter. Astro 5 a gagné le terrain des sites de contenu mixtes. SvelteKit et TanStack Start méritent une vraie évaluation si vous démarrez en équipe technique. Vue/Nuxt reste pertinent surtout en France. Qwik et Remix v3 peuvent être ignorés. Le vrai arbitrage n'est pas "quoi est à la mode" mais "qu'est-ce qui tiendra dans 18 mois avec mon équipe et mon budget".
