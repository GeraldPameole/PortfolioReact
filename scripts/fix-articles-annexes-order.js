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
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function fixAnnexesOrder(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let fixedContent = content;
  const changes = [];
  
  // Trouver les sections SOURCES ET RÉFÉRENCES et ARTICLES ANNEXES
  const sourcesPattern = /##\s+[0-9]?\.?\s*SOURCES\s+ET\s+RÉFÉRENCES/gi;
  const annexesPattern = /##\s+[0-9]?\.?\s*ARTICLES\s+ANNEXES/gi;
  
  const sourcesMatches = [...content.matchAll(sourcesPattern)];
  const annexesMatches = [...content.matchAll(annexesPattern)];
  
  if (sourcesMatches.length > 0 && annexesMatches.length > 0) {
    const sourcesIndex = sourcesMatches[0].index;
    const annexesIndex = annexesMatches[0].index;
    
    // Si ARTICLES ANNEXES est avant SOURCES ET RÉFÉRENCES, les inverser
    if (annexesIndex < sourcesIndex) {
      // Extraire les sections
      const sourcesMatch = content.match(/##\s+[0-9]?\.?\s*SOURCES\s+ET\s+RÉFÉRENCES[\s\S]*?(?=^##|$)/gi);
      const annexesMatch = content.match(/##\s+[0-9]?\.?\s*ARTICLES\s+ANNEXES[\s\S]*?(?=^##|$)/gi);
      
      if (sourcesMatch && annexesMatch) {
        // Trouver où se termine la section SOURCES
        const sourcesEnd = content.indexOf(sourcesMatch[0]) + sourcesMatch[0].length;
        const nextSectionAfterSources = content.substring(sourcesEnd).match(/^##\s+/m);
        const sourcesEndIndex = nextSectionAfterSources 
          ? sourcesEnd + nextSectionAfterSources.index
          : content.length;
        
        // Supprimer ARTICLES ANNEXES de sa position actuelle
        const annexesEnd = content.indexOf(annexesMatch[0]) + annexesMatch[0].length;
        const nextSectionAfterAnnexes = content.substring(annexesEnd).match(/^##\s+/m);
        const annexesEndIndex = nextSectionAfterAnnexes 
          ? annexesEnd + nextSectionAfterAnnexes.index
          : content.length;
        
        // Supprimer ARTICLES ANNEXES
        const beforeAnnexes = content.substring(0, annexesIndex);
        const afterAnnexes = content.substring(annexesEndIndex);
        fixedContent = beforeAnnexes + afterAnnexes;
        
        // Insérer ARTICLES ANNEXES après SOURCES ET RÉFÉRENCES
        const sourcesEndNew = fixedContent.indexOf(sourcesMatch[0]) + sourcesMatch[0].length;
        const nextSectionAfterSourcesNew = fixedContent.substring(sourcesEndNew).match(/^##\s+/m);
        const insertIndex = nextSectionAfterSourcesNew 
          ? sourcesEndNew + nextSectionAfterSourcesNew.index
          : fixedContent.length;
        
        // Ajuster la numérotation de ARTICLES ANNEXES
        const annexesSection = annexesMatch[0].replace(
          /##\s+[0-9]?\.?\s*ARTICLES\s+ANNEXES/gi,
          '## 7. ARTICLES ANNEXES'
        );
        
        fixedContent = fixedContent.substring(0, insertIndex) + 
                      '\n\n' + annexesSection + 
                      fixedContent.substring(insertIndex);
        
        changes.push('Ordre des sections corrigé (ARTICLES ANNEXES après SOURCES)');
      }
    }
  }
  
  // Harmoniser la numérotation : SOURCES = 6, ARTICLES ANNEXES = 7
  fixedContent = fixedContent.replace(
    /##\s+([0-9])\.\s+SOURCES\s+ET\s+RÉFÉRENCES/gi,
    '## 6. SOURCES ET RÉFÉRENCES'
  );
  
  fixedContent = fixedContent.replace(
    /##\s+([0-9])\.\s+ARTICLES\s+ANNEXES/gi,
    '## 7. ARTICLES ANNEXES'
  );
  
  return { fixedContent, changes };
}

console.log('\n🔧 Correction de l\'ordre des sections (ARTICLES ANNEXES après SOURCES)\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const processedArticles = [];
const errors = [];

allArticles.forEach(filePath => {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf-8');
    const { fixedContent, changes } = fixAnnexesOrder(filePath);
    
    if (changes.length > 0 || fixedContent !== originalContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf-8');
      processedArticles.push({
        file: path.relative(articlesDir, filePath),
        changes
      });
      if (changes.length > 0) {
        console.log(`✅ ${path.basename(filePath)}`);
        console.log(`   ${changes.join(', ')}`);
      }
    }
  } catch (error) {
    errors.push({
      file: path.relative(articlesDir, filePath),
      error: error.message
    });
    console.log(`❌ ${path.basename(filePath)}`);
    console.log(`   Erreur: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n📊 Résumé:\n`);
console.log(`   Total articles: ${allArticles.length}`);
console.log(`   Articles modifiés: ${processedArticles.length}`);
console.log(`   Erreurs: ${errors.length}`);

console.log('');

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
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function fixAnnexesOrder(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let fixedContent = content;
  const changes = [];
  
  // Trouver les sections SOURCES ET RÉFÉRENCES et ARTICLES ANNEXES
  const sourcesPattern = /##\s+[0-9]?\.?\s*SOURCES\s+ET\s+RÉFÉRENCES/gi;
  const annexesPattern = /##\s+[0-9]?\.?\s*ARTICLES\s+ANNEXES/gi;
  
  const sourcesMatches = [...content.matchAll(sourcesPattern)];
  const annexesMatches = [...content.matchAll(annexesPattern)];
  
  if (sourcesMatches.length > 0 && annexesMatches.length > 0) {
    const sourcesIndex = sourcesMatches[0].index;
    const annexesIndex = annexesMatches[0].index;
    
    // Si ARTICLES ANNEXES est avant SOURCES ET RÉFÉRENCES, les inverser
    if (annexesIndex < sourcesIndex) {
      // Extraire les sections
      const sourcesMatch = content.match(/##\s+[0-9]?\.?\s*SOURCES\s+ET\s+RÉFÉRENCES[\s\S]*?(?=^##|$)/gi);
      const annexesMatch = content.match(/##\s+[0-9]?\.?\s*ARTICLES\s+ANNEXES[\s\S]*?(?=^##|$)/gi);
      
      if (sourcesMatch && annexesMatch) {
        // Trouver où se termine la section SOURCES
        const sourcesEnd = content.indexOf(sourcesMatch[0]) + sourcesMatch[0].length;
        const nextSectionAfterSources = content.substring(sourcesEnd).match(/^##\s+/m);
        const sourcesEndIndex = nextSectionAfterSources 
          ? sourcesEnd + nextSectionAfterSources.index
          : content.length;
        
        // Supprimer ARTICLES ANNEXES de sa position actuelle
        const annexesEnd = content.indexOf(annexesMatch[0]) + annexesMatch[0].length;
        const nextSectionAfterAnnexes = content.substring(annexesEnd).match(/^##\s+/m);
        const annexesEndIndex = nextSectionAfterAnnexes 
          ? annexesEnd + nextSectionAfterAnnexes.index
          : content.length;
        
        // Supprimer ARTICLES ANNEXES
        const beforeAnnexes = content.substring(0, annexesIndex);
        const afterAnnexes = content.substring(annexesEndIndex);
        fixedContent = beforeAnnexes + afterAnnexes;
        
        // Insérer ARTICLES ANNEXES après SOURCES ET RÉFÉRENCES
        const sourcesEndNew = fixedContent.indexOf(sourcesMatch[0]) + sourcesMatch[0].length;
        const nextSectionAfterSourcesNew = fixedContent.substring(sourcesEndNew).match(/^##\s+/m);
        const insertIndex = nextSectionAfterSourcesNew 
          ? sourcesEndNew + nextSectionAfterSourcesNew.index
          : fixedContent.length;
        
        // Ajuster la numérotation de ARTICLES ANNEXES
        const annexesSection = annexesMatch[0].replace(
          /##\s+[0-9]?\.?\s*ARTICLES\s+ANNEXES/gi,
          '## 7. ARTICLES ANNEXES'
        );
        
        fixedContent = fixedContent.substring(0, insertIndex) + 
                      '\n\n' + annexesSection + 
                      fixedContent.substring(insertIndex);
        
        changes.push('Ordre des sections corrigé (ARTICLES ANNEXES après SOURCES)');
      }
    }
  }
  
  // Harmoniser la numérotation : SOURCES = 6, ARTICLES ANNEXES = 7
  fixedContent = fixedContent.replace(
    /##\s+([0-9])\.\s+SOURCES\s+ET\s+RÉFÉRENCES/gi,
    '## 6. SOURCES ET RÉFÉRENCES'
  );
  
  fixedContent = fixedContent.replace(
    /##\s+([0-9])\.\s+ARTICLES\s+ANNEXES/gi,
    '## 7. ARTICLES ANNEXES'
  );
  
  return { fixedContent, changes };
}

console.log('\n🔧 Correction de l\'ordre des sections (ARTICLES ANNEXES après SOURCES)\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const processedArticles = [];
const errors = [];

allArticles.forEach(filePath => {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf-8');
    const { fixedContent, changes } = fixAnnexesOrder(filePath);
    
    if (changes.length > 0 || fixedContent !== originalContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf-8');
      processedArticles.push({
        file: path.relative(articlesDir, filePath),
        changes
      });
      if (changes.length > 0) {
        console.log(`✅ ${path.basename(filePath)}`);
        console.log(`   ${changes.join(', ')}`);
      }
    }
  } catch (error) {
    errors.push({
      file: path.relative(articlesDir, filePath),
      error: error.message
    });
    console.log(`❌ ${path.basename(filePath)}`);
    console.log(`   Erreur: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n📊 Résumé:\n`);
console.log(`   Total articles: ${allArticles.length}`);
console.log(`   Articles modifiés: ${processedArticles.length}`);
console.log(`   Erreurs: ${errors.length}`);

console.log('');

