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

function fixFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);
  
  let modified = false;
  
  // Fix publishDate: doit être une string
  if (frontmatter.publishDate && typeof frontmatter.publishDate !== 'string') {
    frontmatter.publishDate = String(frontmatter.publishDate);
    modified = true;
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
    // Reconstruire le frontmatter avec les corrections
    const newFrontmatter = Object.entries(frontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}:\n${value.map(v => `  - ${typeof v === 'string' && (v.includes(':') || v.includes("'") || v.includes('"')) ? JSON.stringify(v) : v}`).join('\n')}`;
        }
        if (typeof value === 'string' && (value.includes(':') || value.includes("'") || value.includes('"') || value.match(/^\d{4}-\d{2}-\d{2}$/))) {
          return `${key}: ${JSON.stringify(value)}`;
        }
        return `${key}: ${value}`;
      })
      .join('\n');
    
    const newContent = `---\n${newFrontmatter}\n---\n\n${body}`;
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
  if (fixFrontmatter(filePath)) {
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

function fixFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);
  
  let modified = false;
  
  // Fix publishDate: doit être une string
  if (frontmatter.publishDate && typeof frontmatter.publishDate !== 'string') {
    frontmatter.publishDate = String(frontmatter.publishDate);
    modified = true;
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
    // Reconstruire le frontmatter avec les corrections
    const newFrontmatter = Object.entries(frontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}:\n${value.map(v => `  - ${typeof v === 'string' && (v.includes(':') || v.includes("'") || v.includes('"')) ? JSON.stringify(v) : v}`).join('\n')}`;
        }
        if (typeof value === 'string' && (value.includes(':') || value.includes("'") || value.includes('"') || value.match(/^\d{4}-\d{2}-\d{2}$/))) {
          return `${key}: ${JSON.stringify(value)}`;
        }
        return `${key}: ${value}`;
      })
      .join('\n');
    
    const newContent = `---\n${newFrontmatter}\n---\n\n${body}`;
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
  if (fixFrontmatter(filePath)) {
    console.log(`✅ ${fileName} corrigé`);
    fixedCount++;
  } else {
    console.log(`⏭️  ${fileName} - OK`);
  }
});

console.log(`\n✅ ${fixedCount} articles corrigés`);

