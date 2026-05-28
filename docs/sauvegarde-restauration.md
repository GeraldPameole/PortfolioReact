# Sauvegarde & restauration

> Stratégie de sauvegarde et procédures de restauration. Court par design : la nature du site (statique + git + services managés) simplifie tout.

## Principe : 3 niveaux de sauvegarde

| Donnée | Sauvegardée où | Risque de perte |
|---|---|---|
| **Code source + contenu** | GitHub (`GeraldPameole/PortfolioReact`) | Très faible (GitHub redondant) |
| **Site déployé** | Vercel (build préservé pendant ~30 jours par déploiement) | Faible — rollback en 1 clic |
| **Liste des abonnés newsletter** | Buttondown (compte `Apex_971`) | Faible — données chez Buttondown |
| **Messages contact** | Formspree (compte `mgvklqra`) + boîte email | Faible — double archivage |
| **Analytics** | Plausible (compte Gérald) | Reproductibles (mais historique perdu si compte fermé) |

## Sauvegarde locale recommandée (mensuelle)

```bash
# Mettre à jour la copie locale
cd ~/chemin/vers/PortfolioReact
git pull origin main

# Vérifier que tout est bien synchronisé
git status     # devrait dire "nothing to commit, working tree clean"

# (Optionnel) faire une archive datée
cd ..
tar -czf PortfolioReact-backup-$(date +%Y-%m-%d).tar.gz PortfolioReact/
```

## Export des abonnés newsletter (recommandé trimestriel)

1. Buttondown → **Subscribers** → bouton **Export** (CSV).
2. Stocker dans un dossier sécurisé (Dropbox, Google Drive, disque externe chiffré).
3. Permet de migrer vers un autre outil si besoin sans perte.

## Restauration — scénarios

### Scénario A : régression sur un déploiement
1. Vercel → **Deployments** → choisir un déploiement antérieur (vert) → **Promote to Production**.
2. Temps de retour à la normale : ~30 s.

### Scénario B : commit cassé sur `main`
```bash
# Annuler en revert (préserve l'historique, recommandé)
git revert <sha-du-commit-fautif>
git push origin main

# OU dans les cas extrêmes : reset hard (déconseillé sauf cas avéré)
git reset --hard <sha-du-bon-commit>
git push origin main --force-with-lease
```

### Scénario C : compte GitHub compromis
1. Cloner depuis la sauvegarde locale ou l'archive `.tar.gz`.
2. Créer un nouveau repo GitHub.
3. Reconfigurer le remote :
   ```bash
   git remote set-url origin <nouveau-repo>
   git push -u origin main
   ```
4. Reconnecter Vercel au nouveau repo (Project Settings → Git).

### Scénario D : compte Vercel fermé / migration d'hébergeur
Le site étant 100 % statique :
1. `npm run build` → contenu du `dist/`.
2. Uploader `dist/` sur n'importe quel hébergeur statique (Cloudflare Pages, Netlify, GitHub Pages, S3, OVH…).
3. Reconfigurer le DNS si domaine custom.

### Scénario E : perte de la liste d'abonnés Buttondown
Si export régulier (cf. plus haut) :
1. Créer un nouveau compte chez un autre service (MailerLite, Mailchimp…).
2. Importer le CSV.
3. Re-câbler le formulaire dans `src/components/NewsletterBand.astro` et `Footer.astro` (endpoint + tag).
4. Communiquer le changement aux abonnés.

Si pas d'export : les abonnés sont perdus en cas de fermeture brutale → **prendre l'habitude de l'export trimestriel**.

## Tests de restauration (suggéré annuel)

1. Restaurer localement depuis l'archive `.tar.gz`.
2. Vérifier `npm install && npm run build` sans erreur.
3. Tester le formulaire newsletter avec un email jetable (mailinator).
4. Vérifier que les pages s'affichent (avec `npm run preview`).
5. Cocher la procédure dans `CHANGELOG.md`.

## Inventaire des accès critiques

| Service | Identifiant | Récupération mot de passe |
|---|---|---|
| GitHub | `GeraldPameole` | email + 2FA |
| Vercel | (connecté via GitHub OAuth) | via GitHub |
| Buttondown | `Apex_971` | email |
| Formspree | (compte associé) | email |
| Plausible | (compte associé) | email |
| Google Fonts | n/a (pas de compte requis) | - |

→ **Garder ces accès dans un gestionnaire de mots de passe** (1Password, Bitwarden…) avec 2FA activé partout où possible.

## Plan B en cas de panne majeure

- **Vercel down** : peu probable, mais le site peut être déployé en ~5 min sur Netlify/Cloudflare Pages depuis le repo GitHub (cf. scénario D).
- **Buttondown down** : l'inscription échouera silencieusement (réponse `no-cors` masque l'erreur). Surveillance manuelle (test mensuel) recommandée.
- **Formspree down** : afficher un fallback `mailto:` est une bonne pratique (à ajouter, cf. `backlog.md` éventuellement).
