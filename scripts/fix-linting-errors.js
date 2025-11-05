import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToFix = [
  'src/content/articles/gestion-projet/gestion-performance-equipe.md',
  'src/content/articles/developpement-web/progressive-web-apps-2024.md',
  'src/content/articles/qualite-process/gestion-qualite-amelioration.md'
];

function fixLintingErrors(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // 1. Enlever les points finaux dans les titres H3
  content = content.replace(/### (.+?)\.$/gm, '### $1');
  
  // 2. Transformer les italiques en début de ligne (formules d'expertise) en paragraphes normaux
  content = content.replace(/^_([^_]+)_$/gm, '$1');
  
  // 3. Transformer les références markdown [^1]: en listes
  content = content.replace(/^\[(\^1|\^2|\^3|\^4)\]: (.+)$/gm, '- $2');
  
  // 4. Transformer les **Titre** en début de ligne en titres H4
  content = content.replace(/^\*\*([^*]+)\*\*$/gm, (match, title) => {
    // Si c'est un format de titre (contient ": " ou " - " ou est court)
    if (title.includes(': ') || title.includes(' - ') || title.length < 50) {
      return `#### ${title}`;
    }
    return match;
  });
  
  // 5. Ajouter le langage aux blocs de code vides
  content = content.replace(/```\n([^`]+)```/g, '```text\n$1```');
  
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`✅ Fixed: ${filePath}`);
}

filesToFix.forEach(file => {
  try {
    fixLintingErrors(file);
  } catch (error) {
    console.error(`❌ Error fixing ${file}:`, error.message);
  }
});

console.log('\n✅ All linting errors fixed!\n');

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToFix = [
  'src/content/articles/gestion-projet/gestion-performance-equipe.md',
  'src/content/articles/developpement-web/progressive-web-apps-2024.md',
  'src/content/articles/qualite-process/gestion-qualite-amelioration.md'
];

function fixLintingErrors(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // 1. Enlever les points finaux dans les titres H3
  content = content.replace(/### (.+?)\.$/gm, '### $1');
  
  // 2. Transformer les italiques en début de ligne (formules d'expertise) en paragraphes normaux
  content = content.replace(/^_([^_]+)_$/gm, '$1');
  
  // 3. Transformer les références markdown [^1]: en listes
  content = content.replace(/^\[(\^1|\^2|\^3|\^4)\]: (.+)$/gm, '- $2');
  
  // 4. Transformer les **Titre** en début de ligne en titres H4
  content = content.replace(/^\*\*([^*]+)\*\*$/gm, (match, title) => {
    // Si c'est un format de titre (contient ": " ou " - " ou est court)
    if (title.includes(': ') || title.includes(' - ') || title.length < 50) {
      return `#### ${title}`;
    }
    return match;
  });
  
  // 5. Ajouter le langage aux blocs de code vides
  content = content.replace(/```\n([^`]+)```/g, '```text\n$1```');
  
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`✅ Fixed: ${filePath}`);
}

filesToFix.forEach(file => {
  try {
    fixLintingErrors(file);
  } catch (error) {
    console.error(`❌ Error fixing ${file}:`, error.message);
  }
});

console.log('\n✅ All linting errors fixed!\n');

