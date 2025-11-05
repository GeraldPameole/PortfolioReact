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

function getDomainFromPath(filePath) {
  const relativePath = path.relative(articlesDir, filePath);
  const parts = relativePath.split(path.sep);
  return parts[0] || 'articles-generaux';
}

function fixArticleOrder(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  let fixedContent = body;
  const changes = [];
  
  // 1. Trouver toutes les sections numérotées avec leur position
  const sectionPattern = /^##\s+([0-9])\.\s+([^\n]+)/gm;
  const sections = [];
  let match;
  
  while ((match = sectionPattern.exec(body)) !== null) {
    sections.push({
      num: parseInt(match[1]),
      title: match[2].trim(),
      index: match.index,
      fullMatch: match[0]
    });
  }
  
  if (sections.length === 0) {
    return { fixedContent: body, changes: [] };
  }
  
  // 2. Trouver SOURCES ET RÉFÉRENCES et ARTICLES ANNEXES
  const sourcesSection = sections.find(s => 
    s.title.toUpperCase().includes('SOURCES') && s.title.toUpperCase().includes('RÉFÉRENCES')
  );
  const annexesSection = sections.find(s => 
    s.title.toUpperCase().includes('ARTICLES') && s.title.toUpperCase().includes('ANNEXES')
  );
  
  // 3. Corriger l'ordre si nécessaire
  if (sourcesSection && annexesSection) {
    // Extraire le contenu complet de chaque section jusqu'à la section suivante
    const getSectionContent = (section) => {
      const sectionStart = section.index;
      const nextSection = sections.find(s => s.index > sectionStart);
      const sectionEnd = nextSection ? nextSection.index : body.length;
      let sectionContent = body.substring(sectionStart, sectionEnd);
      // Nettoyer les lignes vides en fin
      sectionContent = sectionContent.replace(/\n{3,}$/, '\n\n');
      return sectionContent;
    };
    
    const sourcesContent = getSectionContent(sourcesSection);
    const annexesContent = getSectionContent(annexesSection);
    
    // Si ARTICLES ANNEXES est avant SOURCES, les inverser
    if (annexesSection.index < sourcesSection.index) {
      // Supprimer ARTICLES ANNEXES de sa position actuelle
      const beforeAnnexes = body.substring(0, annexesSection.index);
      const afterAnnexes = body.substring(annexesSection.index + annexesContent.length);
      let tempContent = beforeAnnexes + afterAnnexes;
      
      // Trouver la nouvelle position de SOURCES après suppression
      const newSourcesIndex = tempContent.indexOf(sourcesSection.fullMatch);
      if (newSourcesIndex !== -1) {
        // Trouver la fin de la section SOURCES
        const sourcesEnd = newSourcesIndex + sourcesContent.length;
        const correctedAnnexes = annexesContent.replace(
          /^##\s+[0-9]\.\s+ARTICLES\s+ANNEXES/gi,
          '## 7. ARTICLES ANNEXES'
        );
        
        // Insérer ARTICLES ANNEXES après SOURCES
        fixedContent = tempContent.substring(0, sourcesEnd) + 
                      '\n\n' + correctedAnnexes + 
                      tempContent.substring(sourcesEnd);
        changes.push('Ordre corrigé: ARTICLES ANNEXES après SOURCES ET RÉFÉRENCES');
      }
    }
  }
  
  // 4. Harmoniser la numérotation
  const beforeNum = fixedContent;
  fixedContent = fixedContent.replace(
    /^##\s+([0-9])\.\s+SOURCES\s+ET\s+RÉFÉRENCES/gi,
    '## 6. SOURCES ET RÉFÉRENCES'
  );
  if (beforeNum !== fixedContent) {
    changes.push('Numérotation SOURCES corrigée à 6');
  }
  
  const beforeAnnexes = fixedContent;
  fixedContent = fixedContent.replace(
    /^##\s+([0-9])\.\s+ARTICLES\s+ANNEXES/gi,
    '## 7. ARTICLES ANNEXES'
  );
  if (beforeAnnexes !== fixedContent) {
    changes.push('Numérotation ARTICLES ANNEXES corrigée à 7');
  }
  
  // 5. Supprimer les doublons de sections
  const sectionMap = new Map();
  const allSections = [...fixedContent.matchAll(sectionPattern)];
  
  // Supprimer les doublons en commençant par la fin
  for (let i = allSections.length - 1; i >= 0; i--) {
    const match = allSections[i];
    const num = match[1];
    const title = match[2].trim();
    const key = `${num}-${title.toUpperCase()}`;
    
    if (sectionMap.has(key)) {
      // Doublon trouvé, supprimer
      const nextMatch = allSections[i + 1] || { index: fixedContent.length };
      const sectionStart = match.index;
      const sectionEnd = nextMatch.index;
      fixedContent = fixedContent.substring(0, sectionStart) + fixedContent.substring(sectionEnd);
      changes.push(`Section ${num} dupliquée supprimée: "${title}"`);
    } else {
      sectionMap.set(key, match);
    }
  }
  
  // 6. Nettoyer les lignes vides multiples
  fixedContent = fixedContent.replace(/\n{4,}/g, '\n\n\n');
  
  // 7. Restaurer le frontmatter
  const frontmatter = matter.stringify(fixedContent, data);
  
  return { fixedContent: frontmatter, changes };
}

// Grouper les articles par domaine
function groupByDomain(articles) {
  const grouped = {};
  articles.forEach(filePath => {
    const domain = getDomainFromPath(filePath);
    if (!grouped[domain]) {
      grouped[domain] = [];
    }
    grouped[domain].push(filePath);
  });
  return grouped;
}

console.log('\n🔧 Correction définitive de l\'ordre des sections\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const byDomain = groupByDomain(allArticles);

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
      const { fixedContent, changes } = fixArticleOrder(filePath);
      
      if (changes.length > 0) {
        fs.writeFileSync(filePath, fixedContent, 'utf-8');
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
console.log(`   Domaines: ${Object.keys(byDomain).length}`);

if (errors.length > 0) {
  console.log('\n❌ Erreurs rencontrées:\n');
  errors.forEach(err => {
    console.log(`   ${err.domain}/${err.file}: ${err.error}`);
  });
}

console.log('\n✅ Harmonisation terminée\n');

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

function getDomainFromPath(filePath) {
  const relativePath = path.relative(articlesDir, filePath);
  const parts = relativePath.split(path.sep);
  return parts[0] || 'articles-generaux';
}

function fixArticleOrder(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  let fixedContent = body;
  const changes = [];
  
  // 1. Trouver toutes les sections numérotées avec leur position
  const sectionPattern = /^##\s+([0-9])\.\s+([^\n]+)/gm;
  const sections = [];
  let match;
  
  while ((match = sectionPattern.exec(body)) !== null) {
    sections.push({
      num: parseInt(match[1]),
      title: match[2].trim(),
      index: match.index,
      fullMatch: match[0]
    });
  }
  
  if (sections.length === 0) {
    return { fixedContent: body, changes: [] };
  }
  
  // 2. Trouver SOURCES ET RÉFÉRENCES et ARTICLES ANNEXES
  const sourcesSection = sections.find(s => 
    s.title.toUpperCase().includes('SOURCES') && s.title.toUpperCase().includes('RÉFÉRENCES')
  );
  const annexesSection = sections.find(s => 
    s.title.toUpperCase().includes('ARTICLES') && s.title.toUpperCase().includes('ANNEXES')
  );
  
  // 3. Corriger l'ordre si nécessaire
  if (sourcesSection && annexesSection) {
    // Extraire le contenu complet de chaque section jusqu'à la section suivante
    const getSectionContent = (section) => {
      const sectionStart = section.index;
      const nextSection = sections.find(s => s.index > sectionStart);
      const sectionEnd = nextSection ? nextSection.index : body.length;
      let sectionContent = body.substring(sectionStart, sectionEnd);
      // Nettoyer les lignes vides en fin
      sectionContent = sectionContent.replace(/\n{3,}$/, '\n\n');
      return sectionContent;
    };
    
    const sourcesContent = getSectionContent(sourcesSection);
    const annexesContent = getSectionContent(annexesSection);
    
    // Si ARTICLES ANNEXES est avant SOURCES, les inverser
    if (annexesSection.index < sourcesSection.index) {
      // Supprimer ARTICLES ANNEXES de sa position actuelle
      const beforeAnnexes = body.substring(0, annexesSection.index);
      const afterAnnexes = body.substring(annexesSection.index + annexesContent.length);
      let tempContent = beforeAnnexes + afterAnnexes;
      
      // Trouver la nouvelle position de SOURCES après suppression
      const newSourcesIndex = tempContent.indexOf(sourcesSection.fullMatch);
      if (newSourcesIndex !== -1) {
        // Trouver la fin de la section SOURCES
        const sourcesEnd = newSourcesIndex + sourcesContent.length;
        const correctedAnnexes = annexesContent.replace(
          /^##\s+[0-9]\.\s+ARTICLES\s+ANNEXES/gi,
          '## 7. ARTICLES ANNEXES'
        );
        
        // Insérer ARTICLES ANNEXES après SOURCES
        fixedContent = tempContent.substring(0, sourcesEnd) + 
                      '\n\n' + correctedAnnexes + 
                      tempContent.substring(sourcesEnd);
        changes.push('Ordre corrigé: ARTICLES ANNEXES après SOURCES ET RÉFÉRENCES');
      }
    }
  }
  
  // 4. Harmoniser la numérotation
  const beforeNum = fixedContent;
  fixedContent = fixedContent.replace(
    /^##\s+([0-9])\.\s+SOURCES\s+ET\s+RÉFÉRENCES/gi,
    '## 6. SOURCES ET RÉFÉRENCES'
  );
  if (beforeNum !== fixedContent) {
    changes.push('Numérotation SOURCES corrigée à 6');
  }
  
  const beforeAnnexes = fixedContent;
  fixedContent = fixedContent.replace(
    /^##\s+([0-9])\.\s+ARTICLES\s+ANNEXES/gi,
    '## 7. ARTICLES ANNEXES'
  );
  if (beforeAnnexes !== fixedContent) {
    changes.push('Numérotation ARTICLES ANNEXES corrigée à 7');
  }
  
  // 5. Supprimer les doublons de sections
  const sectionMap = new Map();
  const allSections = [...fixedContent.matchAll(sectionPattern)];
  
  // Supprimer les doublons en commençant par la fin
  for (let i = allSections.length - 1; i >= 0; i--) {
    const match = allSections[i];
    const num = match[1];
    const title = match[2].trim();
    const key = `${num}-${title.toUpperCase()}`;
    
    if (sectionMap.has(key)) {
      // Doublon trouvé, supprimer
      const nextMatch = allSections[i + 1] || { index: fixedContent.length };
      const sectionStart = match.index;
      const sectionEnd = nextMatch.index;
      fixedContent = fixedContent.substring(0, sectionStart) + fixedContent.substring(sectionEnd);
      changes.push(`Section ${num} dupliquée supprimée: "${title}"`);
    } else {
      sectionMap.set(key, match);
    }
  }
  
  // 6. Nettoyer les lignes vides multiples
  fixedContent = fixedContent.replace(/\n{4,}/g, '\n\n\n');
  
  // 7. Restaurer le frontmatter
  const frontmatter = matter.stringify(fixedContent, data);
  
  return { fixedContent: frontmatter, changes };
}

// Grouper les articles par domaine
function groupByDomain(articles) {
  const grouped = {};
  articles.forEach(filePath => {
    const domain = getDomainFromPath(filePath);
    if (!grouped[domain]) {
      grouped[domain] = [];
    }
    grouped[domain].push(filePath);
  });
  return grouped;
}

console.log('\n🔧 Correction définitive de l\'ordre des sections\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const byDomain = groupByDomain(allArticles);

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
      const { fixedContent, changes } = fixArticleOrder(filePath);
      
      if (changes.length > 0) {
        fs.writeFileSync(filePath, fixedContent, 'utf-8');
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
console.log(`   Domaines: ${Object.keys(byDomain).length}`);

if (errors.length > 0) {
  console.log('\n❌ Erreurs rencontrées:\n');
  errors.forEach(err => {
    console.log(`   ${err.domain}/${err.file}: ${err.error}`);
  });
}

console.log('\n✅ Harmonisation terminée\n');

