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

function fixLintingErrors(content) {
  // MD026: Trailing punctuation in heading (remove " :" from headings)
  content = content.replace(/^(#{1,6})\s+(.+?)\s*:\s*$/gm, '$1 $2');
  
  // MD036: Emphasis used instead of a heading
  // Convert **Titre** en #### Titre si c'est au début d'une ligne et ressemble à un titre
  content = content.replace(/^\*\*([^*]+)\*\*\s*$/gm, (match, title) => {
    // Vérifier si c'est vraiment un titre (pas trop long, pas de ponctuation finale)
    if (title.length < 60 && !title.match(/[\.!?]$/) && !title.includes('**')) {
      // Vérifier le contexte - ne pas convertir si c'est dans une liste ou un paragraphe
      return `#### ${title}`;
    }
    return match;
  });
  
  // MD012: Multiple consecutive blank lines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // MD032: Lists should be surrounded by blank lines
  // Ajouter une ligne vide avant une liste si nécessaire
  content = content.replace(/([^\n])\n([-*+]\s)/g, '$1\n\n$2');
  content = content.replace(/([^\n])\n(\d+\.\s)/g, '$1\n\n$2');
  
  return content;
}

const articles = getAllMdFiles(articlesDir);
console.log(`🔧 Correction manuelle des erreurs de linting dans ${articles.length} articles...\n`);

let fixed = 0;
articles.forEach(article => {
  try {
    const content = fs.readFileSync(article, 'utf-8');
    const newContent = fixLintingErrors(content);
    
    if (newContent !== content) {
      fs.writeFileSync(article, newContent, 'utf-8');
      fixed++;
      const relativePath = path.relative(projectRoot, article);
      console.log(`✅ ${relativePath}`);
    }
  } catch (error) {
    console.error(`❌ ${article}:`, error.message);
  }
});

console.log(`\n✅ ${fixed} articles corrigés !`);

