---
title: "React Performance Optimisation"
description: "Memo, lazy loading, bundle analysis — les optimisations React qui changent vraiment les choses en production, et comment les appliquer dans le bon ordre."
publishDate: "2025-02-10"
type: article
domain: developpement-web
image: "/images/themes/dev-web.webp"
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

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e" rx="12"/>
  <text x="350" y="28" font-family="monospace" font-size="13" fill="#00cffd" text-anchor="middle" font-weight="bold">FAUT-IL MÉMOÏSER ? — ARBRE DE DÉCISION</text>
  <text x="350" y="46" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="middle">React.memo / useMemo / useCallback — quand le coût vaut le bénéfice</text>
  <rect x="270" y="65" width="160" height="40" rx="8" fill="#1a1f4e" stroke="#915EFF" stroke-width="1.5"/>
  <text x="350" y="82" font-family="sans-serif" font-size="11" fill="#ffffff" text-anchor="middle" font-weight="bold">Composant identifié</text>
  <text x="350" y="96" font-family="monospace" font-size="9" fill="#b48bff" text-anchor="middle">par le Profiler</text>
  <line x1="350" y1="105" x2="350" y2="125" stroke="#94a3b8" stroke-width="1"/>
  <rect x="270" y="125" width="160" height="40" rx="8" fill="#1a1f4e" stroke="#fdba74" stroke-width="1.2"/>
  <text x="350" y="142" font-family="sans-serif" font-size="11" fill="#fdba74" text-anchor="middle" font-weight="bold">Rendu coûteux ?</text>
  <text x="350" y="156" font-family="monospace" font-size="8" fill="#7e8da4" text-anchor="middle">&gt; 16ms ou liste &gt; 100 items</text>
  <line x1="270" y1="145" x2="160" y2="180" stroke="#fb7185" stroke-width="1"/>
  <text x="200" y="170" font-family="monospace" font-size="9" fill="#fb7185" text-anchor="middle">non</text>
  <line x1="430" y1="145" x2="540" y2="180" stroke="#a7f3d0" stroke-width="1"/>
  <text x="500" y="170" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle">oui</text>
  <rect x="60" y="180" width="200" height="80" rx="8" fill="#1a1f4e" stroke="#fb7185" stroke-width="1"/>
  <text x="160" y="200" font-family="monospace" font-size="10" fill="#fb7185" text-anchor="middle" font-weight="bold">NE PAS MÉMOÏSER</text>
  <line x1="80" y1="208" x2="240" y2="208" stroke="#fb7185" stroke-width="0.5" opacity="0.3"/>
  <text x="160" y="224" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Le coût de comparaison</text>
  <text x="160" y="238" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">dépasse le bénéfice.</text>
  <text x="160" y="252" font-family="sans-serif" font-size="9" fill="#fb7185" text-anchor="middle">Laisse React faire son job.</text>
  <rect x="440" y="180" width="200" height="80" rx="8" fill="#1a1f4e" stroke="#a7f3d0" stroke-width="1"/>
  <text x="540" y="200" font-family="monospace" font-size="10" fill="#a7f3d0" text-anchor="middle" font-weight="bold">PROPS STABLES ?</text>
  <line x1="460" y1="208" x2="620" y2="208" stroke="#a7f3d0" stroke-width="0.5" opacity="0.3"/>
  <text x="540" y="226" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Si props recréées à chaque</text>
  <text x="540" y="240" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">rendu (objet, fonction inline)</text>
  <text x="540" y="254" font-family="monospace" font-size="9" fill="#fdba74" text-anchor="middle">→ memo inutile sans useCallback</text>
  <line x1="540" y1="260" x2="540" y2="285" stroke="#94a3b8" stroke-width="1"/>
  <rect x="60" y="290" width="180" height="58" rx="8" fill="#1a1f4e" stroke="#67e8f9" stroke-width="1"/>
  <text x="150" y="307" font-family="monospace" font-size="10" fill="#67e8f9" text-anchor="middle" font-weight="bold">React.memo</text>
  <line x1="80" y1="315" x2="220" y2="315" stroke="#67e8f9" stroke-width="0.5" opacity="0.3"/>
  <text x="150" y="330" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">composant pur,</text>
  <text x="150" y="342" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">props simples</text>
  <rect x="255" y="290" width="180" height="58" rx="8" fill="#1a1f4e" stroke="#b48bff" stroke-width="1"/>
  <text x="345" y="307" font-family="monospace" font-size="10" fill="#b48bff" text-anchor="middle" font-weight="bold">useMemo</text>
  <line x1="275" y1="315" x2="415" y2="315" stroke="#b48bff" stroke-width="0.5" opacity="0.3"/>
  <text x="345" y="330" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">calculs lourds,</text>
  <text x="345" y="342" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">tri / filtre listes</text>
  <rect x="450" y="290" width="180" height="58" rx="8" fill="#1a1f4e" stroke="#fdba74" stroke-width="1"/>
  <text x="540" y="307" font-family="monospace" font-size="10" fill="#fdba74" text-anchor="middle" font-weight="bold">useCallback</text>
  <line x1="470" y1="315" x2="610" y2="315" stroke="#fdba74" stroke-width="0.5" opacity="0.3"/>
  <text x="540" y="330" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">fonction passée à</text>
  <text x="540" y="342" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">un enfant mémoïsé</text>
</svg></div>

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

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e" rx="12"/>
  <text x="350" y="28" font-family="monospace" font-size="13" fill="#00cffd" text-anchor="middle" font-weight="bold">MATRICE IMPACT × EFFORT — ORDRE D'INTERVENTION</text>
  <text x="350" y="46" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="middle">par où commencer pour maximiser le ROI perf</text>
  <line x1="100" y1="80" x2="100" y2="310" stroke="#94a3b8" stroke-width="1.2"/>
  <line x1="100" y1="310" x2="650" y2="310" stroke="#94a3b8" stroke-width="1.2"/>
  <text x="50" y="195" font-family="monospace" font-size="10" fill="#cbd5e1" text-anchor="middle" transform="rotate(-90 50 195)">IMPACT PERF</text>
  <text x="375" y="335" font-family="monospace" font-size="10" fill="#cbd5e1" text-anchor="middle">EFFORT D'IMPLÉMENTATION</text>
  <text x="90" y="312" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="end">faible</text>
  <text x="90" y="90" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="end">fort</text>
  <text x="100" y="325" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="middle">faible</text>
  <text x="650" y="325" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="middle">fort</text>
  <line x1="375" y1="80" x2="375" y2="310" stroke="#94a3b8" stroke-width="0.4" stroke-dasharray="3,3" opacity="0.5"/>
  <line x1="100" y1="195" x2="650" y2="195" stroke="#94a3b8" stroke-width="0.4" stroke-dasharray="3,3" opacity="0.5"/>
  <text x="237" y="75" font-family="monospace" font-size="8" fill="#a7f3d0" text-anchor="middle">QUICK WINS</text>
  <text x="512" y="75" font-family="monospace" font-size="8" fill="#fdba74" text-anchor="middle">PROJETS MAJEURS</text>
  <text x="237" y="325" font-family="monospace" font-size="8" fill="#b48bff" text-anchor="middle">À FAIRE EN PASSANT</text>
  <text x="512" y="325" font-family="monospace" font-size="8" fill="#fb7185" text-anchor="middle">À ÉVITER (souvent)</text>
  <circle cx="180" cy="110" r="36" fill="#a7f3d0" fill-opacity="0.18" stroke="#a7f3d0" stroke-width="1.2"/>
  <text x="180" y="108" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle" font-weight="bold">React.lazy</text>
  <text x="180" y="120" font-family="monospace" font-size="8" fill="#a7f3d0" text-anchor="middle">par route</text>
  <text x="180" y="160" font-family="sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">1) commencer ici</text>
  <circle cx="300" cy="135" r="30" fill="#a7f3d0" fill-opacity="0.18" stroke="#a7f3d0" stroke-width="1.2"/>
  <text x="300" y="133" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle" font-weight="bold">named</text>
  <text x="300" y="145" font-family="monospace" font-size="8" fill="#a7f3d0" text-anchor="middle">imports</text>
  <text x="300" y="180" font-family="sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">2) lodash, date-fns</text>
  <circle cx="460" cy="155" r="28" fill="#fdba74" fill-opacity="0.18" stroke="#fdba74" stroke-width="1.2"/>
  <text x="460" y="155" font-family="monospace" font-size="9" fill="#fdba74" text-anchor="middle" font-weight="bold">dynamic</text>
  <text x="460" y="167" font-family="monospace" font-size="8" fill="#fdba74" text-anchor="middle">imports</text>
  <text x="460" y="195" font-family="sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">3) libs lourdes</text>
  <circle cx="250" cy="225" r="26" fill="#67e8f9" fill-opacity="0.18" stroke="#67e8f9" stroke-width="1.2"/>
  <text x="250" y="223" font-family="monospace" font-size="9" fill="#67e8f9" text-anchor="middle" font-weight="bold">memo</text>
  <text x="250" y="235" font-family="monospace" font-size="8" fill="#67e8f9" text-anchor="middle">ciblée</text>
  <text x="250" y="262" font-family="sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">4) après Profiler</text>
  <circle cx="540" cy="115" r="28" fill="#fdba74" fill-opacity="0.18" stroke="#fdba74" stroke-width="1.2"/>
  <text x="540" y="113" font-family="monospace" font-size="9" fill="#fdba74" text-anchor="middle" font-weight="bold">Server</text>
  <text x="540" y="125" font-family="monospace" font-size="8" fill="#fdba74" text-anchor="middle">Components</text>
  <text x="540" y="155" font-family="sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">5) refonte archi</text>
  <circle cx="570" cy="265" r="24" fill="#fb7185" fill-opacity="0.18" stroke="#fb7185" stroke-width="1.2"/>
  <text x="570" y="263" font-family="monospace" font-size="8" fill="#fb7185" text-anchor="middle" font-weight="bold">memo</text>
  <text x="570" y="274" font-family="monospace" font-size="8" fill="#fb7185" text-anchor="middle">"partout"</text>
  <text x="570" y="298" font-family="sans-serif" font-size="8" fill="#fb7185" text-anchor="middle">complexité &gt; gain</text>
  <circle cx="155" cy="270" r="22" fill="#b48bff" fill-opacity="0.18" stroke="#b48bff" stroke-width="1.2"/>
  <text x="155" y="268" font-family="monospace" font-size="8" fill="#b48bff" text-anchor="middle" font-weight="bold">Lighthouse</text>
  <text x="155" y="278" font-family="monospace" font-size="8" fill="#b48bff" text-anchor="middle">audit</text>
  <text x="155" y="298" font-family="sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">à chaque release</text>
</svg></div>

## Ce qu'on ne doit pas optimiser prématurément

Les Server Components (Next.js App Router) sont une évolution architecturale réelle — ils permettent de déplacer côté serveur des composants qui n'ont pas besoin d'interactivité, réduisant massivement le JavaScript envoyé au client. Mais ils impliquent un changement de modèle mental complet et des contraintes que les équipes sous-estiment souvent (pas de hooks côté serveur, sérialisation des props, frontière client/serveur à gérer explicitement). Ce n'est pas une optimisation à ajouter sur une base existante — c'est un choix d'architecture à faire en début de projet.

La virtualisation de listes (react-window, TanStack Virtual) mérite une mention : indispensable pour des listes de milliers d'éléments, inutile pour moins de 100-200 items. Avant d'implémenter la virtualisation, vérifier d'abord que le problème n'est pas un re-rendu inutile de la liste entière à chaque keystroke.
