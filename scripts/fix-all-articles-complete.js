import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

// Mapping des domaines
const domainLabels = {
  'developpement-web': 'Développement Web',
  'developpement-commercial': 'Développement Commercial',
  'formation': 'Formation',
  'gestion-projet': 'Gestion de Projet',
  'gestion-talents': 'Gestion des Talents',
  'productivite-methodes': 'Productivité & Méthodes',
  'qualite-process': 'Qualité & Processus',
  'leadership-management': 'Leadership & Management',
  'marketing-communication': 'Marketing & Communication',
  'innovation-technologies': 'Innovation & Technologies',
  'gestion-connaissances': 'Gestion des Connaissances',
  'reconversion-carriere': 'Reconversion & Carrière',
  'service-client': 'Service Client',
  'transformation-digitale': 'Transformation Digitale',
  'outils-techniques': 'Outils Techniques'
};

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

function fixArticleTitleDuplicates(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  let fixedBody = body;
  const changes = [];
  
  // 1. Supprimer le titre en h1 du contenu si il correspond au titre du frontmatter
  const h1Pattern = /^#\s+([^\n]+)/m;
  const h1Match = fixedBody.match(h1Pattern);
  
  if (h1Match) {
    const h1Title = h1Match[1].trim();
    const frontmatterTitle = data.title?.trim();
    
    // Si le h1 correspond au titre du frontmatter, le supprimer
    if (frontmatterTitle && (h1Title === frontmatterTitle || h1Title.includes(frontmatterTitle) || frontmatterTitle.includes(h1Title))) {
      fixedBody = fixedBody.replace(h1Pattern, '').trim();
      changes.push('Titre dupliqué supprimé du contenu');
    }
  }
  
  // 2. Supprimer les lignes vides multiples après suppression du titre
  fixedBody = fixedBody.replace(/\n{3,}/g, '\n\n');
  
  return { fixedBody, changes, data };
}

function fixArticleDomainAndDate(filePath, index, totalArticles) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  const domain = getDomainFromPath(filePath);
  const changes = [];
  
  // 1. S'assurer que le domaine est défini
  if (!data.domain || data.domain === 'articles-generaux') {
    data.domain = domain;
    changes.push(`Domaine défini: ${domain}`);
  }
  
  // 2. Ajuster la date de parution (une semaine d'intervalle par article)
  const baseDate = new Date('2024-01-01');
  const weeksToAdd = index;
  const publishDate = new Date(baseDate);
  publishDate.setDate(publishDate.getDate() + (weeksToAdd * 7));
  
  const dateString = publishDate.toISOString().split('T')[0];
  const oldDate = data.publishDate;
  
  if (!data.publishDate || typeof data.publishDate === 'string') {
    data.publishDate = dateString;
    changes.push(`Date de parution ajustée: ${dateString}`);
  }
  
  // 3. S'assurer que le domaine est cohérent avec le chemin
  if (data.domain !== domain) {
    data.domain = domain;
    changes.push(`Domaine corrigé selon le chemin: ${domain}`);
  }
  
  return { data, changes };
}

function fixArticleStructure(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  let fixedBody = body;
  const changes = [];
  
  // 1. Vérifier que l'introduction est bien présente
  if (!fixedBody.includes('## Introduction') && !fixedBody.match(/^##\s+Introduction/im)) {
    // Chercher le premier h2
    const firstH2 = fixedBody.match(/^##\s+/m);
    if (firstH2) {
      const introIndex = firstH2.index;
      const introText = `## Introduction\n\n${data.description || 'Introduction à compléter.'}\n\n`;
      fixedBody = introText + fixedBody.substring(introIndex);
      changes.push('Section Introduction ajoutée');
    }
  }
  
  // 2. Vérifier l'ordre des sections
  const sections = [
    { num: 1, title: 'FONDAMENTAUX DU SUJET' },
    { num: 2, title: 'ANALYSE APPROFONDIE' },
    { num: 3, title: 'STRATÉGIES ET MÉTHODOLOGIES' },
    { num: 4, title: 'OUTILS ET TECHNOLOGIES' },
    { num: 5, title: 'DÉFIS ET SOLUTIONS' },
    { num: 6, title: 'SOURCES ET RÉFÉRENCES' },
    { num: 7, title: 'ARTICLES ANNEXES' }
  ];
  
  // 3. S'assurer que SOURCES (6) est avant ARTICLES ANNEXES (7)
  const sourcesPattern = /^##\s+6\.\s+SOURCES\s+ET\s+RÉFÉRENCES[\s\S]*?(?=^##\s+[0-9]|$)/gi;
  const annexesPattern = /^##\s+7\.\s+ARTICLES\s+ANNEXES[\s\S]*?(?=^##\s+[0-9]|$)/gi;
  
  const sourcesMatch = fixedBody.match(sourcesPattern);
  const annexesMatch = fixedBody.match(annexesPattern);
  
  if (sourcesMatch && annexesMatch) {
    const sourcesIndex = fixedBody.indexOf(sourcesMatch[0]);
    const annexesIndex = fixedBody.indexOf(annexesMatch[0]);
    
    if (annexesIndex < sourcesIndex) {
      // Extraire les sections
      const sourcesContent = sourcesMatch[0];
      const annexesContent = annexesMatch[0];
      
      // Supprimer les deux sections
      const beforeSources = fixedBody.substring(0, sourcesIndex);
      const afterSources = fixedBody.substring(sourcesIndex + sourcesContent.length);
      let tempBody = beforeSources + afterSources;
      
      // Trouver la nouvelle position de SOURCES
      const newSourcesIndex = tempBody.indexOf(sourcesContent);
      if (newSourcesIndex !== -1) {
        const afterNewSources = tempBody.substring(newSourcesIndex + sourcesContent.length);
        fixedBody = tempBody.substring(0, newSourcesIndex + sourcesContent.length) + 
                   '\n\n' + annexesContent + 
                   afterNewSources;
        changes.push('Ordre corrigé: ARTICLES ANNEXES après SOURCES');
      }
    }
  }
  
  return { fixedBody, changes };
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

console.log('\n🔧 Correction complète de tous les articles\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const byDomain = groupByDomain(allArticles);

const domainStats = {};
const processedArticles = [];
const errors = [];
let globalIndex = 0;

// Traiter chaque domaine
Object.keys(byDomain).sort().forEach(domain => {
  if (domain === 'articles-generaux') {
    console.log(`\n⚠️  Domaine: ${domain} (à traiter séparément)`);
    console.log('-'.repeat(80));
    return;
  }
  
  console.log(`\n📁 Domaine: ${domain}`);
  console.log('-'.repeat(80));
  
  const domainArticles = byDomain[domain];
  let domainModified = 0;
  
  domainArticles.forEach((filePath, domainIndex) => {
    try {
      const articleIndex = globalIndex++;
      
      // 1. Corriger les titres dupliqués
      const { fixedBody, changes: titleChanges, data: titleData } = fixArticleTitleDuplicates(filePath);
      
      // 2. Corriger le domaine et la date
      const { data: domainData, changes: domainChanges } = fixArticleDomainAndDate(filePath, articleIndex, allArticles.length);
      
      // 3. Corriger la structure
      const { fixedBody: structuredBody, changes: structureChanges } = fixArticleStructure(filePath);
      
      // 4. Combiner toutes les corrections
      const finalBody = fixedBody || structuredBody;
      const finalData = { ...titleData, ...domainData };
      const allChanges = [...titleChanges, ...domainChanges, ...structureChanges];
      
      if (allChanges.length > 0) {
        const finalContent = matter.stringify(finalBody, finalData);
        fs.writeFileSync(filePath, finalContent, 'utf-8');
        processedArticles.push({
          domain,
          file: path.basename(filePath),
          changes: allChanges
        });
        domainModified++;
        console.log(`   ✅ ${path.basename(filePath)}`);
        allChanges.forEach(change => {
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

// Traiter les articles généraux
if (byDomain['articles-generaux']) {
  console.log(`\n📁 Domaine: articles-generaux (à déplacer)`);
  console.log('-'.repeat(80));
  
  byDomain['articles-generaux'].forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);
    
    // Déterminer le domaine approprié selon le contenu
    let targetDomain = 'productivite-methodes'; // Par défaut
    
    if (data.title?.toLowerCase().includes('planifier') || data.title?.toLowerCase().includes('travail')) {
      targetDomain = 'productivite-methodes';
    } else if (data.title?.toLowerCase().includes('synthese')) {
      targetDomain = 'articles-generaux'; // Garder celui-ci
    }
    
    if (targetDomain !== 'articles-generaux') {
      const targetDir = path.join(articlesDir, targetDomain);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      const fileName = path.basename(filePath);
      const targetPath = path.join(targetDir, fileName);
      
      // Mettre à jour le domaine dans le frontmatter
      data.domain = targetDomain;
      const newContent = matter.stringify(content, data);
      
      fs.writeFileSync(targetPath, newContent, 'utf-8');
      fs.unlinkSync(filePath);
      
      console.log(`   ✅ ${fileName} déplacé vers ${targetDomain}`);
      processedArticles.push({
        domain: 'articles-generaux → ' + targetDomain,
        file: fileName,
        changes: [`Déplacé vers ${targetDomain}`]
      });
    }
  });
}

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

console.log('\n✅ Corrections terminées\n');

import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

// Mapping des domaines
const domainLabels = {
  'developpement-web': 'Développement Web',
  'developpement-commercial': 'Développement Commercial',
  'formation': 'Formation',
  'gestion-projet': 'Gestion de Projet',
  'gestion-talents': 'Gestion des Talents',
  'productivite-methodes': 'Productivité & Méthodes',
  'qualite-process': 'Qualité & Processus',
  'leadership-management': 'Leadership & Management',
  'marketing-communication': 'Marketing & Communication',
  'innovation-technologies': 'Innovation & Technologies',
  'gestion-connaissances': 'Gestion des Connaissances',
  'reconversion-carriere': 'Reconversion & Carrière',
  'service-client': 'Service Client',
  'transformation-digitale': 'Transformation Digitale',
  'outils-techniques': 'Outils Techniques'
};

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

function fixArticleTitleDuplicates(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  let fixedBody = body;
  const changes = [];
  
  // 1. Supprimer le titre en h1 du contenu si il correspond au titre du frontmatter
  const h1Pattern = /^#\s+([^\n]+)/m;
  const h1Match = fixedBody.match(h1Pattern);
  
  if (h1Match) {
    const h1Title = h1Match[1].trim();
    const frontmatterTitle = data.title?.trim();
    
    // Si le h1 correspond au titre du frontmatter, le supprimer
    if (frontmatterTitle && (h1Title === frontmatterTitle || h1Title.includes(frontmatterTitle) || frontmatterTitle.includes(h1Title))) {
      fixedBody = fixedBody.replace(h1Pattern, '').trim();
      changes.push('Titre dupliqué supprimé du contenu');
    }
  }
  
  // 2. Supprimer les lignes vides multiples après suppression du titre
  fixedBody = fixedBody.replace(/\n{3,}/g, '\n\n');
  
  return { fixedBody, changes, data };
}

function fixArticleDomainAndDate(filePath, index, totalArticles) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  const domain = getDomainFromPath(filePath);
  const changes = [];
  
  // 1. S'assurer que le domaine est défini
  if (!data.domain || data.domain === 'articles-generaux') {
    data.domain = domain;
    changes.push(`Domaine défini: ${domain}`);
  }
  
  // 2. Ajuster la date de parution (une semaine d'intervalle par article)
  const baseDate = new Date('2024-01-01');
  const weeksToAdd = index;
  const publishDate = new Date(baseDate);
  publishDate.setDate(publishDate.getDate() + (weeksToAdd * 7));
  
  const dateString = publishDate.toISOString().split('T')[0];
  const oldDate = data.publishDate;
  
  if (!data.publishDate || typeof data.publishDate === 'string') {
    data.publishDate = dateString;
    changes.push(`Date de parution ajustée: ${dateString}`);
  }
  
  // 3. S'assurer que le domaine est cohérent avec le chemin
  if (data.domain !== domain) {
    data.domain = domain;
    changes.push(`Domaine corrigé selon le chemin: ${domain}`);
  }
  
  return { data, changes };
}

function fixArticleStructure(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  let fixedBody = body;
  const changes = [];
  
  // 1. Vérifier que l'introduction est bien présente
  if (!fixedBody.includes('## Introduction') && !fixedBody.match(/^##\s+Introduction/im)) {
    // Chercher le premier h2
    const firstH2 = fixedBody.match(/^##\s+/m);
    if (firstH2) {
      const introIndex = firstH2.index;
      const introText = `## Introduction\n\n${data.description || 'Introduction à compléter.'}\n\n`;
      fixedBody = introText + fixedBody.substring(introIndex);
      changes.push('Section Introduction ajoutée');
    }
  }
  
  // 2. Vérifier l'ordre des sections
  const sections = [
    { num: 1, title: 'FONDAMENTAUX DU SUJET' },
    { num: 2, title: 'ANALYSE APPROFONDIE' },
    { num: 3, title: 'STRATÉGIES ET MÉTHODOLOGIES' },
    { num: 4, title: 'OUTILS ET TECHNOLOGIES' },
    { num: 5, title: 'DÉFIS ET SOLUTIONS' },
    { num: 6, title: 'SOURCES ET RÉFÉRENCES' },
    { num: 7, title: 'ARTICLES ANNEXES' }
  ];
  
  // 3. S'assurer que SOURCES (6) est avant ARTICLES ANNEXES (7)
  const sourcesPattern = /^##\s+6\.\s+SOURCES\s+ET\s+RÉFÉRENCES[\s\S]*?(?=^##\s+[0-9]|$)/gi;
  const annexesPattern = /^##\s+7\.\s+ARTICLES\s+ANNEXES[\s\S]*?(?=^##\s+[0-9]|$)/gi;
  
  const sourcesMatch = fixedBody.match(sourcesPattern);
  const annexesMatch = fixedBody.match(annexesPattern);
  
  if (sourcesMatch && annexesMatch) {
    const sourcesIndex = fixedBody.indexOf(sourcesMatch[0]);
    const annexesIndex = fixedBody.indexOf(annexesMatch[0]);
    
    if (annexesIndex < sourcesIndex) {
      // Extraire les sections
      const sourcesContent = sourcesMatch[0];
      const annexesContent = annexesMatch[0];
      
      // Supprimer les deux sections
      const beforeSources = fixedBody.substring(0, sourcesIndex);
      const afterSources = fixedBody.substring(sourcesIndex + sourcesContent.length);
      let tempBody = beforeSources + afterSources;
      
      // Trouver la nouvelle position de SOURCES
      const newSourcesIndex = tempBody.indexOf(sourcesContent);
      if (newSourcesIndex !== -1) {
        const afterNewSources = tempBody.substring(newSourcesIndex + sourcesContent.length);
        fixedBody = tempBody.substring(0, newSourcesIndex + sourcesContent.length) + 
                   '\n\n' + annexesContent + 
                   afterNewSources;
        changes.push('Ordre corrigé: ARTICLES ANNEXES après SOURCES');
      }
    }
  }
  
  return { fixedBody, changes };
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

console.log('\n🔧 Correction complète de tous les articles\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const byDomain = groupByDomain(allArticles);

const domainStats = {};
const processedArticles = [];
const errors = [];
let globalIndex = 0;

// Traiter chaque domaine
Object.keys(byDomain).sort().forEach(domain => {
  if (domain === 'articles-generaux') {
    console.log(`\n⚠️  Domaine: ${domain} (à traiter séparément)`);
    console.log('-'.repeat(80));
    return;
  }
  
  console.log(`\n📁 Domaine: ${domain}`);
  console.log('-'.repeat(80));
  
  const domainArticles = byDomain[domain];
  let domainModified = 0;
  
  domainArticles.forEach((filePath, domainIndex) => {
    try {
      const articleIndex = globalIndex++;
      
      // 1. Corriger les titres dupliqués
      const { fixedBody, changes: titleChanges, data: titleData } = fixArticleTitleDuplicates(filePath);
      
      // 2. Corriger le domaine et la date
      const { data: domainData, changes: domainChanges } = fixArticleDomainAndDate(filePath, articleIndex, allArticles.length);
      
      // 3. Corriger la structure
      const { fixedBody: structuredBody, changes: structureChanges } = fixArticleStructure(filePath);
      
      // 4. Combiner toutes les corrections
      const finalBody = fixedBody || structuredBody;
      const finalData = { ...titleData, ...domainData };
      const allChanges = [...titleChanges, ...domainChanges, ...structureChanges];
      
      if (allChanges.length > 0) {
        const finalContent = matter.stringify(finalBody, finalData);
        fs.writeFileSync(filePath, finalContent, 'utf-8');
        processedArticles.push({
          domain,
          file: path.basename(filePath),
          changes: allChanges
        });
        domainModified++;
        console.log(`   ✅ ${path.basename(filePath)}`);
        allChanges.forEach(change => {
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

// Traiter les articles généraux
if (byDomain['articles-generaux']) {
  console.log(`\n📁 Domaine: articles-generaux (à déplacer)`);
  console.log('-'.repeat(80));
  
  byDomain['articles-generaux'].forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);
    
    // Déterminer le domaine approprié selon le contenu
    let targetDomain = 'productivite-methodes'; // Par défaut
    
    if (data.title?.toLowerCase().includes('planifier') || data.title?.toLowerCase().includes('travail')) {
      targetDomain = 'productivite-methodes';
    } else if (data.title?.toLowerCase().includes('synthese')) {
      targetDomain = 'articles-generaux'; // Garder celui-ci
    }
    
    if (targetDomain !== 'articles-generaux') {
      const targetDir = path.join(articlesDir, targetDomain);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      const fileName = path.basename(filePath);
      const targetPath = path.join(targetDir, fileName);
      
      // Mettre à jour le domaine dans le frontmatter
      data.domain = targetDomain;
      const newContent = matter.stringify(content, data);
      
      fs.writeFileSync(targetPath, newContent, 'utf-8');
      fs.unlinkSync(filePath);
      
      console.log(`   ✅ ${fileName} déplacé vers ${targetDomain}`);
      processedArticles.push({
        domain: 'articles-generaux → ' + targetDomain,
        file: fileName,
        changes: [`Déplacé vers ${targetDomain}`]
      });
    }
  });
}

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

console.log('\n✅ Corrections terminées\n');

