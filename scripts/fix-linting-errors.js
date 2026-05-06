import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixMD001(content) {
  // MD001: Heading levels should only increment by one level at a time
  const lines = content.split('\n');
  const fixed = [];
  let lastLevel = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      const currentLevel = headingMatch[1].length;
      
      if (currentLevel > lastLevel + 1 && lastLevel > 0) {
        // Corriger en utilisant le niveau suivant logique
        const correctLevel = lastLevel + 1;
        const fixedLine = '#'.repeat(correctLevel) + ' ' + headingMatch[2];
        fixed.push(fixedLine);
        lastLevel = correctLevel;
      } else {
        fixed.push(line);
        lastLevel = currentLevel;
      }
    } else {
      fixed.push(line);
      // Réinitialiser si on n'est plus dans une structure de titres
      if (line.trim() === '' || !line.match(/^[#\s]/)) {
        lastLevel = 0;
      }
    }
  }
  
  return fixed.join('\n');
}

function fixMD022(content) {
  // MD022: Headings should be surrounded by blank lines
  const lines = content.split('\n');
  const fixed = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isHeading = /^#{1,6}\s+/.test(line);
    const prevLine = i > 0 ? lines[i - 1] : '';
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
    
    if (isHeading) {
      // Ajouter une ligne vide avant si nécessaire
      if (i > 0 && prevLine.trim() !== '' && !prevLine.match(/^#{1,6}\s+/)) {
        fixed.push('');
      }
      fixed.push(line);
      // Ajouter une ligne vide après si nécessaire
      if (i < lines.length - 1 && nextLine.trim() !== '' && !nextLine.match(/^#{1,6}\s+/) && !nextLine.match(/^[-*+]\s/)) {
        fixed.push('');
      }
    } else {
      fixed.push(line);
    }
  }
  
  return fixed.join('\n');
}

function fixMD024(content) {
  // MD024: Multiple headings with the same content
  const lines = content.split('\n');
  const seenHeadings = new Map();
  const fixed = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
    
    if (headingMatch) {
      const title = headingMatch[1].trim();
      const normalized = title.toLowerCase().replace(/[^\w\s]/g, '');
      
      if (seenHeadings.has(normalized)) {
        // Renommer en ajoutant un numéro
        const count = seenHeadings.get(normalized) + 1;
        seenHeadings.set(normalized, count);
        const newTitle = `${title} (${count})`;
        fixed.push(line.replace(title, newTitle));
      } else {
        seenHeadings.set(normalized, 1);
        fixed.push(line);
      }
    } else {
      fixed.push(line);
    }
  }
  
  return fixed.join('\n');
}

function fixMD026(content) {
  // MD026: Trailing punctuation in heading
  const lines = content.split('\n');
  const fixed = [];
  
  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6}\s+)(.+)$/);
    if (headingMatch) {
      let title = headingMatch[2];
      // Supprimer la ponctuation finale (. ! ? :)
      title = title.replace(/[.!?:]+$/, '');
      fixed.push(headingMatch[1] + title);
    } else {
      fixed.push(line);
    }
  }
  
  return fixed.join('\n');
}

function fixMD032(content) {
  // MD032: Lists should be surrounded by blank lines
  const lines = content.split('\n');
  const fixed = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isListItem = /^\s*[-*+]\s+/.test(line) || /^\s*\d+\.\s+/.test(line);
    const prevLine = i > 0 ? lines[i - 1] : '';
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
    const prevIsListItem = /^\s*[-*+]\s+/.test(prevLine) || /^\s*\d+\.\s+/.test(prevLine);
    const nextIsListItem = /^\s*[-*+]\s+/.test(nextLine) || /^\s*\d+\.\s+/.test(nextLine);
    
    if (isListItem) {
      // Ajouter une ligne vide avant si nécessaire
      if (i > 0 && prevLine.trim() !== '' && !prevIsListItem && !prevLine.match(/^#{1,6}\s+/)) {
        fixed.push('');
      }
      fixed.push(line);
      // Ajouter une ligne vide après si nécessaire
      if (i < lines.length - 1 && nextLine.trim() !== '' && !nextIsListItem && !nextLine.match(/^#{1,6}\s+/)) {
        fixed.push('');
      }
    } else {
      fixed.push(line);
    }
  }
  
  return fixed.join('\n');
}

function fixMD036(content) {
  // MD036: Emphasis used instead of a heading
  const lines = content.split('\n');
  const fixed = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prevLine = i > 0 ? lines[i - 1] : '';
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
    
    // Détecter les lignes avec seulement du texte en gras/italique qui ressemblent à des titres
    const emphasisMatch = line.match(/^(\s*)(\*\*|__)(.+?)(\*\*|__)(\s*)$/);
    
    if (emphasisMatch && 
        prevLine.trim() === '' && 
        (nextLine.trim() === '' || /^[-*+]\s+/.test(nextLine) || /^#{1,6}\s+/.test(nextLine))) {
      // Convertir en titre
      const indent = emphasisMatch[1];
      const text = emphasisMatch[3].trim();
      // Déterminer le niveau de titre approprié (h4 généralement)
      fixed.push(indent + '#### ' + text);
    } else {
      fixed.push(line);
    }
  }
  
  return fixed.join('\n');
}

function fixMD058(content) {
  // MD058: Tables should be surrounded by blank lines
  const lines = content.split('\n');
  const fixed = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isTableLine = /^\s*\|/.test(line);
    const prevLine = i > 0 ? lines[i - 1] : '';
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
    const prevIsTableLine = /^\s*\|/.test(prevLine);
    const nextIsTableLine = /^\s*\|/.test(nextLine);
    
    if (isTableLine) {
      // Ajouter une ligne vide avant si nécessaire
      if (i > 0 && prevLine.trim() !== '' && !prevIsTableLine && !prevLine.match(/^#{1,6}\s+/)) {
        fixed.push('');
      }
      fixed.push(line);
      // Ajouter une ligne vide après si nécessaire
      if (i < lines.length - 1 && nextLine.trim() !== '' && !nextIsTableLine && !nextLine.match(/^#{1,6}\s+/)) {
        fixed.push('');
      }
    } else {
      fixed.push(line);
    }
  }
  
  return fixed.join('\n');
}

function processArticle(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let changes = 0;
    
    // Appliquer toutes les corrections
    const afterMD001 = fixMD001(content);
    if (afterMD001 !== content) changes++;
    content = afterMD001;
    
    const afterMD022 = fixMD022(content);
    if (afterMD022 !== content) changes++;
    content = afterMD022;
    
    const afterMD024 = fixMD024(content);
    if (afterMD024 !== content) changes++;
    content = afterMD024;
    
    const afterMD026 = fixMD026(content);
    if (afterMD026 !== content) changes++;
    content = afterMD026;
    
    const afterMD032 = fixMD032(content);
    if (afterMD032 !== content) changes++;
    content = afterMD032;
    
    const afterMD036 = fixMD036(content);
    if (afterMD036 !== content) changes++;
    content = afterMD036;
    
    const afterMD058 = fixMD058(content);
    if (afterMD058 !== content) changes++;
    content = afterMD058;
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return {
        filePath,
        changes,
        status: 'updated'
      };
    }
    
    return {
      filePath,
      changes: 0,
      status: 'no_changes'
    };
  } catch (error) {
    return {
      filePath,
      error: error.message,
      status: 'error'
    };
  }
}

function main() {
  const articlesDir = path.join(__dirname, '../src/content/articles');
  const results = [];
  let totalChanges = 0;
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.md')) {
        const result = processArticle(filePath);
        results.push(result);
        if (result.changes) totalChanges += result.changes;
      }
    }
  }
  
  walkDir(articlesDir);
  
  console.log('\n📊 Correction des erreurs de linting:\n');
  console.log(`Total articles traités: ${results.length}`);
  console.log(`Total corrections appliquées: ${totalChanges}\n`);
  
  const updated = results.filter(r => r.status === 'updated');
  const errors = results.filter(r => r.status === 'error');
  
  if (updated.length > 0) {
    console.log(`✅ Articles mis à jour: ${updated.length}`);
    updated.slice(0, 10).forEach(r => {
      console.log(`   - ${path.basename(r.filePath)}: ${r.changes} corrections`);
    });
    if (updated.length > 10) {
      console.log(`   ... et ${updated.length - 10} autres articles`);
    }
  }
  
  if (errors.length > 0) {
    console.log(`\n❌ Erreurs: ${errors.length}`);
    errors.slice(0, 5).forEach(r => {
      console.log(`   - ${path.basename(r.filePath)}: ${r.error}`);
    });
  }
  
  console.log('\n');
}

main();



