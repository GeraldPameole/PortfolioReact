# 📊 Rapport de complétude des articles par domaine

> **Date de l'audit** : 1ᵉʳ juin 2026 (soirée — post Sprints 1+3+2 + P1/P2/P3)
> **Périmètre** : `src/content/articles/` — collection Astro `articles` validée par Zod (`src/content/config.ts`).
> **Méthodologie** : audit empirique par script Python (parsing frontmatter + body, détection placeholders, marqueurs d'expertise, comptage SVG/H2/mots).
> **Rapport précédent** : novembre 2025 (96 articles, 100 % incomplets, 50 % avec placeholders). Cette version reflète l'état après les **4 vagues de chantiers du 31 mai → 1ᵉʳ juin 2026** (refonte mi-2026, tags complets, expertise complète, étoffement des articles courts, ajout de 3 nouveaux articles dans les domaines sous-représentés).

## 📈 Résumé global — état 1ᵉʳ juin 2026 (soirée)

| Critère | Nov. 2025 | 31 mai (matin) | 1ᵉʳ juin (sprint 2) | **1ᵉʳ juin (soirée)** | Évolution totale |
|---|---:|---:|---:|---:|:---:|
| **Total articles** | 96 | 92 | 92 | **95** | +3 nouveaux (P3a/b/c) |
| **Articles avec placeholders** | 50 (52 %) | 0 (0 %) | 0 (0 %) | **0 (0 %)** | ✅ Résolu |
| **Articles avec `tags:`** | non mesuré | 45 / 92 (49 %) | 92 / 92 (100 %) | **95 / 95 (100 %)** | ✅ Couverture complète |
| **Expertise personnelle détectée** | non mesuré | 83 / 92 (90 %) | 91 / 92 (99 %) | **94 / 95 (99 %)** | ✅ Quasi-total |
| **Frontmatter requis valide** | non mesuré | 92 / 92 (100 %) | 92 / 92 (100 %) | **95 / 95 (100 %)** | ✅ Conforme |
| **Articles ≥ 2 SVG inline** | non mesuré | 92 / 92 (100 %) | 92 / 92 (100 %) | **95 / 95 (100 %)** | ✅ Charte appliquée |
| **Articles < 700 mots** | non mesuré | 8 (8,7 %) | 2 (2,2 %) | **1 (1,1 %)** | ✅ Quasi-résorbé |
| **Mots / article — moyenne** | non mesuré | 942 | 1 013 | **1 038** | +10 % vs initial |
| **Mots totaux du corpus** | non mesuré | ~ 86 700 | ~ 93 200 | **98 703** | +14 % vs initial |
| **Articles complets** (critères 2026) | 0 (0 %) | ~ 83 / 92 (90 %) | ~ 89 / 92 (97 %) | **~ 93 / 95 (98 %)** | ✅ Quasi-total |
| **Domaines à ≥ 2 articles** | non mesuré | 13 / 15 | 13 / 15 | **15 / 15** | ✅ Plus de domaine orphelin |

**Lecture stratégique** : le corpus est passé d'un état "stub avec placeholders" à un corpus **opérationnellement complet**. Les chantiers de complétion massive sont derrière. Ce qui reste à faire est ciblé, quantifiable, et tient en 3 listes courtes (sections 4-6).

## 1. Statistiques détaillées

### 1.1 — Volume éditorial

| Métrique | Valeur |
|---|---|
| Mots / article — médiane | **878** |
| Mots / article — moyenne | 942 |
| Mots / article — min | 575 (`service-client/service-client-performance.md`) |
| Mots / article — max | 2 735 (un article du domaine `developpement-web`) |
| H2 / article — médiane | 4 (sections principales) |
| SVG / article — médiane | 2 (minimum charte respecté) |
| SVG / article — moyenne | 2,4 |
| SVG / article — max | 4 |

### 1.2 — Qualité éditoriale

| Critère | Articles conformes | % |
|---|---:|---:|
| Pas de placeholder `[À compléter]`, `TODO`, `FIXME`, `Lorem ipsum`, `[Placeholder]`, etc. | 92 / 92 | **100 %** |
| Expertise personnelle terrain (mention `KEOS`, `SFR`, `ACTIV PARTNERS`, ou formules type "j'ai observé / accompagné / piloté / vu") | 91 / 92 | **99 %** |
| Frontmatter requis (`title`, `description`, `publishDate`, `type`) | 92 / 92 | **100 %** |
| Frontmatter `tags:` renseigné (utilisé par RSS `<categories>` → hashtags LinkedIn générés par Buffer) | 92 / 92 | **100 %** ✅ |
| ≥ 2 SVG inline conformes à la charte (viewBox 700×320/360, palette imposée) | 92 / 92 | **100 %** |
| Absence de ligne blanche dans les blocs `<svg>…</svg>` (règle CommonMark critique) | 92 / 92 | **100 %** |

## 2. Analyse par domaine

| Domaine | n | Mots moy. | SVG moy. | Expertise % | Placeholders % |
|---|---:|---:|---:|---:|---:|
| `developpement-commercial` | 2 | 804 | 2,0 | **100 %** | 0 % |
| `developpement-web` | 7 | 1 594 | 2,7 | 85 % | 0 % |
| `formation` | 16 | 903 | 2,3 | **100 %** | 0 % |
| `gestion-connaissances` | 1 | 1 057 | 3,0 | **100 %** | 0 % |
| `gestion-projet` | 8 | 802 | 2,4 | **100 %** | 0 % |
| `gestion-talents` | 16 | 826 | 2,3 | 93 % | 0 % |
| `innovation-technologies` | 3 | 1 595 | 2,3 | **100 %** | 0 % |
| `leadership-management` | 5 | 871 | 2,2 | 60 % ⚠️ | 0 % |
| `marketing-communication` | 6 | 1 003 | 2,5 | 83 % | 0 % |
| `outils-techniques` | 3 | 843 | 2,0 | 66 % | 0 % |
| `productivite-methodes` | 12 | 848 | 2,3 | 83 % | 0 % |
| `qualite-process` | 7 | 856 | 2,9 | **100 %** | 0 % |
| `reconversion-carriere` | 1 | 1 145 | 3,0 | **100 %** | 0 % |
| `service-client` | 2 | 778 | 2,0 | 50 % ⚠️ | 0 % |
| `transformation-digitale` | 3 | 748 | 2,3 | **100 %** | 0 % |
| **Total** | **92** | **942** | **2,4** | **90 %** | **0 %** |

**Observations** :
- **9 domaines à 100 % d'expertise terrain** : `developpement-commercial`, `formation`, `gestion-connaissances`, `gestion-projet`, `innovation-technologies`, `qualite-process`, `reconversion-carriere`, `transformation-digitale` (+ `developpement-web` quasi à 85 %).
- **3 domaines en retrait sur l'expertise** : `service-client` (50 %), `leadership-management` (60 %), `outils-techniques` (66 %) — soit 4 articles à enrichir pour gagner ~10 points.
- **Plus longs en moyenne** : `developpement-web` (1 594) et `innovation-technologies` (1 595) — cohérent avec leur technicité.
- **Plus courts en moyenne** : `service-client` (778), `transformation-digitale` (748), `gestion-projet` (802) — à arbitrer (compléter ou accepter le format court).

## 3. Top points forts

1. **0 placeholder** sur 92 articles — la dette éditoriale de novembre 2025 est totalement résorbée.
2. **100 % de frontmatter Zod-valide** — le build ne casse jamais sur un schéma manquant.
3. **100 % d'articles avec ≥ 2 SVG charte** — l'engagement visuel est uniforme.
4. **90 % avec expertise personnelle terrain** — le ton "Gérald" est défendu sur la quasi-totalité du corpus.
5. **0 ligne blanche dans les blocs `<svg>`** — la règle CommonMark critique est tenue partout (était la cause de 14 articles cassés en mai 2026, depuis verrouillée et documentée dans CLAUDE.md).

## 4. Sprint 1+3+2 — Ce qui a été fait depuis l'audit du 31 mai (matin)

### 4.1 — ✅ Sprint 1 (31 mai) — Tags complets

**Avant** : 45 / 92 articles avec `tags:` (49 %), 364 catégories totales dans le RSS.
**Après** : **92 / 92 (100 %)**, RSS qui sert ~ 4 tags/article aux générateurs de hashtags Buffer.

### 4.2 — ✅ Sprint 3 (31 mai) — Anomalies résolues

- **`formation-equipes-commerciales-complete 2.md`** → renommé sans l'espace (les 2 articles concernés étaient légitimement distincts, simple artefact macOS Finder).
- **`progressive-web-apps-2024.md`** → modernisé + renommé `progressive-web-apps-2026.md` (Option A retenue car article substantiel : ~1500 mots, retour ACTIV PARTNERS, 2 SVG). **10ᵉ redirection 301** ajoutée à `vercel.json`.
- **2 articles service-client étoffés** avec matériau Relation Client SFR 2005-2009 :
  - `service-client-excellence.md` : 700 → ~1180 mots, nouveau SVG tunnel de rétention.
  - `service-client-performance.md` : 575 → ~1190 mots, nouveau SVG KPIs vanity vs actionnables.

### 4.3 — ✅ Sprint 2 (1ᵉʳ juin) — Expertise + Étoffement

- **7 retours d'expérience terrain injectés** dans les articles qui en manquaient. Reste 1 article sans expertise : `pillcolor-guide.md` (légitimement, c'est un article méta sur la charte interne du site).
- **5 articles courts étoffés** (611-679 → 1200-1333 mots) : `web-javascript-modern`, `transformation-numerique-entreprise`, `gestion-priorites-efficacite`, `strategies-reseaux-sociaux-entreprises`, `gestion-qualite-certification`. Nouveau SVG matrice Eisenhower remplie pour priorités-efficacité.

### 4.4 — État résiduel — Points secondaires restants

**Articles encore courts (<700 mots)** — 2 sur 92 :
- 689 mots : `gestion-projet/gestion-projet-agile.md` — possible doublon avec `gestion-projet-agile-meilleures-pratiques.md`. À vérifier (fusion / suppression / acceptation format court).
- 694 mots : `productivite-methodes/productivite-professionnelle.md` — sujet "2026" qui mériterait densité. À étoffer dans un prochain cycle si l'occasion se présente.

**Article sans expertise terrain** — 1 sur 92 :
- `outils-techniques/pillcolor-guide.md` — article d'outillage interne sur le système de pill colors du site, par nature sans retour métier. **À accepter tel quel**.

## 5. Points faibles secondaires restants (priorité 2)

### 5.1 — Slugs résiduels en `-2024`

✅ **Tous résolus** au 1ᵉʳ juin 2026. Le dernier (`progressive-web-apps-2024`) a été modernisé et renommé `progressive-web-apps-2026` dans le Sprint 3, avec redirection 301.

### 5.2 — Anomalies filesystem

✅ **Toutes résolues** au 1ᵉʳ juin 2026. Le fichier `formation-equipes-commerciales-complete 2.md` a été renommé sans l'espace (les 2 articles concernés étaient légitimement distincts).

### 5.3 — Domaines sous-représentés (1-3 articles)

| Domaine | Articles | Décision suggérée |
|---|---:|---|
| `gestion-connaissances` | 1 | Étoffer (sujet riche, demande forte en RH/IT) |
| `reconversion-carriere` | 1 | Étoffer (sujet personnel à Gérald — sa propre reconversion dev→pilote = matériau premier) |
| `developpement-commercial` | 2 | Étoffer (avec le 5e métier Relation Client ajouté, il manque le pont "Comment développer son portefeuille premium" qui serait crédible) |
| `service-client` | 2 | ✅ Les 2 articles existants étoffés au Sprint 3 (matériau Relation Client SFR 2005-2009 réinjecté) |
| `transformation-digitale` | 3 | Suffisant en couverture, étoffer la profondeur de chaque |
| `outils-techniques` | 3 | Accepter le statut "satellite" (sujets techniques internes) |
| `innovation-technologies` | 3 | Suffisant après la restructuration (`ia-workflows-pro-2026`, `ia-marketing-2026`, `nouvelles-tendances-developpement-web`) |

## 6. Plan d'action recommandé

### ✅ Sprints exécutés (31 mai → 1ᵉʳ juin)

- **Sprint 1** (31 mai) : 47 articles taggés → 100 % de couverture `tags:`.
- **Sprint 3** (31 mai) : anomalie filesystem résolue, `progressive-web-apps-2024` modernisé + renommé, 2 articles service-client étoffés.
- **Sprint 2** (1ᵉʳ juin matin) : 7 retours d'expérience terrain injectés (1 article résiduel légitime), 5 articles courts étoffés à 1100-1300 mots.
- **P1/P2/P3** (1ᵉʳ juin après-midi) : doublon agile résolu via différenciation par renommage (`agile-infrastructure-telecom`), `productivite-professionnelle` étoffé à 1861 mots, **3 nouveaux articles créés** :
  - `gestion-connaissances/onboarding-knowledge-transfer.md` (~1100 mots) — méthode KEOS + SFR.
  - `reconversion-carriere/reconvertir-sans-tout-recommencer.md` — narratif autobiographique des 5 pivots de carrière Gérald.
  - `developpement-commercial/portefeuille-premium-methode-sfr.md` (~2100 mots) — méthode SFR 2005-2009 transposée au-delà du télécom.
- **Incident & récupération** (1ᵉʳ juin soirée) : commit raté `b46ad90` qui annulait une partie des travaux récupéré via `git reset --hard 59e92bc` + force-push. Aucune perte de contenu. Voir CHANGELOG entrée dédiée.
- **Fix navigation ViewTransitions** (1ᵉʳ juin soirée) : `BackButton` et `BackToTop` recâblés pour survivre aux transitions de vue Astro 4.

### 📋 Cycle suivant (optionnel — quand l'occasion se présente)

1. **Étoffer `agile-infrastructure-telecom.md`** (689 mots — seul article < 700 mots résiduel) — angle KEOS bien posé, juste à enrichir.
2. **Stabilité iCloud** : envisager de sortir le repo de `~/Desktop/` (donc d'iCloud Drive) vers un dossier non synchronisé (ex: `~/code/PortfolioReact`). Évite les dégonflements périodiques qui polluent le `git status` et créent des doublons macOS Finder.
3. **Routinizer** : à chaque relecture d'article, ajouter `updatedDate` au fur et à mesure.
4. **Étoffer les domaines à 2 articles** si l'occasion se présente : `gestion-connaissances`, `reconversion-carriere`, `service-client` (matériau RC SFR déjà bien exploité).

## 7. Méthodologie de l'audit

L'audit est **régénérable à tout moment** via un script Python qui :

1. Parcourt `src/content/articles/**/*.md`.
2. Extrait le frontmatter YAML et le corps Markdown.
3. Cherche les motifs de placeholder (`[À compléter]`, `TODO`, `FIXME`, `Lorem ipsum`, `[Placeholder]`, `[Votre…]`, `XXX+`).
4. Cherche les marqueurs d'expertise (`KEOS`, `SFR`, `ACTIV PARTNERS`, formules personnelles).
5. Compte les `<svg>`, les `## ` (H2), les `### ` (H3).
6. Calcule un nombre de mots (en retirant SVG et blocs de code).
7. Vérifie les champs requis (`title`, `description`, `publishDate`, `type`) et recommandés (`domain`, `image`, `tags`).
8. Agrège par domaine et publie les listes actionnables.

Pour relancer l'audit (script intégré dans la prochaine itération si besoin) ou regénérer ce rapport, demander à Claude Code : *"refais l'audit de complétude des articles"* — la méthode est documentée ici-même.

---

*Ce rapport remplace intégralement la version de novembre 2025 (96 articles, 100 % incomplets, 50 % avec placeholders). Voir [`docs/CHANGELOG.md`](docs/CHANGELOG.md) entrée 2026-05-31 pour le récit des chantiers ayant permis cette inversion.*
