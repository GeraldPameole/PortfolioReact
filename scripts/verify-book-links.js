import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname } from 'path';

// Fonction récursive pour lire tous les fichiers .md
function getAllMdFiles(dir, baseDir = dir) {
  const files = [];
  const entries = readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllMdFiles(fullPath, baseDir));
    } else if (extname(entry) === '.md') {
      const relativePath = fullPath.replace(baseDir + '/', '');
      files.push({ path: fullPath, relative: relativePath.replace('.md', '') });
    }
  }
  
  return files;
}

// Lire tous les articles et livres
const booksDir = './src/content/books';
const articlesDir = './src/content/articles';

const books = getAllMdFiles(booksDir);
const articles = getAllMdFiles(articlesDir);

// Extraire les slugs
const bookSlugs = books.map(b => b.relative.split('/').pop());
const articleSlugs = articles.map(a => {
  const parts = a.relative.split('/');
  return parts[parts.length - 1];
});

console.log(`📚 Trouvé ${books.length} livres et ${articles.length} articles\n`);

// Vérifier les liens dans chaque livre
const issues = [];

books.forEach(book => {
  const content = readFileSync(book.path, 'utf-8');
  const bookName = book.relative.split('/').pop();
  
  // Extraire les liens du frontmatter relatedContent
  const frontmatterMatch = content.match(/relatedContent:[\s\S]*?---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[0];
    const urlMatches = frontmatter.matchAll(/url:\s*["'](\/(articles|books)\/([^"'\s]+))/g);
    
    for (const match of urlMatches) {
      const [, fullPath, type, slug] = match;
      const slugs = type === 'articles' ? articleSlugs : bookSlugs;
      
      if (!slugs.includes(slug)) {
        issues.push({
          book: bookName,
          source: 'frontmatter',
          link: fullPath,
          slug: slug,
          type: type === 'articles' ? 'article' : 'book'
        });
      }
    }
  }
  
  // Extraire les liens markdown
  const markdownLinks = content.matchAll(/\[([^\]]+)\]\((\/(articles|books)\/([^\)\s]+))/g);
  for (const match of markdownLinks) {
    const [, title, fullPath, type, slug] = match;
    const slugs = type === 'articles' ? articleSlugs : bookSlugs;
    
    if (!slugs.includes(slug)) {
      issues.push({
        book: bookName,
        source: 'markdown',
        link: fullPath,
        slug: slug,
        type: type === 'articles' ? 'article' : 'book',
        title: title
      });
    }
  }
});

// Afficher les résultats
if (issues.length === 0) {
  console.log('✅ Tous les liens sont valides!\n');
} else {
  console.log(`❌ Trouvé ${issues.length} lien(s) cassé(s):\n`);
  issues.forEach(issue => {
    console.log(`📖 ${issue.book} (${issue.source})`);
    console.log(`   ${issue.link} → ${issue.type} "${issue.slug}" ${issue.title ? '(' + issue.title + ')' : ''}`);
    console.log(`   ❌ Slug non trouvé\n`);
  });
}

// Afficher un résumé des slugs disponibles pour référence
console.log('\n📋 Slugs d\'articles disponibles (premiers 10):');
articleSlugs.slice(0, 10).forEach(slug => {
  console.log(`   - ${slug}`);
});
if (articleSlugs.length > 10) {
  console.log(`   ... et ${articleSlugs.length - 10} autres`);
}

console.log('\n📚 Slugs de livres disponibles:');
bookSlugs.forEach(slug => {
  console.log(`   - ${slug}`);
});



