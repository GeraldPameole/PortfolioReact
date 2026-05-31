---
title: "JavaScript en 2026 : ce qui a vraiment percé et ce qu'on survend"
description: "TypeScript 5.8, Node 22, Bun, Vite 6, React 19 + Compiler, Astro 5, Svelte 5 runes — bilan honnête des patterns qui ont changé le quotidien en 2026 et des tendances toujours sur-vendues."
publishDate: "2025-02-17"
type: article
domain: developpement-web
image: "/images/themes/dev-web.webp"
pillColor: green
theme: technologie
tags:
  - developpement-web
  - javascript
  - frontend
  - web
---

En 2019, quand j'ai commencé à travailler sérieusement avec React et TypeScript chez ACTIV PARTNERS, l'écosystème JavaScript était déjà riche mais bruyant. Il y avait une nouvelle librairie "révolutionnaire" chaque semaine. Sept ans plus tard, le bruit n'a pas baissé, mais j'ai développé un filtre : ce qui change réellement le quotidien d'un développeur vs ce qui fait du bruit sur les fils de veille technologique.

Cette distinction est utile. Elle évite de passer du temps à apprendre des patterns qui ne sortiront jamais du mode expérimental, et elle aide à identifier ce qui vaut l'investissement d'apprentissage. Voici ce que je retiens pour mi-2026.

## Ce qui a vraiment changé l'écriture du code

**Les modules ES natifs** (ESM) sont la norme partout — navigateurs, Node 22, Bun, Deno. CommonJS reste accepté par Node mais déconseillé sur les nouveaux projets : la plupart des librairies majeures ont basculé en ESM-only, et continuer à publier en CJS demande aujourd'hui un effort spécifique. Pour les projets sans framework complexe, utiliser `import` directement dans un script de navigateur fonctionne sans build.

**Le top-level await** est passé dans les habitudes depuis longtemps : `await fetch(...)` à la racine d'un module clarifie l'initialisation des modules qui dépendent de données asynchrones — connexion base de données, chargement de configuration — sans le boilerplate d'une IIFE async.

**TypeScript 5.7 puis 5.8** (sorties fin 2024 et début 2025) ont continué le travail de polish : inférence des types de retour des fonctions plus précise, `--isolatedDeclarations` qui force chaque fichier à être typable indépendamment (gain réel pour la vitesse de compilation sur grosses bases), décorateurs TC39 stage 3 supportés nativement. Sur nos projets React à ACTIV PARTNERS, TypeScript n'était pas une option — les bugs interceptés à la compilation économisaient des heures de débogage. En 2026, TypeScript est la norme par défaut.

**Node 22 LTS** (octobre 2024) a stabilisé `fetch` et les WHATWG streams, et introduit `--experimental-strip-types` qui permet d'exécuter du TypeScript directement sans étape de build. Ce n'est pas encore production-ready pour de gros monorepos, mais pour des scripts ou de petits services, c'est une simplification réelle de la chaîne d'outils.

**Bun 1.x** stable est devenu un choix sérieux pour les nouveaux projets : runtime, bundler et test runner dans un seul binaire. Sur des petits projets ou des scripts, le gain de configuration et de vitesse est tangible. Sur des bases plus larges, l'écosystème Node reste plus mûr — toutes les librairies ne sont pas testées contre Bun, et certains comportements diffèrent encore subtilement.

**Vite 6** (novembre 2024) a introduit l'Environment API : un modèle propre pour faire tourner le même code en SSR, edge ou client sans hacks. C'est la première fois qu'un bundler traite le rendu universel comme un concept de première classe plutôt qu'un patch.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="26" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Évolution du stack JavaScript — 2016–2026</text>
  <line x1="60" y1="180" x2="660" y2="180" stroke="#1e2a4a" stroke-width="2"/>
  <line x1="60" y1="174" x2="60" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="60" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2016</text>
  <line x1="120" y1="174" x2="120" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="120" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2017</text>
  <line x1="180" y1="174" x2="180" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="180" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2018</text>
  <line x1="240" y1="174" x2="240" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="240" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2019</text>
  <line x1="300" y1="174" x2="300" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="300" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2020</text>
  <line x1="360" y1="174" x2="360" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="360" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2021</text>
  <line x1="420" y1="174" x2="420" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="420" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2022</text>
  <line x1="480" y1="174" x2="480" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="480" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2023</text>
  <line x1="540" y1="174" x2="540" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="540" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2024</text>
  <line x1="600" y1="174" x2="600" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="600" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2025</text>
  <line x1="660" y1="174" x2="660" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="660" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2026</text>
  <circle cx="60" cy="180" r="5" fill="#915EFF"/>
  <line x1="60" y1="174" x2="60" y2="130" stroke="#915EFF" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="60" y="122" fill="#915EFF" font-family="sans-serif" font-size="10" text-anchor="middle">Angular 2</text>
  <circle cx="180" cy="180" r="5" fill="#00cffd"/>
  <line x1="180" y1="174" x2="180" y2="130" stroke="#00cffd" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="180" y="122" fill="#00cffd" font-family="sans-serif" font-size="10" text-anchor="middle">Webpack 4</text>
  <circle cx="240" cy="180" r="5" fill="#86efac"/>
  <line x1="240" y1="174" x2="240" y2="100" stroke="#86efac" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="240" y="92" fill="#86efac" font-family="sans-serif" font-size="10" text-anchor="middle">React Hooks</text>
  <circle cx="300" cy="180" r="5" fill="#fbbf24"/>
  <line x1="300" y1="174" x2="300" y2="130" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="300" y="122" fill="#fbbf24" font-family="sans-serif" font-size="10" text-anchor="middle">Vite / ESM</text>
  <circle cx="360" cy="180" r="5" fill="#86efac"/>
  <line x1="360" y1="174" x2="360" y2="100" stroke="#86efac" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="360" y="92" fill="#86efac" font-family="sans-serif" font-size="10" text-anchor="middle">Top-level await</text>
  <circle cx="420" cy="180" r="5" fill="#915EFF"/>
  <line x1="420" y1="174" x2="420" y2="130" stroke="#915EFF" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="420" y="122" fill="#915EFF" font-family="sans-serif" font-size="10" text-anchor="middle">TS 5 / Turbo</text>
  <circle cx="480" cy="180" r="5" fill="#00cffd"/>
  <line x1="480" y1="174" x2="480" y2="100" stroke="#00cffd" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="480" y="92" fill="#00cffd" font-family="sans-serif" font-size="10" text-anchor="middle">Bun stable</text>
  <circle cx="540" cy="180" r="5" fill="#915EFF"/>
  <line x1="540" y1="174" x2="540" y2="130" stroke="#915EFF" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="540" y="122" fill="#915EFF" font-family="sans-serif" font-size="10" text-anchor="middle">Node 22 LTS</text>
  <circle cx="600" cy="180" r="5" fill="#00cffd"/>
  <line x1="600" y1="174" x2="600" y2="100" stroke="#00cffd" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="600" y="92" fill="#00cffd" font-family="sans-serif" font-size="10" text-anchor="middle">Vite 6 / Astro 5</text>
  <circle cx="660" cy="180" r="5" fill="#915EFF"/>
  <line x1="660" y1="174" x2="660" y2="130" stroke="#915EFF" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="660" y="122" fill="#915EFF" font-family="sans-serif" font-size="10" text-anchor="middle">React 19 + Compiler</text>
  <circle cx="120" cy="180" r="4" fill="#ef4444"/>
  <line x1="120" y1="186" x2="120" y2="234" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="120" y="250" fill="#ef4444" font-family="sans-serif" font-size="10" text-anchor="middle">Bower ✗</text>
  <circle cx="180" cy="180" r="4" fill="#ef4444"/>
  <line x1="180" y1="186" x2="180" y2="234" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="180" y="250" fill="#ef4444" font-family="sans-serif" font-size="10" text-anchor="middle">Grunt ✗</text>
  <circle cx="240" cy="180" r="4" fill="#ef4444"/>
  <line x1="240" y1="186" x2="240" y2="234" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="240" y="250" fill="#ef4444" font-family="sans-serif" font-size="10" text-anchor="middle">Flow ✗</text>
  <circle cx="300" cy="180" r="4" fill="#ef4444"/>
  <line x1="300" y1="186" x2="300" y2="234" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="300" y="250" fill="#ef4444" font-family="sans-serif" font-size="10" text-anchor="middle">CRA ✗</text>
  <circle cx="540" cy="180" r="4" fill="#ef4444"/>
  <line x1="540" y1="186" x2="540" y2="234" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="540" y="250" fill="#ef4444" font-family="sans-serif" font-size="10" text-anchor="middle">CJS only ✗</text>
  <circle cx="74" cy="330" r="5" fill="#915EFF"/>
  <text x="86" y="334" fill="#fff" font-family="sans-serif" font-size="11">Frameworks / Runtimes</text>
  <circle cx="260" cy="330" r="5" fill="#00cffd"/>
  <text x="272" y="334" fill="#fff" font-family="sans-serif" font-size="11">Tooling</text>
  <circle cx="340" cy="330" r="5" fill="#86efac"/>
  <text x="352" y="334" fill="#fff" font-family="sans-serif" font-size="11">Langage / Specs</text>
  <circle cx="460" cy="330" r="5" fill="#ef4444"/>
  <text x="472" y="334" fill="#fff" font-family="sans-serif" font-size="11">Disparus / déconseillés</text>
</svg></div>

## Côté frameworks : trois mouvements concrets en 2025

**React 19** a livré son Compiler en stable au cours de 2025 : l'auto-memoization rend `useMemo` et `useCallback` largement inutiles dans le code applicatif. Sur des bases existantes, c'est un nettoyage progressif possible sans tout réécrire. Combiné avec les Actions et le hook `use()`, l'écriture de formulaires asynchrones est devenue plus directe — moins de gestion d'état manuelle pour des cas simples.

**Next.js 15** a stabilisé Turbopack en mode dev (le build de production reste partiellement sur Webpack au moment où j'écris) et continue de pousser le Partial Prerendering en preview. PPR est intéressant sur le papier — mêler statique et dynamique dans la même page sans choisir — mais il faut encore traiter ça comme un pari : l'API peut bouger avant la stabilisation complète.

**Astro 5** (décembre 2024) a introduit les Server Islands : tu rends statiquement une page, et tu marques uniquement les zones qui ont besoin d'être personnalisées au moment de la requête pour être rendues côté serveur. C'est exactement le compromis manquant entre SSG pur et SSR complet. La Content Layer (collections sourcées depuis externes : CMS, fichiers, API) rend la modélisation du contenu beaucoup plus propre que les versions précédentes.

**Svelte 5** (octobre 2024) a remplacé sa réactivité implicite par les **runes** : `$state`, `$derived`, `$effect`. C'est un vrai changement conceptuel — la magie compile-time devient explicite — et la migration des projets Svelte 3/4 demande du travail. Pour les nouveaux projets, le modèle est plus prévisible et le code plus lisible à six mois de distance.

## Ce qu'on survend toujours : le SSR universel pour tout

Le rendu côté serveur est une technique valide pour des cas précis : sites à fort trafic organique, pages dont le contenu doit être indexé rapidement, applications où la performance perçue au premier chargement est critique. Next.js, Nuxt et désormais Astro 5 avec ses Server Islands ont démocratisé son accessibilité — ce qui est positif.

Le problème reste l'extrapolation : l'idée que tout projet devrait utiliser le SSR par défaut. Sur un dashboard d'administration interne avec authentification, le SSR n'apporte rien. Sur une application SPA derrière un login, personne ne cherche le contenu sur Google. Le surcoût de configuration, de débogage des comportements différents entre serveur et client, et d'infrastructure (le serveur Node.js qui tourne en permanence, les invariants à respecter pour l'hydratation) est bien réel.

Les **Web Components** ont continué de bénéficier d'une hype disproportionnée. La promesse — des composants natifs interopérables entre tous les frameworks — est séduisante. La réalité, en 2026, est que le DX reste inférieur à React ou Vue, le SSR demande du travail, et Lit (le framework de référence côté Google) reste niche. Ils ont leur place dans des design systems à partager entre projets de frameworks différents, mais c'est un cas spécifique.

Le **pipeline operator** (`|>`) est toujours stage 2 au TC39. Ça fait des années qu'on le voit dans des slides de conférence comme "imminent". Je ne le compte pas dans mon stack tant qu'il n'est pas stage 3 — l'historique des propositions stage 2 bloquées montre que ce n'est pas un détail.

## Stack recommandée selon le contexte en 2026

Pour un projet React de taille moyenne avec équipe de 2-4 développeurs : **Vite 6 + React 19 + TypeScript 5.8 + TanStack Router**. Pas de state management global si les données peuvent vivre en local ou dans des hooks de composants. Zustand si on en a besoin, pas Redux sauf legacy. Avec React Compiler stable, on peut arrêter de saupoudrer des `useMemo` partout.

Pour un site à contenu SEO-critique : **Astro 5** est devenu mon premier réflexe avant Next.js. Les Server Islands résolvent ce qui manquait en 2024 — la possibilité d'avoir 99% de la page en statique et juste un widget personnalisé en SSR. Next.js reste pertinent pour des apps full-stack avec beaucoup de logique serveur.

Pour une équipe qui part de zéro et veut aller vite : **Vue 3 + Vite + TypeScript**, ou **SvelteKit avec runes** si on accepte un écosystème plus petit mais un modèle mental plus clair. La courbe est plus douce que React pour des débutants.

Pour un nouveau service backend Node : essayer Node 22 LTS d'abord, basculer sur **Bun** uniquement si on a un besoin spécifique (cold start serverless, perf brut sur du I/O). L'écosystème Node reste plus prévisible en production sérieuse.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="26" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Arbre de décision — choisir son stack JS en 2026</text>
  <rect x="270" y="46" width="160" height="38" fill="#915EFF" rx="4"/>
  <text x="350" y="70" fill="#fff" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Nouveau projet JS</text>
  <line x1="350" y1="84" x2="350" y2="108" stroke="#64748b" stroke-width="1.5"/>
  <rect x="248" y="108" width="204" height="36" fill="#1e2a4a" rx="4"/>
  <text x="350" y="131" fill="#fff" font-family="sans-serif" font-size="11" text-anchor="middle">SEO critique / contenu public ?</text>
  <line x1="248" y1="126" x2="130" y2="126" stroke="#64748b" stroke-width="1.5"/>
  <text x="188" y="120" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">Non</text>
  <rect x="60" y="108" width="120" height="36" fill="#0a1f2a" rx="4"/>
  <text x="120" y="131" fill="#00cffd" font-family="sans-serif" font-size="11" text-anchor="middle">Vite + React 19</text>
  <line x1="452" y1="126" x2="570" y2="126" stroke="#64748b" stroke-width="1.5"/>
  <text x="512" y="120" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">Oui</text>
  <rect x="570" y="108" width="120" height="36" fill="#0a1f0a" rx="4"/>
  <text x="630" y="131" fill="#86efac" font-family="sans-serif" font-size="11" text-anchor="middle">Astro 5</text>
  <line x1="350" y1="144" x2="350" y2="170" stroke="#64748b" stroke-width="1.5"/>
  <rect x="248" y="170" width="204" height="36" fill="#1e2a4a" rx="4"/>
  <text x="350" y="193" fill="#fff" font-family="sans-serif" font-size="11" text-anchor="middle">Logique serveur lourde ?</text>
  <line x1="248" y1="188" x2="130" y2="188" stroke="#64748b" stroke-width="1.5"/>
  <text x="188" y="182" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">Non</text>
  <rect x="60" y="170" width="120" height="36" fill="#0a1f0a" rx="4"/>
  <text x="120" y="193" fill="#86efac" font-family="sans-serif" font-size="11" text-anchor="middle">SPA pure suffit</text>
  <line x1="350" y1="206" x2="350" y2="232" stroke="#64748b" stroke-width="1.5"/>
  <rect x="248" y="232" width="204" height="36" fill="#1e2a4a" rx="4"/>
  <text x="350" y="255" fill="#fff" font-family="sans-serif" font-size="11" text-anchor="middle">Équipe React déjà ?</text>
  <line x1="248" y1="250" x2="130" y2="250" stroke="#64748b" stroke-width="1.5"/>
  <text x="188" y="244" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">Non</text>
  <rect x="60" y="232" width="120" height="36" fill="#1a1a0a" rx="4"/>
  <text x="120" y="255" fill="#fbbf24" font-family="sans-serif" font-size="11" text-anchor="middle">SvelteKit / Vue</text>
  <line x1="452" y1="250" x2="550" y2="250" stroke="#64748b" stroke-width="1.5"/>
  <text x="500" y="244" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">Oui</text>
  <rect x="550" y="232" width="130" height="36" fill="#0a1f2a" rx="4"/>
  <text x="615" y="255" fill="#00cffd" font-family="sans-serif" font-size="11" text-anchor="middle">Next.js 15</text>
  <rect x="270" y="296" width="160" height="46" fill="#1e3a5a" rx="4"/>
  <text x="350" y="316" fill="#fff" font-family="sans-serif" font-size="11" text-anchor="middle">Toujours :</text>
  <text x="350" y="332" fill="#00cffd" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">TypeScript strict</text>
  <line x1="120" y1="268" x2="120" y2="319" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="120" y1="319" x2="270" y2="319" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="615" y1="268" x2="615" y2="319" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="615" y1="319" x2="430" y2="319" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
</svg></div>

## Ce que je retiens de sept ans de projets JavaScript

La tendance de fond reste positive : JavaScript en 2026 est un langage plus sûr, plus lisible et plus rapide à utiliser qu'il ne l'était en 2019. TypeScript est la configuration par défaut. Vite a remplacé Webpack sur les nouveaux projets. React 19 + Compiler retire une catégorie entière de bugs d'optimisation prématurée. Astro 5 a apporté une réponse propre au choix binaire SSG/SSR. Node 22 et Bun donnent enfin le choix côté runtime.

Ce qui n'a pas changé : la nécessité de choisir ses outils selon le projet et non selon ce qui fait du bruit sur les réseaux. Le SSR n'est pas universel. Les Web Components ne remplacent pas les frameworks. Le pipeline operator n'arrive toujours pas. Et écrire du JavaScript vanilla reste la meilleure façon de comprendre ce que les frameworks font réellement sous le capot.

> **Le fond de l'affaire** — ESM natif, TypeScript 5.8 strict, React 19 + Compiler, Vite 6 et Astro 5 ont concrètement changé la façon d'écrire du JavaScript en 2026. Node 22 LTS et Bun stable donnent un vrai choix côté runtime. Le SSR universel reste sur-vendu pour les apps derrière authentification ; Web Components et pipeline operator continuent d'être hypés sans rattraper leur retard d'adoption. La bonne stack dépend du contexte, pas de la tendance du moment.
