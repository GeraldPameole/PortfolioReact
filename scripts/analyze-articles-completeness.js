import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesRoot = path.join(__dirname, '../src/content/articles');

const standardSections = [
  "Introduction",
  "1. FONDAMENTAUX",
  "2. ANALYSE",
  "3. STRATÉGIES",
  "4. OUTILS",
  "5. DÉFIS",
  "6. SOURCES",
  "7. ARTICLES ANNEXES"
];

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

function checkCompleteness(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);
  
  const issues = {
    hasPlaceholders: false,
    missingSections: [],
    hasNonStandardContent: false,
    sourceCount: 0,
    hasMethodology: false,
    hasExpertise: false
  };
  
  // Check for placeholders
  if (content.includes('[À compléter') || content.includes('_[À compléter')) {
    issues.hasPlaceholders = true;
  }
  
  // Check for standard sections
  const hasIntroduction = /^##\s+Introduction/m.test(content);
  const hasFondamentaux = /^##\s+1\.\s+FONDAMENTAUX/m.test(content);
  const hasAnalyse = /^##\s+2\.\s+ANALYSE/m.test(content);
  const hasStrategies = /^##\s+3\.\s+STRATÉGIES/m.test(content);
  const hasOutils = /^##\s+4\.\s+OUTILS/m.test(content);
  const hasDefis = /^##\s+5\.\s+DÉFIS/m.test(content);
  const hasSources = /^##\s+6\.\s+SOURCES/m.test(content);
  const hasAnnexes = /^##\s+7\.\s+ARTICLES\s+ANNEXES/m.test(content);
  
  if (!hasIntroduction) issues.missingSections.push('Introduction');
  if (!hasFondamentaux) issues.missingSections.push('1. FONDAMENTAUX');
  if (!hasAnalyse) issues.missingSections.push('2. ANALYSE');
  if (!hasStrategies) issues.missingSections.push('3. STRATÉGIES');
  if (!hasOutils) issues.missingSections.push('4. OUTILS');
  if (!hasDefis) issues.missingSections.push('5. DÉFIS');
  if (!hasSources) issues.missingSections.push('6. SOURCES');
  if (!hasAnnexes) issues.missingSections.push('7. ARTICLES ANNEXES');
  
  // Check for sources (minimum 4)
  const sourceMatches = content.match(/\[.*?\]\s*-\s*".*?"\s*-\s*<https?:\/\/.*?>/g);
  if (sourceMatches) {
    issues.sourceCount = sourceMatches.length;
  }
  
  // Check for methodology (framework personalisé)
  if (/(framework|méthodologie|F\.P\.C\.|R\.I\.S\.Q\.U\.E\.S\.|A\.G\.I\.L\.E\.|R\.E\.C\.R\.U\.T\.E\.R\.|A\.P\.P\.R\.E\.N\.D\.R\.E\.)/i.test(content)) {
    issues.hasMethodology = true;
  }
  
  // Check for expertise markers
  if (/(mon expérience|mes programmes|j'ai observé|j'ai développé|dans ma pratique|mes clients)/i.test(content)) {
    issues.hasExpertise = true;
  }
  
  // Check for non-standard content after section 7
  const annexesMatch = content.match(/^##\s+7\.\s+ARTICLES\s+ANNEXES/m);
  if (annexesMatch) {
    const afterAnnexes = content.substring(annexesMatch.index + annexesMatch[0].length);
    // Check if there are more sections after section 7
    if (/^##\s+[8-9]|^##\s+[1-9][0-9]/m.test(afterAnnexes)) {
      issues.hasNonStandardContent = true;
    }
  }
  
  return issues;
}

function getDomainFromPath(filePath) {
  const relativePath = path.relative(articlesRoot, filePath);
  return path.dirname(relativePath) || 'root';
}

function main() {
  const allFiles = getAllMdFiles(articlesRoot);
  const domainStats = {};
  
  allFiles.forEach(filePath => {
    const domain = getDomainFromPath(filePath);
    const filename = path.basename(filePath);
    const issues = checkCompleteness(filePath);
    
    if (!domainStats[domain]) {
      domainStats[domain] = {
        total: 0,
        complete: 0,
        incomplete: 0,
        withPlaceholders: 0,
        missingSections: {},
        lowSources: 0,
        noMethodology: 0,
        noExpertise: 0,
        articles: []
      };
    }
    
    domainStats[domain].total++;
    
    const isComplete = !issues.hasPlaceholders && 
                      issues.missingSections.length === 0 && 
                      issues.sourceCount >= 4 && 
                      issues.hasMethodology && 
                      issues.hasExpertise &&
                      !issues.hasNonStandardContent;
    
    if (isComplete) {
      domainStats[domain].complete++;
    } else {
      domainStats[domain].incomplete++;
    }
    
    if (issues.hasPlaceholders) {
      domainStats[domain].withPlaceholders++;
    }
    
    if (issues.sourceCount < 4) {
      domainStats[domain].lowSources++;
    }
    
    if (!issues.hasMethodology) {
      domainStats[domain].noMethodology++;
    }
    
    if (!issues.hasExpertise) {
      domainStats[domain].noExpertise++;
    }
    
    issues.missingSections.forEach(section => {
      if (!domainStats[domain].missingSections[section]) {
        domainStats[domain].missingSections[section] = 0;
      }
      domainStats[domain].missingSections[section]++;
    });
    
    domainStats[domain].articles.push({
      filename,
      issues,
      isComplete
    });
  });
  
  // Generate report
  console.log('\n📊 RAPPORT DE COMPLÉTUDE DES ARTICLES PAR DOMAINE\n');
  console.log('='.repeat(80));
  
  const domains = Object.keys(domainStats).sort();
  
  domains.forEach(domain => {
    const stats = domainStats[domain];
    const completionRate = ((stats.complete / stats.total) * 100).toFixed(1);
    
    console.log(`\n📁 DOMAINE: ${domain || 'root'}`);
    console.log(`   Total articles: ${stats.total}`);
    console.log(`   ✅ Complets: ${stats.complete} (${completionRate}%)`);
    console.log(`   ⚠️  Incomplets: ${stats.incomplete} (${(100 - parseFloat(completionRate)).toFixed(1)}%)`);
    console.log(`   📝 Avec placeholders: ${stats.withPlaceholders}`);
    console.log(`   📚 Sources insuffisantes (<4): ${stats.lowSources}`);
    console.log(`   🔧 Sans méthodologie personnelle: ${stats.noMethodology}`);
    console.log(`   💼 Sans expertise personnelle: ${stats.noExpertise}`);
    
    if (Object.keys(stats.missingSections).length > 0) {
      console.log(`   ❌ Sections manquantes:`);
      Object.entries(stats.missingSections).forEach(([section, count]) => {
        console.log(`      - ${section}: ${count} article(s)`);
      });
    }
    
    // List incomplete articles
    const incompleteArticles = stats.articles.filter(a => !a.isComplete);
    if (incompleteArticles.length > 0) {
      console.log(`\n   📄 Articles incomplets:`);
      incompleteArticles.forEach(article => {
        const problems = [];
        if (article.issues.hasPlaceholders) problems.push('placeholders');
        if (article.issues.missingSections.length > 0) problems.push(`${article.issues.missingSections.length} sections manquantes`);
        if (article.issues.sourceCount < 4) problems.push(`seulement ${article.issues.sourceCount} sources`);
        if (!article.issues.hasMethodology) problems.push('pas de méthodologie');
        if (!article.issues.hasExpertise) problems.push('pas d\'expertise');
        if (article.issues.hasNonStandardContent) problems.push('contenu non standardisé');
        console.log(`      - ${article.filename}: ${problems.join(', ')}`);
      });
    }
  });
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('\n📈 RÉSUMÉ GLOBAL\n');
  
  const totalArticles = allFiles.length;
  const totalComplete = Object.values(domainStats).reduce((sum, stats) => sum + stats.complete, 0);
  const totalIncomplete = Object.values(domainStats).reduce((sum, stats) => sum + stats.incomplete, 0);
  const totalWithPlaceholders = Object.values(domainStats).reduce((sum, stats) => sum + stats.withPlaceholders, 0);
  const totalLowSources = Object.values(domainStats).reduce((sum, stats) => sum + stats.lowSources, 0);
  const totalNoMethodology = Object.values(domainStats).reduce((sum, stats) => sum + stats.noMethodology, 0);
  const totalNoExpertise = Object.values(domainStats).reduce((sum, stats) => sum + stats.noExpertise, 0);
  
  const globalCompletionRate = ((totalComplete / totalArticles) * 100).toFixed(1);
  
  console.log(`Total articles: ${totalArticles}`);
  console.log(`✅ Complets: ${totalComplete} (${globalCompletionRate}%)`);
  console.log(`⚠️  Incomplets: ${totalIncomplete} (${(100 - parseFloat(globalCompletionRate)).toFixed(1)}%)`);
  console.log(`📝 Avec placeholders: ${totalWithPlaceholders}`);
  console.log(`📚 Sources insuffisantes: ${totalLowSources}`);
  console.log(`🔧 Sans méthodologie: ${totalNoMethodology}`);
  console.log(`💼 Sans expertise: ${totalNoExpertise}`);
  
  console.log('\n' + '='.repeat(80));
}

main();


