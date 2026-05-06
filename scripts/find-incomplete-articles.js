import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const articlesDir = path.join(projectRoot, 'src/content/articles');

function getAllMdFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllMdFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function countPlaceholders(content) {
  const patterns = [
    /_Définition complète[^_]*_/g,
    /_Cas d'usage[^_]*_/g,
    /_Impact mesurable[^_]*_/g,
    /_Défi identifié[^_]*_/g,
    /_Composant essentiel[^_]*_/g,
    /_Approche éprouvée[^_]*_/g,
    /_Facteur de succès[^_]*_/g,
    /_Description détaillée[^_]*_/g,
    /_Critères établis[^_]*_/g,
    /_Exemples concrets[^_]*_/g,
    /_À compléter[^_]*_/g,
    /_Description du défi[^_]*_/g,
    /_Description de la[^_]*_/g,
    /_Définition principale : _[^_]*_\. Selon _[^_]*_ \(2024\)/g,
    /_Sur mes projets[^_]*_\./g,
    /_Mon expérience[^_]*_\./g
  ];
  
  let count = 0;
  patterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) count += matches.length;
  });
  
  return count;
}

const articles = getAllMdFiles(articlesDir);
const incomplete = [];

articles.forEach(article => {
  const content = fs.readFileSync(article, 'utf-8');
  const placeholderCount = countPlaceholders(content);
  
  if (placeholderCount > 0) {
    const relativePath = path.relative(projectRoot, article);
    incomplete.push({ path: relativePath, count: placeholderCount });
  }
});

console.log(`📋 Articles avec placeholders restants : ${incomplete.length}\n`);

incomplete.sort((a, b) => b.count - a.count).forEach(item => {
  console.log(`  - ${item.path}: ${item.count} placeholders`);
});

console.log(`\n✅ Total: ${incomplete.length} articles incomplets`);

