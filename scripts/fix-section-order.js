import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixSectionOrder(content) {
  const lines = content.split('\n');
  const section8Index = lines.findIndex(line => /^##\s+8\.?\s*LIVRES/i.test(line));
  const section7Index = lines.findIndex(line => /^##\s+7\.?\s*ARTICLES/i.test(line));
  
  if (section8Index !== -1 && section7Index !== -1 && section8Index < section7Index) {
    // Trouver où commence et se termine la section 8
    let section8Start = section8Index;
    let section8End = section8Index + 1;
    
    // Trouver la fin de la section 8 (prochaine section ou fin du fichier)
    for (let i = section8Index + 1; i < lines.length; i++) {
      if (/^##\s+\d+\.?\s*/.test(lines[i])) {
        section8End = i;
        break;
      }
    }
    if (section8End === section8Index + 1) {
      section8End = lines.length;
    }
    
    // Extraire la section 8
    const section8 = lines.slice(section8Start, section8End);
    
    // Trouver où se termine la section 7
    let section7End = section7Index + 1;
    for (let i = section7Index + 1; i < lines.length; i++) {
      if (/^##\s+\d+\.?\s*/.test(lines[i])) {
        section7End = i;
        break;
      }
    }
    if (section7End === section7Index + 1) {
      section7End = lines.length;
    }
    
    // Reconstruire le contenu avec la section 8 après la section 7
    const beforeSection8 = lines.slice(0, section8Start);
    const afterSection8 = lines.slice(section8End);
    const section7 = lines.slice(section7Index, section7End);
    const afterSection7 = afterSection8.slice(0, afterSection8.findIndex((line, idx) => 
      idx > 0 && /^##\s+\d+\.?\s*/.test(line)
    ));
    const rest = afterSection8.slice(afterSection8.findIndex((line, idx) => 
      idx > 0 && /^##\s+\d+\.?\s*/.test(line)
    ));
    
    // Nouvelle structure : avant section 8, section 7, section 8, reste
    const newContent = [
      ...beforeSection8,
      ...section7,
      ...section8,
      ...rest
    ].join('\n');
    
    return { content: newContent, fixed: true };
  }
  
  return { content, fixed: false };
}

function processArticle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { content: fixedContent, fixed } = fixSectionOrder(content);
    
    if (fixed) {
      fs.writeFileSync(filePath, fixedContent, 'utf-8');
      return { filePath, status: 'updated' };
    }
    
    return { filePath, status: 'no_changes' };
  } catch (error) {
    return { filePath, error: error.message, status: 'error' };
  }
}

function main() {
  const articlesDir = path.join(__dirname, '../src/content/articles');
  const results = [];
  
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
      }
    }
  }
  
  walkDir(articlesDir);
  
  const updated = results.filter(r => r.status === 'updated');
  
  if (updated.length > 0) {
    console.log(`\n✅ ${updated.length} articles corrigés (ordre sections 7 et 8)\n`);
  } else {
    console.log('\n✅ Aucun problème d\'ordre de sections détecté\n');
  }
}

main();



