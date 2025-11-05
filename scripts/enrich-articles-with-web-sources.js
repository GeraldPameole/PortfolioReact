import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

// Mapping des domaines vers leurs labels
const domainLabels = {
  'formation': 'Formation & Pédagogie',
  'gestion-projet': 'Gestion de Projet',
  'developpement-web': 'Développement Web',
  'qualite-process': 'Qualité & Processus',
  'leadership-management': 'Leadership & Management',
  'marketing-communication': 'Marketing & Communication',
  'transformation-digitale': 'Transformation Digitale',
  'productivite-methodes': 'Productivité & Méthodes',
  'gestion-talents': 'Gestion des Talents',
  'service-client': 'Service Client',
  'innovation-technologies': 'Innovation & Technologies',
  'outils-techniques': 'Outils Techniques',
  'developpement-commercial': 'Développement Commercial',
  'reconversion-carriere': 'Reconversion & Carrière',
  'gestion-connaissances': 'Gestion des Connaissances',
  'articles-generaux': 'Articles Généraux'
};

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

// Vérifier si une section est vide ou générique
function isSectionEmpty(sectionContent) {
  const emptyPatterns = [
    /^Contenu à compléter selon ARTICLES_RULES\.md$/,
    /^Définition, concepts clés, impacts et enjeux pour cette section\.$/,
    /^Sous-section Principale$/,
    /^Description à compléter\.$/,
    /^\s*$/
  ];
  
  const trimmed = sectionContent.trim();
  if (!trimmed || trimmed.length < 50) return true;
  
  return emptyPatterns.some(pattern => pattern.test(trimmed));
}

// Ajouter le domaine à côté de la date dans le frontmatter
function addDomainToDate(content, domain) {
  // Chercher le frontmatter
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return content;
  
  const frontmatter = frontmatterMatch[1];
  const domainLabel = domainLabels[domain] || domain;
  
  // Chercher publishDate
  const publishDateMatch = frontmatter.match(/^publishDate:\s*(.+)$/m);
  if (publishDateMatch) {
    const publishDateLine = publishDateMatch[0];
    // Si le domaine n'est pas déjà présent, l'ajouter
    if (!publishDateLine.includes(domainLabel)) {
      const newDateLine = `${publishDateLine} • ${domainLabel}`;
      content = content.replace(publishDateLine, newDateLine);
    }
  }
  
  return content;
}

// Analyser un article pour trouver les sections vides
function analyzeArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const domain = path.basename(path.dirname(filePath));
  
  // Extraire le frontmatter pour obtenir le titre
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  let title = filename.replace('.md', '');
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const titleMatch = frontmatter.match(/^title:\s*["']?([^"'\n]+)/m);
    if (titleMatch) {
      title = titleMatch[1];
    }
  }
  
  // Identifier les sections vides
  const emptySections = [];
  
  // Chercher les sections qui contiennent du texte générique
  const sectionPattern = /(#{2,3}\s+[^\n]+)\n([\s\S]*?)(?=#{2,3}\s+|$)/g;
  let match;
  
  while ((match = sectionPattern.exec(content)) !== null) {
    const sectionTitle = match[1];
    const sectionContent = match[2];
    
    if (isSectionEmpty(sectionContent)) {
      emptySections.push({
        title: sectionTitle.trim(),
        content: sectionContent.trim(),
        index: match.index
      });
    }
  }
  
  return {
    filePath,
    filename,
    domain,
    title,
    emptySections,
    hasEmptySections: emptySections.length > 0
  };
}

// Main
console.log('🔍 Analyse des articles pour identifier les sections vides\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const articlesWithEmptySections = [];

// Analyser tous les articles
allArticles.forEach(filePath => {
  const analysis = analyzeArticle(filePath);
  if (analysis.hasEmptySections) {
    articlesWithEmptySections.push(analysis);
  }
});

// Grouper par domaine
const byDomain = {};
articlesWithEmptySections.forEach(article => {
  if (!byDomain[article.domain]) {
    byDomain[article.domain] = [];
  }
  byDomain[article.domain].push(article);
});

console.log(`\n📊 RÉSULTATS:\n`);
console.log(`Total d'articles analysés: ${allArticles.length}`);
console.log(`Articles avec sections vides: ${articlesWithEmptySections.length}`);
console.log(`\n📁 RÉPARTITION PAR DOMAINE:\n`);

Object.entries(byDomain).forEach(([domain, articles]) => {
  console.log(`${domainLabels[domain] || domain}: ${articles.length} article(s)`);
  articles.forEach(article => {
    console.log(`  - ${article.filename} (${article.emptySections.length} section(s) vide(s))`);
  });
});

console.log('\n' + '='.repeat(80));
console.log('\n💡 PROCHAINES ÉTAPES:');
console.log('Les articles avec des sections vides doivent être complétés avec du contenu spécifique basé sur des recherches web.');
console.log('Pour chaque domaine, je vais rechercher des informations pertinentes et compléter les sections.');


