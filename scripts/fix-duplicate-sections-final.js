import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

function getAllMdFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllMdFiles(filePath, fileList);
    } else if (file.endsWith('.md') && !file.includes('template')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function fixDuplicateSections(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  let fixedBody = body;
  const changes = [];
  
  // Trouver toutes les sections (h2)
  const sectionPattern = /^##\s+([^\n]+)/gm;
  const sections = [];
  let match;
  
  while ((match = sectionPattern.exec(body)) !== null) {
    sections.push({
      title: match[1].trim(),
      index: match.index,
      fullMatch: match[0]
    });
  }
  
  // Trouver les doublons de sections
  const sectionMap = new Map();
  const duplicates = [];
  
  sections.forEach((section, index) => {
    const key = section.title.toUpperCase();
    
    if (sectionMap.has(key)) {
      // Doublon trouvé
      duplicates.push({
        title: section.title,
        index: section.index,
        originalIndex: sectionMap.get(key).index
      });
    } else {
      sectionMap.set(key, section);
    }
  });
  
  // Supprimer les doublons en commençant par la fin
  for (let i = duplicates.length - 1; i >= 0; i--) {
    const duplicate = duplicates[i];
    const duplicateStart = duplicate.index;
    
    // Trouver la fin de cette section (début de la section suivante)
    const nextSection = sections.find(s => s.index > duplicateStart);
    const duplicateEnd = nextSection ? nextSection.index : fixedBody.length;
    
    // Supprimer la section dupliquée
    fixedBody = fixedBody.substring(0, duplicateStart) + fixedBody.substring(duplicateEnd);
    changes.push(`Section dupliquée supprimée: "${duplicate.title}"`);
  }
  
  // Nettoyer les lignes vides multiples
  fixedBody = fixedBody.replace(/\n{4,}/g, '\n\n\n');
  
  return { fixedBody, changes };
}

console.log('\n🔧 Correction des sections dupliquées\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const processedArticles = [];
const errors = [];

allArticles.forEach(filePath => {
  try {
    const { fixedBody, changes } = fixDuplicateSections(filePath);
    
    if (changes.length > 0) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(content);
      
      const newContent = matter.stringify(fixedBody, data);
      fs.writeFileSync(filePath, newContent, 'utf-8');
      
      processedArticles.push({
        file: path.basename(filePath),
        changes
      });
      console.log(`   ✅ ${path.basename(filePath)}`);
      changes.forEach(change => {
        console.log(`      - ${change}`);
      });
    }
  } catch (error) {
    errors.push({
      file: path.basename(filePath),
      error: error.message
    });
    console.log(`   ❌ ${path.basename(filePath)}`);
    console.log(`      Erreur: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n📈 RÉSUMÉ:\n`);
console.log(`   Total articles: ${allArticles.length}`);
console.log(`   Articles modifiés: ${processedArticles.length}`);
console.log(`   Erreurs: ${errors.length}`);

if (errors.length > 0) {
  console.log('\n❌ Erreurs rencontrées:\n');
  errors.forEach(err => {
    console.log(`   ${err.file}: ${err.error}`);
  });
}

console.log('\n✅ Correction terminée\n');

import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

function getAllMdFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllMdFiles(filePath, fileList);
    } else if (file.endsWith('.md') && !file.includes('template')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function fixDuplicateSections(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  let fixedBody = body;
  const changes = [];
  
  // Trouver toutes les sections (h2)
  const sectionPattern = /^##\s+([^\n]+)/gm;
  const sections = [];
  let match;
  
  while ((match = sectionPattern.exec(body)) !== null) {
    sections.push({
      title: match[1].trim(),
      index: match.index,
      fullMatch: match[0]
    });
  }
  
  // Trouver les doublons de sections
  const sectionMap = new Map();
  const duplicates = [];
  
  sections.forEach((section, index) => {
    const key = section.title.toUpperCase();
    
    if (sectionMap.has(key)) {
      // Doublon trouvé
      duplicates.push({
        title: section.title,
        index: section.index,
        originalIndex: sectionMap.get(key).index
      });
    } else {
      sectionMap.set(key, section);
    }
  });
  
  // Supprimer les doublons en commençant par la fin
  for (let i = duplicates.length - 1; i >= 0; i--) {
    const duplicate = duplicates[i];
    const duplicateStart = duplicate.index;
    
    // Trouver la fin de cette section (début de la section suivante)
    const nextSection = sections.find(s => s.index > duplicateStart);
    const duplicateEnd = nextSection ? nextSection.index : fixedBody.length;
    
    // Supprimer la section dupliquée
    fixedBody = fixedBody.substring(0, duplicateStart) + fixedBody.substring(duplicateEnd);
    changes.push(`Section dupliquée supprimée: "${duplicate.title}"`);
  }
  
  // Nettoyer les lignes vides multiples
  fixedBody = fixedBody.replace(/\n{4,}/g, '\n\n\n');
  
  return { fixedBody, changes };
}

console.log('\n🔧 Correction des sections dupliquées\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const processedArticles = [];
const errors = [];

allArticles.forEach(filePath => {
  try {
    const { fixedBody, changes } = fixDuplicateSections(filePath);
    
    if (changes.length > 0) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(content);
      
      const newContent = matter.stringify(fixedBody, data);
      fs.writeFileSync(filePath, newContent, 'utf-8');
      
      processedArticles.push({
        file: path.basename(filePath),
        changes
      });
      console.log(`   ✅ ${path.basename(filePath)}`);
      changes.forEach(change => {
        console.log(`      - ${change}`);
      });
    }
  } catch (error) {
    errors.push({
      file: path.basename(filePath),
      error: error.message
    });
    console.log(`   ❌ ${path.basename(filePath)}`);
    console.log(`      Erreur: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n📈 RÉSUMÉ:\n`);
console.log(`   Total articles: ${allArticles.length}`);
console.log(`   Articles modifiés: ${processedArticles.length}`);
console.log(`   Erreurs: ${errors.length}`);

if (errors.length > 0) {
  console.log('\n❌ Erreurs rencontrées:\n');
  errors.forEach(err => {
    console.log(`   ${err.file}: ${err.error}`);
  });
}

console.log('\n✅ Correction terminée\n');

