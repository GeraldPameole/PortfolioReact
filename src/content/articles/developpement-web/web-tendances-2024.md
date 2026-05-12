---
title: "Web 2025 : ce qui a vraiment changé (et ce qui ne change pas encore)"
description: "INP remplace FID dans les Core Web Vitals, View Transitions API, CSS Container Queries, AI UI en pratique — ce que ça change concrètement pour les projets."
publishDate: "2025-03-17"
type: article
domain: developpement-web
image: "/images/themes/dev-web.jpg"
pillColor: green
relatedArticles:
  - domain: developpement-web
  - pillColor: green
  - theme: technologie
  - keywords:
theme: technologie
tags:
  - developpement-web
  - javascript
  - frontend
  - web

---

## Ce qui a vraiment changé en 2025

Depuis que je travaille sur des projets web chez ACTIV PARTNERS, j'ai appris à faire la différence entre les tendances qui changent vraiment le quotidien du développement et celles qui sont surtout actives dans les conférences et les articles de blog. En 2025, quelques évolutions méritent l'attention parce qu'elles sont déjà en production dans les navigateurs modernes et qu'elles ont un impact mesurable.

La métrique INP qui remplace FID dans les Core Web Vitals, les View Transitions API, les CSS Container Queries — ce ne sont pas des propositions spéculatives. Ce sont des APIs disponibles, avec des seuils définis par Google, et des taux de support cross-browser qui rendent leur utilisation viable dès aujourd'hui.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="30" font-family="monospace" font-size="14" fill="#86efac" text-anchor="middle" font-weight="bold">CORE WEB VITALS 2025 — SEUILS ET IMPACT UX</text>
  <!-- Column headers -->
  <text x="130" y="58" font-family="sans-serif" font-size="10" fill="#7a7a9a" text-anchor="middle">Métrique</text>
  <text x="270" y="58" font-family="monospace" font-size="10" fill="#86efac" text-anchor="middle">Good</text>
  <text x="400" y="58" font-family="monospace" font-size="10" fill="#fbbf24" text-anchor="middle">Needs Work</text>
  <text x="530" y="58" font-family="monospace" font-size="10" fill="#ff6b6b" text-anchor="middle">Poor</text>
  <text x="645" y="58" font-family="sans-serif" font-size="10" fill="#c4c4c4" text-anchor="middle">Impact UX</text>
  <line x1="30" y1="65" x2="680" y2="65" stroke="#1a1f4e" stroke-width="1"/>
  <!-- LCP Row -->
  <rect x="30" y="70" width="650" height="72" rx="4" fill="#0f1535"/>
  <text x="130" y="95" font-family="sans-serif" font-size="11" fill="#c4c4c4" text-anchor="middle" font-weight="bold">LCP</text>
  <text x="130" y="113" font-family="monospace" font-size="8" fill="#7a7a9a" text-anchor="middle">Largest Contentful Paint</text>
  <text x="130" y="128" font-family="sans-serif" font-size="8" fill="#7a7a9a" text-anchor="middle">Vitesse d'affichage contenu</text>
  <rect x="210" y="78" width="120" height="24" rx="3" fill="#86efac" opacity="0.25"/>
  <text x="270" y="94" font-family="monospace" font-size="11" fill="#86efac" text-anchor="middle">&lt; 2.5s</text>
  <rect x="340" y="78" width="120" height="24" rx="3" fill="#fbbf24" opacity="0.2"/>
  <text x="400" y="94" font-family="monospace" font-size="10" fill="#fbbf24" text-anchor="middle">2.5s – 4s</text>
  <rect x="470" y="78" width="120" height="24" rx="3" fill="#ff4040" opacity="0.15"/>
  <text x="530" y="94" font-family="monospace" font-size="11" fill="#ff6b6b" text-anchor="middle">&gt; 4s</text>
  <text x="645" y="95" font-family="sans-serif" font-size="8" fill="#c4c4c4" text-anchor="middle">Perception de rapidité</text>
  <text x="645" y="110" font-family="sans-serif" font-size="8" fill="#7a7a9a" text-anchor="middle">1er contenu visible = confiance</text>
  <!-- INP Row -->
  <rect x="30" y="148" width="650" height="72" rx="4" fill="#12183a"/>
  <text x="130" y="173" font-family="sans-serif" font-size="11" fill="#c4c4c4" text-anchor="middle" font-weight="bold">INP</text>
  <text x="130" y="191" font-family="monospace" font-size="8" fill="#915EFF" text-anchor="middle">Interaction to Next Paint</text>
  <text x="130" y="206" font-family="sans-serif" font-size="8" fill="#915EFF" text-anchor="middle">Remplace FID (mars 2024)</text>
  <rect x="210" y="156" width="120" height="24" rx="3" fill="#86efac" opacity="0.25"/>
  <text x="270" y="172" font-family="monospace" font-size="11" fill="#86efac" text-anchor="middle">&lt; 200ms</text>
  <rect x="340" y="156" width="120" height="24" rx="3" fill="#fbbf24" opacity="0.2"/>
  <text x="400" y="172" font-family="monospace" font-size="10" fill="#fbbf24" text-anchor="middle">200 – 500ms</text>
  <rect x="470" y="156" width="120" height="24" rx="3" fill="#ff4040" opacity="0.15"/>
  <text x="530" y="172" font-family="monospace" font-size="11" fill="#ff6b6b" text-anchor="middle">&gt; 500ms</text>
  <text x="645" y="173" font-family="sans-serif" font-size="8" fill="#c4c4c4" text-anchor="middle">Réactivité aux clics</text>
  <text x="645" y="188" font-family="sans-serif" font-size="8" fill="#7a7a9a" text-anchor="middle">Chaque interaction mesurée</text>
  <!-- CLS Row -->
  <rect x="30" y="226" width="650" height="72" rx="4" fill="#0f1535"/>
  <text x="130" y="251" font-family="sans-serif" font-size="11" fill="#c4c4c4" text-anchor="middle" font-weight="bold">CLS</text>
  <text x="130" y="269" font-family="monospace" font-size="8" fill="#7a7a9a" text-anchor="middle">Cumulative Layout Shift</text>
  <text x="130" y="284" font-family="sans-serif" font-size="8" fill="#7a7a9a" text-anchor="middle">Stabilité visuelle</text>
  <rect x="210" y="234" width="120" height="24" rx="3" fill="#86efac" opacity="0.25"/>
  <text x="270" y="250" font-family="monospace" font-size="11" fill="#86efac" text-anchor="middle">&lt; 0.1</text>
  <rect x="340" y="234" width="120" height="24" rx="3" fill="#fbbf24" opacity="0.2"/>
  <text x="400" y="250" font-family="monospace" font-size="10" fill="#fbbf24" text-anchor="middle">0.1 – 0.25</text>
  <rect x="470" y="234" width="120" height="24" rx="3" fill="#ff4040" opacity="0.15"/>
  <text x="530" y="250" font-family="monospace" font-size="11" fill="#ff6b6b" text-anchor="middle">&gt; 0.25</text>
  <text x="645" y="251" font-family="sans-serif" font-size="8" fill="#c4c4c4" text-anchor="middle">Frustration des clics ratés</text>
  <text x="645" y="266" font-family="sans-serif" font-size="8" fill="#7a7a9a" text-anchor="middle">Éléments qui bougent = rage</text>
  <!-- Bottom note -->
  <text x="350" y="322" font-family="monospace" font-size="9" fill="#fbbf24" text-anchor="middle">INP = changement majeur : FID ne mesurait qu'une interaction, INP mesure toutes les interactions</text>
  <text x="350" y="340" font-family="sans-serif" font-size="8" fill="#7a7a9a" text-anchor="middle">Source : web.dev/vitals — seuils officiels Google 2025</text>
</svg></div>

## INP remplace FID : ce que ça change en pratique

Le remplacement de FID (First Input Delay) par INP (Interaction to Next Paint) dans les Core Web Vitals est effectif depuis mars 2024. C'est le changement le plus important pour les développeurs frontend parce qu'il affecte directement le score SEO Google.

FID ne mesurait que le délai de la première interaction avec la page. INP mesure la latence de toutes les interactions — chaque clic, chaque frappe, chaque scroll — et retient le percentile 98. Autrement dit, si votre page a une seule interaction lente parmi des dizaines, INP s'en souvient.

Concrètement, les pages qui avaient un bon FID peuvent avoir un mauvais INP. Les causes les plus courantes : du JavaScript lourd qui bloque le thread principal pendant une interaction, des gestionnaires d'événements qui font trop de travail synchrone, des animations CSS qui déclenchent du layout recalcul. Les correctifs passent par `setTimeout` pour déférer le travail non critique, par `requestAnimationFrame` pour les animations, et par la mise en cache des résultats de requêtes coûteuses.

## View Transitions API et CSS Container Queries

La View Transitions API permet des transitions animées entre états de page sans rechargement. En SPA (React, Vue), elle s'intègre via des callbacks du router. Pour les MPA (Multi-Page Applications), Chrome supporte les transitions cross-document depuis Chrome 126 — les autres navigateurs suivent avec un peu de retard.

Ce n'est pas seulement une question d'esthétique. Une transition fluide entre une liste et un détail de produit réduit la désorientation de l'utilisateur et renforce la perception de rapidité même si le chargement est identique. C'est un gain d'UX avec peu de code supplémentaire sur les architectures modernes.

Les CSS Container Queries sont arrivées à maturité. Là où les Media Queries répondent à la taille de la fenêtre du navigateur, les Container Queries répondent à la taille du conteneur parent d'un composant. C'est ce qui manquait pour rendre les composants véritablement réutilisables — un même composant qui s'adapte selon qu'il est dans une sidebar étroite ou dans une grille large, sans qu'il ait besoin de savoir où il se trouve.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="30" font-family="monospace" font-size="14" fill="#86efac" text-anchor="middle" font-weight="bold">ADOPTION NOUVELLES APIs — SUPPORT CROSS-BROWSER 2025</text>
  <!-- Y axis -->
  <line x1="160" y1="50" x2="160" y2="300" stroke="#1a1f4e" stroke-width="1"/>
  <!-- Grid lines -->
  <line x1="160" y1="300" x2="660" y2="300" stroke="#1a1f4e" stroke-width="1"/>
  <line x1="160" y1="250" x2="660" y2="250" stroke="#1a1f4e" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="160" y1="200" x2="660" y2="200" stroke="#1a1f4e" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="160" y1="150" x2="660" y2="150" stroke="#1a1f4e" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="160" y1="100" x2="660" y2="100" stroke="#1a1f4e" stroke-width="0.5" stroke-dasharray="3,3"/>
  <!-- Y labels -->
  <text x="150" y="304" font-family="monospace" font-size="8" fill="#7a7a9a" text-anchor="end">0%</text>
  <text x="150" y="254" font-family="monospace" font-size="8" fill="#7a7a9a" text-anchor="end">25%</text>
  <text x="150" y="204" font-family="monospace" font-size="8" fill="#7a7a9a" text-anchor="end">50%</text>
  <text x="150" y="154" font-family="monospace" font-size="8" fill="#7a7a9a" text-anchor="end">75%</text>
  <text x="150" y="104" font-family="monospace" font-size="8" fill="#7a7a9a" text-anchor="end">100%</text>
  <!-- Bars -->
  <!-- CSS :has() 93% -->
  <rect x="170" y="67" width="68" height="233" rx="3" fill="#86efac" opacity="0.85"/>
  <text x="204" y="62" font-family="monospace" font-size="10" fill="#86efac" text-anchor="middle" font-weight="bold">93%</text>
  <text x="204" y="320" font-family="sans-serif" font-size="8" fill="#c4c4c4" text-anchor="middle">CSS :has()</text>
  <!-- CSS Container Queries 92% -->
  <rect x="254" y="74" width="68" height="226" rx="3" fill="#00cffd" opacity="0.85"/>
  <text x="288" y="69" font-family="monospace" font-size="10" fill="#00cffd" text-anchor="middle" font-weight="bold">92%</text>
  <text x="288" y="320" font-family="sans-serif" font-size="8" fill="#c4c4c4" text-anchor="middle">Container Queries</text>
  <!-- CSS Subgrid 89% -->
  <rect x="338" y="88" width="68" height="212" rx="3" fill="#915EFF" opacity="0.85"/>
  <text x="372" y="83" font-family="monospace" font-size="10" fill="#915EFF" text-anchor="middle" font-weight="bold">89%</text>
  <text x="372" y="320" font-family="sans-serif" font-size="8" fill="#c4c4c4" text-anchor="middle">CSS Subgrid</text>
  <!-- View Transitions 87% -->
  <rect x="422" y="95" width="68" height="205" rx="3" fill="#fbbf24" opacity="0.85"/>
  <text x="456" y="90" font-family="monospace" font-size="10" fill="#fbbf24" text-anchor="middle" font-weight="bold">87%</text>
  <text x="456" y="320" font-family="sans-serif" font-size="8" fill="#c4c4c4" text-anchor="middle">View Transitions</text>
  <!-- Popover API 84% -->
  <rect x="506" y="109" width="68" height="191" rx="3" fill="#86efac" opacity="0.6"/>
  <text x="540" y="104" font-family="monospace" font-size="10" fill="#86efac" text-anchor="middle" font-weight="bold">84%</text>
  <text x="540" y="320" font-family="sans-serif" font-size="8" fill="#c4c4c4" text-anchor="middle">Popover API</text>
  <!-- Source note -->
  <text x="350" y="345" font-family="monospace" font-size="9" fill="#fbbf24" text-anchor="middle">Source : caniuse.com — support global tous navigateurs confondus, mai 2025</text>
</svg></div>

## L'AI UI en pratique : ce qui tient la route

L'intégration d'IA dans les interfaces est passée du concept à la production en moins de deux ans. Ce qui fonctionne concrètement en 2025 : les completions contextuelles (champ de recherche avec suggestions intelligentes), la génération de résumés de contenu long, et les formulaires avec aide à la saisie.

Ce qui ne fonctionne pas bien : les chatbots génériques dans les applications qui n'en ont pas besoin, l'IA sur des données non structurées sans garde-fous, et les fonctionnalités IA sans fallback quand le service tiers est indisponible.

La dépendance à des APIs externes (OpenAI, Anthropic, Google) introduit un point de défaillance réseau et un coût variable. Sur les projets que j'ai accompagnés chez ACTIV PARTNERS, la règle était simple : l'IA améliore l'expérience, elle ne la conditionne pas. Si le service IA tombe, l'application doit rester fonctionnelle.

## Nouveaux patterns de performance

Le passage aux Server Components dans les frameworks modernes (Next.js, Remix) change la façon d'optimiser les performances. Le JavaScript envoyé au client est réduit parce qu'une partie du rendu reste côté serveur. INP s'améliore mécaniquement parce qu'il y a moins de code à parser côté client.

CSS Subgrid résout un problème long à résoudre avec des hacks : aligner des éléments sur une grille parente depuis un composant enfant. C'est maintenant supporté à 89 % des navigateurs — utilisable sans polyfill sur la plupart des projets.

La Popover API remplace des dizaines de lignes de JavaScript pour gérer l'accessibilité et le positionnement des menus, tooltips et modales. C'est natif, ça gère le focus automatiquement, et ça n'a pas besoin de bibliothèque externe.

> **En résumé** — En 2025, les vrais changements à intégrer maintenant sont : corriger INP si vous avez du JavaScript lourd sur les interactions, adopter CSS Container Queries pour des composants réellement réutilisables, et utiliser la View Transitions API pour les transitions entre états de page dans les SPA. Le support cross-browser est suffisant pour tous ces éléments. L'IA dans les UI marche quand elle améliore sans conditionner — pas quand elle devient le coeur de l'expérience.
