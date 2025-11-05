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

function fixArticleStructure(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let enhancedContent = content;
  const changes = [];
  
  // 1. Supprimer les doublons de sections SOURCES ET RÉFÉRENCES
  const sourcesPattern = /##\s+[0-9]?\.?\s*SOURCES\s+ET\s+RÉFÉRENCES/gi;
  const sourcesMatches = [...content.matchAll(sourcesPattern)];
  
  if (sourcesMatches.length > 1) {
    // Garder seulement la première occurrence
    for (let i = 1; i < sourcesMatches.length; i++) {
      const match = sourcesMatches[i];
      const nextMatch = sourcesMatches[i + 1] || { index: content.length };
      const sectionStart = match.index;
      const sectionEnd = nextMatch.index;
      
      // Supprimer le doublon
      enhancedContent = enhancedContent.substring(0, sectionStart) + 
                       enhancedContent.substring(sectionEnd);
      changes.push('Section SOURCES dupliquée supprimée');
    }
  }
  
  // 2. Vérifier que les liens dans ARTICLES ANNEXES sont corrects
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
      
      // Vérifier les liens (format markdown)
      const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
      const links = [...annexesContent.matchAll(linkPattern)];
      
      links.forEach(link => {
        const linkText = link[1];
        const linkPath = link[2];
        
        // Corriger les liens pour qu'ils pointent vers /blog/{slug}
        if (!linkPath.startsWith('/blog/') && !linkPath.startsWith('http')) {
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
  
  // 3. Vérifier que les sources sont bien présentes et mentionnées dans le texte
  const sourcesSectionMatch = enhancedContent.match(/##\s+[0-9]?\.?\s*SOURCES\s+ET\s+RÉFÉRENCES/gi);
  if (sourcesSectionMatch) {
    const sourcesIndex = enhancedContent.indexOf(sourcesSectionMatch[0]);
    const sourcesSection = enhancedContent.substring(sourcesIndex);
    const nextSectionMatch = sourcesSection.match(/^##\s+/m);
    const sourcesContent = nextSectionMatch 
      ? sourcesSection.substring(0, nextSectionMatch.index)
      : sourcesSection;
    
    // Extraire les sources citées
    const sourceLines = sourcesContent.split('\n').filter(line => 
      line.trim().startsWith('-') && (line.includes('http') || line.includes('<'))
    );
    
    // Vérifier que les sources sont mentionnées dans le texte
    const bodyText = enhancedContent.substring(0, sourcesIndex);
    sourceLines.forEach(sourceLine => {
      // Extraire le nom de l'organisation
      const orgMatch = sourceLine.match(/^-\s*([^-]+)\s*-/);
      if (orgMatch) {
        const orgName = orgMatch[1].trim();
        const orgShort = orgName.split(' ')[0]; // Ex: "PMI" depuis "PMI -"
        
        // Vérifier si la source est mentionnée dans le texte
        const mentionPattern = new RegExp(`selon\\s+${orgShort}|${orgName}`, 'i');
        if (!mentionPattern.test(bodyText)) {
          // La source n'est pas mentionnée, on peut l'ajouter dans une note
          // Mais pour l'instant, on ne fait rien, on vérifie juste
        }
      }
    });
    
    // S'assurer qu'il y a au moins 4 sources
    if (sourceLines.length < 4) {
      changes.push(`Seulement ${sourceLines.length} sources trouvées (minimum 4 recommandé)`);
    }
  }
  
  return { enhancedContent, changes };
}

console.log('\n🔧 Correction de la structure des articles\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const processedArticles = [];
const errors = [];

allArticles.forEach(filePath => {
  try {
    const { enhancedContent, changes } = fixArticleStructure(filePath);
    
    if (changes.length > 0 || enhancedContent !== content) {
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

console.log('');

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

function fixArticleStructure(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let enhancedContent = content;
  const changes = [];
  
  // 1. Supprimer les doublons de sections SOURCES ET RÉFÉRENCES
  const sourcesPattern = /##\s+[0-9]?\.?\s*SOURCES\s+ET\s+RÉFÉRENCES/gi;
  const sourcesMatches = [...content.matchAll(sourcesPattern)];
  
  if (sourcesMatches.length > 1) {
    // Garder seulement la première occurrence
    for (let i = 1; i < sourcesMatches.length; i++) {
      const match = sourcesMatches[i];
      const nextMatch = sourcesMatches[i + 1] || { index: content.length };
      const sectionStart = match.index;
      const sectionEnd = nextMatch.index;
      
      // Supprimer le doublon
      enhancedContent = enhancedContent.substring(0, sectionStart) + 
                       enhancedContent.substring(sectionEnd);
      changes.push('Section SOURCES dupliquée supprimée');
    }
  }
  
  // 2. Vérifier que les liens dans ARTICLES ANNEXES sont corrects
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
      
      // Vérifier les liens (format markdown)
      const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
      const links = [...annexesContent.matchAll(linkPattern)];
      
      links.forEach(link => {
        const linkText = link[1];
        const linkPath = link[2];
        
        // Corriger les liens pour qu'ils pointent vers /blog/{slug}
        if (!linkPath.startsWith('/blog/') && !linkPath.startsWith('http')) {
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
  
  // 3. Vérifier que les sources sont bien présentes et mentionnées dans le texte
  const sourcesSectionMatch = enhancedContent.match(/##\s+[0-9]?\.?\s*SOURCES\s+ET\s+RÉFÉRENCES/gi);
  if (sourcesSectionMatch) {
    const sourcesIndex = enhancedContent.indexOf(sourcesSectionMatch[0]);
    const sourcesSection = enhancedContent.substring(sourcesIndex);
    const nextSectionMatch = sourcesSection.match(/^##\s+/m);
    const sourcesContent = nextSectionMatch 
      ? sourcesSection.substring(0, nextSectionMatch.index)
      : sourcesSection;
    
    // Extraire les sources citées
    const sourceLines = sourcesContent.split('\n').filter(line => 
      line.trim().startsWith('-') && (line.includes('http') || line.includes('<'))
    );
    
    // Vérifier que les sources sont mentionnées dans le texte
    const bodyText = enhancedContent.substring(0, sourcesIndex);
    sourceLines.forEach(sourceLine => {
      // Extraire le nom de l'organisation
      const orgMatch = sourceLine.match(/^-\s*([^-]+)\s*-/);
      if (orgMatch) {
        const orgName = orgMatch[1].trim();
        const orgShort = orgName.split(' ')[0]; // Ex: "PMI" depuis "PMI -"
        
        // Vérifier si la source est mentionnée dans le texte
        const mentionPattern = new RegExp(`selon\\s+${orgShort}|${orgName}`, 'i');
        if (!mentionPattern.test(bodyText)) {
          // La source n'est pas mentionnée, on peut l'ajouter dans une note
          // Mais pour l'instant, on ne fait rien, on vérifie juste
        }
      }
    });
    
    // S'assurer qu'il y a au moins 4 sources
    if (sourceLines.length < 4) {
      changes.push(`Seulement ${sourceLines.length} sources trouvées (minimum 4 recommandé)`);
    }
  }
  
  return { enhancedContent, changes };
}

console.log('\n🔧 Correction de la structure des articles\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const processedArticles = [];
const errors = [];

allArticles.forEach(filePath => {
  try {
    const { enhancedContent, changes } = fixArticleStructure(filePath);
    
    if (changes.length > 0 || enhancedContent !== content) {
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

console.log('');

