import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

// Structure standard selon ARTICLES_RULES.md
const STANDARD_SECTIONS = [
  { num: 1, title: 'FONDAMENTAUX DU SUJET', required: true },
  { num: 2, title: 'ANALYSE APPROFONDIE', required: true },
  { num: 3, title: 'STRATÉGIES ET MÉTHODOLOGIES', required: false },
  { num: 4, title: 'OUTILS ET TECHNOLOGIES', required: false },
  { num: 5, title: 'DÉFIS ET SOLUTIONS', required: false },
  { num: 6, title: 'SOURCES ET RÉFÉRENCES', required: true },
  { num: 7, title: 'ARTICLES ANNEXES', required: false }
];

function getAllMdFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllMdFiles(filePath, fileList);
    } else if (file.endsWith('.md') && !file.includes('template')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function getDomainFromPath(filePath) {
  const relativePath = path.relative(articlesDir, filePath);
  const parts = relativePath.split(path.sep);
  return parts[0] || 'articles-generaux';
}

function analyzeArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  const domain = getDomainFromPath(filePath);
  
  const issues = {
    structure: [],
    order: [],
    incomplete: [],
    missing: [],
    duplicates: []
  };
  
  // 1. Vérifier la présence et l'ordre des sections
  const sectionPattern = /^##\s+([0-9])\.\s+([^\n]+)/gm;
  const foundSections = [...body.matchAll(sectionPattern)];
  
  const sectionMap = new Map();
  const sectionNumbers = new Map();
  
  foundSections.forEach(match => {
    const num = parseInt(match[1]);
    const title = match[2].trim().toUpperCase();
    const key = `${num}-${title}`;
    
    // Détecter les doublons
    if (sectionNumbers.has(num)) {
      issues.duplicates.push(`Section ${num} dupliquée: "${title}"`);
    } else {
      sectionNumbers.set(num, title);
    }
    
    sectionMap.set(num, { title, index: match.index });
  });
  
  // 2. Vérifier l'ordre : SOURCES (6) doit être avant ARTICLES ANNEXES (7)
  const sourcesIndex = sectionMap.get(6)?.index;
  const annexesIndex = sectionMap.get(7)?.index;
  
  if (sourcesIndex !== undefined && annexesIndex !== undefined) {
    if (sourcesIndex > annexesIndex) {
      issues.order.push('SOURCES ET RÉFÉRENCES doit être AVANT ARTICLES ANNEXES');
    }
  }
  
  // 3. Vérifier les sections manquantes obligatoires
  STANDARD_SECTIONS.filter(s => s.required).forEach(section => {
    const found = Array.from(sectionMap.values()).find(
      s => s.title.includes(section.title)
    );
    if (!found) {
      issues.missing.push(`Section obligatoire manquante: ${section.num}. ${section.title}`);
    }
  });
  
  // 4. Vérifier les sections incomplètes
  foundSections.forEach(match => {
    const sectionStart = match.index;
    const nextSection = foundSections.find(m => m.index > sectionStart);
    const sectionEnd = nextSection ? nextSection.index : body.length;
    const sectionContent = body.substring(sectionStart, sectionEnd);
    
    // Vérifier si la section contient des placeholders ou est vide
    if (sectionContent.length < 150) {
      issues.incomplete.push(`Section ${match[1]} semble vide ou très courte`);
    }
    
    if (/Contenu à compléter|À compléter|TODO|FIXME|\[contexte spécifique\]/i.test(sectionContent)) {
      issues.incomplete.push(`Section ${match[1]} contient des placeholders`);
    }
  });
  
  // 5. Vérifier la numérotation
  const expectedOrder = [1, 2, 3, 4, 5, 6, 7];
  const foundNums = Array.from(sectionMap.keys()).sort((a, b) => a - b);
  
  foundNums.forEach((num, index) => {
    if (sectionMap.get(num).index > sectionMap.get(num + 1)?.index) {
      issues.order.push(`Section ${num} est mal placée dans l'ordre`);
    }
  });
  
  return {
    domain,
    file: path.basename(filePath),
    path: filePath,
    issues,
    hasIssues: Object.values(issues).some(arr => arr.length > 0)
  };
}

function fixArticleStructure(filePath, allArticlesData = []) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let fixedContent = content;
  const changes = [];
  
  // 1. Supprimer les sections non standardisées (8, 9, etc.)
  const nonStandardPattern = /^##\s+([89])\.\s+[^\n]+[\s\S]*?(?=^##\s+[0-9]|$)/gm;
  if (nonStandardPattern.test(fixedContent)) {
    fixedContent = fixedContent.replace(nonStandardPattern, '');
    changes.push('Sections non standardisées supprimées');
  }
  
  // 2. Corriger l'ordre : SOURCES (6) avant ARTICLES ANNEXES (7)
  const sourcesPattern = /^##\s+6\.\s+SOURCES\s+ET\s+RÉFÉRENCES[\s\S]*?(?=^##\s+[0-9]|$)/gi;
  const annexesPattern = /^##\s+[67]\.\s+ARTICLES\s+ANNEXES[\s\S]*?(?=^##\s+[0-9]|$)/gi;
  
  const sourcesMatch = fixedContent.match(sourcesPattern);
  const annexesMatch = fixedContent.match(annexesPattern);
  
  if (sourcesMatch && annexesMatch) {
    const sourcesIndex = fixedContent.indexOf(sourcesMatch[0]);
    const annexesIndex = fixedContent.indexOf(annexesMatch[0]);
    
    if (annexesIndex < sourcesIndex) {
      // Extraire les sections
      const sourcesSection = sourcesMatch[0];
      const annexesSection = annexesMatch[0].replace(
        /^##\s+[67]\.\s+ARTICLES\s+ANNEXES/gi,
        '## 7. ARTICLES ANNEXES'
      );
      
      // Supprimer les deux sections
      const beforeSources = fixedContent.substring(0, sourcesIndex);
      const afterSources = fixedContent.substring(sourcesIndex + sourcesSection.length);
      fixedContent = beforeSources + afterSources;
      
      // Trouver la nouvelle position de SOURCES
      const newSourcesIndex = fixedContent.indexOf(sourcesSection);
      if (newSourcesIndex !== -1) {
        const afterNewSources = fixedContent.substring(newSourcesIndex + sourcesSection.length);
        // Insérer ARTICLES ANNEXES après SOURCES
        fixedContent = fixedContent.substring(0, newSourcesIndex + sourcesSection.length) + 
                      '\n\n' + annexesSection + 
                      afterNewSources;
        changes.push('Ordre corrigé: ARTICLES ANNEXES après SOURCES ET RÉFÉRENCES');
      }
    }
  }
  
  // 3. Harmoniser la numérotation
  fixedContent = fixedContent.replace(
    /^##\s+([0-9])\.\s+SOURCES\s+ET\s+RÉFÉRENCES/gi,
    '## 6. SOURCES ET RÉFÉRENCES'
  );
  
  fixedContent = fixedContent.replace(
    /^##\s+([0-9])\.\s+ARTICLES\s+ANNEXES/gi,
    '## 7. ARTICLES ANNEXES'
  );
  
  // 4. Supprimer les doublons de sections
  const sectionPattern = /^##\s+([0-9])\.\s+([^\n]+)/gm;
  const sections = new Map();
  const matches = [...fixedContent.matchAll(sectionPattern)];
  
  // Garder seulement la première occurrence de chaque section
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const num = match[1];
    const title = match[2].trim();
    const key = `${num}-${title}`;
    
    if (sections.has(key)) {
      // Doublon trouvé, supprimer
      const nextMatch = matches[i + 1] || { index: fixedContent.length };
      const sectionStart = match.index;
      const sectionEnd = nextMatch.index;
      fixedContent = fixedContent.substring(0, sectionStart) + fixedContent.substring(sectionEnd);
      changes.push(`Section ${num} dupliquée supprimée`);
    } else {
      sections.set(key, match);
    }
  }
  
  // 5. Nettoyer les lignes vides multiples
  fixedContent = fixedContent.replace(/\n{4,}/g, '\n\n\n');
  
  return { fixedContent, changes };
}

// Grouper les articles par domaine
function groupByDomain(articles) {
  const grouped = {};
  articles.forEach(article => {
    if (!grouped[article.domain]) {
      grouped[article.domain] = [];
    }
    grouped[article.domain].push(article);
  });
  return grouped;
}

console.log('\n🔍 Analyse et harmonisation de tous les articles par domaine\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const analyses = allArticles.map(analyzeArticle);
const byDomain = groupByDomain(analyses);

const domainReports = {};
const processedArticles = [];
const errors = [];

// Traiter chaque domaine
Object.keys(byDomain).sort().forEach(domain => {
  console.log(`\n📁 Domaine: ${domain}`);
  console.log('-'.repeat(80));
  
  const domainArticles = byDomain[domain];
  const domainIssues = {
    structure: 0,
    order: 0,
    incomplete: 0,
    missing: 0,
    duplicates: 0
  };
  
  domainArticles.forEach(article => {
    if (article.hasIssues) {
      Object.keys(article.issues).forEach(key => {
        if (article.issues[key].length > 0) {
          domainIssues[key] += article.issues[key].length;
        }
      });
    }
  });
  
  domainReports[domain] = {
    total: domainArticles.length,
    issues: domainIssues,
    articles: domainArticles
  };
  
  console.log(`   Articles: ${domainArticles.length}`);
  console.log(`   Problèmes détectés:`);
  console.log(`     - Structure: ${domainIssues.structure}`);
  console.log(`     - Ordre: ${domainIssues.order}`);
  console.log(`     - Incomplet: ${domainIssues.incomplete}`);
  console.log(`     - Manquants: ${domainIssues.missing}`);
  console.log(`     - Doublons: ${domainIssues.duplicates}`);
  
  // Corriger les articles du domaine
  domainArticles.forEach(article => {
    try {
      const { fixedContent, changes } = fixArticleStructure(article.path, allArticles);
      
      if (changes.length > 0) {
        fs.writeFileSync(article.path, fixedContent, 'utf-8');
        processedArticles.push({
          domain,
          file: article.file,
          changes
        });
        console.log(`   ✅ ${article.file}`);
        console.log(`      ${changes.join(', ')}`);
      }
    } catch (error) {
      errors.push({
        domain,
        file: article.file,
        error: error.message
      });
      console.log(`   ❌ ${article.file}`);
      console.log(`      Erreur: ${error.message}`);
    }
  });
});

console.log('\n' + '='.repeat(80));
console.log('\n📊 RÉSUMÉ PAR DOMAINE\n');

Object.keys(domainReports).sort().forEach(domain => {
  const report = domainReports[domain];
  console.log(`\n${domain}:`);
  console.log(`  Total: ${report.total} articles`);
  console.log(`  Articles modifiés: ${processedArticles.filter(a => a.domain === domain).length}`);
  console.log(`  Problèmes:`);
  Object.keys(report.issues).forEach(key => {
    if (report.issues[key] > 0) {
      console.log(`    - ${key}: ${report.issues[key]}`);
    }
  });
});

console.log('\n' + '='.repeat(80));
console.log(`\n📈 RÉSUMÉ GLOBAL:\n`);
console.log(`   Total articles: ${allArticles.length}`);
console.log(`   Articles modifiés: ${processedArticles.length}`);
console.log(`   Erreurs: ${errors.length}`);
console.log(`   Domaines: ${Object.keys(byDomain).length}`);

// Générer un rapport JSON
const report = {
  date: new Date().toISOString(),
  total: allArticles.length,
  domains: domainReports,
  processed: processedArticles.length,
  errors: errors.length
};

fs.writeFileSync(
  path.join(__dirname, 'RAPPORT_HARMONISATION_DOMAINE.json'),
  JSON.stringify(report, null, 2),
  'utf-8'
);

console.log('\n✅ Rapport JSON généré: RAPPORT_HARMONISATION_DOMAINE.json\n');

import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

// Structure standard selon ARTICLES_RULES.md
const STANDARD_SECTIONS = [
  { num: 1, title: 'FONDAMENTAUX DU SUJET', required: true },
  { num: 2, title: 'ANALYSE APPROFONDIE', required: true },
  { num: 3, title: 'STRATÉGIES ET MÉTHODOLOGIES', required: false },
  { num: 4, title: 'OUTILS ET TECHNOLOGIES', required: false },
  { num: 5, title: 'DÉFIS ET SOLUTIONS', required: false },
  { num: 6, title: 'SOURCES ET RÉFÉRENCES', required: true },
  { num: 7, title: 'ARTICLES ANNEXES', required: false }
];

function getAllMdFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllMdFiles(filePath, fileList);
    } else if (file.endsWith('.md') && !file.includes('template')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function getDomainFromPath(filePath) {
  const relativePath = path.relative(articlesDir, filePath);
  const parts = relativePath.split(path.sep);
  return parts[0] || 'articles-generaux';
}

function analyzeArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  const domain = getDomainFromPath(filePath);
  
  const issues = {
    structure: [],
    order: [],
    incomplete: [],
    missing: [],
    duplicates: []
  };
  
  // 1. Vérifier la présence et l'ordre des sections
  const sectionPattern = /^##\s+([0-9])\.\s+([^\n]+)/gm;
  const foundSections = [...body.matchAll(sectionPattern)];
  
  const sectionMap = new Map();
  const sectionNumbers = new Map();
  
  foundSections.forEach(match => {
    const num = parseInt(match[1]);
    const title = match[2].trim().toUpperCase();
    const key = `${num}-${title}`;
    
    // Détecter les doublons
    if (sectionNumbers.has(num)) {
      issues.duplicates.push(`Section ${num} dupliquée: "${title}"`);
    } else {
      sectionNumbers.set(num, title);
    }
    
    sectionMap.set(num, { title, index: match.index });
  });
  
  // 2. Vérifier l'ordre : SOURCES (6) doit être avant ARTICLES ANNEXES (7)
  const sourcesIndex = sectionMap.get(6)?.index;
  const annexesIndex = sectionMap.get(7)?.index;
  
  if (sourcesIndex !== undefined && annexesIndex !== undefined) {
    if (sourcesIndex > annexesIndex) {
      issues.order.push('SOURCES ET RÉFÉRENCES doit être AVANT ARTICLES ANNEXES');
    }
  }
  
  // 3. Vérifier les sections manquantes obligatoires
  STANDARD_SECTIONS.filter(s => s.required).forEach(section => {
    const found = Array.from(sectionMap.values()).find(
      s => s.title.includes(section.title)
    );
    if (!found) {
      issues.missing.push(`Section obligatoire manquante: ${section.num}. ${section.title}`);
    }
  });
  
  // 4. Vérifier les sections incomplètes
  foundSections.forEach(match => {
    const sectionStart = match.index;
    const nextSection = foundSections.find(m => m.index > sectionStart);
    const sectionEnd = nextSection ? nextSection.index : body.length;
    const sectionContent = body.substring(sectionStart, sectionEnd);
    
    // Vérifier si la section contient des placeholders ou est vide
    if (sectionContent.length < 150) {
      issues.incomplete.push(`Section ${match[1]} semble vide ou très courte`);
    }
    
    if (/Contenu à compléter|À compléter|TODO|FIXME|\[contexte spécifique\]/i.test(sectionContent)) {
      issues.incomplete.push(`Section ${match[1]} contient des placeholders`);
    }
  });
  
  // 5. Vérifier la numérotation
  const expectedOrder = [1, 2, 3, 4, 5, 6, 7];
  const foundNums = Array.from(sectionMap.keys()).sort((a, b) => a - b);
  
  foundNums.forEach((num, index) => {
    if (sectionMap.get(num).index > sectionMap.get(num + 1)?.index) {
      issues.order.push(`Section ${num} est mal placée dans l'ordre`);
    }
  });
  
  return {
    domain,
    file: path.basename(filePath),
    path: filePath,
    issues,
    hasIssues: Object.values(issues).some(arr => arr.length > 0)
  };
}

function fixArticleStructure(filePath, allArticlesData = []) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let fixedContent = content;
  const changes = [];
  
  // 1. Supprimer les sections non standardisées (8, 9, etc.)
  const nonStandardPattern = /^##\s+([89])\.\s+[^\n]+[\s\S]*?(?=^##\s+[0-9]|$)/gm;
  if (nonStandardPattern.test(fixedContent)) {
    fixedContent = fixedContent.replace(nonStandardPattern, '');
    changes.push('Sections non standardisées supprimées');
  }
  
  // 2. Corriger l'ordre : SOURCES (6) avant ARTICLES ANNEXES (7)
  const sourcesPattern = /^##\s+6\.\s+SOURCES\s+ET\s+RÉFÉRENCES[\s\S]*?(?=^##\s+[0-9]|$)/gi;
  const annexesPattern = /^##\s+[67]\.\s+ARTICLES\s+ANNEXES[\s\S]*?(?=^##\s+[0-9]|$)/gi;
  
  const sourcesMatch = fixedContent.match(sourcesPattern);
  const annexesMatch = fixedContent.match(annexesPattern);
  
  if (sourcesMatch && annexesMatch) {
    const sourcesIndex = fixedContent.indexOf(sourcesMatch[0]);
    const annexesIndex = fixedContent.indexOf(annexesMatch[0]);
    
    if (annexesIndex < sourcesIndex) {
      // Extraire les sections
      const sourcesSection = sourcesMatch[0];
      const annexesSection = annexesMatch[0].replace(
        /^##\s+[67]\.\s+ARTICLES\s+ANNEXES/gi,
        '## 7. ARTICLES ANNEXES'
      );
      
      // Supprimer les deux sections
      const beforeSources = fixedContent.substring(0, sourcesIndex);
      const afterSources = fixedContent.substring(sourcesIndex + sourcesSection.length);
      fixedContent = beforeSources + afterSources;
      
      // Trouver la nouvelle position de SOURCES
      const newSourcesIndex = fixedContent.indexOf(sourcesSection);
      if (newSourcesIndex !== -1) {
        const afterNewSources = fixedContent.substring(newSourcesIndex + sourcesSection.length);
        // Insérer ARTICLES ANNEXES après SOURCES
        fixedContent = fixedContent.substring(0, newSourcesIndex + sourcesSection.length) + 
                      '\n\n' + annexesSection + 
                      afterNewSources;
        changes.push('Ordre corrigé: ARTICLES ANNEXES après SOURCES ET RÉFÉRENCES');
      }
    }
  }
  
  // 3. Harmoniser la numérotation
  fixedContent = fixedContent.replace(
    /^##\s+([0-9])\.\s+SOURCES\s+ET\s+RÉFÉRENCES/gi,
    '## 6. SOURCES ET RÉFÉRENCES'
  );
  
  fixedContent = fixedContent.replace(
    /^##\s+([0-9])\.\s+ARTICLES\s+ANNEXES/gi,
    '## 7. ARTICLES ANNEXES'
  );
  
  // 4. Supprimer les doublons de sections
  const sectionPattern = /^##\s+([0-9])\.\s+([^\n]+)/gm;
  const sections = new Map();
  const matches = [...fixedContent.matchAll(sectionPattern)];
  
  // Garder seulement la première occurrence de chaque section
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const num = match[1];
    const title = match[2].trim();
    const key = `${num}-${title}`;
    
    if (sections.has(key)) {
      // Doublon trouvé, supprimer
      const nextMatch = matches[i + 1] || { index: fixedContent.length };
      const sectionStart = match.index;
      const sectionEnd = nextMatch.index;
      fixedContent = fixedContent.substring(0, sectionStart) + fixedContent.substring(sectionEnd);
      changes.push(`Section ${num} dupliquée supprimée`);
    } else {
      sections.set(key, match);
    }
  }
  
  // 5. Nettoyer les lignes vides multiples
  fixedContent = fixedContent.replace(/\n{4,}/g, '\n\n\n');
  
  return { fixedContent, changes };
}

// Grouper les articles par domaine
function groupByDomain(articles) {
  const grouped = {};
  articles.forEach(article => {
    if (!grouped[article.domain]) {
      grouped[article.domain] = [];
    }
    grouped[article.domain].push(article);
  });
  return grouped;
}

console.log('\n🔍 Analyse et harmonisation de tous les articles par domaine\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const analyses = allArticles.map(analyzeArticle);
const byDomain = groupByDomain(analyses);

const domainReports = {};
const processedArticles = [];
const errors = [];

// Traiter chaque domaine
Object.keys(byDomain).sort().forEach(domain => {
  console.log(`\n📁 Domaine: ${domain}`);
  console.log('-'.repeat(80));
  
  const domainArticles = byDomain[domain];
  const domainIssues = {
    structure: 0,
    order: 0,
    incomplete: 0,
    missing: 0,
    duplicates: 0
  };
  
  domainArticles.forEach(article => {
    if (article.hasIssues) {
      Object.keys(article.issues).forEach(key => {
        if (article.issues[key].length > 0) {
          domainIssues[key] += article.issues[key].length;
        }
      });
    }
  });
  
  domainReports[domain] = {
    total: domainArticles.length,
    issues: domainIssues,
    articles: domainArticles
  };
  
  console.log(`   Articles: ${domainArticles.length}`);
  console.log(`   Problèmes détectés:`);
  console.log(`     - Structure: ${domainIssues.structure}`);
  console.log(`     - Ordre: ${domainIssues.order}`);
  console.log(`     - Incomplet: ${domainIssues.incomplete}`);
  console.log(`     - Manquants: ${domainIssues.missing}`);
  console.log(`     - Doublons: ${domainIssues.duplicates}`);
  
  // Corriger les articles du domaine
  domainArticles.forEach(article => {
    try {
      const { fixedContent, changes } = fixArticleStructure(article.path, allArticles);
      
      if (changes.length > 0) {
        fs.writeFileSync(article.path, fixedContent, 'utf-8');
        processedArticles.push({
          domain,
          file: article.file,
          changes
        });
        console.log(`   ✅ ${article.file}`);
        console.log(`      ${changes.join(', ')}`);
      }
    } catch (error) {
      errors.push({
        domain,
        file: article.file,
        error: error.message
      });
      console.log(`   ❌ ${article.file}`);
      console.log(`      Erreur: ${error.message}`);
    }
  });
});

console.log('\n' + '='.repeat(80));
console.log('\n📊 RÉSUMÉ PAR DOMAINE\n');

Object.keys(domainReports).sort().forEach(domain => {
  const report = domainReports[domain];
  console.log(`\n${domain}:`);
  console.log(`  Total: ${report.total} articles`);
  console.log(`  Articles modifiés: ${processedArticles.filter(a => a.domain === domain).length}`);
  console.log(`  Problèmes:`);
  Object.keys(report.issues).forEach(key => {
    if (report.issues[key] > 0) {
      console.log(`    - ${key}: ${report.issues[key]}`);
    }
  });
});

console.log('\n' + '='.repeat(80));
console.log(`\n📈 RÉSUMÉ GLOBAL:\n`);
console.log(`   Total articles: ${allArticles.length}`);
console.log(`   Articles modifiés: ${processedArticles.length}`);
console.log(`   Erreurs: ${errors.length}`);
console.log(`   Domaines: ${Object.keys(byDomain).length}`);

// Générer un rapport JSON
const report = {
  date: new Date().toISOString(),
  total: allArticles.length,
  domains: domainReports,
  processed: processedArticles.length,
  errors: errors.length
};

fs.writeFileSync(
  path.join(__dirname, 'RAPPORT_HARMONISATION_DOMAINE.json'),
  JSON.stringify(report, null, 2),
  'utf-8'
);

console.log('\n✅ Rapport JSON généré: RAPPORT_HARMONISATION_DOMAINE.json\n');

