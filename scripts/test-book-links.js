import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fonction récursive pour obtenir tous les fichiers .md
function getAllMdFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllMdFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(file.replace('.md', ''));
    }
  });
  return fileList;
}

// Obtenir tous les slugs d'articles existants
const articlesDir = './src/content/articles';
const allArticleSlugs = getAllMdFiles(articlesDir);

// Extraire tous les articles référencés dans les livres (markdown et frontmatter)
const booksDir = './src/content/books';
const bookFiles = fs.readdirSync(booksDir).filter(f => f.endsWith('.md'));

console.log('🔗 Vérification des liens dans les pages de livres...\n');

const linkIssues = [];
let totalLinksChecked = 0;

bookFiles.forEach(bookFile => {
  const bookPath = path.join(booksDir, bookFile);
  const content = fs.readFileSync(bookPath, 'utf-8');
  const bookSlug = bookFile.replace('.md', '');
  
  // Vérifier les liens dans le contenu markdown (section "Lectures complémentaires")
  const markdownLinks = [...content.matchAll(/\[([^\]]+)\]\((\/articles\/([^\)\s]+))/g)];
  
  markdownLinks.forEach(match => {
    const [, title, fullUrl, slug] = match;
    totalLinksChecked++;
    const cleanSlug = slug.trim();
    
    // Vérifier que l'article existe
    if (!allArticleSlugs.includes(cleanSlug)) {
      linkIssues.push({
        book: bookSlug,
        source: 'markdown (Lectures complémentaires)',
        url: fullUrl,
        slug: cleanSlug,
        title: title.trim(),
        problem: 'Article non trouvé'
      });
      console.log(`❌ ${bookSlug}: Lien vers "${title}"`);
      console.log(`   URL: ${fullUrl}`);
      console.log(`   Slug: ${cleanSlug} → ARTICLE MANQUANT\n`);
    }
  });
  
  // Vérifier les liens dans le frontmatter relatedContent
  const frontmatterMatch = content.match(/relatedContent:[\s\S]*?---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[0];
    const urlMatches = [...frontmatter.matchAll(/url:\s*["'](\/articles\/([^"'\s]+))/g)];
    
    urlMatches.forEach(match => {
      const [, fullUrl, slug] = match;
      totalLinksChecked++;
      const cleanSlug = slug.trim();
      
      if (!allArticleSlugs.includes(cleanSlug)) {
        linkIssues.push({
          book: bookSlug,
          source: 'frontmatter (relatedContent)',
          url: fullUrl,
          slug: cleanSlug,
          problem: 'Article non trouvé'
        });
        console.log(`❌ ${bookSlug}: Lien dans relatedContent`);
        console.log(`   URL: ${fullUrl}`);
        console.log(`   Slug: ${cleanSlug} → ARTICLE MANQUANT\n`);
      }
    });
  }
});

// Résumé
console.log('\n📊 Résumé de la vérification:');
console.log(`   Total de liens vérifiés: ${totalLinksChecked}`);
console.log(`   Liens OK: ${totalLinksChecked - linkIssues.length}`);
console.log(`   Problèmes détectés: ${linkIssues.length}\n`);

if (linkIssues.length === 0) {
  console.log('✅ Tous les liens vers les articles sont valides!');
  console.log('   ✓ Routes /articles/{slug} accessibles');
  console.log('   ✓ Aucun lien 404 détecté\n');
} else {
  console.log(`⚠️  ${linkIssues.length} lien(s) avec problème(s):\n`);
  
  // Grouper par problème
  const missingSlugs = new Set();
  linkIssues.forEach(issue => {
    missingSlugs.add(issue.slug);
  });
  
  console.log('📝 Articles référencés mais absents:');
  Array.from(missingSlugs).forEach(slug => {
    console.log(`   - ${slug}`);
    const bookRefs = linkIssues.filter(i => i.slug === slug).map(i => i.book);
    console.log(`     Référencé dans: ${[...new Set(bookRefs)].join(', ')}`);
  });
}



