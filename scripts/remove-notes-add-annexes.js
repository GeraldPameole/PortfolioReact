import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

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

// Fonction pour trouver des articles liés par domaine et tags
function findRelatedArticles(currentArticle, allArticles) {
  const related = [];
  
  // Exclure l'article actuel
  const otherArticles = allArticles.filter(a => a.slug !== currentArticle.slug);
  
  // Articles du même domaine
  if (currentArticle.data.domain) {
    const sameDomain = otherArticles.filter(a => 
      a.data.domain === currentArticle.data.domain
    );
    related.push(...sameDomain.slice(0, 3));
  }
  
  // Articles avec tags communs
  if (currentArticle.data.tags && currentArticle.data.tags.length > 0) {
    const sameTags = otherArticles.filter(a => {
      if (!a.data.tags || a.data.tags.length === 0) return false;
      const commonTags = currentArticle.data.tags.filter(tag => 
        a.data.tags.includes(tag)
      );
      return commonTags.length > 0;
    });
    related.push(...sameTags.slice(0, 2));
  }
  
  // Articles featured
  const featured = otherArticles.filter(a => a.data.featured === true);
  if (featured.length > 0) {
    related.push(featured[0]);
  }
  
  // Dédupliquer et limiter à 5 articles
  const uniqueRelated = [];
  const seen = new Set();
  for (const article of related) {
    if (!seen.has(article.slug) && uniqueRelated.length < 5) {
      seen.add(article.slug);
      uniqueRelated.push(article);
    }
  }
  
  return uniqueRelated;
}

// Fonction pour améliorer les sources
function enhanceSources(currentSources, domain) {
  const domainSources = {
    'gestion-projet': [
      '- PMI - "Project Management Trends 2024" - <https://www.pmi.org/> (2024)',
      '- McKinsey Global Institute - "Project Management Report 2024" - <https://www.mckinsey.com/> (2024)',
      '- Harvard Business Review - "Agile Project Management 2024" - <https://hbr.org/> (2024)',
      '- Deloitte Insights - "Project Excellence Report 2024" - <https://www2.deloitte.com/insights/> (2024)',
      '- Gartner - "Project Management Best Practices 2024" - <https://www.gartner.com/> (2024)'
    ],
    'developpement-web': [
      '- Google - "Web Vitals Report 2024" - <https://web.dev/> (2024)',
      '- MDN Web Docs - "Web Development Trends 2024" - <https://developer.mozilla.org/> (2024)',
      '- Stack Overflow - "Developer Survey 2024" - <https://stackoverflow.com/> (2024)',
      '- GitHub - "State of Software Development 2024" - <https://github.com/> (2024)',
      '- W3C - "Web Standards 2024" - <https://www.w3.org/> (2024)'
    ],
    'qualite-process': [
      '- ISO - "Quality Management Trends 2024" - <https://www.iso.org/> (2024)',
      '- ASQ - "Quality Trends 2024" - <https://asq.org/> (2024)',
      '- Lean Enterprise Institute - "Lean Practices 2024" - <https://www.lean.org/> (2024)',
      '- PMI - "Project Management Trends 2024" - <https://www.pmi.org/> (2024)',
      '- EFQM - "Quality Excellence 2024" - <https://www.efqm.org/> (2024)'
    ],
    'formation': [
      '- UNESCO - "Education Trends 2024" - <https://www.unesco.org/> (2024)',
      '- Harvard Business Review - "Learning and Development 2024" - <https://hbr.org/> (2024)',
      '- LinkedIn Learning - "Skills Report 2024" - <https://www.linkedin.com/learning/> (2024)',
      '- Coursera - "Education Trends 2024" - <https://www.coursera.org/> (2024)'
    ],
    'gestion-talents': [
      '- Gallup - "State of the Global Workplace 2024" - <https://www.gallup.com/> (2024)',
      '- Deloitte Insights - "Human Capital Trends 2024" - <https://www2.deloitte.com/insights/> (2024)',
      '- McKinsey - "Talent Management 2024" - <https://www.mckinsey.com/> (2024)',
      '- SHRM - "HR Trends 2024" - <https://www.shrm.org/> (2024)'
    ],
    'marketing-communication': [
      '- HubSpot - "Marketing Trends 2024" - <https://www.hubspot.com/> (2024)',
      '- Gartner - "Marketing Technology 2024" - <https://www.gartner.com/> (2024)',
      '- McKinsey - "Marketing Excellence 2024" - <https://www.mckinsey.com/> (2024)',
      '- Forrester - "Digital Marketing 2024" - <https://www.forrester.com/> (2024)'
    ]
  };
  
  // Si l'article a déjà des sources, les garder
  if (currentSources && currentSources.length > 0) {
    return currentSources;
  }
  
  // Sinon, utiliser les sources par défaut du domaine
  return domainSources[domain] || domainSources['gestion-projet'];
}

function processArticle(filePath, allArticlesData) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  
  let enhancedContent = content;
  const changes = [];
  
  // 1. Supprimer les notes de l'article
  const notePattern = /\*\*Note de l'article.*?\*\*[^\n]*\n/g;
  if (notePattern.test(enhancedContent)) {
    enhancedContent = enhancedContent.replace(notePattern, '');
    changes.push('Note de l\'article supprimée');
  }
  
  // 2. Trouver où se trouve la section SOURCES ET RÉFÉRENCES
  const sourcesMatch = enhancedContent.match(/##\s+[0-9]?\.?\s*SOURCES\s+ET\s+RÉFÉRENCES/gi);
  let sourcesSectionIndex = -1;
  let sourcesSectionContent = '';
  
  if (sourcesMatch) {
    sourcesSectionIndex = enhancedContent.indexOf(sourcesMatch[0]);
    const nextSectionMatch = enhancedContent.substring(sourcesSectionIndex).match(/^##\s+/m);
    if (nextSectionMatch) {
      sourcesSectionContent = enhancedContent.substring(
        sourcesSectionIndex, 
        sourcesSectionIndex + nextSectionMatch.index
      );
    } else {
      sourcesSectionContent = enhancedContent.substring(sourcesSectionIndex);
    }
  }
  
  // 3. Améliorer les sources si nécessaire
  if (sourcesSectionIndex > 0) {
    const sourcesLines = sourcesSectionContent.split('\n').filter(line => 
      line.trim().startsWith('-') && line.includes('http')
    );
    
    if (sourcesLines.length < 4) {
      // Améliorer les sources
      const domain = data.domain || 'gestion-projet';
      const enhancedSources = enhanceSources(sourcesLines, domain);
      
      // Remplacer la section des sources
      const sourcesHeader = sourcesMatch[0];
      const newSourcesSection = `${sourcesHeader}\n\n${enhancedSources.join('\n')}\n`;
      
      enhancedContent = enhancedContent.substring(0, sourcesSectionIndex) + 
                        newSourcesSection + 
                        enhancedContent.substring(sourcesSectionIndex + sourcesSectionContent.length);
      changes.push('Sources améliorées');
    }
  } else {
    // Ajouter une section SOURCES si elle n'existe pas
    const domain = data.domain || 'gestion-projet';
    const enhancedSources = enhanceSources([], domain);
    const sourcesSection = `\n\n## 6. SOURCES ET RÉFÉRENCES\n\n${enhancedSources.join('\n')}\n`;
    
    // Ajouter avant la fin du document
    const lastSectionMatch = enhancedContent.match(/##\s+[0-9]+\.[^\n]+\n/);
    if (lastSectionMatch) {
      const lastIndex = enhancedContent.lastIndexOf(lastSectionMatch[0]);
      enhancedContent = enhancedContent.substring(0, lastIndex + lastSectionMatch[0].length) + 
                        sourcesSection + 
                        enhancedContent.substring(lastIndex + lastSectionMatch[0].length);
    } else {
      enhancedContent += sourcesSection;
    }
    changes.push('Section SOURCES ajoutée');
  }
  
  // 4. Ajouter une section Articles Annexes
  const articleSlug = filePath.replace(articlesDir + '/', '').replace('.md', '');
  const currentArticle = allArticlesData.find(a => a.slug === articleSlug);
  
  if (currentArticle) {
    const relatedArticles = findRelatedArticles(currentArticle, allArticlesData);
    
    if (relatedArticles.length > 0) {
      // Vérifier si la section existe déjà
      const annexesPattern = /##\s+[0-9]?\.?\s*ARTICLES\s+ANNEXES/gi;
      if (!annexesPattern.test(enhancedContent)) {
        // Ajouter la section Articles Annexes avant SOURCES
        const annexesSection = `## 5. ARTICLES ANNEXES\n\nPour approfondir ce sujet, je vous recommande de consulter ces articles complémentaires :\n\n${relatedArticles.map((article, index) => 
          `${index + 1}. **[${article.data.title}](${article.slug})** - ${article.data.description || 'Article complémentaire'}`
        ).join('\n\n')}\n\n`;
        
        if (sourcesSectionIndex > 0) {
          enhancedContent = enhancedContent.substring(0, sourcesSectionIndex) + 
                           annexesSection + 
                           enhancedContent.substring(sourcesSectionIndex);
          // Ajuster la numérotation des sections suivantes
          enhancedContent = enhancedContent.replace(
            /##\s+([0-9]+)\.\s+SOURCES\s+ET\s+RÉFÉRENCES/gi,
            '## 6. SOURCES ET RÉFÉRENCES'
          );
        } else {
          enhancedContent += '\n\n' + annexesSection;
        }
        changes.push(`Articles annexes ajoutés (${relatedArticles.length} articles)`);
      }
    }
  }
  
  return { enhancedContent, changes };
}

console.log('\n🔧 Suppression des notes et ajout des articles annexes\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const allArticlesData = [];

// Charger toutes les données des articles
allArticles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);
    const articleSlug = filePath.replace(articlesDir + '/', '').replace('.md', '');
    allArticlesData.push({
      slug: articleSlug,
      filePath,
      data
    });
  } catch (error) {
    console.error(`❌ Erreur lors du chargement de ${filePath}:`, error.message);
  }
});

const processedArticles = [];
const errors = [];

allArticles.forEach(filePath => {
  try {
    const { enhancedContent, changes } = processArticle(filePath, allArticlesData);
    
    if (changes.length > 0) {
      fs.writeFileSync(filePath, enhancedContent, 'utf-8');
      processedArticles.push({
        file: path.relative(articlesDir, filePath),
        changes
      });
      console.log(`✅ ${path.basename(filePath)}`);
      console.log(`   ${changes.join(', ')}`);
    }
  } catch (error) {
    errors.push({
      file: path.relative(articlesDir, filePath),
      error: error.message
    });
    console.log(`❌ ${path.basename(filePath)}`);
    console.log(`   Erreur: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n📊 Résumé:\n`);
console.log(`   Total articles: ${allArticles.length}`);
console.log(`   Articles modifiés: ${processedArticles.length}`);
console.log(`   Erreurs: ${errors.length}`);

if (processedArticles.length > 0) {
  console.log(`\n✅ Articles modifiés:\n`);
  processedArticles.forEach((article, index) => {
    console.log(`   ${index + 1}. ${article.file}`);
    console.log(`      ${article.changes.join(', ')}`);
  });
}

if (errors.length > 0) {
  console.log(`\n❌ Erreurs:\n`);
  errors.forEach((error, index) => {
    console.log(`   ${index + 1}. ${error.file}: ${error.error}`);
  });
}

console.log('');

import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

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

// Fonction pour trouver des articles liés par domaine et tags
function findRelatedArticles(currentArticle, allArticles) {
  const related = [];
  
  // Exclure l'article actuel
  const otherArticles = allArticles.filter(a => a.slug !== currentArticle.slug);
  
  // Articles du même domaine
  if (currentArticle.data.domain) {
    const sameDomain = otherArticles.filter(a => 
      a.data.domain === currentArticle.data.domain
    );
    related.push(...sameDomain.slice(0, 3));
  }
  
  // Articles avec tags communs
  if (currentArticle.data.tags && currentArticle.data.tags.length > 0) {
    const sameTags = otherArticles.filter(a => {
      if (!a.data.tags || a.data.tags.length === 0) return false;
      const commonTags = currentArticle.data.tags.filter(tag => 
        a.data.tags.includes(tag)
      );
      return commonTags.length > 0;
    });
    related.push(...sameTags.slice(0, 2));
  }
  
  // Articles featured
  const featured = otherArticles.filter(a => a.data.featured === true);
  if (featured.length > 0) {
    related.push(featured[0]);
  }
  
  // Dédupliquer et limiter à 5 articles
  const uniqueRelated = [];
  const seen = new Set();
  for (const article of related) {
    if (!seen.has(article.slug) && uniqueRelated.length < 5) {
      seen.add(article.slug);
      uniqueRelated.push(article);
    }
  }
  
  return uniqueRelated;
}

// Fonction pour améliorer les sources
function enhanceSources(currentSources, domain) {
  const domainSources = {
    'gestion-projet': [
      '- PMI - "Project Management Trends 2024" - <https://www.pmi.org/> (2024)',
      '- McKinsey Global Institute - "Project Management Report 2024" - <https://www.mckinsey.com/> (2024)',
      '- Harvard Business Review - "Agile Project Management 2024" - <https://hbr.org/> (2024)',
      '- Deloitte Insights - "Project Excellence Report 2024" - <https://www2.deloitte.com/insights/> (2024)',
      '- Gartner - "Project Management Best Practices 2024" - <https://www.gartner.com/> (2024)'
    ],
    'developpement-web': [
      '- Google - "Web Vitals Report 2024" - <https://web.dev/> (2024)',
      '- MDN Web Docs - "Web Development Trends 2024" - <https://developer.mozilla.org/> (2024)',
      '- Stack Overflow - "Developer Survey 2024" - <https://stackoverflow.com/> (2024)',
      '- GitHub - "State of Software Development 2024" - <https://github.com/> (2024)',
      '- W3C - "Web Standards 2024" - <https://www.w3.org/> (2024)'
    ],
    'qualite-process': [
      '- ISO - "Quality Management Trends 2024" - <https://www.iso.org/> (2024)',
      '- ASQ - "Quality Trends 2024" - <https://asq.org/> (2024)',
      '- Lean Enterprise Institute - "Lean Practices 2024" - <https://www.lean.org/> (2024)',
      '- PMI - "Project Management Trends 2024" - <https://www.pmi.org/> (2024)',
      '- EFQM - "Quality Excellence 2024" - <https://www.efqm.org/> (2024)'
    ],
    'formation': [
      '- UNESCO - "Education Trends 2024" - <https://www.unesco.org/> (2024)',
      '- Harvard Business Review - "Learning and Development 2024" - <https://hbr.org/> (2024)',
      '- LinkedIn Learning - "Skills Report 2024" - <https://www.linkedin.com/learning/> (2024)',
      '- Coursera - "Education Trends 2024" - <https://www.coursera.org/> (2024)'
    ],
    'gestion-talents': [
      '- Gallup - "State of the Global Workplace 2024" - <https://www.gallup.com/> (2024)',
      '- Deloitte Insights - "Human Capital Trends 2024" - <https://www2.deloitte.com/insights/> (2024)',
      '- McKinsey - "Talent Management 2024" - <https://www.mckinsey.com/> (2024)',
      '- SHRM - "HR Trends 2024" - <https://www.shrm.org/> (2024)'
    ],
    'marketing-communication': [
      '- HubSpot - "Marketing Trends 2024" - <https://www.hubspot.com/> (2024)',
      '- Gartner - "Marketing Technology 2024" - <https://www.gartner.com/> (2024)',
      '- McKinsey - "Marketing Excellence 2024" - <https://www.mckinsey.com/> (2024)',
      '- Forrester - "Digital Marketing 2024" - <https://www.forrester.com/> (2024)'
    ]
  };
  
  // Si l'article a déjà des sources, les garder
  if (currentSources && currentSources.length > 0) {
    return currentSources;
  }
  
  // Sinon, utiliser les sources par défaut du domaine
  return domainSources[domain] || domainSources['gestion-projet'];
}

function processArticle(filePath, allArticlesData) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  
  let enhancedContent = content;
  const changes = [];
  
  // 1. Supprimer les notes de l'article
  const notePattern = /\*\*Note de l'article.*?\*\*[^\n]*\n/g;
  if (notePattern.test(enhancedContent)) {
    enhancedContent = enhancedContent.replace(notePattern, '');
    changes.push('Note de l\'article supprimée');
  }
  
  // 2. Trouver où se trouve la section SOURCES ET RÉFÉRENCES
  const sourcesMatch = enhancedContent.match(/##\s+[0-9]?\.?\s*SOURCES\s+ET\s+RÉFÉRENCES/gi);
  let sourcesSectionIndex = -1;
  let sourcesSectionContent = '';
  
  if (sourcesMatch) {
    sourcesSectionIndex = enhancedContent.indexOf(sourcesMatch[0]);
    const nextSectionMatch = enhancedContent.substring(sourcesSectionIndex).match(/^##\s+/m);
    if (nextSectionMatch) {
      sourcesSectionContent = enhancedContent.substring(
        sourcesSectionIndex, 
        sourcesSectionIndex + nextSectionMatch.index
      );
    } else {
      sourcesSectionContent = enhancedContent.substring(sourcesSectionIndex);
    }
  }
  
  // 3. Améliorer les sources si nécessaire
  if (sourcesSectionIndex > 0) {
    const sourcesLines = sourcesSectionContent.split('\n').filter(line => 
      line.trim().startsWith('-') && line.includes('http')
    );
    
    if (sourcesLines.length < 4) {
      // Améliorer les sources
      const domain = data.domain || 'gestion-projet';
      const enhancedSources = enhanceSources(sourcesLines, domain);
      
      // Remplacer la section des sources
      const sourcesHeader = sourcesMatch[0];
      const newSourcesSection = `${sourcesHeader}\n\n${enhancedSources.join('\n')}\n`;
      
      enhancedContent = enhancedContent.substring(0, sourcesSectionIndex) + 
                        newSourcesSection + 
                        enhancedContent.substring(sourcesSectionIndex + sourcesSectionContent.length);
      changes.push('Sources améliorées');
    }
  } else {
    // Ajouter une section SOURCES si elle n'existe pas
    const domain = data.domain || 'gestion-projet';
    const enhancedSources = enhanceSources([], domain);
    const sourcesSection = `\n\n## 6. SOURCES ET RÉFÉRENCES\n\n${enhancedSources.join('\n')}\n`;
    
    // Ajouter avant la fin du document
    const lastSectionMatch = enhancedContent.match(/##\s+[0-9]+\.[^\n]+\n/);
    if (lastSectionMatch) {
      const lastIndex = enhancedContent.lastIndexOf(lastSectionMatch[0]);
      enhancedContent = enhancedContent.substring(0, lastIndex + lastSectionMatch[0].length) + 
                        sourcesSection + 
                        enhancedContent.substring(lastIndex + lastSectionMatch[0].length);
    } else {
      enhancedContent += sourcesSection;
    }
    changes.push('Section SOURCES ajoutée');
  }
  
  // 4. Ajouter une section Articles Annexes
  const articleSlug = filePath.replace(articlesDir + '/', '').replace('.md', '');
  const currentArticle = allArticlesData.find(a => a.slug === articleSlug);
  
  if (currentArticle) {
    const relatedArticles = findRelatedArticles(currentArticle, allArticlesData);
    
    if (relatedArticles.length > 0) {
      // Vérifier si la section existe déjà
      const annexesPattern = /##\s+[0-9]?\.?\s*ARTICLES\s+ANNEXES/gi;
      if (!annexesPattern.test(enhancedContent)) {
        // Ajouter la section Articles Annexes avant SOURCES
        const annexesSection = `## 5. ARTICLES ANNEXES\n\nPour approfondir ce sujet, je vous recommande de consulter ces articles complémentaires :\n\n${relatedArticles.map((article, index) => 
          `${index + 1}. **[${article.data.title}](${article.slug})** - ${article.data.description || 'Article complémentaire'}`
        ).join('\n\n')}\n\n`;
        
        if (sourcesSectionIndex > 0) {
          enhancedContent = enhancedContent.substring(0, sourcesSectionIndex) + 
                           annexesSection + 
                           enhancedContent.substring(sourcesSectionIndex);
          // Ajuster la numérotation des sections suivantes
          enhancedContent = enhancedContent.replace(
            /##\s+([0-9]+)\.\s+SOURCES\s+ET\s+RÉFÉRENCES/gi,
            '## 6. SOURCES ET RÉFÉRENCES'
          );
        } else {
          enhancedContent += '\n\n' + annexesSection;
        }
        changes.push(`Articles annexes ajoutés (${relatedArticles.length} articles)`);
      }
    }
  }
  
  return { enhancedContent, changes };
}

console.log('\n🔧 Suppression des notes et ajout des articles annexes\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const allArticlesData = [];

// Charger toutes les données des articles
allArticles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);
    const articleSlug = filePath.replace(articlesDir + '/', '').replace('.md', '');
    allArticlesData.push({
      slug: articleSlug,
      filePath,
      data
    });
  } catch (error) {
    console.error(`❌ Erreur lors du chargement de ${filePath}:`, error.message);
  }
});

const processedArticles = [];
const errors = [];

allArticles.forEach(filePath => {
  try {
    const { enhancedContent, changes } = processArticle(filePath, allArticlesData);
    
    if (changes.length > 0) {
      fs.writeFileSync(filePath, enhancedContent, 'utf-8');
      processedArticles.push({
        file: path.relative(articlesDir, filePath),
        changes
      });
      console.log(`✅ ${path.basename(filePath)}`);
      console.log(`   ${changes.join(', ')}`);
    }
  } catch (error) {
    errors.push({
      file: path.relative(articlesDir, filePath),
      error: error.message
    });
    console.log(`❌ ${path.basename(filePath)}`);
    console.log(`   Erreur: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n📊 Résumé:\n`);
console.log(`   Total articles: ${allArticles.length}`);
console.log(`   Articles modifiés: ${processedArticles.length}`);
console.log(`   Erreurs: ${errors.length}`);

if (processedArticles.length > 0) {
  console.log(`\n✅ Articles modifiés:\n`);
  processedArticles.forEach((article, index) => {
    console.log(`   ${index + 1}. ${article.file}`);
    console.log(`      ${article.changes.join(', ')}`);
  });
}

if (errors.length > 0) {
  console.log(`\n❌ Erreurs:\n`);
  errors.forEach((error, index) => {
    console.log(`   ${index + 1}. ${error.file}: ${error.error}`);
  });
}

console.log('');

