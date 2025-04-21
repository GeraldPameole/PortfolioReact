# Portfolio React

## État d'avancement

### Fait

- ✅ Structure du projet
- ✅ Configuration d'Astro
- ✅ Système de blog
- ✅ Optimisation SEO
- ✅ Gestion des thèmes
- ✅ Navigation entre les vues
- ✅ Documentation des snippets

### En cours

- 🚧 Finalisation des images thématiques
- 🚧 Tests de navigation
- 🚧 Documentation du code

### À faire

- 📝 Ajouter plus d'articles
- 📝 Implémenter le système de recherche
- 📝 Améliorer l'accessibilité
- 📝 Optimiser les performances
- 📝 Ajouter des tests automatisés

## Structure du Projet

```
src/
├── components/     # Composants réutilisables
├── content/        # Contenu (articles, livres)
├── layouts/        # Layouts de page
├── pages/          # Pages de l'application
├── styles/         # Styles CSS
└── utils/          # Utilitaires et helpers
```

## Installation

```bash
# Cloner le projet
git clone https://github.com/votre-username/portfolio-react.git

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## Fonctionnalités

- 🎨 Design moderne et responsive
- 🌙 Mode sombre
- 📱 Optimisé pour mobile
- 🔍 SEO optimisé
- 📚 Système de blog
- 🎯 Navigation intuitive
- 🎨 Gestion des thèmes

## Technologies Utilisées

- Astro
- React
- TypeScript
- Tailwind CSS
- Markdown
- Font Awesome

## Contribution

Les contributions sont les bienvenues ! Consultez le guide de contribution pour plus de détails.

## Licence

MIT

# Portfolio Professionnel - Gérald Paméole

## 🚀 Présentation

Portfolio professionnel développé avec Astro et React, présentant mon parcours, mes compétences et mes réalisations. Le site est conçu pour être performant, accessible et facilement maintenable.

## 🛠️ Technologies Utilisées

- **Astro** - Framework web moderne pour des sites statiques performants
- **React** - Pour les composants interactifs
- **Firebase** - Base de données et backend
- **TypeScript** - Pour un code plus robuste et maintenable
- **Tailwind CSS** - Pour le styling
- **Framer Motion** - Pour les animations

## 📋 Fonctionnalités

- **Page d'Accueil** - Présentation générale et navigation intuitive
- **Parcours Professionnel** - Détail de mes expériences :
  - Développeur React JS
  - Chef de Projet
  - Manager Commercial
  - Formateur
- **Articles** - Blog technique et professionnel avec :
  - Gestion de contenu via Firebase
  - Système de tags
  - Dates de publication
- **Compétences** - Présentation de mes domaines d'expertise :
  - Management Commercial
  - Développement Web
  - Gestion de Projet
  - Marketing Digital
  - Formation
- **Contact** - Formulaire de contact et liens professionnels

## 🏗️ Structure du Projet

```
src/
├── components/     # Composants réutilisables
├── content/        # Contenu statique (articles, expériences)
├── layouts/        # Layouts Astro
├── lib/           # Utilitaires et configuration Firebase
├── pages/         # Pages du site
└── styles/        # Styles globaux
```

## 🚀 Installation

1. Cloner le projet

```bash
git clone https://github.com/GeraldPameole/PortfolioReact.git
```

2. Installer les dépendances

```bash
npm install
```

3. Configurer les variables d'environnement

```bash
cp .env.example .env
# Remplir les variables dans .env
```

4. Lancer le serveur de développement

```bash
npm run dev
```

## 📝 Configuration Firebase

1. Créer un projet sur Firebase Console
2. Configurer Firestore Database
3. Ajouter les variables d'environnement Firebase dans `.env`
4. Configurer les règles de sécurité Firestore

## 🌐 Déploiement

Le site peut être déployé sur diverses plateformes :

- Vercel
- Netlify
- Firebase Hosting

## 🔄 Workflow de Développement

1. Développement sur la branche `main`
2. Tests locaux
3. Push sur GitHub
4. Déploiement automatique

## 📱 Responsive Design

Le site est entièrement responsive avec des breakpoints pour :

- Mobile (< 640px)
- Tablette (640px - 1024px)
- Desktop (> 1024px)

## 🎨 Thème et Personnalisation

- Mode clair/sombre
- Variables CSS personnalisables
- Composants modulaires

## 📈 Performance

- Optimisation des images
- Chargement différé
- Génération statique avec Astro
- Score Lighthouse optimisé

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👤 Contact

Gérald Paméole - [LinkedIn](votre-lien-linkedin) - [GitHub](https://github.com/GeraldPameole)

Développé avec ❤️ par Gérald Paméole

# Système de typage pour le portfolio Astro

Ce document explique comment le système de typage fort a été implémenté dans le projet pour améliorer la robustesse du code.

## Architecture de typage

Le projet utilise trois couches principales pour gérer le typage :

1. **Schémas Zod dans `src/content/config.ts`**

   - Validations de schéma pour les collections Astro
   - Définition des discriminants de type ('article' ou 'book')
   - Types inférés à partir des schémas

2. **Types TypeScript dans `src/types/content.ts`**

   - Interfaces pour les données d'articles et de livres
   - Type guards pour distinguer les articles des livres
   - Types adaptés pour les éléments avec thèmes standardisés

3. **Utilisation dans les composants Astro**
   - Référence aux types appropriés
   - Utilisation des type guards dans les fonctions utilitaires

## Discriminated Unions

Le système repose sur les "discriminated unions" de TypeScript :

```typescript
// Dans config.ts (avec Zod)
const articleSchema = z.object({
  // ...
  type: z.literal("article"),
  // ...
});

const bookSchema = z.object({
  // ...
  type: z.literal("book"),
  // ...
});

// Dans le code, nous pouvons faire :
if (item.data.type === "book") {
  // TypeScript sait que c'est un livre
} else {
  // TypeScript sait que c'est un article
}
```

## Type Guards

Les type guards permettent d'informer TypeScript qu'une variable est d'un type spécifique :

```typescript
// Définition du type guard
export function isBook(item: ContentEntry): item is Book {
  return item.data.type === "book";
}

// Utilisation
if (isBook(item)) {
  // TypeScript sait que item est de type Book
  console.log(item.data.category);
}
```

## Avantages

1. **Sécurité de type** : Détection des erreurs à la compilation plutôt qu'à l'exécution
2. **Autocomplétion améliorée** : L'IDE suggère les propriétés appropriées selon le type
3. **Refactoring sécurisé** : Modification de structure avec vérification de cohérence
4. **Documentation intégrée** : Les types servent de documentation pour les structures de données

## Comment l'utiliser

Pour ajouter un nouvel article ou livre dans les collections :

1. Créez un fichier Markdown dans `src/content/articles/` ou `src/content/books/`
2. Ajoutez le frontmatter approprié avec le champ `type: 'article'` ou `type: 'book'`
3. Les schémas Zod valideront automatiquement les données

Pour développer des fonctionnalités qui travaillent avec les articles et les livres :

1. Importez les types depuis `src/types/content.ts`
2. Utilisez les type guards pour les opérations spécifiques au type
3. Accédez aux propriétés spécifiques au type en toute sécurité

## Maintenance

Pour modifier ou étendre les schémas :

1. Mettez à jour les schémas dans `src/content/config.ts`
2. Mettez à jour les interfaces correspondantes dans `src/types/content.ts`

## Exemples

### Filtrer des articles par thème

```typescript
import type { Article } from "../types/content";
import { isArticle } from "../types/content";

function getArticlesByTheme(items: (Article | Book)[], theme: string) {
  return items
    .filter(isArticle) // TypeScript sait maintenant que ce sont des articles
    .filter((article) => article.data.theme === theme);
}
```

### Accéder aux propriétés spécifiques

```typescript
function getContentDetails(item: Article | Book) {
  if (item.data.type === "book") {
    return `${item.data.title} par ${item.data.author} (${item.data.publishYear})`;
  } else {
    return `${item.data.title} - Temps de lecture: ${item.data.readingTime || "?"} min`;
  }
}
```
