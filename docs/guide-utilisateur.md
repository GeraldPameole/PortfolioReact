# Guide utilisateur (admin)

> Comment **utiliser le site au quotidien** en tant qu'auteur/admin. Pas besoin d'être dev pour la plupart des tâches.

## 1. Publier un nouvel article

### Étape 1 : créer le fichier
```bash
# Choisir le domaine (= sous-dossier) correspondant
src/content/articles/leadership-management/mon-nouveau-titre.md
```

Domaines existants :
- `developpement-web`, `developpement-commercial`
- `formation`, `gestion-projet`, `gestion-talents`
- `gestion-connaissances`, `innovation-technologies`
- `leadership-management`, `marketing-communication`
- `outils-techniques`, `productivite-methodes`
- `qualite-process`, `reconversion-carriere`
- `service-client`, `transformation-digitale`

### Étape 2 : remplir le frontmatter

```markdown
---
title: "Mon titre clair (40-65 caractères)"
description: "Pitch en 1 phrase < 160 caractères, accrocheur et clair."
publishDate: "2026-05-30"
type: article
domain: "leadership-management"
tags: ["management", "performance"]
image: "/images/themes/management.webp"
readingTime: 8
keywords: ["management performance", "OKR"]
---
```

Champs **obligatoires** : `title`, `description`, `publishDate`, `type`.
Image bannière : utilise une existante de `/images/themes/` (couvre déjà 15 thématiques).

### Étape 3 : rédiger le corps

- En Markdown classique (titres, listes, tableaux).
- **H1 implicite** : il est généré automatiquement à partir de `title`. Ne pas mettre de `# Titre` au début du corps.
- Premier titre du corps = `## Introduction` ou directement `## Premier point`.

### Étape 4 : publier
```bash
git add src/content/articles/leadership-management/mon-nouveau-titre.md
git commit -m "feat(article): mon nouveau titre"
git push origin main
```

→ Vercel redéploie (~2 min) → Buttondown détecte le nouvel item RSS → envoi automatique aux abonnés (si RSS-to-email activé côté Buttondown).

### ⚠️ Pièges à éviter
- **Ne PAS mettre de lignes vides à l'intérieur d'un bloc `<svg>` inline** — le parseur Markdown casse au premier saut de ligne et les éléments du SVG (polylines, circles, etc.) sont strippés. Tu peux laisser les commentaires HTML `<!-- … -->` mais pas de ligne vide.
- Ne pas faire de typo dans le frontmatter : le build cassera avec un message Zod explicite.

## 2. Modifier une page statique (Accueil, À propos…)

Ces pages sont dans `src/pages/*.astro`. Tu peux les éditer comme du HTML enrichi, ou demander à un assistant IA de le faire pour toi.

Après modification :
```bash
npm run build         # facultatif : vérifier que ça passe
git commit -am "feat(home): met à jour le pitch"
git push origin main
```

## 3. Gérer la newsletter (Buttondown)

### Première activation (à faire une fois)

1. Connecte-toi sur <https://buttondown.com> (compte `Apex_971`).
2. **Settings → Automations / RSS** :
   - Add new feed → `https://geraldpameole.vercel.app/rss.xml`.
   - Mode : "Send each new item as an email".
   - Schedule : "As soon as new items are detected".
3. **Settings → Emails → Welcome email** : colle le texte ci-dessous.

### Texte du welcome email (à coller dans Buttondown)

**Objet** :
```
Bienvenue 🙏 — et merci pour votre inscription
```

**Corps** (Markdown) :
```markdown
Bonjour,

Merci de vous être inscrit·e — et bienvenue ! 🎉

Chaque semaine, je vous enverrai **un article, sans bruit** : management,
transformation digitale, développement web et productivité. Du concret, tiré
de 20 ans de terrain en télécom, management et formation.

Ce que vous pouvez attendre :

- 📬 **Un email par semaine**, pas plus.
- 🎯 Des idées actionnables, zéro blabla.
- 🔓 Désabonnement en un clic, quand vous voulez.

En attendant le prochain, parcourez les articles déjà publiés :
👉 [geraldpameole.vercel.app/blog](https://geraldpameole.vercel.app/blog)

**📓 Pour aller plus loin — Les Carnets du P**

J'écris aussi sur un blog dédié, **[Les Carnets du P](https://lescarnetsdup.vercel.app/)** :
56 articles pratiques et testés sur le terrain, pensés pour les PME, startups
et dirigeants. Si vous voulez creuser ces sujets, c'est par ici :
👉 [lescarnetsdup.vercel.app](https://lescarnetsdup.vercel.app/)

Une question, une réaction, ou un sujet que vous aimeriez voir traité ?
**Répondez simplement à cet email** — je lis tout, et je réponds.

À très vite,

**Gérald Paméole**
*Pilote d'activité & Expert en digitalisation*
[geraldpameole.vercel.app](https://geraldpameole.vercel.app/)
```

### Au quotidien

- **Vérifier les nouveaux abonnés** : Dashboard Buttondown → Subscribers.
- **Voir les envois passés** : Emails → Sent.
- **Modifier le welcome email** : Settings → Emails → Welcome email.
- **Désabonnements** : automatiques côté Buttondown (lien dans chaque email).

### Si un envoi ne part pas
1. Vérifier que l'article est bien publié (visible dans `/rss.xml`).
2. Vérifier que l'automation RSS est active.
3. Si problème persistant → contact support Buttondown.

## 4. Gérer le formulaire de contact (Formspree)

- Compte : Formspree, form ID `mgvklqra`.
- Les messages arrivent dans la boîte email associée + dashboard Formspree.
- Free tier : 50 soumissions/mois (newsletter + contact partagent ce quota si le même form est utilisé, ce qui n'est PAS le cas ici).

## 5. Mesurer le trafic (Plausible)

- Dashboard : <https://plausible.io/geraldpameole.vercel.app>.
- Données utiles : pages vues, top pages, sources de trafic, durée moyenne.
- **Sans cookies** → conforme RGPD sans bannière.

## 6. Télécharger / consulter le CV

- Page : `/cv` (consultation).
- Version impression / PDF : `/cv?print=1` → `Cmd+P` (Mac) ou `Ctrl+P` (Windows) → **Enregistrer au format PDF**.
- Pour mettre à jour le contenu du CV : éditer `src/pages/cv.astro` (ou les données associées).

## 7. Ajouter un livre / projet

Même principe que les articles, dans la collection correspondante :
- **Livres** : `src/content/books/<slug>.md` avec frontmatter respectant le schéma `books` (`type: "book"`, `author`, `profession` obligatoires).
- **Projets** : (varie selon l'organisation) — voir `src/content/work/`.

## 8. Sauvegarde

- Le code est sur GitHub → c'est ta sauvegarde principale.
- Vercel garde l'historique des déploiements.
- Buttondown garde la liste d'abonnés.
- Plausible garde les analytics.

Pour une **sauvegarde locale complète** :
```bash
git clone https://github.com/GeraldPameole/PortfolioReact.git
# OU pull si déjà cloné :
git pull origin main
```

Voir `docs/sauvegarde-restauration.md` pour plus de détail.

## 9. En cas de problème

1. **Le site ne s'affiche pas** → check Vercel (dashboard / status page).
2. **Le build a cassé** → check email Vercel (logs détaillés) ; tester `npm run build` localement.
3. **Un article ne s'affiche pas correctement** → vérifier frontmatter + SVG inline (cf. § 1).
4. **Inscription newsletter cassée** → tester en navigation privée + vérifier console F12.

Pour aller plus loin : `docs/documentation-technique.md`.
