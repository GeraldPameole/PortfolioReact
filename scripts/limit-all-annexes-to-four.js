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

function limitAnnexesToFour(content) {
  // Trouver la section 7. ARTICLES ANNEXES
  const annexesMatch = content.match(/(##\s*7\.\s*ARTICLES\s+ANNEXES[\s\S]*?)(?=##|$)/i);
  if (!annexesMatch) {
    return { content, changed: false };
  }
  
  const annexesSection = annexesMatch[1];
  const annexesContent = annexesSection.replace(/^##\s*7\.\s*ARTICLES\s+ANNEXES\s*/i, '');
  
  // Extraire les articles annexes (format: 1. **[Titre](...))
  const lines = annexesContent.split('\n');
  const annexeItems = [];
  let currentItem = null;
  
  lines.forEach(line => {
    const itemMatch = line.match(/^(\d+)\.\s+\*\*\[/);
    if (itemMatch) {
      if (currentItem) {
        annexeItems.push(currentItem);
      }
      currentItem = { number: parseInt(itemMatch[1]), lines: [line] };
    } else if (currentItem) {
      if (line.trim() || currentItem.lines.length > 0) {
        currentItem.lines.push(line);
      }
    }
  });
  
  if (currentItem) {
    annexeItems.push(currentItem);
  }
  
  // Limiter à 4 articles
  if (annexeItems.length > 4) {
    const limitedItems = annexeItems.slice(0, 4);
    const newAnnexesContent = limitedItems.map((item, index) => {
      const newNumber = index + 1;
      return item.lines.map(line => line.replace(/^\d+\./, `${newNumber}.`)).join('\n');
    }).join('\n\n');
    
    const newAnnexesSection = `## 7. ARTICLES ANNEXES\n\n${newAnnexesContent.trim()}`;
    const newContent = content.replace(annexesMatch[1], newAnnexesSection);
    return { content: newContent, changed: true, oldCount: annexeItems.length };
  }
  
  return { content, changed: false };
}

// Traiter tous les articles
const articles = getAllMdFiles(articlesDir);
console.log(`📝 Traitement de ${articles.length} articles...\n`);

let fixedCount = 0;
articles.forEach(article => {
  try {
    const content = fs.readFileSync(article, 'utf-8');
    const result = limitAnnexesToFour(content);
    if (result.changed) {
      fs.writeFileSync(article, result.content, 'utf-8');
      console.log(`✅ ${path.relative(projectRoot, article)}: ${result.oldCount} → 4 annexes`);
      fixedCount++;
    }
  } catch (error) {
    console.error(`❌ ${article}:`, error.message);
  }
});

console.log(`\n✅ ${fixedCount} articles modifiés sur ${articles.length} !`);

