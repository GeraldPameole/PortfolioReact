import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

console.log('\n📊 Analyse des articles incomplets\n');
console.log('='.repeat(80));

function analyzeArticle(filePath, domain) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { content: body } = matter(content);
  
  const issues = [];
  
  // Vérifier les placeholders
  const placeholders = [
    /\[Description avec statistiques selon source fiable 2024\]/gi,
    /\[Définition complète du sujet avec sources\]/gi,
    /\[Observation personnelle basée sur l'expérience terrain\]/gi,
    /\[Nuance d'expert\]/gi,
    /\[Source fiable\]/gi,
    /\[statistique pertinente\]/gi,
    /\[Définition avec statistiques selon source fiable 2024\]/gi,
    /\[Cas d'usage avec statistiques selon source 2024\]/gi,
    /\[Impact avec statistiques selon source fiable 2024\]/gi,
    /\[Défi avec statistiques selon source fiable 2024\]/gi,
    /\[Impact spécifique\]/gi,
    /\[Description\]/gi,
    /\[Critères\]/gi,
    /\[Exemples\]/gi,
    /\[%\]/gi,
    /\[Niveau\]/gi
  ];
  
  let hasPlaceholders = false;
  placeholders.forEach(pattern => {
    if (pattern.test(body)) {
      hasPlaceholders = true;
      issues.push('Placeholders trouvés');
    }
  });
  
  // Vérifier l'ordre des sections
  const sections = [
    '## Introduction',
    '## 1\\. FONDAMENTAUX DU SUJET',
    '## 2\\. ANALYSE APPROFONDIE',
    '## 3\\. STRATÉGIES ET MÉTHODOLOGIES',
    '## 4\\. OUTILS ET TECHNOLOGIES',
    '## 5\\. DÉFIS ET SOLUTIONS',
    '## 6\\. SOURCES ET RÉFÉRENCES',
    '## 7\\. ARTICLES ANNEXES'
  ];
  
  const sectionOrder = [];
  sections.forEach((section, index) => {
    const regex = new RegExp(section, 'i');
    const match = body.match(regex);
    if (match) {
      sectionOrder.push({ name: section, index: match.index, expectedIndex: index });
    }
  });
  
  // Vérifier si les sections sont dans le bon ordre
  let orderIssues = false;
  for (let i = 0; i < sectionOrder.length - 1; i++) {
    if (sectionOrder[i].index > sectionOrder[i + 1].index) {
      orderIssues = true;
      issues.push('Ordre des sections incorrect');
      break;
    }
  }
  
  // Vérifier les sections manquantes
  const requiredSections = [
    'Introduction',
    'FONDAMENTAUX DU SUJET',
    'ANALYSE APPROFONDIE',
    'STRATÉGIES ET MÉTHODOLOGIES',
    'OUTILS ET TECHNOLOGIES',
    'DÉFIS ET SOLUTIONS',
    'SOURCES ET RÉFÉRENCES',
    'ARTICLES ANNEXES'
  ];
  
  const missingSections = [];
  requiredSections.forEach(section => {
    const regex = new RegExp(`##\\s+[0-9]?\\.?\\s*${section}`, 'i');
    if (!regex.test(body)) {
      missingSections.push(section);
    }
  });
  
  if (missingSections.length > 0) {
    issues.push(`Sections manquantes: ${missingSections.join(', ')}`);
  }
  
  // Vérifier les sources
  const sourcesSection = body.match(/##\s+6\.\s+SOURCES\s+ET\s+RÉFÉRENCES[\s\S]*?(?=##|$)/i);
  let sourceCount = 0;
  if (sourcesSection) {
    const sourceMatches = sourcesSection[0].match(/^- /g);
    sourceCount = sourceMatches ? sourceMatches.length : 0;
  }
  
  if (sourceCount < 4) {
    issues.push(`Sources insuffisantes (${sourceCount} trouvées, minimum 4 requis)`);
  }
  
  return {
    hasIssues: issues.length > 0 || hasPlaceholders || orderIssues || missingSections.length > 0 || sourceCount < 4,
    issues,
    hasPlaceholders,
    orderIssues,
    missingSections,
    sourceCount,
    sectionOrder: sectionOrder.length
  };
}

const domains = fs.readdirSync(articlesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const incompleteArticles = [];

domains.forEach(domain => {
  const domainPath = path.join(articlesDir, domain);
  const files = fs.readdirSync(domainPath)
    .filter(file => file.endsWith('.md') && !file.startsWith('_'));
  
  files.forEach(file => {
    const filePath = path.join(domainPath, file);
    const analysis = analyzeArticle(filePath, domain);
    
    if (analysis.hasIssues) {
      incompleteArticles.push({
        domain,
        file,
        path: filePath,
        ...analysis
      });
    }
  });
});

console.log(`\n📋 Résultats de l'analyse:\n`);
console.log(`Total d'articles incomplets: ${incompleteArticles.length}\n`);

// Grouper par domaine
const byDomain = {};
incompleteArticles.forEach(article => {
  if (!byDomain[article.domain]) {
    byDomain[article.domain] = [];
  }
  byDomain[article.domain].push(article);
});

console.log('Répartition par domaine:\n');
Object.keys(byDomain).sort().forEach(domain => {
  console.log(`  ${domain}: ${byDomain[domain].length} article(s)`);
  byDomain[domain].forEach(article => {
    console.log(`    - ${article.file}`);
    if (article.issues.length > 0) {
      console.log(`      Problèmes: ${article.issues.join(', ')}`);
    }
  });
});

// Sauvegarder le rapport
const report = {
  total: incompleteArticles.length,
  byDomain,
  articles: incompleteArticles.map(a => ({
    domain: a.domain,
    file: a.file,
    issues: a.issues,
    hasPlaceholders: a.hasPlaceholders,
    orderIssues: a.orderIssues,
    missingSections: a.missingSections,
    sourceCount: a.sourceCount
  }))
};

fs.writeFileSync(
  path.join(__dirname, '../RAPPORT_ARTICLES_INCOMPLETS.json'),
  JSON.stringify(report, null, 2),
  'utf-8'
);

console.log(`\n✅ Rapport sauvegardé dans RAPPORT_ARTICLES_INCOMPLETS.json\n`);

import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

console.log('\n📊 Analyse des articles incomplets\n');
console.log('='.repeat(80));

function analyzeArticle(filePath, domain) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { content: body } = matter(content);
  
  const issues = [];
  
  // Vérifier les placeholders
  const placeholders = [
    /\[Description avec statistiques selon source fiable 2024\]/gi,
    /\[Définition complète du sujet avec sources\]/gi,
    /\[Observation personnelle basée sur l'expérience terrain\]/gi,
    /\[Nuance d'expert\]/gi,
    /\[Source fiable\]/gi,
    /\[statistique pertinente\]/gi,
    /\[Définition avec statistiques selon source fiable 2024\]/gi,
    /\[Cas d'usage avec statistiques selon source 2024\]/gi,
    /\[Impact avec statistiques selon source fiable 2024\]/gi,
    /\[Défi avec statistiques selon source fiable 2024\]/gi,
    /\[Impact spécifique\]/gi,
    /\[Description\]/gi,
    /\[Critères\]/gi,
    /\[Exemples\]/gi,
    /\[%\]/gi,
    /\[Niveau\]/gi
  ];
  
  let hasPlaceholders = false;
  placeholders.forEach(pattern => {
    if (pattern.test(body)) {
      hasPlaceholders = true;
      issues.push('Placeholders trouvés');
    }
  });
  
  // Vérifier l'ordre des sections
  const sections = [
    '## Introduction',
    '## 1\\. FONDAMENTAUX DU SUJET',
    '## 2\\. ANALYSE APPROFONDIE',
    '## 3\\. STRATÉGIES ET MÉTHODOLOGIES',
    '## 4\\. OUTILS ET TECHNOLOGIES',
    '## 5\\. DÉFIS ET SOLUTIONS',
    '## 6\\. SOURCES ET RÉFÉRENCES',
    '## 7\\. ARTICLES ANNEXES'
  ];
  
  const sectionOrder = [];
  sections.forEach((section, index) => {
    const regex = new RegExp(section, 'i');
    const match = body.match(regex);
    if (match) {
      sectionOrder.push({ name: section, index: match.index, expectedIndex: index });
    }
  });
  
  // Vérifier si les sections sont dans le bon ordre
  let orderIssues = false;
  for (let i = 0; i < sectionOrder.length - 1; i++) {
    if (sectionOrder[i].index > sectionOrder[i + 1].index) {
      orderIssues = true;
      issues.push('Ordre des sections incorrect');
      break;
    }
  }
  
  // Vérifier les sections manquantes
  const requiredSections = [
    'Introduction',
    'FONDAMENTAUX DU SUJET',
    'ANALYSE APPROFONDIE',
    'STRATÉGIES ET MÉTHODOLOGIES',
    'OUTILS ET TECHNOLOGIES',
    'DÉFIS ET SOLUTIONS',
    'SOURCES ET RÉFÉRENCES',
    'ARTICLES ANNEXES'
  ];
  
  const missingSections = [];
  requiredSections.forEach(section => {
    const regex = new RegExp(`##\\s+[0-9]?\\.?\\s*${section}`, 'i');
    if (!regex.test(body)) {
      missingSections.push(section);
    }
  });
  
  if (missingSections.length > 0) {
    issues.push(`Sections manquantes: ${missingSections.join(', ')}`);
  }
  
  // Vérifier les sources
  const sourcesSection = body.match(/##\s+6\.\s+SOURCES\s+ET\s+RÉFÉRENCES[\s\S]*?(?=##|$)/i);
  let sourceCount = 0;
  if (sourcesSection) {
    const sourceMatches = sourcesSection[0].match(/^- /g);
    sourceCount = sourceMatches ? sourceMatches.length : 0;
  }
  
  if (sourceCount < 4) {
    issues.push(`Sources insuffisantes (${sourceCount} trouvées, minimum 4 requis)`);
  }
  
  return {
    hasIssues: issues.length > 0 || hasPlaceholders || orderIssues || missingSections.length > 0 || sourceCount < 4,
    issues,
    hasPlaceholders,
    orderIssues,
    missingSections,
    sourceCount,
    sectionOrder: sectionOrder.length
  };
}

const domains = fs.readdirSync(articlesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const incompleteArticles = [];

domains.forEach(domain => {
  const domainPath = path.join(articlesDir, domain);
  const files = fs.readdirSync(domainPath)
    .filter(file => file.endsWith('.md') && !file.startsWith('_'));
  
  files.forEach(file => {
    const filePath = path.join(domainPath, file);
    const analysis = analyzeArticle(filePath, domain);
    
    if (analysis.hasIssues) {
      incompleteArticles.push({
        domain,
        file,
        path: filePath,
        ...analysis
      });
    }
  });
});

console.log(`\n📋 Résultats de l'analyse:\n`);
console.log(`Total d'articles incomplets: ${incompleteArticles.length}\n`);

// Grouper par domaine
const byDomain = {};
incompleteArticles.forEach(article => {
  if (!byDomain[article.domain]) {
    byDomain[article.domain] = [];
  }
  byDomain[article.domain].push(article);
});

console.log('Répartition par domaine:\n');
Object.keys(byDomain).sort().forEach(domain => {
  console.log(`  ${domain}: ${byDomain[domain].length} article(s)`);
  byDomain[domain].forEach(article => {
    console.log(`    - ${article.file}`);
    if (article.issues.length > 0) {
      console.log(`      Problèmes: ${article.issues.join(', ')}`);
    }
  });
});

// Sauvegarder le rapport
const report = {
  total: incompleteArticles.length,
  byDomain,
  articles: incompleteArticles.map(a => ({
    domain: a.domain,
    file: a.file,
    issues: a.issues,
    hasPlaceholders: a.hasPlaceholders,
    orderIssues: a.orderIssues,
    missingSections: a.missingSections,
    sourceCount: a.sourceCount
  }))
};

fs.writeFileSync(
  path.join(__dirname, '../RAPPORT_ARTICLES_INCOMPLETS.json'),
  JSON.stringify(report, null, 2),
  'utf-8'
);

console.log(`\n✅ Rapport sauvegardé dans RAPPORT_ARTICLES_INCOMPLETS.json\n`);

