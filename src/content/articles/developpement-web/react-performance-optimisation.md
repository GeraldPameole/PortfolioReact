---
title: "React Performance Optimisation"
description: "Memo, lazy loading, bundle analysis — les optimisations React qui changent vraiment les choses en production, et comment les appliquer dans le bon ordre."
publishDate: "2025-02-10"
type: article
domain: developpement-web
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

Optimiser les performances d'une application React est l'un des sujets où l'ordre d'intervention fait toute la différence. J'ai vu des développeurs passer des heures à mémoïser des composants qui se rendaient deux fois par session, pendant que leur bundle initial pesait 4 MB et bloquait le First Contentful Paint pendant 6 secondes. L'optimisation prématurée au mauvais endroit, c'est de l'effort gaspillé et parfois une régression.

La règle numéro un est simple : mesurer avant d'agir. Les problèmes de performance React tombent généralement dans deux catégories — les rendus inutiles (composants qui se re-rendent sans raison) et le poids du bundle (JavaScript chargé au démarrage que l'utilisateur n'a pas besoin immédiatement). Chaque catégorie a ses outils de diagnostic et ses leviers d'action.

## Diagnostiquer avant d'optimiser

Le React DevTools Profiler est le point de départ obligatoire. Il enregistre chaque rendu, affiche la durée, et surtout indique pourquoi le composant a re-rendu (props changées, state changé, contexte changé, composant parent re-rendu). C'est ce dernier cas — re-rendu par cascade depuis le parent — qui est le plus fréquent et le moins bien compris.

Pour le bundle, `webpack-bundle-analyzer` ou `vite-bundle-visualizer` produisent une carte visuelle du contenu de chaque chunk. Ce qui surprend systématiquement à la première analyse : la taille des dépendances tierces. Une librairie de dates, un éditeur de texte riche, une librairie de charts importée en entier alors qu'on n'utilise que deux composants — ce sont ces éléments qui font exploser la taille du bundle initial.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 340" style="max-width:100%;height:auto">
  <rect width="560" height="340" fill="#0a0f2e" rx="12"/>
  <!-- Title -->
  <text x="280" y="28" text-anchor="middle" fill="#94a3b8" font-size="12" font-weight="bold" font-family="sans-serif">Cycle de rendu React — points d'intervention</text>
  <!-- Flow boxes -->
  <!-- State / Props change -->
  <rect x="30" y="55" width="120" height="46" fill="#915EFF" fill-opacity="0.15" rx="6" stroke="#915EFF" stroke-width="1.2"/>
  <text x="90" y="74" text-anchor="middle" fill="#915EFF" font-size="11" font-weight="bold" font-family="sans-serif">State / Props</text>
  <text x="90" y="90" text-anchor="middle" fill="#915EFF" font-size="10" font-family="sans-serif">changement</text>
  <!-- Arrow -->
  <line x1="150" y1="78" x2="178" y2="78" stroke="#475569" stroke-width="1.5" marker-end="url(#arr)"/>
  <!-- shouldComponentUpdate / React.memo -->
  <rect x="180" y="55" width="130" height="46" fill="#00cffd" fill-opacity="0.12" rx="6" stroke="#00cffd" stroke-width="1.2"/>
  <text x="245" y="74" text-anchor="middle" fill="#00cffd" font-size="11" font-weight="bold" font-family="sans-serif">React.memo</text>
  <text x="245" y="90" text-anchor="middle" fill="#00cffd" font-size="10" font-family="sans-serif">comparaison props</text>
  <!-- Bail-out arrow (up) -->
  <line x1="245" y1="55" x2="245" y2="38" stroke="#86efac" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="310" y="35" text-anchor="middle" fill="#86efac" font-size="9" font-family="sans-serif">bail-out (pas de re-rendu)</text>
  <!-- Arrow -->
  <line x1="310" y1="78" x2="338" y2="78" stroke="#475569" stroke-width="1.5"/>
  <!-- Render function -->
  <rect x="340" y="55" width="120" height="46" fill="#fbbf24" fill-opacity="0.12" rx="6" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="400" y="74" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="bold" font-family="sans-serif">Render()</text>
  <text x="400" y="90" text-anchor="middle" fill="#fbbf24" font-size="10" font-family="sans-serif">calcul Virtual DOM</text>
  <!-- useMemo note -->
  <text x="400" y="118" text-anchor="middle" fill="#fbbf24" font-size="9" font-family="sans-serif">← useMemo pour</text>
  <text x="400" y="130" text-anchor="middle" fill="#fbbf24" font-size="9" font-family="sans-serif">calculs coûteux</text>
  <!-- Arrow down from render -->
  <line x1="400" y1="101" x2="400" y2="145" stroke="#475569" stroke-width="1.5"/>
  <!-- Reconciliation -->
  <rect x="310" y="147" width="180" height="46" fill="#915EFF" fill-opacity="0.10" rx="6" stroke="#915EFF" stroke-width="1.2"/>
  <text x="400" y="166" text-anchor="middle" fill="#915EFF" font-size="11" font-weight="bold" font-family="sans-serif">Reconciliation</text>
  <text x="400" y="182" text-anchor="middle" fill="#915EFF" font-size="10" font-family="sans-serif">diff Virtual DOM → DOM</text>
  <!-- Arrow down -->
  <line x1="400" y1="193" x2="400" y2="225" stroke="#475569" stroke-width="1.5"/>
  <!-- Commit phase -->
  <rect x="310" y="227" width="180" height="46" fill="#86efac" fill-opacity="0.10" rx="6" stroke="#86efac" stroke-width="1.2"/>
  <text x="400" y="246" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold" font-family="sans-serif">Commit</text>
  <text x="400" y="262" text-anchor="middle" fill="#86efac" font-size="10" font-family="sans-serif">mise à jour DOM réel</text>
  <!-- Bundle section (left) -->
  <rect x="30" y="147" width="240" height="126" fill="#00cffd" fill-opacity="0.05" rx="6" stroke="#00cffd" stroke-width="1" stroke-dasharray="5,3"/>
  <text x="150" y="168" text-anchor="middle" fill="#00cffd" font-size="11" font-weight="bold" font-family="sans-serif">Bundle / Chargement</text>
  <text x="150" y="188" text-anchor="middle" fill="#00cffd" font-size="10" font-family="sans-serif">React.lazy + Suspense</text>
  <text x="150" y="203" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">→ code splitting par route</text>
  <text x="150" y="220" text-anchor="middle" fill="#00cffd" font-size="10" font-family="sans-serif">Dynamic imports</text>
  <text x="150" y="235" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">→ libs lourdes à la demande</text>
  <text x="150" y="252" text-anchor="middle" fill="#00cffd" font-size="10" font-family="sans-serif">Tree-shaking</text>
  <text x="150" y="267" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">→ named imports uniquement</text>
  <!-- Arrow definition -->
  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#475569"/>
    </marker>
  </defs>
  <!-- Bottom label -->
  <text x="280" y="318" text-anchor="middle" fill="#64748b" font-size="10" font-family="sans-serif">Cycle de rendu React — où appliquer les optimisations</text>
</svg></div>

## React.memo et useMemo : utiliser avec discernement

`React.memo` empêche le re-rendu d'un composant si ses props n'ont pas changé. C'est utile, mais pas universel. La comparaison de props a un coût — pour les composants légers qui se rendent rapidement, ce coût peut dépasser le bénéfice. La règle pratique : utiliser `React.memo` sur les composants qui reçoivent fréquemment les mêmes props, qui sont coûteux à rendre, et qui sont enfants d'un composant qui se re-rend souvent.

`useMemo` cache le résultat d'un calcul entre les rendus. C'est pertinent pour des transformations de données coûteuses — filtrage et tri de grandes listes, agrégations complexes — mais pas pour une addition ou un formatage de chaîne. L'overhead de mémorisation n'est pas gratuit.

`useCallback` est le pendant pour les fonctions : il stabilise la référence d'une fonction entre les rendus. Indispensable quand la fonction est passée en prop à un composant mémoïsé — sans `useCallback`, la fonction serait recréée à chaque rendu du parent, invalidant le memo de l'enfant.

Un anti-pattern courant : envelopper tout avec `React.memo`, `useMemo` et `useCallback` "par précaution". Ça complexifie le code, ça rend les bugs plus difficiles à tracer, et ça n'améliore pas nécessairement les performances. Le Profiler d'abord, l'optimisation ensuite.

## Lazy loading et code splitting : l'impact le plus immédiat

C'est généralement là que le gain est le plus rapide. `React.lazy` combiné avec `Suspense` permet de charger des composants à la demande — typiquement, par route.

```jsx
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Settings = React.lazy(() => import('./pages/Settings'));

// Dans le router :
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</Suspense>
```

Ce pattern réduit le bundle initial de manière significative : au lieu de charger toutes les pages au démarrage, on charge uniquement la page courante. L'utilisateur qui arrive sur la homepage ne télécharge pas le code du tableau de bord admin.

Pour les librairies lourdes, les dynamic imports permettent le même principe à la demande : un éditeur de texte riche, une librairie de génération PDF, un moteur de rendu de graphiques — tout ce qui n'est pas nécessaire au chargement initial.

## Analyser le bundle pour savoir où chercher

Sans analyse du bundle, on optimise dans le noir. Voici le diagnostic en trois étapes que j'applique systématiquement sur une application qui présente des temps de chargement longs :

1. **Lighthouse** en mode production (pas en dev) pour obtenir les métriques Core Web Vitals réelles — LCP, FID, CLS. Ça donne un score de base et identifie les blocages principaux.

2. **Bundle Analyzer** pour visualiser la composition des chunks. Les surprises habituelles : moment.js inclus entièrement pour `format()`, lodash importé en `import _ from 'lodash'` au lieu d'imports ciblés, plusieurs versions d'une même dépendance chargées en parallèle.

3. **React DevTools Profiler** pour les problèmes de re-rendu. Enregistrer une interaction utilisateur typique, identifier les composants qui se rendent plus de 2-3 fois sans raison visible, remonter l'arbre pour trouver la source du re-rendu en cascade.

L'ordre d'intervention recommandé par impact décroissant : code splitting d'abord (impact fort, complexité faible), optimisation des imports de librairies (impact fort, effort modéré), memoization ciblée sur les composants identifiés par le Profiler (impact modéré, effort variable).

## Ce qu'on ne doit pas optimiser prématurément

Les Server Components (Next.js App Router) sont une évolution architecturale réelle — ils permettent de déplacer côté serveur des composants qui n'ont pas besoin d'interactivité, réduisant massivement le JavaScript envoyé au client. Mais ils impliquent un changement de modèle mental complet et des contraintes que les équipes sous-estiment souvent (pas de hooks côté serveur, sérialisation des props, frontière client/serveur à gérer explicitement). Ce n'est pas une optimisation à ajouter sur une base existante — c'est un choix d'architecture à faire en début de projet.

La virtualisation de listes (react-window, TanStack Virtual) mérite une mention : indispensable pour des listes de milliers d'éléments, inutile pour moins de 100-200 items. Avant d'implémenter la virtualisation, vérifier d'abord que le problème n'est pas un re-rendu inutile de la liste entière à chaque keystroke.
