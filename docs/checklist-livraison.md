# Checklist de livraison / mise en production

> À cocher mentalement (ou pour de bon) à chaque déploiement majeur ou refonte. État au **28 mai 2026**.

## 🟢 Infra & déploiement

- [x] Site déployé et accessible sur `geraldpameole.vercel.app`
- [x] HTTPS activé (Vercel par défaut)
- [x] Auto-deploy sur push `main` configuré
- [x] Cache immutable sur `/_astro/*` (`max-age=31536000`)
- [x] Brotli activé (Vercel par défaut)
- [ ] **Domaine custom branché** (en attente de décision : `.fr` ou autre)
- [ ] **Procédures de rollback testées** (oui en théorie, jamais testé en vrai)

## 🟢 Performance

- [x] Lighthouse Desktop ≥ 75 (78 mesuré, GPU réel)
- [x] FCP < 1.5s (0,3s)
- [x] LCP < 2.5s (0,6s)
- [x] CLS < 0,1 (0,006)
- [x] Render-blocking = 0
- [x] Polices Google non bloquantes
- [x] Three.js hors chemin critique (lazy + idle + paused offscreen + 30fps)
- [x] Images recompressées (≤1280px, WebP/JPG q72-74)
- [x] Lazy-loading sur images de grille, eager + fetchpriority="high" sur LCP

## 🟢 Accessibilité (WCAG AA)

- [x] Contraste tous tokens texte ≥ 4.5:1
- [x] Ordres de titres séquentiels sur toutes les pages
- [x] `prefers-reduced-motion` respecté (WebGL désactivé)
- [x] `alt` sur les images, `aria-label` sur boutons icônes
- [x] Lighthouse A11y ≥ 90 (93 mesuré)
- [ ] **Score A11y = 100** (audit complet à finir : labels formulaires, focus visibles partout)

## 🟢 SEO

- [x] Sitemap auto-généré + référencé dans `robots.txt`
- [x] Canonical URL sur chaque page
- [x] Open Graph + Twitter Card
- [x] JSON-LD Person sur toutes les pages
- [x] Frontmatter : `title` 40-65 car, `description` 120-160 car
- [x] Flux RSS enrichi (`/rss.xml`)
- [x] Lighthouse SEO = 100

## 🟢 Sécurité

- [x] Pas de secret dans le repo
- [x] HTTPS forcé
- [x] Dépendances : `npm audit` propre au dernier check
- [x] Lighthouse Best Practices = 100
- [ ] **CSP headers configurés** (à ajouter — voir `backlog.md`)

## 🟢 Contenu

- [x] 95 articles publiés
- [x] Schémas Zod validés (build passe)
- [x] Pas de placeholder oublié (sauf cas signalés au backlog)
- [x] Images de thèmes optimisées
- [x] Mentions légales présentes et exactes

## 🟢 Newsletter

- [x] Formulaire d'inscription présent (home + `/blog` + footer)
- [x] Branché sur Buttondown (`Apex_971`)
- [x] Validation native d'email
- [x] Feedback visuel à l'inscription
- [ ] **Welcome email configuré côté Buttondown** (texte prêt dans `guide-utilisateur.md`)
- [ ] **Automation RSS-to-email activée côté Buttondown**
- [ ] **Test inscription bout-en-bout** (auteur inscrit son email perso → reçoit le welcome → publie un article test → reçoit l'email)

## 🟢 Contact

- [x] Formulaire `/contact` opérationnel (Formspree `mgvklqra`)
- [x] Email + LinkedIn affichés en footer + page contact

## 🟢 Analytics

- [x] Plausible script intégré (`data-domain=geraldpameole.vercel.app`)
- [ ] **Site enregistré dans le compte Plausible** sous le nom exact `geraldpameole.vercel.app` (sinon pas de données)

## 🟢 Qualité du code

- [x] `npm run build` réussit
- [x] `npm test` = 0 erreur
- [x] `npm run lint` ≤ baseline (6 erreurs cosmétiques pré-existantes — non bloquantes)
- [x] `CLAUDE.md` à jour
- [x] `docs/` documenté

## 🟢 Documentation

- [x] Cahier des charges fonctionnel
- [x] Cahier des charges technique
- [x] Arborescence
- [x] Charte graphique
- [x] Charte éditoriale
- [x] Backlog produit
- [x] User stories
- [x] Changelog
- [x] Documentation technique
- [x] Guide utilisateur
- [x] Checklist de livraison (ce document)
- [x] Sauvegarde / restauration
- [x] Index `docs/README.md`

## 🔴 Avant de pouvoir dire "100 % livré"

Trois actions hors-code, à faire **par l'auteur** :

1. **Buttondown** — activer l'automation RSS-to-email + coller le welcome email + tester bout-en-bout. (Voir `guide-utilisateur.md`.)
2. **Plausible** — enregistrer/renommer le site sur `geraldpameole.vercel.app`.
3. **Domaine final** — décider (vercel.app vs `.fr` vs autre) ; si custom : ajouter dans Vercel + DNS, je rebascule le code en 1 commande.

---

**Verdict général** : le site est **techniquement livré** et fonctionnel. Reste les 3 actions externes ci-dessus pour le « 100 % en service ».
