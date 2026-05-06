import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractDomainFromPath(filePath) {
  const match = filePath.match(/articles\/([^/]+)\//);
  return match ? match[1] : null;
}

function fixFrontmatter(content, filePath) {
  const domain = extractDomainFromPath(filePath);
  
  // Trouver le frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return content;
  
  const frontmatterText = frontmatterMatch[1];
  const restOfContent = content.substring(frontmatterMatch[0].length);
  
  // Extraire les champs manuellement
  const fields = {};
  const lines = frontmatterText.split('\n');
  let currentKey = null;
  let currentValue = [];
  let inMultiline = false;
  let inArray = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Ignorer les lignes vides
    if (!trimmed) continue;
    
    // Détecter une nouvelle clé
    const keyMatch = line.match(/^(\w+):\s*(.*)$/);
    if (keyMatch && !inMultiline && !inArray) {
      // Sauvegarder la clé précédente
      if (currentKey) {
        if (inArray) {
          fields[currentKey] = currentValue;
        } else if (inMultiline) {
          fields[currentKey] = currentValue.join('\n').trim();
        } else {
          fields[currentKey] = currentValue.join(' ').trim();
        }
      }
      
      currentKey = keyMatch[1];
      const value = keyMatch[2].trim();
      
      if (value.startsWith('>') || value.startsWith('>-')) {
        inMultiline = true;
        currentValue = [];
      } else if (value.startsWith('[') || value === '') {
        inArray = true;
        currentValue = [];
      } else {
        currentValue = [value.replace(/^['"]|['"]$/g, '')];
        inMultiline = false;
        inArray = false;
      }
      continue;
    }
    
    // Détecter les éléments de liste
    if (line.match(/^\s*[-*]\s+/)) {
      const item = line.replace(/^\s*[-*]\s+/, '').trim().replace(/^['"]|['"]$/g, '');
      if (currentKey) {
        if (!Array.isArray(fields[currentKey])) {
          fields[currentKey] = [];
        }
        fields[currentKey].push(item);
      }
      continue;
    }
    
    // Gérer les valeurs multi-lignes
    if (inMultiline) {
      if (trimmed === '' && currentValue.length > 0) {
        inMultiline = false;
      } else {
        currentValue.push(line);
      }
      continue;
    }
    
    // Gérer les tableaux
    if (inArray) {
      if (trimmed === ']') {
        inArray = false;
      } else {
        const item = trimmed.replace(/^[-*]\s+|['"]/g, '');
        if (item) currentValue.push(item);
      }
      continue;
    }
    
    // Valeur simple
    if (currentKey) {
      currentValue.push(trimmed);
    }
  }
  
  // Sauvegarder la dernière clé
  if (currentKey) {
    if (inArray) {
      fields[currentKey] = currentValue;
    } else if (inMultiline) {
      fields[currentKey] = currentValue.join('\n').trim();
    } else {
      fields[currentKey] = currentValue.join(' ').trim();
    }
  }
  
  // Nettoyer les champs cassés
  const cleanedFields = {};
  for (const [key, value] of Object.entries(fields)) {
    // Séparer les champs fusionnés (ex: "modernelastUpdated")
    if (typeof value === 'string' && value.includes('lastUpdated')) {
      const parts = value.split(/(?=lastUpdated)/);
      if (parts.length > 1) {
        cleanedFields[key] = parts[0];
        cleanedFields['lastUpdated'] = parts[1].replace(/lastUpdated:\s*['"]?([^'"]+)['"]?/, '$1');
      } else {
        cleanedFields[key] = value;
      }
    } else {
      cleanedFields[key] = value;
    }
  }
  
  // Corriger les champs spécifiques
  if (cleanedFields.description && typeof cleanedFields.description === 'string') {
    // Nettoyer la description
    cleanedFields.description = cleanedFields.description
      .replace(/^-\s*/, '')
      .replace(/\n\s*-\s*/g, '\n')
      .trim();
  }
  
  // S'assurer que domain, pillColor, theme et keywords sont présents
  if (domain) {
    cleanedFields.domain = domain;
  }
  
  // Mapping des couleurs
  const domainColorMapping = {
    "gestion-projet": "blue",
    "developpement-web": "green",
    "qualite-process": "purple",
    "formation": "red",
    "developpement-commercial": "orange",
    "gestion-talents": "teal",
    "productivite-methodes": "indigo",
    "transformation-digitale": "pink",
    "marketing-communication": "yellow",
    "leadership-management": "purple",
    "innovation-technologies": "cyan",
    "service-client": "emerald",
    "gestion-connaissances": "violet",
    "reconversion-carriere": "rose",
    "outils-techniques": "slate",
    "articles-generaux": "gray"
  };
  
  if (domain && domainColorMapping[domain]) {
    cleanedFields.pillColor = domainColorMapping[domain];
  }
  
  // Mapping des thèmes
  const domainThemeMapping = {
    "gestion-projet": "gestion",
    "developpement-web": "technologie",
    "qualite-process": "gestion",
    "formation": "formation",
    "developpement-commercial": "carriere",
    "gestion-talents": "gestion",
    "productivite-methodes": "carriere",
    "transformation-digitale": "technologie",
    "marketing-communication": "carriere",
    "leadership-management": "gestion",
    "innovation-technologies": "technologie",
    "service-client": "carriere",
    "gestion-connaissances": "gestion",
    "reconversion-carriere": "carriere",
    "outils-techniques": "technologie",
    "articles-generaux": "autre"
  };
  
  if (domain && domainThemeMapping[domain]) {
    cleanedFields.theme = domainThemeMapping[domain];
  }
  
  // S'assurer que keywords est un tableau
  if (!Array.isArray(cleanedFields.keywords)) {
    if (cleanedFields.keywords && typeof cleanedFields.keywords === 'string') {
      cleanedFields.keywords = cleanedFields.keywords.split(',').map(k => k.trim());
    } else {
      cleanedFields.keywords = [];
    }
  }
  
  // Reconstruire le frontmatter proprement
  let newFrontmatter = '---\n';
  
  // Ordre des champs
  const fieldOrder = [
    'draft', 'title', 'description', 'author', 'type', 'featured', 
    'readingTime', 'hasMermaid', 'targetAudience', 'domain', 
    'tags', 'pillColor', 'skills', 'relatedArticles', 'theme',
    'publishDate', 'keywords', 'lastUpdated', 'wordCount', 'enriched'
  ];
  
  const processedKeys = new Set();
  
  // Ajouter les champs dans l'ordre
  for (const key of fieldOrder) {
    if (cleanedFields[key] !== undefined && cleanedFields[key] !== null) {
      processedKeys.add(key);
      const value = cleanedFields[key];
      
      if (Array.isArray(value)) {
        if (value.length > 0) {
          newFrontmatter += `${key}:\n`;
          for (const item of value) {
            newFrontmatter += `  - ${item}\n`;
          }
        }
      } else if (typeof value === 'string' && (value.includes('\n') || value.length > 80)) {
        newFrontmatter += `${key} >-\n`;
        const lines = value.split('\n');
        for (const line of lines) {
          newFrontmatter += `  ${line}\n`;
        }
      } else {
        newFrontmatter += `${key}: ${typeof value === 'string' && value.includes(':') ? `"${value}"` : value}\n`;
      }
    }
  }
  
  // Ajouter les champs restants
  for (const [key, value] of Object.entries(cleanedFields)) {
    if (!processedKeys.has(key)) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          newFrontmatter += `${key}:\n`;
          for (const item of value) {
            newFrontmatter += `  - ${item}\n`;
          }
        }
      } else {
        newFrontmatter += `${key}: ${typeof value === 'string' && value.includes(':') ? `"${value}"` : value}\n`;
      }
    }
  }
  
  newFrontmatter += '---\n';
  
  return newFrontmatter + restOfContent;
}

function processArticle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fixedContent = fixFrontmatter(content, filePath);
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf-8');
      return { filePath, status: 'updated' };
    }
    
    return { filePath, status: 'no_changes' };
  } catch (error) {
    return { filePath, status: 'error', error: error.message };
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
  const errors = results.filter(r => r.status === 'error');
  
  console.log('\n🔧 Correction des frontmatters YAML:\n');
  console.log(`Total articles traités: ${results.length}`);
  console.log(`Articles corrigés: ${updated.length}`);
  
  if (errors.length > 0) {
    console.log(`\n❌ Erreurs: ${errors.length}`);
    errors.slice(0, 5).forEach(r => {
      console.log(`   - ${path.basename(r.filePath)}: ${r.error}`);
    });
  }
  
  console.log('\n');
}

main();

