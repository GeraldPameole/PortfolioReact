# Système de Design Unifié

## Vue d'ensemble

Ce document décrit le système de design unifié mis en place pour assurer la cohérence visuelle et la responsivité sur toutes les pages du site.

## Architecture des Styles

### Fichiers CSS principaux

- **`palette.css`** - Variables de couleurs et thèmes
- **`typography.css`** - Système de typographie et variables de base
- **`content.css`** - Styles unifiés pour tout le contenu
- **`global.css`** - Styles globaux et composants Tailwind

### Variables CSS unifiées

#### Espacements

```css
:root {
  --content-spacing-xs: 0.5rem; /* 8px */
  --content-spacing-sm: 1rem; /* 16px */
  --content-spacing-md: 1.5rem; /* 24px */
  --content-spacing-lg: 2rem; /* 32px */
  --content-spacing-xl: 2.5rem; /* 40px */
  --content-spacing-2xl: 3rem; /* 48px */
  --content-spacing-3xl: 4rem; /* 64px */
}
```

#### Largeurs de contenu

```css
:root {
  --content-max-width-sm: 42rem; /* 672px */
  --content-max-width-md: 48rem; /* 768px */
  --content-max-width-lg: 64rem; /* 1024px */
  --content-max-width-xl: 80rem; /* 1280px */
}
```

## Classes de conteneur

### `.content-container` (défaut)

- Largeur maximale : 64rem (1024px)
- Centré automatiquement
- Padding horizontal adaptatif

### `.content-container-wide`

- Largeur maximale : 80rem (1280px)
- Pour les pages avec beaucoup de contenu
- Idéal pour les grilles et tableaux

### `.content-container-narrow`

- Largeur maximale : 48rem (768px)
- Pour les articles et contenus de lecture
- Optimisé pour la lisibilité

## Système de typographie

### Classe principale : `.content-typography`

Cette classe applique automatiquement :

- Tailles de police cohérentes
- Espacements uniformes
- Hiérarchie des titres
- Styles pour les listes, liens, citations, code

### Hiérarchie des titres

```css
.content-typography h1 {
  /* Taille 4xl, marge 2xl */
}
.content-typography h2 {
  /* Taille 3xl, marge xl */
}
.content-typography h3 {
  /* Taille 2xl, marge lg */
}
.content-typography h4 {
  /* Taille xl, marge lg */
}
.content-typography h5 {
  /* Taille lg, marge md */
}
.content-typography h6 {
  /* Taille base, marge md */
}
```

## Composants de mise en page

### `.content-layout`

- Structure de base pour les pages de contenu
- Gestion automatique des espacements
- Support du bouton retour

### `.content-card`

- Carte avec ombre et bordure
- Padding et marges cohérents
- Support du mode sombre

### `.content-section`

- Section avec marge inférieure standardisée
- Idéal pour organiser le contenu

## Responsive Design

### Breakpoints

- **Mobile** : < 480px
- **Tablet** : 480px - 768px
- **Desktop** : > 768px

### Adaptations automatiques

- Tailles de police réduites sur mobile
- Espacements ajustés selon l'écran
- Grilles adaptatives

## Mode sombre

Le système gère automatiquement :

- Couleurs de texte adaptées
- Arrière-plans des composants
- Ombres et bordures

## Utilisation dans les composants

### Exemple de page simple

```astro
---
import ContentLayout from '../components/ContentLayout.astro';
---

<ContentLayout
  title="Titre de la page"
  description="Description optionnelle"
  container="default"
  showBackButton={true}
>
  <div class="content-typography">
    <h2>Sous-titre</h2>
    <p>Contenu du paragraphe...</p>
  </div>
</ContentLayout>
```

### Exemple avec conteneur personnalisé

```astro
<div class="content-container-wide">
  <div class="content-typography">
    <!-- Contenu avec styles unifiés -->
  </div>
</div>
```

## Classes utilitaires

### Espacements

```css
.mb-0, .mb-1, .mb-2, .mb-3, .mb-4, .mb-5
.mt-0, .mt-1, .mt-2, .mt-3, .mt-4, .mt-5
.p-0, .p-1, .p-2, .p-3, .p-4, .p-5
```

### Alignement

```css
.text-center, .text-left, .text-right, .text-justify
```

## Migration depuis l'ancien système

### Remplacer les classes

- `prose` → `content-typography`
- `container mx-auto px-4` → `content-container`
- `max-w-7xl mx-auto px-4` → `content-container-wide`

### Supprimer les styles dupliqués

- Les styles `.prose` personnalisés
- Les définitions de conteneur redondantes
- Les espacements hardcodés

## Bonnes pratiques

1. **Utiliser les classes unifiées** plutôt que des styles personnalisés
2. **Respecter la hiérarchie** des titres (h1 → h2 → h3)
3. **Utiliser les variables CSS** pour les espacements
4. **Tester la responsivité** sur différents écrans
5. **Maintenir la cohérence** entre les pages

## Maintenance

### Ajouter de nouveaux styles

1. Définir dans `content.css` si c'est global
2. Utiliser les variables existantes
3. Documenter les nouvelles fonctionnalités

### Modifier les variables

1. Mettre à jour `content.css`
2. Vérifier l'impact sur toutes les pages
3. Tester la responsivité

## Support

Pour toute question sur le système de design :

- Consulter ce document
- Vérifier les exemples dans `src/components/`
- Tester sur différents appareils

