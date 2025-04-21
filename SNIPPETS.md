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

## 31. Transitions de Page avec Framer Motion

```tsx
// src/components/PageTransition.tsx
import { motion } from "framer-motion";

export const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);
```

- Animation de transition entre les pages
- Effets d'entrée et de sortie personnalisés

## 32. Animation de Défilement avec Intersection Observer

```javascript
// Animation des éléments au scroll
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("opacity-100");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".grid > *").forEach((element) => {
    element.classList.add(
      "opacity-0",
      "translate-y-8",
      "transition-all",
      "duration-700"
    );
    observer.observe(element);
  });
});
```

- Détection des éléments visibles dans le viewport
- Animation séquentielle des éléments

## 33. Gestion du Thème Clair/Sombre

```tsx
// src/components/Navbar.tsx
const handleThemeToggle = () => {
  const newTheme = theme === "light" ? "dark" : "light";
  if (typeof window !== "undefined") {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  }
  setTheme(newTheme);
};
```

- Bascule entre thème clair et sombre
- Persistance du choix dans localStorage

## 34. Animation de Texte avec Gradient

```astro
<h2 class="animate-text-gradient bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white background-animate">
  Titre avec gradient animé
</h2>

<style>
  .animate-text-gradient {
    background-size: 200% 200%;
  }

  .background-animate {
    animation: gradient 8s ease infinite;
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
</style>
```

- Texte avec dégradé animé
- Animation d'arrière-plan fluide

## 35. Effets de Survol Interactifs

```html
<a
  href="/contact"
  class="inline-block bg-white text-indigo-600 px-6 py-3 rounded-md font-semibold shadow-md hover:bg-indigo-50 transition-colors duration-300"
>
  Me contacter
</a>
```

- Transitions douces au survol
- Retour visuel pour l'interaction utilisateur

## 36. Animations CSS pour les Cartes et Grilles

```css
/* Optimisations pour les animations */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
  animation-fill-mode: both;
  will-change: opacity, transform;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- Animations optimisées pour les performances
- Effets de transition fluides

## 37. Accessibilité des Animations

```css
/* Optimisations pour les appareils à basse consommation */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- Respect des préférences utilisateur
- Conformité aux directives d'accessibilité

## 38. Effets Décoratifs en Arrière-Plan

```html
<div class="absolute inset-0 z-0 opacity-20">
  <!-- Cercles décoratifs -->
  <div
    class="absolute bg-white/10 w-40 h-40 rounded-full -top-10 -left-10"
  ></div>
  <div
    class="absolute bg-white/10 w-60 h-60 rounded-full -bottom-20 -right-20"
  ></div>

  <!-- Grille décorative -->
  <div class="grid grid-cols-12 grid-rows-6 gap-1 h-full w-full">
    {Array.from({ length: 12 * 6 }).map((_, i) => (
    <div class="bg-white/5 rounded"></div>
    ))}
  </div>
</div>
```

- Éléments visuels en arrière-plan
- Création d'effets de profondeur

## 39. Optimisation des Ressources Chargées

```javascript
// Utilisation de l'Intersection Observer pour le chargement paresseux
document.querySelectorAll("img[data-src]").forEach((img) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });
  observer.observe(img);
});
```

- Chargement paresseux des images
- Amélioration des performances de page

## 40. Composants Astro pour les Call-to-Action

```astro
<!-- CallToAction.astro -->
<div class={`cta-container ${backgroundColor} ${animate ? 'animate-pulse-slow' : ''} rounded-2xl overflow-hidden relative`}>
  <!-- Cercles décoratifs en arrière-plan -->
  <div class="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
  <div class="absolute -bottom-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

  <div class="relative z-10 p-8 md:p-12 flex flex-col items-center text-center">
    <!-- Titre animé avec gradient -->
    {title && (
      <h2 class={`text-2xl md:text-3xl font-bold ${textColor} mb-4 ${animate ? 'animate-text-gradient bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white background-animate' : ''}`}>
        {title}
      </h2>
    )}

    <!-- Description -->
    {description && (
      <p class={`${textColor} text-lg opacity-90 max-w-2xl mb-8`}>
        {description}
      </p>
    )}

    <!-- Bouton avec effet de survol -->
    <a
      href={buttonLink}
      class={`group inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${selectedButtonStyle}`}
    >
      <span>{buttonText}</span>
      <span class="inline-block group-hover:translate-x-1 transition-transform duration-300" set:html={selectedIcon} />
    </a>
  </div>
</div>
```

- Composant réutilisable pour les appels à l'action
- Animations et effets visuels intégrés

---

# Actions Restantes et Problèmes à Résoudre

## 1. Erreur PostCSS ViewTransitions

Une erreur a été identifiée dans le fichier `src/layouts/BaseLayout.astro` concernant l'importation de ViewTransitions :

```
error [postcss] /Users/geraldpameole/Desktop/portfolio2025/PortfolioReact/src/layouts/BaseLayout.astro?astro&type=style&index=0&lang.css:5:10: Unknown word ViewTransitions
```

### Solution proposée :

- Vérifier que l'importation de ViewTransitions est placée dans la section frontmatter (entre les tirets `---`) et non dans la section style
- S'assurer que le package `astro:transitions` est correctement installé
- Mettre à jour la version d'Astro si nécessaire

## 2. Ressources Manquantes

Plusieurs 404 sont signalés dans les logs pour des ressources manquantes :

```
[serve] 404 /assets/web-developer.jpg
[serve] 404 /assets/projectmanagersuit.jpg
```

### Solution proposée :

- Vérifier le chemin des images dans les composants et pages
- Ajouter les images manquantes au répertoire approprié
- Implémenter des images de fallback pour éviter les erreurs 404

## 3. Routes Dynamiques Non Trouvées

Des routes dynamiques semblent ne pas trouver les pages correspondantes :

```
[getStaticPaths] A `getStaticPaths()` route pattern was matched, but no matching static path was found for requested path `/blog/books/deep-work`.
```

### Solution proposée :

- Vérifier la fonction `getStaticPaths()` dans les fichiers concernés
- S'assurer que les collections sont correctement définies et générées
- Implémenter une page 404 personnalisée pour améliorer l'expérience utilisateur

## 4. Optimisations de Performance

### Actions recommandées :

- Implémenter le lazy loading pour toutes les images
- Optimiser les animations pour les appareils à faible puissance
- Réduire la taille des bundles JavaScript
- Mettre en place une stratégie de mise en cache pour les ressources statiques

## 5. Amélioration de l'Accessibilité

### Actions recommandées :

- Ajouter des attributs `alt` descriptifs à toutes les images
- S'assurer que les contrastes de couleur respectent les normes WCAG
- Implémenter une navigation au clavier complète
- Tester avec des lecteurs d'écran

## 6. Organisation du Code

### Actions recommandées :

- Factoriser les composants réutilisables
- Standardiser la gestion des thèmes et couleurs
- Documenter les composants complexes
- Créer une bibliothèque de composants pour faciliter la maintenance
