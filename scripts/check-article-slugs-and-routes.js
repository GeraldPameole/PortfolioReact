import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

// Fonction pour récupérer tous les fichiers .md
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

// Extraire le slug depuis le chemin du fichier
function extractSlug(filePath) {
  // Supprimer le chemin jusqu'à articles/
  const relativePath = filePath.replace(/^.*\/articles\//, '');
  // Supprimer l'extension .md
  const withoutExt = relativePath.replace(/\.md$/, '');
  return withoutExt;
}

// Extraire le domaine depuis le chemin
function extractDomain(filePath) {
  const relativePath = filePath.replace(/^.*\/articles\//, '');
  const parts = relativePath.split('/');
  return parts[0];
}

console.log('🔍 Vérification des slugs et routes des articles\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const issues = [];

allArticles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extraire le frontmatter
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return;
  
  const frontmatter = frontmatterMatch[1];
  
  // Extraire le domaine depuis le chemin
  const domain = extractDomain(filePath);
  const slugFromPath = extractSlug(filePath);
  
  // Vérifier si le slug contient le domaine ou non
  const slugIncludesDomain = slugFromPath.includes('/');
  
  // Les routes attendues :
  // - /blog/{slug} (dans blog/[...slug].astro)
  // - /articles/{slug} (dans articles/[...slug].astro)
  
  // Extraire le titre pour l'info
  const titleMatch = frontmatter.match(/^title:\s*["']?([^"'\n]+)/m);
  const title = titleMatch ? titleMatch[1] : 'Sans titre';
  
  // Vérifier les liens possibles
  const expectedBlogSlug = slugFromPath; // Le slug complet avec domaine
  const expectedArticlesSlug = slugFromPath; // Le slug complet avec domaine
  
  // Vérifier si le slug semble correct
  if (!slugFromPath || slugFromPath.length === 0) {
    issues.push({
      file: filePath,
      domain,
      slugFromPath,
      title,
      issue: 'Slug vide ou invalide',
      expectedBlogUrl: `/blog/${slugFromPath}`,
      expectedArticlesUrl: `/articles/${slugFromPath}`
    });
  }
  
  // Afficher les infos
  console.log(`📄 ${domain}/${path.basename(filePath)}`);
  console.log(`   Titre: ${title}`);
  console.log(`   Slug: ${slugFromPath}`);
  console.log(`   URLs attendues:`);
  console.log(`     - /blog/${slugFromPath}`);
  console.log(`     - /articles/${slugFromPath}`);
  console.log('');
});

console.log('='.repeat(80));
console.log(`\n✅ ${allArticles.length} articles analysés`);

if (issues.length > 0) {
  console.log(`\n❌ ${issues.length} problème(s) détecté(s):\n`);
  issues.forEach(issue => {
    console.log(`📄 ${path.basename(issue.file)}`);
    console.log(`   Problème: ${issue.issue}`);
    console.log('');
  });
}


