# Suivi de Développement - Portfolio

Ce fichier documente l'avancée du développement du portfolio, les fonctionnalités implémentées, et les snippets de code les plus importants.

## Actions réalisées

### Structure et configuration

1. Mise en place de la structure du projet Astro
2. Configuration des dépendances (React, TypeScript, Tailwind CSS)
3. Configuration du système de thèmes (clair/sombre)
4. Optimisation SEO de base
5. Configuration des routes et de la navigation

### Composants principaux

1. Développement du Header avec navigation responsive
2. Création de la page d'accueil avec sections principales
3. Implémentation des cartes de domaines d'expertise
4. Développement du système de projets et leur catégorisation
5. Création des composants de blog (cartes d'articles, système de thèmes)
6. Développement du système de livres recommandés
7. Implémentation du formulaire de contact
8. Création du pied de page avec liens sociaux

### Système de contenu

1. Configuration du système de Collections Astro
2. Création du système de markdown pour les articles et projets
3. Implémentation du tri par date et popularité
4. Développement du système de thèmes et catégories
5. Création des pages détaillées pour projets, articles et livres

### Fonctionnalités avancées

1. Implémentation du mode sombre/clair
2. Développement de l'interface responsive
3. Optimisation des performances (lazy loading, images optimisées)
4. Harmonisation des couleurs et du design sur toutes les pages
5. Mise en place des animations et transitions de page

### Optimisations

1. Amélioration de l'accessibilité
2. Optimisation SEO avancée
3. Performance d'affichage et temps de chargement
4. Compatibilité cross-browser
5. Adaptation responsive pour tous les appareils

## Fonctions développées

### Gestion des thèmes et catégories

#### `mapToStandardTheme(customTheme)`

Cette fonction est utilisée pour standardiser les thèmes personnalisés vers des thèmes prédéfinis. Elle permet d'avoir une cohérence visuelle dans toute l'application.

```typescript
export function mapToStandardTheme(
  customTheme: string | null | undefined
): ThemeKey {
  if (!customTheme) return "culture-tech";

  const themeMap: Record<string, ThemeKey> = {
    // Développement Web
    web: "developpement-web",
    frontend: "developpement-web",
    // ... autres mappings
  };

  return themeMap[customTheme.toLowerCase()] || "culture-tech";
}
```

#### `groupByTheme(items)`

Regroupe les éléments (articles ou livres) par thème standardisé.

```typescript
export function groupByTheme<T extends { data: { tags?: string[] } }>(
  items: T[]
): Record<ThemeKey, T[]> {
  return items.reduce(
    (grouped, item) => {
      const theme = getItemTheme(item);
      if (!grouped[theme]) {
        grouped[theme] = [];
      }
      grouped[theme].push(item);
      return grouped;
    },
    {} as Record<ThemeKey, T[]>
  );
}
```

### Formatage et utilitaires

#### `calculateReadingTime(content)`

Calcule le temps de lecture estimé pour un contenu en texte.

```typescript
export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  const readingTimeMinutes = Math.ceil(words / 200);
  return readingTimeMinutes;
}
```

#### `formatDate(date)`

Formate les dates selon le format français.

```typescript
function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
```

### Tri et filtrage

#### Tri des projets par date

```typescript
const sortedProjects = projects.sort((a, b) => {
  return (
    new Date(b.data.publishDate).getTime() -
    new Date(a.data.publishDate).getTime()
  );
});
```

#### Assignation des projets par catégorie

```typescript
sortedProjects.forEach((project) => {
  let assigned = false;
  if (project.data.technologies) {
    const techs = project.data.technologies.map((t: string) => t.toLowerCase());

    // Règles d'assignation basées sur les technologies
    if (
      techs.some((t: string) =>
        [
          "react",
          "vue",
          "angular",
          "javascript",
          "typescript",
          "html",
          "css",
          "web",
        ].includes(t)
      )
    ) {
      groupedProjects["developpement-web"].push(project);
      assigned = true;
    }
    // ... autres règles d'assignation
  }
});
```

## Snippets par catégorie

### Système de thèmes

```typescript
// Définition des thèmes standardisés
export const standardThemes: Record<ThemeKey, ThemeConfig> = {
  "developpement-web": {
    label: "Développement Web",
    icon: "fas fa-code",
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-800 dark:text-blue-300",
    image: "/assets/themes/coding.webp",
  },
  // ... autres thèmes
};
```

### Navigation

```astro
<nav class="flex items-center">
  <div class="hidden md:flex space-x-1">
    <a href="/" class={`px-3 py-2 rounded-md text-sm font-medium ${currentPath === "/" ? activeClass : defaultClass}`}>
      Accueil
    </a>
    <a href="/about" class={`px-3 py-2 rounded-md text-sm font-medium ${currentPath.startsWith("/about") ? activeClass : defaultClass}`}>
      À propos
    </a>
    <!-- Autres liens de navigation -->
  </div>
</nav>
```

### Carte de projet

```astro
<a href={`/projets/${project.slug}`} class="group">
  <div class="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-600 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col h-full">
    <div class="relative h-48 mb-4 overflow-hidden rounded-lg">
      {project.data.img ? (
        <img
          src={project.data.img}
          alt={project.data.img_alt || project.data.title}
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div class={`w-full h-full ${getBackgroundClass(key)} flex items-center justify-center`}>
          <i class={`fas fa-${category.icon} text-white text-3xl`}></i>
        </div>
      )}
      <div class="absolute top-2 right-2">
        <span class="text-xs px-2 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
          {formatDate(project.data.publishDate)}
        </span>
      </div>
    </div>
    <!-- Contenu de la carte -->
  </div>
</a>
```

### Système de blog

```astro
<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {articles.map((article) => (
    <BlogCard
      url={`/blog/${article.slug}`}
      title={article.data.title}
      description={article.data.description}
      coverImage={article.data.image || getThemeImage(article.standardTheme)}
      publishDate={article.data.publishDate}
      readingTime={calculateReadingTime(article.body)}
      theme={article.standardTheme}
      tags={article.data.tags || []}
    />
  ))}
</section>
```

### Domaines d'expertise

```astro
<!-- Premier rang de cartes: 4 domaines principaux -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 mb-8">
  {expertiseDomains.slice(0, 4).map((domain) => (
    <div class="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div class="flex items-center gap-3 mb-4">
        <div class={`p-3 rounded-lg ${domain.color} ${domain.bgColor}`}>
          <span class="text-xl">
            <i class={domain.icon}></i>
          </span>
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">{domain.title}</h3>
      </div>
      <p class="text-gray-600 dark:text-gray-300">
        {domain.description}
      </p>
    </div>
  ))}
</div>
```

### Système de mode sombre

```astro
<button
  id="theme-toggle"
  class="px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
  aria-label="Toggle dark mode"
>
  <i class="fas fa-sun text-yellow-500 dark:hidden"></i>
  <i class="fas fa-moon text-indigo-400 hidden dark:block"></i>
</button>

<script is:inline>
  // Gestion du thème (sombre/clair)
  const theme = (() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  })();

  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }

  window.localStorage.setItem('theme', theme);

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  });
</script>
```

### Formulaire de contact

```astro
<Form method="POST" action="/api/contact" class="space-y-6">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <FormGroup label="Nom" required>
      <Input
        type="text"
        name="name"
        placeholder="Votre nom"
        required
      />
    </FormGroup>
    <FormGroup label="Email" required>
      <Input
        type="email"
        name="email"
        placeholder="vous@exemple.com"
        required
      />
    </FormGroup>
  </div>

  <FormGroup label="Sujet" required>
    <Input
      type="text"
      name="subject"
      placeholder="Sujet de votre message"
      required
    />
  </FormGroup>

  <FormGroup label="Message" required>
    <Textarea
      name="message"
      placeholder="Votre message..."
      rows={6}
      required
    />
  </FormGroup>

  <div class="flex justify-end">
    <Button type="submit" variant="primary">
      <span>Envoyer</span>
      <i class="fas fa-paper-plane ml-2"></i>
    </Button>
  </div>
</Form>
```

### Système d'animation

```astro
<script defer is:inline>
  // Animation au scroll
  document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.projects-page section > div > div[id], a.group').forEach(section => {
      section.classList.add('opacity-0');
      observer.observe(section);
    });
  });
</script>

<style>
  /* Animation de fade in */
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
```

## Mises à jour récentes

### 28 mai 2024

#### Tâches accomplies

1. **Ajout de deux nouveaux projets :**

   - Création d'un projet "Responsable Développement Commercial" dans le domaine business
   - Création d'un projet "Chargé de Qualité et Process" dans le domaine qualité et process
   - Attribution des badges de domaine appropriés à chaque projet

2. **Amélioration de la mise en page des projets :**

   - Restructuration de la grille de projets en format 2x2 avec le dernier élément centré
   - Limitation à un seul projet par domaine pour une présentation plus claire
   - Conservation des codes couleur spécifiques à chaque domaine

3. **Correction de bugs :**
   - Résolution du problème d'erreur JavaScript "Unexpected token 'export'" dans performance.js
   - Modification du chargement du script sans utiliser les modules ES6
   - Exposition des fonctions via l'objet global window.portfolioPerformance

#### Problèmes identifiés

1. **Ressources manquantes :**

   - Images pour les nouveaux projets :
     - /assets/business-development.jpg
     - /assets/quality-process.jpg
   - Ressources référencées mais absentes :
     - /scripts/analytics.js
     - /scripts/social-share.js
     - /assets/fonts/main-font.woff2
     - Certaines images de livres

2. **Optimisations nécessaires :**
   - Performance : certains scripts sont chargés mais ne sont pas trouvés
   - Images : plusieurs images sont manquantes ou doivent être optimisées

#### Actions prioritaires à mener

1. **Création des ressources manquantes :**

   - Ajouter les images pour les nouveaux projets
   - Créer ou supprimer les références aux scripts analytics.js et social-share.js
   - Vérifier et corriger les chemins des images de livres

2. **Optimisation des performances :**

   - Finaliser le système de lazy loading des images
   - Optimiser les images existantes (format WebP, dimensions adaptées)
   - Corriger les erreurs 404 qui impactent les performances

3. **Documentation :**
   - Maintenir à jour ce fichier de progression (DEVELOPMENT_PROGRESS.md)
   - Documenter régulièrement les modifications importantes
   - Conserver un historique des décisions techniques

## Prochaines étapes

1. **Système de recherche avancée**

   - Implémentation d'un moteur de recherche pour les projets, articles et livres
   - Filtre par thème, tags, et mots-clés

2. **Système de commentaires**

   - Intégration d'un système de commentaires pour les articles et projets
   - Authentification via réseaux sociaux ou email

3. **Optimisation des performances**

   - Préchargement des ressources critiques
   - Optimisation supplémentaire des images
   - Minification et compression des ressources

4. **Analytics et mesures**

   - Intégration de Google Analytics ou Plausible
   - Suivi des performances et comportements utilisateurs
   - Tableaux de bord personnalisés

5. **Tests automatisés**
   - Tests unitaires pour les composants critiques
   - Tests end-to-end pour les parcours utilisateurs
   - Tests de performance et d'accessibilité
