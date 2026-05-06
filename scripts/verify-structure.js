import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_SECTIONS = [
  { number: 1, title: 'INTRODUCTION', patterns: [/^##\s+1\.?\s*INTRODUCTION/i] },
  { number: 2, title: 'FONDEMENTS THÉORIQUES', patterns: [/^##\s+2\.?\s*FONDEMENTS/i, /^##\s+2\.?\s*THÉORIE/i] },
  { number: 3, title: 'MÉTHODOLOGIE', patterns: [/^##\s+3\.?\s*MÉTHODOLOGIE/i] },
  { number: 4, title: 'MISE EN PRATIQUE', patterns: [/^##\s+4\.?\s*MISE/i, /^##\s+4\.?\s*PRATIQUE/i] },
  { number: 5, title: 'DÉFIS ET SOLUTIONS', patterns: [/^##\s+5\.?\s*DÉFIS/i, /^##\s+5\.?\s*SOLUTIONS/i] },
  { number: 6, title: 'SOURCES ET RÉFÉRENCES', patterns: [/^##\s+6\.?\s*SOURCES/i, /^##\s+6\.?\s*RÉFÉRENCES/i] },
  { number: 7, title: 'ARTICLES ANNEXES', patterns: [/^##\s+7\.?\s*ARTICLES/i, /^##\s+7\.?\s*ANNEXES/i] }
];

function findSections(content) {
  const sectionRegex = /^##\s+(\d+)\.?\s*(.+)$/gm;
  const sections = [];
  let match;
  
  while ((match = sectionRegex.exec(content)) !== null) {
    const number = parseInt(match[1]);
    const title = match[2].trim();
    const line = content.substring(0, match.index).split('\n').length;
    
    sections.push({ number, title, line });
  }
  
  return sections;
}

function checkStructure(content) {
  const sections = findSections(content);
  const issues = [];
  const foundSections = new Set();
  
  // Vérifier que toutes les sections requises sont présentes
  for (const required of REQUIRED_SECTIONS) {
    const found = sections.find(s => 
      s.number === required.number && 
      required.patterns.some(p => p.test(`## ${s.number} ${s.title}`))
    );
    
    if (!found) {
      issues.push({
        type: 'missing',
        section: required.number,
        title: required.title
      });
    } else {
      foundSections.add(required.number);
    }
  }
  
  // Vérifier l'ordre des sections
  const orderedSections = sections
    .filter(s => foundSections.has(s.number))
    .sort((a, b) => a.number - b.number);
  
  let lastNumber = 0;
  for (const section of orderedSections) {
    if (section.number !== lastNumber + 1 && lastNumber > 0) {
      issues.push({
        type: 'order',
        section: section.number,
        title: section.title,
        expected: lastNumber + 1,
        line: section.line
      });
    }
    lastNumber = section.number;
  }
  
  // Vérifier les sections en double
  const sectionNumbers = sections.map(s => s.number);
  const duplicates = sectionNumbers.filter((num, index) => 
    sectionNumbers.indexOf(num) !== index
  );
  
  if (duplicates.length > 0) {
    issues.push({
      type: 'duplicate',
      sections: [...new Set(duplicates)]
    });
  }
  
  return {
    sections: sections.filter(s => foundSections.has(s.number)),
    issues,
    isValid: issues.length === 0
  };
}

function processArticle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const structure = checkStructure(content);
    
    return {
      filePath,
      ...structure
    };
  } catch (error) {
    return {
      filePath,
      error: error.message,
      isValid: false
    };
  }
}

function main() {
  const articlesDir = path.join(__dirname, '../src/content/articles');
  const results = [];
  let totalIssues = 0;
  
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
        if (result.issues) totalIssues += result.issues.length;
      }
    }
  }
  
  walkDir(articlesDir);
  
  console.log('\n📊 Vérification de la structure:\n');
  console.log(`Total articles analysés: ${results.length}`);
  console.log(`Total problèmes détectés: ${totalIssues}\n`);
  
  const withIssues = results.filter(r => !r.isValid && r.issues && r.issues.length > 0);
  const valid = results.filter(r => r.isValid);
  
  console.log(`✅ Articles avec structure correcte: ${valid.length}`);
  console.log(`⚠️  Articles avec problèmes: ${withIssues.length}\n`);
  
  if (withIssues.length > 0) {
    console.log('📋 Détails des problèmes:\n');
    withIssues.forEach(r => {
      console.log(`📄 ${r.filePath}`);
      r.issues.forEach(issue => {
        if (issue.type === 'missing') {
          console.log(`   ❌ Section ${issue.section} manquante: "${issue.title}"`);
        } else if (issue.type === 'order') {
          console.log(`   ⚠️  Section ${issue.section} mal ordonnée: "${issue.title}" (ligne ${issue.line}, attendu: ${issue.expected})`);
        } else if (issue.type === 'duplicate') {
          console.log(`   🔄 Sections dupliquées: ${issue.sections.join(', ')}`);
        }
      });
      console.log('');
    });
  }
}

main();



