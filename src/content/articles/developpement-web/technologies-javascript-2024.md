---
title: "JavaScript en 2025 : ce qui a vraiment percé et ce qu'on survend"
description: "ESM natif, top-level await, TypeScript 5+, Web Components — bilan honnête des patterns modernes qui ont changé le quotidien et des tendances sur-vendues comme le SSR universel."
publishDate: "2025-02-17"
type: article
domain: developpement-web
image: "/images/themes/dev-web.jpg"
pillColor: green
theme: technologie
tags:
  - developpement-web
  - javascript
  - frontend
  - web
---

En 2019, quand j'ai commencé à travailler sérieusement avec React et TypeScript chez ACTIV PARTNERS, l'écosystème JavaScript était déjà riche mais bruyant. Il y avait une nouvelle librairie "révolutionnaire" chaque semaine. Six ans plus tard, le bruit n'a pas baissé, mais j'ai développé un filtre : ce qui change réellement le quotidien d'un développeur vs ce qui fait du bruit sur les fils de veille technologique.

Cette distinction est utile. Elle évite de passer du temps à apprendre des patterns qui ne sortiront jamais du mode expérimental, et elle aide à identifier ce qui vaut l'investissement d'apprentissage.

## Ce qui a vraiment changé l'écriture du code

**Les modules ES natifs** (ESM) sont maintenant supportés par tous les navigateurs modernes sans transpilation. Pendant des années, on a empilé des systèmes de modules — CommonJS, AMD, UMD — parce que les navigateurs ne géraient pas l'import natif. En 2025, utiliser `import` directement dans un script de navigateur fonctionne. Pour les projets sans framework complexe, c'est une simplification significative de la configuration.

**Le top-level await** permet d'écrire `await fetch(...)` directement à la racine d'un module sans envelopper dans une fonction async. C'est une petite syntaxe mais elle clarifie l'initialisation des modules qui dépendent de données asynchrones — connexion base de données, chargement de configuration — sans le boilerplate d'une IIFE async.

**TypeScript 5+** a apporté des améliorations concrètes : la nouvelle syntaxe de décorateurs (standardisée TC39), les `const type parameters` pour les génériques, et les performances de compilation significativement améliorées. Sur nos projets React à ACTIV PARTNERS, TypeScript n'était pas une option — les bugs interceptés à la compilation économisaient des heures de débogage. En 2025, TypeScript est la norme par défaut dans les équipes qui maintiennent du code sur la durée.

**Vite comme outil de build** a rendu Webpack anecdotique sur les nouveaux projets. La différence de vitesse en développement est réelle et mesurable : un projet React moyen qui démarrait en 8-12 secondes avec Create React App démarre en moins de 1 seconde avec Vite. C'est un changement qui améliore le quotidien concrètement.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="26" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Évolution du stack JavaScript — 2015–2025</text>
  <!-- Timeline base line -->
  <line x1="60" y1="180" x2="660" y2="180" stroke="#1e2a4a" stroke-width="2"/>
  <!-- Year markers -->
  <line x1="60" y1="174" x2="60" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="60" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2015</text>
  <line x1="120" y1="174" x2="120" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="120" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2016</text>
  <line x1="180" y1="174" x2="180" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="180" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2017</text>
  <line x1="240" y1="174" x2="240" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="240" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2018</text>
  <line x1="300" y1="174" x2="300" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="300" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2019</text>
  <line x1="360" y1="174" x2="360" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="360" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2020</text>
  <line x1="420" y1="174" x2="420" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="420" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2021</text>
  <line x1="480" y1="174" x2="480" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="480" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2022</text>
  <line x1="540" y1="174" x2="540" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="540" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2023</text>
  <line x1="600" y1="174" x2="600" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="600" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2024</text>
  <line x1="660" y1="174" x2="660" y2="186" stroke="#64748b" stroke-width="1"/>
  <text x="660" y="200" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">2025</text>
  <!-- Frameworks events — above line -->
  <circle cx="60" cy="180" r="5" fill="#915EFF"/>
  <line x1="60" y1="174" x2="60" y2="130" stroke="#915EFF" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="60" y="122" fill="#915EFF" font-family="sans-serif" font-size="10" text-anchor="middle">ES6</text>
  <circle cx="120" cy="180" r="5" fill="#915EFF"/>
  <line x1="120" y1="174" x2="120" y2="100" stroke="#915EFF" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="120" y="92" fill="#915EFF" font-family="sans-serif" font-size="10" text-anchor="middle">Angular 2</text>
  <circle cx="180" cy="180" r="5" fill="#00cffd"/>
  <line x1="180" y1="174" x2="180" y2="130" stroke="#00cffd" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="180" y="122" fill="#00cffd" font-family="sans-serif" font-size="10" text-anchor="middle">Webpack 3</text>
  <circle cx="240" cy="180" r="5" fill="#86efac"/>
  <line x1="240" y1="174" x2="240" y2="100" stroke="#86efac" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="240" y="92" fill="#86efac" font-family="sans-serif" font-size="10" text-anchor="middle">TS adoption</text>
  <circle cx="300" cy="180" r="5" fill="#00cffd"/>
  <line x1="300" y1="174" x2="300" y2="130" stroke="#00cffd" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="300" y="122" fill="#00cffd" font-family="sans-serif" font-size="10" text-anchor="middle">React Hooks</text>
  <circle cx="360" cy="180" r="5" fill="#fbbf24"/>
  <line x1="360" y1="174" x2="360" y2="100" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="360" y="92" fill="#fbbf24" font-family="sans-serif" font-size="10" text-anchor="middle">Vite / ESM</text>
  <circle cx="420" cy="180" r="5" fill="#86efac"/>
  <line x1="420" y1="174" x2="420" y2="130" stroke="#86efac" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="420" y="122" fill="#86efac" font-family="sans-serif" font-size="10" text-anchor="middle">Top-level await</text>
  <circle cx="480" cy="180" r="5" fill="#915EFF"/>
  <line x1="480" y1="174" x2="480" y2="100" stroke="#915EFF" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="480" y="92" fill="#915EFF" font-family="sans-serif" font-size="10" text-anchor="middle">TS 5 / Turbo</text>
  <circle cx="540" cy="180" r="5" fill="#00cffd"/>
  <line x1="540" y1="174" x2="540" y2="130" stroke="#00cffd" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="540" y="122" fill="#00cffd" font-family="sans-serif" font-size="10" text-anchor="middle">Bun runtime</text>
  <!-- Below line — disparus -->
  <circle cx="120" cy="180" r="4" fill="#ef4444"/>
  <line x1="120" y1="186" x2="120" y2="234" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="120" y="250" fill="#ef4444" font-family="sans-serif" font-size="10" text-anchor="middle">Bower ✗</text>
  <circle cx="180" cy="180" r="4" fill="#ef4444"/>
  <line x1="180" y1="186" x2="180" y2="234" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="180" y="250" fill="#ef4444" font-family="sans-serif" font-size="10" text-anchor="middle">Grunt ✗</text>
  <circle cx="240" cy="180" r="4" fill="#ef4444"/>
  <line x1="240" y1="186" x2="240" y2="234" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="240" y="250" fill="#ef4444" font-family="sans-serif" font-size="10" text-anchor="middle">Flow ✗</text>
  <circle cx="360" cy="180" r="4" fill="#ef4444"/>
  <line x1="360" y1="186" x2="360" y2="234" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="360" y="250" fill="#ef4444" font-family="sans-serif" font-size="10" text-anchor="middle">CRA ✗</text>
  <!-- Legend -->
  <circle cx="74" cy="330" r="5" fill="#915EFF"/>
  <text x="86" y="334" fill="#fff" font-family="sans-serif" font-size="11">Frameworks / Runtimes</text>
  <circle cx="260" cy="330" r="5" fill="#00cffd"/>
  <text x="272" y="334" fill="#fff" font-family="sans-serif" font-size="11">Tooling</text>
  <circle cx="340" cy="330" r="5" fill="#86efac"/>
  <text x="352" y="334" fill="#fff" font-family="sans-serif" font-size="11">Langage / Specs</text>
  <circle cx="460" cy="330" r="5" fill="#ef4444"/>
  <text x="472" y="334" fill="#fff" font-family="sans-serif" font-size="11">Disparus</text>
</svg></div>

## Ce qu'on survend : le SSR universel pour tout

Le rendu côté serveur est une technique valide pour des cas précis : sites à fort trafic organique, pages dont le contenu doit être indexé rapidement, applications où la performance perçue au premier chargement est critique. Next.js et Nuxt ont démocratisé son accessibilité — ce qui est positif.

Le problème est l'extrapolation : l'idée que tout projet devrait utiliser le SSR par défaut. Sur un dashboard d'administration interne avec authentification, le SSR n'apporte rien. Sur une application SPA derrière un login, personne ne cherche le contenu sur Google. Le surcoût de configuration, de débogage des comportements différents entre serveur et client, et d'infrastructure (le serveur Node.js qui tourne en permanence) est réel.

Les Web Components ont aussi bénéficié d'une hype disproportionnée. La promesse — des composants natifs interopérables entre tous les frameworks — est séduisante. La réalité est que le DX est encore inférieur à React ou Vue, le SSR reste complexe, et les cas d'usage justifiant ce choix restent rares. Ils ont leur place dans des design systems à partager entre projets de frameworks différents, mais c'est un cas spécifique.

## Stack recommandée selon le contexte en 2025

Pour un projet React de taille moyenne avec équipe de 2-4 développeurs : Vite + React 18 + TypeScript 5 + React Router ou TanStack Router. Pas de state management global si les données peuvent vivre en local ou dans des hooks de composants. Zustand si on en a besoin, pas Redux sauf legacy.

Pour un site à contenu SEO-critique : Next.js ou Astro. Astro mérite d'être mentionné : son approche "zéro JavaScript par défaut, interactivité opt-in" est une des rares innovations récentes qui résout un vrai problème sans en créer d'autres.

Pour une équipe qui part de zéro et veut aller vite : Vue 3 + Vite + TypeScript. La courbe est plus douce, le résultat est professionnel, et Nuxt est là si le SSR devient nécessaire.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="26" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Arbre de décision TypeScript vs JavaScript vanilla</text>
  <!-- Start -->
  <rect x="270" y="46" width="160" height="38" fill="#915EFF" rx="4"/>
  <text x="350" y="70" fill="#fff" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Nouveau projet JS</text>
  <!-- Q1 — Durée > 3 mois ? -->
  <line x1="350" y1="84" x2="350" y2="108" stroke="#64748b" stroke-width="1.5"/>
  <rect x="248" y="108" width="204" height="36" fill="#1e2a4a" rx="4"/>
  <text x="350" y="131" fill="#fff" font-family="sans-serif" font-size="11" text-anchor="middle">Durée prévue &gt; 3 mois ?</text>
  <!-- Non branch -->
  <line x1="248" y1="126" x2="130" y2="126" stroke="#64748b" stroke-width="1.5"/>
  <text x="188" y="120" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">Non</text>
  <rect x="60" y="108" width="120" height="36" fill="#0a1f0a" rx="4"/>
  <text x="120" y="131" fill="#86efac" font-family="sans-serif" font-size="11" text-anchor="middle">JS vanilla OK</text>
  <!-- Oui branch Q2 -->
  <line x1="350" y1="144" x2="350" y2="170" stroke="#64748b" stroke-width="1.5"/>
  <text x="365" y="160" fill="#64748b" font-family="sans-serif" font-size="10">Oui</text>
  <rect x="248" y="170" width="204" height="36" fill="#1e2a4a" rx="4"/>
  <text x="350" y="193" fill="#fff" font-family="sans-serif" font-size="11" text-anchor="middle">Équipe &gt; 2 développeurs ?</text>
  <!-- Non branch -->
  <line x1="248" y1="188" x2="130" y2="188" stroke="#64748b" stroke-width="1.5"/>
  <text x="188" y="182" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">Non</text>
  <rect x="60" y="170" width="120" height="36" fill="#1a1a0a" rx="4"/>
  <text x="120" y="193" fill="#fbbf24" font-family="sans-serif" font-size="11" text-anchor="middle">TS recommandé</text>
  <!-- Oui branch Q3 -->
  <line x1="350" y1="206" x2="350" y2="232" stroke="#64748b" stroke-width="1.5"/>
  <text x="365" y="222" fill="#64748b" font-family="sans-serif" font-size="10">Oui</text>
  <rect x="248" y="232" width="204" height="36" fill="#1e2a4a" rx="4"/>
  <text x="350" y="255" fill="#fff" font-family="sans-serif" font-size="11" text-anchor="middle">Code partagé / librairie ?</text>
  <!-- Non branch -->
  <line x1="248" y1="250" x2="130" y2="250" stroke="#64748b" stroke-width="1.5"/>
  <text x="188" y="244" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">Non</text>
  <rect x="60" y="232" width="120" height="36" fill="#1a1a0a" rx="4"/>
  <text x="120" y="255" fill="#fbbf24" font-family="sans-serif" font-size="11" text-anchor="middle">TS fortement conseillé</text>
  <!-- Oui branch — TS obligatoire -->
  <line x1="452" y1="250" x2="550" y2="250" stroke="#64748b" stroke-width="1.5"/>
  <text x="500" y="244" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">Oui</text>
  <rect x="550" y="232" width="130" height="36" fill="#0a1f2a" rx="4"/>
  <text x="615" y="255" fill="#00cffd" font-family="sans-serif" font-size="11" text-anchor="middle">TypeScript obligatoire</text>
  <!-- Final recommendation -->
  <rect x="270" y="296" width="160" height="46" fill="#1e3a5a" rx="4"/>
  <text x="350" y="316" fill="#fff" font-family="sans-serif" font-size="11" text-anchor="middle">Conclusion :</text>
  <text x="350" y="332" fill="#00cffd" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">TypeScript par défaut</text>
  <line x1="120" y1="268" x2="120" y2="319" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="120" y1="319" x2="270" y2="319" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="615" y1="268" x2="615" y2="319" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="615" y1="319" x2="430" y2="319" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
</svg></div>

## Ce que je retiens de six ans de projets JavaScript

La tendance de fond est positive : JavaScript en 2025 est un langage plus sûr, plus lisible et plus rapide à utiliser qu'il ne l'était en 2019. TypeScript a mûri au point d'être la configuration par défaut plutôt qu'une option avancée. Vite a résolu le problème du build lent. ESM natif simplifie la configuration pour les projets simples.

Ce qui n'a pas changé : la nécessité de choisir ses outils selon le projet et non selon ce qui fait du bruit sur les réseaux. Le SSR n'est pas universel. Les Web Components ne remplacent pas les frameworks. Et écrire du JavaScript vanilla reste la meilleure façon de comprendre ce que les frameworks font réellement sous le capot.

> **En résumé** — ESM natif, top-level await et TypeScript 5+ ont changé concrètement la façon d'écrire du JavaScript en 2025. Vite a remplacé Webpack sur les nouveaux projets. Le SSR universel reste sur-vendu pour les applications derrière authentification. La bonne stack dépend du contexte, pas de la tendance du moment.
