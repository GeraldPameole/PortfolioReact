import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

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

function analyzeArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  
  const issues = {
    empty: [],
    incomplete: [],
    placeholders: [],
    sources: []
  };
  
  // Vérifier les sections standard
  const sections = [
    { pattern: /^##\s+Introduction/gi, name: 'Introduction', minLength: 100 },
    { pattern: /^##\s+1\.\s+FONDAMENTAUX\s+DU\s+SUJET/gi, name: '1. FONDAMENTAUX DU SUJET', minLength: 500 },
    { pattern: /^##\s+2\.\s+ANALYSE\s+APPROFONDIE/gi, name: '2. ANALYSE APPROFONDIE', minLength: 500 },
    { pattern: /^##\s+3\.\s+STRATÉGIES\s+ET\s+MÉTHODOLOGIES/gi, name: '3. STRATÉGIES ET MÉTHODOLOGIES', minLength: 300 },
    { pattern: /^##\s+4\.\s+OUTILS\s+ET\s+TECHNOLOGIES/gi, name: '4. OUTILS ET TECHNOLOGIES', minLength: 200 },
    { pattern: /^##\s+5\.\s+DÉFIS\s+ET\s+SOLUTIONS/gi, name: '5. DÉFIS ET SOLUTIONS', minLength: 300 },
    { pattern: /^##\s+6\.\s+SOURCES\s+ET\s+RÉFÉRENCES/gi, name: '6. SOURCES ET RÉFÉRENCES', minLength: 100 }
  ];
  
  sections.forEach(({ pattern, name, minLength }) => {
    const match = body.match(pattern);
    if (match) {
      const sectionStart = body.indexOf(match[0]);
      const nextSection = body.substring(sectionStart + match[0].length).match(/^##\s+/m);
      const sectionEnd = nextSection ? sectionStart + match[0].length + nextSection.index : body.length;
      const sectionContent = body.substring(sectionStart, sectionEnd);
      
      // Vérifier les placeholders
      if (/Contenu à compléter|À compléter|TODO|FIXME|\[contexte spécifique\]|\[à remplir\]/i.test(sectionContent)) {
        issues.placeholders.push(name);
      }
      
      // Vérifier si la section est vide ou trop courte
      const textContent = sectionContent.replace(/^##[^\n]*\n+/m, '').trim();
      if (textContent.length < minLength) {
        if (textContent.length < 50) {
          issues.empty.push(name);
        } else {
          issues.incomplete.push(name);
        }
      }
    } else if (name !== '4. OUTILS ET TECHNOLOGIES' && name !== '5. DÉFIS ET SOLUTIONS') {
      // Ces sections sont optionnelles selon certains articles
      issues.empty.push(name);
    }
  });
  
  // Vérifier les sources
  const sourcesMatch = body.match(/^##\s+6\.\s+SOURCES\s+ET\s+RÉFÉRENCES/gi);
  if (sourcesMatch) {
    const sourcesStart = body.indexOf(sourcesMatch[0]);
    const nextSection = body.substring(sourcesStart).match(/^##\s+7\./m);
    const sourcesEnd = nextSection ? sourcesStart + nextSection.index : body.length;
    const sourcesContent = body.substring(sourcesStart, sourcesEnd);
    
    // Compter les sources (lignes avec des liens ou des références)
    const sourceCount = (sourcesContent.match(/https?:\/\/|\[.*\]\(.*\)|^\s*-\s+.*\d{4}\)/gm) || []).length;
    if (sourceCount < 4) {
      issues.sources.push(`Seulement ${sourceCount} source(s) trouvée(s), minimum 4 requis`);
    }
  }
  
  return {
    file: path.basename(filePath),
    path: filePath,
    domain: path.relative(articlesDir, filePath).split(path.sep)[0],
    issues,
    hasIssues: Object.values(issues).some(arr => arr.length > 0)
  };
}

console.log('\n🔍 Analyse des sections incomplètes\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const analyses = allArticles.map(analyzeArticle);
const articlesWithIssues = analyses.filter(a => a.hasIssues);

console.log(`\n📊 Résultats:\n`);
console.log(`   Total articles: ${allArticles.length}`);
console.log(`   Articles avec problèmes: ${articlesWithIssues.length}`);
console.log(`   Articles complets: ${allArticles.length - articlesWithIssues.length}`);

// Grouper par domaine
const byDomain = {};
articlesWithIssues.forEach(article => {
  if (!byDomain[article.domain]) {
    byDomain[article.domain] = [];
  }
  byDomain[article.domain].push(article);
});

console.log(`\n📁 Articles à compléter par domaine:\n`);
Object.keys(byDomain).sort().forEach(domain => {
  const articles = byDomain[domain];
  console.log(`\n${domain}: ${articles.length} article(s)`);
  articles.forEach(article => {
    console.log(`   - ${article.file}`);
    if (article.issues.empty.length > 0) {
      console.log(`     Sections vides: ${article.issues.empty.join(', ')}`);
    }
    if (article.issues.incomplete.length > 0) {
      console.log(`     Sections incomplètes: ${article.issues.incomplete.join(', ')}`);
    }
    if (article.issues.placeholders.length > 0) {
      console.log(`     Placeholders: ${article.issues.placeholders.join(', ')}`);
    }
    if (article.issues.sources.length > 0) {
      console.log(`     Sources: ${article.issues.sources.join(', ')}`);
    }
  });
});

// Générer un rapport JSON
const report = {
  date: new Date().toISOString(),
  total: allArticles.length,
  withIssues: articlesWithIssues.length,
  complete: allArticles.length - articlesWithIssues.length,
  byDomain: Object.keys(byDomain).reduce((acc, domain) => {
    acc[domain] = byDomain[domain].map(a => ({
      file: a.file,
      issues: a.issues
    }));
    return acc;
  }, {})
};

fs.writeFileSync(
  path.join(__dirname, 'RAPPORT_SECTIONS_INCOMPLETES.json'),
  JSON.stringify(report, null, 2),
  'utf-8'
);

console.log(`\n✅ Rapport JSON généré: RAPPORT_SECTIONS_INCOMPLETES.json\n`);

import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

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

function analyzeArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  
  const issues = {
    empty: [],
    incomplete: [],
    placeholders: [],
    sources: []
  };
  
  // Vérifier les sections standard
  const sections = [
    { pattern: /^##\s+Introduction/gi, name: 'Introduction', minLength: 100 },
    { pattern: /^##\s+1\.\s+FONDAMENTAUX\s+DU\s+SUJET/gi, name: '1. FONDAMENTAUX DU SUJET', minLength: 500 },
    { pattern: /^##\s+2\.\s+ANALYSE\s+APPROFONDIE/gi, name: '2. ANALYSE APPROFONDIE', minLength: 500 },
    { pattern: /^##\s+3\.\s+STRATÉGIES\s+ET\s+MÉTHODOLOGIES/gi, name: '3. STRATÉGIES ET MÉTHODOLOGIES', minLength: 300 },
    { pattern: /^##\s+4\.\s+OUTILS\s+ET\s+TECHNOLOGIES/gi, name: '4. OUTILS ET TECHNOLOGIES', minLength: 200 },
    { pattern: /^##\s+5\.\s+DÉFIS\s+ET\s+SOLUTIONS/gi, name: '5. DÉFIS ET SOLUTIONS', minLength: 300 },
    { pattern: /^##\s+6\.\s+SOURCES\s+ET\s+RÉFÉRENCES/gi, name: '6. SOURCES ET RÉFÉRENCES', minLength: 100 }
  ];
  
  sections.forEach(({ pattern, name, minLength }) => {
    const match = body.match(pattern);
    if (match) {
      const sectionStart = body.indexOf(match[0]);
      const nextSection = body.substring(sectionStart + match[0].length).match(/^##\s+/m);
      const sectionEnd = nextSection ? sectionStart + match[0].length + nextSection.index : body.length;
      const sectionContent = body.substring(sectionStart, sectionEnd);
      
      // Vérifier les placeholders
      if (/Contenu à compléter|À compléter|TODO|FIXME|\[contexte spécifique\]|\[à remplir\]/i.test(sectionContent)) {
        issues.placeholders.push(name);
      }
      
      // Vérifier si la section est vide ou trop courte
      const textContent = sectionContent.replace(/^##[^\n]*\n+/m, '').trim();
      if (textContent.length < minLength) {
        if (textContent.length < 50) {
          issues.empty.push(name);
        } else {
          issues.incomplete.push(name);
        }
      }
    } else if (name !== '4. OUTILS ET TECHNOLOGIES' && name !== '5. DÉFIS ET SOLUTIONS') {
      // Ces sections sont optionnelles selon certains articles
      issues.empty.push(name);
    }
  });
  
  // Vérifier les sources
  const sourcesMatch = body.match(/^##\s+6\.\s+SOURCES\s+ET\s+RÉFÉRENCES/gi);
  if (sourcesMatch) {
    const sourcesStart = body.indexOf(sourcesMatch[0]);
    const nextSection = body.substring(sourcesStart).match(/^##\s+7\./m);
    const sourcesEnd = nextSection ? sourcesStart + nextSection.index : body.length;
    const sourcesContent = body.substring(sourcesStart, sourcesEnd);
    
    // Compter les sources (lignes avec des liens ou des références)
    const sourceCount = (sourcesContent.match(/https?:\/\/|\[.*\]\(.*\)|^\s*-\s+.*\d{4}\)/gm) || []).length;
    if (sourceCount < 4) {
      issues.sources.push(`Seulement ${sourceCount} source(s) trouvée(s), minimum 4 requis`);
    }
  }
  
  return {
    file: path.basename(filePath),
    path: filePath,
    domain: path.relative(articlesDir, filePath).split(path.sep)[0],
    issues,
    hasIssues: Object.values(issues).some(arr => arr.length > 0)
  };
}

console.log('\n🔍 Analyse des sections incomplètes\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const analyses = allArticles.map(analyzeArticle);
const articlesWithIssues = analyses.filter(a => a.hasIssues);

console.log(`\n📊 Résultats:\n`);
console.log(`   Total articles: ${allArticles.length}`);
console.log(`   Articles avec problèmes: ${articlesWithIssues.length}`);
console.log(`   Articles complets: ${allArticles.length - articlesWithIssues.length}`);

// Grouper par domaine
const byDomain = {};
articlesWithIssues.forEach(article => {
  if (!byDomain[article.domain]) {
    byDomain[article.domain] = [];
  }
  byDomain[article.domain].push(article);
});

console.log(`\n📁 Articles à compléter par domaine:\n`);
Object.keys(byDomain).sort().forEach(domain => {
  const articles = byDomain[domain];
  console.log(`\n${domain}: ${articles.length} article(s)`);
  articles.forEach(article => {
    console.log(`   - ${article.file}`);
    if (article.issues.empty.length > 0) {
      console.log(`     Sections vides: ${article.issues.empty.join(', ')}`);
    }
    if (article.issues.incomplete.length > 0) {
      console.log(`     Sections incomplètes: ${article.issues.incomplete.join(', ')}`);
    }
    if (article.issues.placeholders.length > 0) {
      console.log(`     Placeholders: ${article.issues.placeholders.join(', ')}`);
    }
    if (article.issues.sources.length > 0) {
      console.log(`     Sources: ${article.issues.sources.join(', ')}`);
    }
  });
});

// Générer un rapport JSON
const report = {
  date: new Date().toISOString(),
  total: allArticles.length,
  withIssues: articlesWithIssues.length,
  complete: allArticles.length - articlesWithIssues.length,
  byDomain: Object.keys(byDomain).reduce((acc, domain) => {
    acc[domain] = byDomain[domain].map(a => ({
      file: a.file,
      issues: a.issues
    }));
    return acc;
  }, {})
};

fs.writeFileSync(
  path.join(__dirname, 'RAPPORT_SECTIONS_INCOMPLETES.json'),
  JSON.stringify(report, null, 2),
  'utf-8'
);

console.log(`\n✅ Rapport JSON généré: RAPPORT_SECTIONS_INCOMPLETES.json\n`);
