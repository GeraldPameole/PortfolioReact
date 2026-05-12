---
title: "Formation technique en entreprise — monter en compétences sans être développeur"
description: "Comment comprendre ce que fait son équipe tech, quelles formations ont un vrai retour sur investissement, et comment ne pas rester bloqué par son propre niveau technique."
publishDate: "2025-06-23"
type: article
domain: formation
image: "/images/themes/formation-carriere.webp"
pillColor: red
theme: formation
---

Je ne suis pas développeur. Je suis chef de projet, et j'ai passé plusieurs années à coordonner des équipes techniques — des équipes qui codent, qui administrent des systèmes, qui déploient des infrastructures. La question que j'ai dû résoudre n'était pas "comment devenir technique" mais "comment collaborer efficacement avec des gens qui le sont". C'est une question très différente, et la réponse l'est tout autant.

La formation technique en entreprise échoue souvent parce qu'elle pose la mauvaise question. Ce n'est pas "comment enseigner la technique à des non-techniciens ?" mais "quel niveau de compréhension technique est nécessaire pour travailler ensemble efficacement ?"

## Le spectre de compétences techniques

Il n'y a pas deux niveaux de compétence technique — le technique et le non-technique. Il y a un spectre continu, avec des paliers de collaboration qui correspondent à des rôles réels.

À l'extrémité "utilisateur", on sait manipuler les outils sans comprendre ce qui se passe dessous. C'est suffisant pour produire avec ces outils. Mais pour piloter un projet qui implique ces outils, cela ne suffit pas — on ne peut pas évaluer les estimations de l'équipe ni comprendre pourquoi quelque chose prend deux semaines au lieu de deux jours.

Au niveau suivant, le "coordinateur technique" comprend les grandes catégories de travail, les dépendances entre composants, les risques courants. Il n'écrit pas de code mais peut lire un schéma d'architecture, comprendre ce qu'est une API, distinguer un bug front-end d'un bug back-end. Ce niveau est atteignable par n'importe qui en quelques mois d'exposition active.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="28" font-family="sans-serif" font-size="14" fill="#00cffd" text-anchor="middle" font-weight="bold">Spectre de compétences techniques</text>
  <!-- Axe horizontal -->
  <line x1="60" y1="180" x2="650" y2="180" stroke="#ffffff" stroke-width="2" opacity="0.3"/>
  <!-- Gradient bar -->
  <defs>
    <linearGradient id="techgrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#915EFF" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#00cffd" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#86efac" stop-opacity="0.6"/>
    </linearGradient>
  </defs>
  <rect x="60" y="170" width="590" height="20" rx="10" fill="url(#techgrad)"/>
  <!-- Niveau 1 -->
  <line x1="60" y1="155" x2="60" y2="200" stroke="#915EFF" stroke-width="2"/>
  <circle cx="60" cy="180" r="8" fill="#915EFF"/>
  <text x="60" y="140" font-family="sans-serif" font-size="10" fill="#915EFF" text-anchor="middle" font-weight="bold">Utilisateur</text>
  <text x="60" y="128" font-family="sans-serif" font-size="9" fill="#ffffff" opacity="0.5" text-anchor="middle">Utilise les outils</text>
  <text x="60" y="218" font-family="sans-serif" font-size="9" fill="#fbbf24" text-anchor="middle">Maîtrise</text>
  <text x="60" y="230" font-family="sans-serif" font-size="9" fill="#fbbf24" text-anchor="middle">du produit</text>
  <!-- Niveau 2 -->
  <line x1="178" y1="155" x2="178" y2="200" stroke="#915EFF" stroke-width="2"/>
  <circle cx="178" cy="180" r="8" fill="#915EFF"/>
  <text x="178" y="140" font-family="sans-serif" font-size="10" fill="#915EFF" text-anchor="middle" font-weight="bold">Coordinateur</text>
  <text x="178" y="128" font-family="sans-serif" font-size="9" fill="#ffffff" opacity="0.5" text-anchor="middle">Comprend les dépendances</text>
  <text x="178" y="218" font-family="sans-serif" font-size="9" fill="#fbbf24" text-anchor="middle">Schémas archi,</text>
  <text x="178" y="230" font-family="sans-serif" font-size="9" fill="#fbbf24" text-anchor="middle">API, risques</text>
  <!-- Niveau 3 -->
  <line x1="296" y1="155" x2="296" y2="200" stroke="#00cffd" stroke-width="2"/>
  <circle cx="296" cy="180" r="8" fill="#00cffd"/>
  <text x="296" y="140" font-family="sans-serif" font-size="10" fill="#00cffd" text-anchor="middle" font-weight="bold">Analyste</text>
  <text x="296" y="128" font-family="sans-serif" font-size="9" fill="#ffffff" opacity="0.5" text-anchor="middle">Spécifie et questionne</text>
  <text x="296" y="218" font-family="sans-serif" font-size="9" fill="#fbbf24" text-anchor="middle">Specs fonctionnelles,</text>
  <text x="296" y="230" font-family="sans-serif" font-size="9" fill="#fbbf24" text-anchor="middle">tests, données</text>
  <!-- Niveau 4 -->
  <line x1="414" y1="155" x2="414" y2="200" stroke="#00cffd" stroke-width="2"/>
  <circle cx="414" cy="180" r="8" fill="#00cffd"/>
  <text x="414" y="140" font-family="sans-serif" font-size="10" fill="#00cffd" text-anchor="middle" font-weight="bold">Développeur</text>
  <text x="414" y="128" font-family="sans-serif" font-size="9" fill="#ffffff" opacity="0.5" text-anchor="middle">Produit et conçoit</text>
  <text x="414" y="218" font-family="sans-serif" font-size="9" fill="#fbbf24" text-anchor="middle">Code, revue,</text>
  <text x="414" y="230" font-family="sans-serif" font-size="9" fill="#fbbf24" text-anchor="middle">déploiement</text>
  <!-- Niveau 5 -->
  <line x1="650" y1="155" x2="650" y2="200" stroke="#86efac" stroke-width="2"/>
  <circle cx="650" cy="180" r="8" fill="#86efac"/>
  <text x="650" y="140" font-family="sans-serif" font-size="10" fill="#86efac" text-anchor="middle" font-weight="bold">Architecte</text>
  <text x="650" y="128" font-family="sans-serif" font-size="9" fill="#ffffff" opacity="0.5" text-anchor="middle">Décide des systèmes</text>
  <text x="650" y="218" font-family="sans-serif" font-size="9" fill="#fbbf24" text-anchor="middle">Architecture,</text>
  <text x="650" y="230" font-family="sans-serif" font-size="9" fill="#fbbf24" text-anchor="middle">sécurité, scalabilité</text>
  <!-- Flèche direction -->
  <text x="350" y="270" font-family="sans-serif" font-size="11" fill="#ffffff" opacity="0.4" text-anchor="middle">← niveau de compréhension requis pour collaborer efficacement →</text>
  <!-- Zone cible non-tech -->
  <rect x="100" y="240" width="260" height="32" rx="6" fill="#915EFF" opacity="0.15" stroke="#915EFF" stroke-width="1"/>
  <text x="230" y="261" font-family="sans-serif" font-size="11" fill="#915EFF" text-anchor="middle">Zone cible pour chefs de projet non-tech</text>
</svg></div>

Ce que j'ai observé chez KEOS TELECOM : les malentendus les plus coûteux venaient de coordinateurs qui n'avaient pas atteint ce seuil. Ils ne savaient pas quoi demander à l'équipe, ne pouvaient pas évaluer si une estimation était raisonnable, et acceptaient les changements de périmètre sans en mesurer les conséquences techniques. Monter au niveau "coordinateur technique" a changé la qualité de nos échanges.

## Les formats de formation qui ont un vrai retour

La formation technique a un problème structurel : la distance entre l'apprentissage et l'application. On suit un cours de SQL un mardi, et on ne re-touche pas à une base de données pendant six mois. Ce qui reste, c'est presque rien.

Les formats qui fonctionnent partagent une propriété : l'application immédiate sur un contexte réel. Le pair programming — travailler côte à côte avec quelqu'un de plus technique sur un problème réel de l'organisation — est de loin le format le plus efficace que j'aie expérimenté. Pas de cours, pas de certification. Une heure par semaine à regarder comment quelqu'un résout un problème concret, en posant des questions.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="28" font-family="sans-serif" font-size="14" fill="#00cffd" text-anchor="middle" font-weight="bold">Comparatif formats de formation technique</text>
  <!-- En-têtes colonnes -->
  <text x="200" y="55" font-family="sans-serif" font-size="11" fill="#ffffff" opacity="0.6" text-anchor="middle">Coût</text>
  <text x="330" y="55" font-family="sans-serif" font-size="11" fill="#ffffff" opacity="0.6" text-anchor="middle">Retour réel</text>
  <text x="460" y="55" font-family="sans-serif" font-size="11" fill="#ffffff" opacity="0.6" text-anchor="middle">Autonomie</text>
  <text x="590" y="55" font-family="sans-serif" font-size="11" fill="#ffffff" opacity="0.6" text-anchor="middle">Transfert contexte</text>
  <!-- Ligne MOOC -->
  <rect x="30" y="62" width="640" height="52" rx="4" fill="#915EFF" opacity="0.08"/>
  <text x="100" y="93" font-family="sans-serif" font-size="12" fill="#915EFF" text-anchor="middle" font-weight="bold">MOOC</text>
  <text x="200" y="93" font-family="sans-serif" font-size="11" fill="#86efac" text-anchor="middle">Faible</text>
  <!-- ROI bar -->
  <rect x="278" y="77" width="60" height="14" rx="3" fill="#fbbf24" opacity="0.7"/>
  <text x="330" y="89" font-family="sans-serif" font-size="9" fill="#0a0f2e" text-anchor="middle" font-weight="bold">Moyen</text>
  <!-- Autonomie bar -->
  <rect x="408" y="77" width="100" height="14" rx="3" fill="#00cffd" opacity="0.7"/>
  <text x="460" y="89" font-family="sans-serif" font-size="9" fill="#0a0f2e" text-anchor="middle" font-weight="bold">Haute</text>
  <!-- Transfert bar -->
  <rect x="553" y="77" width="40" height="14" rx="3" fill="#915EFF" opacity="0.5"/>
  <text x="590" y="89" font-family="sans-serif" font-size="9" fill="#ffffff" text-anchor="middle">Faible</text>
  <!-- Ligne Formation interne -->
  <rect x="30" y="120" width="640" height="52" rx="4" fill="#00cffd" opacity="0.06"/>
  <text x="100" y="151" font-family="sans-serif" font-size="12" fill="#00cffd" text-anchor="middle" font-weight="bold">Formation interne</text>
  <text x="200" y="151" font-family="sans-serif" font-size="11" fill="#fbbf24" text-anchor="middle">Modéré</text>
  <rect x="278" y="135" width="90" height="14" rx="3" fill="#fbbf24" opacity="0.7"/>
  <text x="330" y="147" font-family="sans-serif" font-size="9" fill="#0a0f2e" text-anchor="middle" font-weight="bold">Bon</text>
  <rect x="408" y="135" width="70" height="14" rx="3" fill="#00cffd" opacity="0.6"/>
  <text x="460" y="147" font-family="sans-serif" font-size="9" fill="#0a0f2e" text-anchor="middle" font-weight="bold">Moyenne</text>
  <rect x="535" y="135" width="110" height="14" rx="3" fill="#86efac" opacity="0.8"/>
  <text x="590" y="147" font-family="sans-serif" font-size="9" fill="#0a0f2e" text-anchor="middle" font-weight="bold">Fort</text>
  <!-- Ligne Bootcamp -->
  <rect x="30" y="178" width="640" height="52" rx="4" fill="#86efac" opacity="0.05"/>
  <text x="100" y="209" font-family="sans-serif" font-size="12" fill="#86efac" text-anchor="middle" font-weight="bold">Bootcamp</text>
  <text x="200" y="209" font-family="sans-serif" font-size="11" fill="#915EFF" text-anchor="middle">Élevé</text>
  <rect x="278" y="193" width="110" height="14" rx="3" fill="#fbbf24" opacity="0.9"/>
  <text x="330" y="205" font-family="sans-serif" font-size="9" fill="#0a0f2e" text-anchor="middle" font-weight="bold">Élevé (si appliqué)</text>
  <rect x="408" y="193" width="50" height="14" rx="3" fill="#00cffd" opacity="0.4"/>
  <text x="460" y="205" font-family="sans-serif" font-size="9" fill="#ffffff" text-anchor="middle">Faible</text>
  <rect x="555" y="193" width="70" height="14" rx="3" fill="#86efac" opacity="0.6"/>
  <text x="590" y="205" font-family="sans-serif" font-size="9" fill="#0a0f2e" text-anchor="middle" font-weight="bold">Moyen</text>
  <!-- Ligne Pair programming -->
  <rect x="30" y="236" width="640" height="52" rx="4" fill="#fbbf24" opacity="0.07" stroke="#fbbf24" stroke-width="1"/>
  <text x="100" y="267" font-family="sans-serif" font-size="12" fill="#fbbf24" text-anchor="middle" font-weight="bold">Pair programming</text>
  <text x="200" y="267" font-family="sans-serif" font-size="11" fill="#86efac" text-anchor="middle">Très faible</text>
  <rect x="278" y="251" width="130" height="14" rx="3" fill="#fbbf24" opacity="1"/>
  <text x="330" y="263" font-family="sans-serif" font-size="9" fill="#0a0f2e" text-anchor="middle" font-weight="bold">Très élevé</text>
  <rect x="408" y="251" width="80" height="14" rx="3" fill="#00cffd" opacity="0.7"/>
  <text x="460" y="263" font-family="sans-serif" font-size="9" fill="#0a0f2e" text-anchor="middle" font-weight="bold">Haute</text>
  <rect x="520" y="251" width="140" height="14" rx="3" fill="#86efac" opacity="1"/>
  <text x="590" y="263" font-family="sans-serif" font-size="9" fill="#0a0f2e" text-anchor="middle" font-weight="bold">Maximal</text>
  <!-- Note -->
  <text x="350" y="312" font-family="sans-serif" font-size="10" fill="#fbbf24" text-anchor="middle">Recommandation : pair programming + formation interne pour les profils non-tech</text>
  <text x="350" y="328" font-family="sans-serif" font-size="10" fill="#ffffff" opacity="0.4" text-anchor="middle">Les MOOC seuls ont un taux d'application très bas sans suivi structuré</text>
</svg></div>

Les certifications ont une valeur différente selon qu'elles sont un objectif ou un outil. Utilisées comme signal externe (pour un recrutement, une validation de niveau), elles ont du sens. Utilisées comme objectif de formation interne, elles mènent souvent à apprendre pour l'examen — pas pour le travail.

## Ce qu'on peut raisonnablement apprendre

Un chef de projet qui travaille avec une équipe technique peut raisonnablement viser, en six mois d'apprentissage actif, à comprendre l'architecture de son système, à lire (pas écrire) des requêtes de base de données, à distinguer les types de risques techniques, et à poser les bonnes questions sur les estimations.

Ça ne fait pas de lui un développeur. Ça en fait un meilleur coordinateur. La distinction est essentielle — et souvent absente des plans de formation qui veulent soit tout enseigner, soit ne rien enseigner à ceux qui ne sont "pas techniques".

Ce que j'ai mis en place chez KEOS : un format mensuel de deux heures avec un développeur de l'équipe — pas pour lui apprendre à coder, mais pour qu'il explique ce sur quoi il travaille et pourquoi certaines choses prennent du temps. En six mois, les réunions de cadrage projet ont changé de nature. Les questions posées étaient meilleures, les estimations moins contestées à l'aveugle, les risques mieux identifiés en amont.

> **Ce que ça change en pratique** — La formation technique pour les non-développeurs n'a pas pour but de former des développeurs : elle vise le niveau "coordinateur technique", suffisant pour piloter efficacement et poser les bonnes questions. Le pair programming et les sessions de transmission interne ont un retour bien supérieur aux MOOC seuls. Six mois d'exposition active et structurée valent davantage que deux semaines de bootcamp sans suivi.
