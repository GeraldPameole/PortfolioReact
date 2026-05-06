# Guide de Déploiement - Portfolio React

Ce guide explique comment mettre en ligne votre portfolio Astro sur différentes plateformes.

## 📋 Prérequis

1. **Compte Git** (GitHub, GitLab, ou Bitbucket)
2. **Compte sur une plateforme de déploiement** (Vercel, Netlify, ou autre)
3. **Projet compilé** : `npm run build`

## 🚀 Option 1 : Déploiement sur Vercel (Recommandé)

Vercel est la plateforme recommandée pour les projets Astro.

### Étapes :

1. **Préparer le projet**
   ```bash
   npm run build
   ```

2. **Créer un compte sur Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - S'inscrire avec votre compte GitHub/GitLab

3. **Connecter votre repository**
   - Cliquer sur "New Project"
   - Importer votre repository GitHub/GitLab
   - Vercel détectera automatiquement Astro

4. **Configuration**
   - **Framework Preset** : Astro
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install`

5. **Variables d'environnement** (si nécessaire)
   - Ajouter dans "Environment Variables"

6. **Déployer**
   - Cliquer sur "Deploy"
   - Votre site sera en ligne en quelques minutes !

### Configuration personnalisée (vercel.json)

Créer un fichier `vercel.json` à la racine :

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "astro"
}
```

## 🌐 Option 2 : Déploiement sur Netlify

### Étapes :

1. **Créer un compte sur Netlify**
   - Aller sur [netlify.com](https://netlify.com)
   - S'inscrire avec votre compte GitHub/GitLab

2. **Connecter votre repository**
   - Cliquer sur "Add new site" > "Import an existing project"
   - Connecter votre repository

3. **Configuration**
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - **Base directory** : (laisser vide)

4. **Déployer**
   - Cliquer sur "Deploy site"

### Configuration Netlify (netlify.toml)

Créer un fichier `netlify.toml` à la racine :

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🔧 Option 3 : Déploiement manuel (Serveur VPS)

### Étapes :

1. **Compiler le projet**
   ```bash
   npm run build
   ```

2. **Transférer les fichiers**
   - Utiliser FTP/SFTP pour transférer le dossier `dist/` sur votre serveur
   - Ou utiliser `rsync` :
     ```bash
     rsync -avz dist/ user@votre-serveur.com:/var/www/html/
     ```

3. **Configurer le serveur web**
   - **Nginx** : Configurer pour servir les fichiers statiques
   - **Apache** : Configurer le DocumentRoot vers le dossier dist

### Configuration Nginx

```nginx
server {
    listen 80;
    server_name geraldpameole.fr;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📦 Option 4 : Déploiement sur GitHub Pages

### Étapes :

1. **Installer le plugin Astro pour GitHub Pages**
   ```bash
   npm install --save-dev @astrojs/node
   ```

2. **Modifier astro.config.mjs**
   ```javascript
   export default defineConfig({
     site: 'https://votre-username.github.io',
     base: '/nom-du-repo', // Si votre repo n'est pas à la racine
   });
   ```

3. **Créer un workflow GitHub Actions**
   Créer `.github/workflows/deploy.yml` :
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

## ✅ Vérification post-déploiement

1. **Tester le site**
   - Vérifier que toutes les pages se chargent
   - Tester les liens internes
   - Vérifier les images et assets

2. **Performance**
   - Tester avec [PageSpeed Insights](https://pagespeed.web.dev/)
   - Optimiser si nécessaire

3. **SEO**
   - Vérifier les meta tags
   - Tester avec [Google Search Console](https://search.google.com/search-console)

## 🔄 Déploiement continu

Une fois configuré, chaque push sur votre branche principale déclenchera automatiquement un nouveau déploiement.

## 📝 Notes importantes

- **Domaine personnalisé** : Vous pouvez ajouter votre propre domaine dans les paramètres de la plateforme
- **HTTPS** : Toutes les plateformes modernes fournissent HTTPS automatiquement
- **Variables d'environnement** : Utiliser les variables d'environnement pour les secrets
- **Cache** : Les plateformes gèrent automatiquement le cache pour les performances

## 🆘 Dépannage

### Erreur de build
- Vérifier les logs de build
- S'assurer que toutes les dépendances sont installées
- Vérifier la version de Node.js (recommandé : 18+)

### Pages 404
- Vérifier la configuration des redirections
- S'assurer que le dossier `dist/` contient tous les fichiers

### Problèmes de performance
- Optimiser les images
- Vérifier le bundle size
- Utiliser le lazy loading

## 📚 Ressources

- [Documentation Astro - Déploiement](https://docs.astro.build/en/guides/deploy/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)

