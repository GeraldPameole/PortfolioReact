import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const articlesDir = path.join(projectRoot, 'src/content/articles');

// Structure standard attendue
const STANDARD_SECTIONS = [
  { pattern: /^##\s*Introduction\s*$/i, order: 0, title: 'Introduction' },
  { pattern: /^##\s*1\.\s*FONDAMENTAUX\s+DU\s+SUJET\s*$/i, order: 1, title: '1. FONDAMENTAUX DU SUJET' },
  { pattern: /^##\s*2\.\s*ANALYSE\s+APPROFONDIE\s*$/i, order: 2, title: '2. ANALYSE APPROFONDIE' },
  { pattern: /^##\s*3\.\s*STRATÉGIES\s+ET\s+MÉTHODOLOGIES\s*$/i, order: 3, title: '3. STRATÉGIES ET MÉTHODOLOGIES' },
  { pattern: /^##\s*4\.\s*OUTILS\s+ET\s+TECHNOLOGIES\s*$/i, order: 4, title: '4. OUTILS ET TECHNOLOGIES' },
  { pattern: /^##\s*5\.\s*DÉFIS\s+ET\s+SOLUTIONS\s*$/i, order: 5, title: '5. DÉFIS ET SOLUTIONS' },
  { pattern: /^##\s*6\.\s*SOURCES\s+ET\s+RÉFÉRENCES\s*$/i, order: 6, title: '6. SOURCES ET RÉFÉRENCES' },
  { pattern: /^##\s*7\.\s*ARTICLES\s+ANNEXES\s*$/i, order: 7, title: '7. ARTICLES ANNEXES' }
];

// Sections à supprimer (8, 9, 10, 11, etc.)
const SECTIONS_TO_REMOVE = [
  /^##\s*8\./i,
  /^##\s*9\./i,
  /^##\s*10\./i,
  /^##\s*11\./i,
  /^##\s*12\./i,
  /^##\s*BONNES\s+PRATIQUES/i,
  /^##\s*CONCLUSION/i,
  /^##\s*ÉLÉMENTS\s+COMPLÉMENTAIRES/i,
  /^##\s*GLOSSAIRE/i,
  /^##\s*Ressources\s+Complémentaires/i
];

// Analyser et extraire les sections d'un article
function extractSections(content) {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = null;
  let currentContent = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isSectionHeader = line.match(/^##\s/);
    
    if (isSectionHeader) {
      // Sauvegarder la section précédente
      if (currentSection !== null) {
        sections.push({
          ...currentSection,
          content: currentContent.join('\n'),
          endLine: i
        });
      }
      
      // Identifier la nouvelle section
      let matched = false;
      for (const stdSection of STANDARD_SECTIONS) {
        if (stdSection.pattern.test(line)) {
          currentSection = {
            order: stdSection.order,
            title: stdSection.title,
            originalTitle: line.replace(/^##\s+/, '').trim(),
            startLine: i
          };
          matched = true;
          break;
        }
      }
      
      // Vérifier si c'est une section à supprimer
      if (!matched) {
        let shouldRemove = false;
        for (const removePattern of SECTIONS_TO_REMOVE) {
          if (removePattern.test(line)) {
            shouldRemove = true;
            break;
          }
        }
        
        if (shouldRemove) {
          // Ignorer cette section
          currentSection = null;
          currentContent = [];
          // Trouver où cette section se termine (prochaine section ##)
          let j = i + 1;
          while (j < lines.length && !lines[j].match(/^##\s/)) {
            j++;
          }
          i = j - 1; // -1 car la boucle va incrémenter
          continue;
        } else {
          // Section non standard mais à garder (peut-être une sous-section)
          if (currentSection !== null) {
            currentContent.push(line);
          }
        }
      } else {
        currentContent = [];
      }
    } else {
      if (currentSection !== null) {
        currentContent.push(line);
      }
    }
  }
  
  // Ajouter la dernière section
  if (currentSection !== null) {
    sections.push({
      ...currentSection,
      content: currentContent.join('\n'),
      endLine: lines.length
    });
  }
  
  return sections;
}

// Réorganiser les sections dans le bon ordre
function reorganizeSections(sections) {
  // Trier par ordre
  const sortedSections = sections.sort((a, b) => a.order - b.order);
  
  // Vérifier que toutes les sections obligatoires sont présentes
  const requiredSections = [0, 1, 2, 6, 7]; // Introduction, 1, 2, 6, 7
  const presentOrders = new Set(sections.map(s => s.order));
  
  const missingSections = requiredSections.filter(order => !presentOrders.has(order));
  
  return { sortedSections, missingSections };
}

// Reconstruire le contenu avec les sections réorganisées
function rebuildContent(originalContent, sections) {
  const { sortedSections, missingSections } = reorganizeSections(sections);
  
  // Si des sections obligatoires manquent, on garde le contenu original mais on réorganise
  if (missingSections.length > 0) {
    console.warn(`  ⚠️  Sections manquantes: ${missingSections.map(o => STANDARD_SECTIONS.find(s => s.order === o)?.title).join(', ')}`);
  }
  
  // Reconstruire le contenu
  let newContent = '';
  
  // Garder le frontmatter
  const frontmatterMatch = originalContent.match(/^---[\s\S]*?---\n\n/);
  if (frontmatterMatch) {
    newContent = frontmatterMatch[0];
  }
  
  // Ajouter les sections dans l'ordre
  for (const section of sortedSections) {
    newContent += `## ${section.title}\n\n`;
    newContent += section.content.trim();
    newContent += '\n\n';
  }
  
  return newContent.trim() + '\n';
}

// Corriger la structure d'un article
function fixArticleStructure(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const sections = extractSections(content);
  
  if (sections.length === 0) {
    return { modified: false, reason: 'Aucune section trouvée' };
  }
  
  // Vérifier si l'ordre est correct
  const orders = sections.map(s => s.order);
  const isOrdered = orders.every((order, index) => {
    if (index === 0) return true;
    return order >= orders[index - 1];
  });
  
  // Vérifier que la section 6 est avant la section 7
  const section6Index = orders.indexOf(6);
  const section7Index = orders.indexOf(7);
  const isSourcesBeforeAnnexes = section6Index === -1 || section7Index === -1 || section6Index < section7Index;
  
  if (isOrdered && isSourcesBeforeAnnexes) {
    return { modified: false, reason: 'Structure déjà correcte' };
  }
  
  // Réorganiser
  const newContent = rebuildContent(content, sections);
  
  // Écrire le fichier
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  return { modified: true, sectionsFixed: sections.length };
}

// Main
function main() {
  console.log('🔧 Correction de la structure des articles...\n');
  
  // Récupérer tous les dossiers
  const domains = fs.readdirSync(articlesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
  
  const report = {};
  let totalFixed = 0;
  
  for (const domain of domains) {
    const domainDir = path.join(articlesDir, domain);
    const files = fs.readdirSync(domainDir)
      .filter(f => f.endsWith('.md') && !f.includes('template'))
      .map(f => path.join(domainDir, f));
    
    if (files.length === 0) continue;
    
    console.log(`📁 ${domain} (${files.length} article(s))`);
    
    const domainReport = {
      total: files.length,
      fixed: 0,
      articles: []
    };
    
    for (const file of files) {
      const result = fixArticleStructure(file);
      const fileName = path.basename(file);
      
      if (result.modified) {
        domainReport.fixed++;
        totalFixed++;
        console.log(`  ✅ ${fileName} - Structure corrigée`);
        domainReport.articles.push({ file: fileName, status: 'fixed' });
      } else {
        console.log(`  ✓ ${fileName} - ${result.reason}`);
        domainReport.articles.push({ file: fileName, status: 'ok', reason: result.reason });
      }
    }
    
    report[domain] = domainReport;
    console.log('');
  }
  
  console.log('='.repeat(70));
  console.log(`✅ ${totalFixed} article(s) corrigé(s)`);
  console.log('='.repeat(70) + '\n');
  
  return report;
}

main();

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

