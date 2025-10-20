# Snippets de Code - Fonctionnalités Principales

## 1. Gestion des Collections

```typescript
const articles = await getCollection("articles");
const books = await getCollection("books");
```

- Récupération des collections d'articles et de livres
- Utilisation de l'API Astro pour accéder au contenu

## 2. Tri des Articles (Version Améliorée)

```typescript
// Version actuelle
const sortedArticles = articles.sort(
  (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
);

// Version améliorée avec gestion d'erreurs
const sortedArticles = articles
  .filter((article) => article.data.publishDate) // Filtre les articles sans date
  .sort((a, b) => {
    const dateA = new Date(a.data.publishDate);
    const dateB = new Date(b.data.publishDate);
    return dateB.getTime() - dateA.getTime();
  });
```

- Tri des articles par date de publication
- Filtrage des articles sans date valide
- Gestion d'erreurs robuste

## 3. Tri des Livres

```typescript
const sortedBooks = books.sort(
  (a, b) => (b.data.publishYear || 0) - (a.data.publishYear || 0)
);
```

- Tri des livres par année de publication
- Gestion des valeurs nulles avec l'opérateur `||`

## 4. Définition des Thèmes Standardisés (Version Améliorée)

```typescript
// Version actuelle
const standardThemes = {
  "developpement-web": {
    icon: "💻",
    image: "/images/themes/dev-web.jpg",
    description: "Technologies et techniques de développement web",
    color: "from-emerald-500 to-teal-600",
    altImage: "https://images.unsplash.com/...",
  },
};

// Version améliorée avec validation et fallbacks
const standardThemes = {
  "developpement-web": {
    icon: "💻",
    image: "/images/themes/dev-web.jpg",
    description: "Technologies et techniques de développement web",
    color: "from-emerald-500 to-teal-600",
    altImage: "https://images.unsplash.com/...",
    keywords: ["javascript", "react", "vue", "angular", "nodejs"],
    fallbackColor: "#10B981",
  },
  "gestion-projet": {
    icon: "📋",
    image: "/images/themes/project-mgmt.jpg",
    description: "Gestion de projet et leadership",
    color: "from-blue-500 to-indigo-600",
    altImage: "https://images.unsplash.com/...",
    keywords: ["agile", "scrum", "management", "leadership"],
    fallbackColor: "#3B82F6",
  },
  // ... autres thèmes
};
```

- Configuration des thèmes avec leurs propriétés
- Association d'icônes, images et couleurs
- Mots-clés pour la recherche intelligente
- Couleurs de fallback pour la robustesse

## 5. Mapping des Thèmes (Version Améliorée)

```typescript
// Version actuelle
function mapToStandardTheme(originalTheme) {
  const themeMapping = {
    JavaScript: "developpement-web",
    React: "developpement-web",
    // ...
  };
  return themeMapping[originalTheme] || "carriere";
}

// Version améliorée avec validation et fallbacks
function mapToStandardTheme(originalTheme: string): string {
  if (!originalTheme) return "carriere";

  const normalizedTheme = originalTheme.toLowerCase().trim();
  const themeMapping = {
    javascript: "developpement-web",
    react: "developpement-web",
    vue: "developpement-web",
    angular: "developpement-web",
    nodejs: "developpement-web",
    typescript: "developpement-web",
    html: "developpement-web",
    css: "developpement-web",
    agile: "gestion-projet",
    scrum: "gestion-projet",
    management: "gestion-projet",
    leadership: "gestion-projet",
    projet: "gestion-projet",
    formation: "formation-coaching",
    coaching: "formation-coaching",
    pedagogie: "formation-coaching",
    qualite: "qualite-process",
    iso: "qualite-process",
    processus: "qualite-process",
    commercial: "developpement-commercial",
    vente: "developpement-commercial",
    marketing: "developpement-commercial",
  };

  return themeMapping[normalizedTheme] || "carriere";
}
```

- Conversion des thèmes spécifiques en thèmes standardisés
- Normalisation des entrées (minuscules, trim)
- Gestion des cas par défaut robuste
- Mapping étendu pour plus de précision

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

## 8. Recherche de Contenu Similaire (Version Améliorée)

```typescript
// Version actuelle
function findSimilarContent(item, isBook = false, maxItems = 3) {
  const standardTheme =
    item.standardTheme ||
    (isBook
      ? mapToStandardTheme(item.data.category)
      : mapToStandardTheme(item.data.theme));
  // ...
}

// Version améliorée avec scoring et cache
const similarContentCache = new Map();

function findSimilarContent(item, isBook = false, maxItems = 3) {
  const cacheKey = `${item.slug}-${isBook}`;
  if (similarContentCache.has(cacheKey)) {
    return similarContentCache.get(cacheKey);
  }

  const standardTheme =
    item.standardTheme ||
    (isBook
      ? mapToStandardTheme(item.data.category)
      : mapToStandardTheme(item.data.theme));

  const similar = allContent
    .filter((content) => {
      if (content.slug === item.slug) return false;
      const contentTheme = isBook
        ? mapToStandardTheme(content.data.category)
        : mapToStandardTheme(content.data.theme);
      return contentTheme === standardTheme;
    })
    .sort((a, b) => {
      // Scoring basé sur les tags communs
      const scoreA = calculateSimilarityScore(item, a);
      const scoreB = calculateSimilarityScore(item, b);
      return scoreB - scoreA;
    })
    .slice(0, maxItems);

  similarContentCache.set(cacheKey, similar);
  return similar;
}

function calculateSimilarityScore(item1, item2) {
  const tags1 = item1.data.tags || [];
  const tags2 = item2.data.tags || [];
  const commonTags = tags1.filter((tag) => tags2.includes(tag));
  return commonTags.length;
}
```

- Identification de contenu lié avec scoring intelligent
- Cache pour améliorer les performances
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

---

# Nouvelles Fonctionnalités - Effets 3D et Animations Avancées

## 41. Effet Cube 3D avec CSS Transform

```astro
<!-- Cube 3D avec CSS et JavaScript -->
<div class="cube-container">
  <div class="cube" id="competence-cube">
    <!-- Face 1 - Gestion de Projet -->
    <div class="cube-face front" data-domain="gestion-projet">
      <div class="face-content">
        <i class="fas fa-tasks text-4xl mb-4"></i>
        <h3>Gestion de Projet</h3>
      </div>
    </div>

    <!-- Face 2 - Développement Web -->
    <div class="cube-face back" data-domain="developpement-web">
      <div class="face-content">
        <i class="fas fa-laptop-code text-4xl mb-4"></i>
        <h3>Développement Web</h3>
      </div>
    </div>

    <!-- Autres faces... -->
  </div>
</div>

<style>
.cube-container {
  perspective: 1000px;
  perspective-origin: center center;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cube {
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
  cursor: pointer;
}

.cube-face {
  position: absolute;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.cube-face.front { transform: rotateY(0deg) translateZ(100px); }
.cube-face.back { transform: rotateY(180deg) translateZ(100px); }
.cube-face.right { transform: rotateY(90deg) translateZ(100px); }
.cube-face.left { transform: rotateY(-90deg) translateZ(100px); }
.cube-face.top { transform: rotateX(90deg) translateZ(100px); }
.cube-face.bottom { transform: rotateX(-90deg) translateZ(100px); }

.cube:hover {
  transform: rotateX(-10deg) rotateY(10deg);
}

/* Animation de rotation automatique */
@keyframes autoRotate {
  0% { transform: rotateX(0deg) rotateY(0deg); }
  25% { transform: rotateX(0deg) rotateY(90deg); }
  50% { transform: rotateX(0deg) rotateY(180deg); }
  75% { transform: rotateX(0deg) rotateY(270deg); }
  100% { transform: rotateX(0deg) rotateY(360deg); }
}

.cube.auto-rotate {
  animation: autoRotate 20s infinite linear;
}
</style>

<script>
let currentRotation = { x: 0, y: 0 };
let isAutoRotating = true;
let autoRotateInterval;

const cube = document.getElementById('competence-cube');

// Rotation automatique
function startAutoRotation() {
  autoRotateInterval = setInterval(() => {
    if (isAutoRotating) {
      currentRotation.y += 1;
      cube.style.transform = `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`;
    }
  }, 50);
}

// Gestion des clics
cube.addEventListener('click', (e) => {
  const face = e.target.closest('.cube-face');
  if (face && face.dataset.domain) {
    isAutoRotating = false;
    clearInterval(autoRotateInterval);

    // Animation vers la face sélectionnée
    const domain = face.dataset.domain;
    rotateToFace(domain);

    // Redirection après animation
    setTimeout(() => {
      window.location.href = `/skills#${domain}`;
    }, 1000);
  }
});

function rotateToFace(domain) {
  const rotations = {
    'gestion-projet': { x: 0, y: 0 },
    'developpement-web': { x: 0, y: 180 },
    'qualite-process': { x: 0, y: 90 },
    'formation': { x: 0, y: -90 },
    'commercial': { x: 90, y: 0 }
  };

  const target = rotations[domain];
  if (target) {
    cube.style.transform = `rotateX(${target.x}deg) rotateY(${target.y}deg)`;
  }
}

// Démarrer la rotation automatique
startAutoRotation();
</script>
```

- Effet cube 3D interactif pour les compétences
- Rotation automatique avec pause au survol
- Navigation par clic vers les sections correspondantes
- Animations fluides avec CSS transforms

## 42. Gestion d'État Avancée avec Cache

```typescript
// Cache intelligent pour les performances
class ContentCache {
  private cache = new Map();
  private maxSize = 100;
  private ttl = 5 * 60 * 1000; // 5 minutes

  set(key: string, value: any): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Utilisation
const contentCache = new ContentCache();

function getCachedContent(key: string, fetcher: () => any) {
  const cached = contentCache.get(key);
  if (cached) return cached;

  const fresh = fetcher();
  contentCache.set(key, fresh);
  return fresh;
}
```

- Cache intelligent avec TTL (Time To Live)
- Gestion automatique de la taille du cache
- Amélioration des performances de chargement

## 43. Validation de Données Robuste

```typescript
// Validateur de schéma pour les articles
interface ArticleSchema {
  title: string;
  description: string;
  publishDate: Date;
  tags: string[];
  featured?: boolean;
  readingTime?: number;
}

function validateArticle(article: any): ArticleSchema | null {
  try {
    // Validation des champs requis
    if (!article.title || typeof article.title !== "string") {
      console.warn("Article invalide: titre manquant");
      return null;
    }

    if (!article.description || typeof article.description !== "string") {
      console.warn("Article invalide: description manquante");
      return null;
    }

    if (!article.publishDate) {
      console.warn("Article invalide: date de publication manquante");
      return null;
    }

    // Normalisation des données
    return {
      title: article.title.trim(),
      description: article.description.trim(),
      publishDate: new Date(article.publishDate),
      tags: Array.isArray(article.tags) ? article.tags : [],
      featured: Boolean(article.featured),
      readingTime: article.readingTime || calculateReadingTime(article.content),
    };
  } catch (error) {
    console.error("Erreur de validation:", error);
    return null;
  }
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
```

- Validation robuste des données d'articles
- Normalisation automatique des entrées
- Calcul automatique du temps de lecture
- Gestion d'erreurs gracieuse

## 44. Optimisation des Images avec Lazy Loading

```typescript
// Lazy loading intelligent avec intersection observer
class ImageLazyLoader {
  private observer: IntersectionObserver;
  private loadedImages = new Set();

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target as HTMLImageElement);
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );
  }

  observe(img: HTMLImageElement): void {
    if (this.loadedImages.has(img.src)) return;
    this.observer.observe(img);
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    if (!src) return;

    const newImg = new Image();
    newImg.onload = () => {
      img.src = src;
      img.classList.add("loaded");
      this.loadedImages.add(src);
    };
    newImg.onerror = () => {
      img.src = "/images/placeholder.jpg"; // Fallback
      img.classList.add("error");
    };
    newImg.src = src;
  }
}

// Utilisation
const lazyLoader = new ImageLazyLoader();
document.querySelectorAll("img[data-src]").forEach((img) => {
  lazyLoader.observe(img);
});
```

- Chargement paresseux des images
- Gestion des erreurs avec images de fallback
- Optimisation des performances de page

## 45. Gestion des Erreurs Centralisée

```typescript
// Système de gestion d'erreurs centralisé
class ErrorHandler {
  private errors: Error[] = [];
  private maxErrors = 50;

  log(error: Error, context?: string): void {
    const errorWithContext = {
      ...error,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.errors.push(errorWithContext);

    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    console.error("Erreur capturée:", errorWithContext);

    // Envoyer à un service de monitoring (optionnel)
    this.sendToMonitoring(errorWithContext);
  }

  private sendToMonitoring(error: any): void {
    // Intégration avec Sentry, LogRocket, etc.
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "exception", {
        description: error.message,
        fatal: false,
      });
    }
  }

  getErrors(): Error[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }
}

// Utilisation globale
const errorHandler = new ErrorHandler();

// Wrapper pour les fonctions async
function withErrorHandling<T extends any[], R>(fn: (...args: T) => Promise<R>) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler.log(error as Error, fn.name);
      return null;
    }
  };
}
```

- Gestion centralisée des erreurs
- Logging contextuel avec métadonnées
- Intégration avec les services de monitoring
- Wrapper pour la gestion d'erreurs automatique

## 46. Performance Monitoring

```typescript
// Monitoring des performances
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  measure(name: string, fn: () => any): any {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    const duration = end - start;
    this.recordMetric(name, duration);

    return result;
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();

    const duration = end - start;
    this.recordMetric(name, duration);

    return result;
  }

  private recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const values = this.metrics.get(name)!;
    values.push(value);

    // Garder seulement les 100 dernières valeurs
    if (values.length > 100) {
      values.shift();
    }
  }

  getAverageTime(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;

    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getSlowestOperations(limit = 10): Array<{ name: string; avgTime: number }> {
    const operations = Array.from(this.metrics.entries())
      .map(([name, values]) => ({
        name,
        avgTime: this.getAverageTime(name),
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, limit);

    return operations;
  }
}

// Utilisation
const perfMonitor = new PerformanceMonitor();

// Mesurer une fonction
const result = perfMonitor.measure("article-processing", () => {
  return processArticles(articles);
});

// Mesurer une fonction async
const asyncResult = await perfMonitor.measureAsync("data-fetch", async () => {
  return await fetchData();
});
```

- Monitoring des performances en temps réel
- Détection des opérations lentes
- Métriques moyennes et historiques
- Optimisation basée sur les données

## 47. Accessibilité Avancée

```typescript
// Gestionnaire d'accessibilité
class AccessibilityManager {
  private focusTrap: HTMLElement | null = null;
  private skipLinks: HTMLElement[] = [];

  init(): void {
    this.setupSkipLinks();
    this.setupFocusManagement();
    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
  }

  private setupSkipLinks(): void {
    this.skipLinks = Array.from(document.querySelectorAll("[data-skip-link]"));

    this.skipLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href")!);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  private setupFocusManagement(): void {
    // Gestion du focus pour les modales
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.focusTrap) {
        this.closeFocusTrap();
      }
    });
  }

  private setupKeyboardNavigation(): void {
    // Navigation au clavier pour les composants personnalisés
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        this.handleTabNavigation(e);
      }
    });
  }

  private setupScreenReaderSupport(): void {
    // Annonces pour les lecteurs d'écran
    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    document.body.appendChild(announcer);

    // Fonction pour annoncer des changements
    window.announceToScreenReader = (message: string) => {
      announcer.textContent = message;
      setTimeout(() => {
        announcer.textContent = "";
      }, 1000);
    };
  }

  openFocusTrap(element: HTMLElement): void {
    this.focusTrap = element;
    element.focus();

    // Piéger le focus dans l'élément
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    element.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  closeFocusTrap(): void {
    this.focusTrap = null;
  }

  private handleTabNavigation(e: KeyboardEvent): void {
    // Logique personnalisée pour la navigation au clavier
    const activeElement = document.activeElement;

    if (activeElement?.hasAttribute("data-keyboard-nav")) {
      const direction = e.shiftKey ? "prev" : "next";
      const nextElement = this.findNextFocusableElement(
        activeElement,
        direction
      );

      if (nextElement) {
        nextElement.focus();
        e.preventDefault();
      }
    }
  }

  private findNextFocusableElement(
    current: Element,
    direction: "prev" | "next"
  ): HTMLElement | null {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    const currentIndex = focusableElements.indexOf(current as HTMLElement);

    if (direction === "next") {
      return focusableElements[currentIndex + 1] || focusableElements[0];
    } else {
      return (
        focusableElements[currentIndex - 1] ||
        focusableElements[focusableElements.length - 1]
      );
    }
  }
}

// Initialisation
const a11yManager = new AccessibilityManager();
document.addEventListener("DOMContentLoaded", () => {
  a11yManager.init();
});
```

- Gestion complète de l'accessibilité
- Navigation au clavier personnalisée
- Support des lecteurs d'écran
- Piégeage du focus pour les modales
