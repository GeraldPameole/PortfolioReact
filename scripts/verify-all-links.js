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
      // Le slug Astro est le nom du fichier sans extension
      const slug = entry.replace('.md', '');
      files.push({ path: fullPath, slug });
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
const bookSlugs = books.map(b => b.slug);
const articleSlugs = articles.map(a => a.slug);

console.log('📚 Vérification complète des liens dans les livres\n');
console.log(`   ${books.length} livres analysés`);
console.log(`   ${articles.length} articles référencés\n`);

// Vérifier les liens dans chaque livre
const issues = [];
let totalLinks = 0;
let validLinks = 0;

books.forEach(book => {
  const content = readFileSync(book.path, 'utf-8');
  const bookName = book.slug;
  
  // Extraire les liens du frontmatter relatedContent
  const frontmatterMatch = content.match(/relatedContent:[\s\S]*?---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[0];
    const urlMatches = frontmatter.matchAll(/url:\s*["'](\/(articles|books)\/([^"'\s]+))/g);
    
    for (const match of urlMatches) {
      const [, fullPath, type, slug] = match;
      totalLinks++;
      const slugs = type === 'articles' ? articleSlugs : bookSlugs;
      
      if (slugs.includes(slug)) {
        validLinks++;
      } else {
        issues.push({
          book: bookName,
          source: 'frontmatter (relatedContent)',
          link: fullPath,
          slug: slug,
          type: type === 'articles' ? 'article' : 'book'
        });
      }
    }
  }
  
  // Extraire les liens markdown (Lectures complémentaires)
  const markdownLinks = content.matchAll(/\[([^\]]+)\]\((\/(articles|books)\/([^\)\s]+))/g);
  for (const match of markdownLinks) {
    const [, title, fullPath, type, slug] = match;
    totalLinks++;
    const slugs = type === 'articles' ? articleSlugs : bookSlugs;
    
    if (slugs.includes(slug)) {
      validLinks++;
    } else {
      issues.push({
        book: bookName,
        source: 'markdown (Lectures complémentaires)',
        link: fullPath,
        slug: slug,
        type: type === 'articles' ? 'article' : 'book',
        title: title
      });
    }
  }
});

// Afficher les résultats
console.log(`📊 Résultats de la vérification:\n`);
console.log(`   Total de liens vérifiés: ${totalLinks}`);
console.log(`   Liens valides: ${validLinks}`);
console.log(`   Liens cassés: ${issues.length}\n`);

if (issues.length === 0) {
  console.log('✅ Tous les liens sont valides!\n');
  console.log('   ✓ Frontmatter (relatedContent)');
  console.log('   ✓ Sections "Lectures complémentaires recommandées"\n');
} else {
  console.log(`❌ Trouvé ${issues.length} lien(s) cassé(s):\n`);
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. Dans "${issue.book}" (${issue.source})`);
    console.log(`   Lien: ${issue.link}`);
    console.log(`   Type: ${issue.type}`);
    console.log(`   Slug recherché: "${issue.slug}"`);
    if (issue.title) {
      console.log(`   Titre du lien: "${issue.title}"`);
    }
    console.log('');
  });
  
  console.log('\n💡 Suggestions:');
  console.log('   1. Vérifiez que les slugs correspondent exactement aux noms de fichiers');
  console.log('   2. Les slugs ne doivent pas inclure le chemin du dossier, juste le nom du fichier');
  console.log('   3. Exemple: gestion-projet/gestion-projet-agile.md → slug: gestion-projet-agile\n');
}



