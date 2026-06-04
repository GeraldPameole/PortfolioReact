---
title: "Développement web en 2026 : ce qui s'est imposé, ce qui s'est essoufflé"
description: "React Server Components, React Compiler, edge, Astro 5 Server Islands, View Transitions, Bun, AI-assisted dev, CSS moderne, fin de jQuery, impact AEO/SGE — l'état réel du web mi-2026."
publishDate: "2025-03-17"
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

## Là où on en est, vraiment

Mi-2026, l'écosystème web s'est largement clarifié. Beaucoup d'annonces des dernières années sont passées du statut de pari à celui de pratique courante — ou se sont éteintes sans bruit. Après avoir vu défiler les promesses depuis mes années chez ACTIV PARTNERS puis chez KEOS TELECOM, ma boussole reste la même : ce qui compte, c'est ce qui change le code que vous écrivez lundi matin, pas ce qui remplit les keynotes.

Ce qui suit, c'est une lecture honnête de ce qui s'est imposé en production, de ce qui reste en marge malgré la hype, et de quelques basculements silencieux qu'on a tendance à sous-estimer.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" style="max-width:100%;height:auto">
  <rect width="720" height="360" fill="#0a0f2e"/>
  <text x="360" y="30" font-family="monospace" font-size="14" fill="#86efac" text-anchor="middle" font-weight="bold">TIMELINE D'ADOPTION 2024 -&gt; 2026</text>
  <text x="360" y="48" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="middle">ce qui est devenu mainstream, ce qui plafonne, ce qui s'éteint</text>
  <line x1="60" y1="180" x2="680" y2="180" stroke="#1a1f4e" stroke-width="2"/>
  <text x="120" y="200" font-family="monospace" font-size="10" fill="#7a7a9a" text-anchor="middle">2024</text>
  <text x="280" y="200" font-family="monospace" font-size="10" fill="#7a7a9a" text-anchor="middle">2025</text>
  <text x="440" y="200" font-family="monospace" font-size="10" fill="#7a7a9a" text-anchor="middle">mi-2025</text>
  <text x="600" y="200" font-family="monospace" font-size="10" fill="#7a7a9a" text-anchor="middle">mi-2026</text>
  <circle cx="120" cy="180" r="4" fill="#7a7a9a"/>
  <circle cx="280" cy="180" r="4" fill="#7a7a9a"/>
  <circle cx="440" cy="180" r="4" fill="#7a7a9a"/>
  <circle cx="600" cy="180" r="4" fill="#7a7a9a"/>
  <rect x="100" y="80" width="180" height="22" rx="3" fill="#86efac" opacity="0.25"/>
  <text x="110" y="95" font-family="sans-serif" font-size="10" fill="#86efac">RSC -&gt; mainstream (Next App Router)</text>
  <line x1="190" y1="102" x2="190" y2="178" stroke="#86efac" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
  <rect x="300" y="110" width="220" height="22" rx="3" fill="#00cffd" opacity="0.25"/>
  <text x="310" y="125" font-family="sans-serif" font-size="10" fill="#00cffd">React Compiler stable / Astro 5 Server Islands</text>
  <line x1="410" y1="132" x2="410" y2="178" stroke="#00cffd" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
  <rect x="440" y="140" width="240" height="22" rx="3" fill="#915EFF" opacity="0.25"/>
  <text x="450" y="155" font-family="sans-serif" font-size="10" fill="#915EFF">View Transitions cross-doc Chromium / Bun 1.x prod</text>
  <line x1="560" y1="162" x2="560" y2="178" stroke="#915EFF" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
  <rect x="100" y="218" width="160" height="22" rx="3" fill="#fbbf24" opacity="0.25"/>
  <text x="110" y="233" font-family="sans-serif" font-size="10" fill="#fbbf24">AI-assisted dev (Copilot, Cursor)</text>
  <line x1="180" y1="218" x2="180" y2="180" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
  <rect x="280" y="248" width="200" height="22" rx="3" fill="#fbbf24" opacity="0.4"/>
  <text x="290" y="263" font-family="sans-serif" font-size="10" fill="#fbbf24">Claude Code / Windsurf / Copilot Workspace</text>
  <line x1="380" y1="248" x2="380" y2="180" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
  <rect x="500" y="278" width="180" height="22" rx="3" fill="#ff6b6b" opacity="0.3"/>
  <text x="510" y="293" font-family="sans-serif" font-size="10" fill="#ff6b6b">jQuery -&gt; sortie de scène (WP bouge)</text>
  <line x1="590" y1="278" x2="590" y2="180" stroke="#ff6b6b" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
  <text x="360" y="340" font-family="monospace" font-size="9" fill="#fbbf24" text-anchor="middle">Au-dessus de la timeline : ce qui s'est imposé. En dessous : adoption progressive et fin de cycle.</text>
</svg></div>

## React Server Components : le débat est clos

Pendant deux ans, on a parlé des RSC comme d'un pari de Vercel. En 2026, ils tournent en production sur la majorité des projets Next.js neufs en App Router. La question n'est plus "faut-il y aller" mais "où placer la frontière `'use client'`". Et c'est tant mieux : l'argument central — réduire la charge JS envoyée au client en gardant le rendu côté serveur pour les composants non interactifs — s'est vérifié sur des projets réels. INP s'améliore mécaniquement parce qu'il y a moins de hydratation.

Ce que j'observe en pratique : les équipes qui s'en sortent le mieux sont celles qui ont arrêté de tout vouloir convertir en RSC (React Server Components) dès le départ. Le bon réflexe, c'est de partir d'un layout serveur et de basculer en client uniquement ce qui a besoin d'état ou de gestionnaires d'événements. Les erreurs récurrentes (data fetching dupliqué, props non sérialisables, boundaries client mal placées) sont devenues moins fréquentes parce que les outils (devtools, ESLint plugin) ont rattrapé le retard.

L'autre changement, plus silencieux : Remix s'est aligné dans la même direction depuis sa fusion avec React Router v7. Les patterns convergent. C'est sain pour l'écosystème.

## React Compiler stable : ce qui change vraiment dans le quotidien

Le React Compiler est passé stable. Concrètement, ça veut dire qu'on peut supprimer la majorité des `useMemo`, `useCallback` et `React.memo` qui polluaient le code depuis des années. Le compilateur fait le travail de mémoïsation au build, de façon plus fine et plus correcte que ce qu'un humain fait à la main.

Sur les projets où je l'ai vu adopté, le bénéfice n'est pas tant la performance — qui était déjà acceptable avec une mémoïsation manuelle bien faite — que la lisibilité. On revient à du React qui ressemble à ce que la documentation montrait il y a dix ans : des composants simples, sans cérémonie. Pour les nouveaux développeurs qui rejoignent une équipe, c'est un gain énorme.

La limite : il faut un codebase qui respecte les Rules of React. Si vous mutez des props ou que vous lisez des refs pendant le rendu, le compilateur refusera de mémoïser le composant en question. Ce n'est pas une régression — c'est juste que le compilateur révèle des problèmes qui étaient là avant.

## Edge computing : mainstream sans drame

Vercel Edge Functions, Cloudflare Workers, Fastly Compute — ce qui était expérimental en 2023 est devenu un défaut raisonnable en 2026 pour tout middleware. Auth, redirections géographiques, A/B testing, personnalisation légère : c'est de l'edge par défaut, sans qu'on en parle.

Le vrai changement de l'année, c'est que Cloudflare Workers ont stabilisé leur accès aux bases de données (D1, Hyperdrive pour Postgres). Le verrou historique de l'edge — "pas de TCP, pas de Postgres" — s'est largement levé. On peut faire tourner une API (Application Programming Interface) complète à la périphérie sans contorsions.

Cela dit, le bon sens reste le bon sens. Les workloads qui demandent de la mémoire, du long-running ou des connexions persistantes (WebSockets stateful, traitement batch) restent mieux servis par un serveur dédié ou du serverless classique. Choisir l'edge par défaut sans savoir pourquoi, c'est encore une erreur fréquente.

## Astro 5 Server Islands : l'architecture islands évolue

Astro 5 a généralisé les Server Islands. C'est l'évolution naturelle de l'architecture islands : au lieu de tout pré-rendre statiquement ou tout faire côté client, on rend une page statique avec des "trous" qui sont remplis à la demande par le serveur — typiquement pour du contenu personnalisé, du panier e-commerce, des données utilisateur.

L'intérêt pratique : on garde un cache CDN agressif sur 95 % de la page, et on ne paie le coût d'un appel serveur que pour les zones qui en ont vraiment besoin. C'est ce dont avaient besoin les sites de contenu avec une touche d'interactivité — exactement le segment où Astro performe.

Combiné aux Content Layer API stabilisées, Astro est devenu un choix sérieux pour les sites éditoriaux, les blogs et la documentation technique. Ce site lui-même tourne dessus, et le ratio (vitesse de build, simplicité du modèle mental, qualité du DX) reste imbattable pour ce cas d'usage.

## View Transitions : presque partout, sauf chez Safari

L'API View Transitions s'est imposée comme la façon standard de faire des transitions entre états de page. En SPA, l'intégration via les routers (React Router, Next.js, TanStack Router) est devenue triviale. Pour les MPA, le support cross-document est solide sur Chrome, Edge, et tout Chromium depuis maintenant deux ans.

Le bémol, qui dure : Safari traîne. WebKit a annoncé l'implémentation, elle est en cours, mais elle n'est pas livrée en stable au moment où j'écris. La bonne nouvelle, c'est que View Transitions est conçue pour dégrader gracieusement — sans support, la navigation se fait sans animation, point. C'est exactement ce qu'on attend d'une amélioration progressive.

Astro a intégré View Transitions de façon framework-agnostique depuis la v3 et continue à raffiner l'API. Sur les sites de contenu, c'est devenu un standard de fait.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" style="max-width:100%;height:auto">
  <rect width="720" height="360" fill="#0a0f2e"/>
  <text x="360" y="30" font-family="monospace" font-size="14" fill="#86efac" text-anchor="middle" font-weight="bold">SUPPORT NAVIGATEUR — APIs MODERNES MI-2026</text>
  <text x="360" y="48" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="middle">vert : supporté ; orange : partiel ou drapeau ; rouge : absent</text>
  <text x="220" y="80" font-family="monospace" font-size="10" fill="#86efac" text-anchor="middle">Chrome</text>
  <text x="320" y="80" font-family="monospace" font-size="10" fill="#86efac" text-anchor="middle">Edge</text>
  <text x="420" y="80" font-family="monospace" font-size="10" fill="#86efac" text-anchor="middle">Firefox</text>
  <text x="520" y="80" font-family="monospace" font-size="10" fill="#86efac" text-anchor="middle">Safari</text>
  <text x="620" y="80" font-family="monospace" font-size="10" fill="#86efac" text-anchor="middle">Mobile</text>
  <line x1="40" y1="90" x2="700" y2="90" stroke="#1a1f4e" stroke-width="1"/>
  <text x="40" y="115" font-family="sans-serif" font-size="10" fill="#c4c4c4">CSS Container Queries</text>
  <circle cx="220" cy="112" r="9" fill="#86efac"/><circle cx="320" cy="112" r="9" fill="#86efac"/><circle cx="420" cy="112" r="9" fill="#86efac"/><circle cx="520" cy="112" r="9" fill="#86efac"/><circle cx="620" cy="112" r="9" fill="#86efac"/>
  <text x="40" y="145" font-family="sans-serif" font-size="10" fill="#c4c4c4">CSS :has()</text>
  <circle cx="220" cy="142" r="9" fill="#86efac"/><circle cx="320" cy="142" r="9" fill="#86efac"/><circle cx="420" cy="142" r="9" fill="#86efac"/><circle cx="520" cy="142" r="9" fill="#86efac"/><circle cx="620" cy="142" r="9" fill="#86efac"/>
  <text x="40" y="175" font-family="sans-serif" font-size="10" fill="#c4c4c4">CSS Subgrid</text>
  <circle cx="220" cy="172" r="9" fill="#86efac"/><circle cx="320" cy="172" r="9" fill="#86efac"/><circle cx="420" cy="172" r="9" fill="#86efac"/><circle cx="520" cy="172" r="9" fill="#86efac"/><circle cx="620" cy="172" r="9" fill="#86efac"/>
  <text x="40" y="205" font-family="sans-serif" font-size="10" fill="#c4c4c4">Cascade Layers</text>
  <circle cx="220" cy="202" r="9" fill="#86efac"/><circle cx="320" cy="202" r="9" fill="#86efac"/><circle cx="420" cy="202" r="9" fill="#86efac"/><circle cx="520" cy="202" r="9" fill="#86efac"/><circle cx="620" cy="202" r="9" fill="#86efac"/>
  <text x="40" y="235" font-family="sans-serif" font-size="10" fill="#c4c4c4">View Transitions (same-doc)</text>
  <circle cx="220" cy="232" r="9" fill="#86efac"/><circle cx="320" cy="232" r="9" fill="#86efac"/><circle cx="420" cy="232" r="9" fill="#fbbf24"/><circle cx="520" cy="232" r="9" fill="#fbbf24"/><circle cx="620" cy="232" r="9" fill="#fbbf24"/>
  <text x="40" y="265" font-family="sans-serif" font-size="10" fill="#c4c4c4">View Transitions (cross-doc)</text>
  <circle cx="220" cy="262" r="9" fill="#86efac"/><circle cx="320" cy="262" r="9" fill="#86efac"/><circle cx="420" cy="262" r="9" fill="#fbbf24"/><circle cx="520" cy="262" r="9" fill="#ff6b6b"/><circle cx="620" cy="262" r="9" fill="#fbbf24"/>
  <text x="40" y="295" font-family="sans-serif" font-size="10" fill="#c4c4c4">Popover API</text>
  <circle cx="220" cy="292" r="9" fill="#86efac"/><circle cx="320" cy="292" r="9" fill="#86efac"/><circle cx="420" cy="292" r="9" fill="#86efac"/><circle cx="520" cy="292" r="9" fill="#86efac"/><circle cx="620" cy="292" r="9" fill="#86efac"/>
  <text x="40" y="325" font-family="sans-serif" font-size="10" fill="#c4c4c4">Anchor Positioning</text>
  <circle cx="220" cy="322" r="9" fill="#86efac"/><circle cx="320" cy="322" r="9" fill="#86efac"/><circle cx="420" cy="322" r="9" fill="#fbbf24"/><circle cx="520" cy="322" r="9" fill="#ff6b6b"/><circle cx="620" cy="322" r="9" fill="#fbbf24"/>
  <text x="360" y="352" font-family="monospace" font-size="9" fill="#fbbf24" text-anchor="middle">Source : caniuse.com — état mi-2026, Safari reste le frein principal sur les APIs récentes</text>
</svg></div>

## Bun 1.x : un runtime alternatif qui a trouvé sa niche

Bun s'est stabilisé en série 1.x avec une compatibilité Node très bonne, un installeur de paquets nettement plus rapide que npm/pnpm, et un test runner intégré qui rend Vitest optionnel sur beaucoup de projets. Sur les workflows de CI et les scripts internes, c'est devenu un choix sérieux.

Là où je le recommande : tooling de dev, scripts one-shot, monorepos avec beaucoup de paquets (l'install est sans commune mesure). Là où je suis plus prudent : runtime de production pour des applis web critiques. Node reste la valeur sûre, son écosystème de monitoring/observabilité est plus mûr, et le LTS donne une garantie de stabilité que Bun n'offre pas encore au même niveau.

Deno aussi a continué d'évoluer (Deno 2 avec compatibilité Node), mais reste un choix de niche. Le marché s'est largement consolidé autour de Node + Bun pour le tooling.

## AI-assisted dev : la productivité réelle, pas la promesse

C'est probablement le changement de pratique le plus profond depuis mon dernier état des lieux. Cursor, Claude Code, Windsurf, GitHub Copilot Workspace — les assistants IA ne sont plus une option qu'on essaie le week-end, ils sont dans le quotidien des équipes actives. La question n'est plus "est-ce que ça marche" mais "comment l'utiliser sans perdre la maîtrise".

Ce qui fonctionne objectivement : génération de boilerplate, écriture de tests à partir d'une signature, refactor à grande échelle sur des patterns récurrents, exploration d'un codebase qu'on ne connaît pas, traduction de tickets en plans d'implémentation. Sur ces tâches, le gain de temps est mesurable et non contestable.

Ce qui ne fonctionne toujours pas : déléguer des décisions d'architecture, accepter du code sans le lire, traiter l'IA comme un substitut à la réflexion. Les équipes qui se font piéger sont celles qui accélèrent la production sans accélérer la compréhension. La dette technique générée par IA est plus rapide à produire que la dette humaine — c'est sa principale différence.

Mon usage personnel : l'IA est un excellent multiplicateur quand je sais ce que je veux et que je peux juger le résultat. Elle est dangereuse quand je l'utilise pour découvrir une solution dans un domaine que je ne maîtrise pas — parce qu'à ce moment-là, je n'ai pas les moyens de détecter ses erreurs.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 400" style="max-width:100%;height:auto">
  <rect width="720" height="400" fill="#0a0f2e"/>
  <text x="360" y="30" font-family="monospace" font-size="14" fill="#86efac" text-anchor="middle" font-weight="bold">MATRICE IMPACT / EFFORT — TECHS À ADOPTER MI-2026</text>
  <text x="360" y="48" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="middle">décider quoi prioriser sur un projet existant ou neuf</text>
  <line x1="80" y1="80" x2="80" y2="350" stroke="#1a1f4e" stroke-width="1.5"/>
  <line x1="80" y1="350" x2="680" y2="350" stroke="#1a1f4e" stroke-width="1.5"/>
  <text x="50" y="90" font-family="monospace" font-size="10" fill="#7a7a9a" text-anchor="middle">IMPACT</text>
  <text x="50" y="105" font-family="monospace" font-size="9" fill="#7a7a9a" text-anchor="middle">haut</text>
  <text x="50" y="340" font-family="monospace" font-size="9" fill="#7a7a9a" text-anchor="middle">bas</text>
  <text x="80" y="370" font-family="monospace" font-size="9" fill="#7a7a9a" text-anchor="middle">faible</text>
  <text x="680" y="370" font-family="monospace" font-size="9" fill="#7a7a9a" text-anchor="middle">élevé</text>
  <text x="380" y="385" font-family="monospace" font-size="10" fill="#7a7a9a" text-anchor="middle">EFFORT D'ADOPTION</text>
  <line x1="380" y1="80" x2="380" y2="350" stroke="#1a1f4e" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="80" y1="215" x2="680" y2="215" stroke="#1a1f4e" stroke-width="0.5" stroke-dasharray="3,3"/>
  <text x="230" y="100" font-family="monospace" font-size="8" fill="#86efac" text-anchor="middle" opacity="0.6">QUICK WIN</text>
  <text x="530" y="100" font-family="monospace" font-size="8" fill="#fbbf24" text-anchor="middle" opacity="0.6">PROJET STRATÉGIQUE</text>
  <text x="230" y="335" font-family="monospace" font-size="8" fill="#915EFF" text-anchor="middle" opacity="0.6">À FAIRE PASSIVEMENT</text>
  <text x="530" y="335" font-family="monospace" font-size="8" fill="#ff6b6b" text-anchor="middle" opacity="0.6">À ÉVITER</text>
  <circle cx="170" cy="135" r="8" fill="#86efac"/>
  <text x="180" y="138" font-family="sans-serif" font-size="10" fill="#86efac">CSS :has() / Container Queries</text>
  <circle cx="220" cy="160" r="8" fill="#86efac"/>
  <text x="232" y="163" font-family="sans-serif" font-size="10" fill="#86efac">React Compiler</text>
  <circle cx="280" cy="190" r="8" fill="#86efac"/>
  <text x="292" y="193" font-family="sans-serif" font-size="10" fill="#86efac">View Transitions (SPA)</text>
  <circle cx="450" cy="130" r="8" fill="#fbbf24"/>
  <text x="462" y="133" font-family="sans-serif" font-size="10" fill="#fbbf24">RSC / Next App Router</text>
  <circle cx="520" cy="160" r="8" fill="#fbbf24"/>
  <text x="532" y="163" font-family="sans-serif" font-size="10" fill="#fbbf24">Astro 5 Server Islands</text>
  <circle cx="480" cy="190" r="8" fill="#fbbf24"/>
  <text x="492" y="193" font-family="sans-serif" font-size="10" fill="#fbbf24">AI-assisted dev (workflow)</text>
  <circle cx="180" cy="250" r="8" fill="#915EFF"/>
  <text x="192" y="253" font-family="sans-serif" font-size="10" fill="#915EFF">TypeScript type stripping Node 22</text>
  <circle cx="220" cy="280" r="8" fill="#915EFF"/>
  <text x="232" y="283" font-family="sans-serif" font-size="10" fill="#915EFF">Bun pour CI / scripts</text>
  <circle cx="180" cy="310" r="8" fill="#915EFF"/>
  <text x="192" y="313" font-family="sans-serif" font-size="10" fill="#915EFF">Cascade Layers</text>
  <circle cx="540" cy="260" r="8" fill="#ff6b6b"/>
  <text x="552" y="263" font-family="sans-serif" font-size="10" fill="#ff6b6b">Migration vers HTMX</text>
  <circle cx="580" cy="295" r="8" fill="#ff6b6b"/>
  <text x="468" y="298" font-family="sans-serif" font-size="10" fill="#ff6b6b" text-anchor="end">Web Components (Lit) -&gt;</text>
</svg></div>

## HTMX : la hype n'a pas rencontré l'adoption

Soyons honnêtes : HTMX est une bibliothèque intelligente, bien pensée, qui répond à un vrai problème pour un certain type de projets — typiquement les applis CRUD côté serveur, en Django, Rails ou PHP, où on veut un peu d'interactivité sans embarquer un framework JS complet. Le discours autour de HTMX a été fort, parfois presque militant.

Mais à mi-2026, l'adoption reste niche. Sur les offres d'emploi front, on ne voit pas HTMX. Sur les projets sérieux en équipe, on ne le voit pas non plus. Les sondages State of JS continuent de le placer parmi les outils "connus de nom mais pas utilisés". Ce n'est pas un échec — c'est juste que son public n'a jamais été le développeur React qui voulait une alternative. Son public, c'est le développeur backend qui voulait éviter le JS, et ce public utilisait déjà Turbo (Rails) ou Livewire (Laravel) avant.

À retenir : HTMX est un bon outil pour les bons projets. Mais il n'a pas remplacé React, il ne l'a même pas érodé. La hype a été disproportionnée par rapport à la traction réelle.

## Web Components et Lit : qualité technique, adoption marginale

Même constat, formulé différemment. Lit est une excellente bibliothèque. Les Web Components sont un standard du W3C, supportés nativement dans tous les navigateurs depuis des années. Et pourtant, en 2026, les Web Components restent une technologie de niche : design systems d'entreprise (Salesforce, Adobe, GitHub), composants embarquables dans des contextes hétérogènes (widgets, plugins CMS).

Pour le développement applicatif courant, React, Vue et Svelte dominent toujours. Ce n'est pas un problème technique des Web Components — c'est un problème d'écosystème. Le modèle de réactivité, le tooling, la communauté n'ont jamais atteint la masse critique nécessaire.

Mon conseil : utilisez Web Components quand vous avez besoin d'interopérabilité entre frameworks ou de composants vraiment portables. N'imposez pas une migration entière vers Lit en espérant une révolution qui ne viendra pas.

## CSS moderne : on a enfin des outils à la hauteur

Sur le CSS pur, 2026 est la meilleure année depuis longtemps. La quasi-totalité des features qui faisaient rêver il y a cinq ans sont disponibles partout :

- **Container Queries** : adoption généralisée, plus aucune raison de s'en passer pour des composants réutilisables.
- **`:has()`** : supporté partout, débloque des patterns de sélection qui demandaient du JS avant.
- **Subgrid** : on aligne enfin des éléments enfants sur une grille parente sans hack.
- **Cascade Layers** : fin des guerres de spécificité dans les codebases moyennes ou grandes.
- **View Transitions CSS** : on déclare des transitions entre états directement dans la feuille de style, sans toucher au JS.
- **Popover API et Anchor Positioning** : tooltips, menus, modales en HTML/CSS pur, avec gestion native du focus et de la position.

Le résultat concret : on écrit moins de JavaScript pour de l'UI. Beaucoup de composants qui demandaient une bibliothèque (Floating UI, Headless UI) sont maintenant faisables en HTML/CSS natif. C'est un gain pour la performance et pour la maintenabilité.

## TypeScript 5.7+ et le type stripping natif

TypeScript continue d'évoluer, mais le vrai événement, c'est côté Node : depuis Node 22, l'exécution directe de fichiers `.ts` avec stripping natif des types est disponible (`--experimental-strip-types` puis stable). En clair, on peut lancer un script TypeScript sans transpilation, sans ts-node, sans tsx. Pour les scripts internes, le tooling, les outils CLI, c'est un changement de paradigme silencieux.

Pour les projets applicatifs, on continue de compiler (parce qu'on veut quand même un bundle optimisé), mais la friction "TypeScript = configuration compliquée" disparaît sur les petits projets et les scripts. C'est exactement ce que TypeScript avait besoin pour finir d'éliminer JavaScript pur de l'équation.

TypeScript reste utilisé strictement par les équipes sérieuses (config `strict: true`, Zod pour la validation à la frontière, contrats typés bout en bout). La valeur réelle est toujours là où elle a toujours été : dans la profondeur du typage, pas dans le simple fait d'écrire du `.ts`.

## La fin de l'ère jQuery, vraiment cette fois

Ça fait dix ans qu'on annonce la mort de jQuery. En 2026, c'est devenu un fait observable. WordPress, qui était la dernière grande forteresse, a publié sa roadmap pour sortir progressivement jQuery du cœur. Les blocks Gutenberg modernes n'en dépendent plus, et l'équipe core a clairement annoncé une dépréciation progressive sur les prochaines majeures.

Concrètement : si vous démarrez un projet en 2026, vous n'avez plus aucune bonne raison d'inclure jQuery. Tout ce qu'il faisait (sélection DOM, manipulation, AJAX, animations) est faisable en JavaScript natif moderne avec moins de code. Les bibliothèques tierces qui dépendent encore de jQuery (anciens plugins WordPress, anciens scripts d'analyse) deviennent des dettes techniques qu'il faut planifier de remplacer.

Ce n'est pas une victoire morale, c'est juste l'aboutissement d'une transition de quinze ans. Mais c'est bien de le dire clairement : jQuery, c'est fini.

## AEO / SGE : le séisme silencieux du SEO

C'est probablement le changement le moins discuté techniquement, et le plus structurant pour l'architecture des sites de contenu. Avec la généralisation des AI Overviews de Google (SGE), de Perplexity, de ChatGPT comme moteur de recherche par habitude, le trafic SEO (Search Engine Optimization, référencement naturel) informationnel s'est effondré. Les requêtes "comment faire X", "qu'est-ce que Y", "différence entre A et B" — l'utilisateur n'a plus besoin de cliquer. La réponse est dans la SERP.

Pour les sites de contenu, l'impact est brutal et mesurable. Beaucoup de blogs informationnels ont perdu 40 à 70 % de leur trafic organique en deux ans. Les sites qui résistent sont ceux qui apportent quelque chose qu'une IA ne peut pas synthétiser : opinion forte, retour d'expérience original, données primaires, identité éditoriale claire.

Conséquences sur l'architecture web :

- **Performance pure (Core Web Vitals)** : son importance relative diminue, parce que le trafic baisse. Ça reste un facteur, mais ce n'est plus le levier principal.
- **Schema.org et données structurées** : leur valeur augmente, parce qu'elles aident à apparaître dans les réponses synthétisées (AEO — Answer Engine Optimization).
- **Architecture éditoriale** : on optimise moins pour des mots-clés génériques, plus pour des pages d'autorité riches qu'on peut citer.
- **Newsletter, communauté, distribution directe** : redeviennent essentielles parce que le canal SEO a perdu de sa fiabilité.

Pour les développeurs, ça change la priorisation. Investir massivement dans du SEO technique sur un site informationnel, en 2026, c'est plus risqué qu'investir dans une stratégie de contenu différenciante. Le code propre, c'est nécessaire mais ce n'est plus suffisant.

## Ce qu'il faut retenir

Mi-2026, l'écosystème web a fait le tri. RSC, React Compiler, edge, Astro 5, View Transitions, CSS moderne — autant de techs qui se sont imposées par l'usage, pas par le marketing. AI-assisted dev a changé en profondeur la manière dont on code, à condition de garder la main sur ce qu'on produit. Bun a trouvé sa niche, TypeScript a fini d'éliminer JS pur sur les scripts. Et jQuery est enfin en train de quitter la scène.

À l'inverse, HTMX et les Web Components restent des bons outils pour des niches précises, sans avoir atteint l'adoption massive promise. Et le grand bouleversement silencieux, c'est l'effondrement du trafic SEO informationnel sous l'effet des moteurs de réponse IA — qui force à repenser ce qu'on optimise vraiment quand on construit un site de contenu.

> **À retenir** — La meilleure veille n'est pas celle qui suit tout. C'est celle qui aide à décider quoi ignorer. En 2026, on peut ignorer beaucoup de hype et se concentrer sur trois choses : maîtriser RSC + React Compiler si on est sur Next, exploiter CSS moderne à fond, et accepter que l'IA est devenue un outil de travail à part entière qu'il faut apprendre à manier avec discipline.
