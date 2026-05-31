---
title: "Diagrammes Mermaid : comment documenter efficacement avec du texte"
description: "Intégration dans GitHub, Notion et Confluence, types de diagrammes utiles en pratique, erreurs classiques et quand préférer Mermaid à Draw.io."
publishDate: "2026-04-20"
type: article
domain: outils-techniques
image: "/images/themes/dev-web.webp"
pillColor: slate
theme: technologie
tags:
  - outils
  - mermaid
  - documentation
  - diagrammes
---

## Pourquoi Mermaid a changé ma façon de documenter

Pendant longtemps, la documentation d'architecture était une corvée. Créer un diagramme dans Draw.io, l'exporter en PNG, l'intégrer dans Confluence, le mettre à jour six mois plus tard quand l'architecture avait changé — et recommencer. Le résultat : des diagrammes obsolètes que personne ne consulte plus.

Mermaid résout ce problème à la racine. Le diagramme est du texte. Il vit dans le même dépôt que le code. Il se versionne avec Git. Il se met à jour avec une simple modification de fichier.

Je suis développeur web chez ACTIV PARTNERS et chef de projet chez KEOS TELECOM. Voici ce que j'utilise vraiment, et ce que j'évite.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="22" fill="#fff" font-family="monospace" font-size="13" text-anchor="middle" font-weight="bold">Types de diagrammes Mermaid — cas d'usage réels</text>
  <!-- Grid 2x3 -->
  <!-- Row 1, Col 1: Flowchart -->
  <rect x="20" y="35" width="210" height="90" fill="#0a0f2e" stroke="#915EFF" stroke-width="1.5" rx="6"/>
  <text x="125" y="56" fill="#00cffd" font-family="monospace" font-size="12" text-anchor="middle" font-weight="bold">Flowchart</text>
  <text x="125" y="74" fill="#86efac" font-family="monospace" font-size="10" text-anchor="middle">→ Documenter un processus</text>
  <text x="125" y="90" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">CI/CD, workflow métier,</text>
  <text x="125" y="106" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">arbre de décision</text>
  <!-- Row 1, Col 2: Sequence -->
  <rect x="245" y="35" width="210" height="90" fill="#0a0f2e" stroke="#915EFF" stroke-width="1.5" rx="6"/>
  <text x="350" y="56" fill="#00cffd" font-family="monospace" font-size="12" text-anchor="middle" font-weight="bold">Sequence</text>
  <text x="350" y="74" fill="#86efac" font-family="monospace" font-size="10" text-anchor="middle">→ Interactions API/services</text>
  <text x="350" y="90" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">Auth OAuth, webhooks,</text>
  <text x="350" y="106" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">appels microservices</text>
  <!-- Row 1, Col 3: Gantt -->
  <rect x="470" y="35" width="210" height="90" fill="#0a0f2e" stroke="#915EFF" stroke-width="1.5" rx="6"/>
  <text x="575" y="56" fill="#00cffd" font-family="monospace" font-size="12" text-anchor="middle" font-weight="bold">Gantt</text>
  <text x="575" y="74" fill="#86efac" font-family="monospace" font-size="10" text-anchor="middle">→ Planning de projet</text>
  <text x="575" y="90" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">Sprint planning, roadmap,</text>
  <text x="575" y="106" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">jalons de livraison</text>
  <!-- Row 2, Col 1: Class -->
  <rect x="20" y="140" width="210" height="90" fill="#0a0f2e" stroke="#915EFF" stroke-width="1.5" rx="6"/>
  <text x="125" y="161" fill="#00cffd" font-family="monospace" font-size="12" text-anchor="middle" font-weight="bold">Class Diagram</text>
  <text x="125" y="179" fill="#86efac" font-family="monospace" font-size="10" text-anchor="middle">→ Architecture logicielle</text>
  <text x="125" y="195" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">Modèle objet, héritage,</text>
  <text x="125" y="211" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">interfaces, associations</text>
  <!-- Row 2, Col 2: ER -->
  <rect x="245" y="140" width="210" height="90" fill="#0a0f2e" stroke="#915EFF" stroke-width="1.5" rx="6"/>
  <text x="350" y="161" fill="#00cffd" font-family="monospace" font-size="12" text-anchor="middle" font-weight="bold">ER Diagram</text>
  <text x="350" y="179" fill="#86efac" font-family="monospace" font-size="10" text-anchor="middle">→ Schéma de données</text>
  <text x="350" y="195" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">Modèle BDD, relations,</text>
  <text x="350" y="211" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">cardinalités, clés</text>
  <!-- Row 2, Col 3: State -->
  <rect x="470" y="140" width="210" height="90" fill="#0a0f2e" stroke="#915EFF" stroke-width="1.5" rx="6"/>
  <text x="575" y="161" fill="#00cffd" font-family="monospace" font-size="12" text-anchor="middle" font-weight="bold">State Diagram</text>
  <text x="575" y="179" fill="#86efac" font-family="monospace" font-size="10" text-anchor="middle">→ Machine à états</text>
  <text x="575" y="195" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">Statut commande, auth,</text>
  <text x="575" y="211" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">cycle de vie document</text>
  <!-- Practical usage indicator -->
  <text x="350" y="255" fill="#fbbf24" font-family="monospace" font-size="11" text-anchor="middle">Utilisation quotidienne sur projets KEOS/ACTIV :</text>
  <text x="350" y="273" fill="#fff" font-family="monospace" font-size="11" text-anchor="middle">Flowchart + Sequence = 80% des besoins couverts</text>
  <text x="350" y="294" fill="#86efac" font-family="monospace" font-size="10" text-anchor="middle">Class + ER = documentation architecture longue durée</text>
  <text x="350" y="314" fill="#915EFF" font-family="monospace" font-size="10" text-anchor="middle">Gantt + State = cas spécifiques projet/produit</text>
</svg></div>

## Ce que j'utilise vraiment au quotidien

**Flowchart pour les processus** : c'est mon outil de référence pour tout workflow métier ou CI/CD. La syntaxe est simple, le rendu est immédiatement lisible. En moins de 10 lignes, je peux décrire un pipeline de déploiement complet ou un parcours de validation.

**Sequence diagram pour les APIs** : quand j'onboard un nouveau développeur sur un projet qui implique plusieurs services ou une authentification OAuth, je commence toujours par un sequence diagram. Il montre qui parle à qui, dans quel ordre, et quel type de réponse est attendu. C'est infiniment plus efficace qu'une page de texte.

**Class diagram pour l'architecture** : en début de projet, je l'utilise pour aligner l'équipe sur le modèle de données avant d'écrire la première ligne de code. En TypeScript, ça se traduit directement en interfaces.

**ER diagram pour les bases de données** : je l'utilise systématiquement quand on doit expliquer un schéma relationnel à un non-technique — chef de projet, client, product owner. La lisibilité est bien meilleure qu'un export SQL brut.

Les diagrammes Gantt et State sont utiles mais situationnels. Je ne les utilise pas par défaut.

## Intégration dans GitHub, Notion et Confluence

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="22" fill="#fff" font-family="monospace" font-size="13" text-anchor="middle" font-weight="bold">Workflow documentation Mermaid — du code au rendu</text>
  <!-- Pipeline steps -->
  <!-- Step 1: Code source -->
  <rect x="20" y="60" width="120" height="60" fill="#915EFF" fill-opacity="0.3" stroke="#915EFF" stroke-width="2" rx="6"/>
  <text x="80" y="86" fill="#fff" font-family="monospace" font-size="11" text-anchor="middle" font-weight="bold">Code source</text>
  <text x="80" y="104" fill="#86efac" font-family="monospace" font-size="10" text-anchor="middle">.ts / .js / .md</text>
  <!-- Arrow -->
  <line x1="140" y1="90" x2="165" y2="90" stroke="#00cffd" stroke-width="2"/>
  <polygon points="165,85 175,90 165,95" fill="#00cffd"/>
  <!-- Step 2: Fichier .md -->
  <rect x="175" y="60" width="120" height="60" fill="#00cffd" fill-opacity="0.2" stroke="#00cffd" stroke-width="2" rx="6"/>
  <text x="235" y="82" fill="#fff" font-family="monospace" font-size="11" text-anchor="middle" font-weight="bold">Fichier .md</text>
  <text x="235" y="98" fill="#86efac" font-family="monospace" font-size="10" text-anchor="middle">```mermaid</text>
  <text x="235" y="112" fill="#86efac" font-family="monospace" font-size="10" text-anchor="middle">graph LR...</text>
  <!-- Arrow -->
  <line x1="295" y1="90" x2="320" y2="90" stroke="#00cffd" stroke-width="2"/>
  <polygon points="320,85 330,90 320,95" fill="#00cffd"/>
  <!-- Step 3: Rendu automatique -->
  <rect x="330" y="60" width="120" height="60" fill="#fbbf24" fill-opacity="0.2" stroke="#fbbf24" stroke-width="2" rx="6"/>
  <text x="390" y="82" fill="#fff" font-family="monospace" font-size="11" text-anchor="middle" font-weight="bold">Rendu auto</text>
  <text x="390" y="98" fill="#fbbf24" font-family="monospace" font-size="10" text-anchor="middle">mermaid.js</text>
  <text x="390" y="114" fill="#fbbf24" font-family="monospace" font-size="10" text-anchor="middle">parse + render</text>
  <!-- Arrow -->
  <line x1="450" y1="90" x2="475" y2="90" stroke="#00cffd" stroke-width="2"/>
  <polygon points="475,85 485,90 475,95" fill="#00cffd"/>
  <!-- Step 4: Destinations -->
  <rect x="485" y="40" width="190" height="100" fill="#86efac" fill-opacity="0.1" stroke="#86efac" stroke-width="1.5" rx="6"/>
  <text x="580" y="62" fill="#86efac" font-family="monospace" font-size="11" text-anchor="middle" font-weight="bold">Plateformes</text>
  <text x="580" y="80" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">GitHub (natif depuis 2022)</text>
  <text x="580" y="96" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">VS Code (extension)</text>
  <text x="580" y="112" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">Notion (intégration native)</text>
  <text x="580" y="128" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">Confluence (plugin)</text>
  <!-- Annotations -->
  <text x="350" y="190" fill="#fbbf24" font-family="monospace" font-size="11" text-anchor="middle" font-weight="bold">Erreurs classiques à éviter</text>
  <rect x="20" y="205" width="200" height="70" fill="#0a0f2e" stroke="#fbbf24" stroke-width="1" rx="4"/>
  <text x="120" y="222" fill="#fbbf24" font-family="monospace" font-size="10" text-anchor="middle">Indentation incorrecte</text>
  <text x="120" y="240" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">→ Le parser est sensible</text>
  <text x="120" y="258" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">aux espaces et tabulations</text>
  <rect x="240" y="205" width="200" height="70" fill="#0a0f2e" stroke="#fbbf24" stroke-width="1" rx="4"/>
  <text x="340" y="222" fill="#fbbf24" font-family="monospace" font-size="10" text-anchor="middle">Caractères spéciaux</text>
  <text x="340" y="240" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">→ () : ; dans les labels</text>
  <text x="340" y="258" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">cassent le rendu</text>
  <rect x="460" y="205" width="220" height="70" fill="#0a0f2e" stroke="#fbbf24" stroke-width="1" rx="4"/>
  <text x="570" y="222" fill="#fbbf24" font-family="monospace" font-size="10" text-anchor="middle">Diagrammes trop larges</text>
  <text x="570" y="240" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">→ Découper en plusieurs</text>
  <text x="570" y="258" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">sous-diagrammes</text>
  <!-- Quand Mermaid vs Draw.io -->
  <text x="350" y="305" fill="#00cffd" font-family="monospace" font-size="11" text-anchor="middle" font-weight="bold">Mermaid vs Draw.io — quand choisir quoi</text>
  <text x="175" y="325" fill="#86efac" font-family="monospace" font-size="10" text-anchor="middle">Mermaid : versionnable, texte, CI/CD</text>
  <text x="525" y="325" fill="#915EFF" font-family="monospace" font-size="10" text-anchor="middle">Draw.io : libre-forme, client non-tech</text>
  <line x1="350" y1="315" x2="350" y2="340" stroke="#fff" stroke-width="1"/>
</svg></div>

**GitHub** supporte Mermaid nativement dans les fichiers Markdown depuis 2022. Rien à installer — un bloc ` ```mermaid ` est rendu automatiquement dans les README, les issues et les wikis. C'est mon canal principal.

**VS Code** avec l'extension Markdown Preview Enhanced permet de voir le rendu en temps réel. Indispensable pour travailler confortablement.

**Notion** intègre Mermaid via un bloc code avec le langage "mermaid". Le rendu est propre mais le support des syntaxes avancées est partiel.

**Confluence** nécessite un plugin (Mermaid for Confluence). Sur les projets KEOS, j'ai dû convaincre l'équipe IT de l'installer — ce point de friction est à anticiper.

## Les erreurs classiques que j'ai faites

**L'indentation** : Mermaid est sensible aux espaces. Un tab au lieu d'espaces, ou un mauvais niveau d'indentation dans un subgraph, et le diagramme refuse de se rendre sans message d'erreur clair.

**Les caractères spéciaux dans les labels** : les parenthèses, les deux-points et les points-virgules cassent le parser. La solution : mettre le label entre guillemets doubles.

**Les diagrammes trop denses** : j'ai voulu représenter toute une architecture microservices en un seul flowchart. Le résultat était illisible. La bonne pratique : un diagramme par niveau d'abstraction, avec des liens entre eux dans la documentation.

**Mermaid vs Draw.io : la bonne question**

Mermaid gagne quand le diagramme évolue souvent et doit rester synchronisé avec le code. Draw.io gagne quand le diagramme est complexe visuellement (positionnement précis, formes libres), ou quand l'audience est non-technique et a besoin d'un visuel soigné pour une présentation.

Dans mon workflow : Mermaid pour la documentation interne et technique, Draw.io ou Excalidraw pour les supports clients et les présentations direction.

## Ce que je recommande pour démarrer

Commencez par un seul type de diagramme — le flowchart. Documentez un seul processus que vous connaissez bien. Commitez-le dans votre dépôt, liez-le depuis votre README. Montrez-le à votre équipe.

Quand ce réflexe est ancré, ajoutez le sequence diagram pour les APIs. Puis le ER diagram pour la base de données. Ne cherchez pas à couvrir tous les types en même temps.

> **Le vrai bilan** — Mermaid est l'outil de documentation technique le plus efficace que j'utilise au quotidien : les diagrammes se versionnent avec le code, se rendent automatiquement dans GitHub et Notion, et restent maintenables dans le temps. Les types les plus utiles en pratique sont le flowchart et le sequence diagram. Les erreurs classiques sont l'indentation, les caractères spéciaux et les diagrammes trop denses. Préférez Draw.io quand le rendu visuel soigné prime sur la maintenabilité.
