import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const articlesDir = path.join(projectRoot, 'src/content/articles');

function getAllMdFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllMdFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function detectRedundancy(content) {
  const issues = [];
  
  // Détecter les sections dupliquées
  const sections = content.match(/^##\s+(.+)$/gm);
  if (sections) {
    const sectionTitles = sections.map(s => s.replace(/^##\s+/, '').trim());
    const duplicates = sectionTitles.filter((title, index) => sectionTitles.indexOf(title) !== index);
    if (duplicates.length > 0) {
      issues.push({ type: 'duplicate_section', titles: [...new Set(duplicates)] });
    }
  }
  
  // Détecter les sous-sections dupliquées
  const subSections = content.match(/^###\s+(.+)$/gm);
  if (subSections) {
    const subSectionTitles = subSections.map(s => s.replace(/^###\s+/, '').trim());
    const duplicates = subSectionTitles.filter((title, index) => subSectionTitles.indexOf(title) !== index);
    if (duplicates.length > 0) {
      issues.push({ type: 'duplicate_subsection', titles: [...new Set(duplicates)] });
    }
  }
  
  // Détecter les paragraphes identiques
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 50);
  const paragraphMap = new Map();
  paragraphs.forEach((para, index) => {
    const key = para.trim().substring(0, 100);
    if (paragraphMap.has(key)) {
      paragraphMap.get(key).push(index);
    } else {
      paragraphMap.set(key, [index]);
    }
  });
  
  const duplicateParagraphs = Array.from(paragraphMap.entries())
    .filter(([key, indices]) => indices.length > 1);
  if (duplicateParagraphs.length > 0) {
    issues.push({ type: 'duplicate_paragraph', count: duplicateParagraphs.length });
  }
  
  // Détecter les listes dupliquées
  const lists = content.match(/^[-*+]\s+.+$/gm);
  if (lists) {
    const listItems = lists.map(l => l.trim());
    const duplicates = listItems.filter((item, index) => listItems.indexOf(item) !== index);
    if (duplicates.length > 0) {
      issues.push({ type: 'duplicate_list_item', count: duplicates.length });
    }
  }
  
  return issues;
}

function checkSectionOrder(content) {
  const issues = [];
  
  // Vérifier l'ordre des sections principales (1-7)
  const expectedSections = [
    '1. FONDAMENTAUX DU SUJET',
    '2. ANALYSE APPROFONDIE',
    '3. STRATÉGIES ET MÉTHODOLOGIES',
    '4. OUTILS ET TECHNOLOGIES',
    '5. DÉFIS ET SOLUTIONS',
    '6. SOURCES ET RÉFÉRENCES',
    '7. ARTICLES ANNEXES'
  ];
  
  const foundSections = [];
  expectedSections.forEach(section => {
    const regex = new RegExp(`^##\\s+${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm');
    if (regex.test(content)) {
      foundSections.push(section);
    }
  });
  
  // Vérifier l'ordre
  for (let i = 0; i < foundSections.length; i++) {
    const expectedIndex = expectedSections.indexOf(foundSections[i]);
    if (expectedIndex !== i) {
      issues.push({ type: 'wrong_order', section: foundSections[i], expected: expectedIndex, actual: i });
    }
  }
  
  // Vérifier les sections manquantes
  const missingSections = expectedSections.filter(s => !foundSections.includes(s));
  if (missingSections.length > 0) {
    issues.push({ type: 'missing_sections', sections: missingSections });
  }
  
  return issues;
}

function checkContentPlacement(content) {
  const issues = [];
  
  // Vérifier que les concepts clés sont dans la section 1.1
  const section1_1 = content.match(/##\s+1\.\s+FONDAMENTAUX DU SUJET[\s\S]*?###\s+1\.1[\s\S]*?(?=###|##|$)/);
  if (section1_1) {
    const sectionContent = section1_1[0];
    if (!sectionContent.includes('Concepts clés') && !sectionContent.includes('Concepts')) {
      issues.push({ type: 'missing_concepts', section: '1.1' });
    }
  }
  
  // Vérifier que les exemples sont dans la section 1.1
  if (section1_1) {
    const sectionContent = section1_1[0];
    if (!sectionContent.includes('Exemples concrets') && !sectionContent.includes('Exemple')) {
      issues.push({ type: 'missing_examples', section: '1.1' });
    }
  }
  
  // Vérifier que les bénéfices sont dans la section 1.2
  const section1_2 = content.match(/##\s+1\.\s+FONDAMENTAUX DU SUJET[\s\S]*?###\s+1\.2[\s\S]*?(?=###|##|$)/);
  if (section1_2) {
    const sectionContent = section1_2[0];
    if (!sectionContent.includes('Bénéfices mesurables') && !sectionContent.includes('Bénéfice')) {
      issues.push({ type: 'missing_benefits', section: '1.2' });
    }
  }
  
  // Vérifier que les composants sont dans la section 2.1
  const section2_1 = content.match(/##\s+2\.\s+ANALYSE APPROFONDIE[\s\S]*?###\s+2\.1[\s\S]*?(?=###|##|$)/);
  if (section2_1) {
    const sectionContent = section2_1[0];
    if (!sectionContent.includes('Composants') && !sectionContent.includes('Éléments constitutifs')) {
      issues.push({ type: 'missing_components', section: '2.1' });
    }
  }
  
  return issues;
}

function removeRedundancy(content) {
  let newContent = content;
  
  // Supprimer les sections dupliquées (garder la première)
  const sectionMatches = [...content.matchAll(/^##\s+(.+)$/gm)];
  const seenSections = new Set();
  sectionMatches.forEach((match, index) => {
    const title = match[1].trim();
    if (seenSections.has(title)) {
      // Trouver et supprimer la section dupliquée
      const sectionStart = match.index;
      const nextSection = sectionMatches[index + 1];
      const sectionEnd = nextSection ? nextSection.index : content.length;
      const duplicateSection = content.substring(sectionStart, sectionEnd);
      newContent = newContent.replace(duplicateSection, '');
    } else {
      seenSections.add(title);
    }
  });
  
  // Supprimer les paragraphes dupliqués (garder le premier)
  const paragraphs = newContent.split(/\n\n+/);
  const seenParagraphs = new Set();
  const uniqueParagraphs = paragraphs.filter(para => {
    const key = para.trim().substring(0, 100);
    if (seenParagraphs.has(key)) {
      return false;
    }
    seenParagraphs.add(key);
    return true;
  });
  newContent = uniqueParagraphs.join('\n\n');
  
  // Supprimer les éléments de liste dupliqués
  const lines = newContent.split('\n');
  const seenListItems = new Set();
  const uniqueLines = lines.filter(line => {
    if (line.match(/^[-*+]\s+/)) {
      const key = line.trim();
      if (seenListItems.has(key)) {
        return false;
      }
      seenListItems.add(key);
    }
    return true;
  });
  newContent = uniqueLines.join('\n');
  
  // Supprimer les sous-titres "Comparatif d'Outils" dupliqués
  newContent = newContent.replace(
    /### Comparatif d'Outils - Retour d'Expérience Personnel\s*\n\s*Ayant testé[^#]*### Comparatif d'Outils - Retour d'Expérience Personnel\s*\n\s*Ayant testé/g,
    '### Comparatif d\'Outils - Retour d\'Expérience Personnel\n\nAyant testé'
  );
  
  return newContent;
}

function fixSectionOrder(content) {
  // Réorganiser les sections dans le bon ordre si nécessaire
  const sections = {
    '1. FONDAMENTAUX DU SUJET': null,
    '2. ANALYSE APPROFONDIE': null,
    '3. STRATÉGIES ET MÉTHODOLOGIES': null,
    '4. OUTILS ET TECHNOLOGIES': null,
    '5. DÉFIS ET SOLUTIONS': null,
    '6. SOURCES ET RÉFÉRENCES': null,
    '7. ARTICLES ANNEXES': null,
    '8. LIVRES RECOMMANDÉS': null
  };
  
  // Extraire chaque section
  Object.keys(sections).forEach(sectionTitle => {
    const regex = new RegExp(`(##\\s+${sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?)(?=##\\s+|$)`, 'm');
    const match = content.match(regex);
    if (match) {
      sections[sectionTitle] = match[1];
    }
  });
  
  // Reconstruire le contenu dans le bon ordre
  const orderedContent = [];
  Object.keys(sections).forEach(sectionTitle => {
    if (sections[sectionTitle]) {
      orderedContent.push(sections[sectionTitle]);
    }
  });
  
  // Garder l'introduction et le frontmatter
  const introMatch = content.match(/^---[\s\S]*?---\s*\n\n([\s\S]*?)(?=##\s+1\.|$)/);
  if (introMatch) {
    return introMatch[0] + '\n' + orderedContent.join('\n\n');
  }
  
  return content;
}

const articles = getAllMdFiles(articlesDir);
console.log(`🔍 Vérification de ${articles.length} articles pour redondances et structure...\n`);

let fixed = 0;
let totalIssues = 0;

articles.forEach(article => {
  try {
    const content = fs.readFileSync(article, 'utf-8');
    const relativePath = path.relative(projectRoot, article);
    
    const redundancyIssues = detectRedundancy(content);
    const orderIssues = checkSectionOrder(content);
    const placementIssues = checkContentPlacement(content);
    
    const allIssues = [...redundancyIssues, ...orderIssues, ...placementIssues];
    
    if (allIssues.length > 0) {
      totalIssues += allIssues.length;
      let newContent = content;
      
      // Corriger les redondances
      newContent = removeRedundancy(newContent);
      
      // Corriger l'ordre des sections
      if (orderIssues.length > 0) {
        newContent = fixSectionOrder(newContent);
      }
      
      if (newContent !== content) {
        fs.writeFileSync(article, newContent, 'utf-8');
        fixed++;
        console.log(`✅ ${relativePath} - ${allIssues.length} problème(s) corrigé(s)`);
      } else {
        console.log(`⚠️  ${relativePath} - ${allIssues.length} problème(s) détecté(s) mais non corrigé(s)`);
      }
    }
  } catch (error) {
    console.error(`❌ ${article}:`, error.message);
  }
});

console.log(`\n✅ ${fixed} articles corrigés sur ${articles.length}`);
console.log(`📊 ${totalIssues} problèmes détectés au total`);

