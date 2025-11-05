import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixArticleStructure(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let fixedContent = content;
  
  // Supprimer les sections non standardisées (6-9)
  const nonStandardSections = [
    /^##\s+6\.\s+BONNES\s+PRATIQUES[\s\S]*?(?=^##\s+[0-9]|$)/gm,
    /^##\s+7\.\s+CONCLUSION[\s\S]*?(?=^##\s+[0-9]|$)/gm,
    /^##\s+8\.\s+ÉLÉMENTS[\s\S]*?(?=^##\s+[0-9]|$)/gm,
    /^##\s+9\.\s+GLOSSAIRE[\s\S]*?(?=^##\s+[0-9]|$)/gm
  ];
  
  nonStandardSections.forEach(pattern => {
    fixedContent = fixedContent.replace(pattern, '');
  });
  
  // Supprimer les doublons de sections
  const sectionPattern = /^##\s+([0-9]\.\s+[^\n]+)/gm;
  const sections = [];
  let lastIndex = 0;
  
  fixedContent.replace(sectionPattern, (match, title, offset) => {
    const sectionNum = match.match(/^##\s+([0-9])/);
    if (sectionNum) {
      const num = sectionNum[1];
      if (sections.find(s => s.num === num && s.title === title.trim())) {
        // Doublon trouvé, supprimer
        const nextMatch = fixedContent.substring(offset).match(/^##\s+/m);
        const endIndex = nextMatch ? offset + nextMatch.index : fixedContent.length;
        fixedContent = fixedContent.substring(0, offset) + fixedContent.substring(endIndex);
      } else {
        sections.push({ num, title: title.trim(), offset });
      }
    }
    return match;
  });
  
  // S'assurer que la section 5. ARTICLES ANNEXES vient après 5. DÉFIS ET SOLUTIONS
  const articlesAnnexesPattern = /^##\s+5\.\s+ARTICLES\s+ANNEXES/gm;
  const defisPattern = /^##\s+5\.\s+DÉFIS\s+ET\s+SOLUTIONS/gm;
  
  const defisMatch = fixedContent.match(defisPattern);
  const annexesMatches = [...fixedContent.matchAll(articlesAnnexesPattern)];
  
  if (defisMatch && annexesMatches.length > 1) {
    // Garder seulement la première occurrence après DÉFIS ET SOLUTIONS
    const defisIndex = defisMatch.index;
    const defisSection = fixedContent.substring(defisIndex);
    const defisEnd = defisSection.match(/^##\s+[0-9]\.\s+ARTICLES\s+ANNEXES/m);
    
    if (defisEnd) {
      const firstAnnexesIndex = defisIndex + defisEnd.index;
      // Supprimer toutes les autres occurrences
      for (let i = annexesMatches.length - 1; i >= 0; i--) {
        const match = annexesMatches[i];
        if (match.index !== firstAnnexesIndex) {
          const nextMatch = fixedContent.substring(match.index).match(/^##\s+/m);
          const endIndex = nextMatch ? match.index + nextMatch.index : fixedContent.length;
          fixedContent = fixedContent.substring(0, match.index) + fixedContent.substring(endIndex);
        }
      }
    }
  }
  
  // Supprimer les lignes vides multiples
  fixedContent = fixedContent.replace(/\n{4,}/g, '\n\n\n');
  
  return fixedContent;
}

// Corriger l'article gestion-priorites-efficacite.md
const articlePath = path.join(__dirname, '../src/content/articles/productivite-methodes/gestion-priorites-efficacite.md');
const fixedContent = fixArticleStructure(articlePath);
fs.writeFileSync(articlePath, fixedContent, 'utf-8');
console.log('✅ Article corrigé:', articlePath);

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixArticleStructure(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let fixedContent = content;
  
  // Supprimer les sections non standardisées (6-9)
  const nonStandardSections = [
    /^##\s+6\.\s+BONNES\s+PRATIQUES[\s\S]*?(?=^##\s+[0-9]|$)/gm,
    /^##\s+7\.\s+CONCLUSION[\s\S]*?(?=^##\s+[0-9]|$)/gm,
    /^##\s+8\.\s+ÉLÉMENTS[\s\S]*?(?=^##\s+[0-9]|$)/gm,
    /^##\s+9\.\s+GLOSSAIRE[\s\S]*?(?=^##\s+[0-9]|$)/gm
  ];
  
  nonStandardSections.forEach(pattern => {
    fixedContent = fixedContent.replace(pattern, '');
  });
  
  // Supprimer les doublons de sections
  const sectionPattern = /^##\s+([0-9]\.\s+[^\n]+)/gm;
  const sections = [];
  let lastIndex = 0;
  
  fixedContent.replace(sectionPattern, (match, title, offset) => {
    const sectionNum = match.match(/^##\s+([0-9])/);
    if (sectionNum) {
      const num = sectionNum[1];
      if (sections.find(s => s.num === num && s.title === title.trim())) {
        // Doublon trouvé, supprimer
        const nextMatch = fixedContent.substring(offset).match(/^##\s+/m);
        const endIndex = nextMatch ? offset + nextMatch.index : fixedContent.length;
        fixedContent = fixedContent.substring(0, offset) + fixedContent.substring(endIndex);
      } else {
        sections.push({ num, title: title.trim(), offset });
      }
    }
    return match;
  });
  
  // S'assurer que la section 5. ARTICLES ANNEXES vient après 5. DÉFIS ET SOLUTIONS
  const articlesAnnexesPattern = /^##\s+5\.\s+ARTICLES\s+ANNEXES/gm;
  const defisPattern = /^##\s+5\.\s+DÉFIS\s+ET\s+SOLUTIONS/gm;
  
  const defisMatch = fixedContent.match(defisPattern);
  const annexesMatches = [...fixedContent.matchAll(articlesAnnexesPattern)];
  
  if (defisMatch && annexesMatches.length > 1) {
    // Garder seulement la première occurrence après DÉFIS ET SOLUTIONS
    const defisIndex = defisMatch.index;
    const defisSection = fixedContent.substring(defisIndex);
    const defisEnd = defisSection.match(/^##\s+[0-9]\.\s+ARTICLES\s+ANNEXES/m);
    
    if (defisEnd) {
      const firstAnnexesIndex = defisIndex + defisEnd.index;
      // Supprimer toutes les autres occurrences
      for (let i = annexesMatches.length - 1; i >= 0; i--) {
        const match = annexesMatches[i];
        if (match.index !== firstAnnexesIndex) {
          const nextMatch = fixedContent.substring(match.index).match(/^##\s+/m);
          const endIndex = nextMatch ? match.index + nextMatch.index : fixedContent.length;
          fixedContent = fixedContent.substring(0, match.index) + fixedContent.substring(endIndex);
        }
      }
    }
  }
  
  // Supprimer les lignes vides multiples
  fixedContent = fixedContent.replace(/\n{4,}/g, '\n\n\n');
  
  return fixedContent;
}

// Corriger l'article gestion-priorites-efficacite.md
const articlePath = path.join(__dirname, '../src/content/articles/productivite-methodes/gestion-priorites-efficacite.md');
const fixedContent = fixArticleStructure(articlePath);
fs.writeFileSync(articlePath, fixedContent, 'utf-8');
console.log('✅ Article corrigé:', articlePath);

