---
title: "React Performance en 2026 : ce que le Compiler change"
description: "React 19 et le Compiler ont rendu la moitié des conseils perf des années 2022-2024 obsolètes. Voici ce qu'il faut vraiment optimiser, dans quel ordre, et ce qui n'a plus aucun sens d'écrire à la main."
publishDate: "2026-05-31"
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
  - react

---

Optimiser les performances d'une application React est l'un des sujets où l'ordre d'intervention fait toute la différence. J'ai vu des équipes passer des semaines à mémoïser des composants qui se rendaient deux fois par session, pendant que leur bundle initial pesait 4 MB et bloquait le First Contentful Paint pendant 6 secondes. L'optimisation prématurée au mauvais endroit, c'est de l'effort gaspillé et parfois une régression.

Depuis la sortie stable de **React 19 en décembre 2024** et la généralisation de **React Compiler en 2025**, la moitié des conseils des années 2022-2024 a vieilli. Plus précisément : tout ce qui tournait autour de `useMemo`, `useCallback` et `React.memo` posés à la main "par sécurité" est devenu, dans la majorité des cas, contre-productif. Le Compiler le fait mieux, plus systématiquement, et sans alourdir le code source.

Cet article remet à plat ce qu'il faut vraiment regarder en 2026 : ce que le Compiler automatise, ce qu'il n'automatise pas, et où concentrer l'effort humain.

> **Si vous lisez cet article en 2026 et que vous écrivez encore des `useMemo`/`useCallback` partout, vous travaillez contre l'outil.** Le Compiler suppose que votre code est idiomatique et non micro-optimisé. Les hooks de mémoïsation manuelle, ajoutés "par précaution", deviennent du bruit qui complique la lecture sans rien apporter.

## Ce que React Compiler change (et ce qui devient inutile)

React Compiler est un compilateur Babel/SWC qui analyse vos composants et insère automatiquement les optimisations de mémoïsation au build. Concrètement, il fait à la compilation ce que vous faisiez à la main avec `useMemo`, `useCallback` et `React.memo` — mais de façon plus fine, plus systématique, et sans que vous ayez à y penser.

**Ce qui devient inutile dans la majorité des cas** :

- `useCallback` autour d'une fonction passée en prop. Le Compiler stabilise les références automatiquement.
- `useMemo` autour d'un objet ou d'un tableau dérivé. Pareil — c'est mémoïsé au build.
- `React.memo` enveloppant les composants enfants "au cas où". Le Compiler génère l'équivalent.

**Ce que le Compiler ne fait pas** (et qui reste à votre charge) :

- Le **code splitting** et le lazy loading des routes — il n'a rien à voir avec la taille du bundle.
- L'**architecture des composants** : un mauvais découpage qui fait remonter tout le state au sommet de l'arbre reste un problème de conception, pas de mémoïsation.
- Les **dépendances lourdes importées en entier** (moment.js, lodash global, librairies de charts complètes).
- Les **requêtes réseau redondantes**, le caching côté données (TanStack Query, SWR, RSC).
- Les **Web Vitals** (LCP, INP, CLS) qui dépendent du chargement, des images, des polices, du CSS critique.

La bonne façon de poser le problème : le Compiler élimine une classe entière de bugs perf (re-renders en cascade non gérés) et libère du temps cerveau pour les problèmes que lui ne peut pas voir. Il ne dispense pas de comprendre comment React rend — il automatise une optim, pas la conception.

D'après les chiffres communiqués par l'équipe React, l'activation du Compiler sur une base existante réduit en moyenne d'environ **50 % le JavaScript exécuté côté client** lors d'une mise à jour de state. Ce n'est pas une baisse de la taille du bundle (le Compiler ajoute même un peu de code), c'est une baisse du travail à l'exécution. Sur les apps lourdes en interactions, ça se sent.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e" rx="12"/>
  <text x="350" y="28" font-family="monospace" font-size="13" fill="#00cffd" text-anchor="middle" font-weight="bold">AVANT / APRÈS REACT COMPILER</text>
  <text x="350" y="46" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="middle">ce que vous écriviez en 2023 vs ce que vous écrivez en 2026</text>
  <rect x="40" y="70" width="290" height="260" rx="10" fill="#1a1f4e" stroke="#fb7185" stroke-width="1.2"/>
  <text x="185" y="92" font-family="monospace" font-size="11" fill="#fb7185" text-anchor="middle" font-weight="bold">AVANT (React 18, à la main)</text>
  <line x1="60" y1="100" x2="310" y2="100" stroke="#fb7185" stroke-width="0.5" opacity="0.3"/>
  <text x="60" y="122" font-family="monospace" font-size="9" fill="#cbd5e1">const items = useMemo(</text>
  <text x="60" y="135" font-family="monospace" font-size="9" fill="#cbd5e1">  () =&gt; data.filter(...),</text>
  <text x="60" y="148" font-family="monospace" font-size="9" fill="#cbd5e1">  [data]</text>
  <text x="60" y="161" font-family="monospace" font-size="9" fill="#cbd5e1">);</text>
  <text x="60" y="182" font-family="monospace" font-size="9" fill="#cbd5e1">const onClick = useCallback(</text>
  <text x="60" y="195" font-family="monospace" font-size="9" fill="#cbd5e1">  (id) =&gt; select(id),</text>
  <text x="60" y="208" font-family="monospace" font-size="9" fill="#cbd5e1">  [select]</text>
  <text x="60" y="221" font-family="monospace" font-size="9" fill="#cbd5e1">);</text>
  <text x="60" y="242" font-family="monospace" font-size="9" fill="#cbd5e1">const Row = React.memo(</text>
  <text x="60" y="255" font-family="monospace" font-size="9" fill="#cbd5e1">  function Row({ item, onClick })</text>
  <text x="60" y="268" font-family="monospace" font-size="9" fill="#cbd5e1">);</text>
  <text x="185" y="300" font-family="monospace" font-size="9" fill="#fb7185" text-anchor="middle">bruit visuel, oublis de deps,</text>
  <text x="185" y="313" font-family="monospace" font-size="9" fill="#fb7185" text-anchor="middle">stale closures, bugs subtils</text>
  <rect x="370" y="70" width="290" height="260" rx="10" fill="#1a1f4e" stroke="#a7f3d0" stroke-width="1.2"/>
  <text x="515" y="92" font-family="monospace" font-size="11" fill="#a7f3d0" text-anchor="middle" font-weight="bold">APRÈS (React 19 + Compiler)</text>
  <line x1="390" y1="100" x2="640" y2="100" stroke="#a7f3d0" stroke-width="0.5" opacity="0.3"/>
  <text x="390" y="122" font-family="monospace" font-size="9" fill="#cbd5e1">const items = data.filter(...);</text>
  <text x="390" y="155" font-family="monospace" font-size="9" fill="#cbd5e1">const onClick = (id) =&gt;</text>
  <text x="390" y="168" font-family="monospace" font-size="9" fill="#cbd5e1">  select(id);</text>
  <text x="390" y="200" font-family="monospace" font-size="9" fill="#cbd5e1">function Row({ item, onClick }) {</text>
  <text x="390" y="213" font-family="monospace" font-size="9" fill="#cbd5e1">  return &lt;li&gt;...&lt;/li&gt;;</text>
  <text x="390" y="226" font-family="monospace" font-size="9" fill="#cbd5e1">}</text>
  <text x="515" y="260" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle">Le compilateur insère</text>
  <text x="515" y="273" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle">la mémoïsation au build,</text>
  <text x="515" y="286" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle">de façon plus fine et exhaustive.</text>
  <text x="515" y="313" font-family="monospace" font-size="9" fill="#fdba74" text-anchor="middle">~50% de JS exécuté en moins</text>
</svg></div>

## La stack 2026 recommandée

Pour démarrer un projet aujourd'hui, deux combinaisons font sens, selon que vous êtes en SSR/RSC ou en SPA classique :

- **Next.js 15 + React 19 + Compiler + Turbopack** (stable pour dev depuis Next 15, oct 2024). Le Compiler est intégré via `experimental.reactCompiler: true`. Pour les apps qui ont besoin de Server Components et de Partial Prerendering (PPR, en preview).
- **Vite 6 + React 19 + plugin Compiler** (`babel-plugin-react-compiler` via le plugin Babel de Vite). Pour les SPA classiques ou les apps internes où Server Components est overkill.

Quel que soit le choix, deux principes restent constants : activer le Compiler au plus tôt sur un projet nouveau, et migrer en mode progressif sur une base existante (le Compiler peut être activé fichier par fichier via `"use memo"` ou de façon globale avec opt-out).

## Diagnostiquer avant d'optimiser

Le React DevTools Profiler reste le point de départ obligatoire. Il enregistre chaque rendu, affiche la durée, et indique pourquoi le composant a re-rendu (props changées, state changé, contexte changé, parent re-rendu). Avec le Compiler activé, le profil change : beaucoup de re-renders en cascade qui apparaissaient en rouge disparaissent. Ce qui reste — et qui demande votre attention — ce sont les rendus liés à des contextes globaux mal segmentés, à des stores qui notifient trop large, ou à des composants qui font du travail lourd dans leur corps (parsing, transformations) qu'aucun compilateur ne peut deviner.

Pour le bundle, `vite-bundle-visualizer` ou `@next/bundle-analyzer` produisent une carte visuelle du contenu de chaque chunk. Ce qui surprend systématiquement à la première analyse : la taille des dépendances tierces. Une librairie de dates, un éditeur de texte riche, une librairie de charts importée en entier alors qu'on n'utilise que deux composants — ce sont ces éléments qui font exploser le bundle initial, et le Compiler n'y touche pas.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 320" style="max-width:100%;height:auto">
  <rect width="700" height="320" fill="#0a0f2e" rx="12"/>
  <text x="350" y="28" text-anchor="middle" fill="#00cffd" font-size="13" font-weight="bold" font-family="monospace">CYCLE DE RENDU REACT 19 — OÙ INTERVIENT-ON ?</text>
  <text x="350" y="46" text-anchor="middle" fill="#7e8da4" font-size="9" font-family="monospace">le Compiler couvre une zone, vous gardez le reste</text>
  <rect x="40" y="70" width="140" height="50" fill="#915EFF" fill-opacity="0.15" rx="8" stroke="#915EFF" stroke-width="1.2"/>
  <text x="110" y="90" text-anchor="middle" fill="#915EFF" font-size="11" font-weight="bold" font-family="sans-serif">State / Props</text>
  <text x="110" y="106" text-anchor="middle" fill="#915EFF" font-size="10" font-family="sans-serif">changement</text>
  <line x1="180" y1="95" x2="210" y2="95" stroke="#475569" stroke-width="1.5" marker-end="url(#arr2)"/>
  <rect x="215" y="70" width="160" height="50" fill="#a7f3d0" fill-opacity="0.12" rx="8" stroke="#a7f3d0" stroke-width="1.2"/>
  <text x="295" y="90" text-anchor="middle" fill="#a7f3d0" font-size="11" font-weight="bold" font-family="sans-serif">Compiler (build-time)</text>
  <text x="295" y="106" text-anchor="middle" fill="#a7f3d0" font-size="9" font-family="sans-serif">mémoïsation auto</text>
  <line x1="375" y1="95" x2="405" y2="95" stroke="#475569" stroke-width="1.5" marker-end="url(#arr2)"/>
  <rect x="410" y="70" width="140" height="50" fill="#fbbf24" fill-opacity="0.12" rx="8" stroke="#fbbf24" stroke-width="1.2"/>
  <text x="480" y="90" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="bold" font-family="sans-serif">Render()</text>
  <text x="480" y="106" text-anchor="middle" fill="#fbbf24" font-size="10" font-family="sans-serif">calcul Virtual DOM</text>
  <line x1="480" y1="120" x2="480" y2="155" stroke="#475569" stroke-width="1.5" marker-end="url(#arr2)"/>
  <rect x="380" y="160" width="200" height="46" fill="#915EFF" fill-opacity="0.10" rx="8" stroke="#915EFF" stroke-width="1.2"/>
  <text x="480" y="179" text-anchor="middle" fill="#915EFF" font-size="11" font-weight="bold" font-family="sans-serif">Reconciliation</text>
  <text x="480" y="195" text-anchor="middle" fill="#915EFF" font-size="10" font-family="sans-serif">diff Virtual DOM → DOM</text>
  <line x1="480" y1="206" x2="480" y2="235" stroke="#475569" stroke-width="1.5" marker-end="url(#arr2)"/>
  <rect x="380" y="240" width="200" height="46" fill="#86efac" fill-opacity="0.10" rx="8" stroke="#86efac" stroke-width="1.2"/>
  <text x="480" y="259" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold" font-family="sans-serif">Commit</text>
  <text x="480" y="275" text-anchor="middle" fill="#86efac" font-size="10" font-family="sans-serif">mise à jour DOM réel</text>
  <rect x="40" y="160" width="300" height="126" fill="#00cffd" fill-opacity="0.05" rx="8" stroke="#00cffd" stroke-width="1" stroke-dasharray="5,3"/>
  <text x="190" y="180" text-anchor="middle" fill="#00cffd" font-size="11" font-weight="bold" font-family="sans-serif">À VOTRE CHARGE (le Compiler n'y touche pas)</text>
  <text x="190" y="202" text-anchor="middle" fill="#00cffd" font-size="10" font-family="sans-serif">React.lazy + Suspense</text>
  <text x="190" y="216" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">→ code splitting par route</text>
  <text x="190" y="234" text-anchor="middle" fill="#00cffd" font-size="10" font-family="sans-serif">Dynamic imports</text>
  <text x="190" y="248" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">→ libs lourdes à la demande</text>
  <text x="190" y="266" text-anchor="middle" fill="#00cffd" font-size="10" font-family="sans-serif">Server Components (RSC)</text>
  <text x="190" y="280" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">→ JS qui ne part plus au client</text>
  <defs>
    <marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#475569"/>
    </marker>
  </defs>
</svg></div>

## Les hooks React 19 qui changent la donne perf côté UX

React 19 a apporté plusieurs hooks qui ne sont pas "des optimisations" au sens classique, mais qui changent la perception de performance ressentie par l'utilisateur — souvent plus impactante que quelques millisecondes gagnées sur un render.

- **`useOptimistic`** : permet d'afficher immédiatement un état "optimiste" pendant qu'une mutation serveur est en cours. Sur un toggle de favori, un commentaire posté, un drag-and-drop synchronisé — l'interface répond en 0 ms perçues au lieu d'attendre la roundtrip réseau.
- **`useActionState`** : couple un formulaire à une action serveur, gère le pending state, les erreurs, et le retour. Moins de boilerplate, moins de bugs de double-soumission.
- **`useFormStatus`** : un composant enfant d'un `<form>` sait s'il est en cours de soumission, sans avoir à faire remonter du state. Pratique pour les boutons "submit" qui changent d'état.
- **`use()`** : lit une promesse ou un contexte de façon conditionnelle (impossible avec les anciens hooks). Combiné à Suspense, on récupère des données côté composant avec un fallback déclaratif, sans `useEffect` + `useState` + flag de loading.

Les **Actions** (formulaires qui acceptent `action={async fn}` nativement) suppriment une grosse part du code de gestion de submit. Et la **prise en charge native de `ref` en prop** rend `forwardRef` obsolète — moins de couches, moins d'indirection.

Côté SEO et performance perçue : la prise en charge native des **balises `<title>` et `<meta>` dans n'importe quel composant** simplifie la gestion des métadonnées sans librairie tierce type `react-helmet`. Le rendu est hoisté automatiquement dans le `<head>`.

## Lazy loading et code splitting : l'impact le plus immédiat

C'est généralement là que le gain est le plus rapide, et c'est ce que le Compiler ne fera jamais pour vous. `React.lazy` combiné avec `Suspense` charge des composants à la demande — typiquement, par route.

```jsx
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

// Dans le router :
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</Suspense>
```

Ce pattern réduit le bundle initial de manière significative : au lieu de charger toutes les pages au démarrage, on charge uniquement la page courante. L'utilisateur qui arrive sur la homepage ne télécharge pas le code du tableau de bord admin.

Pour les librairies lourdes (éditeur riche, génération PDF, moteur de charts), les dynamic imports appliquent le même principe à la demande. En 2026, l'autre levier majeur sur ce terrain — quand l'architecture le permet — c'est de **ne pas envoyer le composant côté client du tout**, via les Server Components.

## Server Components : déplacer le rendu côté serveur

Les React Server Components, stables en production avec Next.js 14 (et largement matures depuis Next 15), permettent de rendre des composants côté serveur et de n'envoyer au client que le HTML résultant — pas le JavaScript du composant. C'est l'optimisation perf la plus puissante de la décennie, mais elle suppose une architecture pensée pour : pas de hooks d'état dans les Server Components, frontière client/serveur explicite via `"use client"`, sérialisation des props à la frontière.

Sur un projet existant en SPA pure, ce n'est pas un toggle à activer — c'est une migration vers Next.js (ou Remix/React Router v7 en mode framework). Sur un projet neuf qui rend beaucoup de contenu statique ou semi-statique (catalogue produit, blog, dashboard avec peu d'interactions), c'est le défaut raisonnable en 2026.

À noter : **Partial Prerendering** (PPR) en preview dans Next 15 combine le meilleur des deux mondes — une enveloppe statique pré-rendue et instantanée, avec des trous dynamiques streamés. Pour les pages qui mélangent contenu marketing (statique) et zone utilisateur (dynamique), c'est l'évolution à surveiller.

## Analyser le bundle pour savoir où chercher

Sans analyse du bundle, on optimise dans le noir. Voici le diagnostic en quatre étapes que j'applique systématiquement en 2026 :

1. **Lighthouse** ou **PageSpeed Insights** en mode production pour obtenir les Core Web Vitals réels — LCP, **INP** (qui a remplacé FID en mars 2024), CLS. Score de base et blocages principaux.

2. **Bundle Analyzer** pour visualiser la composition des chunks. Les surprises habituelles : `moment.js` inclus entièrement pour `format()`, lodash en `import _ from 'lodash'` au lieu d'imports ciblés, plusieurs versions d'une même dépendance, polyfills inutiles.

3. **React DevTools Profiler** avec le Compiler activé : les re-renders en cascade ont disparu, ce qui reste signale soit un Context global mal segmenté, soit un travail lourd dans le corps d'un composant, soit un store externe qui notifie trop large.

4. **`react-scan`** (l'outil monté par Aiden Bai en 2024-2025) pour visualiser en overlay les re-renders en temps réel pendant la navigation. Plus rapide que d'ouvrir le Profiler à chaque interaction.

L'ordre d'intervention recommandé, par impact décroissant : activer le Compiler (gain immédiat sur tout l'arbre), code splitting des routes (gain fort sur LCP), optimisation des imports de librairies (gain fort sur le bundle), Server Components quand l'archi le permet (gain massif sur le JS envoyé). La mémoïsation manuelle ne figure plus dans cette liste — sauf cas exceptionnel signalé par le Profiler.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e" rx="12"/>
  <text x="350" y="28" font-family="monospace" font-size="13" fill="#00cffd" text-anchor="middle" font-weight="bold">MATRICE IMPACT × EFFORT — REACT 2026</text>
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
  <circle cx="170" cy="100" r="38" fill="#a7f3d0" fill-opacity="0.22" stroke="#a7f3d0" stroke-width="1.4"/>
  <text x="170" y="98" font-family="monospace" font-size="10" fill="#a7f3d0" text-anchor="middle" font-weight="bold">Compiler</text>
  <text x="170" y="110" font-family="monospace" font-size="8" fill="#a7f3d0" text-anchor="middle">activé</text>
  <text x="170" y="155" font-family="sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">1) toggle + tests</text>
  <circle cx="290" cy="130" r="32" fill="#a7f3d0" fill-opacity="0.18" stroke="#a7f3d0" stroke-width="1.2"/>
  <text x="290" y="128" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle" font-weight="bold">React.lazy</text>
  <text x="290" y="140" font-family="monospace" font-size="8" fill="#a7f3d0" text-anchor="middle">par route</text>
  <text x="290" y="175" font-family="sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">2) split routes</text>
  <circle cx="420" cy="150" r="28" fill="#fdba74" fill-opacity="0.18" stroke="#fdba74" stroke-width="1.2"/>
  <text x="420" y="148" font-family="monospace" font-size="9" fill="#fdba74" text-anchor="middle" font-weight="bold">named</text>
  <text x="420" y="160" font-family="monospace" font-size="8" fill="#fdba74" text-anchor="middle">imports</text>
  <text x="420" y="190" font-family="sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">3) lodash, date-fns</text>
  <circle cx="555" cy="110" r="32" fill="#fdba74" fill-opacity="0.18" stroke="#fdba74" stroke-width="1.2"/>
  <text x="555" y="108" font-family="monospace" font-size="9" fill="#fdba74" text-anchor="middle" font-weight="bold">Server</text>
  <text x="555" y="120" font-family="monospace" font-size="8" fill="#fdba74" text-anchor="middle">Components</text>
  <text x="555" y="155" font-family="sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">4) refonte archi (Next)</text>
  <circle cx="170" cy="265" r="22" fill="#b48bff" fill-opacity="0.18" stroke="#b48bff" stroke-width="1.2"/>
  <text x="170" y="263" font-family="monospace" font-size="8" fill="#b48bff" text-anchor="middle" font-weight="bold">react-scan</text>
  <text x="170" y="273" font-family="monospace" font-size="8" fill="#b48bff" text-anchor="middle">en dev</text>
  <text x="170" y="295" font-family="sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">à chaque session</text>
  <circle cx="310" cy="240" r="24" fill="#67e8f9" fill-opacity="0.18" stroke="#67e8f9" stroke-width="1.2"/>
  <text x="310" y="238" font-family="monospace" font-size="9" fill="#67e8f9" text-anchor="middle" font-weight="bold">virtualisation</text>
  <text x="310" y="250" font-family="monospace" font-size="8" fill="#67e8f9" text-anchor="middle">listes</text>
  <text x="310" y="275" font-family="sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">si &gt; 200 items</text>
  <circle cx="585" cy="265" r="28" fill="#fb7185" fill-opacity="0.18" stroke="#fb7185" stroke-width="1.2"/>
  <text x="585" y="263" font-family="monospace" font-size="9" fill="#fb7185" text-anchor="middle" font-weight="bold">useMemo</text>
  <text x="585" y="275" font-family="monospace" font-size="8" fill="#fb7185" text-anchor="middle">manuel partout</text>
  <text x="585" y="300" font-family="sans-serif" font-size="8" fill="#fb7185" text-anchor="middle">contre-productif en 2026</text>
</svg></div>

## Ce qu'on n'optimise pas (ou seulement quand on doit)

La **virtualisation de listes** (`react-window`, `TanStack Virtual`) mérite une mention : indispensable pour des listes de milliers d'éléments, inutile pour moins de 200 items. Avant d'implémenter la virtualisation, vérifier d'abord que le problème n'est pas un re-rendu inutile de la liste entière à chaque keystroke — avec le Compiler, ce problème disparaît souvent tout seul.

Le **streaming SSR** et Suspense côté serveur permettent d'envoyer le HTML progressivement, sans attendre que toutes les requêtes data soient résolues. Très puissant sur les pages lourdes en data, mais demande de structurer ses fetch côté composant (via `use()` ou les RSC) plutôt qu'en un bloc en haut.

Et un dernier rappel utile : **la perf perçue prime souvent sur la perf mesurée**. Un skeleton bien fait, une transition optimiste avec `useOptimistic`, un fallback Suspense soigné — ça change davantage l'expérience utilisateur que 30 ms gagnées sur un render. Le Compiler nous a rendu cette priorité plus claire : maintenant qu'on n'a plus besoin de courir après chaque micro-optim, on peut concentrer l'effort là où ça se voit.

## En résumé

Ce qu'il faut retenir si vous arrivez sur React en 2026 ou si vous reprenez une base 2022-2024 :

- **Activez React Compiler** au plus tôt. C'est le plus grand gain pour le moins d'effort, et il rend obsolète l'essentiel des conseils de mémoïsation manuelle.
- **Code splitting et imports ciblés** restent les leviers les plus impactants sur la taille du bundle et le LCP. Le Compiler n'y touche pas.
- **Server Components** quand l'archi le permet : c'est l'optimisation structurelle de la décennie.
- **Hooks React 19** (`useOptimistic`, `useActionState`, `use()`) pour la perf perçue — souvent plus visible que la perf mesurée.
- Le **Profiler reste utile**, mais regarde des problèmes différents : pas les re-renders en cascade (le Compiler s'en charge), plutôt les contextes globaux, le travail lourd dans le corps des composants, les stores qui notifient trop large.

React Compiler n'est pas magique. Il automatise une couche d'optimisation, libère du temps cerveau, et permet de coder plus simplement. La conception, l'architecture, les choix de découpage — ça reste votre travail. Et c'est plutôt une bonne nouvelle.
