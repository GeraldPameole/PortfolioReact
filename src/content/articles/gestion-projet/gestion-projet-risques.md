---
title: "Gestion des risques projet : anticiper pour ne pas subir"
description: "Comment construire une gestion des risques qui fonctionne sur le terrain — pas dans les slides de lancement — à partir de projets d'infrastructure réels."
publishDate: "2025-09-01"
type: article
domain: gestion-projet
image: "/images/themes/management.jpg"
pillColor: blue
theme: gestion
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

## La revue de risques : rythme et format

L'erreur que j'observe régulièrement : faire une session de gestion des risques au démarrage du projet, alimenter un registre, et ne plus jamais y revenir formellement. Les risques évoluent. Certains se concrétisent partiellement, d'autres disparaissent, de nouveaux apparaissent.

Sur mes projets, je cale une revue de risques en début de chaque sprint ou toutes les deux semaines minimum. Elle dure 15-20 minutes. Le registre n'a pas besoin d'être long — 10 à 15 risques actifs, c'est déjà suffisant pour être gérable. Au-delà, c'est souvent du remplissage qui dilue l'attention sur les vrais enjeux.

Le registre que j'utilise a sept colonnes : description du risque, probabilité (H/M/F), impact (H/M/F), score (produit des deux), plan de réponse, responsable, statut. Simple, lisible, mis à jour à chaque revue.

## Construire la culture de prévention

La difficulté avec la gestion des risques n'est pas technique — les outils sont simples. Elle est culturelle. Nommer un risque, c'est admettre que quelque chose peut mal tourner, et dans certaines équipes ça ressemble à du pessimisme ou à une remise en cause du travail effectué.

La façon dont j'ai appris à contourner ça : cadrer la gestion des risques non pas comme "ce qui peut mal tourner" mais comme "ce dont on a besoin de parler avant que ça arrive". Ce n'est pas de la prudence négative — c'est ce qui permet au projet de rester sous contrôle quand l'imprévu survient. Et l'imprévu survient toujours.

L'équipe qui a l'habitude de nommer les risques tôt développe un réflexe précieux : au lieu de cacher un problème émergent par crainte de la réaction du chef de projet, elle le remonte immédiatement. C'est là que la gestion des risques produit son vrai retour sur investissement.
