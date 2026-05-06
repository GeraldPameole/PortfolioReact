import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');
const files = glob.sync('**/*.md', { cwd: articlesDir });

console.log(`🔧 Correction des erreurs YAML dans ${files.length} fichiers...\n`);

let fixedCount = 0;
let errorCount = 0;
let skippedCount = 0;

function extractDomainFromPath(filePath) {
  const match = filePath.match(/articles\/([^/]+)\//);
  return match ? match[1] : null;
}

function fixFrontmatter(content, filePath) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return { content, modified: false };
  }
  
  let frontmatterText = frontmatterMatch[1];
  const restOfContent = content.substring(frontmatterMatch[0].length);
  let modified = false;
  
  // 1. Corriger description >- avec - mal formaté
  if (frontmatterText.match(/^description >-\s*$/m)) {
    const descMatch = frontmatterText.match(/^description >-\s*\n\s*-\s*\n\s*(.*?)(?=\n\s*[a-zA-Z])/ms);
    if (descMatch) {
      const descText = descMatch[1].trim();
      frontmatterText = frontmatterText.replace(
        /^description >-\s*\n\s*-\s*\n\s*.*?(?=\n\s*[a-zA-Z])/ms,
        `description: >-\n  ${descText.split('\n').map(l => l.trim()).join('\n  ')}`
      );
      modified = true;
    }
  }
  
  // 2. Corriger title >- avec - mal formaté
  if (frontmatterText.match(/^title >-\s*$/m)) {
    const titleMatch = frontmatterText.match(/^title >-\s*\n\s*-\s*\n\s*(.*?)(?=\n\s*[a-zA-Z])/ms);
    if (titleMatch) {
      const titleText = titleMatch[1].trim();
      frontmatterText = frontmatterText.replace(
        /^title >-\s*\n\s*-\s*\n\s*.*?(?=\n\s*[a-zA-Z])/ms,
        `title: "${titleText.split('\n').map(l => l.trim()).join(' ')}"`
      );
      modified = true;
    }
  }
  
  // 3. CORRECTION PRINCIPALE : Corriger les champs indentés incorrectement (2 espaces au début)
  const topLevelFields = ['author', 'type', 'featured', 'readingTime', 'hasMermaid', 
    'targetAudience', 'domain', 'tags', 'relatedArticles', 'pillColor', 'theme', 
    'keywords', 'lastUpdated', 'publishDate', 'wordCount', 'enriched', 'skills', 
    'draft', 'title', 'description'];
  
  topLevelFields.forEach(field => {
    // Remplacer les champs avec 2 espaces d'indentation par aucun espace
    const regex = new RegExp(`^\\s{2}${field}:`, 'gm');
    if (frontmatterText.match(regex)) {
      frontmatterText = frontmatterText.replace(regex, `${field}:`);
      modified = true;
    }
  });
  
  // 4. Corriger les mots collés ensemble
  const beforeCollision = frontmatterText;
  frontmatterText = frontmatterText.replace(
    /([a-z])(lastUpdated|publishDate|wordCount|enriched|skills|draft|title|author|type|featured|readingTime|hasMermaid|targetAudience|domain|tags|relatedArticles|pillColor|theme|keywords):/g,
    '$1\n$2:'
  );
  if (beforeCollision !== frontmatterText) {
    modified = true;
  }
  
  // 5. Corriger les domaines dupliqués
  const domainMatches = frontmatterText.match(/^domain:\s*(.+)$/gm);
  if (domainMatches && domainMatches.length > 1) {
    let firstDomain = true;
    frontmatterText = frontmatterText.replace(/^domain:\s*(.+)$/gm, (match, value) => {
      if (firstDomain) {
        firstDomain = false;
        return match;
      }
      return '';
    });
    modified = true;
  }
  
  // 6. Corriger les relatedArticles mal formatés
  if (frontmatterText.match(/relatedArticles:\s*\n\s*-\s*publishDate:/m)) {
    frontmatterText = frontmatterText.replace(
      /relatedArticles:\s*\n(\s*-\s*(publishDate|keywords):\s*.*?\n)+(\s*-\s*\[)/gm,
      'relatedArticles: []'
    );
    modified = true;
  }
  
  // 7. Corriger les listes mal formatées avec des virgules dans tags/keywords
  frontmatterText = frontmatterText.replace(
    /(tags|keywords):\s*\n\s*-\s*\[\s*\n\s*-\s*#([^,\n]+),/gm,
    '$1:\n  - $2'
  );
  
  // 8. Corriger les tags vides
  if (frontmatterText.match(/^tags:\s*$/m) && !frontmatterText.match(/^tags:\s*\n\s*-/m)) {
    const domain = extractDomainFromPath(filePath);
    if (domain) {
      frontmatterText = frontmatterText.replace(/^tags:\s*$/m, `tags:\n  - ${domain}`);
      modified = true;
    }
  }
  
  // 9. Nettoyer les lignes vides multiples
  frontmatterText = frontmatterText.replace(/\n{3,}/g, '\n\n');
  frontmatterText = frontmatterText.trim();
  
  // Vérifier que le YAML est valide
  try {
    yaml.load(frontmatterText);
  } catch (error) {
    // Si toujours invalide, reconstruction complète
    const fields = {};
    const lines = frontmatterText.split('\n');
    let currentKey = null;
    let currentValue = [];
    let inMultiline = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      if (!trimmed) {
        if (inMultiline && currentValue.length > 0) {
          inMultiline = false;
        }
        continue;
      }
      
      const keyMatch = line.match(/^([a-zA-Z][a-zA-Z0-9_-]*):\s*(.*)$/);
      if (keyMatch && !inMultiline) {
        if (currentKey) {
          fields[currentKey] = inMultiline 
            ? currentValue.join('\n').trim() 
            : currentValue.join(' ').trim();
        }
        
        currentKey = keyMatch[1];
        const value = keyMatch[2].trim();
        
        if (value.startsWith('>') || value.startsWith('>-')) {
          inMultiline = true;
          currentValue = [];
        } else if (value.startsWith('[') || value === '') {
          fields[currentKey] = [];
          currentKey = null;
        } else {
          fields[currentKey] = value.replace(/^['"]|['"]$/g, '');
          currentKey = null;
        }
        continue;
      }
      
      if (line.match(/^\s*-\s+/)) {
        const item = line.replace(/^\s*-\s+/, '').trim().replace(/^['"]|['"]$/g, '');
        if (currentKey) {
          if (!fields[currentKey]) fields[currentKey] = [];
          if (Array.isArray(fields[currentKey])) {
            fields[currentKey].push(item);
          }
        }
        continue;
      }
      
      if (inMultiline && currentKey) {
        currentValue.push(line.replace(/^\s{2}/, ''));
        continue;
      }
    }
    
    if (currentKey) {
      fields[currentKey] = inMultiline 
        ? currentValue.join('\n').trim() 
        : currentValue.join(' ').trim();
    }
    
    // Reconstruire le frontmatter proprement
    const domain = extractDomainFromPath(filePath);
    const newFrontmatter = [];
    
    if (fields.title) {
      const title = typeof fields.title === 'string' ? fields.title.replace(/^-\s*/, '').trim() : fields.title;
      newFrontmatter.push(`title: "${title.split('\n').map(l => l.trim()).join(' ')}"`);
    }
    if (fields.description) {
      const desc = typeof fields.description === 'string' 
        ? fields.description.replace(/^-\s*/, '').trim()
        : fields.description;
      newFrontmatter.push(`description: >-\n  ${desc.split('\n').map(l => l.trim()).join('\n  ')}`);
    }
    if (fields.author) newFrontmatter.push(`author: ${fields.author}`);
    if (fields.type) newFrontmatter.push(`type: ${fields.type}`);
    if (fields.featured !== undefined) newFrontmatter.push(`featured: ${fields.featured}`);
    if (fields.readingTime) newFrontmatter.push(`readingTime: ${fields.readingTime}`);
    if (fields.hasMermaid !== undefined) newFrontmatter.push(`hasMermaid: ${fields.hasMermaid}`);
    if (fields.targetAudience) newFrontmatter.push(`targetAudience: "${fields.targetAudience}"`);
    if (domain) newFrontmatter.push(`domain: ${domain}`);
    if (fields.tags && Array.isArray(fields.tags) && fields.tags.length > 0) {
      const cleanTags = fields.tags.filter(t => t && !t.includes(':') && !t.includes('[') && !t.startsWith('#'));
      if (cleanTags.length > 0) {
        newFrontmatter.push(`tags:\n${cleanTags.map(t => `  - ${t}`).join('\n')}`);
      } else if (domain) {
        newFrontmatter.push(`tags:\n  - ${domain}`);
      }
    } else if (domain) {
      newFrontmatter.push(`tags:\n  - ${domain}`);
    }
    if (fields.pillColor) newFrontmatter.push(`pillColor: ${fields.pillColor}`);
    if (fields.theme) newFrontmatter.push(`theme: ${fields.theme}`);
    if (fields.keywords && Array.isArray(fields.keywords) && fields.keywords.length > 0) {
      const cleanKeywords = fields.keywords.filter(k => k && !k.includes(':') && !k.includes('[') && !k.startsWith('#'));
      if (cleanKeywords.length > 0) {
        newFrontmatter.push(`keywords:\n${cleanKeywords.map(k => `  - ${k}`).join('\n')}`);
      }
    }
    if (fields.lastUpdated) newFrontmatter.push(`lastUpdated: "${fields.lastUpdated}"`);
    if (fields.publishDate) newFrontmatter.push(`publishDate: "${fields.publishDate}"`);
    if (fields.wordCount) newFrontmatter.push(`wordCount: ${fields.wordCount}`);
    if (fields.enriched !== undefined) newFrontmatter.push(`enriched: ${fields.enriched}`);
    if (fields.skills && Array.isArray(fields.skills)) {
      newFrontmatter.push(`skills:\n${fields.skills.map(s => `  - ${s}`).join('\n')}`);
    }
    if (fields.relatedArticles) {
      newFrontmatter.push(`relatedArticles: []`);
    }
    
    frontmatterText = newFrontmatter.join('\n');
    modified = true;
    
    try {
      yaml.load(frontmatterText);
    } catch (e) {
      console.error(`❌ Impossible de corriger ${filePath}: ${e.message}`);
      return { content, modified: false };
    }
  }
  
  if (modified) {
    const newContent = `---\n${frontmatterText}\n---${restOfContent}`;
    return { content: newContent, modified: true };
  }
  
  return { content, modified: false };
}

files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    skippedCount++;
    return;
  }
  
  try {
    yaml.load(frontmatterMatch[1]);
    return;
  } catch (error) {
    const result = fixFrontmatter(content, filePath);
    if (result.modified) {
      fs.writeFileSync(filePath, result.content, 'utf8');
      
      try {
        const newMatch = result.content.match(/^---\n([\s\S]*?)\n---/);
        if (newMatch) {
          yaml.load(newMatch[1]);
          console.log(`✅ Corrigé: ${file}`);
          fixedCount++;
        } else {
          throw new Error('Frontmatter non trouvé après correction');
        }
      } catch (e) {
        console.error(`❌ Erreur après correction dans ${file}: ${e.message}`);
        errorCount++;
      }
    } else {
      console.error(`⚠️  Impossible de corriger ${file}`);
      errorCount++;
    }
  }
});

console.log(`\n📊 Résumé:`);
console.log(`   ✅ Fichiers corrigés: ${fixedCount}`);
console.log(`   ❌ Erreurs: ${errorCount}`);
console.log(`   ⏭️  Fichiers sans erreur: ${skippedCount}`);
console.log(`   📁 Total fichiers traités: ${files.length}`);

