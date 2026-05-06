import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim();
}

function extractParagraphs(content) {
  const lines = content.split('\n');
  const paragraphs = [];
  let currentParagraph = '';
  let inCodeBlock = false;
  let inFrontmatter = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Détecter le frontmatter
    if (trimmed === '---' && i === 0) {
      inFrontmatter = true;
      continue;
    }
    if (trimmed === '---' && inFrontmatter) {
      inFrontmatter = false;
      continue;
    }
    if (inFrontmatter) continue;
    
    // Détecter les blocs de code
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (currentParagraph.trim().length > 50) {
        paragraphs.push({ text: currentParagraph.trim(), line: i, normalized: normalizeText(currentParagraph) });
      }
      currentParagraph = '';
      continue;
    }
    if (inCodeBlock) continue;
    
    // Ignorer les titres, listes, tableaux, etc.
    if (
      trimmed.startsWith('#') ||
      trimmed.startsWith('- ') ||
      trimmed.startsWith('* ') ||
      trimmed.startsWith('|') ||
      trimmed.startsWith('```') ||
      trimmed === ''
    ) {
      if (currentParagraph.trim().length > 50) {
        paragraphs.push({ text: currentParagraph.trim(), line: i, normalized: normalizeText(currentParagraph) });
      }
      currentParagraph = '';
      continue;
    }
    
    currentParagraph += ' ' + trimmed;
  }
  
  if (currentParagraph.trim().length > 50) {
    paragraphs.push({ text: currentParagraph.trim(), line: lines.length, normalized: normalizeText(currentParagraph) });
  }
  
  return paragraphs;
}

function findDuplicateParagraphs(paragraphs) {
  const seen = new Map();
  const duplicates = [];
  
  paragraphs.forEach((para, index) => {
    if (para.normalized.length < 30) return;
    
    if (seen.has(para.normalized)) {
      duplicates.push({
        text: para.text,
        normalized: para.normalized,
        firstIndex: seen.get(para.normalized),
        duplicateIndex: index,
        firstLine: paragraphs[seen.get(para.normalized)].line,
        duplicateLine: para.line
      });
    } else {
      seen.set(para.normalized, index);
    }
  });
  
  return duplicates;
}

function findDuplicateSections(content) {
  const sectionRegex = /^##+\s+(.+)$/gm;
  const sections = [];
  let match;
  const lines = content.split('\n');
  
  while ((match = sectionRegex.exec(content)) !== null) {
    const lineNum = content.substring(0, match.index).split('\n').length;
    sections.push({
      title: match[1].trim(),
      line: lineNum,
      normalized: normalizeText(match[1].trim())
    });
  }
  
  const duplicateSections = [];
  const seenTitles = new Map();
  
  sections.forEach(section => {
    if (seenTitles.has(section.normalized)) {
      duplicateSections.push({
        title: section.title,
        normalized: section.normalized,
        firstLine: seenTitles.get(section.normalized),
        duplicateLine: section.line
      });
    } else {
      seenTitles.set(section.normalized, section.line);
    }
  });
  
  return duplicateSections;
}

function removeDuplicateParagraph(content, duplicate) {
  const lines = content.split('\n');
  const duplicateLine = duplicate.duplicateLine;
  
  // Trouver le paragraphe à supprimer (lignes autour de duplicateLine)
  let startLine = duplicateLine - 1;
  let endLine = duplicateLine;
  
  // Trouver le début du paragraphe
  while (startLine > 0 && 
         lines[startLine].trim() !== '' && 
         !lines[startLine].trim().startsWith('#') &&
         !lines[startLine].trim().startsWith('-') &&
         !lines[startLine].trim().startsWith('*') &&
         !lines[startLine].trim().startsWith('|')) {
    startLine--;
  }
  startLine++;
  
  // Trouver la fin du paragraphe
  while (endLine < lines.length - 1 && 
         lines[endLine].trim() !== '' &&
         !lines[endLine].trim().startsWith('#') &&
         !lines[endLine].trim().startsWith('-') &&
         !lines[endLine].trim().startsWith('*') &&
         !lines[endLine].trim().startsWith('|')) {
    endLine++;
  }
  
  // Supprimer le paragraphe dupliqué (garder le premier)
  const newLines = [...lines.slice(0, startLine), ...lines.slice(endLine + 1)];
  return newLines.join('\n');
}

function renameDuplicateSection(content, duplicate) {
  // Renommer la section dupliquée en ajoutant un numéro
  const lines = content.split('\n');
  const duplicateLine = duplicate.duplicateLine - 1; // -1 car les lignes sont 1-indexées
  
  if (duplicateLine >= 0 && duplicateLine < lines.length) {
    const line = lines[duplicateLine];
    const match = line.match(/^(##+)\s+(.+)$/);
    if (match) {
      // Ajouter " (2)" ou un numéro au titre
      const newTitle = `${match[2]} (2)`;
      lines[duplicateLine] = `${match[1]} ${newTitle}`;
    }
  }
  
  return lines.join('\n');
}

function processArticle(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    const paragraphs = extractParagraphs(content);
    const duplicateParagraphs = findDuplicateParagraphs(paragraphs);
    const duplicateSections = findDuplicateSections(content);
    
    let fixedParagraphs = 0;
    let fixedSections = 0;
    
    // Supprimer les paragraphes dupliqués (garder le premier, supprimer les suivants)
    // Trier par ligne décroissante pour éviter les problèmes d'index
    const sortedDuplicates = [...duplicateParagraphs].sort((a, b) => b.duplicateLine - a.duplicateLine);
    
    for (const dup of sortedDuplicates) {
      content = removeDuplicateParagraph(content, dup);
      fixedParagraphs++;
    }
    
    // Renommer les sections dupliquées
    for (const dup of duplicateSections) {
      content = renameDuplicateSection(content, dup);
      fixedSections++;
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return {
        filePath,
        fixedParagraphs,
        fixedSections,
        status: 'updated'
      };
    }
    
    return {
      filePath,
      fixedParagraphs: 0,
      fixedSections: 0,
      status: 'no_changes'
    };
  } catch (error) {
    return {
      filePath,
      error: error.message,
      status: 'error'
    };
  }
}

function main() {
  const articlesDir = path.join(__dirname, '../src/content/articles');
  const results = [];
  let totalFixedParagraphs = 0;
  let totalFixedSections = 0;
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.md')) {
        const result = processArticle(filePath);
        results.push(result);
        if (result.fixedParagraphs) totalFixedParagraphs += result.fixedParagraphs;
        if (result.fixedSections) totalFixedSections += result.fixedSections;
      }
    }
  }
  
  walkDir(articlesDir);
  
  console.log('\n📊 Correction des redondances:\n');
  console.log(`Total articles traités: ${results.length}`);
  console.log(`Total paragraphes dupliqués supprimés: ${totalFixedParagraphs}`);
  console.log(`Total sections dupliquées renommées: ${totalFixedSections}\n`);
  
  const updated = results.filter(r => r.status === 'updated');
  const errors = results.filter(r => r.status === 'error');
  
  if (updated.length > 0) {
    console.log(`✅ Articles mis à jour: ${updated.length}`);
    updated.slice(0, 10).forEach(r => {
      console.log(`   - ${path.basename(r.filePath)}: ${r.fixedParagraphs} paragraphes, ${r.fixedSections} sections`);
    });
    if (updated.length > 10) {
      console.log(`   ... et ${updated.length - 10} autres articles`);
    }
  }
  
  if (errors.length > 0) {
    console.log(`\n❌ Erreurs: ${errors.length}`);
    errors.forEach(r => {
      console.log(`   - ${r.filePath}: ${r.error}`);
    });
  }
  
  console.log('\n');
}

main();



