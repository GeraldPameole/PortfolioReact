# 📊 Rapport de complétude des articles par domaine

> **Date de l'audit** : 31 mai 2026
> **Périmètre** : `src/content/articles/` — collection Astro `articles` validée par Zod (`src/content/config.ts`).
> **Méthodologie** : audit empirique par script Python (parsing frontmatter + body, détection placeholders, marqueurs d'expertise, comptage SVG/H2/mots).
> **Rapport précédent** : novembre 2025 (96 articles, 100 % incomplets, 50 % avec placeholders). **Cette nouvelle version reflète l'état après la grande refonte mai 2026**.

## 📈 Résumé global — état mai 2026

| Critère | Nov. 2025 | **Mai 2026** | Évolution |
|---|---:|---:|:---:|
| **Total articles** | 96 | **92** | −4 (densification, fusions) |
| **Articles avec placeholders** | 50 (52 %) | **0 (0 %)** | ✅ Résolu |
| **Expertise personnelle détectée** | non mesuré | **83 / 92 (90 %)** | ✅ Très haut |
| **Frontmatter requis valide** (`title`, `description`, `publishDate`, `type`) | non mesuré | **92 / 92 (100 %)** | ✅ Conforme |
| **Articles avec ≥ 2 SVG inline** | non mesuré | **92 / 92 (100 %)** | ✅ Charte appliquée |
| **Articles complets** (selon critères 2026) | 0 (0 %) | **~ 83 / 92 (90 %)** | ✅ Inversion totale |

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
| Expertise personnelle terrain (mention `KEOS`, `SFR`, `ACTIV PARTNERS`, ou formules type "j'ai observé / accompagné / piloté / vu") | 83 / 92 | **90 %** |
| Frontmatter requis (`title`, `description`, `publishDate`, `type`) | 92 / 92 | **100 %** |
| Frontmatter `tags:` renseigné (utilisé par RSS `<categories>` → hashtags LinkedIn générés par Buffer) | 45 / 92 | **49 %** ⚠️ |
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

## 4. Points faibles actionnables (priorité 1)

### 4.1 — Tags manquants dans 47 articles (51 %)

**Impact concret** : ces articles ne génèrent **aucune `<category>`** dans le RSS → **aucun hashtag** suggéré à Buffer → posts LinkedIn moins ciblés. Avec le lancement Buffer prévu mardi 2 juin, c'est le **chantier prioritaire**.

Liste exhaustive (par domaine) :

- `developpement-commercial/` : `negocier-salaire-techniques-avancees`, `recrutement-talents-digitaux`
- `developpement-web/` : `frameworks-javascript-2026`, `progressive-web-apps-2024`, `web-accessibilite-guide-pratique`, `web-javascript-modern`
- `formation/` : `apprentissage-continu-developpement-competences`, `formation-adaptation`, `formation-collaboration`, `formation-elearning`, `formation-professionnelle-continue`, `formation-technique`
- `gestion-connaissances/` : `gestion-connaissances-organisation`
- `gestion-projet/` : `agile-scrum-methodologies`, `gestion-performance-equipe`, `gestion-performance-evaluation`, `gestion-projet-agile`, `gestion-projet-risques`
- `gestion-talents/` : 16 articles (presque tout le domaine) → bloc prioritaire à tagger en lot
- `leadership-management/` : `leadership-equipes-performance`, `management-diversite-inclusion`
- `outils-techniques/` : `mermaid-example`, `pillcolor-guide`, `visualisations-mermaid`
- `productivite-methodes/` : `comment-planifier-mon-travail`, `deep-work`, `gestion-priorites-efficacite`
- `qualite-process/` : `gestion-qualite-amelioration`, `gestion-qualite-certification`
- `reconversion-carriere/` : `reconversion-professionnelle-reussie`
- `service-client/` : `service-client-excellence`
- `transformation-digitale/` : `transformation-numerique-entreprise`

**Action recommandée** : passer 3-4 tags par article (en cohérence avec le titre + le domaine). Travail batchable : ~2 minutes par article → ~1h30 pour les 47.

### 4.2 — 9 articles sans marqueur d'expertise terrain

Articles où aucune mention de `KEOS`, `SFR`, `ACTIV PARTNERS` ni formule type "j'ai observé / accompagné / piloté" n'a été détectée :

| Article | Domaine | Action |
|---|---|---|
| `react-performance-2026.md` | developpement-web | Ajouter retour ACTIV PARTNERS (refonte React 18→19, gain Compiler mesuré) |
| `gestion-talents-zen.md` | gestion-talents | Ajouter observation KEOS (bien-être 17 mainteneurs sous-traitants) |
| `formation-leadership.md` | leadership-management | Ajouter retour ACTIV ou SFR (formation des superviseurs commerciaux) |
| `management-diversite-inclusion.md` | leadership-management | Ajouter retour KEOS (équipe multi-sites France + sous-traitants) |
| `marketing-content-strategies.md` | marketing-communication | Ajouter retour ACTIV PARTNERS (refonte sites WordPress + content strategy) |
| `pillcolor-guide.md` | outils-techniques | Article méta sur la charte → accepter l'absence d'expertise (article d'outillage interne) |
| `gestion-stress-performance.md` | productivite-methodes | Ajouter observation terrain (gestion pression projet KEOS) |
| `gestion-surcharge-informationnelle.md` | productivite-methodes | Ajouter retour pilotage NOC/Terrain/Direction KEOS |
| `service-client-excellence.md` | service-client | Ajouter retour terrain (5e métier Relation Client SFR 2005-2009 = matériau parfait) |

**Note** : 1 sur 9 est légitimement sans expertise (`pillcolor-guide` = outillage interne). **8 articles à enrichir** → ~10 min chacun, gain crédibilité fort.

### 4.3 — 8 articles très courts (<700 mots)

Sous le seuil "article complet" généralement admis. À arbitrer au cas par cas :

| Mots | Article | Recommandation |
|---|---|---|
| 575 | `service-client/service-client-performance` | **Étoffer** — sujet KPIs / réclamations / cas difficiles mérite plus de profondeur |
| 611 | `developpement-web/web-javascript-modern` | Étoffer ou fusionner avec `technologies-javascript-2026` |
| 633 | `transformation-digitale/transformation-numerique-entreprise` | Étoffer (sujet sensible commercialement, mérite densité) |
| 673 | `productivite-methodes/gestion-priorites-efficacite` | Format court assumé possible (méthode = matrice Eisenhower) |
| 679 | `marketing-communication/strategies-reseaux-sociaux-entreprises` | Étoffer (sujet adjacent à `strategies-reseaux-sociaux-b2b` qui sera le 1er post LinkedIn) |
| 679 | `qualite-process/gestion-qualite-certification` | Étoffer (ISO 9001 = sujet à forte demande SEO) |
| 689 | `gestion-projet/gestion-projet-agile` | Possible doublon avec `gestion-projet-agile-meilleures-pratiques` → vérifier |
| 694 | `productivite-methodes/productivite-professionnelle` | Étoffer (article qui doit porter le ton "2026") |

## 5. Points faibles secondaires (priorité 2)

### 5.1 — Slugs résiduels en `-2024`

- `developpement-web/progressive-web-apps-2024.md` — seul article au slug "-2024" restant après la refonte du 31 mai 2026. À actualiser + renommer dans un prochain cycle si la PWA mérite encore un article dédié en 2026 (à arbitrer, la PWA a perdu en hype).

### 5.2 — Anomalie filesystem

- `formation/formation-equipes-commerciales-complete 2.md` — fichier avec **espace dans le nom**, probablement un doublon copié à un moment. À investiguer et fusionner / supprimer.

### 5.3 — Domaines sous-représentés (1-3 articles)

| Domaine | Articles | Décision suggérée |
|---|---:|---|
| `gestion-connaissances` | 1 | Étoffer (sujet riche, demande forte en RH/IT) |
| `reconversion-carriere` | 1 | Étoffer (sujet personnel à Gérald — sa propre reconversion dev→pilote = matériau premier) |
| `developpement-commercial` | 2 | Étoffer (avec le 5e métier Relation Client ajouté, il manque le pont "Comment développer son portefeuille premium" qui serait crédible) |
| `service-client` | 2 | Étoffer — encore une fois, le matériau du 5e métier nourrit ce domaine |
| `transformation-digitale` | 3 | Suffisant en couverture, étoffer la profondeur de chaque |
| `outils-techniques` | 3 | Accepter le statut "satellite" (sujets techniques internes) |
| `innovation-technologies` | 3 | Suffisant après la restructuration (`ia-workflows-pro-2026`, `ia-marketing-2026`, `nouvelles-tendances-developpement-web`) |

## 6. Plan d'action recommandé

### 🔥 Sprint 1 (avant le démarrage Buffer mardi 2 juin)

1. **Tagger les 47 articles sans `tags:`** — script semi-automatique : pour chaque article, extraire 3-4 tags depuis le titre + le domaine + le contenu. Impact direct sur la qualité des posts LinkedIn auto-générés par Buffer.

### ⚡ Sprint 2 (semaine du 2 juin)

2. **Enrichir les 8 articles sans expertise terrain** (réinjecter des retours KEOS/SFR/ACTIV PARTNERS pertinents).
3. **Étoffer les 5 articles courts à fort enjeu** : `service-client-performance`, `transformation-numerique-entreprise`, `strategies-reseaux-sociaux-entreprises`, `gestion-qualite-certification`, `productivite-professionnelle`.

### 🧹 Sprint 3 (quand le temps le permet)

4. Régler l'anomalie filesystem `formation-equipes-commerciales-complete 2.md`.
5. Arbitrer le sort de `progressive-web-apps-2024` (renommer / supprimer / actualiser).
6. Étoffer les domaines sous-représentés selon l'opportunité éditoriale (Relation Client → matériau prêt pour `developpement-commercial` et `service-client`).

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
