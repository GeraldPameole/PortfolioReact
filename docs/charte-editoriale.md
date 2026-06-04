# Charte éditoriale

> Règles de rédaction et de ton pour les articles, pages et communications du site.

## 1. Identité éditoriale

- **Auteur** : Gérald Paméole, *Pilote d'activité & Expert en digitalisation*.
- **Positionnement** : profil hybride — télécom, management, dev web, formation. 20 ans de terrain.
- **Signature** : *« traduire la complexité, faire dialoguer les équipes, ancrer la performance dans la durée. »*

## 2. Audiences cibles (par ordre de fréquence)

1. **Managers / chefs de projet** en PME ou ETI cherchant des méthodes concrètes.
2. **Pairs** (autres consultants, formateurs, devs) en recherche d'inspiration.
3. **Recruteurs / DRH** évaluant le profil.
4. **Lecteurs grand public** intéressés par le management / la transformation digitale.

## 3. Ton et style

| Caractéristique | Description |
|---|---|
| **Voix** | 1ère personne du singulier ("je"), assumée. Témoignage de praticien. |
| **Vouvoiement** | Vouvoiement du lecteur (cohérence avec le ton pro). |
| **Niveau de langue** | Pro accessible. Vocabulaire métier expliqué quand technique. |
| **Position** | Pragmatique. "Du concret, testé sur le terrain." Pas de buzzwords vides. |
| **Promesses** | Réalistes. Pas de "10 trucs qui vont changer ta vie". |
| **Émotion** | Tempérée. Conviction sans excès. |

**À éviter** :
- Le jargon non explicité.
- Le "growth hacking" et autres buzzwords creux.
- Les généralités managériales sans exemple.
- Le tutoiement (sauf dans la newsletter le cas échéant, à arbitrer).

**À privilégier** :
- L'exemple concret tiré du terrain.
- Le chiffre/la statistique sourcée.
- La méthode actionnable (étapes, checklist).
- La nuance et l'aveu d'incertitude quand pertinent.

## 4. Format type d'un article

```markdown
---
title: "Titre clair, action-oriented si possible"
description: "Pitch en 1 phrase < 160 caractères pour le SEO et l'aperçu."
publishDate: "2026-MM-DD"
type: article
domain: "leadership-management"  # optionnel mais recommandé (catégorisation)
tags: ["management", "équipe", "performance"]
image: "/images/themes/management.webp"  # bannière (1280px max)
readingTime: 8  # estimation en minutes
keywords: ["mot-clé SEO", "..."]
---

## Introduction (sans titre obligatoire)
Un constat / une question / une scène concrète. ~3-5 lignes.

## H2 — premier point structurant
Texte en paragraphes courts (3-5 lignes). Listes à puces si > 3 items.

> Citation de mise en avant utile, marquante.

### H3 — sous-section
Détail / méthode / exemple.

## H2 — deuxième point
Idéalement avec un schéma SVG inline (cf. règle anti-lignes-vides) ou un tableau.

| Colonne | Colonne |
|---|---|
| Donnée | Donnée |

## H2 — synthèse / passage à l'action
Que retenir, par quoi commencer.
```

**Longueur cible** : 1 000 à 2 500 mots (8-15 min de lecture). Les articles plus courts sont OK pour des « notes » ; éviter le « brouillon long ».

## 5. Règles d'écriture

### Ponctuation
- Espaces insécables fines avant `; : ? !` (français standard).
- Tirets cadratins (`—`) ou demi-cadratins (`–`) plutôt que doubles tirets.
- Guillemets français `« … »` dans le texte, anglais `"…"` dans le code.

### Majuscules et capitalisation
- Titres : capitalisation française (1ère lettre seulement, sauf noms propres).
- **Pas** de title-case anglais (`Comment Faire Un X` → non, `Comment faire un X` → oui).

### Liens
- Liens descriptifs (jamais "cliquez ici"). Préférer `[le guide complet](/url)`.
- Liens externes : ouvrir dans le même onglet par défaut (sauf services externes annoncés comme tels — LinkedIn, GitHub).

### Listes
- Utiliser quand 3 items ou plus.
- Listes parallèles (même structure grammaticale entre items).
- Pas de listes imbriquées au-delà de 2 niveaux.

### Sigles métier
- À la **première occurrence d'un sigle dans un article**, développer entre parenthèses : `NPS (Net Promoter Score)`, `ARPU (Average Revenue Per User)`, `FTTB (Fiber to the Building)`. Mentions suivantes : sigle nu (le lecteur sait désormais).
- **Pas dans les titres** (H1/H2/H3) — si le sigle apparaît dans un titre, le développer dans le paragraphe qui suit.
- **Exclus volontairement du développement automatique** : `ISO` (toujours associé à un numéro de norme — `ISO 9001`, `ISO 27001` — qui le contextualise), sigles trop universels selon le sujet (`AI`/`IA`, `URL`).
- Le glossaire central est `scripts/acronyms.json`. Pour patcher rétroactivement les articles existants : `python3 scripts/expand-acronyms.py [--dry-run]` (idempotent — détecte si la définition existe déjà à proximité ou dans un titre, et skippe).
- Pour ajouter un sigle : l'ajouter au JSON, relancer le script.

### Code et commandes
- En `inline` : `` `npm run dev` ``.
- En bloc : triple backtick + langage.
- Toujours testé / fonctionnel.

### Visuels
- Bannière d'article : 1280x768 max, format WebP/JPG (déjà optimisée).
- Schémas SVG inline : **sans lignes vides à l'intérieur du bloc** (sinon Markdown casse le rendu — cf. `docs/documentation-technique.md`).
- Captures d'écran : préférer un crop ciblé (pas tout l'écran).

## 6. Cadence éditoriale

- **Rythme cible** : 1 article par semaine.
- **Jour de publication** : flexible, mais idéalement mardi-jeudi (meilleure portée newsletter).
- **Calendrier éditorial** : à tenir séparément (Notion / spreadsheet).
- **Réécritures** : autorisées, traçables via git.

## 7. SEO éditorial

- **Title** (frontmatter `title`) : 40-65 caractères, contient le mot-clé cible.
- **Description** : 120-160 caractères, accroche + bénéfice.
- **H1** unique par page (généré automatiquement à partir du titre).
- **H2** : structurants, en français naturel — pas de keyword stuffing.
- **Slug** d'URL : court, en kebab-case, sans mots vides (de, à, le…).
- **Mots-clés** (`keywords` frontmatter) : 3-7 termes pertinents.

## 8. Newsletter (Buttondown)

### Welcome email
Texte court, chaleureux. Présente la promesse (1 email/semaine, du concret, désabonnement 1 clic). Voir `docs/guide-utilisateur.md`.

### Articles envoyés
Auto-générés depuis le flux RSS enrichi (contenu HTML complet). Pas de rédaction spécifique pour la version email.

### Ton de la signature
*Cordialement* / *À bientôt* — pas "Bisous", pas "Cdt".

## 9. Réseaux sociaux (LinkedIn principalement)

- 1 post par article publié, avec un hook personnel.
- Ton : 1ère personne, anecdote/conviction, lien en commentaire ou en fin.
- Pas de "🚀 Excited to announce".

## 10. Mentions et marques

- **Citer les sources** : oui systématiquement (livres, études).
- **Nommer les outils utilisés** : libre, avec lien.
- **Pas de promo déguisée** : si recommandation, le dire (ex : *« j'utilise X depuis 3 ans »*).
