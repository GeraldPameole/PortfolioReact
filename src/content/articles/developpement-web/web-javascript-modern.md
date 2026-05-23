---
title: "JavaScript moderne en pratique : les fonctionnalités qui changent vraiment le code"
description: "Optional chaining, nullish coalescing, structuredClone, Array.at() — les fonctionnalités ES2022+ qui simplifient l'écriture au quotidien, et les patterns à éviter."
publishDate: "2025-03-10"
type: article
domain: developpement-web
image: "/images/themes/dev-web.webp"
pillColor: green
theme: technologie
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

Ces deux opérateurs fonctionnent aussi pour l'assignation : `user.settings ??= {}` initialise `settings` uniquement si la propriété est null ou undefined. C'est propre et lisible.

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

> **En pratique** — Optional chaining, nullish coalescing, `structuredClone`, `Array.at()` et `Promise.allSettled()` sont les fonctionnalités ES2022+ qui changent le plus concrètement l'écriture quotidienne du code. Toutes sont supportées nativement à 95%+. Les patterns à éviter — `var`, chaînes de `.then()`, clones JSON — persistent par habitude plus que par nécessité.
