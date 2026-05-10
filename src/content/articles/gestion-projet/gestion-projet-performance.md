---
title: "Performance projet : les indicateurs qui comptent vraiment"
description: "Comment piloter un projet avec des KPIs utiles — lead time, taux de défauts, livraison dans les délais — sans se noyer dans les métriques inutiles."
publishDate: "2025-08-25"
type: article
domain: gestion-projet
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

## Comment faire vivre ces indicateurs sans en faire une bureaucratie

Le piège classique : créer un tableau de bord de dix métriques qu'on remplit le vendredi soir sans jamais en parler. J'ai testé cette approche — elle ne sert à rien.

Ce qui fonctionne, c'est une revue mensuelle courte, centrée sur quatre questions : quel indicateur s'est détérioré ? Sait-on pourquoi ? Qu'est-ce qu'on change ? Qui est responsable du changement ? Pas plus de 45 minutes. Pas de présentation PowerPoint. Juste les quatre chiffres et une conversation honnête autour.

La revue mensuelle a un autre avantage : elle crée un historique. Au bout de six mois, on commence à voir des patterns — des projets qui déraillent toujours dans la même phase, des types de tâches systématiquement sous-estimés, des périodes de l'année où la vélocité chute. Ces patterns valent bien plus que n'importe quelle métrique isolée.

Sur les projets télécoms que je pilote, j'ai instauré une règle simple : si deux indicateurs sur quatre sont dans le rouge deux semaines de suite, on convoque une revue extraordinaire. Pas une réunion de crise — une revue de faits, calme, pour comprendre avant d'agir.

## Éviter le piège des métriques de confort

Les métriques de confort ont la vie dure parce qu'elles plaisent aux comités de pilotage. Elles donnent l'impression que tout est sous contrôle. Le nombre de réunions tenues, le pourcentage de tâches fermées, le NPS interne — ce sont des indicateurs lagging qui mesurent l'activité, pas le résultat.

Le problème avec les métriques de confort : elles peuvent être excellentes pendant que le projet coule. J'ai vu un projet afficher 100 % de réunions hebdomadaires tenues et 90 % de tâches fermées dans l'outil — et rater sa mise en production de trois mois parce que personne ne mesurait le lead time ni le taux de défauts.

La règle que j'applique : si une métrique ne déclenche jamais de conversation difficile, elle ne sert probablement à rien. Un bon indicateur doit parfois forcer une décision inconfortable — reporter une date, revoir le périmètre, reconnaître qu'une estimation était fausse. C'est ça, piloter par les données.

> **En résumé** — Quatre indicateurs suffisent pour piloter un projet sérieusement : livraison dans les délais, taux de défauts, lead time et stabilité de vélocité. Revoyez-les chaque mois, cherchez les patterns, et méfiez-vous des métriques qui ne déclenchent jamais de conversation difficile. Ce qui se mesure s'améliore — à condition de mesurer les bonnes choses.
