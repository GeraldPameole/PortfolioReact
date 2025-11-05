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

function formatDate(dateValue) {
  if (typeof dateValue === 'string') {
    // Si c'est déjà une string au format YYYY-MM-DD, la retourner
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }
    // Si c'est une date parsée, la convertir
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return dateValue;
  }
  if (dateValue instanceof Date) {
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return String(dateValue);
}

function fixFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);
  
  let modified = false;
  
  // Fix publishDate: doit être une string au format YYYY-MM-DD
  if (frontmatter.publishDate) {
    const formattedDate = formatDate(frontmatter.publishDate);
    if (formattedDate !== frontmatter.publishDate) {
      frontmatter.publishDate = formattedDate;
      modified = true;
    }
  }
  
  // Fix keywords: tous les éléments doivent être des strings
  if (frontmatter.keywords && Array.isArray(frontmatter.keywords)) {
    const fixedKeywords = frontmatter.keywords.map(kw => {
      if (typeof kw !== 'string') {
        return String(kw);
      }
      return kw;
    });
    
    if (JSON.stringify(fixedKeywords) !== JSON.stringify(frontmatter.keywords)) {
      frontmatter.keywords = fixedKeywords;
      modified = true;
    }
  }
  
  if (modified) {
    // Reconstruire le contenu avec gray-matter
    const newContent = matter.stringify(body, frontmatter, {
      lineWidth: Infinity,
      flowLevel: -1
    });
    
    fs.writeFileSync(filePath, newContent, 'utf-8');
    return true;
  }
  
  return false;
}

// Traiter tous les articles
const files = getAllMdFiles(articlesDir);
let fixedCount = 0;

console.log('Correction des erreurs de schéma frontmatter...\n');

files.forEach((filePath) => {
  const fileName = path.basename(filePath);
  try {
    if (fixFrontmatter(filePath)) {
      console.log(`✅ ${fileName} corrigé`);
      fixedCount++;
    } else {
      console.log(`⏭️  ${fileName} - OK`);
    }
  } catch (error) {
    console.log(`❌ ${fileName} - Erreur: ${error.message}`);
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

function formatDate(dateValue) {
  if (typeof dateValue === 'string') {
    // Si c'est déjà une string au format YYYY-MM-DD, la retourner
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }
    // Si c'est une date parsée, la convertir
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return dateValue;
  }
  if (dateValue instanceof Date) {
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return String(dateValue);
}

function fixFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);
  
  let modified = false;
  
  // Fix publishDate: doit être une string au format YYYY-MM-DD
  if (frontmatter.publishDate) {
    const formattedDate = formatDate(frontmatter.publishDate);
    if (formattedDate !== frontmatter.publishDate) {
      frontmatter.publishDate = formattedDate;
      modified = true;
    }
  }
  
  // Fix keywords: tous les éléments doivent être des strings
  if (frontmatter.keywords && Array.isArray(frontmatter.keywords)) {
    const fixedKeywords = frontmatter.keywords.map(kw => {
      if (typeof kw !== 'string') {
        return String(kw);
      }
      return kw;
    });
    
    if (JSON.stringify(fixedKeywords) !== JSON.stringify(frontmatter.keywords)) {
      frontmatter.keywords = fixedKeywords;
      modified = true;
    }
  }
  
  if (modified) {
    // Reconstruire le contenu avec gray-matter
    const newContent = matter.stringify(body, frontmatter, {
      lineWidth: Infinity,
      flowLevel: -1
    });
    
    fs.writeFileSync(filePath, newContent, 'utf-8');
    return true;
  }
  
  return false;
}

// Traiter tous les articles
const files = getAllMdFiles(articlesDir);
let fixedCount = 0;

console.log('Correction des erreurs de schéma frontmatter...\n');

files.forEach((filePath) => {
  const fileName = path.basename(filePath);
  try {
    if (fixFrontmatter(filePath)) {
      console.log(`✅ ${fileName} corrigé`);
      fixedCount++;
    } else {
      console.log(`⏭️  ${fileName} - OK`);
    }
  } catch (error) {
    console.log(`❌ ${fileName} - Erreur: ${error.message}`);
  }
});

console.log(`\n✅ ${fixedCount} articles corrigés`);

