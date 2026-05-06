import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const articlesDir = path.join(projectRoot, 'src/content/articles');

// Récupérer tous les articles avec leur slug et nom de fichier
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
          domain: slug.split('/')[0],
          filePath: fullPath
        });
      }
    }
  }
  walkDir(articlesDir);
  return articles;
}

// Créer un index complet pour recherche rapide
function createIndex(allArticles) {
  const index = {
    bySlug: new Map(),
    byFileName: new Map(),
    byDomain: new Map()
  };
  
  for (const article of allArticles) {
    // Index par slug complet
    index.bySlug.set(article.slug, article);
    
    // Index par nom de fichier
    if (!index.byFileName.has(article.fileName)) {
      index.byFileName.set(article.fileName, []);
    }
    index.byFileName.get(article.fileName).push(article);
    
    // Index par domaine
    if (!index.byDomain.has(article.domain)) {
      index.byDomain.set(article.domain, []);
    }
    index.byDomain.get(article.domain).push(article);
  }
  
  return index;
}

// Trouver un article par slug (avec correction automatique)
function findArticle(slug, index, sourceDomain) {
  const slugParts = slug.split('/');
  
  // RÈGLE: Un slug doit avoir exactement 2 parties: domaine/article-name
  // Si le slug a plus de 2 parties, il y a un problème
  
  // 1. Essayer le slug exact (si c'est déjà correct)
  if (slugParts.length === 2 && index.bySlug.has(slug)) {
    return { article: index.bySlug.get(slug), reason: 'Slug correct' };
  }
  
  // 2. Problème: Domaine dupliqué (ex: developpement-commercial/developpement-commercial/article-name)
  if (slugParts.length > 2 && slugParts[0] === slugParts[1]) {
    // Retirer le premier domaine dupliqué
    const correctedSlug = slugParts.slice(1).join('/');
    if (index.bySlug.has(correctedSlug)) {
      return { article: index.bySlug.get(correctedSlug), reason: 'Domaine dupliqué corrigé' };
    }
  }
  
  // 3. Problème: Mauvais domaine (ex: developpement-commercial/formation/article-name alors que l'article est dans formation/)
  if (slugParts.length > 2 && slugParts[0] !== slugParts[1]) {
    // Le deuxième élément est probablement le vrai domaine
    const correctedSlug = slugParts.slice(1).join('/');
    if (index.bySlug.has(correctedSlug)) {
      return { article: index.bySlug.get(correctedSlug), reason: 'Mauvais domaine corrigé' };
    }
    
    // Sinon, essayer de trouver par nom de fichier
    const fileName = slugParts[slugParts.length - 1];
    const matches = index.byFileName.get(fileName);
    if (matches && matches.length === 1) {
      return { article: matches[0], reason: 'Trouvé par nom de fichier (mauvais domaine)' };
    }
  }
  
  // 4. Problème: Slug avec plus de 2 parties mais pas de domaine dupliqué
  if (slugParts.length > 2) {
    // Essayer de trouver par nom de fichier
    const fileName = slugParts[slugParts.length - 1];
    const matches = index.byFileName.get(fileName);
    if (matches && matches.length === 1) {
      return { article: matches[0], reason: 'Slug avec trop de parties - corrigé par nom de fichier' };
    }
  }
  
  // 5. Essayer de trouver par nom de fichier uniquement
  const fileName = slugParts[slugParts.length - 1];
  const matches = index.byFileName.get(fileName);
  if (matches && matches.length === 1) {
    return { article: matches[0], reason: 'Trouvé par nom de fichier' };
  }
  
  // 6. Essayer de trouver dans le domaine source
  if (sourceDomain && index.byDomain.has(sourceDomain)) {
    const domainArticles = index.byDomain.get(sourceDomain);
    const match = domainArticles.find(a => a.fileName === fileName);
    if (match) {
      return { article: match, reason: 'Trouvé dans le domaine source' };
    }
  }
  
  return null;
}

// Corriger les liens dans un article
function fixAnnexesLinks(filePath, index, sourceDomain) {
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
  
  // Extraire tous les liens markdown
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
    
    // Traiter les liens /blog/
    if (url.startsWith('/blog/')) {
      const slug = url.replace('/blog/', '');
      const slugParts = slug.split('/');
      
      // RÈGLE: Un slug doit avoir exactement 2 parties: domaine/article-name
      // Si le slug a plus de 2 parties, il faut le corriger
      
      // Vérifier si le slug a plus de 2 parties (problème de domaine dupliqué ou mauvais domaine)
      if (slugParts.length > 2) {
        const result = findArticle(slug, index, sourceDomain);
        
        if (result && result.article) {
          const correctSlug = result.article.slug;
          const newUrl = `/blog/${correctSlug}`;
          newAnnexesSection = newAnnexesSection.replace(link.fullMatch, `[${link.text}](${newUrl})`);
          modified = true;
          fixes.push({
            original: url,
            corrected: newUrl,
            reason: result.reason
          });
        } else {
          // Essayer de trouver par nom de fichier
          const fileName = slugParts[slugParts.length - 1];
          const matches = index.byFileName.get(fileName);
          
          if (matches && matches.length === 1) {
            const newUrl = `/blog/${matches[0].slug}`;
            newAnnexesSection = newAnnexesSection.replace(link.fullMatch, `[${link.text}](${newUrl})`);
            modified = true;
            fixes.push({
              original: url,
              corrected: newUrl,
              reason: 'Slug avec trop de parties - corrigé par nom de fichier'
            });
          }
        }
      } else {
        // Le slug a 2 parties ou moins, vérifier s'il existe
        const result = findArticle(slug, index, sourceDomain);
        
        if (result && result.article) {
          const correctSlug = result.article.slug;
          if (slug !== correctSlug) {
            const newUrl = `/blog/${correctSlug}`;
            newAnnexesSection = newAnnexesSection.replace(link.fullMatch, `[${link.text}](${newUrl})`);
            modified = true;
            fixes.push({
              original: url,
              corrected: newUrl,
              reason: result.reason
            });
          }
        } else if (!index.bySlug.has(slug)) {
          // Lien introuvable - essayer de trouver une correspondance proche
          const fileName = slugParts[slugParts.length - 1];
          const matches = index.byFileName.get(fileName);
          
          if (matches && matches.length === 1) {
            const newUrl = `/blog/${matches[0].slug}`;
            newAnnexesSection = newAnnexesSection.replace(link.fullMatch, `[${link.text}](${newUrl})`);
            modified = true;
            fixes.push({
              original: url,
              corrected: newUrl,
              reason: 'Lien introuvable - corrigé par nom de fichier'
            });
          }
        }
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
  console.log('🔧 Correction complète et approfondie de tous les liens annexes...\n');
  
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
    fixesByReason: {}
  };
  
  for (const domain of domains) {
    const domainDir = path.join(articlesDir, domain);
    const files = fs.readdirSync(domainDir)
      .filter(f => f.endsWith('.md') && !f.includes('template'))
      .map(f => path.join(domainDir, f));
    
    if (files.length === 0) continue;
    
    console.log(`📁 ${domain} (${files.length} article(s))`);
    
    for (const file of files) {
      const result = fixAnnexesLinks(file, index, domain);
      const fileName = path.basename(file);
      report.total++;
      
      if (result.modified) {
        fs.writeFileSync(file, result.content, 'utf8');
        report.fixed++;
        report.totalFixes += result.fixes.length;
        
        console.log(`  ✅ ${fileName} - ${result.fixes.length} lien(s) corrigé(s)`);
        for (const fix of result.fixes) {
          console.log(`     ${fix.original} → ${fix.corrected} (${fix.reason})`);
          
          // Compter par raison
          if (!report.fixesByReason[fix.reason]) {
            report.fixesByReason[fix.reason] = 0;
          }
          report.fixesByReason[fix.reason]++;
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
  
  if (Object.keys(report.fixesByReason).length > 0) {
    console.log('📊 CORRECTIONS PAR TYPE:\n');
    for (const [reason, count] of Object.entries(report.fixesByReason)) {
      console.log(`   ${reason}: ${count}`);
    }
    console.log('');
  }
  
  return report;
}

main();

