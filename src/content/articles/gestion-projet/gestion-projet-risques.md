---
title: "Gestion des risques projet : anticiper pour ne pas subir"
description: "Comment construire une gestion des risques qui fonctionne sur le terrain — pas dans les slides de lancement — à partir de projets d'infrastructure réels."
publishDate: "2025-09-01"
type: article
domain: gestion-projet
image: "/images/themes/management.webp"
pillColor: blue
theme: gestion
tags:
  - gestion-projet
  - risques
  - anticipation
  - methodologie
---

La gestion des risques est l'une des disciplines où l'écart entre la théorie et la pratique est le plus brutal. En théorie : registre des risques, matrice probabilité/impact, plans de réponse documentés. En pratique, sur un chantier de déploiement réseau ou une migration d'infrastructure : un technicien bloqué sur site parce qu'une autorisation d'accès a été oubliée, un équipement qui arrive avec trois semaines de retard sans qu'aucun plan B n't ait été préparé.

Chez KEOS TELECOM, j'ai appris à distinguer la gestion des risques qui rassure (registres complets, cases cochées) de celle qui protège réellement le projet. La différence se joue sur un point précis : est-ce que les risques identifiés sont ceux qui peuvent vraiment tuer le projet, ou ceux qu'on a listés parce qu'ils sont faciles à nommer ?

## Identifier les vrais risques, pas les risques confortables

Le biais classique dans un atelier de risques : on liste ce qu'on connaît déjà, ce qui s'est passé sur le dernier projet, ce qui est mesurable. Les risques invisibles — dépendance sur un seul expert disponible, ambiguïté dans le contrat avec un sous-traitant, validations réglementaires dont les délais sont sous-estimés — ne remontent pas naturellement.

Ma méthode pour les faire émerger : interroger les gens qui vont exécuter, pas seulement ceux qui planifient. Le technicien terrain sait que l'accès à tel type de site prend systématiquement deux semaines de plus que prévu. Le fournisseur a mentionné en passant une contrainte sur ses stocks. Ce sont ces signaux faibles qui alimentent les vrais risques.

Autre angle souvent négligé : les dépendances externes. En infrastructure télécom, un projet peut être parfaitement géré en interne et quand même dérailler parce qu'un opérateur tiers a changé ses procédures d'accès ou parce qu'une collectivité n'a pas rendu son autorisation dans les temps. Ces risques ne sont pas sous contrôle direct, mais ils doivent être anticipés et avoir un plan de réponse.

## La matrice risque comme outil de décision, pas de reporting

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" style="max-width:100%;height:auto">
  <rect width="500" height="400" fill="#0a0f2e" rx="12"/>
  <!-- Grid cells 3x3 -->
  <!-- Row 1 (high probability) -->
  <rect x="100" y="50" width="110" height="90" fill="#fbbf24" fill-opacity="0.25" rx="3"/>
  <rect x="215" y="50" width="110" height="90" fill="#f97316" fill-opacity="0.30" rx="3"/>
  <rect x="330" y="50" width="110" height="90" fill="#ef4444" fill-opacity="0.30" rx="3"/>
  <!-- Row 2 (medium probability) -->
  <rect x="100" y="145" width="110" height="90" fill="#86efac" fill-opacity="0.20" rx="3"/>
  <rect x="215" y="145" width="110" height="90" fill="#fbbf24" fill-opacity="0.25" rx="3"/>
  <rect x="330" y="145" width="110" height="90" fill="#f97316" fill-opacity="0.30" rx="3"/>
  <!-- Row 3 (low probability) -->
  <rect x="100" y="240" width="110" height="90" fill="#86efac" fill-opacity="0.20" rx="3"/>
  <rect x="215" y="240" width="110" height="90" fill="#86efac" fill-opacity="0.20" rx="3"/>
  <rect x="330" y="240" width="110" height="90" fill="#fbbf24" fill-opacity="0.25" rx="3"/>
  <!-- Cell labels -->
  <text x="155" y="96" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="bold" font-family="sans-serif">SURVEILLER</text>
  <text x="270" y="96" text-anchor="middle" fill="#f97316" font-size="10" font-weight="bold" font-family="sans-serif">MITIGER</text>
  <text x="385" y="96" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold" font-family="sans-serif">CRITIQUE</text>
  <text x="155" y="191" text-anchor="middle" fill="#86efac" font-size="10" font-weight="bold" font-family="sans-serif">ACCEPTABLE</text>
  <text x="270" y="191" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="bold" font-family="sans-serif">SURVEILLER</text>
  <text x="385" y="191" text-anchor="middle" fill="#f97316" font-size="10" font-weight="bold" font-family="sans-serif">MITIGER</text>
  <text x="155" y="286" text-anchor="middle" fill="#86efac" font-size="10" font-weight="bold" font-family="sans-serif">ACCEPTABLE</text>
  <text x="270" y="286" text-anchor="middle" fill="#86efac" font-size="10" font-weight="bold" font-family="sans-serif">ACCEPTABLE</text>
  <text x="385" y="286" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="bold" font-family="sans-serif">SURVEILLER</text>
  <!-- Y Axis label -->
  <text x="50" y="200" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="sans-serif" transform="rotate(-90,50,200)">Probabilité</text>
  <text x="68" y="100" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Haute</text>
  <text x="68" y="195" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Moyenne</text>
  <text x="68" y="290" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Faible</text>
  <!-- X Axis label -->
  <text x="270" y="355" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="sans-serif">Impact</text>
  <text x="155" y="345" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Faible</text>
  <text x="270" y="345" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Modéré</text>
  <text x="385" y="345" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Élevé</text>
  <!-- Legend -->
  <rect x="100" y="375" width="10" height="10" fill="#86efac" fill-opacity="0.5" rx="2"/>
  <text x="115" y="384" fill="#86efac" font-size="9" font-family="sans-serif">Acceptable</text>
  <rect x="195" y="375" width="10" height="10" fill="#fbbf24" fill-opacity="0.5" rx="2"/>
  <text x="210" y="384" fill="#fbbf24" font-size="9" font-family="sans-serif">Surveiller</text>
  <rect x="285" y="375" width="10" height="10" fill="#f97316" fill-opacity="0.5" rx="2"/>
  <text x="300" y="384" fill="#f97316" font-size="9" font-family="sans-serif">Mitiger</text>
  <rect x="360" y="375" width="10" height="10" fill="#ef4444" fill-opacity="0.5" rx="2"/>
  <text x="375" y="384" fill="#ef4444" font-size="9" font-family="sans-serif">Critique</text>
</svg></div>

La matrice probabilité/impact n'est utile que si elle débouche sur des décisions concrètes. Chaque zone doit correspondre à une action, pas à une couleur dans un tableau PowerPoint.

**Zone rouge (critique)** : le risque doit avoir un plan de réponse actif avant que le projet ne démarre. Soit on l'évite (on change le périmètre ou l'approche), soit on le transfère (assurance, clause contractuelle avec le sous-traitant), soit on prépare un plan de continuité concret.

**Zone orange (mitiger)** : action de réduction de la probabilité ou de l'impact, avec un responsable identifié et une date. Pas "on va voir" — un livrable précis.

**Zone jaune (surveiller)** : point en revue de sprint ou réunion de suivi, indicateur de déclenchement défini à l'avance.

**Zone verte (acceptable)** : on l'a listé, on n'y consacre pas de temps de gestion actif.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e" rx="12"/>
  <text x="350" y="28" font-family="monospace" font-size="13" fill="#00cffd" text-anchor="middle" font-weight="bold">4 STRATÉGIES DE RÉPONSE AU RISQUE</text>
  <text x="350" y="46" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="middle">éviter · transférer · mitiger · accepter — chaque case = une décision concrète</text>
  <!-- Card 1 - Éviter -->
  <rect x="30" y="70" width="150" height="260" rx="10" fill="#1a1f4e" stroke="#86efac" stroke-width="1.5"/>
  <circle cx="105" cy="110" r="20" fill="#0a0f2e" stroke="#86efac" stroke-width="1.5"/>
  <path d="M 95 110 L 102 117 L 115 103" stroke="#86efac" stroke-width="2" fill="none"/>
  <text x="105" y="156" font-family="monospace" font-size="12" fill="#86efac" text-anchor="middle" font-weight="bold">ÉVITER</text>
  <line x1="50" y1="166" x2="160" y2="166" stroke="#86efac" stroke-width="1" opacity="0.4"/>
  <text x="105" y="186" font-family="sans-serif" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">Supprimer la cause</text>
  <text x="105" y="212" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Changer le périmètre,</text>
  <text x="105" y="226" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">l'approche ou la</text>
  <text x="105" y="240" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">techno pour que le</text>
  <text x="105" y="254" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">risque disparaisse</text>
  <text x="105" y="288" font-family="monospace" font-size="8" fill="#a7f3d0" text-anchor="middle">Exemple terrain</text>
  <text x="105" y="304" font-family="sans-serif" font-size="8" fill="#fdba74" text-anchor="middle">Site mal sécurisé →</text>
  <text x="105" y="316" font-family="sans-serif" font-size="8" fill="#fdba74" text-anchor="middle">on déplace le shelter</text>
  <!-- Card 2 - Transférer -->
  <rect x="195" y="70" width="150" height="260" rx="10" fill="#1a1f4e" stroke="#00cffd" stroke-width="1.5"/>
  <circle cx="270" cy="110" r="20" fill="#0a0f2e" stroke="#00cffd" stroke-width="1.5"/>
  <path d="M 260 110 L 280 110 M 274 104 L 280 110 L 274 116" stroke="#00cffd" stroke-width="2" fill="none"/>
  <text x="270" y="156" font-family="monospace" font-size="12" fill="#00cffd" text-anchor="middle" font-weight="bold">TRANSFÉRER</text>
  <line x1="215" y1="166" x2="325" y2="166" stroke="#00cffd" stroke-width="1" opacity="0.4"/>
  <text x="270" y="186" font-family="sans-serif" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">Déplacer la charge</text>
  <text x="270" y="212" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Assurance, pénalités</text>
  <text x="270" y="226" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">contractuelles,</text>
  <text x="270" y="240" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">sous-traitance avec</text>
  <text x="270" y="254" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">SLA clair</text>
  <text x="270" y="288" font-family="monospace" font-size="8" fill="#67e8f9" text-anchor="middle">Exemple terrain</text>
  <text x="270" y="304" font-family="sans-serif" font-size="8" fill="#fdba74" text-anchor="middle">Retard fournisseur →</text>
  <text x="270" y="316" font-family="sans-serif" font-size="8" fill="#fdba74" text-anchor="middle">clause pénalité/jour</text>
  <!-- Card 3 - Mitiger -->
  <rect x="360" y="70" width="150" height="260" rx="10" fill="#1a1f4e" stroke="#fbbf24" stroke-width="1.5"/>
  <circle cx="435" cy="110" r="20" fill="#0a0f2e" stroke="#fbbf24" stroke-width="1.5"/>
  <path d="M 425 116 L 432 109 L 438 113 L 445 104" stroke="#fbbf24" stroke-width="2" fill="none"/>
  <text x="435" y="156" font-family="monospace" font-size="12" fill="#fbbf24" text-anchor="middle" font-weight="bold">MITIGER</text>
  <line x1="380" y1="166" x2="490" y2="166" stroke="#fbbf24" stroke-width="1" opacity="0.4"/>
  <text x="435" y="186" font-family="sans-serif" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">Réduire P ou I</text>
  <text x="435" y="212" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Plan B activable,</text>
  <text x="435" y="226" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">redondance, stocks</text>
  <text x="435" y="240" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">tampons, formation</text>
  <text x="435" y="254" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">croisée des équipes</text>
  <text x="435" y="288" font-family="monospace" font-size="8" fill="#fbbf24" text-anchor="middle">Exemple terrain</text>
  <text x="435" y="304" font-family="sans-serif" font-size="8" fill="#fdba74" text-anchor="middle">Expert unique →</text>
  <text x="435" y="316" font-family="sans-serif" font-size="8" fill="#fdba74" text-anchor="middle">binôme formé sur 3 mois</text>
  <!-- Card 4 - Accepter -->
  <rect x="525" y="70" width="150" height="260" rx="10" fill="#1a1f4e" stroke="#94a3b8" stroke-width="1.5"/>
  <circle cx="600" cy="110" r="20" fill="#0a0f2e" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="600" y="116" font-family="monospace" font-size="14" fill="#94a3b8" text-anchor="middle" font-weight="bold">∅</text>
  <text x="600" y="156" font-family="monospace" font-size="12" fill="#94a3b8" text-anchor="middle" font-weight="bold">ACCEPTER</text>
  <line x1="545" y1="166" x2="655" y2="166" stroke="#94a3b8" stroke-width="1" opacity="0.4"/>
  <text x="600" y="186" font-family="sans-serif" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">Documenter, vivre avec</text>
  <text x="600" y="212" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Coût de traitement</text>
  <text x="600" y="226" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">supérieur à l'impact</text>
  <text x="600" y="240" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">probable — surveillé</text>
  <text x="600" y="254" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">en revue de sprint</text>
  <text x="600" y="288" font-family="monospace" font-size="8" fill="#cbd5e1" text-anchor="middle">Exemple terrain</text>
  <text x="600" y="304" font-family="sans-serif" font-size="8" fill="#fdba74" text-anchor="middle">Bug cosmétique →</text>
  <text x="600" y="316" font-family="sans-serif" font-size="8" fill="#fdba74" text-anchor="middle">backlog, pas de plan B</text>
</svg></div>

## La revue de risques : rythme et format

L'erreur que j'observe régulièrement : faire une session de gestion des risques au démarrage du projet, alimenter un registre, et ne plus jamais y revenir formellement. Les risques évoluent. Certains se concrétisent partiellement, d'autres disparaissent, de nouveaux apparaissent.

Sur mes projets, je cale une revue de risques en début de chaque sprint ou toutes les deux semaines minimum. Elle dure 15-20 minutes. Le registre n'a pas besoin d'être long — 10 à 15 risques actifs, c'est déjà suffisant pour être gérable. Au-delà, c'est souvent du remplissage qui dilue l'attention sur les vrais enjeux.

Le registre que j'utilise a sept colonnes : description du risque, probabilité (H/M/F), impact (H/M/F), score (produit des deux), plan de réponse, responsable, statut. Simple, lisible, mis à jour à chaque revue.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 320" style="max-width:100%;height:auto">
  <rect width="700" height="320" fill="#0a0f2e" rx="12"/>
  <text x="350" y="28" font-family="monospace" font-size="13" fill="#00cffd" text-anchor="middle" font-weight="bold">REGISTRE DE RISQUES — 7 COLONNES UTILES</text>
  <text x="350" y="46" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="middle">simple, lisible, mis à jour à chaque revue de sprint</text>
  <!-- Header row -->
  <rect x="20" y="70" width="660" height="32" rx="4" fill="#915EFF"/>
  <text x="60" y="91" font-family="monospace" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">Risque</text>
  <text x="180" y="91" font-family="monospace" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">P</text>
  <text x="225" y="91" font-family="monospace" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">I</text>
  <text x="275" y="91" font-family="monospace" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">Score</text>
  <text x="410" y="91" font-family="monospace" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">Plan de réponse</text>
  <text x="560" y="91" font-family="monospace" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">Resp.</text>
  <text x="640" y="91" font-family="monospace" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">Statut</text>
  <!-- Row 1 -->
  <rect x="20" y="106" width="660" height="42" fill="#1a1f4e"/>
  <rect x="20" y="106" width="660" height="42" fill="#fb7185" opacity="0.08"/>
  <text x="30" y="124" font-family="sans-serif" font-size="9" fill="#cbd5e1">Retard autorisation</text>
  <text x="30" y="138" font-family="sans-serif" font-size="9" fill="#cbd5e1">accès site collectivité</text>
  <text x="180" y="131" font-family="monospace" font-size="11" fill="#fb7185" text-anchor="middle" font-weight="bold">H</text>
  <text x="225" y="131" font-family="monospace" font-size="11" fill="#fb7185" text-anchor="middle" font-weight="bold">H</text>
  <rect x="252" y="118" width="46" height="20" rx="4" fill="#fb7185"/>
  <text x="275" y="132" font-family="monospace" font-size="10" fill="#0a0f2e" text-anchor="middle" font-weight="bold">9</text>
  <text x="310" y="124" font-family="sans-serif" font-size="9" fill="#cbd5e1">Pré-dossier déposé J-60,</text>
  <text x="310" y="138" font-family="sans-serif" font-size="9" fill="#cbd5e1">site secondaire identifié</text>
  <text x="560" y="131" font-family="monospace" font-size="9" fill="#67e8f9" text-anchor="middle">PM</text>
  <rect x="612" y="118" width="56" height="20" rx="4" fill="#fbbf24"/>
  <text x="640" y="132" font-family="monospace" font-size="9" fill="#0a0f2e" text-anchor="middle" font-weight="bold">ACTIF</text>
  <!-- Row 2 -->
  <rect x="20" y="152" width="660" height="42" fill="#1a1f4e"/>
  <rect x="20" y="152" width="660" height="42" fill="#fbbf24" opacity="0.06"/>
  <text x="30" y="170" font-family="sans-serif" font-size="9" fill="#cbd5e1">Rupture stock antennes</text>
  <text x="30" y="184" font-family="sans-serif" font-size="9" fill="#cbd5e1">chez fournisseur unique</text>
  <text x="180" y="177" font-family="monospace" font-size="11" fill="#fbbf24" text-anchor="middle" font-weight="bold">M</text>
  <text x="225" y="177" font-family="monospace" font-size="11" fill="#fb7185" text-anchor="middle" font-weight="bold">H</text>
  <rect x="252" y="164" width="46" height="20" rx="4" fill="#fb923c"/>
  <text x="275" y="178" font-family="monospace" font-size="10" fill="#0a0f2e" text-anchor="middle" font-weight="bold">6</text>
  <text x="310" y="170" font-family="sans-serif" font-size="9" fill="#cbd5e1">Sourcing fournisseur</text>
  <text x="310" y="184" font-family="sans-serif" font-size="9" fill="#cbd5e1">alt., stock tampon 10%</text>
  <text x="560" y="177" font-family="monospace" font-size="9" fill="#67e8f9" text-anchor="middle">Achats</text>
  <rect x="612" y="164" width="56" height="20" rx="4" fill="#fbbf24"/>
  <text x="640" y="178" font-family="monospace" font-size="9" fill="#0a0f2e" text-anchor="middle" font-weight="bold">ACTIF</text>
  <!-- Row 3 -->
  <rect x="20" y="198" width="660" height="42" fill="#1a1f4e"/>
  <rect x="20" y="198" width="660" height="42" fill="#86efac" opacity="0.05"/>
  <text x="30" y="216" font-family="sans-serif" font-size="9" fill="#cbd5e1">Indisponibilité expert</text>
  <text x="30" y="230" font-family="sans-serif" font-size="9" fill="#cbd5e1">configuration cœur réseau</text>
  <text x="180" y="223" font-family="monospace" font-size="11" fill="#fbbf24" text-anchor="middle" font-weight="bold">M</text>
  <text x="225" y="223" font-family="monospace" font-size="11" fill="#fbbf24" text-anchor="middle" font-weight="bold">M</text>
  <rect x="252" y="210" width="46" height="20" rx="4" fill="#fbbf24"/>
  <text x="275" y="224" font-family="monospace" font-size="10" fill="#0a0f2e" text-anchor="middle" font-weight="bold">4</text>
  <text x="310" y="216" font-family="sans-serif" font-size="9" fill="#cbd5e1">Binôme formé en interne,</text>
  <text x="310" y="230" font-family="sans-serif" font-size="9" fill="#cbd5e1">docs procédures à jour</text>
  <text x="560" y="223" font-family="monospace" font-size="9" fill="#67e8f9" text-anchor="middle">Tech lead</text>
  <rect x="612" y="210" width="56" height="20" rx="4" fill="#86efac"/>
  <text x="640" y="224" font-family="monospace" font-size="9" fill="#0a0f2e" text-anchor="middle" font-weight="bold">TRAITÉ</text>
  <!-- Row 4 -->
  <rect x="20" y="244" width="660" height="42" fill="#1a1f4e"/>
  <text x="30" y="262" font-family="sans-serif" font-size="9" fill="#cbd5e1">Demandes changements</text>
  <text x="30" y="276" font-family="sans-serif" font-size="9" fill="#cbd5e1">cosmétiques de dernière min.</text>
  <text x="180" y="269" font-family="monospace" font-size="11" fill="#86efac" text-anchor="middle" font-weight="bold">F</text>
  <text x="225" y="269" font-family="monospace" font-size="11" fill="#86efac" text-anchor="middle" font-weight="bold">F</text>
  <rect x="252" y="256" width="46" height="20" rx="4" fill="#86efac"/>
  <text x="275" y="270" font-family="monospace" font-size="10" fill="#0a0f2e" text-anchor="middle" font-weight="bold">1</text>
  <text x="310" y="262" font-family="sans-serif" font-size="9" fill="#cbd5e1">Accepté, traitement en</text>
  <text x="310" y="276" font-family="sans-serif" font-size="9" fill="#cbd5e1">phase 2 si nécessaire</text>
  <text x="560" y="269" font-family="monospace" font-size="9" fill="#67e8f9" text-anchor="middle">PO</text>
  <rect x="612" y="256" width="56" height="20" rx="4" fill="#94a3b8"/>
  <text x="640" y="270" font-family="monospace" font-size="9" fill="#0a0f2e" text-anchor="middle" font-weight="bold">VEILLE</text>
  <!-- Footer hint -->
  <text x="350" y="304" font-family="monospace" font-size="9" fill="#fb923c" text-anchor="middle">10 à 15 risques actifs max — au-delà, dilution et perte d'attention sur les vrais enjeux</text>
</svg></div>

## Construire la culture de prévention

La difficulté avec la gestion des risques n'est pas technique — les outils sont simples. Elle est culturelle. Nommer un risque, c'est admettre que quelque chose peut mal tourner, et dans certaines équipes ça ressemble à du pessimisme ou à une remise en cause du travail effectué.

La façon dont j'ai appris à contourner ça : cadrer la gestion des risques non pas comme "ce qui peut mal tourner" mais comme "ce dont on a besoin de parler avant que ça arrive". Ce n'est pas de la prudence négative — c'est ce qui permet au projet de rester sous contrôle quand l'imprévu survient. Et l'imprévu survient toujours.

L'équipe qui a l'habitude de nommer les risques tôt développe un réflexe précieux : au lieu de cacher un problème émergent par crainte de la réaction du chef de projet, elle le remonte immédiatement. C'est là que la gestion des risques produit son vrai retour sur investissement.
