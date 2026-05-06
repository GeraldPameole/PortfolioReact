import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const articlesDir = path.join(projectRoot, 'src/content/articles');

// Structure standard attendue
const STANDARD_SECTIONS = [
  { pattern: /^##\s*Introduction\s*$/i, order: 0, title: '## Introduction' },
  { pattern: /^##\s*1\.\s*FONDAMENTAUX\s+DU\s+SUJET\s*$/i, order: 1, title: '## 1. FONDAMENTAUX DU SUJET' },
  { pattern: /^##\s*2\.\s*ANALYSE\s+APPROFONDIE\s*$/i, order: 2, title: '## 2. ANALYSE APPROFONDIE' },
  { pattern: /^##\s*3\.\s*STRATÉGIES\s+ET\s+MÉTHODOLOGIES\s*$/i, order: 3, title: '## 3. STRATÉGIES ET MÉTHODOLOGIES' },
  { pattern: /^##\s*4\.\s*OUTILS\s+ET\s+TECHNOLOGIES\s*$/i, order: 4, title: '## 4. OUTILS ET TECHNOLOGIES' },
  { pattern: /^##\s*5\.\s*DÉFIS\s+ET\s+SOLUTIONS\s*$/i, order: 5, title: '## 5. DÉFIS ET SOLUTIONS' },
  { pattern: /^##\s*6\.\s*SOURCES\s+ET\s+RÉFÉRENCES\s*$/i, order: 6, title: '## 6. SOURCES ET RÉFÉRENCES' },
  { pattern: /^##\s*7\.\s*ARTICLES\s+ANNEXES\s*$/i, order: 7, title: '## 7. ARTICLES ANNEXES' }
];

// Sections à supprimer (non standardisées)
const SECTIONS_TO_REMOVE = [
  /^##\s*6\.\s*BONNES\s+PRATIQUES/i,
  /^##\s*7\.\s*CONCLUSION/i,
  /^##\s*Paroles\s+d'Experts/i,
  /^##\s*Métriques\s+de\s+Performance/i,
  /^##\s*Méthodologies\s+Validées/i,
  /^##\s*Glossaire/i,
  /^##\s*Articles\s+Connexes/i,
  /^##\s*Perspectives\s+d'Avenir/i,
  /^##\s*Tendances\s+et\s+Évolutions/i,
  /^##\s*8\./i,
  /^##\s*9\./i,
  /^##\s*10\./i
];

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

function extractAllSections(content) {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = null;
  let currentContent = [];
  let inFrontMatter = false;
  let frontMatterEnd = 0;
  
  // Trouver la fin du front matter
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (inFrontMatter) {
        frontMatterEnd = i;
        break;
      } else {
        inFrontMatter = true;
      }
    }
  }
  
  // Extraire TOUTES les sections après le front matter
  for (let i = frontMatterEnd + 1; i < lines.length; i++) {
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
      
      // Vérifier si c'est une section à supprimer
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
      }
      
      // Identifier la section standard
      let matched = false;
      let sectionOrder = null;
      let sectionTitle = null;
      
      for (const stdSection of STANDARD_SECTIONS) {
        if (stdSection.pattern.test(line)) {
          sectionOrder = stdSection.order;
          sectionTitle = stdSection.title;
          matched = true;
          break;
        }
      }
      
      if (matched) {
        currentSection = {
          order: sectionOrder,
          title: sectionTitle,
          originalTitle: line.replace(/^##\s+/, '').trim(),
          startLine: i
        };
        currentContent = [];
      } else {
        // Section non standard mais à garder (peut-être une sous-section comme 4.1)
        if (currentSection !== null) {
          currentContent.push(line);
        }
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

function fixArticleStructure(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Séparer le front matter du contenu
  const frontMatterMatch = content.match(/^---\n[\s\S]*?\n---\n/);
  if (!frontMatterMatch) {
    console.log(`⚠️  Pas de front matter trouvé dans ${filePath}`);
    return;
  }
  
  const frontMatter = frontMatterMatch[0];
  const body = content.substring(frontMatterMatch[0].length);
  
  // Extraire TOUTES les sections
  const allSections = extractAllSections(body);
  
  // Grouper par ordre et garder la PREMIÈRE occurrence de chaque section
  const sectionsByOrder = {};
  allSections.forEach(section => {
    if (!sectionsByOrder[section.order] || section.startLine < sectionsByOrder[section.order].startLine) {
      sectionsByOrder[section.order] = section;
    }
  });
  
  // Convertir en tableau et trier par ordre
  const finalSections = Object.values(sectionsByOrder).sort((a, b) => a.order - b.order);
  
  // Reconstruire le contenu
  let newBody = '';
  
  // Ajouter toutes les sections dans l'ordre
  finalSections.forEach(section => {
    newBody += section.title + '\n\n' + section.content.trim() + '\n\n';
  });
  
  // Nettoyer les lignes vides multiples
  newBody = newBody.replace(/\n{3,}/g, '\n\n');
  
  // Reconstruire le fichier
  const newContent = frontMatter + newBody.trim() + '\n';
  
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`✅ Corrigé: ${path.relative(projectRoot, filePath)}`);
}

// Traiter tous les articles
const articles = getAllMdFiles(articlesDir);

console.log(`📝 Traitement de ${articles.length} articles...\n`);

articles.forEach(article => {
  try {
    fixArticleStructure(article);
  } catch (error) {
    console.error(`❌ Erreur avec ${article}:`, error.message);
  }
});

console.log(`\n✅ Traitement terminé !`);

