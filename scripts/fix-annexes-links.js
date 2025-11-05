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

function fixAnnexesLinks(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let enhancedContent = content;
  const changes = [];
  
  // 1. Supprimer les doublons de sections SOURCES ET RÉFÉRENCES
  const sourcesPattern = /##\s+[0-9]?\.?\s*SOURCES\s+ET\s+RÉFÉRENCES/gi;
  const sourcesMatches = [...content.matchAll(sourcesPattern)];
  
  if (sourcesMatches.length > 1) {
    // Trouver la première occurrence complète
    const firstMatch = sourcesMatches[0];
    const firstIndex = firstMatch.index;
    
    // Trouver où se termine la première section SOURCES
    const afterFirst = content.substring(firstIndex);
    const nextSectionMatch = afterFirst.match(/^##\s+/m);
    const firstSectionEnd = nextSectionMatch 
      ? firstIndex + nextSectionMatch.index
      : content.length;
    
    // Supprimer toutes les autres occurrences
    for (let i = sourcesMatches.length - 1; i > 0; i--) {
      const match = sourcesMatches[i];
      const nextMatch = sourcesMatches[i + 1] || { index: content.length };
      const sectionStart = match.index;
      const sectionEnd = nextMatch.index > sectionStart 
        ? nextMatch.index 
        : content.length;
      
      // Supprimer le doublon
      enhancedContent = enhancedContent.substring(0, sectionStart) + 
                       enhancedContent.substring(sectionEnd);
      changes.push('Section SOURCES dupliquée supprimée');
    }
  }
  
  // 2. Corriger les liens dans ARTICLES ANNEXES
  const annexesPattern = /##\s+[0-9]?\.?\s*ARTICLES\s+ANNEXES/gi;
  if (annexesPattern.test(enhancedContent)) {
    const annexesMatch = enhancedContent.match(annexesPattern);
    if (annexesMatch) {
      const annexesIndex = enhancedContent.indexOf(annexesMatch[0]);
      const annexesSection = enhancedContent.substring(annexesIndex);
      const nextSectionMatch = annexesSection.match(/^##\s+/m);
      const annexesContent = nextSectionMatch 
        ? annexesSection.substring(0, nextSectionMatch.index)
        : annexesSection;
      
      // Remplacer les liens pour qu'ils pointent vers /blog/{slug}
      const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
      const links = [...annexesContent.matchAll(linkPattern)];
      
      links.forEach(link => {
        const linkText = link[1];
        let linkPath = link[2];
        
        // Corriger les liens pour qu'ils pointent vers /blog/{slug}
        if (!linkPath.startsWith('/blog/') && !linkPath.startsWith('http') && !linkPath.startsWith('#')) {
          // Si le chemin commence déjà par un slash, on garde juste le chemin
          // Sinon, on ajoute /blog/
          const correctedLink = linkPath.startsWith('/') 
            ? `/blog${linkPath}`
            : `/blog/${linkPath}`;
          
          enhancedContent = enhancedContent.replace(
            `[${linkText}](${linkPath})`,
            `[${linkText}](${correctedLink})`
          );
          changes.push('Lien article annexe corrigé');
        }
      });
    }
  }
  
  return { enhancedContent, changes };
}

console.log('\n🔧 Correction des liens dans les articles annexes\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const processedArticles = [];
const errors = [];

allArticles.forEach(filePath => {
  try {
    const { enhancedContent, changes } = fixAnnexesLinks(filePath);
    
    if (changes.length > 0 || enhancedContent !== fs.readFileSync(filePath, 'utf-8')) {
      fs.writeFileSync(filePath, enhancedContent, 'utf-8');
      processedArticles.push({
        file: path.relative(articlesDir, filePath),
        changes
      });
      console.log(`✅ ${path.basename(filePath)}`);
      if (changes.length > 0) {
        console.log(`   ${changes.join(', ')}`);
      }
    }
  } catch (error) {
    errors.push({
      file: path.relative(articlesDir, filePath),
      error: error.message
    });
    console.log(`❌ ${path.basename(filePath)}`);
    console.log(`   Erreur: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n📊 Résumé:\n`);
console.log(`   Total articles: ${allArticles.length}`);
console.log(`   Articles modifiés: ${processedArticles.length}`);
console.log(`   Erreurs: ${errors.length}`);

if (processedArticles.length > 0) {
  console.log(`\n✅ Articles modifiés:\n`);
  processedArticles.forEach((article, index) => {
    console.log(`   ${index + 1}. ${article.file}`);
    console.log(`      ${article.changes.join(', ')}`);
  });
}

console.log('');


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

function fixAnnexesLinks(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let enhancedContent = content;
  const changes = [];
  
  // 1. Supprimer les doublons de sections SOURCES ET RÉFÉRENCES
  const sourcesPattern = /##\s+[0-9]?\.?\s*SOURCES\s+ET\s+RÉFÉRENCES/gi;
  const sourcesMatches = [...content.matchAll(sourcesPattern)];
  
  if (sourcesMatches.length > 1) {
    // Trouver la première occurrence complète
    const firstMatch = sourcesMatches[0];
    const firstIndex = firstMatch.index;
    
    // Trouver où se termine la première section SOURCES
    const afterFirst = content.substring(firstIndex);
    const nextSectionMatch = afterFirst.match(/^##\s+/m);
    const firstSectionEnd = nextSectionMatch 
      ? firstIndex + nextSectionMatch.index
      : content.length;
    
    // Supprimer toutes les autres occurrences
    for (let i = sourcesMatches.length - 1; i > 0; i--) {
      const match = sourcesMatches[i];
      const nextMatch = sourcesMatches[i + 1] || { index: content.length };
      const sectionStart = match.index;
      const sectionEnd = nextMatch.index > sectionStart 
        ? nextMatch.index 
        : content.length;
      
      // Supprimer le doublon
      enhancedContent = enhancedContent.substring(0, sectionStart) + 
                       enhancedContent.substring(sectionEnd);
      changes.push('Section SOURCES dupliquée supprimée');
    }
  }
  
  // 2. Corriger les liens dans ARTICLES ANNEXES
  const annexesPattern = /##\s+[0-9]?\.?\s*ARTICLES\s+ANNEXES/gi;
  if (annexesPattern.test(enhancedContent)) {
    const annexesMatch = enhancedContent.match(annexesPattern);
    if (annexesMatch) {
      const annexesIndex = enhancedContent.indexOf(annexesMatch[0]);
      const annexesSection = enhancedContent.substring(annexesIndex);
      const nextSectionMatch = annexesSection.match(/^##\s+/m);
      const annexesContent = nextSectionMatch 
        ? annexesSection.substring(0, nextSectionMatch.index)
        : annexesSection;
      
      // Remplacer les liens pour qu'ils pointent vers /blog/{slug}
      const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
      const links = [...annexesContent.matchAll(linkPattern)];
      
      links.forEach(link => {
        const linkText = link[1];
        let linkPath = link[2];
        
        // Corriger les liens pour qu'ils pointent vers /blog/{slug}
        if (!linkPath.startsWith('/blog/') && !linkPath.startsWith('http') && !linkPath.startsWith('#')) {
          // Si le chemin commence déjà par un slash, on garde juste le chemin
          // Sinon, on ajoute /blog/
          const correctedLink = linkPath.startsWith('/') 
            ? `/blog${linkPath}`
            : `/blog/${linkPath}`;
          
          enhancedContent = enhancedContent.replace(
            `[${linkText}](${linkPath})`,
            `[${linkText}](${correctedLink})`
          );
          changes.push('Lien article annexe corrigé');
        }
      });
    }
  }
  
  return { enhancedContent, changes };
}

console.log('\n🔧 Correction des liens dans les articles annexes\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const processedArticles = [];
const errors = [];

allArticles.forEach(filePath => {
  try {
    const { enhancedContent, changes } = fixAnnexesLinks(filePath);
    
    if (changes.length > 0 || enhancedContent !== fs.readFileSync(filePath, 'utf-8')) {
      fs.writeFileSync(filePath, enhancedContent, 'utf-8');
      processedArticles.push({
        file: path.relative(articlesDir, filePath),
        changes
      });
      console.log(`✅ ${path.basename(filePath)}`);
      if (changes.length > 0) {
        console.log(`   ${changes.join(', ')}`);
      }
    }
  } catch (error) {
    errors.push({
      file: path.relative(articlesDir, filePath),
      error: error.message
    });
    console.log(`❌ ${path.basename(filePath)}`);
    console.log(`   Erreur: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n📊 Résumé:\n`);
console.log(`   Total articles: ${allArticles.length}`);
console.log(`   Articles modifiés: ${processedArticles.length}`);
console.log(`   Erreurs: ${errors.length}`);

if (processedArticles.length > 0) {
  console.log(`\n✅ Articles modifiés:\n`);
  processedArticles.forEach((article, index) => {
    console.log(`   ${index + 1}. ${article.file}`);
    console.log(`      ${article.changes.join(', ')}`);
  });
}

console.log('');

