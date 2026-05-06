import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Patterns flexibles pour détecter les sections
const SECTION_PATTERNS = {
  1: [
    /^##\s+1\.?\s*INTRODUCTION/i,
    /^##\s+INTRODUCTION/i,
    /^##\s+1\.?\s*FONDAMENTAUX/i,
    /^##\s+FONDAMENTAUX/i,
    /^##\s+1\.?\s*PRÉSENTATION/i
  ],
  2: [
    /^##\s+2\.?\s*FONDEMENTS/i,
    /^##\s+FONDEMENTS/i,
    /^##\s+2\.?\s*THÉORIE/i,
    /^##\s+2\.?\s*ANALYSE/i,
    /^##\s+ANALYSE/i
  ],
  3: [
    /^##\s+3\.?\s*MÉTHODOLOGIE/i,
    /^##\s+MÉTHODOLOGIE/i,
    /^##\s+3\.?\s*MÉTHODE/i
  ],
  4: [
    /^##\s+4\.?\s*MISE/i,
    /^##\s+4\.?\s*PRATIQUE/i,
    /^##\s+MISE\s+EN\s+PRATIQUE/i,
    /^##\s+4\.?\s*APPLICATION/i
  ],
  5: [
    /^##\s+5\.?\s*DÉFIS/i,
    /^##\s+5\.?\s*SOLUTIONS/i,
    /^##\s+DÉFIS/i
  ],
  6: [
    /^##\s+6\.?\s*SOURCES/i,
    /^##\s+6\.?\s*RÉFÉRENCES/i,
    /^##\s+SOURCES/i,
    /^##\s+RÉFÉRENCES/i
  ],
  7: [
    /^##\s+7\.?\s*ARTICLES/i,
    /^##\s+7\.?\s*ANNEXES/i,
    /^##\s+ARTICLES\s+ANNEXES/i
  ]
};

function findSections(content) {
  const sectionRegex = /^##+\s+(\d+)\.?\s*(.+)$/gm;
  const sections = [];
  let match;
  const lines = content.split('\n');
  
  while ((match = sectionRegex.exec(content)) !== null) {
    const number = parseInt(match[1]);
    const title = match[2].trim();
    const lineIndex = content.substring(0, match.index).split('\n').length - 1;
    
    sections.push({ number, title, line: lineIndex + 1 });
  }
  
  // Chercher aussi les sections sans numéro
  const noNumberRegex = /^##\s+(INTRODUCTION|FONDAMENTAUX|FONDEMENTS|THÉORIE|ANALYSE|MÉTHODOLOGIE|MISE\s+EN\s+PRATIQUE|DÉFIS|SOLUTIONS|SOURCES|RÉFÉRENCES|ARTICLES\s+ANNEXES)/i;
  let noNumberMatch;
  const contentLines = content.split('\n');
  
  for (let i = 0; i < contentLines.length; i++) {
    const line = contentLines[i];
    if ((noNumberMatch = noNumberRegex.exec(line)) !== null) {
      const title = noNumberMatch[1].trim();
      // Essayer de déterminer le numéro de section
      let sectionNum = null;
      for (const [num, patterns] of Object.entries(SECTION_PATTERNS)) {
        if (patterns.some(p => p.test(line))) {
          sectionNum = parseInt(num);
          break;
        }
      }
      if (sectionNum) {
        sections.push({ number: sectionNum, title, line: i + 1 });
      }
    }
  }
  
  // Trier par ligne
  sections.sort((a, b) => a.line - b.line);
  
  return sections;
}

function checkSectionOrder(sections) {
  const issues = [];
  let expectedNum = 1;
  
  for (const section of sections) {
    if (section.number !== expectedNum) {
      issues.push({
        type: 'wrong_order',
        section: section.number,
        title: section.title,
        line: section.line,
        expected: expectedNum
      });
    }
    if (section.number === expectedNum) {
      expectedNum++;
    } else if (section.number > expectedNum) {
      // Section manquante
      issues.push({
        type: 'missing',
        section: expectedNum,
        before: section.number
      });
      expectedNum = section.number + 1;
    }
  }
  
  return issues;
}

function fixSectionNumbering(content) {
  const lines = content.split('\n');
  const sections = findSections(content);
  const fixedLines = [...lines];
  let changes = 0;
  
  // Créer un mapping des numéros de sections attendus
  const sectionMap = new Map();
  let expectedNum = 1;
  
  for (const section of sections) {
    if (!sectionMap.has(section.line)) {
      sectionMap.set(section.line, expectedNum);
      expectedNum++;
    }
  }
  
  // Corriger les numéros de sections
  for (const section of sections) {
    const lineIndex = section.line - 1;
    if (lineIndex >= 0 && lineIndex < fixedLines.length) {
      const line = fixedLines[lineIndex];
      const expectedNum = sectionMap.get(section.line);
      
      if (expectedNum && section.number !== expectedNum) {
        const newLine = line.replace(/^##\s+\d+\.?\s*/, `## ${expectedNum}. `);
        fixedLines[lineIndex] = newLine;
        changes++;
      }
    }
  }
  
  return { content: fixedLines.join('\n'), changes };
}

function ensureRequiredSections(content) {
  const sections = findSections(content);
  const foundNumbers = new Set(sections.map(s => s.number));
  const missing = [];
  
  for (let i = 1; i <= 7; i++) {
    if (!foundNumbers.has(i)) {
      missing.push(i);
    }
  }
  
  return missing;
}

function processArticle(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // Vérifier et corriger la numérotation
    const { content: fixedContent, changes } = fixSectionNumbering(content);
    content = fixedContent;
    
    // Vérifier les sections manquantes
    const missing = ensureRequiredSections(content);
    
    if (content !== originalContent || missing.length > 0) {
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
      }
      
      return {
        filePath,
        changes,
        missing,
        status: changes > 0 || missing.length > 0 ? 'updated' : 'no_changes'
      };
    }
    
    return {
      filePath,
      changes: 0,
      missing: [],
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
  let totalChanges = 0;
  let totalMissing = 0;
  
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
        if (result.changes) totalChanges += result.changes;
        if (result.missing) totalMissing += result.missing.length;
      }
    }
  }
  
  walkDir(articlesDir);
  
  console.log('\n📊 Correction de la structure:\n');
  console.log(`Total articles traités: ${results.length}`);
  console.log(`Total corrections de numérotation: ${totalChanges}`);
  console.log(`Total sections manquantes détectées: ${totalMissing}\n`);
  
  const updated = results.filter(r => r.status === 'updated');
  const errors = results.filter(r => r.status === 'error');
  
  if (updated.length > 0) {
    console.log(`✅ Articles mis à jour: ${updated.length}`);
    updated.slice(0, 10).forEach(r => {
      const info = [];
      if (r.changes > 0) info.push(`${r.changes} corrections`);
      if (r.missing && r.missing.length > 0) info.push(`${r.missing.length} sections manquantes`);
      console.log(`   - ${path.basename(r.filePath)}: ${info.join(', ')}`);
    });
    if (updated.length > 10) {
      console.log(`   ... et ${updated.length - 10} autres articles`);
    }
  }
  
  if (errors.length > 0) {
    console.log(`\n❌ Erreurs: ${errors.length}`);
    errors.slice(0, 5).forEach(r => {
      console.log(`   - ${path.basename(r.filePath)}: ${r.error}`);
    });
  }
  
  console.log('\n');
}

main();



