---
title: "Performance projet : les indicateurs qui comptent vraiment"
description: "Comment piloter un projet avec des KPIs utiles — lead time, taux de défauts, livraison dans les délais — sans se noyer dans les métriques inutiles."
publishDate: "2025-08-25"
type: article
domain: gestion-projet
image: "/images/themes/management.webp"
pillColor: blue
relatedArticles:
  - domain: gestion-projet
  - pillColor: blue
  - theme: gestion
  - keywords:
theme: gestion
tags:
  - gestion-projet
  - agile
  - methodologie
  - performance

---

## Ce qu'on mesure vraiment — et ce qu'on devrait mesurer

Chez KEOS TELECOM, j'ai pris en main des projets qui avaient l'air de bien se passer sur le papier. Les réunions hebdomadaires étaient tenues, les tableaux de bord remplis, les statuts au vert. Puis on arrivait à la date de livraison et c'était le chaos. Le problème ne venait pas du manque de données : il venait du fait qu'on mesurait les mauvaises choses.

Il y a une catégorie d'indicateurs qu'on pourrait appeler les métriques de réconfort. Le nombre de tâches créées dans l'outil, le taux de participation aux réunions, le nombre de sprints complétés. Ces chiffres font bonne figure dans un comité de pilotage. Ils ne disent rien sur la santé réelle du projet.

Les indicateurs utiles sont plus inconfortables parce qu'ils montrent la réalité sans filtre. Quatre d'entre eux me semblent indispensables pour tout projet de taille moyenne : la livraison dans les délais, le taux de défauts, le lead time et la vélocité ajustée. Ce ne sont pas des concepts abstraits — ce sont des chiffres qu'on peut calculer toutes les deux semaines et qui forcent des conversations honnêtes.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" style="max-width:100%;height:auto">
  <rect width="600" height="340" fill="#0a0f2e" rx="12"/>
  <!-- Title -->
  <text x="300" y="32" font-family="sans-serif" font-size="14" font-weight="bold" fill="#c8c8d0" text-anchor="middle">Tableau de bord KPI — Projet</text>
  <!-- Row 1: Livraison dans les délais -->
  <text x="24" y="76" font-family="sans-serif" font-size="12" fill="#94a3b8">Livraison dans les délais</text>
  <rect x="24" y="84" width="552" height="20" rx="4" fill="#1e2a4a"/>
  <rect x="24" y="84" width="386" height="20" rx="4" fill="#86efac"/>
  <text x="418" y="99" font-family="sans-serif" font-size="11" fill="#86efac" font-weight="bold">70 %</text>
  <!-- Row 2: Taux de défauts -->
  <text x="24" y="136" font-family="sans-serif" font-size="12" fill="#94a3b8">Taux de défauts</text>
  <rect x="24" y="144" width="552" height="20" rx="4" fill="#1e2a4a"/>
  <rect x="24" y="144" width="110" height="20" rx="4" fill="#915EFF"/>
  <text x="142" y="159" font-family="sans-serif" font-size="11" fill="#915EFF" font-weight="bold">20 %</text>
  <!-- Row 3: Lead Time -->
  <text x="24" y="196" font-family="sans-serif" font-size="12" fill="#94a3b8">Lead Time moyen</text>
  <rect x="24" y="204" width="552" height="20" rx="4" fill="#1e2a4a"/>
  <rect x="24" y="204" width="220" height="20" rx="4" fill="#00cffd"/>
  <text x="252" y="219" font-family="sans-serif" font-size="11" fill="#00cffd" font-weight="bold">4 j (cible : 3 j)</text>
  <!-- Row 4: Vélocité -->
  <text x="24" y="256" font-family="sans-serif" font-size="12" fill="#94a3b8">Vélocité (stabilité sprint)</text>
  <rect x="24" y="264" width="552" height="20" rx="4" fill="#1e2a4a"/>
  <rect x="24" y="264" width="442" height="20" rx="4" fill="#fbbf24"/>
  <text x="474" y="279" font-family="sans-serif" font-size="11" fill="#fbbf24" font-weight="bold">80 %</text>
  <!-- Legend -->
  <rect x="24" y="308" width="12" height="12" fill="#86efac" rx="2"/>
  <text x="42" y="319" font-family="sans-serif" font-size="10" fill="#94a3b8">Bon</text>
  <rect x="90" y="308" width="12" height="12" fill="#00cffd" rx="2"/>
  <text x="108" y="319" font-family="sans-serif" font-size="10" fill="#94a3b8">En cours</text>
  <rect x="174" y="308" width="12" height="12" fill="#fbbf24" rx="2"/>
  <text x="192" y="319" font-family="sans-serif" font-size="10" fill="#94a3b8">À surveiller</text>
  <rect x="274" y="308" width="12" height="12" fill="#915EFF" rx="2"/>
  <text x="292" y="319" font-family="sans-serif" font-size="10" fill="#94a3b8">Critique</text>
</svg></div>

## Les quatre indicateurs que je suis vraiment

**La livraison dans les délais** est le premier signal d'alarme. Je ne parle pas du respect du planning initial — celui-là est souvent faux dès le départ. Je parle des engagements pris en début de sprint ou de phase, tenus ou non à la date promise. Si ce taux tombe sous 60 %, il faut comprendre pourquoi avant d'ajouter des ressources.

**Le taux de défauts** mesure ce qui remonte après livraison. En gestion de projet télécom, un bug découvert en production coûte en moyenne dix fois plus cher qu'un bug détecté pendant les tests. Ce rapport est approximatif mais l'ordre de grandeur est fiable — et il justifie à lui seul d'investir dans des phases de recette sérieuses. J'ai vu des projets saborder leur planning parce que personne ne voulait regarder ce chiffre en face.

**Le lead time** — le temps entre le moment où une demande entre dans le système et celui où elle est livrée — révèle la fluidité réelle du travail. Un lead time qui s'allonge d'une semaine à l'autre, c'est souvent le signe d'une accumulation silencieuse : trop de tâches en cours simultanément, une dépendance externe non résolue, ou une décision qui traîne.

**La vélocité ajustée** n'est pas le nombre de points livrés — c'est la stabilité de ce nombre. Une équipe qui livre 40 points un sprint, 15 le suivant, puis 60 n'est pas performante : elle est imprévisible. L'objectif n'est pas d'accélérer la vélocité brute mais de la rendre prévisible, ce qui rend le planning honnête.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 320" style="max-width:100%;height:auto">
  <rect width="620" height="320" fill="#0a0f2e" rx="12"/>
  <text x="310" y="28" font-family="sans-serif" font-size="13" font-weight="bold" fill="#c8c8d0" text-anchor="middle">Vélocité par sprint — Instable vs Stable</text>
  <!-- Y axis label -->
  <text x="18" y="180" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle" transform="rotate(-90,18,170)">Story points</text>
  <!-- Y axis ticks -->
  <text x="38" y="260" font-family="sans-serif" font-size="9" fill="#6b7280" text-anchor="end">0</text>
  <text x="38" y="220" font-family="sans-serif" font-size="9" fill="#6b7280" text-anchor="end">20</text>
  <text x="38" y="180" font-family="sans-serif" font-size="9" fill="#6b7280" text-anchor="end">40</text>
  <text x="38" y="140" font-family="sans-serif" font-size="9" fill="#6b7280" text-anchor="end">60</text>
  <text x="38" y="100" font-family="sans-serif" font-size="9" fill="#6b7280" text-anchor="end">80</text>
  <text x="38" y="60" font-family="sans-serif" font-size="9" fill="#6b7280" text-anchor="end">100</text>
  <!-- Grid lines -->
  <line x1="44" y1="258" x2="606" y2="258" stroke="#1e2a4a" stroke-width="1"/>
  <line x1="44" y1="218" x2="606" y2="218" stroke="#1e2a4a" stroke-width="1"/>
  <line x1="44" y1="178" x2="606" y2="178" stroke="#1e2a4a" stroke-width="1"/>
  <line x1="44" y1="138" x2="606" y2="138" stroke="#1e2a4a" stroke-width="1"/>
  <line x1="44" y1="98" x2="606" y2="98" stroke="#1e2a4a" stroke-width="1"/>
  <line x1="44" y1="58" x2="606" y2="58" stroke="#1e2a4a" stroke-width="1"/>
  <!-- Instability warning line at 30pts (30pts = y218-(30/100*200)=158) -->
  <line x1="44" y1="158" x2="606" y2="158" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="6,4"/>
  <text x="610" y="162" font-family="sans-serif" font-size="8" fill="#fbbf24">seuil</text>
  <!-- Sprint labels -->
  <text x="81" y="278" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">S1</text>
  <text x="149" y="278" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">S2</text>
  <text x="217" y="278" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">S3</text>
  <text x="285" y="278" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">S4</text>
  <text x="353" y="278" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">S5</text>
  <text x="421" y="278" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">S6</text>
  <text x="489" y="278" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">S7</text>
  <text x="557" y="278" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">S8</text>
  <!-- Instable bars (alternating high/low): S1=70,S2=20,S3=80,S4=15,S5=75,S6=25,S7=85,S8=18 -->
  <!-- bar height = pts * 2, y = 258 - height -->
  <rect x="56" y="118" width="24" height="140" rx="3" fill="#00cffd" opacity="0.6"/>
  <text x="68" y="114" font-family="sans-serif" font-size="8" fill="#00cffd" text-anchor="middle">70</text>
  <rect x="124" y="218" width="24" height="40" rx="3" fill="#00cffd" opacity="0.6"/>
  <text x="136" y="214" font-family="sans-serif" font-size="8" fill="#00cffd" text-anchor="middle">20</text>
  <rect x="192" y="98" width="24" height="160" rx="3" fill="#00cffd" opacity="0.6"/>
  <text x="204" y="94" font-family="sans-serif" font-size="8" fill="#00cffd" text-anchor="middle">80</text>
  <rect x="260" y="228" width="24" height="30" rx="3" fill="#00cffd" opacity="0.6"/>
  <text x="272" y="224" font-family="sans-serif" font-size="8" fill="#00cffd" text-anchor="middle">15</text>
  <rect x="328" y="108" width="24" height="150" rx="3" fill="#00cffd" opacity="0.6"/>
  <text x="340" y="104" font-family="sans-serif" font-size="8" fill="#00cffd" text-anchor="middle">75</text>
  <rect x="396" y="208" width="24" height="50" rx="3" fill="#00cffd" opacity="0.6"/>
  <text x="408" y="204" font-family="sans-serif" font-size="8" fill="#00cffd" text-anchor="middle">25</text>
  <rect x="464" y="88" width="24" height="170" rx="3" fill="#00cffd" opacity="0.6"/>
  <text x="476" y="84" font-family="sans-serif" font-size="8" fill="#00cffd" text-anchor="middle">85</text>
  <rect x="532" y="222" width="24" height="36" rx="3" fill="#00cffd" opacity="0.6"/>
  <text x="544" y="218" font-family="sans-serif" font-size="8" fill="#00cffd" text-anchor="middle">18</text>
  <!-- Stable trend line overlay (target ~50pts stable = y258-100=158) -->
  <polyline points="68,158 136,158 204,158 272,158 340,158 408,158 476,158 544,158" stroke="#86efac" stroke-width="2" fill="none" stroke-dasharray="5,3"/>
  <!-- Legend -->
  <rect x="50" y="292" width="12" height="10" rx="2" fill="#00cffd" opacity="0.7"/>
  <text x="66" y="301" font-family="sans-serif" font-size="9" fill="#94a3b8">Vélocité réelle (instable)</text>
  <rect x="234" y="292" width="20" height="2" fill="#86efac"/>
  <text x="258" y="301" font-family="sans-serif" font-size="9" fill="#94a3b8">Cible stable (50 pts)</text>
  <rect x="400" y="292" width="20" height="2" fill="#fbbf24" stroke-dasharray="4,3"/>
  <line x1="400" y1="297" x2="420" y2="297" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="424" y="301" font-family="sans-serif" font-size="9" fill="#94a3b8">Seuil instabilité</text>
</svg></div>

## Comment faire vivre ces indicateurs sans en faire une bureaucratie

Le piège classique : créer un tableau de bord de dix métriques qu'on remplit le vendredi soir sans jamais en parler. J'ai testé cette approche — elle ne sert à rien.

Ce qui fonctionne, c'est une revue mensuelle courte, centrée sur quatre questions : quel indicateur s'est détérioré ? Sait-on pourquoi ? Qu'est-ce qu'on change ? Qui est responsable du changement ? Pas plus de 45 minutes. Pas de présentation PowerPoint. Juste les quatre chiffres et une conversation honnête autour.

La revue mensuelle a un autre avantage : elle crée un historique. Au bout de six mois, on commence à voir des patterns — des projets qui déraillent toujours dans la même phase, des types de tâches systématiquement sous-estimés, des périodes de l'année où la vélocité chute. Ces patterns valent bien plus que n'importe quelle métrique isolée.

Sur les projets télécoms que je pilote, j'ai instauré une règle simple : si deux indicateurs sur quatre sont dans le rouge deux semaines de suite, on convoque une revue extraordinaire. Pas une réunion de crise — une revue de faits, calme, pour comprendre avant d'agir.

## Éviter le piège des métriques de confort

Les métriques de confort ont la vie dure parce qu'elles plaisent aux comités de pilotage. Elles donnent l'impression que tout est sous contrôle. Le nombre de réunions tenues, le pourcentage de tâches fermées, le NPS (Net Promoter Score, score de propension à recommander) interne — ce sont des indicateurs lagging qui mesurent l'activité, pas le résultat.

Le problème avec les métriques de confort : elles peuvent être excellentes pendant que le projet coule. J'ai vu un projet afficher 100 % de réunions hebdomadaires tenues et 90 % de tâches fermées dans l'outil — et rater sa mise en production de trois mois parce que personne ne mesurait le lead time ni le taux de défauts.

La règle que j'applique : si une métrique ne déclenche jamais de conversation difficile, elle ne sert probablement à rien. Un bon indicateur doit parfois forcer une décision inconfortable — reporter une date, revoir le périmètre, reconnaître qu'une estimation était fausse. C'est ça, piloter par les données.

> **L'essentiel** — Quatre indicateurs suffisent pour piloter un projet sérieusement : livraison dans les délais, taux de défauts, lead time et stabilité de vélocité. Revoyez-les chaque mois, cherchez les patterns, et méfiez-vous des métriques qui ne déclenchent jamais de conversation difficile. Ce qui se mesure s'améliore — à condition de mesurer les bonnes choses.
