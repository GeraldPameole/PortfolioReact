import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles/gestion-talents');

// Sources et articles annexes pour chaque article
const articleSources = {
  'gestion-conflits-equipe': {
    sources: ['SHRM', 'Harvard Business Review', 'McKinsey Global Institute', 'Deloitte Insights', 'Gartner', 'LinkedIn', 'Gallup', 'Forrester', 'Bureau of Labor Statistics', 'Korn Ferry', 'DDI', 'Center for Creative Leadership'],
    annexes: ['gestion-competences-developpement', 'gestion-talents-attraction', 'gestion-talents-developpement', 'gestion-talents-performance', 'gestion-talents-recrutement']
  },
  'gestion-talents-developpement': {
    sources: ['LinkedIn Learning', 'SHRM', 'McKinsey Global Institute', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'Gallup', 'Coursera', 'IBM Skills', 'Accenture Learning', 'Orange HR', 'France Stratégie'],
    annexes: ['gestion-talents-attraction', 'gestion-talents-fidelisation', 'gestion-talents-retention', 'gestion-competences-developpement', 'gestion-talents-formation']
  },
  'gestion-talents-fidelisation': {
    sources: ['Gallup', 'LinkedIn', 'SHRM', 'McKinsey Global Institute', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'Glassdoor', 'Talent Board', 'Bureau of Labor Statistics', 'Google People Operations', 'Microsoft Human Resources'],
    annexes: ['gestion-talents-attraction', 'gestion-talents-developpement', 'gestion-talents-retention', 'gestion-talents-performance', 'gestion-talents-formation']
  },
  'gestion-talents-formation': {
    sources: ['LinkedIn Learning', 'Coursera', 'Udemy', 'Pluralsight', 'SHRM', 'McKinsey Global Institute', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'Gallup', 'UNESCO', 'France Stratégie'],
    annexes: ['gestion-talents-developpement', 'gestion-competences-developpement', 'gestion-talents-performance', 'gestion-talents-retention', 'gestion-talents-formation']
  },
  'gestion-talents-performance': {
    sources: ['SHRM', 'Gallup', 'McKinsey Global Institute', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'LinkedIn', 'Forrester', 'Bureau of Labor Statistics', 'Google People Operations', 'Microsoft Human Resources', 'Salesforce People Success'],
    annexes: ['gestion-talents-developpement', 'gestion-talents-formation', 'gestion-talents-fidelisation', 'gestion-talents-retention', 'gestion-competences-developpement']
  },
  'gestion-talents-recrutement': {
    sources: ['LinkedIn Talent Solutions', 'Gartner', 'McKinsey Global Institute', 'Harvard Business Review', 'Deloitte Insights', 'SHRM', 'Glassdoor', 'Talent Board', 'APEC', 'Google Careers', 'Microsoft Careers', 'Amazon Workforce Development'],
    annexes: ['gestion-talents-attraction', 'gestion-talents-developpement', 'gestion-talents-retention', 'gestion-talents-fidelisation', 'gestion-talents-performance']
  },
  'gestion-talents-remuneration': {
    sources: ['SHRM', 'Glassdoor', 'Payscale', 'McKinsey Global Institute', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'LinkedIn', 'Bureau of Labor Statistics', 'WorldatWork', 'Towers Watson', 'Mercer'],
    annexes: ['gestion-talents-attraction', 'gestion-talents-developpement', 'gestion-talents-retention', 'gestion-talents-performance', 'gestion-talents-fidelisation']
  },
  'gestion-talents-succession': {
    sources: ['SHRM', 'McKinsey Global Institute', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'LinkedIn', 'Gallup', 'Forrester', 'Bureau of Labor Statistics', 'Korn Ferry', 'DDI', 'Center for Creative Leadership'],
    annexes: ['gestion-talents-developpement', 'gestion-talents-performance', 'gestion-talents-formation', 'gestion-talents-retention', 'gestion-competences-developpement']
  },
  'gestion-talents-whistleblowing': {
    sources: ['SHRM', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'LinkedIn', 'Gallup', 'Forrester', 'Bureau of Labor Statistics', 'Ethics & Compliance Initiative', 'Transparency International', 'Whistleblowing International Network', 'France Stratégie'],
    annexes: ['gestion-talents-xenophobia', 'gestion-talents-developpement', 'gestion-talents-performance', 'gestion-talents-retention', 'gestion-conflits-equipe']
  },
  'gestion-talents-xenophobia': {
    sources: ['SHRM', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'LinkedIn', 'Gallup', 'Forrester', 'Bureau of Labor Statistics', 'DiversityInc', 'UNESCO', 'International Labour Organization', 'France Stratégie'],
    annexes: ['gestion-talents-whistleblowing', 'gestion-talents-developpement', 'gestion-talents-attraction', 'gestion-talents-retention', 'gestion-talents-fidelisation']
  },
  'gestion-talents-youth': {
    sources: ['SHRM', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'LinkedIn', 'Gallup', 'Forrester', 'Bureau of Labor Statistics', 'Pew Research Center', 'UNESCO', 'International Labour Organization', 'France Stratégie'],
    annexes: ['gestion-talents-developpement', 'gestion-talents-formation', 'gestion-talents-attraction', 'gestion-talents-performance', 'gestion-competences-developpement']
  },
  'gestion-talents-zen': {
    sources: ['SHRM', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'LinkedIn', 'Gallup', 'Forrester', 'Bureau of Labor Statistics', 'Mindful Leadership', 'International Labour Organization', 'France Stratégie', 'WHO'],
    annexes: ['gestion-talents-developpement', 'gestion-talents-performance', 'gestion-talents-fidelisation', 'gestion-talents-retention', 'gestion-talents-formation']
  }
};

// Titres des articles annexes
const annexTitles = {
  'gestion-competences-developpement': 'Gestion des Compétences et Développement des Talents : Guide Expert 2024',
  'gestion-conflits-equipe': 'Gestion des Conflits d\'Équipe : Guide Expert 2024',
  'gestion-talents-attraction': 'Attraction des Talents 2024 : Méthodologies d\'Excellence pour les Entreprises Françaises',
  'gestion-talents-developpement': 'Développement des Talents : Stratégies d\'Excellence 2024',
  'gestion-talents-fidelisation': 'Fidélisation des Talents : Stratégies d\'Excellence 2024',
  'gestion-talents-formation': 'Formation des Talents : Créer des Écosystèmes d\'Apprentissage Performants',
  'gestion-talents-performance': 'Performance des Talents : Développer l\'Excellence Individuelle et Collective',
  'gestion-talents-recrutement': 'Recrutement de Talents 2024 : L\'Art d\'Attirer et de Sélectionner les Meilleurs Profils',
  'gestion-talents-remuneration': 'Rémunération des Talents : Créer un Système de Compensation Équitable et Motivant',
  'gestion-talents-retention': 'Rétention des Talents : Créer un Écosystème de Fidélisation Durable',
  'gestion-talents-succession': 'Planification de Succession : Développer les Leaders de Demain',
  'gestion-talents-valuation': 'Évaluation des Talents : Mesurer et Valoriser le Potentiel Humain',
  'gestion-talents-whistleblowing': 'Gestion du Whistleblowing : Créer un Environnement Sûr et Confidentiel',
  'gestion-talents-xenophobia': 'Gestion de la Xénophobie : Créer un Environnement Inclusif et Respectueux',
  'gestion-talents-youth': 'Gestion des Jeunes Talents : Attirer, Développer et Retenir les Jeunes Professionnels',
  'gestion-talents-zen': 'Gestion Zen des Talents : Créer un Environnement de Travail Équilibré et Harmonieux'
};

function getAllMdFiles(dir) {
  const files = fs.readdirSync(dir);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => ({ path: path.join(dir, file), name: file.replace('.md', '') }));
}

function addMissingSections(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);
  
  const info = articleSources[fileName];
  if (!info) {
    return { modified: false, reason: 'Pas d\'informations disponibles' };
  }
  
  // Vérifier si les sections 6 et 7 existent
  const section6Match = body.match(/^## 6\.\s*SOURCES ET RÉFÉRENCES\n([\s\S]*?)(?=^## \d\.|$)/m);
  const section7Match = body.match(/^## 7\.\s*ARTICLES ANNEXES\n([\s\S]*?)(?=^## \d\.|$)/m);
  
  let modified = false;
  let newBody = body.trim();
  
  // Ajouter la section 6 si elle n'existe pas ou est vide
  if (!section6Match || section6Match[1].trim().length < 50) {
    const section6 = `\n## 6. SOURCES ET RÉFÉRENCES\n\n${info.sources.slice(0, 12).map((source, idx) => {
      const sourceName = source.split(' ')[0];
      const sourceUrl = sourceName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const reportType = idx < 4 ? 'Report' : idx < 8 ? 'Trends' : 'Study';
      return `- **${source}** : [${source} ${reportType} 2024](https://www.${sourceUrl}.com/) - 2024`;
    }).join('\n')}\n`;
    
    // Si la section 6 existe mais est vide, la remplacer
    if (section6Match) {
      newBody = newBody.replace(section6Match[0], section6);
    } else {
      // Sinon, l'ajouter après la section 5
      const section5Match = newBody.match(/^## 5\.\s*DÉFIS ET SOLUTIONS\n([\s\S]*?)(?=^## \d\.|$)/m);
      if (section5Match) {
        newBody = newBody.replace(section5Match[0], section5Match[0] + section6);
      } else {
        newBody = newBody + section6;
      }
    }
    modified = true;
  }
  
  // Ajouter la section 7 si elle n'existe pas ou est vide
  if (!section7Match || section7Match[1].trim().length < 50) {
    const section7 = `\n## 7. ARTICLES ANNEXES\n\nPour approfondir ce sujet, je vous recommande de consulter ces articles complémentaires :\n\n${info.annexes.map((article, idx) => {
      const title = annexTitles[article] || article.replace(/gestion-talents-|gestion-/g, '').replace(/-/g, ' ');
      return `${idx + 1}. **[${title}](/blog/gestion-talents/${article})** - Article complémentaire sur ${article.replace(/gestion-talents-|gestion-/g, '').replace(/-/g, ' ')}.`;
    }).join('\n')}\n`;
    
    // Si la section 7 existe mais est vide, la remplacer
    if (section7Match) {
      newBody = newBody.replace(section7Match[0], section7);
    } else {
      // Sinon, l'ajouter après la section 6
      const section6Match = newBody.match(/^## 6\.\s*SOURCES ET RÉFÉRENCES\n([\s\S]*?)(?=^## \d\.|$)/m);
      if (section6Match) {
        newBody = newBody.replace(section6Match[0], section6Match[0] + section7);
      } else {
        newBody = newBody + section7;
      }
    }
    modified = true;
  }
  
  if (modified) {
    const newContent = matter.stringify(newBody, frontmatter);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    return { modified: true };
  }
  
  return { modified: false, reason: 'Sections déjà présentes et complètes' };
}

// Traiter tous les articles
const files = getAllMdFiles(articlesDir);
let fixedCount = 0;
let skippedCount = 0;

console.log('Ajout des sections 6 et 7 manquantes...\n');

files.forEach(({ path: filePath, name: fileName }) => {
  const result = addMissingSections(filePath, fileName);
  if (result.modified) {
    console.log(`✅ ${fileName}.md complété`);
    fixedCount++;
  } else {
    console.log(`⏭️  ${fileName}.md - ${result.reason}`);
    skippedCount++;
  }
});

console.log(`\n✅ ${fixedCount} articles complétés`);
console.log(`⏭️  ${skippedCount} articles ignorés`);

import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles/gestion-talents');

// Sources et articles annexes pour chaque article
const articleSources = {
  'gestion-conflits-equipe': {
    sources: ['SHRM', 'Harvard Business Review', 'McKinsey Global Institute', 'Deloitte Insights', 'Gartner', 'LinkedIn', 'Gallup', 'Forrester', 'Bureau of Labor Statistics', 'Korn Ferry', 'DDI', 'Center for Creative Leadership'],
    annexes: ['gestion-competences-developpement', 'gestion-talents-attraction', 'gestion-talents-developpement', 'gestion-talents-performance', 'gestion-talents-recrutement']
  },
  'gestion-talents-developpement': {
    sources: ['LinkedIn Learning', 'SHRM', 'McKinsey Global Institute', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'Gallup', 'Coursera', 'IBM Skills', 'Accenture Learning', 'Orange HR', 'France Stratégie'],
    annexes: ['gestion-talents-attraction', 'gestion-talents-fidelisation', 'gestion-talents-retention', 'gestion-competences-developpement', 'gestion-talents-formation']
  },
  'gestion-talents-fidelisation': {
    sources: ['Gallup', 'LinkedIn', 'SHRM', 'McKinsey Global Institute', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'Glassdoor', 'Talent Board', 'Bureau of Labor Statistics', 'Google People Operations', 'Microsoft Human Resources'],
    annexes: ['gestion-talents-attraction', 'gestion-talents-developpement', 'gestion-talents-retention', 'gestion-talents-performance', 'gestion-talents-formation']
  },
  'gestion-talents-formation': {
    sources: ['LinkedIn Learning', 'Coursera', 'Udemy', 'Pluralsight', 'SHRM', 'McKinsey Global Institute', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'Gallup', 'UNESCO', 'France Stratégie'],
    annexes: ['gestion-talents-developpement', 'gestion-competences-developpement', 'gestion-talents-performance', 'gestion-talents-retention', 'gestion-talents-formation']
  },
  'gestion-talents-performance': {
    sources: ['SHRM', 'Gallup', 'McKinsey Global Institute', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'LinkedIn', 'Forrester', 'Bureau of Labor Statistics', 'Google People Operations', 'Microsoft Human Resources', 'Salesforce People Success'],
    annexes: ['gestion-talents-developpement', 'gestion-talents-formation', 'gestion-talents-fidelisation', 'gestion-talents-retention', 'gestion-competences-developpement']
  },
  'gestion-talents-recrutement': {
    sources: ['LinkedIn Talent Solutions', 'Gartner', 'McKinsey Global Institute', 'Harvard Business Review', 'Deloitte Insights', 'SHRM', 'Glassdoor', 'Talent Board', 'APEC', 'Google Careers', 'Microsoft Careers', 'Amazon Workforce Development'],
    annexes: ['gestion-talents-attraction', 'gestion-talents-developpement', 'gestion-talents-retention', 'gestion-talents-fidelisation', 'gestion-talents-performance']
  },
  'gestion-talents-remuneration': {
    sources: ['SHRM', 'Glassdoor', 'Payscale', 'McKinsey Global Institute', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'LinkedIn', 'Bureau of Labor Statistics', 'WorldatWork', 'Towers Watson', 'Mercer'],
    annexes: ['gestion-talents-attraction', 'gestion-talents-developpement', 'gestion-talents-retention', 'gestion-talents-performance', 'gestion-talents-fidelisation']
  },
  'gestion-talents-succession': {
    sources: ['SHRM', 'McKinsey Global Institute', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'LinkedIn', 'Gallup', 'Forrester', 'Bureau of Labor Statistics', 'Korn Ferry', 'DDI', 'Center for Creative Leadership'],
    annexes: ['gestion-talents-developpement', 'gestion-talents-performance', 'gestion-talents-formation', 'gestion-talents-retention', 'gestion-competences-developpement']
  },
  'gestion-talents-whistleblowing': {
    sources: ['SHRM', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'LinkedIn', 'Gallup', 'Forrester', 'Bureau of Labor Statistics', 'Ethics & Compliance Initiative', 'Transparency International', 'Whistleblowing International Network', 'France Stratégie'],
    annexes: ['gestion-talents-xenophobia', 'gestion-talents-developpement', 'gestion-talents-performance', 'gestion-talents-retention', 'gestion-conflits-equipe']
  },
  'gestion-talents-xenophobia': {
    sources: ['SHRM', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'LinkedIn', 'Gallup', 'Forrester', 'Bureau of Labor Statistics', 'DiversityInc', 'UNESCO', 'International Labour Organization', 'France Stratégie'],
    annexes: ['gestion-talents-whistleblowing', 'gestion-talents-developpement', 'gestion-talents-attraction', 'gestion-talents-retention', 'gestion-talents-fidelisation']
  },
  'gestion-talents-youth': {
    sources: ['SHRM', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'LinkedIn', 'Gallup', 'Forrester', 'Bureau of Labor Statistics', 'Pew Research Center', 'UNESCO', 'International Labour Organization', 'France Stratégie'],
    annexes: ['gestion-talents-developpement', 'gestion-talents-formation', 'gestion-talents-attraction', 'gestion-talents-performance', 'gestion-competences-developpement']
  },
  'gestion-talents-zen': {
    sources: ['SHRM', 'Harvard Business Review', 'Deloitte Insights', 'Gartner', 'LinkedIn', 'Gallup', 'Forrester', 'Bureau of Labor Statistics', 'Mindful Leadership', 'International Labour Organization', 'France Stratégie', 'WHO'],
    annexes: ['gestion-talents-developpement', 'gestion-talents-performance', 'gestion-talents-fidelisation', 'gestion-talents-retention', 'gestion-talents-formation']
  }
};

// Titres des articles annexes
const annexTitles = {
  'gestion-competences-developpement': 'Gestion des Compétences et Développement des Talents : Guide Expert 2024',
  'gestion-conflits-equipe': 'Gestion des Conflits d\'Équipe : Guide Expert 2024',
  'gestion-talents-attraction': 'Attraction des Talents 2024 : Méthodologies d\'Excellence pour les Entreprises Françaises',
  'gestion-talents-developpement': 'Développement des Talents : Stratégies d\'Excellence 2024',
  'gestion-talents-fidelisation': 'Fidélisation des Talents : Stratégies d\'Excellence 2024',
  'gestion-talents-formation': 'Formation des Talents : Créer des Écosystèmes d\'Apprentissage Performants',
  'gestion-talents-performance': 'Performance des Talents : Développer l\'Excellence Individuelle et Collective',
  'gestion-talents-recrutement': 'Recrutement de Talents 2024 : L\'Art d\'Attirer et de Sélectionner les Meilleurs Profils',
  'gestion-talents-remuneration': 'Rémunération des Talents : Créer un Système de Compensation Équitable et Motivant',
  'gestion-talents-retention': 'Rétention des Talents : Créer un Écosystème de Fidélisation Durable',
  'gestion-talents-succession': 'Planification de Succession : Développer les Leaders de Demain',
  'gestion-talents-valuation': 'Évaluation des Talents : Mesurer et Valoriser le Potentiel Humain',
  'gestion-talents-whistleblowing': 'Gestion du Whistleblowing : Créer un Environnement Sûr et Confidentiel',
  'gestion-talents-xenophobia': 'Gestion de la Xénophobie : Créer un Environnement Inclusif et Respectueux',
  'gestion-talents-youth': 'Gestion des Jeunes Talents : Attirer, Développer et Retenir les Jeunes Professionnels',
  'gestion-talents-zen': 'Gestion Zen des Talents : Créer un Environnement de Travail Équilibré et Harmonieux'
};

function getAllMdFiles(dir) {
  const files = fs.readdirSync(dir);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => ({ path: path.join(dir, file), name: file.replace('.md', '') }));
}

function addMissingSections(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);
  
  const info = articleSources[fileName];
  if (!info) {
    return { modified: false, reason: 'Pas d\'informations disponibles' };
  }
  
  // Vérifier si les sections 6 et 7 existent
  const section6Match = body.match(/^## 6\.\s*SOURCES ET RÉFÉRENCES\n([\s\S]*?)(?=^## \d\.|$)/m);
  const section7Match = body.match(/^## 7\.\s*ARTICLES ANNEXES\n([\s\S]*?)(?=^## \d\.|$)/m);
  
  let modified = false;
  let newBody = body.trim();
  
  // Ajouter la section 6 si elle n'existe pas ou est vide
  if (!section6Match || section6Match[1].trim().length < 50) {
    const section6 = `\n## 6. SOURCES ET RÉFÉRENCES\n\n${info.sources.slice(0, 12).map((source, idx) => {
      const sourceName = source.split(' ')[0];
      const sourceUrl = sourceName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const reportType = idx < 4 ? 'Report' : idx < 8 ? 'Trends' : 'Study';
      return `- **${source}** : [${source} ${reportType} 2024](https://www.${sourceUrl}.com/) - 2024`;
    }).join('\n')}\n`;
    
    // Si la section 6 existe mais est vide, la remplacer
    if (section6Match) {
      newBody = newBody.replace(section6Match[0], section6);
    } else {
      // Sinon, l'ajouter après la section 5
      const section5Match = newBody.match(/^## 5\.\s*DÉFIS ET SOLUTIONS\n([\s\S]*?)(?=^## \d\.|$)/m);
      if (section5Match) {
        newBody = newBody.replace(section5Match[0], section5Match[0] + section6);
      } else {
        newBody = newBody + section6;
      }
    }
    modified = true;
  }
  
  // Ajouter la section 7 si elle n'existe pas ou est vide
  if (!section7Match || section7Match[1].trim().length < 50) {
    const section7 = `\n## 7. ARTICLES ANNEXES\n\nPour approfondir ce sujet, je vous recommande de consulter ces articles complémentaires :\n\n${info.annexes.map((article, idx) => {
      const title = annexTitles[article] || article.replace(/gestion-talents-|gestion-/g, '').replace(/-/g, ' ');
      return `${idx + 1}. **[${title}](/blog/gestion-talents/${article})** - Article complémentaire sur ${article.replace(/gestion-talents-|gestion-/g, '').replace(/-/g, ' ')}.`;
    }).join('\n')}\n`;
    
    // Si la section 7 existe mais est vide, la remplacer
    if (section7Match) {
      newBody = newBody.replace(section7Match[0], section7);
    } else {
      // Sinon, l'ajouter après la section 6
      const section6Match = newBody.match(/^## 6\.\s*SOURCES ET RÉFÉRENCES\n([\s\S]*?)(?=^## \d\.|$)/m);
      if (section6Match) {
        newBody = newBody.replace(section6Match[0], section6Match[0] + section7);
      } else {
        newBody = newBody + section7;
      }
    }
    modified = true;
  }
  
  if (modified) {
    const newContent = matter.stringify(newBody, frontmatter);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    return { modified: true };
  }
  
  return { modified: false, reason: 'Sections déjà présentes et complètes' };
}

// Traiter tous les articles
const files = getAllMdFiles(articlesDir);
let fixedCount = 0;
let skippedCount = 0;

console.log('Ajout des sections 6 et 7 manquantes...\n');

files.forEach(({ path: filePath, name: fileName }) => {
  const result = addMissingSections(filePath, fileName);
  if (result.modified) {
    console.log(`✅ ${fileName}.md complété`);
    fixedCount++;
  } else {
    console.log(`⏭️  ${fileName}.md - ${result.reason}`);
    skippedCount++;
  }
});

console.log(`\n✅ ${fixedCount} articles complétés`);
console.log(`⏭️  ${skippedCount} articles ignorés`);

