import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

function getAllMdFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllMdFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Extraire le slug depuis le chemin du fichier
function extractSlug(filePath) {
  const relativePath = filePath.replace(/^.*\/articles\//, '');
  const withoutExt = relativePath.replace(/\.md$/, '');
  return withoutExt;
}

console.log('\n🔍 Vérification des routes et liens des articles\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const issues = [];

allArticles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extraire le frontmatter
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    issues.push({ file: filePath, issue: 'Pas de frontmatter' });
    return;
  }
  
  const frontmatter = frontmatterMatch[1];
  const slugFromPath = extractSlug(filePath);
  
  // Extraire le titre
  const titleMatch = frontmatter.match(/^title:\s*["']?([^"'\n]+)/m);
  const title = titleMatch ? titleMatch[1] : 'Sans titre';
  
  // Vérifier que le slug est correct
  if (!slugFromPath || slugFromPath.length === 0) {
    issues.push({
      file: filePath,
      slug: slugFromPath,
      title,
      issue: 'Slug vide ou invalide'
    });
  }
  
  // URLs attendues
  const blogUrl = `/blog/${slugFromPath}`;
  const articlesUrl = `/articles/${slugFromPath}`;
  
  console.log(`✅ ${path.basename(filePath)}`);
  console.log(`   Titre: ${title}`);
  console.log(`   Slug: ${slugFromPath}`);
  console.log(`   URLs:`);
  console.log(`     - ${blogUrl}`);
  console.log(`     - ${articlesUrl}`);
  console.log('');
});

console.log('='.repeat(80));
console.log(`\n📊 Résumé:\n`);
console.log(`   Total articles: ${allArticles.length}`);
console.log(`   Problèmes détectés: ${issues.length}`);

if (issues.length > 0) {
  console.log(`\n⚠️  Problèmes détectés:\n`);
  issues.forEach(issue => {
    console.log(`   - ${path.basename(issue.file)}: ${issue.issue}`);
  });
} else {
  console.log(`\n✅ Tous les articles ont des slugs valides!\n`);
}

console.log('\n💡 Note: Les routes Astro `[...slug]` gèrent automatiquement les slugs avec slashes.\n');
console.log('   Les articles sont accessibles via:');
console.log('   - /blog/{slug} (ex: /blog/developpement-web/article)');
console.log('   - /articles/{slug} (ex: /articles/developpement-web/article)');
console.log('');

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

function getAllMdFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllMdFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Extraire le slug depuis le chemin du fichier
function extractSlug(filePath) {
  const relativePath = filePath.replace(/^.*\/articles\//, '');
  const withoutExt = relativePath.replace(/\.md$/, '');
  return withoutExt;
}

console.log('\n🔍 Vérification des routes et liens des articles\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const issues = [];

allArticles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extraire le frontmatter
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    issues.push({ file: filePath, issue: 'Pas de frontmatter' });
    return;
  }
  
  const frontmatter = frontmatterMatch[1];
  const slugFromPath = extractSlug(filePath);
  
  // Extraire le titre
  const titleMatch = frontmatter.match(/^title:\s*["']?([^"'\n]+)/m);
  const title = titleMatch ? titleMatch[1] : 'Sans titre';
  
  // Vérifier que le slug est correct
  if (!slugFromPath || slugFromPath.length === 0) {
    issues.push({
      file: filePath,
      slug: slugFromPath,
      title,
      issue: 'Slug vide ou invalide'
    });
  }
  
  // URLs attendues
  const blogUrl = `/blog/${slugFromPath}`;
  const articlesUrl = `/articles/${slugFromPath}`;
  
  console.log(`✅ ${path.basename(filePath)}`);
  console.log(`   Titre: ${title}`);
  console.log(`   Slug: ${slugFromPath}`);
  console.log(`   URLs:`);
  console.log(`     - ${blogUrl}`);
  console.log(`     - ${articlesUrl}`);
  console.log('');
});

console.log('='.repeat(80));
console.log(`\n📊 Résumé:\n`);
console.log(`   Total articles: ${allArticles.length}`);
console.log(`   Problèmes détectés: ${issues.length}`);

if (issues.length > 0) {
  console.log(`\n⚠️  Problèmes détectés:\n`);
  issues.forEach(issue => {
    console.log(`   - ${path.basename(issue.file)}: ${issue.issue}`);
  });
} else {
  console.log(`\n✅ Tous les articles ont des slugs valides!\n`);
}

console.log('\n💡 Note: Les routes Astro `[...slug]` gèrent automatiquement les slugs avec slashes.\n');
console.log('   Les articles sont accessibles via:');
console.log('   - /blog/{slug} (ex: /blog/developpement-web/article)');
console.log('   - /articles/{slug} (ex: /articles/developpement-web/article)');
console.log('');

