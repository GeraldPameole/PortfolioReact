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

function reorderSections(content) {
  // Extraire le frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatterMatch) return content;
  
  const frontmatter = frontmatterMatch[0];
  const body = content.replace(frontmatterMatch[0], '');
  
  // Extraire l'Introduction
  const introMatch = body.match(/^## Introduction\n([\s\S]*?)(?=^## \d\.|$)/m);
  const intro = introMatch ? introMatch[0] : '';
  const bodyWithoutIntro = introMatch ? body.replace(introMatch[0], '') : body;
  
  // Extraire les sections dans l'ordre
  const sections = {
    section1: bodyWithoutIntro.match(/^## 1\.\s*FONDAMENTAUX DU SUJET\n([\s\S]*?)(?=^## \d\.|$)/m),
    section2: bodyWithoutIntro.match(/^## 2\.\s*ANALYSE APPROFONDIE\n([\s\S]*?)(?=^## \d\.|$)/m),
    section3: bodyWithoutIntro.match(/^## 3\.\s*STRATÉGIES ET MÉTHODOLOGIES\n([\s\S]*?)(?=^## \d\.|$)/m),
    section4: bodyWithoutIntro.match(/^## 4\.\s*OUTILS ET TECHNOLOGIES\n([\s\S]*?)(?=^## \d\.|$)/m),
    section5: bodyWithoutIntro.match(/^## 5\.\s*DÉFIS ET SOLUTIONS\n([\s\S]*?)(?=^## \d\.|$)/m),
    section6: bodyWithoutIntro.match(/^## 6\.\s*SOURCES ET RÉFÉRENCES\n([\s\S]*?)(?=^## \d\.|$)/m),
    section7: bodyWithoutIntro.match(/^## 7\.\s*ARTICLES ANNEXES\n([\s\S]*?)(?=^## \d\.|$)/m)
  };
  
  // Reconstruire le contenu dans le bon ordre
  let newContent = frontmatter + '\n';
  
  if (intro) {
    newContent += intro + '\n';
  }
  
  // Ajouter les sections dans l'ordre correct
  if (sections.section1) {
    newContent += sections.section1[0] + '\n';
  }
  
  if (sections.section2) {
    newContent += sections.section2[0] + '\n';
  }
  
  if (sections.section3) {
    newContent += sections.section3[0] + '\n';
  }
  
  if (sections.section4) {
    newContent += sections.section4[0] + '\n';
  }
  
  if (sections.section5) {
    newContent += sections.section5[0] + '\n';
  }
  
  if (sections.section6) {
    newContent += sections.section6[0] + '\n';
  }
  
  if (sections.section7) {
    newContent += sections.section7[0] + '\n';
  }
  
  return newContent.trim() + '\n';
}

// Analyser et corriger tous les articles
const files = getAllMdFiles(articlesDir);
let modifiedCount = 0;

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Vérifier l'ordre actuel
  const section1Index = content.indexOf('## 1. FONDAMENTAUX DU SUJET');
  const section2Index = content.indexOf('## 2. ANALYSE APPROFONDIE');
  
  // Si section 2 est avant section 1, réorganiser
  if (section2Index !== -1 && section1Index !== -1 && section2Index < section1Index) {
    console.log(`Réorganisation de ${path.basename(filePath)}...`);
    const newContent = reorderSections(content);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    modifiedCount++;
  }
});

console.log(`\n✅ ${modifiedCount} articles réorganisés avec succès.`);

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

function reorderSections(content) {
  // Extraire le frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatterMatch) return content;
  
  const frontmatter = frontmatterMatch[0];
  const body = content.replace(frontmatterMatch[0], '');
  
  // Extraire l'Introduction
  const introMatch = body.match(/^## Introduction\n([\s\S]*?)(?=^## \d\.|$)/m);
  const intro = introMatch ? introMatch[0] : '';
  const bodyWithoutIntro = introMatch ? body.replace(introMatch[0], '') : body;
  
  // Extraire les sections dans l'ordre
  const sections = {
    section1: bodyWithoutIntro.match(/^## 1\.\s*FONDAMENTAUX DU SUJET\n([\s\S]*?)(?=^## \d\.|$)/m),
    section2: bodyWithoutIntro.match(/^## 2\.\s*ANALYSE APPROFONDIE\n([\s\S]*?)(?=^## \d\.|$)/m),
    section3: bodyWithoutIntro.match(/^## 3\.\s*STRATÉGIES ET MÉTHODOLOGIES\n([\s\S]*?)(?=^## \d\.|$)/m),
    section4: bodyWithoutIntro.match(/^## 4\.\s*OUTILS ET TECHNOLOGIES\n([\s\S]*?)(?=^## \d\.|$)/m),
    section5: bodyWithoutIntro.match(/^## 5\.\s*DÉFIS ET SOLUTIONS\n([\s\S]*?)(?=^## \d\.|$)/m),
    section6: bodyWithoutIntro.match(/^## 6\.\s*SOURCES ET RÉFÉRENCES\n([\s\S]*?)(?=^## \d\.|$)/m),
    section7: bodyWithoutIntro.match(/^## 7\.\s*ARTICLES ANNEXES\n([\s\S]*?)(?=^## \d\.|$)/m)
  };
  
  // Reconstruire le contenu dans le bon ordre
  let newContent = frontmatter + '\n';
  
  if (intro) {
    newContent += intro + '\n';
  }
  
  // Ajouter les sections dans l'ordre correct
  if (sections.section1) {
    newContent += sections.section1[0] + '\n';
  }
  
  if (sections.section2) {
    newContent += sections.section2[0] + '\n';
  }
  
  if (sections.section3) {
    newContent += sections.section3[0] + '\n';
  }
  
  if (sections.section4) {
    newContent += sections.section4[0] + '\n';
  }
  
  if (sections.section5) {
    newContent += sections.section5[0] + '\n';
  }
  
  if (sections.section6) {
    newContent += sections.section6[0] + '\n';
  }
  
  if (sections.section7) {
    newContent += sections.section7[0] + '\n';
  }
  
  return newContent.trim() + '\n';
}

// Analyser et corriger tous les articles
const files = getAllMdFiles(articlesDir);
let modifiedCount = 0;

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Vérifier l'ordre actuel
  const section1Index = content.indexOf('## 1. FONDAMENTAUX DU SUJET');
  const section2Index = content.indexOf('## 2. ANALYSE APPROFONDIE');
  
  // Si section 2 est avant section 1, réorganiser
  if (section2Index !== -1 && section1Index !== -1 && section2Index < section1Index) {
    console.log(`Réorganisation de ${path.basename(filePath)}...`);
    const newContent = reorderSections(content);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    modifiedCount++;
  }
});

console.log(`\n✅ ${modifiedCount} articles réorganisés avec succès.`);

