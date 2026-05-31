---
title: "JavaScript moderne en pratique : les fonctionnalités qui changent vraiment le code"
description: "Optional chaining, nullish coalescing, structuredClone, Array.at() — les fonctionnalités ES2022+ qui simplifient l'écriture au quotidien, et les patterns à éviter."
publishDate: "2025-03-10"
updatedDate: "2026-06-01"
type: article
domain: developpement-web
image: "/images/themes/dev-web.webp"
pillColor: green
theme: technologie
tags:
  - developpement
  - javascript
  - es2022
  - bonnes-pratiques
---

Sur les revues de code chez ACTIV PARTNERS, j'ai vu des collègues écrire des conditions à cinq niveaux d'imbrication pour accéder à une propriété potentiellement nulle. Ce n'est pas une question de compétence — c'est une habitude héritée d'une époque où JavaScript n'avait pas les outils pour faire mieux. Aujourd'hui, ces outils existent, ils sont supportés nativement par tous les navigateurs modernes, et ils simplifient le code de façon concrète.

Voici un tour honnête des fonctionnalités ES2022+ qui valent d'être adoptées immédiatement, avec des exemples concrets, et quelques patterns à éviter parce qu'ils ajoutent de la complexité sans gain réel.

## Optional chaining et nullish coalescing : la paire gagnante

L'optional chaining (`?.`) est probablement la fonctionnalité qui a le plus réduit le code défensif dans mes projets. Avant :

```javascript
const city = user && user.address && user.address.city ? user.address.city : 'Non renseigné';
```

Après :

```javascript
const city = user?.address?.city ?? 'Non renseigné';
```

Le nullish coalescing (`??`) est différent du OR logique (`||`). L'opérateur `||` retourne la valeur de droite si la valeur de gauche est falsy — ce qui inclut `0`, `''` et `false`. Le `??` ne se déclenche que si la valeur de gauche est `null` ou `undefined`. Pour un champ de formulaire qui peut valoir `0` ou une chaîne vide, `??` est le bon choix.

Ces deux opérateurs fonctionnent aussi pour l'assignation : `user.settings ??= {}` initialise `settings` uniquement si la propriété est null ou undefined. C'est propre et lisible. La famille complète — `||=`, `&&=`, `??=` — couvre toutes les variantes : `||=` réécrit la valeur si elle est falsy, `&&=` ne réécrit que si elle est truthy (utile pour propager un changement seulement quand l'objet existe déjà), et `??=` initialise seulement si la valeur est null ou undefined. Sur la refonte des 8 sites WordPress que j'ai pilotée chez ACTIV PARTNERS, ces trois opérateurs ont remplacé une bonne partie des helpers `setDefault()` qu'on traînait depuis des années — du code mort qu'on n'osait plus toucher parce qu'il était utilisé partout.

## Top-level await : sortir de l'IIFE async

Avant ES2022, pour appeler une fonction asynchrone au chargement d'un module, il fallait l'envelopper dans une IIFE : `(async () => { await init(); })();`. C'était lisible une fois, illisible dix fois. Le top-level await permet désormais d'écrire directement `const config = await loadConfig();` à la racine d'un module ES. Sur un projet front-end Vite, c'est particulièrement utile pour charger une configuration distante avant l'initialisation du store, ou pour conditionner un import dynamique au résultat d'un fetch.

Une nuance importante : top-level await bloque l'évaluation des modules qui dépendent du module concerné. Sur une chaîne d'imports profonde, ça peut allonger sensiblement le temps de premier rendu. La règle que j'applique : top-level await dans les modules feuilles (configuration, données initiales), jamais dans les modules de logique métier réutilisés partout. Quand le runtime est Node 14+ ou tout navigateur evergreen depuis 2022, cette feature est utilisable sans précaution particulière.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="26" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Features ES par année — Support navigateur</text>
  <!-- Column headers -->
  <rect x="20" y="40" width="90" height="28" fill="#1e2a4a" rx="2"/>
  <rect x="115" y="40" width="80" height="28" fill="#1e2a4a" rx="2"/>
  <rect x="200" y="40" width="80" height="28" fill="#1e2a4a" rx="2"/>
  <rect x="285" y="40" width="80" height="28" fill="#1e2a4a" rx="2"/>
  <rect x="370" y="40" width="80" height="28" fill="#1e2a4a" rx="2"/>
  <rect x="455" y="40" width="80" height="28" fill="#1e2a4a" rx="2"/>
  <rect x="540" y="40" width="80" height="28" fill="#1e2a4a" rx="2"/>
  <rect x="625" y="40" width="60" height="28" fill="#1e2a4a" rx="2"/>
  <text x="65" y="59" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">Feature</text>
  <text x="155" y="59" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">ES2019</text>
  <text x="240" y="59" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">ES2020</text>
  <text x="325" y="59" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">ES2021</text>
  <text x="410" y="59" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">ES2022</text>
  <text x="495" y="59" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">ES2023</text>
  <text x="580" y="59" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">ES2024</text>
  <text x="655" y="59" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">Support</text>
  <!-- Row 1 — Optional chaining -->
  <rect x="20" y="73" width="90" height="30" fill="#0f1635" rx="2"/>
  <rect x="115" y="73" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="200" y="73" width="80" height="30" fill="#86efac" rx="2"/>
  <rect x="285" y="73" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="370" y="73" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="455" y="73" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="540" y="73" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="625" y="73" width="60" height="30" fill="#0a1f0a" rx="2"/>
  <text x="65" y="93" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">?.  ??</text>
  <text x="155" y="93" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">—</text>
  <text x="240" y="93" fill="#0a0f0a" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">ES2020</text>
  <text x="325" y="93" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">—</text>
  <text x="410" y="93" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">—</text>
  <text x="655" y="93" fill="#86efac" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">100%</text>
  <!-- Row 2 — Promise.allSettled -->
  <rect x="20" y="108" width="90" height="30" fill="#121a38" rx="2"/>
  <rect x="115" y="108" width="80" height="30" fill="#86efac" rx="2"/>
  <rect x="200" y="108" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="285" y="108" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="370" y="108" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="455" y="108" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="540" y="108" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="625" y="108" width="60" height="30" fill="#0a1f0a" rx="2"/>
  <text x="65" y="128" fill="#fff" font-family="monospace" font-size="9" text-anchor="middle">allSettled</text>
  <text x="155" y="128" fill="#0a0f0a" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">ES2019</text>
  <text x="655" y="128" fill="#86efac" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">100%</text>
  <!-- Row 3 — structuredClone -->
  <rect x="20" y="143" width="90" height="30" fill="#0f1635" rx="2"/>
  <rect x="115" y="143" width="80" height="30" fill="#121a38" rx="2"/>
  <rect x="200" y="143" width="80" height="30" fill="#121a38" rx="2"/>
  <rect x="285" y="143" width="80" height="30" fill="#121a38" rx="2"/>
  <rect x="370" y="143" width="80" height="30" fill="#86efac" rx="2"/>
  <rect x="455" y="143" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="540" y="143" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="625" y="143" width="60" height="30" fill="#0a1f0a" rx="2"/>
  <text x="65" y="163" fill="#fff" font-family="monospace" font-size="9" text-anchor="middle">structuredClone</text>
  <text x="410" y="163" fill="#0a0f0a" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">ES2022</text>
  <text x="655" y="163" fill="#86efac" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">97%</text>
  <!-- Row 4 — Array.at() -->
  <rect x="20" y="178" width="90" height="30" fill="#121a38" rx="2"/>
  <rect x="115" y="178" width="80" height="30" fill="#121a38" rx="2"/>
  <rect x="200" y="178" width="80" height="30" fill="#121a38" rx="2"/>
  <rect x="285" y="178" width="80" height="30" fill="#121a38" rx="2"/>
  <rect x="370" y="178" width="80" height="30" fill="#86efac" rx="2"/>
  <rect x="455" y="178" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="540" y="178" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="625" y="178" width="60" height="30" fill="#0a1f0a" rx="2"/>
  <text x="65" y="198" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">Array.at()</text>
  <text x="410" y="198" fill="#0a0f0a" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">ES2022</text>
  <text x="655" y="198" fill="#86efac" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">97%</text>
  <!-- Row 5 — Object.groupBy -->
  <rect x="20" y="213" width="90" height="30" fill="#0f1635" rx="2"/>
  <rect x="115" y="213" width="80" height="30" fill="#121a38" rx="2"/>
  <rect x="200" y="213" width="80" height="30" fill="#121a38" rx="2"/>
  <rect x="285" y="213" width="80" height="30" fill="#121a38" rx="2"/>
  <rect x="370" y="213" width="80" height="30" fill="#121a38" rx="2"/>
  <rect x="455" y="213" width="80" height="30" fill="#121a38" rx="2"/>
  <rect x="540" y="213" width="80" height="30" fill="#86efac" rx="2"/>
  <rect x="625" y="213" width="60" height="30" fill="#1a1a0a" rx="2"/>
  <text x="65" y="233" fill="#fff" font-family="monospace" font-size="9" text-anchor="middle">Object.groupBy</text>
  <text x="580" y="233" fill="#0a0f0a" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">ES2024</text>
  <text x="655" y="233" fill="#fbbf24" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">89%</text>
  <!-- Row 6 — Top-level await -->
  <rect x="20" y="248" width="90" height="30" fill="#121a38" rx="2"/>
  <rect x="115" y="248" width="80" height="30" fill="#121a38" rx="2"/>
  <rect x="200" y="248" width="80" height="30" fill="#121a38" rx="2"/>
  <rect x="285" y="248" width="80" height="30" fill="#86efac" rx="2"/>
  <rect x="370" y="248" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="455" y="248" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="540" y="248" width="80" height="30" fill="#0a1f0a" rx="2"/>
  <rect x="625" y="248" width="60" height="30" fill="#0a1f0a" rx="2"/>
  <text x="65" y="268" fill="#fff" font-family="monospace" font-size="9" text-anchor="middle">top-level await</text>
  <text x="325" y="268" fill="#0a0f0a" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">ES2022</text>
  <text x="655" y="268" fill="#86efac" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">95%</text>
  <!-- Legend -->
  <rect x="60" y="300" width="16" height="16" fill="#86efac" rx="2"/>
  <text x="82" y="313" fill="#fff" font-family="sans-serif" font-size="11">Année d'introduction</text>
  <rect x="260" y="300" width="16" height="16" fill="#0a1f0a" rx="2"/>
  <text x="282" y="313" fill="#fff" font-family="sans-serif" font-size="11">Supporté</text>
  <rect x="380" y="300" width="16" height="16" fill="#fbbf24" rx="2"/>
  <text x="402" y="313" fill="#fff" font-family="sans-serif" font-size="11">Support partiel</text>
  <rect x="520" y="300" width="16" height="16" fill="#121a38" rx="2"/>
  <text x="542" y="313" fill="#fff" font-family="sans-serif" font-size="11">Pas encore</text>
</svg></div>

## structuredClone et Array.at() : deux ajouts sous-estimés

`structuredClone()` est une fonction globale introduite en 2022 qui copie en profondeur un objet. Avant son existence, les développeurs utilisaient `JSON.parse(JSON.stringify(obj))` — une astuce qui ne gère pas les dates, les `Map`, les `Set` ou les valeurs `undefined`. `structuredClone` gère tout ça correctement.

```javascript
// Avant — approximatif
const copy = JSON.parse(JSON.stringify(original));

// Après — correct
const copy = structuredClone(original);
```

`Array.at()` résout un problème simple mais agaçant : accéder au dernier élément d'un tableau. Avant : `arr[arr.length - 1]`. Après : `arr.at(-1)`. Les indices négatifs fonctionnent comme en Python — `-1` est le dernier élément, `-2` l'avant-dernier. Le code est plus lisible, l'intention est claire.

`Promise.allSettled()` est la version plus robuste de `Promise.all()`. Là où `Promise.all` échoue dès qu'une promesse rejette, `allSettled` attend que toutes se terminent — réussites ou échecs — et retourne un tableau de résultats avec le statut de chacune. Pour des appels API indépendants où on veut traiter les erreurs individuellement, c'est le bon outil.

`Object.hasOwn()` mérite aussi d'être adopté à la place de `Object.prototype.hasOwnProperty.call(obj, key)`. Plus court, plus sûr — il fonctionne sur les objets créés avec `Object.create(null)` qui n'ont pas de prototype. Sur du code qui manipule des configurations sérialisées ou des dictionnaires arbitraires, c'est un détail qui évite un piège classique.

## Array immuable : toSorted, toReversed, with

ES2023 a introduit une famille de méthodes qui retournent un nouveau tableau au lieu de muter l'original : `toSorted()`, `toReversed()`, `toSpliced()` et `with(index, value)`. C'est un changement discret mais utile, notamment dans les composants React où muter un tableau d'état est une source de bugs récurrente. Avant, il fallait écrire `[...arr].sort()` pour ne pas modifier la référence d'origine. Maintenant, `arr.toSorted()` suffit. `arr.with(2, 'nouveau')` remplace l'élément à l'index 2 sans muter le tableau, ce qui rend les `setState` plus lisibles que les versions à base de `map((item, i) => i === 2 ? 'nouveau' : item)`. Sur les sites WordPress migrés, ces méthodes ont simplifié toutes les manipulations de listes d'articles, de menus et de filtres — la lisibilité y a gagné autant que les bugs y ont perdu.

## Décorateurs : stables depuis TypeScript 5

Les décorateurs ont longtemps été un terrain glissant : la proposition TC39 a changé plusieurs fois, TypeScript avait sa propre implémentation expérimentale, Angular utilisait encore l'ancienne syntaxe. Depuis TypeScript 5.0, la version stage 3 du TC39 est implémentée nativement — plus besoin du flag `experimentalDecorators`. C'est aujourd'hui un outil propre pour annoter des classes, des méthodes ou des accesseurs sans alourdir la logique métier. Les usages les plus utiles que j'ai croisés : marquer des méthodes pour la mesure de performance (`@measure`), valider des paramètres en entrée d'API, ou attacher des métadonnées à des modèles serveur. Je conseille de rester sobre — un décorateur masque du comportement, et trop de magie nuit à la maintenabilité.

## ES Modules : patterns qui valent la peine

Au-delà de la syntaxe `import`/`export`, deux patterns sont devenus la norme et méritent d'être adoptés systématiquement. Le premier : les imports dynamiques (`const mod = await import('./heavy.js')`) pour charger un module seulement quand il est nécessaire — typiquement une bibliothèque de graphiques qui ne sert qu'à la page de statistiques. Sur les sites WordPress refondus, ce pattern a divisé par deux le poids du bundle initial sans changer une ligne de logique métier. Le second : les re-exports nommés (`export { Button } from './Button'`) pour construire un index propre par dossier — plus lisible côté consommateur, plus facile à refactorer côté producteur. Ces patterns sont aujourd'hui supportés nativement par tous les bundlers (Vite, esbuild, Rollup, Webpack 5).

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="26" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Avant / Après — 3 patterns modernes</text>
  <!-- Section 1 — Optional chaining -->
  <text x="350" y="56" fill="#915EFF" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">1. Accès propriété nullable</text>
  <rect x="20" y="64" width="320" height="48" fill="#1a0a0a" rx="4"/>
  <text x="30" y="82" fill="#ef4444" font-family="monospace" font-size="10">// Avant</text>
  <text x="30" y="98" fill="#94a3b8" font-family="monospace" font-size="10">const c = u &amp;&amp; u.a &amp;&amp; u.a.city || 'N/A'</text>
  <rect x="360" y="64" width="320" height="48" fill="#0a1f0a" rx="4"/>
  <text x="370" y="82" fill="#86efac" font-family="monospace" font-size="10">// Après</text>
  <text x="370" y="98" fill="#86efac" font-family="monospace" font-size="10">const c = u?.a?.city ?? 'N/A'</text>
  <text x="340" y="93" fill="#fff" font-family="sans-serif" font-size="16" text-anchor="middle">→</text>
  <!-- Section 2 — Promise.allSettled -->
  <text x="350" y="134" fill="#00cffd" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">2. Requêtes parallèles indépendantes</text>
  <rect x="20" y="142" width="320" height="66" fill="#1a0a0a" rx="4"/>
  <text x="30" y="160" fill="#ef4444" font-family="monospace" font-size="10">// Avant — crash si une échoue</text>
  <text x="30" y="176" fill="#94a3b8" font-family="monospace" font-size="10">const [a, b] = await Promise.all([</text>
  <text x="30" y="192" fill="#94a3b8" font-family="monospace" font-size="10">  fetchA(), fetchB()])</text>
  <rect x="360" y="142" width="320" height="66" fill="#0a1f0a" rx="4"/>
  <text x="370" y="160" fill="#86efac" font-family="monospace" font-size="10">// Après — gère les erreurs par item</text>
  <text x="370" y="176" fill="#86efac" font-family="monospace" font-size="10">const res = await Promise.allSettled([</text>
  <text x="370" y="192" fill="#86efac" font-family="monospace" font-size="10">  fetchA(), fetchB()])</text>
  <text x="340" y="180" fill="#fff" font-family="sans-serif" font-size="16" text-anchor="middle">→</text>
  <!-- Section 3 — structuredClone -->
  <text x="350" y="232" fill="#fbbf24" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">3. Copie profonde d'objet</text>
  <rect x="20" y="240" width="320" height="66" fill="#1a0a0a" rx="4"/>
  <text x="30" y="258" fill="#ef4444" font-family="monospace" font-size="10">// Avant — perd Date, Map, undefined</text>
  <text x="30" y="274" fill="#94a3b8" font-family="monospace" font-size="10">const c = JSON.parse(</text>
  <text x="30" y="290" fill="#94a3b8" font-family="monospace" font-size="10">  JSON.stringify(original))</text>
  <rect x="360" y="240" width="320" height="66" fill="#0a1f0a" rx="4"/>
  <text x="370" y="258" fill="#86efac" font-family="monospace" font-size="10">// Après — copie correcte</text>
  <text x="370" y="274" fill="#86efac" font-family="monospace" font-size="10">const c = structuredClone(original)</text>
  <text x="340" y="278" fill="#fff" font-family="sans-serif" font-size="16" text-anchor="middle">→</text>
  <!-- Labels -->
  <rect x="20" y="320" width="80" height="22" fill="#1a0a0a" rx="3"/>
  <text x="60" y="335" fill="#ef4444" font-family="sans-serif" font-size="10" text-anchor="middle">Ancien pattern</text>
  <rect x="360" y="320" width="80" height="22" fill="#0a1f0a" rx="3"/>
  <text x="400" y="335" fill="#86efac" font-family="sans-serif" font-size="10" text-anchor="middle">Pattern moderne</text>
</svg></div>

## Les patterns à éviter malgré leur popularité

Le double bang `!!variable` pour convertir en booléen est plus ambigu que `Boolean(variable)`. Les deux font la même chose, mais `Boolean()` est explicite sur l'intention.

Les chaînes de `.then()` imbriquées restent fréquentes dans du code qui n'a pas été modernisé. Avec `async/await`, le code asynchrone se lit de façon linéaire et les erreurs se capturent avec un seul `try/catch`. Je ne passe plus de temps à déboguer des chaînes de promesses.

Le `var` n'a plus aucune raison d'être utilisé dans du code nouveau. `const` par défaut, `let` si la variable doit être réassignée. Le fait que `var` soit function-scoped au lieu de block-scoped crée des bugs discrets qui se cachent bien.

Enfin, les polyfills systématiques pour des fonctionnalités qui ont 97-100% de support navigateur sont un vestige d'une époque révolue. Vérifier le support sur Can I Use avant d'ajouter une dépendance reste un réflexe utile.

## Ce que la refonte de 8 sites WordPress a donné comme retour terrain

Quand on a entamé chez ACTIV PARTNERS la modernisation de 8 sites WordPress historiques — certains avec du JS écrit en 2014 — la promesse n'était pas "passer à la dernière norme". C'était de réduire le coût de maintenance. Les théories ne convainquent jamais une direction qui regarde un budget. Les chiffres, si.

Trois gains se sont matérialisés rapidement. D'abord, le volume de code défensif a fondu : entre l'optional chaining, le nullish coalescing et `structuredClone`, on a supprimé environ 30 % des lignes des modules de gestion du panier et des formulaires de contact. Ensuite, le temps moyen d'onboarding d'un développeur sur la base a chuté — un nouvel arrivant comprend `user?.profile?.email ?? 'anonyme'` instantanément, là où la version chaînée à base de `&&` demandait plusieurs minutes d'analyse. Enfin, le nombre de tickets de bug liés à des `undefined is not a function` a baissé d'environ 40 % sur les six mois suivant la migration — la cause racine, dans la majorité des cas, étant une mauvaise gestion des valeurs nulles que les nouveaux opérateurs encadrent par défaut.

Ce qui n'a pas marché : tenter de tout moderniser en une passe. Sur les deux premiers sites, on a essayé de réécrire les modules complexes (paiement, intégration ERP) avec async/await et top-level await. Résultat : des régressions discrètes, des bugs liés à des dépendances jQuery qui ne s'attendaient pas à recevoir des promesses. On a changé de méthode : moderniser opportunément, au fil des évolutions fonctionnelles, jamais comme refonte big-bang. La règle finale : le code legacy qui fonctionne et qu'on ne touche pas n'a aucune urgence à être modernisé. Le code qu'on ouvre pour ajouter une fonctionnalité, lui, mérite quinze minutes de mise au propre avant le commit.

> **En pratique** — Optional chaining, nullish coalescing, `structuredClone`, `Array.at()` et `Promise.allSettled()` sont les fonctionnalités ES2022+ qui changent le plus concrètement l'écriture quotidienne du code. Toutes sont supportées nativement à 95%+. Les patterns à éviter — `var`, chaînes de `.then()`, clones JSON — persistent par habitude plus que par nécessité.
