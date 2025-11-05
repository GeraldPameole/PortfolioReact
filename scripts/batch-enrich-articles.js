import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

// Mapping des domaines
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

// Fonction pour ajouter le domaine à la date
function addDomainToDate(content, domain) {
  const domainLabel = domainLabels[domain] || domain;
  
  // Chercher publishDate dans le frontmatter
  const publishDatePattern = /^publishDate:\s*["']?([^"'\n]+)["']?/m;
  const match = content.match(publishDatePattern);
  
  if (match) {
    const originalDate = match[1];
    // Si le domaine n'est pas déjà présent
    if (!originalDate.includes('•') && !originalDate.includes(domainLabel)) {
      const newDate = `${originalDate} • ${domainLabel}`;
      content = content.replace(publishDatePattern, `publishDate: "${newDate}"`);
    }
  }
  
  return content;
}

// Fonction pour récupérer tous les fichiers .md
function getAllMdFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllMdFiles(filePath, fileList);
    } else if (file.endsWith('.md') && !file.includes('template')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Main: Ajouter le domaine à tous les articles
console.log('🔍 Ajout du domaine à côté de la date dans tous les articles\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
let updatedCount = 0;

allArticles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const domain = path.basename(path.dirname(filePath));
  const filename = path.basename(filePath);
  
  const updatedContent = addDomainToDate(content, domain);
  
  if (updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    updatedCount++;
    console.log(`✅ ${domain}/${filename}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n✅ ${updatedCount} article(s) mis à jour avec le domaine/thème`);
console.log(`📊 Total d'articles traités: ${allArticles.length}`);


