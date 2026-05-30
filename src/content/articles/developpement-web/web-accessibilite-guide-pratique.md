---
title: "Accessibilité web en pratique : les quatre corrections qui comptent vraiment"
description: "Comprendre les niveaux WCAG simplement, identifier les quatre problèmes d'accessibilité les plus fréquents, et savoir tester sans outils spécialisés."
publishDate: "2025-03-03"
type: article
domain: developpement-web
image: "/images/themes/dev-web.webp"
pillColor: green
theme: technologie
---

L'accessibilité web est un de ces sujets que tout le monde cite mais que peu de développeurs regardent vraiment dans le blanc des yeux. Quand je travaillais sur des projets web chez ACTIV PARTNERS, l'accessibilité apparaissait rarement dans les spécifications, et quand elle y apparaissait, c'était sous forme de cases à cocher sans vrai sens opérationnel. Ce que j'ai appris depuis, c'est que l'essentiel de ce qui bloque les utilisateurs en situation de handicap se règle avec quatre corrections, et que la moitié d'entre elles améliorent aussi l'expérience pour tout le monde.

## Les niveaux WCAG sans le jargon

Les WCAG (Web Content Accessibility Guidelines) définissent trois niveaux de conformité. Les comprendre simplement change la façon dont on aborde les décisions techniques.

**Niveau A** — le minimum absolu. Ce sont les critères dont l'absence rend le site inutilisable pour certains utilisateurs. Pas de texte alternatif sur les images porteuses de sens, pas de contrôle clavier sur les éléments interactifs, contenus vidéo sans alternative : c'est le niveau A qui n'est pas atteint.

**Niveau AA** — le standard attendu. C'est ce que la plupart des réglementations européennes exigent. Il couvre les contrastes de couleur suffisants, les étiquettes de formulaire associées, les messages d'erreur compréhensibles. Si votre site ne vise rien d'autre, visez au moins AA.

**Niveau AAA** — le niveau optimal, rarement atteint dans l'ensemble d'un site. Il inclut des critères comme les sous-titres pour les contenus audio, les niveaux de contraste renforcés, ou la langue des signes pour les vidéos. Utile secteur par secteur, pas comme objectif global.

<div style="overflow-x:auto;margin:2rem 0">
<svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:560px;display:block;margin:auto;font-family:sans-serif">
  <rect width="560" height="300" rx="12" fill="#0a0f2e"/>
  <!-- Title -->
  <text x="280" y="24" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="bold">Pyramide de conformité WCAG</text>
  <!-- Level A — Base (widest) -->
  <polygon points="80,260 480,260 400,170 160,170" fill="#915EFF" opacity="0.85"/>
  <text x="280" y="215" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold">Niveau A</text>
  <text x="280" y="233" text-anchor="middle" fill="#e9d5ff" font-size="9">Minimum — Images avec alt, contrôle clavier de base</text>
  <text x="280" y="248" text-anchor="middle" fill="#e9d5ff" font-size="9">Atteint par ~60 % des sites audités</text>
  <!-- Level AA — Middle -->
  <polygon points="160,170 400,170 336,90 224,90" fill="#00cffd" opacity="0.85"/>
  <text x="280" y="128" text-anchor="middle" fill="#0a0f2e" font-size="13" font-weight="bold">Niveau AA</text>
  <text x="280" y="145" text-anchor="middle" fill="#0a0f2e" font-size="9">Contraste 4,5:1, labels formulaires, focus visible</text>
  <text x="280" y="160" text-anchor="middle" fill="#0a0f2e" font-size="9">Atteint par ~25 % des sites audités</text>
  <!-- Level AAA — Top (narrowest) -->
  <polygon points="224,90 336,90 308,30 252,30" fill="#86efac" opacity="0.9"/>
  <text x="280" y="58" text-anchor="middle" fill="#0a0f2e" font-size="12" font-weight="bold">AAA</text>
  <text x="280" y="73" text-anchor="middle" fill="#0a0f2e" font-size="8">Contraste 7:1, langue des signes</text>
  <text x="280" y="85" text-anchor="middle" fill="#0a0f2e" font-size="8">~ 5 % des sites</text>
  <!-- Annotations right side -->
  <text x="500" y="220" fill="#fbbf24" font-size="9" font-weight="bold">Obligatoire</text>
  <text x="500" y="233" fill="#fbbf24" font-size="8">secteur public</text>
  <line x1="478" y1="215" x2="496" y2="218" stroke="#fbbf24" stroke-width="1"/>
  <text x="500" y="130" fill="#00cffd" font-size="9" font-weight="bold">Standard</text>
  <text x="500" y="143" fill="#00cffd" font-size="8">réglementaire</text>
  <line x1="398" y1="128" x2="496" y2="130" stroke="#00cffd" stroke-width="1"/>
  <text x="500" y="58" fill="#86efac" font-size="9" font-weight="bold">Optimal</text>
  <line x1="306" y1="55" x2="496" y2="56" stroke="#86efac" stroke-width="1"/>
</svg>
</div>

## Les quatre corrections qui ont le plus d'impact

Sur la majorité des projets web que j'ai examinés, les mêmes problèmes reviennent. Les voici par ordre d'impact.

**1. Le contraste des couleurs.** Un texte gris clair sur fond blanc peut être lisible pour un utilisateur sans déficit visuel et invisible pour quelqu'un avec une acuité réduite. Le ratio minimum pour le texte normal est 4,5:1 selon WCAG AA. Ce n'est pas une contrainte esthétique draconienne — la grande majorité des palettes de couleurs modernes respectent ce ratio si on y pense dès la conception plutôt qu'après.

**2. La navigation au clavier.** Tout élément interactif doit être atteignable et utilisable avec la touche Tab et les flèches directionnelles. Cela concerne les menus déroulants, les modales, les carrousels, les formulaires. Le problème le plus courant n'est pas l'absence totale de navigation clavier, mais le fait que le focus visuel (l'indicateur qui montre où on est dans la page) a été supprimé pour des raisons esthétiques. Sans cet indicateur, la navigation au clavier est techniquement possible mais pratiquement inutilisable.

**3. Les textes alternatifs sur les images.** La règle est simple en apparence : toute image porteuse d'information doit avoir un attribut `alt` descriptif. Toute image décorative doit avoir `alt=""` (chaîne vide) pour que les lecteurs d'écran l'ignorent. Les erreurs les plus fréquentes que je rencontre : des `alt` générés automatiquement par le nom du fichier ("img_2024_03_banner_v2.jpg"), des images décoratives avec du texte descriptif superflu, et des graphiques complexes sans description de leur contenu.

**4. Les étiquettes de formulaire.** Chaque champ de formulaire doit avoir un label associé via l'attribut `for` qui pointe vers l'`id` du champ, ou via `aria-label`. Le placeholder seul ne suffit pas — il disparaît dès que l'utilisateur commence à taper, ce qui rend le champ impossible à identifier en cas d'erreur. C'est une correction qui prend dix minutes et qui améliore l'expérience pour tout le monde, pas seulement pour les utilisateurs de lecteurs d'écran.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e" rx="12"/>
  <text x="350" y="28" font-family="monospace" font-size="13" fill="#00cffd" text-anchor="middle" font-weight="bold">LES 4 CORRECTIONS À FORT IMPACT</text>
  <text x="350" y="46" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="middle">ce qui débloque vraiment les utilisateurs en situation de handicap</text>
  <rect x="30" y="70" width="155" height="270" rx="8" fill="#1a1f4e" stroke="#915EFF" stroke-width="1"/>
  <circle cx="60" cy="100" r="16" fill="#915EFF" fill-opacity="0.2" stroke="#915EFF" stroke-width="1.2"/>
  <text x="60" y="105" font-family="monospace" font-size="12" fill="#b48bff" text-anchor="middle" font-weight="bold">1</text>
  <text x="170" y="105" font-family="monospace" font-size="10" fill="#b48bff" text-anchor="end" font-weight="bold">CONTRASTE</text>
  <line x1="45" y1="120" x2="170" y2="120" stroke="#915EFF" stroke-width="0.5" opacity="0.4"/>
  <text x="107" y="140" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Ratio min 4,5:1</text>
  <text x="107" y="154" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">pour le texte normal</text>
  <rect x="45" y="170" width="125" height="22" rx="3" fill="#ffffff"/>
  <text x="107" y="185" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">gris clair invisible</text>
  <rect x="45" y="198" width="125" height="22" rx="3" fill="#0a0f2e" stroke="#915EFF" stroke-width="0.5"/>
  <text x="107" y="213" font-family="sans-serif" font-size="9" fill="#ffffff" text-anchor="middle" font-weight="bold">texte clair OK</text>
  <text x="107" y="240" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">Pensé dès la maquette,</text>
  <text x="107" y="254" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">jamais après.</text>
  <rect x="45" y="275" width="125" height="20" rx="3" fill="#915EFF" fill-opacity="0.15"/>
  <text x="107" y="290" font-family="monospace" font-size="9" fill="#b48bff" text-anchor="middle">Impact : visuel</text>
  <text x="107" y="315" font-family="sans-serif" font-size="8" fill="#7e8da4" text-anchor="middle">Concerne ~10% des</text>
  <text x="107" y="327" font-family="sans-serif" font-size="8" fill="#7e8da4" text-anchor="middle">utilisateurs (acuité)</text>
  <rect x="200" y="70" width="155" height="270" rx="8" fill="#1a1f4e" stroke="#67e8f9" stroke-width="1"/>
  <circle cx="230" cy="100" r="16" fill="#67e8f9" fill-opacity="0.2" stroke="#67e8f9" stroke-width="1.2"/>
  <text x="230" y="105" font-family="monospace" font-size="12" fill="#67e8f9" text-anchor="middle" font-weight="bold">2</text>
  <text x="340" y="105" font-family="monospace" font-size="10" fill="#67e8f9" text-anchor="end" font-weight="bold">CLAVIER</text>
  <line x1="215" y1="120" x2="340" y2="120" stroke="#67e8f9" stroke-width="0.5" opacity="0.4"/>
  <text x="277" y="140" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Tab, Shift+Tab, flèches</text>
  <text x="277" y="154" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">+ focus visible</text>
  <rect x="220" y="170" width="115" height="28" rx="3" fill="#0a0f2e" stroke="#67e8f9" stroke-width="2"/>
  <text x="277" y="188" font-family="monospace" font-size="10" fill="#67e8f9" text-anchor="middle">bouton focus</text>
  <text x="277" y="217" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">Erreur courante :</text>
  <text x="277" y="231" font-family="sans-serif" font-size="9" fill="#fb7185" text-anchor="middle">outline supprimé</text>
  <text x="277" y="245" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">pour l'esthétique</text>
  <text x="277" y="262" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">→ remplacer, pas</text>
  <text x="277" y="274" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">supprimer</text>
  <rect x="215" y="287" width="125" height="20" rx="3" fill="#67e8f9" fill-opacity="0.15"/>
  <text x="277" y="302" font-family="monospace" font-size="9" fill="#67e8f9" text-anchor="middle">Impact : moteur</text>
  <text x="277" y="324" font-family="sans-serif" font-size="8" fill="#7e8da4" text-anchor="middle">Lecteurs d'écran +</text>
  <text x="277" y="335" font-family="sans-serif" font-size="8" fill="#7e8da4" text-anchor="middle">handicaps moteurs</text>
  <rect x="370" y="70" width="155" height="270" rx="8" fill="#1a1f4e" stroke="#a7f3d0" stroke-width="1"/>
  <circle cx="400" cy="100" r="16" fill="#a7f3d0" fill-opacity="0.2" stroke="#a7f3d0" stroke-width="1.2"/>
  <text x="400" y="105" font-family="monospace" font-size="12" fill="#a7f3d0" text-anchor="middle" font-weight="bold">3</text>
  <text x="510" y="105" font-family="monospace" font-size="10" fill="#a7f3d0" text-anchor="end" font-weight="bold">ALT IMAGES</text>
  <line x1="385" y1="120" x2="510" y2="120" stroke="#a7f3d0" stroke-width="0.5" opacity="0.4"/>
  <text x="447" y="140" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Image porteuse :</text>
  <text x="447" y="154" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle">alt="description"</text>
  <text x="447" y="174" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Image décorative :</text>
  <text x="447" y="188" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle">alt=""</text>
  <text x="447" y="212" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">Erreurs fréquentes :</text>
  <text x="447" y="226" font-family="monospace" font-size="8" fill="#fb7185" text-anchor="middle">img_2024_03_v2.jpg</text>
  <text x="447" y="240" font-family="monospace" font-size="8" fill="#fb7185" text-anchor="middle">alt="image décorative"</text>
  <text x="447" y="254" font-family="monospace" font-size="8" fill="#fb7185" text-anchor="middle">graphique sans desc.</text>
  <rect x="385" y="275" width="125" height="20" rx="3" fill="#a7f3d0" fill-opacity="0.15"/>
  <text x="447" y="290" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle">Impact : cognitif</text>
  <text x="447" y="315" font-family="sans-serif" font-size="8" fill="#7e8da4" text-anchor="middle">Lecteurs d'écran +</text>
  <text x="447" y="327" font-family="sans-serif" font-size="8" fill="#7e8da4" text-anchor="middle">SEO bonus</text>
  <rect x="540" y="70" width="155" height="270" rx="8" fill="#1a1f4e" stroke="#fdba74" stroke-width="1"/>
  <circle cx="570" cy="100" r="16" fill="#fdba74" fill-opacity="0.2" stroke="#fdba74" stroke-width="1.2"/>
  <text x="570" y="105" font-family="monospace" font-size="12" fill="#fdba74" text-anchor="middle" font-weight="bold">4</text>
  <text x="680" y="105" font-family="monospace" font-size="10" fill="#fdba74" text-anchor="end" font-weight="bold">LABELS FORM</text>
  <line x1="555" y1="120" x2="680" y2="120" stroke="#fdba74" stroke-width="0.5" opacity="0.4"/>
  <text x="617" y="140" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">label for="email"</text>
  <text x="617" y="154" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">ou aria-label</text>
  <text x="617" y="172" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">Email</text>
  <rect x="557" y="178" width="120" height="20" rx="3" fill="#0a0f2e" stroke="#fdba74" stroke-width="1"/>
  <text x="617" y="192" font-family="sans-serif" font-size="9" fill="#fdba74" text-anchor="middle">vous@exemple.fr</text>
  <text x="617" y="220" font-family="sans-serif" font-size="9" fill="#fb7185" text-anchor="middle">Placeholder seul =</text>
  <text x="617" y="234" font-family="sans-serif" font-size="9" fill="#fb7185" text-anchor="middle">disparaît à la saisie</text>
  <text x="617" y="258" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">10 min pour fix,</text>
  <text x="617" y="270" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">utile pour tous</text>
  <rect x="555" y="285" width="125" height="20" rx="3" fill="#fdba74" fill-opacity="0.15"/>
  <text x="617" y="300" font-family="monospace" font-size="9" fill="#fdba74" text-anchor="middle">Impact : tous</text>
  <text x="617" y="322" font-family="sans-serif" font-size="8" fill="#7e8da4" text-anchor="middle">Surtout sur mobile</text>
  <text x="617" y="334" font-family="sans-serif" font-size="8" fill="#7e8da4" text-anchor="middle">et lecteurs d'écran</text>
</svg></div>

## Tester sans outil spécialisé

On n'a pas besoin d'installer une extension pour faire un premier audit d'accessibilité. Trois tests manuels révèlent la grande majorité des problèmes critiques.

**Test clavier.** Débranchez votre souris et naviguez sur votre site uniquement avec Tab, Shift+Tab, Entrée et les flèches. Vérifiez que vous pouvez atteindre tous les éléments interactifs, que le focus est visible à tout moment, et que les modales et les menus fonctionnent correctement.

**Test zoom 200%.** Dans votre navigateur, zoomez à 200%. Le contenu doit rester lisible et fonctionnel — pas de texte tronqué, pas d'éléments qui se chevauchent, pas de défilement horizontal forcé. Ce test révèle aussi les problèmes de contraste qui ne se voient pas au zoom normal.

**Test lecteur d'écran.** Sur Mac, VoiceOver est intégré (Cmd + F5 pour l'activer). Sur Windows, NVDA est gratuit. Parcourez votre page en mode lecture continue et vérifiez que le contenu annoncé correspond au contenu visible, que les images ont une description utile, et que les formulaires annoncent correctement le rôle de chaque champ.

Ces trois tests prennent une heure sur un site de taille moyenne. Ils révèlent suffisamment de problèmes pour prioriser un premier plan d'action concret.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 320" style="max-width:100%;height:auto">
  <rect width="700" height="320" fill="#0a0f2e" rx="12"/>
  <text x="350" y="28" font-family="monospace" font-size="13" fill="#00cffd" text-anchor="middle" font-weight="bold">PREMIER AUDIT — 3 TESTS, 1 HEURE</text>
  <text x="350" y="46" font-family="monospace" font-size="9" fill="#7e8da4" text-anchor="middle">aucun outil spécialisé, suffisant pour prioriser un plan d'action</text>
  <rect x="40" y="70" width="200" height="220" rx="8" fill="#1a1f4e" stroke="#67e8f9" stroke-width="1"/>
  <circle cx="140" cy="105" r="22" fill="#67e8f9" fill-opacity="0.15" stroke="#67e8f9" stroke-width="1.2"/>
  <text x="140" y="111" font-family="monospace" font-size="14" fill="#67e8f9" text-anchor="middle" font-weight="bold">⌨</text>
  <text x="140" y="148" font-family="monospace" font-size="11" fill="#67e8f9" text-anchor="middle" font-weight="bold">TEST CLAVIER</text>
  <line x1="60" y1="160" x2="220" y2="160" stroke="#67e8f9" stroke-width="0.5" opacity="0.3"/>
  <text x="140" y="180" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Débrancher la souris</text>
  <text x="140" y="195" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle">Tab / Shift+Tab</text>
  <text x="140" y="208" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle">Entrée / Espace</text>
  <text x="140" y="221" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle">Flèches</text>
  <text x="140" y="245" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">Vérifier que tout</text>
  <text x="140" y="259" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">est atteignable</text>
  <text x="140" y="273" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">et focus visible</text>
  <rect x="270" y="70" width="200" height="220" rx="8" fill="#1a1f4e" stroke="#b48bff" stroke-width="1"/>
  <circle cx="370" cy="105" r="22" fill="#b48bff" fill-opacity="0.15" stroke="#b48bff" stroke-width="1.2"/>
  <text x="370" y="111" font-family="monospace" font-size="13" fill="#b48bff" text-anchor="middle" font-weight="bold">200%</text>
  <text x="370" y="148" font-family="monospace" font-size="11" fill="#b48bff" text-anchor="middle" font-weight="bold">TEST ZOOM</text>
  <line x1="290" y1="160" x2="450" y2="160" stroke="#b48bff" stroke-width="0.5" opacity="0.3"/>
  <text x="370" y="180" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Cmd/Ctrl + (×4)</text>
  <text x="370" y="195" font-family="monospace" font-size="9" fill="#c4b5fd" text-anchor="middle">→ zoom 200%</text>
  <text x="370" y="218" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">Pas de texte tronqué</text>
  <text x="370" y="232" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">Pas de chevauchement</text>
  <text x="370" y="246" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">Pas de scroll horizontal</text>
  <text x="370" y="270" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Révèle aussi les</text>
  <text x="370" y="283" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">contrastes faibles</text>
  <rect x="500" y="70" width="200" height="220" rx="8" fill="#1a1f4e" stroke="#a7f3d0" stroke-width="1"/>
  <circle cx="600" cy="105" r="22" fill="#a7f3d0" fill-opacity="0.15" stroke="#a7f3d0" stroke-width="1.2"/>
  <text x="600" y="111" font-family="monospace" font-size="14" fill="#a7f3d0" text-anchor="middle" font-weight="bold">🔊</text>
  <text x="600" y="148" font-family="monospace" font-size="11" fill="#a7f3d0" text-anchor="middle" font-weight="bold">LECTEUR D'ÉCRAN</text>
  <line x1="520" y1="160" x2="680" y2="160" stroke="#a7f3d0" stroke-width="0.5" opacity="0.3"/>
  <text x="600" y="180" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Mac : VoiceOver</text>
  <text x="600" y="193" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle">Cmd + F5</text>
  <text x="600" y="208" font-family="sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">Windows : NVDA (gratuit)</text>
  <text x="600" y="232" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">Vérifier que ce qui est</text>
  <text x="600" y="246" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">annoncé correspond au</text>
  <text x="600" y="260" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">contenu visible</text>
  <text x="600" y="280" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle">images + formulaires</text>
</svg></div>

L'accessibilité n'est pas un projet à part entière — c'est une série de décisions de conception et de développement, prises au bon moment. Le bon moment, c'est pendant qu'on construit, pas après.

> **Ce que ça veut dire concrètement** — Les WCAG définissent trois niveaux : A (minimum absolu), AA (standard réglementaire), AAA (optimal rarement atteint globalement). Les quatre corrections à fort impact sont le contraste de couleurs suffisant, le focus clavier visible, les textes alternatifs pertinents sur les images, et les labels associés aux champs de formulaire. Un premier audit réaliste se fait sans outil : test clavier, zoom à 200%, et lecteur d'écran natif.
