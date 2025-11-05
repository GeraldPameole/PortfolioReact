import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

console.log('\n🔧 Complétion automatique des articles par domaine\n');
console.log('='.repeat(80));

// Domaines à traiter par ordre de priorité
const DOMAINS_ORDER = [
  'developpement-web',
  'gestion-talents',
  'formation',
  'gestion-projet',
  'productivite-methodes',
  'qualite-process',
  'marketing-communication',
  'leadership-management',
  'transformation-digitale',
  'service-client',
  'reconversion-carriere',
  'outils-techniques',
  'innovation-technologies',
  'gestion-connaissances',
  'developpement-commercial',
  'articles-generaux'
];

// Fonction pour détecter les placeholders
function hasPlaceholders(content) {
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
  
  return placeholders.some(pattern => pattern.test(content));
}

// Fonction pour remplacer les placeholders génériques
function replaceGenericPlaceholders(content, title, domain) {
  let result = content;
  
  // Remplacer les placeholders génériques par des indications
  result = result.replace(
    /\[Description avec statistiques selon source fiable 2024\]/gi,
    '_[À compléter avec statistiques et sources fiables selon ARTICLES_RULES.md]_'
  );
  
  result = result.replace(
    /\[Définition complète du sujet avec sources\]/gi,
    '_[À compléter avec définition complète et sources fiables selon ARTICLES_RULES.md]_'
  );
  
  result = result.replace(
    /\[Observation personnelle basée sur l'expérience terrain\]/gi,
    '_[À compléter avec observation personnelle basée sur l\'expérience terrain selon ARTICLES_RULES.md]_'
  );
  
  result = result.replace(
    /\[Nuance d'expert\]/gi,
    '_[À compléter avec nuance d\'expert selon ARTICLES_RULES.md]_'
  );
  
  result = result.replace(
    /\[Source fiable\]/gi,
    '_[À compléter avec source fiable]_'
  );
  
  result = result.replace(
    /\[statistique pertinente\]/gi,
    '_[À compléter avec statistique pertinente]_'
  );
  
  result = result.replace(
    /\[Définition avec statistiques selon source fiable 2024\]/gi,
    '_[À compléter avec définition, statistiques et source fiable selon ARTICLES_RULES.md]_'
  );
  
  result = result.replace(
    /\[Cas d'usage avec statistiques selon source 2024\]/gi,
    '_[À compléter avec cas d\'usage, statistiques et source selon ARTICLES_RULES.md]_'
  );
  
  result = result.replace(
    /\[Impact avec statistiques selon source fiable 2024\]/gi,
    '_[À compléter avec impact, statistiques et source fiable selon ARTICLES_RULES.md]_'
  );
  
  result = result.replace(
    /\[Défi avec statistiques selon source fiable 2024\]/gi,
    '_[À compléter avec défi, statistiques et source fiable selon ARTICLES_RULES.md]_'
  );
  
  result = result.replace(
    /\[Impact spécifique\]/gi,
    '_[À compléter avec impact spécifique]_'
  );
  
  result = result.replace(
    /\[Description\]/gi,
    '_[À compléter avec description]_'
  );
  
  result = result.replace(
    /\[Critères\]/gi,
    '_[À compléter avec critères]_'
  );
  
  result = result.replace(
    /\[Exemples\]/gi,
    '_[À compléter avec exemples]_'
  );
  
  result = result.replace(
    /\[%\]/gi,
    '_[À compléter avec pourcentage]_'
  );
  
  result = result.replace(
    /\[Niveau\]/gi,
    '_[À compléter avec niveau]_'
  );
  
  return result;
}

// Fonction pour vérifier et corriger l'ordre des sections
function ensureCorrectSectionOrder(content) {
  const requiredSections = [
    { order: 0, pattern: /^##\s+Introduction/i, name: 'Introduction' },
    { order: 1, pattern: /^##\s+1\.\s*FONDAMENTAUX\s+DU\s+SUJET/i, name: '1. FONDAMENTAUX DU SUJET' },
    { order: 2, pattern: /^##\s+2\.\s*ANALYSE\s+APPROFONDIE/i, name: '2. ANALYSE APPROFONDIE' },
    { order: 3, pattern: /^##\s+3\.\s*STRATÉGIES\s+ET\s+MÉTHODOLOGIES/i, name: '3. STRATÉGIES ET MÉTHODOLOGIES' },
    { order: 4, pattern: /^##\s+4\.\s*OUTILS\s+ET\s+TECHNOLOGIES/i, name: '4. OUTILS ET TECHNOLOGIES' },
    { order: 5, pattern: /^##\s+5\.\s*DÉFIS\s+ET\s+SOLUTIONS/i, name: '5. DÉFIS ET SOLUTIONS' },
    { order: 6, pattern: /^##\s+6\.\s*SOURCES\s+ET\s+RÉFÉRENCES/i, name: '6. SOURCES ET RÉFÉRENCES' },
    { order: 7, pattern: /^##\s+7\.\s*ARTICLES\s+ANNEXES/i, name: '7. ARTICLES ANNEXES' }
  ];
  
  // Vérifier si toutes les sections existent et dans le bon ordre
  const foundSections = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    requiredSections.forEach(section => {
      if (section.pattern.test(line)) {
        foundSections.push({
          name: section.name,
          order: section.order,
          lineIndex: index,
          line: line
        });
      }
    });
  });
  
  // Vérifier l'ordre
  let correctOrder = true;
  for (let i = 0; i < foundSections.length - 1; i++) {
    if (foundSections[i].order > foundSections[i + 1].order) {
      correctOrder = false;
      break;
    }
  }
  
  return {
    correctOrder,
    foundSections,
    missingSections: requiredSections.filter(section => 
      !foundSections.some(fs => fs.name === section.name)
    )
  };
}

// Fonction pour traiter un article
function processArticle(filePath, domain) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  
  if (!hasPlaceholders(body)) {
    return { processed: false, reason: 'Aucun placeholder trouvé' };
  }
  
  console.log(`\n📝 Traitement: ${path.basename(filePath)}`);
  
  // Remplacer les placeholders génériques
  let newBody = replaceGenericPlaceholders(body, data.title || '', domain);
  
  // Vérifier l'ordre des sections
  const sectionCheck = ensureCorrectSectionOrder(newBody);
  
  if (!sectionCheck.correctOrder) {
    console.log(`  ⚠️  Ordre des sections à vérifier`);
  }
  
  if (sectionCheck.missingSections.length > 0) {
    console.log(`  ⚠️  Sections manquantes: ${sectionCheck.missingSections.map(s => s.name).join(', ')}`);
  }
  
  // Vérifier les sources
  const sourcesMatch = newBody.match(/##\s+6\.\s*SOURCES\s+ET\s+RÉFÉRENCES[\s\S]*?(?=##|$)/i);
  let sourceCount = 0;
  if (sourcesMatch) {
    const sourceLines = sourcesMatch[0].match(/^- /g);
    sourceCount = sourceLines ? sourceLines.length : 0;
  }
  
  if (sourceCount < 4) {
    console.log(`  ⚠️  Sources insuffisantes: ${sourceCount} trouvées (minimum 4 requis)`);
  }
  
  // Sauvegarder le fichier
  const newContent = matter.stringify(newBody, data);
  fs.writeFileSync(filePath, newContent, 'utf-8');
  
  return {
    processed: true,
    hasPlaceholders: hasPlaceholders(newBody),
    sectionOrder: sectionCheck.correctOrder,
    missingSections: sectionCheck.missingSections.length,
    sourceCount
  };
}

// Traiter un domaine
function processDomain(domain) {
  const domainPath = path.join(articlesDir, domain);
  
  if (!fs.existsSync(domainPath)) {
    console.log(`\n⚠️  Domaine non trouvé: ${domain}`);
    return { processed: 0, total: 0 };
  }
  
  const files = fs.readdirSync(domainPath)
    .filter(file => file.endsWith('.md') && !file.startsWith('_'));
  
  console.log(`\n📂 Domaine: ${domain} (${files.length} articles)`);
  console.log('='.repeat(80));
  
  let processed = 0;
  const results = [];
  
  files.forEach(file => {
    const filePath = path.join(domainPath, file);
    const result = processArticle(filePath, domain);
    
    if (result.processed) {
      processed++;
      results.push({
        file,
        ...result
      });
    }
  });
  
  return {
    domain,
    processed,
    total: files.length,
    results
  };
}

// Traiter tous les domaines
function processAllDomains() {
  const summary = {
    totalProcessed: 0,
    totalArticles: 0,
    byDomain: {}
  };
  
  DOMAINS_ORDER.forEach(domain => {
    const result = processDomain(domain);
    summary.totalProcessed += result.processed;
    summary.totalArticles += result.total;
    summary.byDomain[domain] = result;
  });
  
  // Afficher le résumé
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 RÉSUMÉ DE LA COMPLÉTION');
  console.log('='.repeat(80));
  console.log(`\nTotal d'articles traités: ${summary.totalProcessed} / ${summary.totalArticles}`);
  
  console.log('\n📋 Par domaine:\n');
  Object.keys(summary.byDomain).forEach(domain => {
    const result = summary.byDomain[domain];
    if (result.processed > 0) {
      console.log(`  ${domain}: ${result.processed} / ${result.total} articles traités`);
    }
  });
  
  // Sauvegarder le rapport
  fs.writeFileSync(
    path.join(__dirname, '../RAPPORT_COMPLETION_AUTOMATIQUE.json'),
    JSON.stringify(summary, null, 2),
    'utf-8'
  );
  
  console.log(`\n✅ Rapport sauvegardé dans RAPPORT_COMPLETION_AUTOMATIQUE.json`);
  console.log('\n📝 Note: Les placeholders ont été remplacés par des indications.');
  console.log('   Les sections doivent être complétées manuellement avec des recherches web.');
  console.log('   Minimum 4-5 sources fiables par article requis.\n');
}

// Lancer le traitement
processAllDomains();

import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');

console.log('\n🔧 Complétion automatique des articles par domaine\n');
console.log('='.repeat(80));

// Domaines à traiter par ordre de priorité
const DOMAINS_ORDER = [
  'developpement-web',
  'gestion-talents',
  'formation',
  'gestion-projet',
  'productivite-methodes',
  'qualite-process',
  'marketing-communication',
  'leadership-management',
  'transformation-digitale',
  'service-client',
  'reconversion-carriere',
  'outils-techniques',
  'innovation-technologies',
  'gestion-connaissances',
  'developpement-commercial',
  'articles-generaux'
];

// Fonction pour détecter les placeholders
function hasPlaceholders(content) {
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
  
  return placeholders.some(pattern => pattern.test(content));
}

// Fonction pour remplacer les placeholders génériques
function replaceGenericPlaceholders(content, title, domain) {
  let result = content;
  
  // Remplacer les placeholders génériques par des indications
  result = result.replace(
    /\[Description avec statistiques selon source fiable 2024\]/gi,
    '_[À compléter avec statistiques et sources fiables selon ARTICLES_RULES.md]_'
  );
  
  result = result.replace(
    /\[Définition complète du sujet avec sources\]/gi,
    '_[À compléter avec définition complète et sources fiables selon ARTICLES_RULES.md]_'
  );
  
  result = result.replace(
    /\[Observation personnelle basée sur l'expérience terrain\]/gi,
    '_[À compléter avec observation personnelle basée sur l\'expérience terrain selon ARTICLES_RULES.md]_'
  );
  
  result = result.replace(
    /\[Nuance d'expert\]/gi,
    '_[À compléter avec nuance d\'expert selon ARTICLES_RULES.md]_'
  );
  
  result = result.replace(
    /\[Source fiable\]/gi,
    '_[À compléter avec source fiable]_'
  );
  
  result = result.replace(
    /\[statistique pertinente\]/gi,
    '_[À compléter avec statistique pertinente]_'
  );
  
  result = result.replace(
    /\[Définition avec statistiques selon source fiable 2024\]/gi,
    '_[À compléter avec définition, statistiques et source fiable selon ARTICLES_RULES.md]_'
  );
  
  result = result.replace(
    /\[Cas d'usage avec statistiques selon source 2024\]/gi,
    '_[À compléter avec cas d\'usage, statistiques et source selon ARTICLES_RULES.md]_'
  );
  
  result = result.replace(
    /\[Impact avec statistiques selon source fiable 2024\]/gi,
    '_[À compléter avec impact, statistiques et source fiable selon ARTICLES_RULES.md]_'
  );
  
  result = result.replace(
    /\[Défi avec statistiques selon source fiable 2024\]/gi,
    '_[À compléter avec défi, statistiques et source fiable selon ARTICLES_RULES.md]_'
  );
  
  result = result.replace(
    /\[Impact spécifique\]/gi,
    '_[À compléter avec impact spécifique]_'
  );
  
  result = result.replace(
    /\[Description\]/gi,
    '_[À compléter avec description]_'
  );
  
  result = result.replace(
    /\[Critères\]/gi,
    '_[À compléter avec critères]_'
  );
  
  result = result.replace(
    /\[Exemples\]/gi,
    '_[À compléter avec exemples]_'
  );
  
  result = result.replace(
    /\[%\]/gi,
    '_[À compléter avec pourcentage]_'
  );
  
  result = result.replace(
    /\[Niveau\]/gi,
    '_[À compléter avec niveau]_'
  );
  
  return result;
}

// Fonction pour vérifier et corriger l'ordre des sections
function ensureCorrectSectionOrder(content) {
  const requiredSections = [
    { order: 0, pattern: /^##\s+Introduction/i, name: 'Introduction' },
    { order: 1, pattern: /^##\s+1\.\s*FONDAMENTAUX\s+DU\s+SUJET/i, name: '1. FONDAMENTAUX DU SUJET' },
    { order: 2, pattern: /^##\s+2\.\s*ANALYSE\s+APPROFONDIE/i, name: '2. ANALYSE APPROFONDIE' },
    { order: 3, pattern: /^##\s+3\.\s*STRATÉGIES\s+ET\s+MÉTHODOLOGIES/i, name: '3. STRATÉGIES ET MÉTHODOLOGIES' },
    { order: 4, pattern: /^##\s+4\.\s*OUTILS\s+ET\s+TECHNOLOGIES/i, name: '4. OUTILS ET TECHNOLOGIES' },
    { order: 5, pattern: /^##\s+5\.\s*DÉFIS\s+ET\s+SOLUTIONS/i, name: '5. DÉFIS ET SOLUTIONS' },
    { order: 6, pattern: /^##\s+6\.\s*SOURCES\s+ET\s+RÉFÉRENCES/i, name: '6. SOURCES ET RÉFÉRENCES' },
    { order: 7, pattern: /^##\s+7\.\s*ARTICLES\s+ANNEXES/i, name: '7. ARTICLES ANNEXES' }
  ];
  
  // Vérifier si toutes les sections existent et dans le bon ordre
  const foundSections = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    requiredSections.forEach(section => {
      if (section.pattern.test(line)) {
        foundSections.push({
          name: section.name,
          order: section.order,
          lineIndex: index,
          line: line
        });
      }
    });
  });
  
  // Vérifier l'ordre
  let correctOrder = true;
  for (let i = 0; i < foundSections.length - 1; i++) {
    if (foundSections[i].order > foundSections[i + 1].order) {
      correctOrder = false;
      break;
    }
  }
  
  return {
    correctOrder,
    foundSections,
    missingSections: requiredSections.filter(section => 
      !foundSections.some(fs => fs.name === section.name)
    )
  };
}

// Fonction pour traiter un article
function processArticle(filePath, domain) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  
  if (!hasPlaceholders(body)) {
    return { processed: false, reason: 'Aucun placeholder trouvé' };
  }
  
  console.log(`\n📝 Traitement: ${path.basename(filePath)}`);
  
  // Remplacer les placeholders génériques
  let newBody = replaceGenericPlaceholders(body, data.title || '', domain);
  
  // Vérifier l'ordre des sections
  const sectionCheck = ensureCorrectSectionOrder(newBody);
  
  if (!sectionCheck.correctOrder) {
    console.log(`  ⚠️  Ordre des sections à vérifier`);
  }
  
  if (sectionCheck.missingSections.length > 0) {
    console.log(`  ⚠️  Sections manquantes: ${sectionCheck.missingSections.map(s => s.name).join(', ')}`);
  }
  
  // Vérifier les sources
  const sourcesMatch = newBody.match(/##\s+6\.\s*SOURCES\s+ET\s+RÉFÉRENCES[\s\S]*?(?=##|$)/i);
  let sourceCount = 0;
  if (sourcesMatch) {
    const sourceLines = sourcesMatch[0].match(/^- /g);
    sourceCount = sourceLines ? sourceLines.length : 0;
  }
  
  if (sourceCount < 4) {
    console.log(`  ⚠️  Sources insuffisantes: ${sourceCount} trouvées (minimum 4 requis)`);
  }
  
  // Sauvegarder le fichier
  const newContent = matter.stringify(newBody, data);
  fs.writeFileSync(filePath, newContent, 'utf-8');
  
  return {
    processed: true,
    hasPlaceholders: hasPlaceholders(newBody),
    sectionOrder: sectionCheck.correctOrder,
    missingSections: sectionCheck.missingSections.length,
    sourceCount
  };
}

// Traiter un domaine
function processDomain(domain) {
  const domainPath = path.join(articlesDir, domain);
  
  if (!fs.existsSync(domainPath)) {
    console.log(`\n⚠️  Domaine non trouvé: ${domain}`);
    return { processed: 0, total: 0 };
  }
  
  const files = fs.readdirSync(domainPath)
    .filter(file => file.endsWith('.md') && !file.startsWith('_'));
  
  console.log(`\n📂 Domaine: ${domain} (${files.length} articles)`);
  console.log('='.repeat(80));
  
  let processed = 0;
  const results = [];
  
  files.forEach(file => {
    const filePath = path.join(domainPath, file);
    const result = processArticle(filePath, domain);
    
    if (result.processed) {
      processed++;
      results.push({
        file,
        ...result
      });
    }
  });
  
  return {
    domain,
    processed,
    total: files.length,
    results
  };
}

// Traiter tous les domaines
function processAllDomains() {
  const summary = {
    totalProcessed: 0,
    totalArticles: 0,
    byDomain: {}
  };
  
  DOMAINS_ORDER.forEach(domain => {
    const result = processDomain(domain);
    summary.totalProcessed += result.processed;
    summary.totalArticles += result.total;
    summary.byDomain[domain] = result;
  });
  
  // Afficher le résumé
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 RÉSUMÉ DE LA COMPLÉTION');
  console.log('='.repeat(80));
  console.log(`\nTotal d'articles traités: ${summary.totalProcessed} / ${summary.totalArticles}`);
  
  console.log('\n📋 Par domaine:\n');
  Object.keys(summary.byDomain).forEach(domain => {
    const result = summary.byDomain[domain];
    if (result.processed > 0) {
      console.log(`  ${domain}: ${result.processed} / ${result.total} articles traités`);
    }
  });
  
  // Sauvegarder le rapport
  fs.writeFileSync(
    path.join(__dirname, '../RAPPORT_COMPLETION_AUTOMATIQUE.json'),
    JSON.stringify(summary, null, 2),
    'utf-8'
  );
  
  console.log(`\n✅ Rapport sauvegardé dans RAPPORT_COMPLETION_AUTOMATIQUE.json`);
  console.log('\n📝 Note: Les placeholders ont été remplacés par des indications.');
  console.log('   Les sections doivent être complétées manuellement avec des recherches web.');
  console.log('   Minimum 4-5 sources fiables par article requis.\n');
}

// Lancer le traitement
processAllDomains();

