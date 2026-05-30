---
title: "Scrum, Kanban, SAFe : choisir la bonne méthode selon le contexte"
description: "Comparaison pratique de Scrum, Kanban et SAFe — quand utiliser chacun, les hybrides qui fonctionnent, et les anti-patterns observés sur des projets télécom réels."
publishDate: "2025-07-21"
type: article
domain: gestion-projet
image: "/images/themes/management.webp"
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

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e" rx="12"/>
  <text x="350" y="28" font-family="monospace" font-size="13" fill="#00cffd" text-anchor="middle" font-weight="bold">HYBRIDE SCRUM + KANBAN</text>
  <text x="350" y="46" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="middle">deux flux séparés, une seule équipe — la séparation évite le mélange qui noie tout</text>
  <!-- Scrum core (left) -->
  <rect x="40" y="70" width="280" height="240" rx="10" fill="#1a1f4e" stroke="#915EFF" stroke-width="1.5"/>
  <text x="180" y="98" font-family="sans-serif" font-size="13" fill="#b48bff" text-anchor="middle" font-weight="bold">Noyau Scrum</text>
  <text x="180" y="116" font-family="monospace" font-size="10" fill="#7e8da4" text-anchor="middle">fonctionnalités planifiées</text>
  <!-- Sprint cycle dots -->
  <circle cx="90" cy="160" r="22" fill="#0a0f2e" stroke="#915EFF" stroke-width="1.5"/>
  <text x="90" y="164" font-family="monospace" font-size="9" fill="#c4b5fd" text-anchor="middle">Plan</text>
  <circle cx="180" cy="160" r="22" fill="#0a0f2e" stroke="#915EFF" stroke-width="1.5"/>
  <text x="180" y="164" font-family="monospace" font-size="9" fill="#c4b5fd" text-anchor="middle">Dev</text>
  <circle cx="270" cy="160" r="22" fill="#0a0f2e" stroke="#915EFF" stroke-width="1.5"/>
  <text x="270" y="164" font-family="monospace" font-size="9" fill="#c4b5fd" text-anchor="middle">Revue</text>
  <path d="M 112 160 L 158 160" stroke="#915EFF" stroke-width="1.2" marker-end="url(#arrV)"/>
  <path d="M 202 160 L 248 160" stroke="#915EFF" stroke-width="1.2" marker-end="url(#arrV)"/>
  <text x="180" y="210" font-family="monospace" font-size="10" fill="#cbd5e1" text-anchor="middle">Sprint 2 semaines</text>
  <text x="180" y="250" font-family="sans-serif" font-size="10" fill="#86efac" text-anchor="middle">→ cadence et prévisibilité</text>
  <text x="180" y="270" font-family="sans-serif" font-size="10" fill="#86efac" text-anchor="middle">→ backlog priorisé</text>
  <text x="180" y="290" font-family="sans-serif" font-size="10" fill="#86efac" text-anchor="middle">→ Definition of Done partagée</text>
  <!-- Kanban flow (right) -->
  <rect x="380" y="70" width="280" height="240" rx="10" fill="#1a1f4e" stroke="#00cffd" stroke-width="1.5"/>
  <text x="520" y="98" font-family="sans-serif" font-size="13" fill="#67e8f9" text-anchor="middle" font-weight="bold">Flux Kanban</text>
  <text x="520" y="116" font-family="monospace" font-size="10" fill="#7e8da4" text-anchor="middle">demandes entrantes / bugs</text>
  <!-- Columns -->
  <rect x="400" y="140" width="75" height="100" rx="4" fill="#0a0f2e" stroke="#00cffd" stroke-width="1"/>
  <text x="437" y="158" font-family="monospace" font-size="9" fill="#67e8f9" text-anchor="middle">À faire</text>
  <text x="437" y="172" font-family="monospace" font-size="8" fill="#7e8da4" text-anchor="middle">WIP ∞</text>
  <rect x="482" y="140" width="75" height="100" rx="4" fill="#0a0f2e" stroke="#fbbf24" stroke-width="1"/>
  <text x="519" y="158" font-family="monospace" font-size="9" fill="#fbbf24" text-anchor="middle">En cours</text>
  <text x="519" y="172" font-family="monospace" font-size="8" fill="#fbbf24" text-anchor="middle">WIP ≤ 3</text>
  <rect x="564" y="140" width="75" height="100" rx="4" fill="#0a0f2e" stroke="#86efac" stroke-width="1"/>
  <text x="601" y="158" font-family="monospace" font-size="9" fill="#86efac" text-anchor="middle">Livré</text>
  <text x="601" y="172" font-family="monospace" font-size="8" fill="#7e8da4" text-anchor="middle">flux continu</text>
  <!-- Cards inside columns -->
  <rect x="408" y="182" width="59" height="12" rx="2" fill="#915EFF" opacity="0.5"/>
  <rect x="408" y="200" width="59" height="12" rx="2" fill="#915EFF" opacity="0.5"/>
  <rect x="408" y="218" width="59" height="12" rx="2" fill="#915EFF" opacity="0.5"/>
  <rect x="490" y="182" width="59" height="12" rx="2" fill="#fbbf24" opacity="0.6"/>
  <rect x="490" y="200" width="59" height="12" rx="2" fill="#fbbf24" opacity="0.6"/>
  <rect x="572" y="182" width="59" height="12" rx="2" fill="#86efac" opacity="0.5"/>
  <text x="520" y="270" font-family="sans-serif" font-size="10" fill="#67e8f9" text-anchor="middle">→ urgences absorbées</text>
  <text x="520" y="290" font-family="sans-serif" font-size="10" fill="#67e8f9" text-anchor="middle">→ sprint protégé</text>
  <text x="350" y="338" font-family="monospace" font-size="9" fill="#fb923c" text-anchor="middle">règle d'aiguillage : urgent client → Kanban · nouveau besoin → backlog Scrum</text>
  <defs>
    <marker id="arrV" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#915EFF"/></marker>
  </defs>
</svg></div>

Les anti-patterns que j'ai observés, tous réels :

- **Scrum sans rôle de product owner clair** : le backlog devient un fourre-tout et les développeurs décident seuls de ce qui est prioritaire.
- **Kanban sans WIP limits** : la colonne "En cours" accumule vingt tâches et le tableau devient une illusion de suivi.
- **SAFe imposé sur une petite équipe** : le PI Planning dure deux jours pour produire un plan que tout le monde oublie trois semaines après.
- **Le Sprint planning de façade** : on remplit le sprint de tâches sans estimer leur charge réelle, et on finit systématiquement en retard.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e" rx="12"/>
  <text x="350" y="28" font-family="monospace" font-size="13" fill="#00cffd" text-anchor="middle" font-weight="bold">4 ANTI-PATTERNS QUI TUENT L'AGILITÉ</text>
  <text x="350" y="46" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="middle">signaux que la méthode est appliquée en façade</text>
  <!-- Card 1 -->
  <rect x="30" y="70" width="150" height="260" rx="10" fill="#1a1f4e" stroke="#fb7185" stroke-width="1.5"/>
  <text x="105" y="98" font-family="monospace" font-size="11" fill="#fb7185" text-anchor="middle" font-weight="bold">PO FANTÔME</text>
  <line x1="50" y1="108" x2="160" y2="108" stroke="#fb7185" stroke-width="1" opacity="0.5"/>
  <text x="105" y="132" font-family="sans-serif" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">Scrum sans</text>
  <text x="105" y="146" font-family="sans-serif" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">product owner</text>
  <text x="105" y="176" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Backlog fourre-tout,</text>
  <text x="105" y="190" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">devs qui priorisent</text>
  <text x="105" y="204" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">seuls, valeur diluée</text>
  <text x="105" y="240" font-family="monospace" font-size="8" fill="#fb7185" text-anchor="middle">→ Symptôme</text>
  <text x="105" y="260" font-family="sans-serif" font-size="9" fill="#fdba74" text-anchor="middle">Personne ne sait</text>
  <text x="105" y="274" font-family="sans-serif" font-size="9" fill="#fdba74" text-anchor="middle">pourquoi on fait</text>
  <text x="105" y="288" font-family="sans-serif" font-size="9" fill="#fdba74" text-anchor="middle">telle story</text>
  <text x="105" y="316" font-family="monospace" font-size="8" fill="#86efac" text-anchor="middle">Fix : 1 PO unique</text>
  <!-- Card 2 -->
  <rect x="195" y="70" width="150" height="260" rx="10" fill="#1a1f4e" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="270" y="98" font-family="monospace" font-size="11" fill="#fbbf24" text-anchor="middle" font-weight="bold">KANBAN MOLLE</text>
  <line x1="215" y1="108" x2="325" y2="108" stroke="#fbbf24" stroke-width="1" opacity="0.5"/>
  <text x="270" y="132" font-family="sans-serif" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">Tableau sans</text>
  <text x="270" y="146" font-family="sans-serif" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">WIP limits</text>
  <text x="270" y="176" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">20 tâches "en cours",</text>
  <text x="270" y="190" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">aucune finie,</text>
  <text x="270" y="204" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">illusion d'activité</text>
  <text x="270" y="240" font-family="monospace" font-size="8" fill="#fbbf24" text-anchor="middle">→ Symptôme</text>
  <text x="270" y="260" font-family="sans-serif" font-size="9" fill="#fdba74" text-anchor="middle">Lead time qui</text>
  <text x="270" y="274" font-family="sans-serif" font-size="9" fill="#fdba74" text-anchor="middle">explose, tickets</text>
  <text x="270" y="288" font-family="sans-serif" font-size="9" fill="#fdba74" text-anchor="middle">qui pourrissent</text>
  <text x="270" y="316" font-family="monospace" font-size="8" fill="#86efac" text-anchor="middle">Fix : WIP ≤ 3/perso</text>
  <!-- Card 3 -->
  <rect x="360" y="70" width="150" height="260" rx="10" fill="#1a1f4e" stroke="#fb923c" stroke-width="1.5"/>
  <text x="435" y="98" font-family="monospace" font-size="11" fill="#fb923c" text-anchor="middle" font-weight="bold">SAFe TROP TÔT</text>
  <line x1="380" y1="108" x2="490" y2="108" stroke="#fb923c" stroke-width="1" opacity="0.5"/>
  <text x="435" y="132" font-family="sans-serif" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">SAFe sur une</text>
  <text x="435" y="146" font-family="sans-serif" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">équipe de 10</text>
  <text x="435" y="176" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">2 jours de PI</text>
  <text x="435" y="190" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Planning pour un</text>
  <text x="435" y="204" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">plan oublié à J+15</text>
  <text x="435" y="240" font-family="monospace" font-size="8" fill="#fb923c" text-anchor="middle">→ Symptôme</text>
  <text x="435" y="260" font-family="sans-serif" font-size="9" fill="#fdba74" text-anchor="middle">Bureaucratie qui</text>
  <text x="435" y="274" font-family="sans-serif" font-size="9" fill="#fdba74" text-anchor="middle">étouffe la vitesse</text>
  <text x="435" y="288" font-family="sans-serif" font-size="9" fill="#fdba74" text-anchor="middle">de livraison</text>
  <text x="435" y="316" font-family="monospace" font-size="8" fill="#86efac" text-anchor="middle">Fix : revenir Scrum</text>
  <!-- Card 4 -->
  <rect x="525" y="70" width="150" height="260" rx="10" fill="#1a1f4e" stroke="#915EFF" stroke-width="1.5"/>
  <text x="600" y="98" font-family="monospace" font-size="11" fill="#b48bff" text-anchor="middle" font-weight="bold">SPRINT FAÇADE</text>
  <line x1="545" y1="108" x2="655" y2="108" stroke="#915EFF" stroke-width="1" opacity="0.5"/>
  <text x="600" y="132" font-family="sans-serif" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">Planning sans</text>
  <text x="600" y="146" font-family="sans-serif" font-size="10" fill="#ffffff" text-anchor="middle" font-weight="bold">estimation</text>
  <text x="600" y="176" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">On remplit, on lance,</text>
  <text x="600" y="190" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">on finit en retard</text>
  <text x="600" y="204" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">chaque sprint</text>
  <text x="600" y="240" font-family="monospace" font-size="8" fill="#b48bff" text-anchor="middle">→ Symptôme</text>
  <text x="600" y="260" font-family="sans-serif" font-size="9" fill="#fdba74" text-anchor="middle">Vélocité erratique,</text>
  <text x="600" y="274" font-family="sans-serif" font-size="9" fill="#fdba74" text-anchor="middle">stories qui durent</text>
  <text x="600" y="288" font-family="sans-serif" font-size="9" fill="#fdba74" text-anchor="middle">2-3 sprints</text>
  <text x="600" y="316" font-family="monospace" font-size="8" fill="#86efac" text-anchor="middle">Fix : DoR strict</text>
</svg></div>

## Ce que j'ai appris en changeant de méthode en cours de route

Sur un projet de refonte d'un système de gestion client chez KEOS TELECOM, on avait démarré en Scrum pur. Six mois plus tard, la nature du projet avait changé : on était passé d'un développement de nouvelles fonctionnalités à une phase de maintenance et de corrections continues. Les sprints ne correspondaient plus à la réalité du travail. On a basculé sur un Kanban enrichi de cadences mensuelles de planification. L'équipe a retrouvé un rythme dans la semaine.

Ce changement a rencontré de la résistance — les gens s'habituent aux rituels, même quand ils ne servent plus à rien. La clé : montrer les données. Le lead time avait doublé sur les trois derniers sprints. Le taux de complétion de sprint était tombé à 50 %. Avec ces chiffres sur la table, la discussion sur le changement de méthode devenait factuelle, pas émotionnelle.

La méthode n'est pas une identité. C'est un outil. Changer d'outil quand le travail change, c'est de la compétence — pas de l'inconstance.

> **Ce que ça veut dire concrètement** — Scrum convient aux équipes qui livrent par itérations sur un produit évolutif. Kanban s'impose dès que le travail est continu et imprévisible. SAFe n'a de sens qu'à grande échelle avec de vraies dépendances inter-équipes. Les hybrides fonctionnent si les règles sont claires. Et la méthode qui ne génère aucune conversation difficile est probablement appliquée en façade.
