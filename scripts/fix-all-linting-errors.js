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

function fixAllErrors(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  let content = fs.readFileSync(fullPath, 'utf-8');
  let originalContent = content;
  
  // 1. Retirer les " :" de fin dans les titres H4
  content = content.replace(/^#### (.+?) :$/gm, '#### $1');
  
  // 2. Retirer les " :" de fin dans les titres H3
  content = content.replace(/^### (.+?) :$/gm, '### $1');
  
  // 3. Transformer les **Titre** en gras qui sont sur une ligne seule en H4
  // Mais seulement si ce n'est pas déjà un titre
  content = content.replace(/^\*\*([^*]+)\*\*$/gm, (match, title) => {
    // Si c'est un format qui ressemble à un titre (contient " :" ou est court)
    if (title.includes(':') || title.length < 60) {
      // Retirer les " :" si présents
      const cleanTitle = title.replace(/\s*:\s*$/, '');
      return `#### ${cleanTitle}`;
    }
    return match;
  });
  
  // 4. Corriger les titres dupliqués en ajoutant un numéro unique
  const headingCounts = {};
  content = content.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
    const key = `${hashes.length}-${title}`;
    if (headingCounts[key]) {
      headingCounts[key]++;
      return `${hashes} ${title} ${headingCounts[key]}`;
    } else {
      headingCounts[key] = 1;
      return match;
    }
  });
  
  // 5. Ajouter des lignes vides autour des blocs de code
  content = content.replace(/([^\n])\n```/g, '$1\n\n```');
  content = content.replace(/```\n([^\n])/g, '```\n\n$1');
  
  // 6. Ajouter un langage aux blocs de code sans langage (sauf si déjà présent)
  content = content.replace(/```\n([^`]+)```/g, (match, code) => {
    // Si le code commence par un mot-clé commun, utiliser ce langage
    const firstLine = code.trim().split('\n')[0].trim();
    if (firstLine.includes('function') || firstLine.includes('const') || firstLine.includes('let')) {
      return ````javascript\n${code}```\n`;
    }
    if (firstLine.includes('{') && firstLine.includes('}')) {
      return ````json\n${code}```\n`;
    }
    if (firstLine.includes('-') || firstLine.includes('*')) {
      return ````markdown\n${code}```\n`;
    }
    return ````text\n${code}```\n`;
  });
  
  // 7. Corriger les sauts de niveau de titre (H4 après H2 doit être H3)
  let lastLevel = 0;
  content = content.split('\n').map(line => {
    const hMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      // Si on saute de H2 à H4, passer à H3
      if (lastLevel === 2 && level === 4) {
        lastLevel = 3;
        return `### ${hMatch[2]}`;
      }
      lastLevel = level;
      return line;
    }
    return line;
  }).join('\n');
  
  // 8. Corriger les H1 multiples (garder seulement le premier)
  let h1Count = 0;
  content = content.split('\n').map(line => {
    if (line.match(/^#\s+[^#]/)) {
      h1Count++;
      if (h1Count > 1) {
        // Transformer les H1 supplémentaires en H2
        return line.replace(/^#\s+/, '## ');
      }
    }
    return line;
  }).join('\n');
  
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  return false;
}

filesToFix.forEach(file => {
  try {
    fixAllErrors(file);
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

function fixAllErrors(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  let content = fs.readFileSync(fullPath, 'utf-8');
  let originalContent = content;
  
  // 1. Retirer les " :" de fin dans les titres H4
  content = content.replace(/^#### (.+?) :$/gm, '#### $1');
  
  // 2. Retirer les " :" de fin dans les titres H3
  content = content.replace(/^### (.+?) :$/gm, '### $1');
  
  // 3. Transformer les **Titre** en gras qui sont sur une ligne seule en H4
  // Mais seulement si ce n'est pas déjà un titre
  content = content.replace(/^\*\*([^*]+)\*\*$/gm, (match, title) => {
    // Si c'est un format qui ressemble à un titre (contient " :" ou est court)
    if (title.includes(':') || title.length < 60) {
      // Retirer les " :" si présents
      const cleanTitle = title.replace(/\s*:\s*$/, '');
      return `#### ${cleanTitle}`;
    }
    return match;
  });
  
  // 4. Corriger les titres dupliqués en ajoutant un numéro unique
  const headingCounts = {};
  content = content.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
    const key = `${hashes.length}-${title}`;
    if (headingCounts[key]) {
      headingCounts[key]++;
      return `${hashes} ${title} ${headingCounts[key]}`;
    } else {
      headingCounts[key] = 1;
      return match;
    }
  });
  
  // 5. Ajouter des lignes vides autour des blocs de code
  content = content.replace(/([^\n])\n```/g, '$1\n\n```');
  content = content.replace(/```\n([^\n])/g, '```\n\n$1');
  
  // 6. Ajouter un langage aux blocs de code sans langage (sauf si déjà présent)
  content = content.replace(/```\n([^`]+)```/g, (match, code) => {
    // Si le code commence par un mot-clé commun, utiliser ce langage
    const firstLine = code.trim().split('\n')[0].trim();
    if (firstLine.includes('function') || firstLine.includes('const') || firstLine.includes('let')) {
      return ````javascript\n${code}```\n`;
    }
    if (firstLine.includes('{') && firstLine.includes('}')) {
      return ````json\n${code}```\n`;
    }
    if (firstLine.includes('-') || firstLine.includes('*')) {
      return ````markdown\n${code}```\n`;
    }
    return ````text\n${code}```\n`;
  });
  
  // 7. Corriger les sauts de niveau de titre (H4 après H2 doit être H3)
  let lastLevel = 0;
  content = content.split('\n').map(line => {
    const hMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      // Si on saute de H2 à H4, passer à H3
      if (lastLevel === 2 && level === 4) {
        lastLevel = 3;
        return `### ${hMatch[2]}`;
      }
      lastLevel = level;
      return line;
    }
    return line;
  }).join('\n');
  
  // 8. Corriger les H1 multiples (garder seulement le premier)
  let h1Count = 0;
  content = content.split('\n').map(line => {
    if (line.match(/^#\s+[^#]/)) {
      h1Count++;
      if (h1Count > 1) {
        // Transformer les H1 supplémentaires en H2
        return line.replace(/^#\s+/, '## ');
      }
    }
    return line;
  }).join('\n');
  
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  return false;
}

filesToFix.forEach(file => {
  try {
    fixAllErrors(file);
  } catch (error) {
    console.error(`❌ Error fixing ${file}:`, error.message);
  }
});

console.log('\n✅ All linting errors fixed!\n');

