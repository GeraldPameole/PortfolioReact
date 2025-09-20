---
title: "Guide d'Implémentation des Images Thématiques"
description: "Guide complet pour la gestion des images thématiques dans les articles du blog"
date: "2024-03-20"
author: "Gérald Paméole"
tags: ["documentation", "guide", "images"]
---

# Guide d'Implémentation des Images Thématiques

## Structure des Dossiers

Les images thématiques sont stockées dans le dossier `/public/assets/themes/`. Chaque image doit suivre ces conventions :

- Format : WebP (pour une meilleure performance)
- Dimensions recommandées : 1200x630px
- Poids maximum : 100Ko
- Nommage : `[theme-key].webp` (ex: development.webp, technology.webp)

## Liste des Images Thématiques Requises

1. development.webp - Pour les articles de développement
2. technology.webp - Pour les articles de technologie
3. career.webp - Pour les articles sur la carrière
4. ai.webp - Pour les articles sur l'IA
5. web.webp - Pour les articles sur le web
6. mobile.webp - Pour les articles sur le mobile
7. cloud.webp - Pour les articles sur le cloud
8. devops.webp - Pour les articles sur le DevOps
9. security.webp - Pour les articles sur la sécurité
10. data.webp - Pour les articles sur la data
11. other.webp - Pour les articles sans thème spécifique

## Configuration des Thèmes

Les thèmes sont définis dans `src/utils/themeUtils.ts`. Chaque thème possède :

```typescript
interface ThemeConfig {
  image: string; // Chemin vers l'image thématique
  color: string; // Couleur Tailwind pour les badges
  icon?: string; // Icône Font Awesome (optionnel)
  label: string; // Nom d'affichage du thème
}
```

## Utilisation dans les Articles

Pour associer une image thématique à un article, utilisez les tags dans le frontmatter :

```markdown
---
title: Mon Article
tags: ["javascript", "react"] # Sera automatiquement mappé vers "developpement"
---
```

Le système utilisera automatiquement `mapToStandardTheme()` pour associer les tags aux thèmes standards.

## Optimisation des Images

1. Convertir en WebP :

```bash
cwebp -q 80 input.jpg -o output.webp
```

2. Redimensionner avec Sharp :

```javascript
sharp(input).resize(1200, 630).webp({ quality: 80 }).toFile(output);
```

## Bonnes Pratiques

1. Utilisez des images pertinentes et professionnelles
2. Maintenez une cohérence visuelle entre les thèmes
3. Optimisez toujours les images avant de les ajouter
4. Testez le rendu sur différents appareils
5. Mettez à jour le mapping des thèmes au besoin

## Maintenance

- Vérifiez régulièrement que toutes les images sont présentes
- Optimisez les images existantes si nécessaire
- Mettez à jour les thèmes en fonction des nouveaux besoins
- Gardez une copie de sauvegarde des images originales
