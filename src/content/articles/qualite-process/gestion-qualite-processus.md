---
title: "Gestion de la qualité des processus : cartographier avant d'améliorer"
description: "Les cinq défaillances de processus les plus courantes dans les PME, comment cartographier un processus avant de le toucher, et sur quoi concentrer les premiers efforts."
publishDate: "2026-08-24"
type: article
domain: qualite-process
image: "/images/themes/management.webp"
pillColor: purple
relatedArticles:
  - domain: qualite-process
  - pillColor: purple
  - theme: gestion
  - keywords:
theme: gestion
tags:
  - qualite
  - processus
  - amelioration-continue

---

Quand on parle de qualité des processus dans une PME, la première réaction est souvent de chercher une méthode ou un logiciel. C'est l'erreur classique. Avant d'améliorer quoi que ce soit, il faut savoir précisément ce qui se passe aujourd'hui — pas ce que les procédures écrites disent, mais ce qui se passe vraiment. Ces deux réalités sont presque toujours différentes.

Depuis 2021, une partie de mon travail chez KEOS TELECOM consiste à analyser des flux de validation et de traitement. Ce que j'observe systématiquement : les organisations qui tentent d'optimiser sans avoir cartographié créent de l'efficacité sur des étapes qui ne posaient pas de problème, et laissent intact le vrai goulot.

## Cartographier d'abord : pourquoi et comment

La cartographie de processus n'est pas un exercice formel pour les auditeurs. C'est un outil de compréhension partagée. Quand on réunit les personnes qui exécutent un processus et qu'on leur demande de le décrire pas à pas, deux choses se produisent : on découvre que chacun a une vision légèrement différente du flux, et on identifie des étapes que personne n'a remises en question depuis des années.

La méthode la plus simple et la plus efficace que j'utilise : une session de travail avec les acteurs directs, un tableau blanc (ou son équivalent numérique), et une règle — on décrit ce qui se passe réellement, pas ce qui devrait se passer. On commence par les entrées (qu'est-ce qui déclenche ce processus ?), on suit chaque étape dans l'ordre, on identifie les décisions (les bifurcations du flux), et on termine par les sorties (qu'est-ce que ce processus produit ?).

<div style="overflow-x:auto;margin:2rem 0">
<svg viewBox="0 0 680 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:680px;display:block;margin:auto;font-family:sans-serif">
  <rect width="680" height="260" rx="12" fill="#0a0f2e"/>
  <text x="340" y="22" text-anchor="middle" fill="#e2e8f0" font-size="11" font-weight="bold">Processus de validation — exemple simplifié</text>
  <!-- Defs -->
  <defs>
    <marker id="arrowq" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#915EFF"/>
    </marker>
    <marker id="arrowred" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#ef4444"/>
    </marker>
    <marker id="arrowgrn" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#86efac"/>
    </marker>
  </defs>
  <!-- Node 1: Demande reçue -->
  <rect x="20" y="100" width="90" height="44" rx="8" fill="#1a1f4e" stroke="#86efac" stroke-width="1.5"/>
  <text x="65" y="119" text-anchor="middle" fill="#86efac" font-size="9" font-weight="bold">Demande</text>
  <text x="65" y="133" text-anchor="middle" fill="#86efac" font-size="9">reçue</text>
  <!-- Arrow 1→2 -->
  <line x1="110" y1="122" x2="138" y2="122" stroke="#915EFF" stroke-width="1.5" marker-end="url(#arrowq)"/>
  <!-- Node 2: Vérification dossier -->
  <rect x="140" y="100" width="90" height="44" rx="8" fill="#1a1f4e" stroke="#00cffd" stroke-width="1.5"/>
  <text x="185" y="119" text-anchor="middle" fill="#00cffd" font-size="9" font-weight="bold">Vérification</text>
  <text x="185" y="133" text-anchor="middle" fill="#00cffd" font-size="9">dossier</text>
  <!-- Arrow 2→3 -->
  <line x1="230" y1="122" x2="258" y2="122" stroke="#915EFF" stroke-width="1.5" marker-end="url(#arrowq)"/>
  <!-- Node 3: Validation N+1 — BOTTLENECK -->
  <rect x="260" y="88" width="110" height="68" rx="8" fill="#2d1515" stroke="#ef4444" stroke-width="2.5"/>
  <text x="315" y="108" text-anchor="middle" fill="#ef4444" font-size="9" font-weight="bold">Validation N+1</text>
  <text x="315" y="122" text-anchor="middle" fill="#fbbf24" font-size="8">GOULOT</text>
  <text x="315" y="138" text-anchor="middle" fill="#fca5a5" font-size="8">délai moyen : 4 j</text>
  <text x="315" y="150" text-anchor="middle" fill="#fca5a5" font-size="8">file d'attente : 12</text>
  <!-- Arrow 3→4 -->
  <line x1="370" y1="122" x2="398" y2="122" stroke="#ef4444" stroke-width="1.8" marker-end="url(#arrowred)"/>
  <!-- Node 4: Traitement -->
  <rect x="400" y="100" width="90" height="44" rx="8" fill="#1a1f4e" stroke="#915EFF" stroke-width="1.5"/>
  <text x="445" y="119" text-anchor="middle" fill="#915EFF" font-size="9" font-weight="bold">Traitement</text>
  <text x="445" y="133" text-anchor="middle" fill="#915EFF" font-size="9">opérationnel</text>
  <!-- Arrow 4→5 -->
  <line x1="490" y1="122" x2="518" y2="122" stroke="#915EFF" stroke-width="1.5" marker-end="url(#arrowq)"/>
  <!-- Node 5: Contrôle qualité -->
  <rect x="520" y="100" width="90" height="44" rx="8" fill="#1a1f4e" stroke="#00cffd" stroke-width="1.5"/>
  <text x="565" y="119" text-anchor="middle" fill="#00cffd" font-size="9" font-weight="bold">Contrôle</text>
  <text x="565" y="133" text-anchor="middle" fill="#00cffd" font-size="9">qualité</text>
  <!-- Arrow 5→6 -->
  <line x1="610" y1="122" x2="638" y2="122" stroke="#86efac" stroke-width="1.5" marker-end="url(#arrowgrn)"/>
  <!-- Node 6: Livraison -->
  <rect x="640" y="100" width="30" height="44" rx="8" fill="#1a1f4e" stroke="#86efac" stroke-width="1.5"/>
  <text x="655" y="119" text-anchor="middle" fill="#86efac" font-size="8" font-weight="bold">Fin</text>
  <text x="655" y="133" text-anchor="middle" fill="#86efac" font-size="8">✓</text>
  <!-- Rejection path from node 3 -->
  <path d="M315,156 Q315,200 185,200 Q140,200 140,155" stroke="#fbbf24" stroke-width="1.2" fill="none" stroke-dasharray="4,3" marker-end="url(#arrowq)"/>
  <text x="248" y="215" text-anchor="middle" fill="#fbbf24" font-size="8">Renvoi pour correction (35 % des cas)</text>
  <!-- Legend bottleneck -->
  <rect x="20" y="195" width="12" height="12" rx="2" fill="#2d1515" stroke="#ef4444" stroke-width="1.5"/>
  <text x="38" y="206" fill="#ef4444" font-size="9">Goulot identifié</text>
  <rect x="130" y="195" width="12" height="12" rx="2" fill="#1a1f4e" stroke="#915EFF" stroke-width="1.2"/>
  <text x="148" y="206" fill="#cbd5e1" font-size="9">Étape standard</text>
</svg>
</div>

Ce schéma, je le construis sur le terrain avec les équipes. Le goulot apparaît toujours naturellement quand on commence à noter les délais réels à chaque étape. Ici, la validation par le N+1 concentre la quasi-totalité du temps de traitement. Avant d'optimiser le reste du processus, c'est ce point qu'il faut traiter.

## Les cinq défaillances les plus courantes dans les PME

Après plusieurs années à travailler avec des structures de taille moyenne, j'ai identifié cinq problèmes qui reviennent avec une régularité frappante.

**1. La validation en entonnoir.** Une seule personne valide tout. En son absence, le flux s'arrête. Ce n'est pas de la qualité — c'est de la dépendance. La solution n'est pas toujours de supprimer la validation, mais de la répartir ou de définir les cas où elle est vraiment nécessaire.

**2. Le processus non documenté.** Tout repose sur la mémoire de deux ou trois personnes. Quand l'une d'elles quitte l'entreprise ou est absente, le processus se dégrade. La documentation n'a pas besoin d'être un manuel de 50 pages — une procédure d'une page avec les étapes principales, les responsables et les critères de décision suffit dans la majorité des cas.

**3. Les contrôles redondants.** Le même document est vérifié par trois personnes différentes sans valeur ajoutée différenciée à chaque étape. C'est un héritage de méfiance institutionnelle, souvent créé après un incident passé et jamais remis en question. Chaque contrôle doit avoir un périmètre précis et différent des autres.

**4. L'absence de critère de sortie.** Le processus ne définit pas clairement quand une étape est terminée. Résultat : chacun a sa propre interprétation, les allers-retours se multiplient, et personne ne sait vraiment si le travail est fait ou non.

**5. Les outils qui court-circuitent le processus.** On a un processus officiel, et en parallèle tout le monde utilise le mail, WhatsApp ou un fichier Excel personnel pour tracer les demandes. L'outil officiel est vide, le vrai flux est invisible. Ce n'est pas un problème d'outil — c'est un signal que le processus officiel génère trop de friction.

<div style="overflow-x:auto;margin:2rem 0">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e" rx="12"/>
  <text x="350" y="28" font-family="monospace" font-size="13" fill="#00cffd" text-anchor="middle" font-weight="bold">CINQ DÉFAILLANCES RÉCURRENTES DANS LES PME</text>
  <text x="350" y="46" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="middle">repérer le bon symptôme pour cibler le bon levier</text>
  <!-- Carte 1 : Validation en entonnoir -->
  <rect x="30" y="70" width="125" height="265" rx="8" fill="#1a1f4e" stroke="#ef4444" stroke-width="1.2"/>
  <circle cx="92" cy="100" r="18" fill="#0a0f2e" stroke="#ef4444" stroke-width="1.5"/>
  <text x="92" y="106" font-family="monospace" font-size="13" fill="#fb7185" text-anchor="middle" font-weight="bold">1</text>
  <text x="92" y="138" font-family="monospace" font-size="10" fill="#fca5a5" text-anchor="middle" font-weight="bold">Validation</text>
  <text x="92" y="151" font-family="monospace" font-size="10" fill="#fca5a5" text-anchor="middle" font-weight="bold">en entonnoir</text>
  <line x1="50" y1="165" x2="135" y2="165" stroke="#ef4444" stroke-width="0.5" opacity="0.5"/>
  <text x="92" y="183" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Une seule</text>
  <text x="92" y="196" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">personne valide</text>
  <text x="92" y="209" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">tout. Absence =</text>
  <text x="92" y="222" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">flux arrêté.</text>
  <text x="92" y="260" font-family="monospace" font-size="8" fill="#fbbf24" text-anchor="middle" font-weight="bold">→ LEVIER</text>
  <text x="92" y="278" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">Répartir ou</text>
  <text x="92" y="291" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">cibler les cas</text>
  <text x="92" y="304" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">qui justifient</text>
  <text x="92" y="317" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">une validation</text>
  <!-- Carte 2 : Non documenté -->
  <rect x="165" y="70" width="125" height="265" rx="8" fill="#1a1f4e" stroke="#fb923c" stroke-width="1.2"/>
  <circle cx="227" cy="100" r="18" fill="#0a0f2e" stroke="#fb923c" stroke-width="1.5"/>
  <text x="227" y="106" font-family="monospace" font-size="13" fill="#fdba74" text-anchor="middle" font-weight="bold">2</text>
  <text x="227" y="138" font-family="monospace" font-size="10" fill="#fdba74" text-anchor="middle" font-weight="bold">Processus</text>
  <text x="227" y="151" font-family="monospace" font-size="10" fill="#fdba74" text-anchor="middle" font-weight="bold">non documenté</text>
  <line x1="185" y1="165" x2="270" y2="165" stroke="#fb923c" stroke-width="0.5" opacity="0.5"/>
  <text x="227" y="183" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Tout repose</text>
  <text x="227" y="196" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">sur 2-3 mémoires.</text>
  <text x="227" y="209" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Un départ et le</text>
  <text x="227" y="222" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">flux se dégrade.</text>
  <text x="227" y="260" font-family="monospace" font-size="8" fill="#fbbf24" text-anchor="middle" font-weight="bold">→ LEVIER</text>
  <text x="227" y="278" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">Une page : étapes,</text>
  <text x="227" y="291" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">responsables,</text>
  <text x="227" y="304" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">critères de</text>
  <text x="227" y="317" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">décision.</text>
  <!-- Carte 3 : Contrôles redondants -->
  <rect x="300" y="70" width="125" height="265" rx="8" fill="#1a1f4e" stroke="#fbbf24" stroke-width="1.2"/>
  <circle cx="362" cy="100" r="18" fill="#0a0f2e" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="362" y="106" font-family="monospace" font-size="13" fill="#fbbf24" text-anchor="middle" font-weight="bold">3</text>
  <text x="362" y="138" font-family="monospace" font-size="10" fill="#fde68a" text-anchor="middle" font-weight="bold">Contrôles</text>
  <text x="362" y="151" font-family="monospace" font-size="10" fill="#fde68a" text-anchor="middle" font-weight="bold">redondants</text>
  <line x1="320" y1="165" x2="405" y2="165" stroke="#fbbf24" stroke-width="0.5" opacity="0.5"/>
  <text x="362" y="183" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Trois personnes</text>
  <text x="362" y="196" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">vérifient la</text>
  <text x="362" y="209" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">même chose, sans</text>
  <text x="362" y="222" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">valeur ajoutée.</text>
  <text x="362" y="260" font-family="monospace" font-size="8" fill="#fbbf24" text-anchor="middle" font-weight="bold">→ LEVIER</text>
  <text x="362" y="278" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">Périmètre précis</text>
  <text x="362" y="291" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">et différencié</text>
  <text x="362" y="304" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">par contrôle.</text>
  <!-- Carte 4 : Critère sortie -->
  <rect x="435" y="70" width="125" height="265" rx="8" fill="#1a1f4e" stroke="#00cffd" stroke-width="1.2"/>
  <circle cx="497" cy="100" r="18" fill="#0a0f2e" stroke="#00cffd" stroke-width="1.5"/>
  <text x="497" y="106" font-family="monospace" font-size="13" fill="#67e8f9" text-anchor="middle" font-weight="bold">4</text>
  <text x="497" y="138" font-family="monospace" font-size="10" fill="#67e8f9" text-anchor="middle" font-weight="bold">Critère de</text>
  <text x="497" y="151" font-family="monospace" font-size="10" fill="#67e8f9" text-anchor="middle" font-weight="bold">sortie absent</text>
  <line x1="455" y1="165" x2="540" y2="165" stroke="#00cffd" stroke-width="0.5" opacity="0.5"/>
  <text x="497" y="183" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">"L'étape est</text>
  <text x="497" y="196" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">terminée quand ?"</text>
  <text x="497" y="209" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Chacun a sa</text>
  <text x="497" y="222" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">propre réponse.</text>
  <text x="497" y="260" font-family="monospace" font-size="8" fill="#fbbf24" text-anchor="middle" font-weight="bold">→ LEVIER</text>
  <text x="497" y="278" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">Definition of</text>
  <text x="497" y="291" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">Done explicite</text>
  <text x="497" y="304" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">et vérifiable</text>
  <text x="497" y="317" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">par tous.</text>
  <!-- Carte 5 : Outils parallèles -->
  <rect x="570" y="70" width="125" height="265" rx="8" fill="#1a1f4e" stroke="#915EFF" stroke-width="1.2"/>
  <circle cx="632" cy="100" r="18" fill="#0a0f2e" stroke="#915EFF" stroke-width="1.5"/>
  <text x="632" y="106" font-family="monospace" font-size="13" fill="#b48bff" text-anchor="middle" font-weight="bold">5</text>
  <text x="632" y="138" font-family="monospace" font-size="10" fill="#c4b5fd" text-anchor="middle" font-weight="bold">Outils qui</text>
  <text x="632" y="151" font-family="monospace" font-size="10" fill="#c4b5fd" text-anchor="middle" font-weight="bold">court-circuitent</text>
  <line x1="590" y1="165" x2="675" y2="165" stroke="#915EFF" stroke-width="0.5" opacity="0.5"/>
  <text x="632" y="183" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Mail, WhatsApp,</text>
  <text x="632" y="196" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Excel perso.</text>
  <text x="632" y="209" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">L'outil officiel</text>
  <text x="632" y="222" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">est vide.</text>
  <text x="632" y="260" font-family="monospace" font-size="8" fill="#fbbf24" text-anchor="middle" font-weight="bold">→ LEVIER</text>
  <text x="632" y="278" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">Réduire la</text>
  <text x="632" y="291" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">friction du</text>
  <text x="632" y="304" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">canal officiel,</text>
  <text x="632" y="317" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">pas l'imposer.</text>
  <text x="350" y="352" font-family="monospace" font-size="10" fill="#00cffd" text-anchor="middle" font-weight="bold">le bon levier = la vraie cause, jamais le symptôme</text>
</svg>
</div>

## Prioriser ce qu'on améliore en premier

Tout améliorer en même temps ne fonctionne pas. En dehors des ressources que cela mobilise, changer plusieurs choses simultanément rend impossible de savoir ce qui a eu un effet.

La question à se poser pour prioriser est simple : quelle est l'étape qui crée le plus de délai, d'erreurs, ou de frustration pour les acteurs du processus ? Ces trois critères pointent presque toujours vers le même endroit. On commence par là.

Une fois le goulot identifié, on applique la même logique : quelle est la cause principale de ce goulot ? Manque de capacité, mauvaise définition des critères, mauvais canal d'information ? On traite la cause, pas le symptôme. Ajouter une ressource sur un goulot causé par des critères flous ne règle rien — ça dilue juste le problème.

Les améliorations de processus qui échouent ont presque toujours en commun de ne pas avoir répondu à cette question préalable. On optimise des étapes secondaires, on achète un outil, on forme les gens sur des procédures qui ne résolvent pas le vrai problème. Cartographier d'abord, mesurer ensuite, améliorer en dernier : cet ordre n'est pas intuitif, mais il fait gagner du temps.

<div style="overflow-x:auto;margin:2rem 0">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e" rx="12"/>
  <text x="350" y="28" font-family="monospace" font-size="13" fill="#00cffd" text-anchor="middle" font-weight="bold">MATRICE DE PRIORISATION — EFFORT × IMPACT</text>
  <text x="350" y="46" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="middle">par où commencer quand tout semble à corriger</text>
  <!-- Axes -->
  <line x1="160" y1="70" x2="160" y2="320" stroke="#7e8da4" stroke-width="1"/>
  <line x1="160" y1="320" x2="640" y2="320" stroke="#7e8da4" stroke-width="1"/>
  <!-- Axe labels -->
  <text x="155" y="80" font-family="monospace" font-size="10" fill="#cbd5e1" text-anchor="end" font-weight="bold">Impact</text>
  <text x="155" y="92" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="end">élevé</text>
  <text x="155" y="318" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="end">faible</text>
  <text x="170" y="335" font-family="monospace" font-size="9" fill="#7e8da4">faible</text>
  <text x="635" y="335" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="end">élevé</text>
  <text x="640" y="318" font-family="monospace" font-size="10" fill="#cbd5e1" text-anchor="end" font-weight="bold">Effort</text>
  <!-- Grille en croix -->
  <line x1="400" y1="70" x2="400" y2="320" stroke="#1e2a5e" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="160" y1="195" x2="640" y2="195" stroke="#1e2a5e" stroke-width="1" stroke-dasharray="3,3"/>
  <!-- Quadrant Q1 : Quick wins (haut-gauche) -->
  <rect x="165" y="75" width="230" height="115" rx="6" fill="#0a1f18" opacity="0.7"/>
  <text x="280" y="100" font-family="monospace" font-size="11" fill="#86efac" text-anchor="middle" font-weight="bold">QUICK WINS</text>
  <text x="280" y="115" font-family="monospace" font-size="8" fill="#a7f3d0" text-anchor="middle">commencer ICI</text>
  <text x="280" y="140" font-family="sans-serif" font-size="9" fill="#a7f3d0" text-anchor="middle">• supprimer un contrôle</text>
  <text x="280" y="153" font-family="sans-serif" font-size="9" fill="#a7f3d0" text-anchor="middle">  redondant identifié</text>
  <text x="280" y="167" font-family="sans-serif" font-size="9" fill="#a7f3d0" text-anchor="middle">• documenter une étape</text>
  <text x="280" y="180" font-family="sans-serif" font-size="9" fill="#a7f3d0" text-anchor="middle">  qui repose sur 1 personne</text>
  <!-- Quadrant Q2 : Projets stratégiques (haut-droit) -->
  <rect x="405" y="75" width="230" height="115" rx="6" fill="#1e1b4b" opacity="0.7"/>
  <text x="520" y="100" font-family="monospace" font-size="11" fill="#b48bff" text-anchor="middle" font-weight="bold">PROJETS STRATÉGIQUES</text>
  <text x="520" y="115" font-family="monospace" font-size="8" fill="#c4b5fd" text-anchor="middle">planifier — découper</text>
  <text x="520" y="140" font-family="sans-serif" font-size="9" fill="#c4b5fd" text-anchor="middle">• refonte du goulot</text>
  <text x="520" y="153" font-family="sans-serif" font-size="9" fill="#c4b5fd" text-anchor="middle">  N+1 (validation 4 j)</text>
  <text x="520" y="167" font-family="sans-serif" font-size="9" fill="#c4b5fd" text-anchor="middle">• outillage central qui</text>
  <text x="520" y="180" font-family="sans-serif" font-size="9" fill="#c4b5fd" text-anchor="middle">  remplace les canaux off</text>
  <!-- Quadrant Q3 : À faire ensuite (bas-gauche) -->
  <rect x="165" y="200" width="230" height="115" rx="6" fill="#1f1700" opacity="0.7"/>
  <text x="280" y="225" font-family="monospace" font-size="11" fill="#fbbf24" text-anchor="middle" font-weight="bold">À FAIRE ENSUITE</text>
  <text x="280" y="240" font-family="monospace" font-size="8" fill="#fde68a" text-anchor="middle">mais sans urgence</text>
  <text x="280" y="265" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">• harmoniser un nommage</text>
  <text x="280" y="278" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">• mettre à jour un modèle</text>
  <text x="280" y="291" font-family="sans-serif" font-size="9" fill="#fde68a" text-anchor="middle">  de compte-rendu</text>
  <!-- Quadrant Q4 : Piège (bas-droit) -->
  <rect x="405" y="200" width="230" height="115" rx="6" fill="#2d1515" opacity="0.7"/>
  <text x="520" y="225" font-family="monospace" font-size="11" fill="#fb7185" text-anchor="middle" font-weight="bold">PIÈGE — À ÉVITER</text>
  <text x="520" y="240" font-family="monospace" font-size="8" fill="#fca5a5" text-anchor="middle">gros effort, faible impact</text>
  <text x="520" y="265" font-family="sans-serif" font-size="9" fill="#fca5a5" text-anchor="middle">• manuel qualité de 200 p.</text>
  <text x="520" y="278" font-family="sans-serif" font-size="9" fill="#fca5a5" text-anchor="middle">• outil sophistiqué sur</text>
  <text x="520" y="291" font-family="sans-serif" font-size="9" fill="#fca5a5" text-anchor="middle">  un processus mal compris</text>
  <text x="350" y="352" font-family="monospace" font-size="10" fill="#00cffd" text-anchor="middle" font-weight="bold">d'abord les quick wins → créer la dynamique → traiter le goulot</text>
</svg>
</div>

> **Ce que j'applique** — Avant d'améliorer un processus, il faut le cartographier tel qu'il fonctionne réellement — pas tel qu'il est censé fonctionner. Les cinq défaillances les plus fréquentes dans les PME sont : la validation en entonnoir, l'absence de documentation, les contrôles redondants, les critères de sortie flous, et les outils parallèles qui court-circuitent le flux officiel. On priorise l'amélioration sur le point qui génère le plus de délai ou d'erreurs, on identifie la cause réelle, et on traite la cause — pas le symptôme.
