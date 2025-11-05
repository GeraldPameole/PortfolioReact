import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

// Ordre standard des sections
const STANDARD_ORDER = [
  { pattern: /^##\s+Introduction/i, num: 0, title: 'Introduction' },
  { pattern: /^##\s+1\.\s+FONDAMENTAUX\s+DU\s+SUJET/i, num: 1, title: '1. FONDAMENTAUX DU SUJET' },
  { pattern: /^##\s+2\.\s+ANALYSE\s+APPROFONDIE/i, num: 2, title: '2. ANALYSE APPROFONDIE' },
  { pattern: /^##\s+3\.\s+STRATÉGIES\s+ET\s+MÉTHODOLOGIES/i, num: 3, title: '3. STRATÉGIES ET MÉTHODOLOGIES' },
  { pattern: /^##\s+4\.\s+OUTILS\s+ET\s+TECHNOLOGIES/i, num: 4, title: '4. OUTILS ET TECHNOLOGIES' },
  { pattern: /^##\s+5\.\s+DÉFIS\s+ET\s+SOLUTIONS/i, num: 5, title: '5. DÉFIS ET SOLUTIONS' },
  { pattern: /^##\s+6\.\s+SOURCES\s+ET\s+RÉFÉRENCES/i, num: 6, title: '6. SOURCES ET RÉFÉRENCES' },
  { pattern: /^##\s+7\.\s+ARTICLES\s+ANNEXES/i, num: 7, title: '7. ARTICLES ANNEXES' }
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

function extractSectionContent(body, sectionStart, nextSectionStart) {
  if (nextSectionStart === undefined) {
    return body.substring(sectionStart);
  }
  return body.substring(sectionStart, nextSectionStart);
}

function findSection(body, pattern) {
  const match = body.match(new RegExp(pattern.source, 'gm'));
  if (match) {
    const index = body.indexOf(match[0]);
    return { match: match[0], index };
  }
  return null;
}

function reorderArticleSections(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  let fixedBody = body;
  const changes = [];
  
  // 1. Trouver toutes les sections présentes
  const sections = [];
  
  STANDARD_ORDER.forEach(({ pattern, num, title }) => {
    const section = findSection(fixedBody, pattern);
    if (section) {
      sections.push({
        num,
        title,
        pattern,
        index: section.index,
        match: section.match
      });
    }
  });
  
  if (sections.length === 0) {
    return { fixedBody: body, changes: [] };
  }
  
  // 2. Trier les sections par leur position actuelle
  sections.sort((a, b) => a.index - b.index);
  
  // 3. Vérifier si l'ordre est correct
  const isCorrectOrder = sections.every((section, index) => {
    return section.num === STANDARD_ORDER.find(s => s.num === section.num)?.num;
  });
  
  // 4. Vérifier l'ordre numérique
  let orderCorrect = true;
  for (let i = 0; i < sections.length - 1; i++) {
    if (sections[i].num > sections[i + 1].num) {
      orderCorrect = false;
      break;
    }
  }
  
  if (orderCorrect && sections.length > 0) {
    // Vérifier que toutes les sections sont dans l'ordre attendu
    const expectedOrder = sections.map(s => s.num).sort((a, b) => a - b);
    const actualOrder = sections.map(s => s.num);
    
    if (JSON.stringify(expectedOrder) === JSON.stringify(actualOrder)) {
      return { fixedBody: body, changes: [] };
    }
  }
  
  // 5. Extraire le contenu de chaque section
  const sectionContents = [];
  
  sections.forEach((section, index) => {
    const sectionStart = section.index;
    const nextSection = sections[index + 1];
    const sectionEnd = nextSection ? nextSection.index : fixedBody.length;
    
    let sectionContent = fixedBody.substring(sectionStart, sectionEnd);
    
    // Nettoyer les lignes vides en fin
    sectionContent = sectionContent.replace(/\n{3,}$/, '\n\n');
    
    // Corriger le titre de la section si nécessaire
    const correctTitle = STANDARD_ORDER.find(s => s.num === section.num)?.title;
    if (correctTitle) {
      sectionContent = sectionContent.replace(
        /^##\s+[0-9]?\.?\s*[^\n]+/i,
        `## ${correctTitle}`
      );
    }
    
    sectionContents.push({
      num: section.num,
      title: correctTitle || section.title,
      content: sectionContent
    });
  });
  
  // 6. Reconstruire le contenu dans le bon ordre
  const orderedSections = sectionContents.sort((a, b) => a.num - b.num);
  
  // 7. Trouver le début du contenu (avant la première section)
  const firstSection = sections.sort((a, b) => a.index - b.index)[0];
  const contentBefore = fixedBody.substring(0, firstSection.index).trim();
  
  // 8. Construire le nouveau contenu
  let newBody = contentBefore;
  
  if (newBody && !newBody.endsWith('\n\n')) {
    newBody += '\n\n';
  }
  
  orderedSections.forEach((section, index) => {
    if (index === 0 && !newBody.endsWith('\n\n')) {
      newBody += '\n';
    }
    newBody += section.content;
    if (index < orderedSections.length - 1) {
      newBody += '\n\n';
    }
  });
  
  // 9. Vérifier que l'Introduction est présente
  if (!newBody.match(/^##\s+Introduction/i)) {
    // Ajouter l'Introduction si elle manque
    const introText = data.description 
      ? `## Introduction\n\n${data.description}\n\n`
      : `## Introduction\n\nIntroduction à compléter.\n\n`;
    
    const firstSectionMatch = newBody.match(/^##\s+[0-9]/m);
    if (firstSectionMatch) {
      const firstSectionIndex = firstSectionMatch.index;
      newBody = newBody.substring(0, firstSectionIndex) + introText + newBody.substring(firstSectionIndex);
      changes.push('Section Introduction ajoutée');
    }
  }
  
  // 10. Nettoyer les lignes vides multiples
  newBody = newBody.replace(/\n{4,}/g, '\n\n\n');
  
  if (newBody !== body) {
    changes.push(`Ordre des sections corrigé (${sections.length} sections réorganisées)`);
  }
  
  return { fixedBody: newBody, changes };
}

console.log('\n🔧 Correction de l\'ordre des sections dans tous les articles\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const byDomain = {};

// Grouper par domaine
allArticles.forEach(filePath => {
  const domain = getDomainFromPath(filePath);
  if (!byDomain[domain]) {
    byDomain[domain] = [];
  }
  byDomain[domain].push(filePath);
});

const domainStats = {};
const processedArticles = [];
const errors = [];

// Traiter chaque domaine
Object.keys(byDomain).sort().forEach(domain => {
  console.log(`\n📁 Domaine: ${domain}`);
  console.log('-'.repeat(80));
  
  const domainArticles = byDomain[domain];
  let domainModified = 0;
  
  domainArticles.forEach(filePath => {
    try {
      const { fixedBody, changes } = reorderArticleSections(filePath);
      
      if (changes.length > 0) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(content);
        
        const newContent = matter.stringify(fixedBody, data);
        fs.writeFileSync(filePath, newContent, 'utf-8');
        
        processedArticles.push({
          domain,
          file: path.basename(filePath),
          changes
        });
        domainModified++;
        console.log(`   ✅ ${path.basename(filePath)}`);
        changes.forEach(change => {
          console.log(`      - ${change}`);
        });
      }
    } catch (error) {
      errors.push({
        domain,
        file: path.basename(filePath),
        error: error.message
      });
      console.log(`   ❌ ${path.basename(filePath)}`);
      console.log(`      Erreur: ${error.message}`);
    }
  });
  
  domainStats[domain] = {
    total: domainArticles.length,
    modified: domainModified
  };
  
  console.log(`   Total: ${domainArticles.length} articles | Modifiés: ${domainModified}`);
});

console.log('\n' + '='.repeat(80));
console.log('\n📊 RÉSUMÉ PAR DOMAINE\n');

Object.keys(domainStats).sort().forEach(domain => {
  const stats = domainStats[domain];
  console.log(`${domain}:`);
  console.log(`  Total: ${stats.total} articles`);
  console.log(`  Modifiés: ${stats.modified} articles`);
});

console.log('\n' + '='.repeat(80));
console.log(`\n📈 RÉSUMÉ GLOBAL:\n`);
console.log(`   Total articles: ${allArticles.length}`);
console.log(`   Articles modifiés: ${processedArticles.length}`);
console.log(`   Erreurs: ${errors.length}`);

if (errors.length > 0) {
  console.log('\n❌ Erreurs rencontrées:\n');
  errors.forEach(err => {
    console.log(`   ${err.domain}/${err.file}: ${err.error}`);
  });
}

console.log('\n✅ Correction de l\'ordre terminée\n');

import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

// Ordre standard des sections
const STANDARD_ORDER = [
  { pattern: /^##\s+Introduction/i, num: 0, title: 'Introduction' },
  { pattern: /^##\s+1\.\s+FONDAMENTAUX\s+DU\s+SUJET/i, num: 1, title: '1. FONDAMENTAUX DU SUJET' },
  { pattern: /^##\s+2\.\s+ANALYSE\s+APPROFONDIE/i, num: 2, title: '2. ANALYSE APPROFONDIE' },
  { pattern: /^##\s+3\.\s+STRATÉGIES\s+ET\s+MÉTHODOLOGIES/i, num: 3, title: '3. STRATÉGIES ET MÉTHODOLOGIES' },
  { pattern: /^##\s+4\.\s+OUTILS\s+ET\s+TECHNOLOGIES/i, num: 4, title: '4. OUTILS ET TECHNOLOGIES' },
  { pattern: /^##\s+5\.\s+DÉFIS\s+ET\s+SOLUTIONS/i, num: 5, title: '5. DÉFIS ET SOLUTIONS' },
  { pattern: /^##\s+6\.\s+SOURCES\s+ET\s+RÉFÉRENCES/i, num: 6, title: '6. SOURCES ET RÉFÉRENCES' },
  { pattern: /^##\s+7\.\s+ARTICLES\s+ANNEXES/i, num: 7, title: '7. ARTICLES ANNEXES' }
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

function extractSectionContent(body, sectionStart, nextSectionStart) {
  if (nextSectionStart === undefined) {
    return body.substring(sectionStart);
  }
  return body.substring(sectionStart, nextSectionStart);
}

function findSection(body, pattern) {
  const match = body.match(new RegExp(pattern.source, 'gm'));
  if (match) {
    const index = body.indexOf(match[0]);
    return { match: match[0], index };
  }
  return null;
}

function reorderArticleSections(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  let fixedBody = body;
  const changes = [];
  
  // 1. Trouver toutes les sections présentes
  const sections = [];
  
  STANDARD_ORDER.forEach(({ pattern, num, title }) => {
    const section = findSection(fixedBody, pattern);
    if (section) {
      sections.push({
        num,
        title,
        pattern,
        index: section.index,
        match: section.match
      });
    }
  });
  
  if (sections.length === 0) {
    return { fixedBody: body, changes: [] };
  }
  
  // 2. Trier les sections par leur position actuelle
  sections.sort((a, b) => a.index - b.index);
  
  // 3. Vérifier si l'ordre est correct
  const isCorrectOrder = sections.every((section, index) => {
    return section.num === STANDARD_ORDER.find(s => s.num === section.num)?.num;
  });
  
  // 4. Vérifier l'ordre numérique
  let orderCorrect = true;
  for (let i = 0; i < sections.length - 1; i++) {
    if (sections[i].num > sections[i + 1].num) {
      orderCorrect = false;
      break;
    }
  }
  
  if (orderCorrect && sections.length > 0) {
    // Vérifier que toutes les sections sont dans l'ordre attendu
    const expectedOrder = sections.map(s => s.num).sort((a, b) => a - b);
    const actualOrder = sections.map(s => s.num);
    
    if (JSON.stringify(expectedOrder) === JSON.stringify(actualOrder)) {
      return { fixedBody: body, changes: [] };
    }
  }
  
  // 5. Extraire le contenu de chaque section
  const sectionContents = [];
  
  sections.forEach((section, index) => {
    const sectionStart = section.index;
    const nextSection = sections[index + 1];
    const sectionEnd = nextSection ? nextSection.index : fixedBody.length;
    
    let sectionContent = fixedBody.substring(sectionStart, sectionEnd);
    
    // Nettoyer les lignes vides en fin
    sectionContent = sectionContent.replace(/\n{3,}$/, '\n\n');
    
    // Corriger le titre de la section si nécessaire
    const correctTitle = STANDARD_ORDER.find(s => s.num === section.num)?.title;
    if (correctTitle) {
      sectionContent = sectionContent.replace(
        /^##\s+[0-9]?\.?\s*[^\n]+/i,
        `## ${correctTitle}`
      );
    }
    
    sectionContents.push({
      num: section.num,
      title: correctTitle || section.title,
      content: sectionContent
    });
  });
  
  // 6. Reconstruire le contenu dans le bon ordre
  const orderedSections = sectionContents.sort((a, b) => a.num - b.num);
  
  // 7. Trouver le début du contenu (avant la première section)
  const firstSection = sections.sort((a, b) => a.index - b.index)[0];
  const contentBefore = fixedBody.substring(0, firstSection.index).trim();
  
  // 8. Construire le nouveau contenu
  let newBody = contentBefore;
  
  if (newBody && !newBody.endsWith('\n\n')) {
    newBody += '\n\n';
  }
  
  orderedSections.forEach((section, index) => {
    if (index === 0 && !newBody.endsWith('\n\n')) {
      newBody += '\n';
    }
    newBody += section.content;
    if (index < orderedSections.length - 1) {
      newBody += '\n\n';
    }
  });
  
  // 9. Vérifier que l'Introduction est présente
  if (!newBody.match(/^##\s+Introduction/i)) {
    // Ajouter l'Introduction si elle manque
    const introText = data.description 
      ? `## Introduction\n\n${data.description}\n\n`
      : `## Introduction\n\nIntroduction à compléter.\n\n`;
    
    const firstSectionMatch = newBody.match(/^##\s+[0-9]/m);
    if (firstSectionMatch) {
      const firstSectionIndex = firstSectionMatch.index;
      newBody = newBody.substring(0, firstSectionIndex) + introText + newBody.substring(firstSectionIndex);
      changes.push('Section Introduction ajoutée');
    }
  }
  
  // 10. Nettoyer les lignes vides multiples
  newBody = newBody.replace(/\n{4,}/g, '\n\n\n');
  
  if (newBody !== body) {
    changes.push(`Ordre des sections corrigé (${sections.length} sections réorganisées)`);
  }
  
  return { fixedBody: newBody, changes };
}

console.log('\n🔧 Correction de l\'ordre des sections dans tous les articles\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const byDomain = {};

// Grouper par domaine
allArticles.forEach(filePath => {
  const domain = getDomainFromPath(filePath);
  if (!byDomain[domain]) {
    byDomain[domain] = [];
  }
  byDomain[domain].push(filePath);
});

const domainStats = {};
const processedArticles = [];
const errors = [];

// Traiter chaque domaine
Object.keys(byDomain).sort().forEach(domain => {
  console.log(`\n📁 Domaine: ${domain}`);
  console.log('-'.repeat(80));
  
  const domainArticles = byDomain[domain];
  let domainModified = 0;
  
  domainArticles.forEach(filePath => {
    try {
      const { fixedBody, changes } = reorderArticleSections(filePath);
      
      if (changes.length > 0) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(content);
        
        const newContent = matter.stringify(fixedBody, data);
        fs.writeFileSync(filePath, newContent, 'utf-8');
        
        processedArticles.push({
          domain,
          file: path.basename(filePath),
          changes
        });
        domainModified++;
        console.log(`   ✅ ${path.basename(filePath)}`);
        changes.forEach(change => {
          console.log(`      - ${change}`);
        });
      }
    } catch (error) {
      errors.push({
        domain,
        file: path.basename(filePath),
        error: error.message
      });
      console.log(`   ❌ ${path.basename(filePath)}`);
      console.log(`      Erreur: ${error.message}`);
    }
  });
  
  domainStats[domain] = {
    total: domainArticles.length,
    modified: domainModified
  };
  
  console.log(`   Total: ${domainArticles.length} articles | Modifiés: ${domainModified}`);
});

console.log('\n' + '='.repeat(80));
console.log('\n📊 RÉSUMÉ PAR DOMAINE\n');

Object.keys(domainStats).sort().forEach(domain => {
  const stats = domainStats[domain];
  console.log(`${domain}:`);
  console.log(`  Total: ${stats.total} articles`);
  console.log(`  Modifiés: ${stats.modified} articles`);
});

console.log('\n' + '='.repeat(80));
console.log(`\n📈 RÉSUMÉ GLOBAL:\n`);
console.log(`   Total articles: ${allArticles.length}`);
console.log(`   Articles modifiés: ${processedArticles.length}`);
console.log(`   Erreurs: ${errors.length}`);

if (errors.length > 0) {
  console.log('\n❌ Erreurs rencontrées:\n');
  errors.forEach(err => {
    console.log(`   ${err.domain}/${err.file}: ${err.error}`);
  });
}

console.log('\n✅ Correction de l\'ordre terminée\n');
