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

// Obtenir tous les slugs existants
const articlesDir = './src/content/articles';
const existingArticles = getAllMdFiles(articlesDir);

// Extraire tous les articles référencés dans les livres
const booksDir = './src/content/books';
const bookFiles = fs.readdirSync(booksDir).filter(f => f.endsWith('.md'));

const referencedArticles = new Map(); // slug -> {title, book, source}

bookFiles.forEach(bookFile => {
  const content = fs.readFileSync(path.join(booksDir, bookFile), 'utf-8');
  const bookName = bookFile.replace('.md', '');
  
  // Extraire les liens markdown
  const markdownLinks = content.matchAll(/\[([^\]]+)\]\((\/articles\/([^\)]+))/g);
  for (const match of markdownLinks) {
    const [, title, , slug] = match;
    const cleanSlug = slug.trim();
    if (!referencedArticles.has(cleanSlug)) {
      referencedArticles.set(cleanSlug, { title: title.trim(), book: bookName, source: 'markdown' });
    }
  }
  
  // Extraire les liens du frontmatter
  const frontmatterMatch = content.match(/relatedContent:[\s\S]*?---/);
  if (frontmatterMatch) {
    const urlMatches = frontmatterMatch[0].matchAll(/url:\s*['\"]\/articles\/([^'\"\s]+)/g);
    const titles = [...frontmatterMatch[0].matchAll(/title:\s*['\"]([^'\"\n]+)/g)].map(m => m[1]);
    let titleIndex = 0;
    
    for (const match of urlMatches) {
      const slug = match[1].trim();
      const title = titles[titleIndex] || slug;
      if (!referencedArticles.has(slug)) {
        referencedArticles.set(slug, { title, book: bookName, source: 'frontmatter' });
      }
      titleIndex++;
    }
  }
});

console.log('📚 Articles référencés dans les livres:\n');
const missing = [];
const found = [];

referencedArticles.forEach((info, slug) => {
  if (existingArticles.includes(slug)) {
    found.push({ slug, ...info });
    console.log(`✅ ${slug} - Référencé dans "${info.book}"`);
  } else {
    missing.push({ slug, ...info });
    console.log(`❌ ${slug} - MANQUANT (référencé dans "${info.book}": "${info.title}")`);
  }
});

console.log(`\n📊 Résumé:`);
console.log(`   Total référencés: ${referencedArticles.size}`);
console.log(`   Existants: ${found.length}`);
console.log(`   Manquants: ${missing.length}\n`);

if (missing.length > 0) {
  console.log('📝 Articles à créer:\n');
  missing.forEach(({ slug, title, book }) => {
    console.log(`   - ${slug}: "${title}" (référencé dans ${book})`);
  });
  
  // Exporter pour utilisation (si besoin)
  // export { missing };
}

if (missing.length === 0) {
  console.log('✅ Tous les articles référencés existent!\n');
}

