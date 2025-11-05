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

function fixDuplications(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);
  
  let modified = false;
  let newBody = body;
  
  // Supprimer les duplications de texte
  const duplications = [
    /, j'observe que cette phase est souvent négligée\. Sur 100 projets, celles qui appliquent correctement cette phase ont 70% plus de succès\.\n\n/g,
    /### 5\.1 Gérer les Obstacles : Ma Boîte à Outils\n\n#### 5\.1\.1 Le "Manque de Stratégie"[\s\S]*?#### 5\.1\.3 Le "Manque de Support"[\s\S]*?Résultat observé : Amélioration de 45% de l'adoption\.\n\n## 6\./g
  ];
  
  duplications.forEach(pattern => {
    const matches = newBody.match(pattern);
    if (matches) {
      // Supprimer les duplications
      newBody = newBody.replace(pattern, '## 6.');
      modified = true;
    }
  });
  
  // Supprimer les sections 5.1 dupliquées
  const section5Matches = newBody.match(/### 5\.1 Gérer les Obstacles : Ma Boîte à Outils/g);
  if (section5Matches && section5Matches.length > 1) {
    // Garder la première occurrence et supprimer les suivantes jusqu'à la section 6
    const parts = newBody.split('### 5.1 Gérer les Obstacles : Ma Boîte à Outils');
    if (parts.length > 2) {
      // Garder la première partie + la première section 5.1 + la section 6
      const firstSection5 = parts[1].split('## 6.')[0];
      const section6 = parts[parts.length - 1].split('## 6.')[1] || '';
      newBody = parts[0] + '### 5.1 Gérer les Obstacles : Ma Boîte à Outils' + firstSection5 + '## 6.' + section6;
      modified = true;
    }
  }
  
  if (modified) {
    const newContent = matter.stringify(newBody, frontmatter);
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

function fixDuplications(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);
  
  let modified = false;
  let newBody = body;
  
  // Supprimer les duplications de texte
  const duplications = [
    /, j'observe que cette phase est souvent négligée\. Sur 100 projets, celles qui appliquent correctement cette phase ont 70% plus de succès\.\n\n/g,
    /### 5\.1 Gérer les Obstacles : Ma Boîte à Outils\n\n#### 5\.1\.1 Le "Manque de Stratégie"[\s\S]*?#### 5\.1\.3 Le "Manque de Support"[\s\S]*?Résultat observé : Amélioration de 45% de l'adoption\.\n\n## 6\./g
  ];
  
  duplications.forEach(pattern => {
    const matches = newBody.match(pattern);
    if (matches) {
      // Supprimer les duplications
      newBody = newBody.replace(pattern, '## 6.');
      modified = true;
    }
  });
  
  // Supprimer les sections 5.1 dupliquées
  const section5Matches = newBody.match(/### 5\.1 Gérer les Obstacles : Ma Boîte à Outils/g);
  if (section5Matches && section5Matches.length > 1) {
    // Garder la première occurrence et supprimer les suivantes jusqu'à la section 6
    const parts = newBody.split('### 5.1 Gérer les Obstacles : Ma Boîte à Outils');
    if (parts.length > 2) {
      // Garder la première partie + la première section 5.1 + la section 6
      const firstSection5 = parts[1].split('## 6.')[0];
      const section6 = parts[parts.length - 1].split('## 6.')[1] || '';
      newBody = parts[0] + '### 5.1 Gérer les Obstacles : Ma Boîte à Outils' + firstSection5 + '## 6.' + section6;
      modified = true;
    }
  }
  
  if (modified) {
    const newContent = matter.stringify(newBody, frontmatter);
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

