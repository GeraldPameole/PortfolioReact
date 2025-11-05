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
    } else if (file.endsWith('.md') && !file.includes('template')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Fonction pour ajouter une semaine à une date
function addWeeks(date, weeks) {
  const result = new Date(date);
  result.setDate(result.getDate() + (weeks * 7));
  return result;
}

// Fonction pour formater une date en YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Date de départ : il y a 96 semaines (environ 1,8 ans)
const startDate = new Date();
startDate.setDate(startDate.getDate() - (96 * 7));

console.log('📅 Datation des articles en mode "1 article par semaine" sur 96 semaines\n');
console.log('='.repeat(80));
console.log(`Date de départ: ${formatDate(startDate)}`);
console.log(`Date actuelle: ${formatDate(new Date())}\n`);

// Récupérer tous les articles
const allArticles = getAllMdFiles(articlesDir);

// Trier les articles pour avoir un ordre cohérent (par domaine, puis par nom)
allArticles.sort((a, b) => {
  const domainA = path.basename(path.dirname(a));
  const domainB = path.basename(path.dirname(b));
  
  if (domainA !== domainB) {
    return domainA.localeCompare(domainB);
  }
  
  return path.basename(a).localeCompare(path.basename(b));
});

console.log(`Total d'articles à dater: ${allArticles.length}\n`);

// Date les articles
let currentDate = new Date(startDate);
let datedCount = 0;

allArticles.forEach((filePath, index) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const domain = path.basename(path.dirname(filePath));
  
  // Chercher publishDate dans le frontmatter
  const publishDatePattern = /^publishDate:\s*["']?([^"'\n]+)["']?/m;
  const match = content.match(publishDatePattern);
  
  if (match) {
    // Calculer la date pour cet article (index semaine)
    const articleDate = addWeeks(currentDate, index);
    const formattedDate = formatDate(articleDate);
    
    // Extraire le domaine/thème si présent
    const existingDate = match[1];
    const domainMatch = existingDate.match(/•\s*(.+)$/);
    const domainLabel = domainMatch ? domainMatch[1].trim() : null;
    
    // Nouvelle date avec domaine si présent
    const newDateValue = domainLabel ? `${formattedDate} • ${domainLabel}` : formattedDate;
    
    // Remplacer la date
    const newContent = content.replace(publishDatePattern, `publishDate: "${newDateValue}"`);
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      datedCount++;
      
      if (index < 5 || index >= allArticles.length - 5) {
        console.log(`${index + 1}. ${domain}/${filename}`);
        console.log(`   Date: ${formattedDate} (semaine ${index + 1})\n`);
      }
    }
  }
});

console.log('='.repeat(80));
console.log(`\n✅ ${datedCount} article(s) daté(s) avec une date unique par semaine`);
console.log(`📊 Répartition: ${allArticles.length} articles sur ${allArticles.length} semaines`);
console.log(`\nDate de départ: ${formatDate(startDate)}`);
console.log(`Date du dernier article: ${formatDate(addWeeks(startDate, allArticles.length - 1))}`);


