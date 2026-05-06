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

function extractSectionsWithContent(content) {
  const lines = content.split('\n');
  const sections = [];
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
  
  // Trouver toutes les sections ##
  const sectionHeaders = [];
  for (let i = frontMatterEnd + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^##\s/)) {
      sectionHeaders.push({ line: i, text: line });
    }
  }
  
  // Extraire le contenu de chaque section
  for (let i = 0; i < sectionHeaders.length; i++) {
    const header = sectionHeaders[i];
    const nextHeader = sectionHeaders[i + 1];
    const startLine = header.line;
    const endLine = nextHeader ? nextHeader.line : lines.length;
    
    // Extraire le contenu de cette section
    const sectionContent = lines.slice(startLine + 1, endLine).join('\n');
    
    // Vérifier si c'est une section à supprimer
    let shouldRemove = false;
    for (const removePattern of SECTIONS_TO_REMOVE) {
      if (removePattern.test(header.text)) {
        shouldRemove = true;
        break;
      }
    }
    
    if (!shouldRemove) {
      // Identifier la section standard
      let sectionOrder = null;
      let sectionTitle = null;
      
      for (const stdSection of STANDARD_SECTIONS) {
        if (stdSection.pattern.test(header.text)) {
          sectionOrder = stdSection.order;
          sectionTitle = stdSection.title;
          break;
        }
      }
      
      // Si c'est une section standard, l'ajouter
      if (sectionOrder !== null) {
        sections.push({
          order: sectionOrder,
          title: sectionTitle,
          content: sectionContent.trim(),
          startLine: startLine
        });
      }
    }
  }
  
  return { frontMatter: lines.slice(0, frontMatterEnd + 1).join('\n'), sections };
}

function limitAnnexesToFour(content) {
  // Trouver la section 7. ARTICLES ANNEXES
  const annexesMatch = content.match(/(##\s*7\.\s*ARTICLES\s+ANNEXES[\s\S]*?)(?=##|$)/i);
  if (!annexesMatch) {
    return content;
  }
  
  const annexesSection = annexesMatch[1];
  const annexesContent = annexesSection.replace(/^##\s*7\.\s*ARTICLES\s+ANNEXES\s*/i, '');
  
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
      currentItem.lines.push(line);
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
  
  // Trouver les positions des sections existantes
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
  
  // Si la section existe déjà, ne rien faire
  if (sectionPositions[sectionOrder] !== undefined) {
    return content;
  }
  
  // Trouver où insérer la section manquante
  let insertPosition = null;
  
  if (sectionOrder === 5) {
    // Insérer après la section 4, avant la section 6
    if (sectionPositions[4] !== undefined) {
      // Trouver la fin de la section 4
      let section4End = sectionPositions[6] || lines.length;
      for (let i = sectionPositions[4] + 1; i < lines.length; i++) {
        if (lines[i].match(/^##\s/)) {
          section4End = i;
          break;
        }
      }
      insertPosition = section4End;
    } else if (sectionPositions[6] !== undefined) {
      // Pas de section 4, insérer avant la section 6
      insertPosition = sectionPositions[6];
    } else {
      // Pas de section 4 ni 6, insérer à la fin
      insertPosition = lines.length;
    }
  }
  
  if (insertPosition === null) {
    return content;
  }
  
  // Insérer la section
  const sectionTitle = STANDARD_SECTIONS.find(s => s.order === sectionOrder).title;
  const sectionContent = DEFAULT_SECTION_CONTENT[sectionOrder] || '';
  
  lines.splice(insertPosition, 0, '', sectionTitle, '', sectionContent);
  
  return lines.join('\n');
}

function fixArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let fixedContent = content;
  
  // Limiter les annexes à 4
  fixedContent = limitAnnexesToFour(fixedContent);
  
  // Vérifier et ajouter les sections manquantes
  const { sections } = extractSectionsWithContent(fixedContent);
  const existingOrders = sections.map(s => s.order);
  
  // Ajouter la section 5 si elle manque
  if (!existingOrders.includes(5)) {
    fixedContent = addMissingSection(fixedContent, 5);
  }
  
  // Réorganiser les sections dans le bon ordre
  const { frontMatter, sections: finalSections } = extractSectionsWithContent(fixedContent);
  
  // Grouper par ordre et garder la PREMIÈRE occurrence
  const sectionsByOrder = {};
  finalSections.forEach(section => {
    if (!sectionsByOrder[section.order] || section.startLine < sectionsByOrder[section.order].startLine) {
      sectionsByOrder[section.order] = section;
    }
  });
  
  // Convertir en tableau et trier par ordre
  const orderedSections = Object.values(sectionsByOrder).sort((a, b) => a.order - b.order);
  
  // Reconstruire le contenu
  let newBody = '';
  orderedSections.forEach(section => {
    newBody += section.title + '\n\n' + section.content + '\n\n';
  });
  
  // Nettoyer les lignes vides multiples
  newBody = newBody.replace(/\n{3,}/g, '\n\n');
  
  // Limiter à nouveau les annexes (au cas où)
  newBody = limitAnnexesToFour(newBody);
  
  // Reconstruire le fichier
  const newContent = frontMatter + '\n' + newBody.trim() + '\n';
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    const changes = [];
    if (!existingOrders.includes(5) && orderedSections.find(s => s.order === 5)) {
      changes.push('section 5 ajoutée');
    }
    const annexesCount = (newBody.match(/(\d+)\.\s+\*\*\[/g) || []).length;
    if (annexesCount > 4) {
      changes.push(`annexes limitées à 4 (était ${annexesCount})`);
    }
    if (changes.length > 0) {
      console.log(`✅ ${path.relative(projectRoot, filePath)}: ${changes.join(', ')}`);
    }
  }
}

// Traiter tous les articles
const articles = getAllMdFiles(articlesDir);
console.log(`📝 Traitement de ${articles.length} articles...\n`);

let fixedCount = 0;
articles.forEach(article => {
  try {
    const before = fs.readFileSync(article, 'utf-8');
    fixArticle(article);
    const after = fs.readFileSync(article, 'utf-8');
    if (before !== after) {
      fixedCount++;
    }
  } catch (error) {
    console.error(`❌ ${article}:`, error.message);
  }
});

console.log(`\n✅ ${fixedCount} articles modifiés sur ${articles.length} !`);

