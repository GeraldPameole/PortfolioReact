import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

// Pattern pour identifier les sections incomplètes
const incompleteSectionPattern = /##\s+[\d.]+\s+[A-Z\s]+(?:[\s\S]*?)(?:###\s+[A-Z\s.]+\.\d+\s+Sous-section Principale[\s\S]*?\*\*Contenu à compléter selon ARTICLES_RULES\.md\*\*[\s\S]*?_Définition, concepts clés, impacts et enjeux pour cette section\._[\s\S]*?)(?=##|$)/g;

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

function removeIncompleteSections(content) {
  let cleaned = content;
  
  // Supprimer les sections placeholder
  // Pattern 1: Section avec "Sous-section Principale" et "Contenu à compléter"
  cleaned = cleaned.replace(/###\s+[A-Z\s.]+\.\d+\s+Sous-section Principale\s*\n\s*\*\*Contenu à compléter selon ARTICLES_RULES\.md\*\*\s*\n\s*_Définition, concepts clés, impacts et enjeux pour cette section\._\s*\n+/g, '');
  
  // Pattern 2: Sections complètes avec titre de section principale vide
  cleaned = cleaned.replace(/##\s+[\d.]+\s+[A-Z\s]+\s*\n\s*###\s+[A-Z\s.]+\.\d+\s+Sous-section Principale\s*\n\s*\*\*Contenu à compléter selon ARTICLES_RULES\.md\*\*\s*\n\s*_Définition, concepts clés, impacts et enjeux pour cette section\._\s*\n+\s*(?=##|$)/g, '');
  
  // Supprimer les lignes vides multiples (plus de 2 lignes vides consécutives)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  return cleaned;
}

function fixArticle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const cleaned = removeIncompleteSections(content);
    
    if (content !== cleaned) {
      fs.writeFileSync(filePath, cleaned, 'utf-8');
      console.log(`✅ Fixed: ${path.relative(articlesDir, filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
const allFiles = getAllMdFiles(articlesDir);
let fixedCount = 0;

console.log(`\n🔍 Analyzing ${allFiles.length} articles...\n`);

allFiles.forEach(file => {
  if (fixArticle(file)) {
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} articles with incomplete sections.\n`);

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

// Pattern pour identifier les sections incomplètes
const incompleteSectionPattern = /##\s+[\d.]+\s+[A-Z\s]+(?:[\s\S]*?)(?:###\s+[A-Z\s.]+\.\d+\s+Sous-section Principale[\s\S]*?\*\*Contenu à compléter selon ARTICLES_RULES\.md\*\*[\s\S]*?_Définition, concepts clés, impacts et enjeux pour cette section\._[\s\S]*?)(?=##|$)/g;

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

function removeIncompleteSections(content) {
  let cleaned = content;
  
  // Supprimer les sections placeholder
  // Pattern 1: Section avec "Sous-section Principale" et "Contenu à compléter"
  cleaned = cleaned.replace(/###\s+[A-Z\s.]+\.\d+\s+Sous-section Principale\s*\n\s*\*\*Contenu à compléter selon ARTICLES_RULES\.md\*\*\s*\n\s*_Définition, concepts clés, impacts et enjeux pour cette section\._\s*\n+/g, '');
  
  // Pattern 2: Sections complètes avec titre de section principale vide
  cleaned = cleaned.replace(/##\s+[\d.]+\s+[A-Z\s]+\s*\n\s*###\s+[A-Z\s.]+\.\d+\s+Sous-section Principale\s*\n\s*\*\*Contenu à compléter selon ARTICLES_RULES\.md\*\*\s*\n\s*_Définition, concepts clés, impacts et enjeux pour cette section\._\s*\n+\s*(?=##|$)/g, '');
  
  // Supprimer les lignes vides multiples (plus de 2 lignes vides consécutives)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  return cleaned;
}

function fixArticle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const cleaned = removeIncompleteSections(content);
    
    if (content !== cleaned) {
      fs.writeFileSync(filePath, cleaned, 'utf-8');
      console.log(`✅ Fixed: ${path.relative(articlesDir, filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
const allFiles = getAllMdFiles(articlesDir);
let fixedCount = 0;

console.log(`\n🔍 Analyzing ${allFiles.length} articles...\n`);

allFiles.forEach(file => {
  if (fixArticle(file)) {
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} articles with incomplete sections.\n`);

