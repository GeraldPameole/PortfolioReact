import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

console.log('\n🔧 Complétion automatique des articles incomplets\n');
console.log('='.repeat(80));

// Fonction pour trouver les articles avec des placeholders
function findIncompleteArticles() {
  const incompleteArticles = [];
  
  function scanDirectory(dir, domain) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      if (file.endsWith('.md') && !file.startsWith('_')) {
        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { content: body } = matter(content);
        
        // Vérifier les placeholders
        const placeholders = [
          /\[Description avec statistiques selon source fiable 2024\]/gi,
          /\[Définition complète du sujet avec sources\]/gi,
          /\[Observation personnelle basée sur l'expérience terrain\]/gi,
          /\[Nuance d'expert\]/gi,
          /\[Source fiable\]/gi,
          /\[statistique pertinente\]/gi,
          /\[Définition avec statistiques selon source fiable 2024\]/gi,
          /\[Cas d'usage avec statistiques selon source 2024\]/gi,
          /\[Impact avec statistiques selon source fiable 2024\]/gi,
          /\[Défi avec statistiques selon source fiable 2024\]/gi,
          /\[Impact spécifique\]/gi,
          /\[Description\]/gi,
          /\[Critères\]/gi,
          /\[Exemples\]/gi,
          /\[%\]/gi,
          /\[Niveau\]/gi
        ];
        
        let hasPlaceholders = false;
        placeholders.forEach(pattern => {
          if (pattern.test(body)) {
            hasPlaceholders = true;
          }
        });
        
        if (hasPlaceholders) {
          incompleteArticles.push({
            domain,
            file,
            path: filePath,
            title: matter(content).data.title || file
          });
        }
      }
    });
  }
  
  const domains = fs.readdirSync(articlesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  domains.forEach(domain => {
    const domainPath = path.join(articlesDir, domain);
    scanDirectory(domainPath, domain);
  });
  
  return incompleteArticles;
}

const incompleteArticles = findIncompleteArticles();

console.log(`\n📋 Articles incomplets trouvés: ${incompleteArticles.length}\n`);

// Grouper par domaine
const byDomain = {};
incompleteArticles.forEach(article => {
  if (!byDomain[article.domain]) {
    byDomain[article.domain] = [];
  }
  byDomain[article.domain].push(article);
});

console.log('Répartition par domaine:\n');
Object.keys(byDomain).sort().forEach(domain => {
  console.log(`  ${domain}: ${byDomain[domain].length} article(s)`);
});

// Sauvegarder la liste
fs.writeFileSync(
  path.join(__dirname, '../ARTICLES_INCOMPLETS_LISTE.json'),
  JSON.stringify({
    total: incompleteArticles.length,
    byDomain,
    articles: incompleteArticles.map(a => ({
      domain: a.domain,
      file: a.file,
      title: a.title
    }))
  }, null, 2),
  'utf-8'
);

console.log(`\n✅ Liste sauvegardée dans ARTICLES_INCOMPLETS_LISTE.json`);
console.log(`\n📝 Prochaines étapes:`);
console.log(`   1. Traiter les articles domaine par domaine`);
console.log(`   2. Utiliser des recherches web pour compléter chaque article`);
console.log(`   3. S'assurer d'avoir minimum 4-5 sources fiables par article`);
console.log(`   4. Respecter l'ordre des sections standard`);
console.log(`\n✅ Terminé\n`);

import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

console.log('\n🔧 Complétion automatique des articles incomplets\n');
console.log('='.repeat(80));

// Fonction pour trouver les articles avec des placeholders
function findIncompleteArticles() {
  const incompleteArticles = [];
  
  function scanDirectory(dir, domain) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      if (file.endsWith('.md') && !file.startsWith('_')) {
        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { content: body } = matter(content);
        
        // Vérifier les placeholders
        const placeholders = [
          /\[Description avec statistiques selon source fiable 2024\]/gi,
          /\[Définition complète du sujet avec sources\]/gi,
          /\[Observation personnelle basée sur l'expérience terrain\]/gi,
          /\[Nuance d'expert\]/gi,
          /\[Source fiable\]/gi,
          /\[statistique pertinente\]/gi,
          /\[Définition avec statistiques selon source fiable 2024\]/gi,
          /\[Cas d'usage avec statistiques selon source 2024\]/gi,
          /\[Impact avec statistiques selon source fiable 2024\]/gi,
          /\[Défi avec statistiques selon source fiable 2024\]/gi,
          /\[Impact spécifique\]/gi,
          /\[Description\]/gi,
          /\[Critères\]/gi,
          /\[Exemples\]/gi,
          /\[%\]/gi,
          /\[Niveau\]/gi
        ];
        
        let hasPlaceholders = false;
        placeholders.forEach(pattern => {
          if (pattern.test(body)) {
            hasPlaceholders = true;
          }
        });
        
        if (hasPlaceholders) {
          incompleteArticles.push({
            domain,
            file,
            path: filePath,
            title: matter(content).data.title || file
          });
        }
      }
    });
  }
  
  const domains = fs.readdirSync(articlesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  domains.forEach(domain => {
    const domainPath = path.join(articlesDir, domain);
    scanDirectory(domainPath, domain);
  });
  
  return incompleteArticles;
}

const incompleteArticles = findIncompleteArticles();

console.log(`\n📋 Articles incomplets trouvés: ${incompleteArticles.length}\n`);

// Grouper par domaine
const byDomain = {};
incompleteArticles.forEach(article => {
  if (!byDomain[article.domain]) {
    byDomain[article.domain] = [];
  }
  byDomain[article.domain].push(article);
});

console.log('Répartition par domaine:\n');
Object.keys(byDomain).sort().forEach(domain => {
  console.log(`  ${domain}: ${byDomain[domain].length} article(s)`);
});

// Sauvegarder la liste
fs.writeFileSync(
  path.join(__dirname, '../ARTICLES_INCOMPLETS_LISTE.json'),
  JSON.stringify({
    total: incompleteArticles.length,
    byDomain,
    articles: incompleteArticles.map(a => ({
      domain: a.domain,
      file: a.file,
      title: a.title
    }))
  }, null, 2),
  'utf-8'
);

console.log(`\n✅ Liste sauvegardée dans ARTICLES_INCOMPLETS_LISTE.json`);
console.log(`\n📝 Prochaines étapes:`);
console.log(`   1. Traiter les articles domaine par domaine`);
console.log(`   2. Utiliser des recherches web pour compléter chaque article`);
console.log(`   3. S'assurer d'avoir minimum 4-5 sources fiables par article`);
console.log(`   4. Respecter l'ordre des sections standard`);
console.log(`\n✅ Terminé\n`);

