import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const articlesDir = path.join(projectRoot, 'src/content/articles');

// Récupérer tous les articles
function getAllArticles() {
  const articles = [];
  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.includes('template')) {
        const relativePath = path.relative(articlesDir, fullPath);
        const slug = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
        const fileName = entry.name.replace(/\.md$/, '');
        articles.push({
          slug,
          fileName,
          filePath: fullPath
        });
      }
    }
  }
  walkDir(articlesDir);
  return articles;
}

// Créer un index pour recherche rapide
function createIndex(allArticles) {
  const index = new Map();
  
  // Index par slug complet
  for (const article of allArticles) {
    index.set(article.slug, article);
  }
  
  // Index par nom de fichier (pour trouver les fautes de frappe)
  const fileNameIndex = new Map();
  for (const article of allArticles) {
    const fileName = article.fileName;
    if (!fileNameIndex.has(fileName)) {
      fileNameIndex.set(fileName, []);
    }
    fileNameIndex.get(fileName).push(article);
  }
  
  return { slugIndex: index, fileNameIndex };
}

// Trouver un article par slug ou nom de fichier
function findArticle(slug, index) {
  // Essayer le slug exact
  if (index.slugIndex.has(slug)) {
    return index.slugIndex.get(slug);
  }
  
  // Vérifier si le slug a un domaine dupliqué (ex: developpement-commercial/formation/...)
  const slugParts = slug.split('/');
  if (slugParts.length > 2) {
    // Essayer sans le premier domaine
    const correctedSlug = slugParts.slice(1).join('/');
    if (index.slugIndex.has(correctedSlug)) {
      return index.slugIndex.get(correctedSlug);
    }
  }
  
  // Essayer de trouver par nom de fichier
  const fileName = slugParts[slugParts.length - 1];
  if (index.fileNameIndex.has(fileName)) {
    const matches = index.fileNameIndex.get(fileName);
    if (matches.length === 1) {
      return matches[0];
    }
  }
  
  // Essayer de trouver avec des variations de nom (fautes de frappe)
  for (const [fileName, articles] of index.fileNameIndex.entries()) {
    // Vérifier si le nom de fichier est similaire (distance de Levenshtein simple)
    if (fileName.length > 5 && slugParts[slugParts.length - 1].length > 5) {
      const similarity = calculateSimilarity(fileName, slugParts[slugParts.length - 1]);
      if (similarity > 0.8) {
        if (articles.length === 1) {
          return articles[0];
        }
      }
    }
  }
  
  return null;
}

// Calculer la similarité entre deux chaînes (simple)
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

// Distance de Levenshtein
function levenshteinDistance(str1, str2) {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}

// Corriger les liens dans un article
function fixLinksInArticle(filePath, index) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const fixes = [];
  
  // Trouver la section ARTICLES ANNEXES
  const annexesMatch = content.match(/## 7\.\s*ARTICLES ANNEXES([\s\S]*?)(?=##\s|$)/);
  if (!annexesMatch) {
    return { content, modified: false, fixes: [] };
  }
  
  const annexesSection = annexesMatch[1];
  let newAnnexesSection = annexesSection;
  
  // Extraire tous les liens
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  
  while ((match = linkRegex.exec(annexesSection)) !== null) {
    links.push({
      fullMatch: match[0],
      text: match[1],
      url: match[2].trim(),
      index: match.index
    });
  }
  
  // Traiter chaque lien
  for (const link of links) {
    let url = link.url;
    
    // Ignorer les liens externes
    if (url.startsWith('http') || url.startsWith('mailto') || url.startsWith('#')) {
      continue;
    }
    
    // Vérifier les liens /blog/
    if (url.startsWith('/blog/')) {
      const slug = url.replace('/blog/', '');
      const article = findArticle(slug, index);
      
      if (!article) {
        // Lien cassé, essayer de trouver une correction
        const slugParts = slug.split('/');
        
        // Problème 1: Domaine dupliqué
        if (slugParts.length > 2) {
          const correctedSlug = slugParts.slice(1).join('/');
          const correctedArticle = findArticle(correctedSlug, index);
          if (correctedArticle) {
            const newUrl = `/blog/${correctedArticle.slug}`;
            newAnnexesSection = newAnnexesSection.replace(link.fullMatch, `[${link.text}](${newUrl})`);
            modified = true;
            fixes.push({
              original: url,
              corrected: newUrl,
              reason: 'Domaine dupliqué corrigé'
            });
            continue;
          }
        }
        
        // Problème 2: Faute de frappe dans le nom de fichier
        const fileName = slugParts[slugParts.length - 1];
        for (const [file, articles] of index.fileNameIndex.entries()) {
          if (calculateSimilarity(file, fileName) > 0.85) {
            if (articles.length === 1) {
              const newUrl = `/blog/${articles[0].slug}`;
              newAnnexesSection = newAnnexesSection.replace(link.fullMatch, `[${link.text}](${newUrl})`);
              modified = true;
              fixes.push({
                original: url,
                corrected: newUrl,
                reason: `Faute de frappe corrigée (${fileName} → ${file})`
              });
              break;
            }
          }
        }
      } else if (article.slug !== slug) {
        // Le slug existe mais n'est pas exact, corriger
        const newUrl = `/blog/${article.slug}`;
        newAnnexesSection = newAnnexesSection.replace(link.fullMatch, `[${link.text}](${newUrl})`);
        modified = true;
        fixes.push({
          original: url,
          corrected: newUrl,
          reason: 'Slug corrigé'
        });
      }
    }
  }
  
  if (modified) {
    content = content.replace(annexesMatch[0], `## 7. ARTICLES ANNEXES${newAnnexesSection}`);
  }
  
  return { content, modified, fixes };
}

// Main
function main() {
  console.log('🔧 Correction de tous les liens cassés...\n');
  
  const allArticles = getAllArticles();
  const index = createIndex(allArticles);
  
  console.log(`📚 ${allArticles.length} articles trouvés\n`);
  
  // Récupérer tous les dossiers
  const domains = fs.readdirSync(articlesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
  
  const report = {
    total: 0,
    fixed: 0,
    totalFixes: 0,
    issues: []
  };
  
  for (const domain of domains) {
    const domainDir = path.join(articlesDir, domain);
    const files = fs.readdirSync(domainDir)
      .filter(f => f.endsWith('.md') && !f.includes('template'))
      .map(f => path.join(domainDir, f));
    
    if (files.length === 0) continue;
    
    console.log(`📁 ${domain} (${files.length} article(s))`);
    
    for (const file of files) {
      const result = fixLinksInArticle(file, index);
      const fileName = path.basename(file);
      report.total++;
      
      if (result.modified) {
        fs.writeFileSync(file, result.content, 'utf8');
        report.fixed++;
        report.totalFixes += result.fixes.length;
        
        console.log(`  ✅ ${fileName} - ${result.fixes.length} lien(s) corrigé(s)`);
        for (const fix of result.fixes) {
          console.log(`     ${fix.original} → ${fix.corrected} (${fix.reason})`);
        }
      } else {
        console.log(`  ✓ ${fileName} - OK`);
      }
    }
    console.log('');
  }
  
  console.log('='.repeat(70));
  console.log('✅ CORRECTION TERMINÉE');
  console.log('='.repeat(70));
  console.log(`   Articles analysés: ${report.total}`);
  console.log(`   Articles modifiés: ${report.fixed}`);
  console.log(`   Liens corrigés: ${report.totalFixes}`);
  console.log('='.repeat(70) + '\n');
  
  return report;
}

main();



