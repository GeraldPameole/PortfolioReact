import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping des domaines vers les couleurs de pills
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

// Mapping des domaines vers les thèmes
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

// Mots-clés par défaut par domaine
const domainKeywordsMapping = {
  "gestion-projet": ["gestion projet", "agile", "scrum", "management", "méthodologie"],
  "developpement-web": ["développement web", "javascript", "react", "frontend", "technologies"],
  "qualite-process": ["qualité", "processus", "amélioration", "certification", "iso"],
  "formation": ["formation", "apprentissage", "compétences", "développement", "pédagogie"],
  "developpement-commercial": ["commercial", "vente", "marketing", "business", "stratégie"],
  "gestion-talents": ["talents", "rh", "recrutement", "développement", "fidélisation"],
  "productivite-methodes": ["productivité", "méthodes", "organisation", "efficacité", "temps"],
  "transformation-digitale": ["transformation", "digitale", "numérique", "innovation", "technologie"],
  "marketing-communication": ["marketing", "communication", "stratégie", "digital", "réseaux sociaux"],
  "leadership-management": ["leadership", "management", "direction", "équipe", "performance"],
  "innovation-technologies": ["innovation", "technologie", "ia", "intelligence artificielle", "futur"],
  "service-client": ["service client", "satisfaction", "support", "relation client", "expérience"],
  "gestion-connaissances": ["connaissances", "knowledge management", "capitalisation", "partage", "expertise"],
  "reconversion-carriere": ["reconversion", "carrière", "transition", "changement", "orientation"],
  "outils-techniques": ["outils", "techniques", "productivité", "utilitaires", "guides"],
  "articles-generaux": ["général", "divers", "articles", "ressources", "contenu"]
};

function extractDomainFromPath(filePath) {
  const match = filePath.match(/articles\/([^/]+)\//);
  return match ? match[1] : null;
}

function extractTitleFromFrontmatter(content) {
  const titleMatch = content.match(/^title:\s*(.+)$/m);
  if (!titleMatch) return null;
  
  let title = titleMatch[1].trim();
  // Enlever les guillemets
  title = title.replace(/^['"]|['"]$/g, '');
  // Gérer les titres multi-lignes avec >
  if (title.startsWith('>')) {
    title = title.substring(1).trim();
  }
  return title;
}

function extractKeywordsFromTitle(title) {
  if (!title) return [];
  
  // Extraire les mots-clés pertinents du titre
  const words = title
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 5);
  
  return words;
}

function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;
  
  const frontmatter = {};
  const lines = frontmatterMatch[1].split('\n');
  let currentKey = null;
  let currentValue = [];
  let inArray = false;
  let inMultiline = false;
  
  for (const line of lines) {
    // Détecter les clés simples
    const simpleMatch = line.match(/^(\w+):\s*(.+)$/);
    if (simpleMatch && !inArray && !inMultiline) {
      if (currentKey) {
        frontmatter[currentKey] = currentValue.length > 0 ? currentValue.join('\n').trim() : '';
      }
      currentKey = simpleMatch[1];
      const value = simpleMatch[2].trim();
      
      if (value.startsWith('[')) {
        inArray = true;
        currentValue = [];
        const arrayContent = value.replace(/^\[|\]$/g, '').trim();
        if (arrayContent) {
          currentValue = arrayContent.split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''));
        }
      } else if (value.startsWith('>')) {
        inMultiline = true;
        currentValue = [value.substring(1).trim()];
      } else {
        currentValue = [value.replace(/^['"]|['"]$/g, '')];
        currentKey = null;
      }
      continue;
    }
    
    // Gérer les valeurs de tableau
    if (inArray) {
      if (line.trim() === ']') {
        inArray = false;
        if (currentKey) {
          frontmatter[currentKey] = currentValue;
        }
        currentKey = null;
        currentValue = [];
      } else {
        const item = line.trim().replace(/^[-*]\s*|['"]/g, '');
        if (item) currentValue.push(item);
      }
      continue;
    }
    
    // Gérer les valeurs multi-lignes
    if (inMultiline) {
      if (line.trim() === '' && currentValue.length > 0) {
        inMultiline = false;
        if (currentKey) {
          frontmatter[currentKey] = currentValue.join('\n').trim();
        }
        currentKey = null;
        currentValue = [];
      } else {
        currentValue.push(line);
      }
      continue;
    }
    
    // Gérer les éléments de liste
    if (line.match(/^\s*[-*]\s+/)) {
      if (currentKey) {
        const item = line.replace(/^\s*[-*]\s+/, '').trim().replace(/^['"]|['"]$/g, '');
        if (!Array.isArray(frontmatter[currentKey])) {
          frontmatter[currentKey] = [];
        }
        frontmatter[currentKey].push(item);
      }
    }
  }
  
  if (currentKey) {
    frontmatter[currentKey] = inArray ? currentValue : currentValue.join('\n').trim();
  }
  
  return frontmatter;
}

function updateFrontmatter(content, domain, title) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return content;
  
  const frontmatter = parseFrontmatter(content);
  if (!frontmatter) return content;
  
  let updated = false;
  const issues = [];
  
  // Vérifier et corriger le domain
  if (frontmatter.domain !== domain) {
    issues.push(`Domain: "${frontmatter.domain}" → "${domain}"`);
    frontmatter.domain = domain;
    updated = true;
  }
  
  // Vérifier et corriger le pillColor
  const expectedColor = domainColorMapping[domain];
  if (expectedColor && frontmatter.pillColor !== expectedColor) {
    issues.push(`PillColor: "${frontmatter.pillColor || 'manquant'}" → "${expectedColor}"`);
    frontmatter.pillColor = expectedColor;
    updated = true;
  }
  
  // Vérifier et corriger le theme
  const expectedTheme = domainThemeMapping[domain];
  if (expectedTheme && frontmatter.theme !== expectedTheme) {
    issues.push(`Theme: "${frontmatter.theme || 'manquant'}" → "${expectedTheme}"`);
    frontmatter.theme = expectedTheme;
    updated = true;
  }
  
  // Vérifier et améliorer les keywords
  const domainKeywords = domainKeywordsMapping[domain] || [];
  const titleKeywords = extractKeywordsFromTitle(title);
  const existingKeywords = Array.isArray(frontmatter.keywords) ? frontmatter.keywords : [];
  
  // Combiner les mots-clés du domaine, du titre et existants
  const allKeywords = [...new Set([
    ...domainKeywords.slice(0, 3),
    ...titleKeywords.slice(0, 2),
    ...existingKeywords
  ])].slice(0, 8);
  
  if (JSON.stringify(allKeywords.sort()) !== JSON.stringify((existingKeywords || []).sort())) {
    issues.push(`Keywords: ${existingKeywords.length} → ${allKeywords.length} mots-clés`);
    frontmatter.keywords = allKeywords;
    updated = true;
  }
  
  if (!updated) return { content, issues: [] };
  
  // Reconstruire le frontmatter
  let newFrontmatter = '---\n';
  const keys = Object.keys(frontmatter);
  
  for (const key of keys) {
    const value = frontmatter[key];
    if (value === undefined || value === null) continue;
    
    if (Array.isArray(value)) {
      newFrontmatter += `${key}:\n`;
      for (const item of value) {
        newFrontmatter += `  - ${item}\n`;
      }
    } else if (typeof value === 'string' && value.includes('\n')) {
      newFrontmatter += `${key} >-\n`;
      const lines = value.split('\n');
      for (const line of lines) {
        newFrontmatter += `  ${line}\n`;
      }
    } else {
      newFrontmatter += `${key}: ${value}\n`;
    }
  }
  
  newFrontmatter += '---\n';
  
  const newContent = content.replace(/^---\n[\s\S]*?\n---\n/, newFrontmatter);
  
  return { content: newContent, issues };
}

function processArticle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const domain = extractDomainFromPath(filePath);
    const title = extractTitleFromFrontmatter(content);
    
    if (!domain) {
      return { filePath, status: 'error', error: 'Domaine non détecté' };
    }
    
    const { content: newContent, issues } = updateFrontmatter(content, domain, title);
    
    if (issues.length > 0) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      return {
        filePath,
        status: 'updated',
        issues,
        domain,
        title
      };
    }
    
    return {
      filePath,
      status: 'no_changes',
      domain,
      title
    };
  } catch (error) {
    return {
      filePath,
      status: 'error',
      error: error.message
    };
  }
}

function main() {
  const articlesDir = path.join(__dirname, '../src/content/articles');
  const results = [];
  let totalUpdated = 0;
  let totalIssues = 0;
  
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
        if (result.status === 'updated') {
          totalUpdated++;
          totalIssues += result.issues.length;
        }
      }
    }
  }
  
  walkDir(articlesDir);
  
  console.log('\n📊 Vérification et correction des métadonnées:\n');
  console.log(`Total articles traités: ${results.length}`);
  console.log(`Articles mis à jour: ${totalUpdated}`);
  console.log(`Total corrections: ${totalIssues}\n`);
  
  const updated = results.filter(r => r.status === 'updated');
  const errors = results.filter(r => r.status === 'error');
  
  if (updated.length > 0) {
    console.log('✅ Articles corrigés:\n');
    updated.forEach(r => {
      console.log(`📄 ${path.basename(r.filePath)}`);
      console.log(`   Domaine: ${r.domain}`);
      r.issues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
      console.log('');
    });
  }
  
  if (errors.length > 0) {
    console.log(`\n❌ Erreurs: ${errors.length}`);
    errors.slice(0, 5).forEach(r => {
      console.log(`   - ${path.basename(r.filePath)}: ${r.error}`);
    });
  }
  
  const noChanges = results.filter(r => r.status === 'no_changes');
  if (noChanges.length > 0) {
    console.log(`\n✅ ${noChanges.length} articles déjà corrects\n`);
  }
  
  console.log('\n');
}

main();



