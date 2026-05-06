import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const articlesDir = path.join(projectRoot, 'src/content/articles');

const STANDARD_SECTIONS = [
  '## Introduction',
  '## 1. FONDAMENTAUX DU SUJET',
  '## 2. ANALYSE APPROFONDIE',
  '## 3. STRATÉGIES ET MÉTHODOLOGIES',
  '## 4. OUTILS ET TECHNOLOGIES',
  '## 5. DÉFIS ET SOLUTIONS',
  '## 6. SOURCES ET RÉFÉRENCES',
  '## 7. ARTICLES ANNEXES'
];

function getAllMdFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllMdFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function analyzeArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(articlesDir, filePath);
  const domain = path.dirname(relativePath).split(path.sep)[0];
  
  const issues = {
    placeholders: 0,
    missingSections: [],
    duplicateSections: [],
    wrongOrder: false,
    annexesCount: 0,
    hasAnnexesSection: false
  };
  
  // Compter les placeholders
  const placeholderPatterns = [
    /\[À compléter/gi,
    /\[contexte spécifique/gi,
    /Contenu à compléter/gi,
    /TODO/gi,
    /FIXME/gi
  ];
  
  placeholderPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      issues.placeholders += matches.length;
    }
  });
  
  // Vérifier les sections
  const foundSections = [];
  STANDARD_SECTIONS.forEach(section => {
    const regex = new RegExp('^' + section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'm');
    const matches = content.match(regex);
    if (matches) {
      foundSections.push(section);
    }
  });
  
  // Vérifier l'ordre des sections
  let lastOrder = -1;
  let wrongOrderDetected = false;
  STANDARD_SECTIONS.forEach((section, index) => {
    const regex = new RegExp('^' + section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'm');
    const match = content.match(regex);
    if (match) {
      const currentOrder = index;
      if (currentOrder < lastOrder) {
        wrongOrderDetected = true;
      }
      lastOrder = currentOrder;
    }
  });
  
  issues.wrongOrder = wrongOrderDetected;
  
  // Vérifier les sections manquantes
  STANDARD_SECTIONS.forEach(section => {
    if (!foundSections.includes(section)) {
      issues.missingSections.push(section);
    }
  });
  
  // Compter les doublons de sections
  const sectionCounts = {};
  foundSections.forEach(section => {
    sectionCounts[section] = (sectionCounts[section] || 0) + 1;
  });
  
  Object.keys(sectionCounts).forEach(section => {
    if (sectionCounts[section] > 1) {
      issues.duplicateSections.push(section);
    }
  });
  
  // Compter les articles annexes
  const annexesMatch = content.match(/##\s*7\.\s*ARTICLES\s+ANNEXES[\s\S]*?(?=##|$)/i);
  if (annexesMatch) {
    issues.hasAnnexesSection = true;
    const annexesContent = annexesMatch[0];
    // Compter les liens d'articles annexes (format: [Titre](/blog/...))
    const annexeLinks = annexesContent.match(/^\d+\.\s*\*\*\[/gm);
    if (annexeLinks) {
      issues.annexesCount = annexeLinks.length;
    }
  }
  
  return {
    file: path.basename(filePath),
    domain,
    path: relativePath,
    issues,
    foundSections: foundSections.length,
    totalSections: STANDARD_SECTIONS.length
  };
}

// Analyser tous les articles
const articles = getAllMdFiles(articlesDir);
const analysis = articles.map(article => analyzeArticle(article));

// Grouper par domaine
const byDomain = {};
analysis.forEach(article => {
  if (!byDomain[article.domain]) {
    byDomain[article.domain] = [];
  }
  byDomain[article.domain].push(article);
});

// Générer le rapport
console.log('='.repeat(80));
console.log('📊 RAPPORT D\'ANALYSE DES ARTICLES PAR DOMAINE');
console.log('='.repeat(80));
console.log();

Object.keys(byDomain).sort().forEach(domain => {
  const domainArticles = byDomain[domain];
  const totalArticles = domainArticles.length;
  
  // Statistiques du domaine
  const totalPlaceholders = domainArticles.reduce((sum, a) => sum + a.issues.placeholders, 0);
  const articlesWithPlaceholders = domainArticles.filter(a => a.issues.placeholders > 0).length;
  const articlesWithMissingSections = domainArticles.filter(a => a.issues.missingSections.length > 0).length;
  const articlesWithWrongOrder = domainArticles.filter(a => a.issues.wrongOrder).length;
  const articlesWithDuplicates = domainArticles.filter(a => a.issues.duplicateSections.length > 0).length;
  const articlesWithTooManyAnnexes = domainArticles.filter(a => a.issues.annexesCount > 4).length;
  const articlesWithoutAnnexes = domainArticles.filter(a => !a.issues.hasAnnexesSection).length;
  
  console.log(`📁 ${domain.toUpperCase()}`);
  console.log(`   Total articles: ${totalArticles}`);
  console.log(`   Placeholders: ${totalPlaceholders} (dans ${articlesWithPlaceholders} articles)`);
  console.log(`   Sections manquantes: ${articlesWithMissingSections} articles`);
  console.log(`   Ordre incorrect: ${articlesWithWrongOrder} articles`);
  console.log(`   Sections dupliquées: ${articlesWithDuplicates} articles`);
  console.log(`   Annexes > 4: ${articlesWithTooManyAnnexes} articles`);
  console.log(`   Sans section annexes: ${articlesWithoutAnnexes} articles`);
  console.log();
  
  // Détails par article
  if (articlesWithPlaceholders > 0 || articlesWithMissingSections > 0 || articlesWithWrongOrder > 0 || articlesWithDuplicates > 0 || articlesWithTooManyAnnexes > 0) {
    console.log(`   📋 Articles nécessitant attention:`);
    domainArticles.forEach(article => {
      const problems = [];
      if (article.issues.placeholders > 0) {
        problems.push(`${article.issues.placeholders} placeholders`);
      }
      if (article.issues.missingSections.length > 0) {
        problems.push(`${article.issues.missingSections.length} sections manquantes`);
      }
      if (article.issues.wrongOrder) {
        problems.push('ordre incorrect');
      }
      if (article.issues.duplicateSections.length > 0) {
        problems.push(`${article.issues.duplicateSections.length} sections dupliquées`);
      }
      if (article.issues.annexesCount > 4) {
        problems.push(`${article.issues.annexesCount} annexes (>4)`);
      }
      if (problems.length > 0) {
        console.log(`      - ${article.file}: ${problems.join(', ')}`);
      }
    });
    console.log();
  }
});

// Résumé global
console.log('='.repeat(80));
console.log('📈 RÉSUMÉ GLOBAL');
console.log('='.repeat(80));
console.log();

const totalArticles = analysis.length;
const totalPlaceholders = analysis.reduce((sum, a) => sum + a.issues.placeholders, 0);
const totalWithPlaceholders = analysis.filter(a => a.issues.placeholders > 0).length;
const totalWithIssues = analysis.filter(a => 
  a.issues.placeholders > 0 || 
  a.issues.missingSections.length > 0 || 
  a.issues.wrongOrder || 
  a.issues.duplicateSections.length > 0 ||
  a.issues.annexesCount > 4
).length;

console.log(`Total articles: ${totalArticles}`);
console.log(`Articles avec placeholders: ${totalWithPlaceholders} (${totalPlaceholders} placeholders au total)`);
console.log(`Articles nécessitant attention: ${totalWithIssues}`);
console.log(`Articles complets: ${totalArticles - totalWithIssues}`);
console.log();

