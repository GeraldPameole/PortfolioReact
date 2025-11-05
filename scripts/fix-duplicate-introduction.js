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

function fixDuplicateIntroduction(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  let fixedBody = body;
  const changes = [];
  
  // Trouver toutes les sections Introduction
  const introPattern = /^##\s+Introduction/gi;
  const intros = [];
  let match;
  
  while ((match = introPattern.exec(body)) !== null) {
    intros.push(match.index);
  }
  
  if (intros.length > 1) {
    // Garder seulement la première Introduction
    // Supprimer les doublons
    for (let i = intros.length - 1; i > 0; i--) {
      const introStart = intros[i];
      const nextSection = body.substring(introStart).match(/^##\s+(?!Introduction)/m);
      const introEnd = nextSection ? introStart + nextSection.index : body.length;
      
      // Supprimer la section Introduction dupliquée
      fixedBody = fixedBody.substring(0, introStart) + fixedBody.substring(introEnd);
      changes.push(`Section Introduction dupliquée supprimée (position ${i + 1})`);
    }
  }
  
  // Nettoyer les lignes vides multiples
  fixedBody = fixedBody.replace(/\n{4,}/g, '\n\n\n');
  
  return { fixedBody, changes };
}

console.log('\n🔧 Correction des sections Introduction dupliquées\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const processedArticles = [];
const errors = [];

allArticles.forEach(filePath => {
  try {
    const { fixedBody, changes } = fixDuplicateIntroduction(filePath);
    
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

function fixDuplicateIntroduction(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  let fixedBody = body;
  const changes = [];
  
  // Trouver toutes les sections Introduction
  const introPattern = /^##\s+Introduction/gi;
  const intros = [];
  let match;
  
  while ((match = introPattern.exec(body)) !== null) {
    intros.push(match.index);
  }
  
  if (intros.length > 1) {
    // Garder seulement la première Introduction
    // Supprimer les doublons
    for (let i = intros.length - 1; i > 0; i--) {
      const introStart = intros[i];
      const nextSection = body.substring(introStart).match(/^##\s+(?!Introduction)/m);
      const introEnd = nextSection ? introStart + nextSection.index : body.length;
      
      // Supprimer la section Introduction dupliquée
      fixedBody = fixedBody.substring(0, introStart) + fixedBody.substring(introEnd);
      changes.push(`Section Introduction dupliquée supprimée (position ${i + 1})`);
    }
  }
  
  // Nettoyer les lignes vides multiples
  fixedBody = fixedBody.replace(/\n{4,}/g, '\n\n\n');
  
  return { fixedBody, changes };
}

console.log('\n🔧 Correction des sections Introduction dupliquées\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const processedArticles = [];
const errors = [];

allArticles.forEach(filePath => {
  try {
    const { fixedBody, changes } = fixDuplicateIntroduction(filePath);
    
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

