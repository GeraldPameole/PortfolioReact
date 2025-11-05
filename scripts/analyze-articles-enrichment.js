import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  const relativePath = path.relative(articlesDir, filePath);
  
  const analysis = {
    path: relativePath,
    hasExpertIntro: false,
    hasPersonalMethodology: false,
    hasChallengesSection: false,
    hasExpertToolsSection: false,
    hasExpertFormulas: false,
    formulasCount: 0,
    personalStatsCount: 0,
    needsEnrichment: []
  };
  
  // Vérifier introduction avec expertise
  const expertIntroPatterns = [
    /Après avoir.*(?:accompagné|formé|piloté|analysé).*\d+/i,
    /Mon expérience.*révèle/i,
    /j'ai observé/i,
    /j'ai constaté/i,
    /\d+\+?\s*(?:projets|clients|années|talents)/i
  ];
  
  const introMatch = content.match(/##\s+Introduction[\s\S]{0,1000}/i);
  if (introMatch) {
    analysis.hasExpertIntro = expertIntroPatterns.some(pattern => pattern.test(introMatch[0]));
  }
  
  // Vérifier méthodologie personnelle
  const methodologyPatterns = [
    /Ma méthodologie.*éprouvée/i,
    /J'ai développé.*framework/i,
    /L'approche que je recommande/i,
    /framework.*[A-Z]+\.[A-Z]+/i
  ];
  analysis.hasPersonalMethodology = methodologyPatterns.some(pattern => pattern.test(content));
  
  // Vérifier section "Défis et Solutions"
  const challengesPatterns = [
    /##\s+[\d.]+\s+.*[Dd]éfis.*[Ss]olutions/i,
    /Ce que disent les manuels/i,
    /Ce que révèle mon expérience/i,
    /Défi #\d+/i
  ];
  analysis.hasChallengesSection = challengesPatterns.some(pattern => pattern.test(content));
  
  // Vérifier section Outils avec avis personnels
  const toolsSection = content.match(/##\s+[\d.]+\s+.*[Oo]utils[\s\S]{0,2000}/i);
  if (toolsSection) {
    const expertToolsPatterns = [
      /Ayant testé personnellement/i,
      /j'ai observé que/i,
      /Retour d'expérience sur/i,
      /Recommandé si/i,
      /attention à/i
    ];
    analysis.hasExpertToolsSection = expertToolsPatterns.some(pattern => pattern.test(toolsSection[0]));
  }
  
  // Compter formules d'expertise
  const expertFormulas = [
    /Dans ma pratique quotidienne/i,
    /Les \d+ projets que j'ai/i,
    /Mon expérience m'a appris que/i,
    /Une erreur que je vois systématiquement/i,
    /Mon conseil basé sur/i,
    /Contrairement à ce qu'on lit souvent/i
  ];
  
  analysis.formulasCount = expertFormulas.reduce((count, pattern) => {
    const matches = content.match(new RegExp(pattern, 'gi'));
    return count + (matches ? matches.length : 0);
  }, 0);
  analysis.hasExpertFormulas = analysis.formulasCount > 3;
  
  // Compter statistiques personnelles
  const personalStatsPattern = /(?:j'ai|sur \d+|après \d+|mes \d+).*[+\-]\d+%/gi;
  const statsMatches = content.match(personalStatsPattern);
  analysis.personalStatsCount = statsMatches ? statsMatches.length : 0;
  
  // Identifier les besoins d'enrichissement
  if (!analysis.hasExpertIntro) {
    analysis.needsEnrichment.push('Introduction avec expertise');
  }
  if (!analysis.hasPersonalMethodology) {
    analysis.needsEnrichment.push('Méthodologie personnalisée');
  }
  if (!analysis.hasChallengesSection) {
    analysis.needsEnrichment.push('Section Défis et Solutions');
  }
  if (!analysis.hasExpertToolsSection && toolsSection) {
    analysis.needsEnrichment.push('Section Outils avec avis personnels');
  }
  if (!analysis.hasExpertFormulas) {
    analysis.needsEnrichment.push('Formules rhétoriques d\'expertise');
  }
  
  return analysis;
}

// Analyse de tous les articles
const allFiles = getAllMdFiles(articlesDir);
const analyses = allFiles.map(file => analyzeArticle(file));

// Statistiques globales
const stats = {
  total: analyses.length,
  hasExpertIntro: analyses.filter(a => a.hasExpertIntro).length,
  hasPersonalMethodology: analyses.filter(a => a.hasPersonalMethodology).length,
  hasChallengesSection: analyses.filter(a => a.hasChallengesSection).length,
  hasExpertToolsSection: analyses.filter(a => a.hasExpertToolsSection).length,
  hasExpertFormulas: analyses.filter(a => a.hasExpertFormulas).length,
  needsChallengesSection: analyses.filter(a => !a.hasChallengesSection).length,
  needsToolsEnrichment: analyses.filter(a => a.needsEnrichment.includes('Section Outils avec avis personnels')).length
};

// Générer le rapport
const report = {
  stats,
  articlesByPriority: {
    priority1_complete: analyses.filter(a => a.needsEnrichment.length === 0).length,
    priority2_challenges: analyses.filter(a => !a.hasChallengesSection).map(a => a.path),
    priority3_methodology: analyses.filter(a => !a.hasPersonalMethodology).map(a => a.path),
    priority4_formulas: analyses.filter(a => !a.hasExpertFormulas).map(a => a.path),
    priority5_tools: analyses.filter(a => a.needsEnrichment.includes('Section Outils avec avis personnels')).map(a => a.path)
  },
  topNeeds: {}
};

// Articles par besoin
analyses.forEach(analysis => {
  analysis.needsEnrichment.forEach(need => {
    if (!report.topNeeds[need]) {
      report.topNeeds[need] = [];
    }
    report.topNeeds[need].push(analysis.path);
  });
});

// Afficher le rapport
console.log('\n📊 RAPPORT D\'ANALYSE DES ARTICLES\n');
console.log('=' .repeat(60));
console.log('\n📈 STATISTIQUES GLOBALES\n');
console.log(`Total d'articles analysés: ${stats.total}`);
console.log(`✅ Introduction avec expertise: ${stats.hasExpertIntro}/${stats.total} (${Math.round(stats.hasExpertIntro/stats.total*100)}%)`);
console.log(`✅ Méthodologie personnalisée: ${stats.hasPersonalMethodology}/${stats.total} (${Math.round(stats.hasPersonalMethodology/stats.total*100)}%)`);
console.log(`✅ Section Défis et Solutions: ${stats.hasChallengesSection}/${stats.total} (${Math.round(stats.hasChallengesSection/stats.total*100)}%)`);
console.log(`✅ Section Outils avec avis: ${stats.hasExpertToolsSection}/${stats.total} (${Math.round(stats.hasExpertToolsSection/stats.total*100)}%)`);
console.log(`✅ Formules d'expertise (3+): ${stats.hasExpertFormulas}/${stats.total} (${Math.round(stats.hasExpertFormulas/stats.total*100)}%)`);

console.log('\n📋 PRIORITÉS D\'ENRICHISSEMENT\n');
console.log(`🎯 Priorité 1 (Complète): ${report.articlesByPriority.priority1_complete} articles`);
console.log(`🎯 Priorité 2 (Défis et Solutions): ${report.articlesByPriority.priority2_challenges.length} articles`);
console.log(`🎯 Priorité 3 (Méthodologie): ${report.articlesByPriority.priority3_methodology.length} articles`);
console.log(`🎯 Priorité 4 (Formules): ${report.articlesByPriority.priority4_formulas.length} articles`);
console.log(`🎯 Priorité 5 (Outils): ${report.articlesByPriority.priority5_tools.length} articles`);

// Sauvegarder le rapport détaillé
const reportPath = path.join(__dirname, '../RAPPORT_ANALYSE_ENRICHISSEMENT.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log(`\n💾 Rapport détaillé sauvegardé: ${reportPath}\n`);

import path from 'path';
import { fileURLToPath } from 'url';

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
  const relativePath = path.relative(articlesDir, filePath);
  
  const analysis = {
    path: relativePath,
    hasExpertIntro: false,
    hasPersonalMethodology: false,
    hasChallengesSection: false,
    hasExpertToolsSection: false,
    hasExpertFormulas: false,
    formulasCount: 0,
    personalStatsCount: 0,
    needsEnrichment: []
  };
  
  // Vérifier introduction avec expertise
  const expertIntroPatterns = [
    /Après avoir.*(?:accompagné|formé|piloté|analysé).*\d+/i,
    /Mon expérience.*révèle/i,
    /j'ai observé/i,
    /j'ai constaté/i,
    /\d+\+?\s*(?:projets|clients|années|talents)/i
  ];
  
  const introMatch = content.match(/##\s+Introduction[\s\S]{0,1000}/i);
  if (introMatch) {
    analysis.hasExpertIntro = expertIntroPatterns.some(pattern => pattern.test(introMatch[0]));
  }
  
  // Vérifier méthodologie personnelle
  const methodologyPatterns = [
    /Ma méthodologie.*éprouvée/i,
    /J'ai développé.*framework/i,
    /L'approche que je recommande/i,
    /framework.*[A-Z]+\.[A-Z]+/i
  ];
  analysis.hasPersonalMethodology = methodologyPatterns.some(pattern => pattern.test(content));
  
  // Vérifier section "Défis et Solutions"
  const challengesPatterns = [
    /##\s+[\d.]+\s+.*[Dd]éfis.*[Ss]olutions/i,
    /Ce que disent les manuels/i,
    /Ce que révèle mon expérience/i,
    /Défi #\d+/i
  ];
  analysis.hasChallengesSection = challengesPatterns.some(pattern => pattern.test(content));
  
  // Vérifier section Outils avec avis personnels
  const toolsSection = content.match(/##\s+[\d.]+\s+.*[Oo]utils[\s\S]{0,2000}/i);
  if (toolsSection) {
    const expertToolsPatterns = [
      /Ayant testé personnellement/i,
      /j'ai observé que/i,
      /Retour d'expérience sur/i,
      /Recommandé si/i,
      /attention à/i
    ];
    analysis.hasExpertToolsSection = expertToolsPatterns.some(pattern => pattern.test(toolsSection[0]));
  }
  
  // Compter formules d'expertise
  const expertFormulas = [
    /Dans ma pratique quotidienne/i,
    /Les \d+ projets que j'ai/i,
    /Mon expérience m'a appris que/i,
    /Une erreur que je vois systématiquement/i,
    /Mon conseil basé sur/i,
    /Contrairement à ce qu'on lit souvent/i
  ];
  
  analysis.formulasCount = expertFormulas.reduce((count, pattern) => {
    const matches = content.match(new RegExp(pattern, 'gi'));
    return count + (matches ? matches.length : 0);
  }, 0);
  analysis.hasExpertFormulas = analysis.formulasCount > 3;
  
  // Compter statistiques personnelles
  const personalStatsPattern = /(?:j'ai|sur \d+|après \d+|mes \d+).*[+\-]\d+%/gi;
  const statsMatches = content.match(personalStatsPattern);
  analysis.personalStatsCount = statsMatches ? statsMatches.length : 0;
  
  // Identifier les besoins d'enrichissement
  if (!analysis.hasExpertIntro) {
    analysis.needsEnrichment.push('Introduction avec expertise');
  }
  if (!analysis.hasPersonalMethodology) {
    analysis.needsEnrichment.push('Méthodologie personnalisée');
  }
  if (!analysis.hasChallengesSection) {
    analysis.needsEnrichment.push('Section Défis et Solutions');
  }
  if (!analysis.hasExpertToolsSection && toolsSection) {
    analysis.needsEnrichment.push('Section Outils avec avis personnels');
  }
  if (!analysis.hasExpertFormulas) {
    analysis.needsEnrichment.push('Formules rhétoriques d\'expertise');
  }
  
  return analysis;
}

// Analyse de tous les articles
const allFiles = getAllMdFiles(articlesDir);
const analyses = allFiles.map(file => analyzeArticle(file));

// Statistiques globales
const stats = {
  total: analyses.length,
  hasExpertIntro: analyses.filter(a => a.hasExpertIntro).length,
  hasPersonalMethodology: analyses.filter(a => a.hasPersonalMethodology).length,
  hasChallengesSection: analyses.filter(a => a.hasChallengesSection).length,
  hasExpertToolsSection: analyses.filter(a => a.hasExpertToolsSection).length,
  hasExpertFormulas: analyses.filter(a => a.hasExpertFormulas).length,
  needsChallengesSection: analyses.filter(a => !a.hasChallengesSection).length,
  needsToolsEnrichment: analyses.filter(a => a.needsEnrichment.includes('Section Outils avec avis personnels')).length
};

// Générer le rapport
const report = {
  stats,
  articlesByPriority: {
    priority1_complete: analyses.filter(a => a.needsEnrichment.length === 0).length,
    priority2_challenges: analyses.filter(a => !a.hasChallengesSection).map(a => a.path),
    priority3_methodology: analyses.filter(a => !a.hasPersonalMethodology).map(a => a.path),
    priority4_formulas: analyses.filter(a => !a.hasExpertFormulas).map(a => a.path),
    priority5_tools: analyses.filter(a => a.needsEnrichment.includes('Section Outils avec avis personnels')).map(a => a.path)
  },
  topNeeds: {}
};

// Articles par besoin
analyses.forEach(analysis => {
  analysis.needsEnrichment.forEach(need => {
    if (!report.topNeeds[need]) {
      report.topNeeds[need] = [];
    }
    report.topNeeds[need].push(analysis.path);
  });
});

// Afficher le rapport
console.log('\n📊 RAPPORT D\'ANALYSE DES ARTICLES\n');
console.log('=' .repeat(60));
console.log('\n📈 STATISTIQUES GLOBALES\n');
console.log(`Total d'articles analysés: ${stats.total}`);
console.log(`✅ Introduction avec expertise: ${stats.hasExpertIntro}/${stats.total} (${Math.round(stats.hasExpertIntro/stats.total*100)}%)`);
console.log(`✅ Méthodologie personnalisée: ${stats.hasPersonalMethodology}/${stats.total} (${Math.round(stats.hasPersonalMethodology/stats.total*100)}%)`);
console.log(`✅ Section Défis et Solutions: ${stats.hasChallengesSection}/${stats.total} (${Math.round(stats.hasChallengesSection/stats.total*100)}%)`);
console.log(`✅ Section Outils avec avis: ${stats.hasExpertToolsSection}/${stats.total} (${Math.round(stats.hasExpertToolsSection/stats.total*100)}%)`);
console.log(`✅ Formules d'expertise (3+): ${stats.hasExpertFormulas}/${stats.total} (${Math.round(stats.hasExpertFormulas/stats.total*100)}%)`);

console.log('\n📋 PRIORITÉS D\'ENRICHISSEMENT\n');
console.log(`🎯 Priorité 1 (Complète): ${report.articlesByPriority.priority1_complete} articles`);
console.log(`🎯 Priorité 2 (Défis et Solutions): ${report.articlesByPriority.priority2_challenges.length} articles`);
console.log(`🎯 Priorité 3 (Méthodologie): ${report.articlesByPriority.priority3_methodology.length} articles`);
console.log(`🎯 Priorité 4 (Formules): ${report.articlesByPriority.priority4_formulas.length} articles`);
console.log(`🎯 Priorité 5 (Outils): ${report.articlesByPriority.priority5_tools.length} articles`);

// Sauvegarder le rapport détaillé
const reportPath = path.join(__dirname, '../RAPPORT_ANALYSE_ENRICHISSEMENT.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log(`\n💾 Rapport détaillé sauvegardé: ${reportPath}\n`);

