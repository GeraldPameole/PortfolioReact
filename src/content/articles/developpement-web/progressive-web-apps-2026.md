---
title: "PWA en 2026 : quand c'est pertinent, quand ce ne l'est pas"
description: "Progressive Web Apps vs app native vs site responsive en 2026 — les 3 composants clés, les limites résiduelles sur iOS 18+, et les cas d'usage où ça a du sens."
publishDate: "2025-02-03"
updatedDate: "2026-05-31"
type: article
domain: developpement-web
image: "/images/themes/dev-web.webp"
pillColor: green
theme: technologie
tags:
  - developpement
  - pwa
  - mobile
  - web
---

## Le problème avec les PWA : tout le monde en parle, peu savent choisir

Chez ACTIV PARTNERS, j'ai eu plusieurs discussions avec des clients qui voulaient "une PWA" parce qu'ils avaient lu que c'était l'avenir. Sauf que quand on creuse, ce qu'ils voulaient vraiment c'était soit un site responsive bien fait, soit une vraie application native — et une PWA n'aurait pas résolu leur problème.

Une Progressive Web App n'est pas une solution universelle. C'est une réponse à des contraintes spécifiques : pas de budget pour deux apps natives (iOS + Android), besoin d'un accès offline, volonté d'installation sans passer par les stores. Si ces contraintes ne sont pas présentes, les bénéfices sont limités par rapport à la complexité ajoutée.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="30" font-family="monospace" font-size="14" fill="#86efac" text-anchor="middle" font-weight="bold">COMPARATIF PWA vs NATIVE vs WEB RESPONSIVE</text>
  <!-- Column headers -->
  <rect x="240" y="42" width="140" height="24" rx="4" fill="#915EFF" opacity="0.2"/>
  <text x="310" y="58" font-family="sans-serif" font-size="11" fill="#915EFF" text-anchor="middle" font-weight="bold">PWA</text>
  <rect x="390" y="42" width="140" height="24" rx="4" fill="#00cffd" opacity="0.2"/>
  <text x="460" y="58" font-family="sans-serif" font-size="11" fill="#00cffd" text-anchor="middle" font-weight="bold">App Native</text>
  <rect x="540" y="42" width="140" height="24" rx="4" fill="#86efac" opacity="0.2"/>
  <text x="610" y="58" font-family="sans-serif" font-size="11" fill="#86efac" text-anchor="middle" font-weight="bold">Web Responsive</text>
  <!-- Row: Performance -->
  <rect x="30" y="72" width="650" height="40" rx="3" fill="#0f1535"/>
  <text x="40" y="96" font-family="sans-serif" font-size="10" fill="#c4c4c4" font-weight="bold">Performance</text>
  <rect x="248" y="78" width="124" height="28" rx="3" fill="#fbbf24" opacity="0.15"/>
  <text x="310" y="96" font-family="sans-serif" font-size="9" fill="#fbbf24" text-anchor="middle">Bonne (cache)</text>
  <rect x="398" y="78" width="124" height="28" rx="3" fill="#86efac" opacity="0.2"/>
  <text x="460" y="96" font-family="sans-serif" font-size="9" fill="#86efac" text-anchor="middle">Excellente</text>
  <rect x="548" y="78" width="124" height="28" rx="3" fill="#fbbf24" opacity="0.15"/>
  <text x="610" y="96" font-family="sans-serif" font-size="9" fill="#fbbf24" text-anchor="middle">Variable</text>
  <!-- Row: Coût dev -->
  <rect x="30" y="118" width="650" height="40" rx="3" fill="#12183a"/>
  <text x="40" y="142" font-family="sans-serif" font-size="10" fill="#c4c4c4" font-weight="bold">Coût développement</text>
  <rect x="248" y="124" width="124" height="28" rx="3" fill="#86efac" opacity="0.2"/>
  <text x="310" y="142" font-family="sans-serif" font-size="9" fill="#86efac" text-anchor="middle">Un seul codebase</text>
  <rect x="398" y="124" width="124" height="28" rx="3" fill="#915EFF" opacity="0.2"/>
  <text x="460" y="142" font-family="sans-serif" font-size="9" fill="#915EFF" text-anchor="middle">x2 (iOS + Android)</text>
  <rect x="548" y="124" width="124" height="28" rx="3" fill="#86efac" opacity="0.2"/>
  <text x="610" y="142" font-family="sans-serif" font-size="9" fill="#86efac" text-anchor="middle">Un seul codebase</text>
  <!-- Row: Distribution -->
  <rect x="30" y="164" width="650" height="40" rx="3" fill="#0f1535"/>
  <text x="40" y="188" font-family="sans-serif" font-size="10" fill="#c4c4c4" font-weight="bold">Distribution</text>
  <rect x="248" y="170" width="124" height="28" rx="3" fill="#86efac" opacity="0.2"/>
  <text x="310" y="188" font-family="sans-serif" font-size="9" fill="#86efac" text-anchor="middle">URL directe</text>
  <rect x="398" y="170" width="124" height="28" rx="3" fill="#fbbf24" opacity="0.15"/>
  <text x="460" y="188" font-family="sans-serif" font-size="9" fill="#fbbf24" text-anchor="middle">App Store requis</text>
  <rect x="548" y="170" width="124" height="28" rx="3" fill="#86efac" opacity="0.2"/>
  <text x="610" y="188" font-family="sans-serif" font-size="9" fill="#86efac" text-anchor="middle">URL directe</text>
  <!-- Row: Offline -->
  <rect x="30" y="210" width="650" height="40" rx="3" fill="#12183a"/>
  <text x="40" y="234" font-family="sans-serif" font-size="10" fill="#c4c4c4" font-weight="bold">Offline</text>
  <rect x="248" y="216" width="124" height="28" rx="3" fill="#86efac" opacity="0.2"/>
  <text x="310" y="234" font-family="sans-serif" font-size="9" fill="#86efac" text-anchor="middle">Oui (Service Worker)</text>
  <rect x="398" y="216" width="124" height="28" rx="3" fill="#86efac" opacity="0.2"/>
  <text x="460" y="234" font-family="sans-serif" font-size="9" fill="#86efac" text-anchor="middle">Oui (natif)</text>
  <rect x="548" y="216" width="124" height="28" rx="3" fill="#915EFF" opacity="0.2"/>
  <text x="610" y="234" font-family="sans-serif" font-size="9" fill="#915EFF" text-anchor="middle">Non</text>
  <!-- Row: Accès hardware -->
  <rect x="30" y="256" width="650" height="40" rx="3" fill="#0f1535"/>
  <text x="40" y="280" font-family="sans-serif" font-size="10" fill="#c4c4c4" font-weight="bold">Accès hardware</text>
  <rect x="248" y="262" width="124" height="28" rx="3" fill="#fbbf24" opacity="0.15"/>
  <text x="310" y="280" font-family="sans-serif" font-size="9" fill="#fbbf24" text-anchor="middle">Limité (iOS surtout)</text>
  <rect x="398" y="262" width="124" height="28" rx="3" fill="#86efac" opacity="0.2"/>
  <text x="460" y="280" font-family="sans-serif" font-size="9" fill="#86efac" text-anchor="middle">Complet</text>
  <rect x="548" y="262" width="124" height="28" rx="3" fill="#915EFF" opacity="0.2"/>
  <text x="610" y="280" font-family="sans-serif" font-size="9" fill="#915EFF" text-anchor="middle">Très limité</text>
  <!-- Bottom note -->
  <text x="350" y="330" font-family="monospace" font-size="9" fill="#fbbf24" text-anchor="middle">Choisir selon les contraintes réelles, pas selon la tendance du moment</text>
</svg></div>

## Les 3 composants qui font une vraie PWA

Une PWA repose sur trois piliers techniques. Sans les trois, on n'a pas une PWA — on a soit un site avec du cache, soit un site installable mais fragile.

**Le Service Worker** est le cerveau de l'affaire. C'est un script JavaScript qui tourne en arrière-plan, indépendamment de la page. Il intercepte les requêtes réseau et décide quoi faire : aller chercher en cache, aller chercher sur le réseau, ou faire les deux en parallèle. C'est lui qui permet le mode offline et qui gère les stratégies de cache. L'écrire à la main est laborieux — la librairie Workbox de Google (v7 stable en 2026) simplifie considérablement le travail. Sur un projet Vite, le plugin `vite-plugin-pwa` est devenu le défaut de fait : il génère le manifest, enregistre le service worker et intègre Workbox sans configuration lourde.

**Le Web App Manifest** est un fichier JSON qui décrit l'application : nom, icônes, couleur de thème, mode d'affichage (standalone pour cacher l'interface du navigateur). C'est ce fichier qui permet au navigateur de proposer l'installation sur l'écran d'accueil. Sans lui, pas d'installation possible.

**HTTPS** est un prérequis non négociable. Les Service Workers ne fonctionnent que sur des connexions sécurisées. C'est une protection contre les attaques de type man-in-the-middle sur du code qui intercepte le réseau. En 2026, HTTPS est gratuit via Let's Encrypt et activé par défaut sur la quasi-totalité des hébergeurs (Vercel, Netlify, OVH, Cloudflare Pages) — ce n'est plus une contrainte, juste une étape de configuration.

<div style="overflow-x:auto;margin:2rem 0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 360" style="max-width:100%;height:auto">
  <rect width="700" height="360" fill="#0a0f2e"/>
  <text x="350" y="30" font-family="monospace" font-size="14" fill="#86efac" text-anchor="middle" font-weight="bold">ARCHITECTURE PWA — 3 COUCHES + FLUX DE REQUÊTE</text>
  <!-- Couche 3: App Shell -->
  <rect x="100" y="55" width="500" height="68" rx="8" fill="#1a1f4e" stroke="#86efac" stroke-width="2"/>
  <text x="200" y="78" font-family="sans-serif" font-size="11" fill="#86efac" font-weight="bold">APP SHELL</text>
  <text x="200" y="96" font-family="monospace" font-size="9" fill="#c4c4c4">HTML/CSS/JS statique mis en cache au premier chargement</text>
  <text x="200" y="112" font-family="sans-serif" font-size="8" fill="#7a7a9a">Navigation, icônes, styles — s'affiche instantanément même offline</text>
  <text x="560" y="95" font-family="monospace" font-size="9" fill="#86efac" text-anchor="middle">Cache statique</text>
  <!-- Arrow down -->
  <line x1="350" y1="123" x2="350" y2="148" stroke="#00cffd" stroke-width="2" marker-end="url(#arrd)"/>
  <text x="365" y="140" font-family="sans-serif" font-size="8" fill="#00cffd">Requête</text>
  <!-- Couche 2: Service Worker -->
  <rect x="100" y="150" width="500" height="68" rx="8" fill="#0f1535" stroke="#915EFF" stroke-width="2"/>
  <text x="200" y="173" font-family="sans-serif" font-size="11" fill="#915EFF" font-weight="bold">SERVICE WORKER</text>
  <text x="200" y="191" font-family="monospace" font-size="9" fill="#c4c4c4">Intercepte toutes les requêtes réseau sortantes</text>
  <text x="200" y="207" font-family="sans-serif" font-size="8" fill="#7a7a9a">Decide: répondre depuis le cache ou contacter le serveur</text>
  <text x="560" y="190" font-family="monospace" font-size="9" fill="#915EFF" text-anchor="middle">Intercept réseau</text>
  <!-- Arrow down -->
  <line x1="350" y1="218" x2="350" y2="243" stroke="#00cffd" stroke-width="2" marker-end="url(#arrd)"/>
  <text x="365" y="235" font-family="sans-serif" font-size="8" fill="#00cffd">Stratégie</text>
  <!-- Couche 1: Cache Strategy -->
  <rect x="100" y="245" width="500" height="68" rx="8" fill="#0a1a1a" stroke="#00cffd" stroke-width="2"/>
  <text x="200" y="268" font-family="sans-serif" font-size="11" fill="#00cffd" font-weight="bold">CACHE STRATEGY</text>
  <text x="200" y="286" font-family="monospace" font-size="9" fill="#c4c4c4">Stale-while-revalidate : répondre vite depuis le cache,</text>
  <text x="200" y="302" font-family="monospace" font-size="9" fill="#c4c4c4">puis mettre à jour en arrière-plan pour la prochaine visite</text>
  <text x="560" y="285" font-family="monospace" font-size="9" fill="#00cffd" text-anchor="middle">SWR strategy</text>
  <!-- Defs for arrow -->
  <defs>
    <marker id="arrd" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L0,6 L6,3 z" fill="#00cffd"/>
    </marker>
  </defs>
  <!-- Side arrows: network flow -->
  <line x1="82" y1="185" x2="45" y2="185" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#arry)"/>
  <text x="20" y="180" font-family="monospace" font-size="8" fill="#fbbf24" text-anchor="middle">Réseau</text>
  <text x="20" y="192" font-family="monospace" font-size="8" fill="#fbbf24" text-anchor="middle">si offline</text>
  <defs>
    <marker id="arry" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L0,6 L6,3 z" fill="#fbbf24"/>
    </marker>
  </defs>
  <!-- Bottom note -->
  <text x="350" y="335" font-family="monospace" font-size="9" fill="#fbbf24" text-anchor="middle">Sans les 3 couches actives, la PWA est incomplète</text>
</svg></div>

## Les limites résiduelles sur iOS en 2026

Apple a longtemps traîné les pieds sur les PWA. Depuis iOS 16.4 (mars 2023), Safari supporte les Web Push notifications pour les PWA installées sur l'écran d'accueil, et avec iOS 18 le support est devenu suffisamment stable pour la prod. Mais des restrictions importantes demeurent en 2026.

Les notifications push n'arrivent que si l'utilisateur a explicitement ajouté la PWA à son écran d'accueil — pas depuis Safari ouvert dans un onglet, contrairement à Android. Le taux de conversion "visite Safari → installation home screen → opt-in notifs" reste très faible (~2-5 % selon les retours observés), bien en dessous de ce qu'on obtient avec une vraie app native distribuée sur l'App Store. L'accès aux fonctionnalités hardware — Bluetooth, NFC, accès complet à la caméra pour certains usages — est plus restreint que sur Android. Le stockage en cache est limité et peut être purgé par iOS si la PWA n'est pas ouverte pendant plusieurs semaines, ce qui casse l'expérience offline si on ne l'a pas anticipé.

Concrètement : si votre audience est majoritairement sur iOS et que votre application dépend d'un funnel push fiable ou d'un accès hardware avancé, une PWA ne suffira pas. Si votre audience est mixte et que les cas d'usage principaux sont l'accès rapide et l'utilisation offline basique, la PWA est viable — d'autant qu'en 2026 vous pouvez également la publier sur le Google Play Store via Bubblewrap/TWA sans réécrire de code Android.

## Cas d'usage où une PWA a du sens

Les cas réels où j'ai vu des PWA apporter de la valeur : une application de catalogue produit pour des commerciaux terrain sans connexion fiable (offline critique), un outil de pointage pour des équipes en déplacement (installation directe sans passer par un MDM), une application de commande en restauration rapide (rapidité d'accès, pas besoin d'accès hardware avancé).

Ce qui ne nécessite pas de PWA : un blog, un site vitrine, un portfolio, une application SaaS avec des utilisateurs sur desktop. Dans ces cas, un site responsive bien optimisé fait le travail sans la complexité supplémentaire du Service Worker.

> **Ce que j'en retiens** — Une PWA est un bon choix quand l'offline est critique, quand on veut éviter les stores, et quand le budget ne permet pas deux apps natives. Ce n'est pas un substitut à une vraie app native si on a besoin d'un accès hardware complet ou de notifications push fiables sur iOS. Les trois composants — Service Worker, Manifest, HTTPS — sont tous obligatoires pour avoir une vraie PWA, pas juste un site avec du cache.
