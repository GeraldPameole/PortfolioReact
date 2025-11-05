import fs from 'fs';
import path from 'path';

const articlesDir = './src/content/articles';
const rulesFile = './ARTICLES_RULES.md';

// Lire les règles
const rulesContent = fs.readFileSync(rulesFile, 'utf-8');

// Critères de conformité basés sur ARTICLES_RULES.md
const complianceCriteria = {
  structure: {
    requiredSections: [
      '## 1. FONDAMENTAUX DU SUJET',
      '## 2. ANALYSE APPROFONDIE',
      '## 3. STRATÉGIES ET MÉTHODOLOGIES',
      '## 4. OUTILS ET TECHNOLOGIES'
    ],
    optionalSections: [
      '## 5. DÉFIS ET SOLUTIONS',
      '## 6. BONNES PRATIQUES',
      '## 7. CAS CONCRETS',
      '## 8. PROCHAINES ÉTAPES'
    ]
  },
  expertise: {
    patterns: [
      /(?:après|après avoir|mon expérience|j'ai|mes projets|j'ai observé|j'ai constaté|selon mon expérience)/i,
      /(?:dans ma pratique|sur le terrain|en travaillant avec)/i,
      /(?:les \d+ projets|plus de \d+|environ \d+)/i
    ]
  },
  sources: {
    required: true,
    pattern: /\[\^?\d+\]:/g
  },
  quantification: {
    patterns: [
      /\d+%|%\d+/,
      /\d+ projets|\d+ entreprises|\d+ années/
    ]
  }
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

// Analyser un article
function analyzeArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const domain = path.basename(path.dirname(filePath));
  
  const issues = [];
  const strengths = [];
  
  // Vérifier la structure
  const hasRequiredSections = complianceCriteria.structure.requiredSections.every(section => 
    content.includes(section)
  );
  
  if (!hasRequiredSections) {
    const missing = complianceCriteria.structure.requiredSections.filter(section => 
      !content.includes(section)
    );
    issues.push(`Sections manquantes: ${missing.join(', ')}`);
  } else {
    strengths.push('Structure complète avec toutes les sections requises');
  }
  
  // Vérifier l'expertise
  const hasExpertise = complianceCriteria.expertise.patterns.some(pattern => 
    pattern.test(content)
  );
  
  if (!hasExpertise) {
    issues.push('Manque d\'éléments d\'expertise personnelle (expérience, projets, observations)');
  } else {
    strengths.push('Contient des éléments d\'expertise personnelle');
  }
  
  // Vérifier les sources
  const hasSources = complianceCriteria.sources.pattern.test(content);
  
  if (!hasSources) {
    issues.push('Aucune source référencée trouvée');
  } else {
    const sourceCount = (content.match(complianceCriteria.sources.pattern) || []).length;
    strengths.push(`${sourceCount} source(s) référencée(s)`);
  }
  
  // Vérifier la quantification
  const hasQuantification = complianceCriteria.quantification.patterns.some(pattern => 
    pattern.test(content)
  );
  
  if (!hasQuantification) {
    issues.push('Manque de chiffres et de quantification');
  } else {
    strengths.push('Contient des chiffres et des données quantifiées');
  }
  
  // Vérifier la longueur minimale
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 1000) {
    issues.push(`Article trop court (${wordCount} mots, minimum recommandé: 1000)`);
  } else {
    strengths.push(`Article de ${wordCount} mots`);
  }
  
  // Vérifier les formules rhétoriques d'expertise
  const expertiseFormulas = [
    /(?:Mon expérience|Dans ma pratique|Les projets que j'ai)/i,
    /(?:j'ai constaté|j'ai observé|j'ai appris)/i,
    /(?:selon mon expérience|après X années)/i
  ];
  
  const hasExpertiseFormulas = expertiseFormulas.some(pattern => pattern.test(content));
  if (!hasExpertiseFormulas) {
    issues.push('Manque de formules rhétoriques d\'expertise');
  }
  
  return {
    filename,
    domain,
    path: filePath,
    issues,
    strengths,
    compliant: issues.length === 0,
    score: Math.max(0, 100 - (issues.length * 20))
  };
}

// Analyser tous les articles
console.log('🔍 Analyse de conformité des articles selon ARTICLES_RULES.md\n');
console.log('='.repeat(80));

const allArticles = getAllMdFiles(articlesDir);
const results = allArticles.map(analyzeArticle);

// Trier par conformité
const compliant = results.filter(r => r.compliant);
const nonCompliant = results.filter(r => !r.compliant);

console.log(`\n📊 RÉSULTATS GLOBAUX:\n`);
console.log(`Total d'articles: ${results.length}`);
console.log(`✅ Articles conformes: ${compliant.length} (${Math.round(compliant.length/results.length*100)}%)`);
console.log(`❌ Articles non conformes: ${nonCompliant.length} (${Math.round(nonCompliant.length/results.length*100)}%)\n`);

// Afficher les articles non conformes
if (nonCompliant.length > 0) {
  console.log('❌ ARTICLES NON CONFORMES:\n');
  nonCompliant.forEach(article => {
    console.log(`\n📄 ${article.domain}/${article.filename}`);
    console.log(`   Score: ${article.score}/100`);
    console.log(`   Points forts: ${article.strengths.join(', ')}`);
    console.log(`   Problèmes:`);
    article.issues.forEach(issue => {
      console.log(`     - ${issue}`);
    });
  });
}

// Résumé par domaine
console.log('\n\n📊 RÉSUMÉ PAR DOMAINE:\n');
const byDomain = {};
results.forEach(article => {
  if (!byDomain[article.domain]) {
    byDomain[article.domain] = { total: 0, compliant: 0, issues: [] };
  }
  byDomain[article.domain].total++;
  if (article.compliant) {
    byDomain[article.domain].compliant++;
  } else {
    byDomain[article.domain].issues.push(...article.issues);
  }
});

Object.entries(byDomain).forEach(([domain, stats]) => {
  const percentage = Math.round((stats.compliant / stats.total) * 100);
  console.log(`${domain}: ${stats.compliant}/${stats.total} conformes (${percentage}%)`);
});

console.log('\n' + '='.repeat(80));

