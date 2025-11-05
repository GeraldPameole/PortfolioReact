import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles/gestion-talents');

function getAllMdFiles(dir) {
  const files = fs.readdirSync(dir);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(dir, file));
}

function analyzeArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);
  const fileName = path.basename(filePath);
  
  const issues = [];
  const warnings = [];
  
  // Vérifier les placeholders
  const placeholderPatterns = [
    /À compléter/gi,
    /placeholder/gi,
    /TODO/gi,
    /\[À compléter/gi
  ];
  
  let placeholderCount = 0;
  placeholderPatterns.forEach(pattern => {
    const matches = body.match(pattern);
    if (matches) {
      placeholderCount += matches.length;
    }
  });
  
  // Vérifier l'ordre des sections
  const section1Index = body.indexOf('## 1. FONDAMENTAUX DU SUJET');
  const section2Index = body.indexOf('## 2. ANALYSE APPROFONDIE');
  
  const isOrderCorrect = section1Index !== -1 && section2Index !== -1 && section1Index < section2Index;
  
  // Vérifier les sources (section 6)
  const sourcesSection = body.match(/## 6\.\s*SOURCES ET RÉFÉRENCES[\s\S]*?(?=##|$)/i);
  let sourceCount = 0;
  if (sourcesSection) {
    const sourceLines = sourcesSection[0].match(/^[-*]\s+.*$/gm) || [];
    sourceCount = sourceLines.length;
  }
  
  // Vérifier le contenu des sections principales
  const section1Content = body.match(/## 1\.\s*FONDAMENTAUX DU SUJET[\s\S]*?(?=##|$)/i);
  const section2Content = body.match(/## 2\.\s*ANALYSE APPROFONDIE[\s\S]*?(?=##|$)/i);
  
  const section1Complete = section1Content && 
    !section1Content[0].match(/À compléter|placeholder|TODO/gi) &&
    section1Content[0].length > 500;
  
  const section2Complete = section2Content && 
    !section2Content[0].match(/À compléter|placeholder|TODO/gi) &&
    section2Content[0].length > 500;
  
  // Compter les citations de sources dans le texte
  const sourceCitations = (body.match(/selon\s+[A-Z][^\.]+\(2024\)/gi) || []).length;
  
  // Collecter les problèmes
  if (placeholderCount > 0) {
    issues.push(`${placeholderCount} placeholders à compléter`);
  }
  
  if (sourceCount < 4) {
    issues.push(`Seulement ${sourceCount} sources (minimum 4 requis)`);
  }
  
  if (sourceCitations < 4) {
    warnings.push(`Seulement ${sourceCitations} citations de sources dans le texte (recommandé: 4+)`);
  }
  
  if (!isOrderCorrect) {
    issues.push(`Ordre des sections incorrect (section 2 avant section 1)`);
  }
  
  if (!section1Complete) {
    issues.push('Section 1. FONDAMENTAUX DU SUJET incomplète');
  }
  
  if (!section2Complete) {
    issues.push('Section 2. ANALYSE APPROFONDIE incomplète');
  }
  
  return {
    fileName,
    title: frontmatter.title || 'Sans titre',
    hasIssues: issues.length > 0,
    hasWarnings: warnings.length > 0,
    issues,
    warnings,
    stats: {
      placeholders: placeholderCount,
      sources: sourceCount,
      sourceCitations,
      section1Complete,
      section2Complete,
      orderCorrect: isOrderCorrect
    }
  };
}

// Analyser tous les articles
const files = getAllMdFiles(articlesDir);
const results = files.map(file => analyzeArticle(file));

// Générer le rapport
console.log('='.repeat(80));
console.log('RAPPORT DE VÉRIFICATION - DOMAINE GESTION-TALENTS');
console.log('='.repeat(80));
console.log(`\nTotal articles analysés: ${results.length}\n`);

const articlesWithIssues = results.filter(r => r.hasIssues);
const articlesWithWarnings = results.filter(r => r.hasWarnings);
const articlesComplete = results.filter(r => !r.hasIssues && !r.hasWarnings);

console.log(`✅ Articles complets: ${articlesComplete.length}`);
console.log(`⚠️  Articles avec avertissements: ${articlesWithWarnings.length}`);
console.log(`❌ Articles avec problèmes: ${articlesWithIssues.length}\n`);

// Détails par article
results.forEach(result => {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📄 ${result.fileName}`);
  console.log(`   Titre: ${result.title}`);
  console.log(`   Statut: ${result.hasIssues ? '❌ PROBLÈMES' : result.hasWarnings ? '⚠️  AVERTISSEMENTS' : '✅ COMPLET'}`);
  
  console.log(`   Sources: ${result.stats.sources}`);
  console.log(`   Citations dans le texte: ${result.stats.sourceCitations}`);
  console.log(`   Placeholders: ${result.stats.placeholders}`);
  console.log(`   Section 1 complète: ${result.stats.section1Complete ? '✅' : '❌'}`);
  console.log(`   Section 2 complète: ${result.stats.section2Complete ? '✅' : '❌'}`);
  console.log(`   Ordre correct: ${result.stats.orderCorrect ? '✅' : '❌'}`);
  
  if (result.issues.length > 0) {
    console.log(`\n   ❌ PROBLÈMES:`);
    result.issues.forEach(issue => {
      console.log(`      - ${issue}`);
    });
  }
  
  if (result.warnings.length > 0) {
    console.log(`\n   ⚠️  AVERTISSEMENTS:`);
    result.warnings.forEach(warning => {
      console.log(`      - ${warning}`);
    });
  }
});

// Résumé final
console.log(`\n${'='.repeat(80)}`);
console.log('RÉSUMÉ');
console.log('='.repeat(80));
console.log(`\nArticles nécessitant une correction: ${articlesWithIssues.length}`);
if (articlesWithIssues.length > 0) {
  console.log('\nArticles à corriger:');
  articlesWithIssues.forEach(r => {
    console.log(`  - ${r.fileName}: ${r.issues.join(', ')}`);
  });
}

// Sauvegarder le rapport
const reportPath = path.join(__dirname, '../RAPPORT_VERIFICATION_GESTION_TALENTS.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\n\nRapport détaillé sauvegardé dans: ${reportPath}`);

import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles/gestion-talents');

function getAllMdFiles(dir) {
  const files = fs.readdirSync(dir);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(dir, file));
}

function analyzeArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);
  const fileName = path.basename(filePath);
  
  const issues = [];
  const warnings = [];
  
  // Vérifier les placeholders
  const placeholderPatterns = [
    /À compléter/gi,
    /placeholder/gi,
    /TODO/gi,
    /\[À compléter/gi
  ];
  
  let placeholderCount = 0;
  placeholderPatterns.forEach(pattern => {
    const matches = body.match(pattern);
    if (matches) {
      placeholderCount += matches.length;
    }
  });
  
  // Vérifier l'ordre des sections
  const section1Index = body.indexOf('## 1. FONDAMENTAUX DU SUJET');
  const section2Index = body.indexOf('## 2. ANALYSE APPROFONDIE');
  
  const isOrderCorrect = section1Index !== -1 && section2Index !== -1 && section1Index < section2Index;
  
  // Vérifier les sources (section 6)
  const sourcesSection = body.match(/## 6\.\s*SOURCES ET RÉFÉRENCES[\s\S]*?(?=##|$)/i);
  let sourceCount = 0;
  if (sourcesSection) {
    const sourceLines = sourcesSection[0].match(/^[-*]\s+.*$/gm) || [];
    sourceCount = sourceLines.length;
  }
  
  // Vérifier le contenu des sections principales
  const section1Content = body.match(/## 1\.\s*FONDAMENTAUX DU SUJET[\s\S]*?(?=##|$)/i);
  const section2Content = body.match(/## 2\.\s*ANALYSE APPROFONDIE[\s\S]*?(?=##|$)/i);
  
  const section1Complete = section1Content && 
    !section1Content[0].match(/À compléter|placeholder|TODO/gi) &&
    section1Content[0].length > 500;
  
  const section2Complete = section2Content && 
    !section2Content[0].match(/À compléter|placeholder|TODO/gi) &&
    section2Content[0].length > 500;
  
  // Compter les citations de sources dans le texte
  const sourceCitations = (body.match(/selon\s+[A-Z][^\.]+\(2024\)/gi) || []).length;
  
  // Collecter les problèmes
  if (placeholderCount > 0) {
    issues.push(`${placeholderCount} placeholders à compléter`);
  }
  
  if (sourceCount < 4) {
    issues.push(`Seulement ${sourceCount} sources (minimum 4 requis)`);
  }
  
  if (sourceCitations < 4) {
    warnings.push(`Seulement ${sourceCitations} citations de sources dans le texte (recommandé: 4+)`);
  }
  
  if (!isOrderCorrect) {
    issues.push(`Ordre des sections incorrect (section 2 avant section 1)`);
  }
  
  if (!section1Complete) {
    issues.push('Section 1. FONDAMENTAUX DU SUJET incomplète');
  }
  
  if (!section2Complete) {
    issues.push('Section 2. ANALYSE APPROFONDIE incomplète');
  }
  
  return {
    fileName,
    title: frontmatter.title || 'Sans titre',
    hasIssues: issues.length > 0,
    hasWarnings: warnings.length > 0,
    issues,
    warnings,
    stats: {
      placeholders: placeholderCount,
      sources: sourceCount,
      sourceCitations,
      section1Complete,
      section2Complete,
      orderCorrect: isOrderCorrect
    }
  };
}

// Analyser tous les articles
const files = getAllMdFiles(articlesDir);
const results = files.map(file => analyzeArticle(file));

// Générer le rapport
console.log('='.repeat(80));
console.log('RAPPORT DE VÉRIFICATION - DOMAINE GESTION-TALENTS');
console.log('='.repeat(80));
console.log(`\nTotal articles analysés: ${results.length}\n`);

const articlesWithIssues = results.filter(r => r.hasIssues);
const articlesWithWarnings = results.filter(r => r.hasWarnings);
const articlesComplete = results.filter(r => !r.hasIssues && !r.hasWarnings);

console.log(`✅ Articles complets: ${articlesComplete.length}`);
console.log(`⚠️  Articles avec avertissements: ${articlesWithWarnings.length}`);
console.log(`❌ Articles avec problèmes: ${articlesWithIssues.length}\n`);

// Détails par article
results.forEach(result => {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📄 ${result.fileName}`);
  console.log(`   Titre: ${result.title}`);
  console.log(`   Statut: ${result.hasIssues ? '❌ PROBLÈMES' : result.hasWarnings ? '⚠️  AVERTISSEMENTS' : '✅ COMPLET'}`);
  
  console.log(`   Sources: ${result.stats.sources}`);
  console.log(`   Citations dans le texte: ${result.stats.sourceCitations}`);
  console.log(`   Placeholders: ${result.stats.placeholders}`);
  console.log(`   Section 1 complète: ${result.stats.section1Complete ? '✅' : '❌'}`);
  console.log(`   Section 2 complète: ${result.stats.section2Complete ? '✅' : '❌'}`);
  console.log(`   Ordre correct: ${result.stats.orderCorrect ? '✅' : '❌'}`);
  
  if (result.issues.length > 0) {
    console.log(`\n   ❌ PROBLÈMES:`);
    result.issues.forEach(issue => {
      console.log(`      - ${issue}`);
    });
  }
  
  if (result.warnings.length > 0) {
    console.log(`\n   ⚠️  AVERTISSEMENTS:`);
    result.warnings.forEach(warning => {
      console.log(`      - ${warning}`);
    });
  }
});

// Résumé final
console.log(`\n${'='.repeat(80)}`);
console.log('RÉSUMÉ');
console.log('='.repeat(80));
console.log(`\nArticles nécessitant une correction: ${articlesWithIssues.length}`);
if (articlesWithIssues.length > 0) {
  console.log('\nArticles à corriger:');
  articlesWithIssues.forEach(r => {
    console.log(`  - ${r.fileName}: ${r.issues.join(', ')}`);
  });
}

// Sauvegarder le rapport
const reportPath = path.join(__dirname, '../RAPPORT_VERIFICATION_GESTION_TALENTS.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\n\nRapport détaillé sauvegardé dans: ${reportPath}`);

