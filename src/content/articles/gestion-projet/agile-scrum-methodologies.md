---
title: "Scrum, Kanban, SAFe : choisir la bonne méthode selon le contexte"
description: "Comparaison pratique de Scrum, Kanban et SAFe — quand utiliser chacun, les hybrides qui fonctionnent, et les anti-patterns observés sur des projets télécom réels."
publishDate: "2025-07-21"
type: article
domain: gestion-projet
image: "/images/themes/management.jpg"
pillColor: blue
theme: gestion
---

## Pourquoi la question n'est pas "quelle méthode est la meilleure ?"

Quand j'ai rejoint KEOS TELECOM en 2021, l'équipe projet utilisait officiellement Scrum. En pratique, les sprints duraient trois semaines ou quatre selon l'humeur, les rétrospectives avaient lieu une fois sur trois, et le backlog ressemblait à un cimetière de demandes jamais traitées. Tout le monde disait "on fait de l'agile" — personne ne l'appliquait vraiment.

La question n'est pas de savoir quelle méthode est supérieure dans l'absolu. La question est : quel cadre correspond à la nature du travail, à la taille de l'équipe, et au niveau de maturité de l'organisation ? Scrum, Kanban et SAFe répondent à des besoins différents. Les confondre ou les appliquer mécaniquement sans ce questionnement préalable explique la majorité des échecs que j'ai observés.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" style="max-width:100%;height:auto">
  <rect width="640" height="320" fill="#0a0f2e" rx="12"/>
  <!-- Header -->
  <rect x="0" y="0" width="640" height="44" fill="#0a0f2e" rx="12"/>
  <rect x="0" y="32" width="640" height="12" fill="#0a0f2e"/>
  <!-- Column headers -->
  <rect x="160" y="10" width="150" height="28" rx="6" fill="#915EFF"/>
  <text x="235" y="29" font-family="sans-serif" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">Scrum</text>
  <rect x="320" y="10" width="150" height="28" rx="6" fill="#00cffd"/>
  <text x="395" y="29" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0a0f2e" text-anchor="middle">Kanban</text>
  <rect x="480" y="10" width="150" height="28" rx="6" fill="#fbbf24"/>
  <text x="555" y="29" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0a0f2e" text-anchor="middle">SAFe</text>
  <!-- Row labels -->
  <text x="10" y="84" font-family="sans-serif" font-size="12" fill="#94a3b8">Cadence</text>
  <text x="10" y="148" font-family="sans-serif" font-size="12" fill="#94a3b8">Taille équipe</text>
  <text x="10" y="212" font-family="sans-serif" font-size="12" fill="#94a3b8">Flux</text>
  <text x="10" y="276" font-family="sans-serif" font-size="12" fill="#94a3b8">Idéal pour</text>
  <!-- Separators -->
  <line x1="0" y1="55" x2="640" y2="55" stroke="#1e2a4a" stroke-width="1"/>
  <line x1="0" y1="118" x2="640" y2="118" stroke="#1e2a4a" stroke-width="1"/>
  <line x1="0" y1="182" x2="640" y2="182" stroke="#1e2a4a" stroke-width="1"/>
  <line x1="0" y1="246" x2="640" y2="246" stroke="#1e2a4a" stroke-width="1"/>
  <line x1="155" y1="44" x2="155" y2="320" stroke="#1e2a4a" stroke-width="1"/>
  <line x1="315" y1="44" x2="315" y2="320" stroke="#1e2a4a" stroke-width="1"/>
  <line x1="475" y1="44" x2="475" y2="320" stroke="#1e2a4a" stroke-width="1"/>
  <!-- Scrum column -->
  <text x="235" y="74" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">Sprints fixes</text>
  <text x="235" y="88" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">(1–4 semaines)</text>
  <text x="235" y="138" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">5–9 personnes</text>
  <text x="235" y="202" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">Itératif par lot</text>
  <text x="235" y="266" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">Produit défini,</text>
  <text x="235" y="280" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">périmètre évolutif</text>
  <!-- Kanban column -->
  <text x="395" y="74" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">Continue</text>
  <text x="395" y="88" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">(pas de sprint)</text>
  <text x="395" y="138" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">Flexible</text>
  <text x="395" y="202" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">Flux continu</text>
  <text x="395" y="266" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">Support, ops,</text>
  <text x="395" y="280" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">demandes variées</text>
  <!-- SAFe column -->
  <text x="555" y="74" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">PI Planning</text>
  <text x="555" y="88" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">(8–12 semaines)</text>
  <text x="555" y="138" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">50–150+ personnes</text>
  <text x="555" y="202" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">Multi-équipes</text>
  <text x="555" y="266" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">Grands programmes</text>
  <text x="555" y="280" font-family="sans-serif" font-size="11" fill="#c8c8d0" text-anchor="middle">multi-équipes</text>
</svg></div>

## Scrum, Kanban, SAFe : quand chacun s'impose

**Scrum** convient quand le travail peut être découpé en incréments définis, que l'équipe est stable, et que le produit ou le service évolue par itérations. C'est le cadre que j'utilise pour des projets de développement ou de transformation dont le périmètre n'est pas figé mais dont les objectifs par sprint peuvent l'être. La cérémonie clé qui change tout : la revue de sprint avec le client ou le commanditaire. Sans elle, Scrum devient une mécanique interne sans valeur.

Ce que j'ai vu rater systématiquement avec Scrum dans les projets télécoms : des équipes qui lancent des sprints sans définition du fini, et qui traînent des stories "à 90 %" d'un sprint à l'autre. C'est le signe que la décomposition du travail est mauvaise, pas que la méthode ne fonctionne pas.

**Kanban** est sous-utilisé et souvent mal compris. Ce n'est pas "coller des post-its sur un tableau". C'est limiter le travail en cours pour fluidifier le flux — et rendre visible l'accumulation. Je l'applique sur tout ce qui ressemble à du support ou à un flux de demandes continues : traitement des incidents, suivi des demandes clients, coordination inter-équipes. La règle des limites de travail en cours (WIP limits) est la seule contrainte qui compte vraiment. Sans elle, un tableau Kanban n'est qu'une liste de tâches avec une vignette colorée.

**SAFe** est pertinent dans un seul contexte : quand plusieurs équipes doivent livrer ensemble, sur un programme commun, avec des dépendances fortes. C'est lourd, c'est cher à mettre en place, et ça crée une structure qui peut étouffer la vitesse de livraison si elle n'est pas bien ajustée. J'ai travaillé avec des partenaires qui avaient adopté SAFe dans des équipes de dix personnes — c'était une catastrophe bureaucratique. SAFe n'a de sens qu'à partir d'un seuil de complexité organisationnelle réel.

## Les hybrides qui fonctionnent — et les anti-patterns à éviter

En pratique, les projets que je pilote utilisent rarement une méthode pure. Le plus courant : un noyau Scrum pour l'équipe de développement, combiné à un flux Kanban pour le traitement des demandes entrantes et des bugs. Les sprints donnent la cadence et la prévisibilité, le Kanban absorbe l'imprévu sans déstabiliser le sprint.

Ce qui fonctionne bien : définir clairement quelle partie du travail suit quelle règle. Les demandes urgentes passent dans la file Kanban. Les nouvelles fonctionnalités passent par le backlog Scrum et entrent dans un sprint après priorisation. La séparation évite le mélange qui noie tout.

Les anti-patterns que j'ai observés, tous réels :

- **Scrum sans rôle de product owner clair** : le backlog devient un fourre-tout et les développeurs décident seuls de ce qui est prioritaire.
- **Kanban sans WIP limits** : la colonne "En cours" accumule vingt tâches et le tableau devient une illusion de suivi.
- **SAFe imposé sur une petite équipe** : le PI Planning dure deux jours pour produire un plan que tout le monde oublie trois semaines après.
- **Le Sprint planning de façade** : on remplit le sprint de tâches sans estimer leur charge réelle, et on finit systématiquement en retard.

## Ce que j'ai appris en changeant de méthode en cours de route

Sur un projet de refonte d'un système de gestion client chez KEOS TELECOM, on avait démarré en Scrum pur. Six mois plus tard, la nature du projet avait changé : on était passé d'un développement de nouvelles fonctionnalités à une phase de maintenance et de corrections continues. Les sprints ne correspondaient plus à la réalité du travail. On a basculé sur un Kanban enrichi de cadences mensuelles de planification. L'équipe a retrouvé un rythme dans la semaine.

Ce changement a rencontré de la résistance — les gens s'habituent aux rituels, même quand ils ne servent plus à rien. La clé : montrer les données. Le lead time avait doublé sur les trois derniers sprints. Le taux de complétion de sprint était tombé à 50 %. Avec ces chiffres sur la table, la discussion sur le changement de méthode devenait factuelle, pas émotionnelle.

La méthode n'est pas une identité. C'est un outil. Changer d'outil quand le travail change, c'est de la compétence — pas de l'inconstance.

> **En résumé** — Scrum convient aux équipes qui livrent par itérations sur un produit évolutif. Kanban s'impose dès que le travail est continu et imprévisible. SAFe n'a de sens qu'à grande échelle avec de vraies dépendances inter-équipes. Les hybrides fonctionnent si les règles sont claires. Et la méthode qui ne génère aucune conversation difficile est probablement appliquée en façade.
