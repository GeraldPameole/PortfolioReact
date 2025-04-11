# Snippets de Code - Fonctionnalités Principales

## 1. Gestion des Collections

```typescript
const articles = await getCollection("articles");
const books = await getCollection("books");
```

- Récupération des collections d'articles et de livres
- Utilisation de l'API Astro pour accéder au contenu

## 2. Tri des Articles

```typescript
const sortedArticles = articles.sort(
  (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
);
```

- Tri des articles par date de publication
- Utilisation de `getTime()` pour la comparaison des dates

## 3. Tri des Livres

```typescript
const sortedBooks = books.sort(
  (a, b) => (b.data.publishYear || 0) - (a.data.publishYear || 0)
);
```

- Tri des livres par année de publication
- Gestion des valeurs nulles avec l'opérateur `||`

## 4. Définition des Thèmes Standardisés

```typescript
const standardThemes = {
  "developpement-web": {
    icon: "💻",
    image: "/images/themes/dev-web.jpg",
    description: "Technologies et techniques de développement web",
    color: "from-emerald-500 to-teal-600",
    altImage: "https://images.unsplash.com/...",
  },
};
```

- Configuration des thèmes avec leurs propriétés
- Association d'icônes, images et couleurs

## 5. Mapping des Thèmes

```typescript
function mapToStandardTheme(originalTheme) {
  const themeMapping = {
    JavaScript: "developpement-web",
    React: "developpement-web",
    // ...
  };
  return themeMapping[originalTheme] || "carriere";
}
```

- Conversion des thèmes spécifiques en thèmes standardisés
- Gestion des cas par défaut

## 6. Regroupement des Articles par Thème

```typescript
const articlesByTheme = sortedArticles.reduce((acc, article) => {
  const originalTheme =
    article.data.theme ||
    (article.data.tags && article.data.tags.length > 0
      ? article.data.tags[0]
      : "Non classé");
  const standardTheme = mapToStandardTheme(originalTheme);
  // ...
}, {});
```

- Organisation des articles par catégorie
- Gestion des thèmes par défaut

## 7. Regroupement des Livres par Thème

```typescript
const booksByTheme = sortedBooks.reduce((acc, book) => {
  const originalTheme = book.data.category || "Littérature générale";
  const standardTheme = mapToStandardTheme(originalTheme);
  // ...
}, {});
```

- Organisation des livres par catégorie
- Utilisation de catégories prédéfinies

## 8. Recherche de Contenu Similaire

```typescript
function findSimilarContent(item, isBook = false, maxItems = 3) {
  const standardTheme =
    item.standardTheme ||
    (isBook
      ? mapToStandardTheme(item.data.category)
      : mapToStandardTheme(item.data.theme));
  // ...
}
```

- Identification de contenu lié
- Limitation du nombre de résultats

## 9. Génération de Compétences

```typescript
function generateSkills(item, isBook = false): string[] {
  const skills: string[] = [];
  if (isBook) {
    if (item.data.topic) skills.push(`Expertise en ${item.data.topic}`);
    // ...
  } else {
    if (item.data.tags) {
      item.data.tags.forEach((tag: string) => {
        const skill = `Maîtrise de ${tag}`;
        if (!skills.includes(skill)) skills.push(skill);
      });
    }
  }
  return skills.slice(0, 4);
}
```

- Création de tags de compétences
- Gestion différenciée articles/livres

## 10. Formatage des Dates

```typescript
function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
```

- Affichage des dates en français
- Formatage personnalisé

## 11. Génération d'URL de Partage

```typescript
function getShareUrl(title: string, url: string) {
  const baseUrl = import.meta.env.SITE || "https://votre-site.com";
  const fullUrl = `${baseUrl}${url}`;
  return encodeURIComponent(`${title} ${fullUrl}`);
}
```

- Création d'URLs pour le partage social
- Encodage des paramètres

## 12. Affichage des Cartes de Thème

```typescript
{Object.entries(standardThemes).map(([themeName, theme]) => (
    <a href={`#theme-${themeName}`} class="group block">
        <div class={`h-full bg-gradient-to-br ${theme.color} ...`}>
            // ...
        </div>
    </a>
))}
```

- Création de cartes interactives
- Utilisation de gradients

## 13. Gestion des Images d'Article

```typescript
{article.data.image ? (
    <img src={article.data.image} ... />
) : (
    <div class="relative w-full h-48">
        <img src={theme.image} ... />
        <div class="absolute inset-0 bg-gradient-to-t ..." />
    </div>
)}
```

- Affichage conditionnel des images
- Fallback sur les images thématiques

## 14. Affichage des Tags

```typescript
<div class="flex flex-wrap gap-2">
    {skills.map(skill => (
        <span class="inline-block bg-blue-100 ...">
            {skill}
        </span>
    ))}
</div>
```

- Présentation des compétences
- Style des badges

## 15. Partage Social

```typescript
<div class="flex gap-2">
    <a href={`https://twitter.com/intent/tweet?text=${getShareUrl(...)}`} ...>
        <svg ... />
    </a>
    // ...
</div>
```

- Intégration des boutons de partage
- Support de plusieurs réseaux

## 16. Navigation par Thème

```typescript
<section id={`theme-${themeName}`} class="mb-24 scroll-mt-24">
    // ...
</section>
```

- Création d'ancres pour la navigation
- Espacement des sections

## 17. Affichage des Métadonnées

```typescript
<meta itemprop="datePublished" content={article.data.publishDate.toISOString()} />
<span itemprop="author" itemscope itemtype="https://schema.org/Person">
    <span itemprop="name">{article.data.author}</span>
</span>
```

- Intégration des microdonnées
- Support du SEO

## 18. Gestion du Mode Sombre

```typescript
class="text-gray-600 dark:text-gray-300"
class="bg-white dark:bg-gray-800"
```

- Support du thème sombre
- Classes conditionnelles

## 19. Mise en Page Responsive

```typescript
class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

- Grille adaptative
- Breakpoints multiples

## 20. Animations et Transitions

```typescript
class="transform transition-all duration-300 hover:scale-105"
```

- Effets de survol
- Transitions fluides

## 21. Gestion des Erreurs

```typescript
const originalTheme =
  article.data.theme ||
  (article.data.tags && article.data.tags.length > 0
    ? article.data.tags[0]
    : "Non classé");
```

- Fallbacks pour les données manquantes
- Valeurs par défaut

## 22. Optimisation des Images

```typescript
loading="lazy"
class="object-cover"
```

- Chargement différé
- Ajustement des images

## 23. Accessibilité

```typescript
aria-label="Partager sur Twitter"
<span class="sr-only">Retour en haut</span>
```

- Support des lecteurs d'écran
- Textes alternatifs

## 24. Gestion des États

```typescript
const [themeName, theme] = Object.entries(standardThemes)[0];
```

- Déstructuration des objets
- Manipulation des états

## 25. Filtrage des Données

```typescript
.filter(content => content.slug !== item.slug)
.slice(0, maxItems)
```

- Exclusion des éléments actuels
- Limitation des résultats

## 26. Formatage du Texte

```typescript
{
  themeName.charAt(0).toUpperCase() + themeName.slice(1);
}
```

- Capitalisation
- Manipulation de chaînes

## 27. Gestion des URLs

```typescript
href={`/articles/${article.slug}`}
```

- Construction dynamique d'URLs
- Routes paramétrées

## 28. Styles Conditionnels

```typescript
class={`h-full bg-gradient-to-br ${theme.color}`}
```

- Classes dynamiques
- Combinaison de styles

## 29. Gestion des Collections

```typescript
const allThemes = [
  ...new Set([...Object.keys(articlesByTheme), ...Object.keys(booksByTheme)]),
];
```

- Union d'ensembles
- Élimination des doublons

## 30. Tri et Organisation

```typescript
.sort((a, b) => b.totalCount - a.totalCount)
```

- Tri par nombre d'éléments
- Organisation des données
