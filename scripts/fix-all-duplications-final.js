import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles/gestion-talents');

function getAllMdFiles(dir) {
  const files = fs.readdirSync(dir);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(dir, file));
}

function removeDuplications(content) {
  let fixed = content;
  
  // Supprimer les duplications de texte à la fin des phases
  fixed = fixed.replace(/, j'observe que cette phase est souvent négligée\. Sur 100 projets, celles qui appliquent correctement cette phase ont 70% plus de succès\.\n\n/g, '');
  
  // Supprimer les sections 5.1 dupliquées (garder seulement la première occurrence)
  const section5Matches = fixed.match(/### 5\.1 Gérer les Obstacles : Ma Boîte à Outils/g);
  if (section5Matches && section5Matches.length > 1) {
    // Trouver toutes les occurrences de section 5.1
    const parts = fixed.split('### 5.1 Gérer les Obstacles : Ma Boîte à Outils');
    if (parts.length > 2) {
      // Garder la première partie + la première section 5.1 (la plus complète) + la section 6
      // Identifier la section 5.1 qui contient le plus de contenu spécifique
      let bestSection5Index = 1;
      let bestSection5Length = 0;
      
      for (let i = 1; i < parts.length; i++) {
        const section5Content = parts[i].split('## 6.')[0];
        // Vérifier si cette section contient du contenu spécifique (pas générique)
        const hasSpecificContent = section5Content.includes('Équité Salariale') || 
                                    section5Content.includes('Biais Inconscients') ||
                                    section5Content.includes('Conflit Interpersonnel') ||
                                    section5Content.includes('Time-to-Hire') ||
                                    section5Content.includes('Manque d\'Engagement dans la Formation') ||
                                    section5Content.includes('Manque de Plans de Développement') ||
                                    section5Content.includes('Manque d\'Engagement') ||
                                    section5Content.includes('Manque d\'Objectifs Clairs') ||
                                    section5Content.includes('Manque de Successeurs') ||
                                    section5Content.includes('Manque de Canaux') ||
                                    section5Content.includes('Manque d\'Opportunités') ||
                                    section5Content.includes('Stress et Burnout');
        
        if (hasSpecificContent && section5Content.length > bestSection5Length) {
          bestSection5Index = i;
          bestSection5Length = section5Content.length;
        }
      }
      
      // Si aucune section spécifique n'a été trouvée, garder la première
      if (bestSection5Length === 0) {
        bestSection5Index = 1;
      }
      
      const bestSection5 = parts[bestSection5Index].split('## 6.')[0];
      const section6 = parts[parts.length - 1].includes('## 6.') ? 
        parts[parts.length - 1].split('## 6.')[1] : 
        parts[parts.length - 1];
      
      fixed = parts[0] + '### 5.1 Gérer les Obstacles : Ma Boîte à Outils' + bestSection5 + '## 6.' + section6;
    }
  }
  
  // Supprimer les sections 4.1 dupliquées (garder seulement la première occurrence)
  const section4Matches = fixed.match(/### 4\.1/g);
  if (section4Matches && section4Matches.length > 1) {
    // Trouver toutes les occurrences de section 4.1
    const parts = fixed.split('### 4.1');
    if (parts.length > 2) {
      // Garder la première partie + la première section 4.1 (la plus complète) + la section 5
      // Identifier la section 4.1 qui contient le plus de contenu détaillé
      let bestSection4Index = 1;
      let bestSection4Length = 0;
      
      for (let i = 1; i < parts.length; i++) {
        const section4Content = parts[i].split('## 5.')[0];
        // Vérifier si cette section contient du contenu détaillé (avec "Utilisation :")
        const hasDetailedContent = section4Content.includes('Utilisation :') || 
                                   section4Content.includes('**Utilisation :**');
        
        if (hasDetailedContent && section4Content.length > bestSection4Length) {
          bestSection4Index = i;
          bestSection4Length = section4Content.length;
        }
      }
      
      // Si aucune section détaillée n'a été trouvée, garder la première
      if (bestSection4Length === 0) {
        bestSection4Index = 1;
      }
      
      const bestSection4 = parts[bestSection4Index].split('## 5.')[0];
      const section5 = parts[parts.length - 1].includes('## 5.') ? 
        parts[parts.length - 1].split('## 5.')[1] : 
        parts[parts.length - 1];
      
      fixed = parts[0] + '### 4.1' + bestSection4 + '## 5.' + section5;
    }
  }
  
  return fixed;
}

function fixDuplications(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);
  
  const originalBody = body;
  const fixedBody = removeDuplications(body);
  
  if (fixedBody !== originalBody) {
    const newContent = matter.stringify(fixedBody, frontmatter);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    return true;
  }
  
  return false;
}

// Traiter tous les articles
const files = getAllMdFiles(articlesDir);
let fixedCount = 0;

console.log('Correction des duplications dans les articles gestion-talents...\n');

files.forEach((filePath) => {
  const fileName = path.basename(filePath);
  if (fixDuplications(filePath)) {
    console.log(`✅ ${fileName} corrigé`);
    fixedCount++;
  } else {
    console.log(`⏭️  ${fileName} - OK`);
  }
});

console.log(`\n✅ ${fixedCount} articles corrigés`);

import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles/gestion-talents');

function getAllMdFiles(dir) {
  const files = fs.readdirSync(dir);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(dir, file));
}

function removeDuplications(content) {
  let fixed = content;
  
  // Supprimer les duplications de texte à la fin des phases
  fixed = fixed.replace(/, j'observe que cette phase est souvent négligée\. Sur 100 projets, celles qui appliquent correctement cette phase ont 70% plus de succès\.\n\n/g, '');
  
  // Supprimer les sections 5.1 dupliquées (garder seulement la première occurrence)
  const section5Matches = fixed.match(/### 5\.1 Gérer les Obstacles : Ma Boîte à Outils/g);
  if (section5Matches && section5Matches.length > 1) {
    // Trouver toutes les occurrences de section 5.1
    const parts = fixed.split('### 5.1 Gérer les Obstacles : Ma Boîte à Outils');
    if (parts.length > 2) {
      // Garder la première partie + la première section 5.1 (la plus complète) + la section 6
      // Identifier la section 5.1 qui contient le plus de contenu spécifique
      let bestSection5Index = 1;
      let bestSection5Length = 0;
      
      for (let i = 1; i < parts.length; i++) {
        const section5Content = parts[i].split('## 6.')[0];
        // Vérifier si cette section contient du contenu spécifique (pas générique)
        const hasSpecificContent = section5Content.includes('Équité Salariale') || 
                                    section5Content.includes('Biais Inconscients') ||
                                    section5Content.includes('Conflit Interpersonnel') ||
                                    section5Content.includes('Time-to-Hire') ||
                                    section5Content.includes('Manque d\'Engagement dans la Formation') ||
                                    section5Content.includes('Manque de Plans de Développement') ||
                                    section5Content.includes('Manque d\'Engagement') ||
                                    section5Content.includes('Manque d\'Objectifs Clairs') ||
                                    section5Content.includes('Manque de Successeurs') ||
                                    section5Content.includes('Manque de Canaux') ||
                                    section5Content.includes('Manque d\'Opportunités') ||
                                    section5Content.includes('Stress et Burnout');
        
        if (hasSpecificContent && section5Content.length > bestSection5Length) {
          bestSection5Index = i;
          bestSection5Length = section5Content.length;
        }
      }
      
      // Si aucune section spécifique n'a été trouvée, garder la première
      if (bestSection5Length === 0) {
        bestSection5Index = 1;
      }
      
      const bestSection5 = parts[bestSection5Index].split('## 6.')[0];
      const section6 = parts[parts.length - 1].includes('## 6.') ? 
        parts[parts.length - 1].split('## 6.')[1] : 
        parts[parts.length - 1];
      
      fixed = parts[0] + '### 5.1 Gérer les Obstacles : Ma Boîte à Outils' + bestSection5 + '## 6.' + section6;
    }
  }
  
  // Supprimer les sections 4.1 dupliquées (garder seulement la première occurrence)
  const section4Matches = fixed.match(/### 4\.1/g);
  if (section4Matches && section4Matches.length > 1) {
    // Trouver toutes les occurrences de section 4.1
    const parts = fixed.split('### 4.1');
    if (parts.length > 2) {
      // Garder la première partie + la première section 4.1 (la plus complète) + la section 5
      // Identifier la section 4.1 qui contient le plus de contenu détaillé
      let bestSection4Index = 1;
      let bestSection4Length = 0;
      
      for (let i = 1; i < parts.length; i++) {
        const section4Content = parts[i].split('## 5.')[0];
        // Vérifier si cette section contient du contenu détaillé (avec "Utilisation :")
        const hasDetailedContent = section4Content.includes('Utilisation :') || 
                                   section4Content.includes('**Utilisation :**');
        
        if (hasDetailedContent && section4Content.length > bestSection4Length) {
          bestSection4Index = i;
          bestSection4Length = section4Content.length;
        }
      }
      
      // Si aucune section détaillée n'a été trouvée, garder la première
      if (bestSection4Length === 0) {
        bestSection4Index = 1;
      }
      
      const bestSection4 = parts[bestSection4Index].split('## 5.')[0];
      const section5 = parts[parts.length - 1].includes('## 5.') ? 
        parts[parts.length - 1].split('## 5.')[1] : 
        parts[parts.length - 1];
      
      fixed = parts[0] + '### 4.1' + bestSection4 + '## 5.' + section5;
    }
  }
  
  return fixed;
}

function fixDuplications(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);
  
  const originalBody = body;
  const fixedBody = removeDuplications(body);
  
  if (fixedBody !== originalBody) {
    const newContent = matter.stringify(fixedBody, frontmatter);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    return true;
  }
  
  return false;
}

// Traiter tous les articles
const files = getAllMdFiles(articlesDir);
let fixedCount = 0;

console.log('Correction des duplications dans les articles gestion-talents...\n');

files.forEach((filePath) => {
  const fileName = path.basename(filePath);
  if (fixDuplications(filePath)) {
    console.log(`✅ ${fileName} corrigé`);
    fixedCount++;
  } else {
    console.log(`⏭️  ${fileName} - OK`);
  }
});

console.log(`\n✅ ${fixedCount} articles corrigés`);

