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

// Extraire tous les liens vers les articles dans les livres
const booksDir = './src/content/books';
const bookFiles = fs.readdirSync(booksDir).filter(f => f.endsWith('.md'));

console.log('🔍 Validation finale des liens "Lectures complémentaires"\n');

const allLinks = new Map(); // url -> {book, title, source, slug}

bookFiles.forEach(bookFile => {
  const bookPath = path.join(booksDir, bookFile);
  const content = fs.readFileSync(bookPath, 'utf-8');
  const bookSlug = bookFile.replace('.md', '');
  
  // Extraire les liens markdown (section "Lectures complémentaires")
  const markdownLinks = [...content.matchAll(/\[([^\]]+)\]\((\/articles\/([^\)\s]+))/g)];
  markdownLinks.forEach(match => {
    const [, title, fullUrl, slug] = match;
    const cleanSlug = slug.trim();
    const key = fullUrl.trim();
    
    if (!allLinks.has(key)) {
      allLinks.set(key, {
        book: bookSlug,
        title: title.trim(),
        slug: cleanSlug,
        url: fullUrl.trim(),
        source: 'markdown (Lectures complémentaires)'
      });
    }
  });
  
  // Extraire les liens du frontmatter relatedContent
  const frontmatterMatch = content.match(/relatedContent:[\s\S]*?---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[0];
    const urlMatches = [...frontmatter.matchAll(/url:\s*["'](\/articles\/([^"'\s]+))/g)];
    const titleMatches = [...frontmatter.matchAll(/title:\s*["']([^"'\n]+)/g)];
    
    urlMatches.forEach((urlMatch, index) => {
      const [, fullUrl, slug] = urlMatch;
      const cleanSlug = slug.trim();
      const key = fullUrl.trim();
      const title = titleMatches[index] ? titleMatches[index][1] : cleanSlug;
      
      if (!allLinks.has(key)) {
        allLinks.set(key, {
          book: bookSlug,
          title: title,
          slug: cleanSlug,
          url: fullUrl.trim(),
          source: 'frontmatter (relatedContent)'
        });
      }
    });
  }
});

// Vérifier chaque lien
console.log(`📊 Analyse de ${allLinks.size} liens uniques\n`);

const validLinks = [];
const invalidLinks = [];

allLinks.forEach((linkInfo, url) => {
  const articleExists = allArticleSlugs.includes(linkInfo.slug);
  
  if (articleExists) {
    validLinks.push(linkInfo);
  } else {
    invalidLinks.push(linkInfo);
  }
});

// Afficher les résultats
if (invalidLinks.length === 0) {
  console.log('✅ TOUS LES LIENS SONT VALIDES !\n');
  console.log('📋 Détail des liens vérifiés:\n');
  
  // Grouper par livre
  const linksByBook = new Map();
  validLinks.forEach(link => {
    if (!linksByBook.has(link.book)) {
      linksByBook.set(link.book, []);
    }
    linksByBook.get(link.book).push(link);
  });
  
  linksByBook.forEach((links, book) => {
    console.log(`📚 ${book}:`);
    links.forEach(link => {
      console.log(`   ✓ ${link.url} → "${link.title}"`);
      console.log(`     (${link.source})`);
    });
    console.log('');
  });
  
  console.log('✅ Résultat final:');
  console.log(`   - ${validLinks.length} liens valides`);
  console.log(`   - ${invalidLinks.length} liens cassés`);
  console.log(`   - Routes disponibles: /articles/{slug} ✅`);
  console.log(`   - Objectif 0 erreur 404: ✅ ATTEINT\n`);
} else {
  console.log('❌ PROBLÈMES DÉTECTÉS:\n');
  invalidLinks.forEach(link => {
    console.log(`❌ ${link.book}: "${link.title}"`);
    console.log(`   URL: ${link.url}`);
    console.log(`   Slug: ${link.slug} → ARTICLE MANQUANT\n`);
  });
}



