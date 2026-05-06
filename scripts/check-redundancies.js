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
  // Extraire les paragraphes (lignes non vides, non titres, non listes)
  const lines = content.split('\n');
  const paragraphs = [];
  let currentParagraph = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Ignorer les titres, listes, code blocks, etc.
    if (
      trimmed.startsWith('#') ||
      trimmed.startsWith('-') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('|') ||
      trimmed.startsWith('```') ||
      trimmed.startsWith('---') ||
      trimmed === ''
    ) {
      if (currentParagraph.trim().length > 50) {
        paragraphs.push(currentParagraph.trim());
      }
      currentParagraph = '';
      continue;
    }
    
    currentParagraph += ' ' + trimmed;
  }
  
  if (currentParagraph.trim().length > 50) {
    paragraphs.push(currentParagraph.trim());
  }
  
  return paragraphs.map(p => normalizeText(p));
}

function findDuplicates(paragraphs) {
  const seen = new Map();
  const duplicates = [];
  
  paragraphs.forEach((para, index) => {
    if (para.length < 30) return; // Ignorer les paragraphes trop courts
    
    if (seen.has(para)) {
      duplicates.push({
        text: para,
        firstIndex: seen.get(para),
        duplicateIndex: index
      });
    } else {
      seen.set(para, index);
    }
  });
  
  return duplicates;
}

function checkSectionDuplicates(content) {
  const sectionRegex = /^##+\s+(.+)$/gm;
  const sections = [];
  let match;
  
  while ((match = sectionRegex.exec(content)) !== null) {
    sections.push({
      title: match[1].trim(),
      line: content.substring(0, match.index).split('\n').length
    });
  }
  
  const duplicateSections = [];
  const seenTitles = new Map();
  
  sections.forEach(section => {
    const normalized = normalizeText(section.title);
    if (seenTitles.has(normalized)) {
      duplicateSections.push({
        title: section.title,
        firstLine: seenTitles.get(normalized),
        duplicateLine: section.line
      });
    } else {
      seenTitles.set(normalized, section.line);
    }
  });
  
  return duplicateSections;
}

function processArticle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const paragraphs = extractParagraphs(content);
    const duplicateParagraphs = findDuplicates(paragraphs);
    const duplicateSections = checkSectionDuplicates(content);
    
    return {
      filePath,
      duplicateParagraphs: duplicateParagraphs.length,
      duplicateSections: duplicateSections.length,
      details: {
        paragraphs: duplicateParagraphs,
        sections: duplicateSections
      }
    };
  } catch (error) {
    return {
      filePath,
      error: error.message
    };
  }
}

function main() {
  const articlesDir = path.join(__dirname, '../src/content/articles');
  const results = [];
  let totalDuplicateParagraphs = 0;
  let totalDuplicateSections = 0;
  
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
        if (result.duplicateParagraphs) totalDuplicateParagraphs += result.duplicateParagraphs;
        if (result.duplicateSections) totalDuplicateSections += result.duplicateSections;
      }
    }
  }
  
  walkDir(articlesDir);
  
  console.log('\n📊 Analyse des redondances:\n');
  console.log(`Total articles analysés: ${results.length}`);
  console.log(`Total paragraphes dupliqués: ${totalDuplicateParagraphs}`);
  console.log(`Total sections dupliquées: ${totalDuplicateSections}\n`);
  
  const withIssues = results.filter(r => 
    (r.duplicateParagraphs && r.duplicateParagraphs > 0) || 
    (r.duplicateSections && r.duplicateSections > 0)
  );
  
  if (withIssues.length > 0) {
    console.log(`⚠️  Articles avec redondances: ${withIssues.length}\n`);
    withIssues.forEach(r => {
      console.log(`📄 ${r.filePath}`);
      if (r.duplicateParagraphs > 0) {
        console.log(`   - ${r.duplicateParagraphs} paragraphe(s) dupliqué(s)`);
        if (r.details && r.details.paragraphs.length > 0) {
          r.details.paragraphs.slice(0, 2).forEach(dup => {
            console.log(`     * Ligne ${dup.duplicateIndex}: "${dup.text.substring(0, 60)}..."`);
          });
        }
      }
      if (r.duplicateSections > 0) {
        console.log(`   - ${r.duplicateSections} section(s) dupliquée(s)`);
        if (r.details && r.details.sections.length > 0) {
          r.details.sections.forEach(dup => {
            console.log(`     * "${dup.title}" (lignes ${dup.firstLine} et ${dup.duplicateLine})`);
          });
        }
      }
      console.log('');
    });
  } else {
    console.log('✅ Aucune redondance détectée!\n');
  }
}

main();



