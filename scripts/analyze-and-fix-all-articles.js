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
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function analyzeArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  
  const issues = {
    structure: [],
    incomplete: [],
    sources: [],
    annexes: []
  };
  
  // 1. Vérifier la structure des sections
  const sections = [
    '## Introduction',
    '## 1. FONDAMENTAUX DU SUJET',
    '## 2. ANALYSE APPROFONDIE',
    '## 3. STRATÉGIES ET MÉTHODOLOGIES',
    '## 4. OUTILS ET TECHNOLOGIES',
    '## 5. DÉFIS ET SOLUTIONS',
    '## 5. ARTICLES ANNEXES',
    '## 6. SOURCES ET RÉFÉRENCES'
  ];
  
  const sectionPattern = /^##\s+[0-9]?\.?\s*([^\n]+)/gm;
  const foundSections = [...body.matchAll(sectionPattern)];
  
  // Vérifier les doublons et la numérotation
  const sectionNumbers = {};
  foundSections.forEach(match => {
    const sectionNum = match[0].match(/^##\s+([0-9])/);
    if (sectionNum) {
      const num = sectionNum[1];
      if (sectionNumbers[num]) {
        issues.structure.push(`Section ${num} dupliquée: ${match[1]}`);
      } else {
        sectionNumbers[num] = match[1];
      }
    }
  });
  
  // Vérifier les sections manquantes ou vides
  const requiredSections = [
    '## 1. FONDAMENTAUX DU SUJET',
    '## 2. ANALYSE APPROFONDIE',
    '## 6. SOURCES ET RÉFÉRENCES'
  ];
  
  requiredSections.forEach(section => {
    if (!body.includes(section)) {
      issues.structure.push(`Section manquante: ${section}`);
    } else {
      // Vérifier si la section est vide
      const sectionMatch = body.match(new RegExp(`${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?(?=##|$)`));
      if (sectionMatch && sectionMatch[0].trim().length < 100) {
        issues.incomplete.push(`Section vide ou presque vide: ${section}`);
      }
    }
  });
  
  // 2. Vérifier les placeholders
  const placeholders = [
    /\[contexte spécifique dans ce domaine\]/gi,
    /Contenu à compléter selon ARTICLES_RULES\.md/gi,
    /À compléter/gi,
    /TODO/gi,
    /FIXME/gi
  ];
  
  placeholders.forEach(pattern => {
    if (pattern.test(body)) {
      const matches = [...body.matchAll(pattern)];
      matches.forEach(match => {
        issues.incomplete.push(`Placeholder trouvé: ${match[0]}`);
      });
    }
  });
  
  // 3. Vérifier les sources
  const sourcesMatch = body.match(/##\s+[0-9]?\.?\s*SOURCES\s+ET\s+RÉFÉRENCES/gi);
  if (sourcesMatch) {
    const sourcesIndex = body.indexOf(sourcesMatch[0]);
    const sourcesSection = body.substring(sourcesIndex);
    const nextSectionMatch = sourcesSection.match(/^##\s+/m);
    const sourcesContent = nextSectionMatch 
      ? sourcesSection.substring(0, nextSectionMatch.index)
      : sourcesSection;
    
    const sourceLines = sourcesContent.split('\n').filter(line => 
      line.trim().startsWith('-') && (line.includes('http') || line.includes('<'))
    );
    
    if (sourceLines.length < 4) {
      issues.sources.push(`Seulement ${sourceLines.length} source(s) trouvée(s), minimum 4 requis`);
    }
  } else {
    issues.sources.push('Section SOURCES ET RÉFÉRENCES manquante');
  }
  
  // 4. Vérifier les articles annexes
  const annexesMatch = body.match(/##\s+[0-9]?\.?\s*ARTICLES\s+ANNEXES/gi);
  if (!annexesMatch) {
    issues.annexes.push('Section ARTICLES ANNEXES manquante');
  } else {
    // Vérifier les liens dans les annexes
    const annexesIndex = body.indexOf(annexesMatch[0]);
    const annexesSection = body.substring(annexesIndex);
    const nextSectionMatch = annexesSection.match(/^##\s+/m);
    const annexesContent = nextSectionMatch 
      ? annexesSection.substring(0, nextSectionMatch.index)
      : annexesSection;
    
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [...annexesContent.matchAll(linkPattern)];
    
    if (links.length < 3) {
      issues.annexes.push(`Seulement ${links.length} article(s) annexe(s), minimum 3 recommandé`);
    }
    
    // Vérifier que les liens pointent vers /blog/
    links.forEach(link => {
      if (!link[2].startsWith('/blog/') && !link[2].startsWith('http')) {
        issues.annexes.push(`Lien incorrect: ${link[2]} (doit commencer par /blog/)`);
      }
    });
  }
  
  return {
    file: path.relative(articlesDir, filePath),
    domain: data.domain || 'unknown',
    issues: {
      structure: issues.structure.length > 0 ? issues.structure : null,
      incomplete: issues.incomplete.length > 0 ? issues.incomplete : null,
      sources: issues.sources.length > 0 ? issues.sources : null,
      annexes: issues.annexes.length > 0 ? issues.annexes : null
    },
    hasIssues: issues.structure.length > 0 || issues.incomplete.length > 0 || 
               issues.sources.length > 0 || issues.annexes.length > 0
  };
}

console.log('\n🔍 Analyse de tous les articles\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const analysisResults = [];

allArticles.forEach(filePath => {
  try {
    const result = analyzeArticle(filePath);
    analysisResults.push(result);
  } catch (error) {
    console.error(`❌ Erreur lors de l'analyse de ${filePath}:`, error.message);
  }
});

// Grouper par domaine
const byDomain = {};
analysisResults.forEach(result => {
  const domain = result.domain;
  if (!byDomain[domain]) {
    byDomain[domain] = [];
  }
  byDomain[domain].push(result);
});

// Afficher les résultats par domaine
Object.keys(byDomain).sort().forEach(domain => {
  const articles = byDomain[domain];
  const withIssues = articles.filter(a => a.hasIssues);
  
  console.log(`\n📁 ${domain.toUpperCase()} (${articles.length} articles)`);
  console.log(`   ${withIssues.length} article(s) avec problèmes`);
  
  if (withIssues.length > 0) {
    withIssues.forEach(article => {
      console.log(`\n   ❌ ${article.file}`);
      if (article.issues.structure) {
        console.log(`      Structure: ${article.issues.structure.join(', ')}`);
      }
      if (article.issues.incomplete) {
        console.log(`      Incomplet: ${article.issues.incomplete.slice(0, 3).join(', ')}${article.issues.incomplete.length > 3 ? '...' : ''}`);
      }
      if (article.issues.sources) {
        console.log(`      Sources: ${article.issues.sources.join(', ')}`);
      }
      if (article.issues.annexes) {
        console.log(`      Annexes: ${article.issues.annexes.slice(0, 2).join(', ')}${article.issues.annexes.length > 2 ? '...' : ''}`);
      }
    });
  }
});

// Statistiques globales
const totalArticles = analysisResults.length;
const articlesWithIssues = analysisResults.filter(a => a.hasIssues).length;
const structureIssues = analysisResults.filter(a => a.issues.structure).length;
const incompleteIssues = analysisResults.filter(a => a.issues.incomplete).length;
const sourcesIssues = analysisResults.filter(a => a.issues.sources).length;
const annexesIssues = analysisResults.filter(a => a.issues.annexes).length;

console.log('\n' + '='.repeat(80));
console.log(`\n📊 Statistiques Globales:\n`);
console.log(`   Total articles: ${totalArticles}`);
console.log(`   Articles avec problèmes: ${articlesWithIssues}`);
console.log(`   Problèmes de structure: ${structureIssues}`);
console.log(`   Contenus incomplets: ${incompleteIssues}`);
console.log(`   Problèmes de sources: ${sourcesIssues}`);
console.log(`   Problèmes d'annexes: ${annexesIssues}`);
console.log('');

// Sauvegarder le rapport
const report = {
  date: new Date().toISOString(),
  totalArticles,
  articlesWithIssues,
  byDomain: Object.keys(byDomain).map(domain => ({
    domain,
    total: byDomain[domain].length,
    withIssues: byDomain[domain].filter(a => a.hasIssues).length,
    articles: byDomain[domain].filter(a => a.hasIssues).map(a => ({
      file: a.file,
      issues: a.issues
    }))
  }))
};

fs.writeFileSync(
  path.join(__dirname, '../RAPPORT_ANALYSE_ARTICLES.json'),
  JSON.stringify(report, null, 2),
  'utf-8'
);

console.log('✅ Rapport sauvegardé dans RAPPORT_ANALYSE_ARTICLES.json\n');

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
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function analyzeArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  
  const issues = {
    structure: [],
    incomplete: [],
    sources: [],
    annexes: []
  };
  
  // 1. Vérifier la structure des sections
  const sections = [
    '## Introduction',
    '## 1. FONDAMENTAUX DU SUJET',
    '## 2. ANALYSE APPROFONDIE',
    '## 3. STRATÉGIES ET MÉTHODOLOGIES',
    '## 4. OUTILS ET TECHNOLOGIES',
    '## 5. DÉFIS ET SOLUTIONS',
    '## 5. ARTICLES ANNEXES',
    '## 6. SOURCES ET RÉFÉRENCES'
  ];
  
  const sectionPattern = /^##\s+[0-9]?\.?\s*([^\n]+)/gm;
  const foundSections = [...body.matchAll(sectionPattern)];
  
  // Vérifier les doublons et la numérotation
  const sectionNumbers = {};
  foundSections.forEach(match => {
    const sectionNum = match[0].match(/^##\s+([0-9])/);
    if (sectionNum) {
      const num = sectionNum[1];
      if (sectionNumbers[num]) {
        issues.structure.push(`Section ${num} dupliquée: ${match[1]}`);
      } else {
        sectionNumbers[num] = match[1];
      }
    }
  });
  
  // Vérifier les sections manquantes ou vides
  const requiredSections = [
    '## 1. FONDAMENTAUX DU SUJET',
    '## 2. ANALYSE APPROFONDIE',
    '## 6. SOURCES ET RÉFÉRENCES'
  ];
  
  requiredSections.forEach(section => {
    if (!body.includes(section)) {
      issues.structure.push(`Section manquante: ${section}`);
    } else {
      // Vérifier si la section est vide
      const sectionMatch = body.match(new RegExp(`${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?(?=##|$)`));
      if (sectionMatch && sectionMatch[0].trim().length < 100) {
        issues.incomplete.push(`Section vide ou presque vide: ${section}`);
      }
    }
  });
  
  // 2. Vérifier les placeholders
  const placeholders = [
    /\[contexte spécifique dans ce domaine\]/gi,
    /Contenu à compléter selon ARTICLES_RULES\.md/gi,
    /À compléter/gi,
    /TODO/gi,
    /FIXME/gi
  ];
  
  placeholders.forEach(pattern => {
    if (pattern.test(body)) {
      const matches = [...body.matchAll(pattern)];
      matches.forEach(match => {
        issues.incomplete.push(`Placeholder trouvé: ${match[0]}`);
      });
    }
  });
  
  // 3. Vérifier les sources
  const sourcesMatch = body.match(/##\s+[0-9]?\.?\s*SOURCES\s+ET\s+RÉFÉRENCES/gi);
  if (sourcesMatch) {
    const sourcesIndex = body.indexOf(sourcesMatch[0]);
    const sourcesSection = body.substring(sourcesIndex);
    const nextSectionMatch = sourcesSection.match(/^##\s+/m);
    const sourcesContent = nextSectionMatch 
      ? sourcesSection.substring(0, nextSectionMatch.index)
      : sourcesSection;
    
    const sourceLines = sourcesContent.split('\n').filter(line => 
      line.trim().startsWith('-') && (line.includes('http') || line.includes('<'))
    );
    
    if (sourceLines.length < 4) {
      issues.sources.push(`Seulement ${sourceLines.length} source(s) trouvée(s), minimum 4 requis`);
    }
  } else {
    issues.sources.push('Section SOURCES ET RÉFÉRENCES manquante');
  }
  
  // 4. Vérifier les articles annexes
  const annexesMatch = body.match(/##\s+[0-9]?\.?\s*ARTICLES\s+ANNEXES/gi);
  if (!annexesMatch) {
    issues.annexes.push('Section ARTICLES ANNEXES manquante');
  } else {
    // Vérifier les liens dans les annexes
    const annexesIndex = body.indexOf(annexesMatch[0]);
    const annexesSection = body.substring(annexesIndex);
    const nextSectionMatch = annexesSection.match(/^##\s+/m);
    const annexesContent = nextSectionMatch 
      ? annexesSection.substring(0, nextSectionMatch.index)
      : annexesSection;
    
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [...annexesContent.matchAll(linkPattern)];
    
    if (links.length < 3) {
      issues.annexes.push(`Seulement ${links.length} article(s) annexe(s), minimum 3 recommandé`);
    }
    
    // Vérifier que les liens pointent vers /blog/
    links.forEach(link => {
      if (!link[2].startsWith('/blog/') && !link[2].startsWith('http')) {
        issues.annexes.push(`Lien incorrect: ${link[2]} (doit commencer par /blog/)`);
      }
    });
  }
  
  return {
    file: path.relative(articlesDir, filePath),
    domain: data.domain || 'unknown',
    issues: {
      structure: issues.structure.length > 0 ? issues.structure : null,
      incomplete: issues.incomplete.length > 0 ? issues.incomplete : null,
      sources: issues.sources.length > 0 ? issues.sources : null,
      annexes: issues.annexes.length > 0 ? issues.annexes : null
    },
    hasIssues: issues.structure.length > 0 || issues.incomplete.length > 0 || 
               issues.sources.length > 0 || issues.annexes.length > 0
  };
}

console.log('\n🔍 Analyse de tous les articles\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const analysisResults = [];

allArticles.forEach(filePath => {
  try {
    const result = analyzeArticle(filePath);
    analysisResults.push(result);
  } catch (error) {
    console.error(`❌ Erreur lors de l'analyse de ${filePath}:`, error.message);
  }
});

// Grouper par domaine
const byDomain = {};
analysisResults.forEach(result => {
  const domain = result.domain;
  if (!byDomain[domain]) {
    byDomain[domain] = [];
  }
  byDomain[domain].push(result);
});

// Afficher les résultats par domaine
Object.keys(byDomain).sort().forEach(domain => {
  const articles = byDomain[domain];
  const withIssues = articles.filter(a => a.hasIssues);
  
  console.log(`\n📁 ${domain.toUpperCase()} (${articles.length} articles)`);
  console.log(`   ${withIssues.length} article(s) avec problèmes`);
  
  if (withIssues.length > 0) {
    withIssues.forEach(article => {
      console.log(`\n   ❌ ${article.file}`);
      if (article.issues.structure) {
        console.log(`      Structure: ${article.issues.structure.join(', ')}`);
      }
      if (article.issues.incomplete) {
        console.log(`      Incomplet: ${article.issues.incomplete.slice(0, 3).join(', ')}${article.issues.incomplete.length > 3 ? '...' : ''}`);
      }
      if (article.issues.sources) {
        console.log(`      Sources: ${article.issues.sources.join(', ')}`);
      }
      if (article.issues.annexes) {
        console.log(`      Annexes: ${article.issues.annexes.slice(0, 2).join(', ')}${article.issues.annexes.length > 2 ? '...' : ''}`);
      }
    });
  }
});

// Statistiques globales
const totalArticles = analysisResults.length;
const articlesWithIssues = analysisResults.filter(a => a.hasIssues).length;
const structureIssues = analysisResults.filter(a => a.issues.structure).length;
const incompleteIssues = analysisResults.filter(a => a.issues.incomplete).length;
const sourcesIssues = analysisResults.filter(a => a.issues.sources).length;
const annexesIssues = analysisResults.filter(a => a.issues.annexes).length;

console.log('\n' + '='.repeat(80));
console.log(`\n📊 Statistiques Globales:\n`);
console.log(`   Total articles: ${totalArticles}`);
console.log(`   Articles avec problèmes: ${articlesWithIssues}`);
console.log(`   Problèmes de structure: ${structureIssues}`);
console.log(`   Contenus incomplets: ${incompleteIssues}`);
console.log(`   Problèmes de sources: ${sourcesIssues}`);
console.log(`   Problèmes d'annexes: ${annexesIssues}`);
console.log('');

// Sauvegarder le rapport
const report = {
  date: new Date().toISOString(),
  totalArticles,
  articlesWithIssues,
  byDomain: Object.keys(byDomain).map(domain => ({
    domain,
    total: byDomain[domain].length,
    withIssues: byDomain[domain].filter(a => a.hasIssues).length,
    articles: byDomain[domain].filter(a => a.hasIssues).map(a => ({
      file: a.file,
      issues: a.issues
    }))
  }))
};

fs.writeFileSync(
  path.join(__dirname, '../RAPPORT_ANALYSE_ARTICLES.json'),
  JSON.stringify(report, null, 2),
  'utf-8'
);

console.log('✅ Rapport sauvegardé dans RAPPORT_ANALYSE_ARTICLES.json\n');

