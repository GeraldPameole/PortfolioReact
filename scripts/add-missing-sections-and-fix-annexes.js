import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const articlesDir = path.join(projectRoot, 'src/content/articles');

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

const DEFAULT_SECTION_CONTENT = {
  5: `### 5.1 Défis Principaux

**Défis identifiés :**

- **Défi 1** : Description du défi principal avec impact mesuré selon les sources fiables (2024).

- **Défi 2** : Description du deuxième défi avec statistiques pertinentes selon les sources fiables (2024).

- **Défi 3** : Description du troisième défi avec données contextuelles selon les sources fiables (2024).

### 5.2 Solutions Éprouvées

**Solutions recommandées :**

1. **Solution 1** : Description de la première solution avec résultats mesurables selon les sources fiables (2024).

2. **Solution 2** : Description de la deuxième solution avec impact démontré selon les sources fiables (2024).

3. **Solution 3** : Description de la troisième solution avec efficacité prouvée selon les sources fiables (2024).`
};

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

function findSectionPosition(content, sectionOrder) {
  const lines = content.split('\n');
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
  
  // Trouver les positions des sections
  const sectionPositions = {};
  for (let i = frontMatterEnd + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^##\s/)) {
      for (const stdSection of STANDARD_SECTIONS) {
        if (stdSection.pattern.test(line)) {
          sectionPositions[stdSection.order] = i;
          break;
        }
      }
    }
  }
  
  // Trouver où insérer la section manquante
  if (sectionOrder === 5) {
    // Insérer après la section 4, avant la section 6
    if (sectionPositions[4] !== undefined && sectionPositions[6] !== undefined) {
      // Trouver la fin de la section 4
      let section4End = sectionPositions[6];
      for (let i = sectionPositions[4] + 1; i < lines.length; i++) {
        if (lines[i].match(/^##\s/)) {
          section4End = i;
          break;
        }
      }
      return section4End;
    } else if (sectionPositions[4] !== undefined) {
      // Section 4 existe mais pas de section 6, insérer à la fin
      return lines.length;
    }
  }
  
  return null;
}

function limitAnnexesToFour(content) {
  // Trouver la section 7. ARTICLES ANNEXES
  const annexesMatch = content.match(/(##\s*7\.\s*ARTICLES\s+ANNEXES[\s\S]*?)(?=##|$)/i);
  if (!annexesMatch) {
    return content;
  }
  
  const annexesSection = annexesMatch[1];
  const annexesContent = annexesMatch[1].replace(/^##\s*7\.\s*ARTICLES\s+ANNEXES\s*/i, '');
  
  // Extraire les articles annexes (format: 1. **[Titre](...))
  const lines = annexesContent.split('\n');
  const annexeItems = [];
  let currentItem = null;
  
  lines.forEach(line => {
    const itemMatch = line.match(/^(\d+)\.\s+\*\*\[/);
    if (itemMatch) {
      if (currentItem) {
        annexeItems.push(currentItem);
      }
      currentItem = { number: parseInt(itemMatch[1]), lines: [line] };
    } else if (currentItem) {
      if (line.trim() || annexeItems.length === 0 || annexeItems[annexeItems.length - 1] !== currentItem) {
        currentItem.lines.push(line);
      }
    }
  });
  
  if (currentItem) {
    annexeItems.push(currentItem);
  }
  
  // Limiter à 4 articles
  if (annexeItems.length > 4) {
    const limitedItems = annexeItems.slice(0, 4);
    const newAnnexesContent = limitedItems.map((item, index) => {
      const newNumber = index + 1;
      return item.lines.map(line => line.replace(/^\d+\./, `${newNumber}.`)).join('\n');
    }).join('\n\n');
    
    const newAnnexesSection = `## 7. ARTICLES ANNEXES\n\n${newAnnexesContent.trim()}`;
    return content.replace(annexesMatch[1], newAnnexesSection);
  }
  
  return content;
}

function addMissingSection(content, sectionOrder) {
  const insertPosition = findSectionPosition(content, sectionOrder);
  if (insertPosition === null) {
    return content;
  }
  
  const lines = content.split('\n');
  const sectionTitle = STANDARD_SECTIONS.find(s => s.order === sectionOrder).title;
  const sectionContent = DEFAULT_SECTION_CONTENT[sectionOrder] || '';
  
  // Insérer la section
  lines.splice(insertPosition, 0, '', sectionTitle, '', sectionContent);
  
  return lines.join('\n');
}

function fixArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let fixedContent = content;
  
  // Vérifier les sections manquantes
  const missingSections = [];
  STANDARD_SECTIONS.forEach(section => {
    if (!section.pattern.test(fixedContent)) {
      if (section.order > 0 && section.order < 7) { // Ne pas ajouter Introduction ou Articles Annexes automatiquement
        missingSections.push(section.order);
      }
    }
  });
  
  // Ajouter les sections manquantes
  missingSections.sort((a, b) => b - a); // Ajouter de la plus haute à la plus basse pour ne pas décaler les positions
  missingSections.forEach(order => {
    fixedContent = addMissingSection(fixedContent, order);
  });
  
  // Limiter les annexes à 4
  fixedContent = limitAnnexesToFour(fixedContent);
  
  if (fixedContent !== content) {
    fs.writeFileSync(filePath, fixedContent, 'utf-8');
    const changes = [];
    if (missingSections.length > 0) {
      changes.push(`${missingSections.length} section(s) ajoutée(s)`);
    }
    if (content.match(/(\d+)\.\s+\*\*\[/g)?.length > 4) {
      changes.push('annexes limitées à 4');
    }
    console.log(`✅ ${path.relative(projectRoot, filePath)}: ${changes.join(', ')}`);
  }
}

// Traiter tous les articles
const articles = getAllMdFiles(articlesDir);
console.log(`📝 Traitement de ${articles.length} articles...\n`);

articles.forEach(article => {
  try {
    fixArticle(article);
  } catch (error) {
    console.error(`❌ ${article}:`, error.message);
  }
});

console.log(`\n✅ Traitement terminé !`);

