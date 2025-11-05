import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../src/content/articles/gestion-talents/gestion-talents-valuation.md');

console.log('\n🔧 Réorganisation de l\'article gestion-talents-valuation.md\n');
console.log('='.repeat(80));

const content = fs.readFileSync(filePath, 'utf-8');
const { data, content: body } = matter(content);

// Extraire les sections dans l'ordre correct
const sections = {
  introduction: '',
  section1: '',
  section2: '',
  section3: '',
  section4: '',
  section5: '',
  section6: '',
  section7: ''
};

// 1. Introduction
const introMatch = body.match(/^##\s+Introduction[\s\S]*?(?=^##\s+[0-9]|^##\s+[A-Z]|$)/m);
if (introMatch) {
  sections.introduction = introMatch[0].trim();
}

// 2. Section 1. FONDAMENTAUX DU SUJET (déjà complétée)
const section1Match = body.match(/^##\s+1\.\s+FONDAMENTAUX\s+DU\s+SUJET[\s\S]*?(?=^##\s+[0-9]|^##\s+[A-Z]|$)/m);
if (section1Match) {
  sections.section1 = section1Match[0].trim();
}

// 3. Section 2. ANALYSE APPROFONDIE (déjà complétée)
const section2Match = body.match(/^##\s+2\.\s+ANALYSE\s+APPROFONDIE[\s\S]*?(?=^##\s+[0-9]|^##\s+[A-Z]|$)/m);
if (section2Match) {
  sections.section2 = section2Match[0].trim();
}

// 4. Section 3. STRATÉGIES ET MÉTHODOLOGIES
// Extraire le contenu de la méthodologie V.A.L.O.R.I.S.A.T.I.O.N.
const section3Start = body.indexOf('## 3. STRATÉGIES ET MÉTHODOLOGIES');
const section3End = body.indexOf('## 4. OUTILS', section3Start);
if (section3Start !== -1) {
  let section3Content = body.substring(section3Start, section3End !== -1 ? section3End : body.indexOf('## 5. DÉFIS', section3Start));
  if (section3End === -1) {
    section3Content = body.substring(section3Start, body.indexOf('## 4. OUTILS', section3Start));
  }
  if (section3End === -1 && section3Content.indexOf('## 4. OUTILS') === -1) {
    section3Content = body.substring(section3Start);
  }
  sections.section3 = section3Content.trim();
}

// 5. Section 4. OUTILS ET TECHNOLOGIES
// Garder le contenu existant de la section 4
const section4Start = body.indexOf('## 4. OUTILS');
const section4End = body.indexOf('## 5. DÉFIS', section4Start);
if (section4Start !== -1) {
  let section4Content = body.substring(section4Start, section4End !== -1 ? section4End : body.length);
  sections.section4 = section4Content.trim();
}

// 6. Section 5. DÉFIS ET SOLUTIONS
// Garder le contenu existant de la section 5
const section5Start = body.indexOf('## 5. DÉFIS');
const section5End = body.indexOf('## 6. SOURCES', section5Start);
if (section5Start !== -1) {
  let section5Content = body.substring(section5Start, section5End !== -1 ? section5End : body.length);
  sections.section5 = section5Content.trim();
}

// 7. Section 6. SOURCES ET RÉFÉRENCES
const section6Match = body.match(/^##\s+6\.\s+SOURCES\s+ET\s+RÉFÉRENCES[\s\S]*?(?=^##\s+7|$)/m);
if (section6Match) {
  sections.section6 = section6Match[0].trim();
}

// 8. Section 7. ARTICLES ANNEXES
const section7Match = body.match(/^##\s+7\.\s+ARTICLES\s+ANNEXES[\s\S]*$/m);
if (section7Match) {
  sections.section7 = section7Match[0].trim();
}

// Construire le nouveau contenu dans l'ordre correct
let newBody = '';

// Introduction
if (sections.introduction) {
  newBody += sections.introduction + '\n\n';
}

// 1. FONDAMENTAUX DU SUJET
if (sections.section1) {
  newBody += sections.section1 + '\n\n';
}

// 2. ANALYSE APPROFONDIE
if (sections.section2) {
  newBody += sections.section2 + '\n\n';
}

// 3. STRATÉGIES ET MÉTHODOLOGIES
if (sections.section3) {
  // Nettoyer la section 3 pour enlever les doublons
  let section3 = sections.section3;
  // S'assurer que c'est bien "## 3. STRATÉGIES ET MÉTHODOLOGIES"
  section3 = section3.replace(/^##\s+3\.\s+STRATÉGIES\s+ET\s+MÉTHODOLOGIES.*?\n/m, '## 3. STRATÉGIES ET MÉTHODOLOGIES\n\n');
  newBody += section3 + '\n\n';
}

// 4. OUTILS ET TECHNOLOGIES
if (sections.section4) {
  // Nettoyer la section 4 pour enlever les doublons
  let section4 = sections.section4;
  section4 = section4.replace(/^##\s+4\.\s+OUTILS.*?\n/m, '## 4. OUTILS ET TECHNOLOGIES\n\n');
  // Supprimer les doublons dans la section 4
  section4 = section4.replace(/### Comparatif d'Outils - Retour d'Expérience Personnel[\s\S]*?(?=###|##|$)/g, '');
  newBody += section4 + '\n\n';
}

// 5. DÉFIS ET SOLUTIONS
if (sections.section5) {
  // Nettoyer la section 5
  let section5 = sections.section5;
  section5 = section5.replace(/^##\s+5\.\s+DÉFIS.*?\n/m, '## 5. DÉFIS ET SOLUTIONS\n\n');
  newBody += section5 + '\n\n';
}

// 6. SOURCES ET RÉFÉRENCES
if (sections.section6) {
  newBody += sections.section6 + '\n\n';
}

// 7. ARTICLES ANNEXES
if (sections.section7) {
  newBody += sections.section7 + '\n\n';
}

// Nettoyer les lignes vides multiples
newBody = newBody.replace(/\n{4,}/g, '\n\n\n');

// Écrire le fichier
const newContent = matter.stringify(newBody, data);
fs.writeFileSync(filePath, newContent, 'utf-8');

console.log('✅ Article réorganisé avec succès');
console.log('\nStructure finale:');
console.log('1. Introduction');
console.log('2. 1. FONDAMENTAUX DU SUJET');
console.log('3. 2. ANALYSE APPROFONDIE');
console.log('4. 3. STRATÉGIES ET MÉTHODOLOGIES');
console.log('5. 4. OUTILS ET TECHNOLOGIES');
console.log('6. 5. DÉFIS ET SOLUTIONS');
console.log('7. 6. SOURCES ET RÉFÉRENCES');
console.log('8. 7. ARTICLES ANNEXES');
console.log('\n✅ Terminé\n');

import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../src/content/articles/gestion-talents/gestion-talents-valuation.md');

console.log('\n🔧 Réorganisation de l\'article gestion-talents-valuation.md\n');
console.log('='.repeat(80));

const content = fs.readFileSync(filePath, 'utf-8');
const { data, content: body } = matter(content);

// Extraire les sections dans l'ordre correct
const sections = {
  introduction: '',
  section1: '',
  section2: '',
  section3: '',
  section4: '',
  section5: '',
  section6: '',
  section7: ''
};

// 1. Introduction
const introMatch = body.match(/^##\s+Introduction[\s\S]*?(?=^##\s+[0-9]|^##\s+[A-Z]|$)/m);
if (introMatch) {
  sections.introduction = introMatch[0].trim();
}

// 2. Section 1. FONDAMENTAUX DU SUJET (déjà complétée)
const section1Match = body.match(/^##\s+1\.\s+FONDAMENTAUX\s+DU\s+SUJET[\s\S]*?(?=^##\s+[0-9]|^##\s+[A-Z]|$)/m);
if (section1Match) {
  sections.section1 = section1Match[0].trim();
}

// 3. Section 2. ANALYSE APPROFONDIE (déjà complétée)
const section2Match = body.match(/^##\s+2\.\s+ANALYSE\s+APPROFONDIE[\s\S]*?(?=^##\s+[0-9]|^##\s+[A-Z]|$)/m);
if (section2Match) {
  sections.section2 = section2Match[0].trim();
}

// 4. Section 3. STRATÉGIES ET MÉTHODOLOGIES
// Extraire le contenu de la méthodologie V.A.L.O.R.I.S.A.T.I.O.N.
const section3Start = body.indexOf('## 3. STRATÉGIES ET MÉTHODOLOGIES');
const section3End = body.indexOf('## 4. OUTILS', section3Start);
if (section3Start !== -1) {
  let section3Content = body.substring(section3Start, section3End !== -1 ? section3End : body.indexOf('## 5. DÉFIS', section3Start));
  if (section3End === -1) {
    section3Content = body.substring(section3Start, body.indexOf('## 4. OUTILS', section3Start));
  }
  if (section3End === -1 && section3Content.indexOf('## 4. OUTILS') === -1) {
    section3Content = body.substring(section3Start);
  }
  sections.section3 = section3Content.trim();
}

// 5. Section 4. OUTILS ET TECHNOLOGIES
// Garder le contenu existant de la section 4
const section4Start = body.indexOf('## 4. OUTILS');
const section4End = body.indexOf('## 5. DÉFIS', section4Start);
if (section4Start !== -1) {
  let section4Content = body.substring(section4Start, section4End !== -1 ? section4End : body.length);
  sections.section4 = section4Content.trim();
}

// 6. Section 5. DÉFIS ET SOLUTIONS
// Garder le contenu existant de la section 5
const section5Start = body.indexOf('## 5. DÉFIS');
const section5End = body.indexOf('## 6. SOURCES', section5Start);
if (section5Start !== -1) {
  let section5Content = body.substring(section5Start, section5End !== -1 ? section5End : body.length);
  sections.section5 = section5Content.trim();
}

// 7. Section 6. SOURCES ET RÉFÉRENCES
const section6Match = body.match(/^##\s+6\.\s+SOURCES\s+ET\s+RÉFÉRENCES[\s\S]*?(?=^##\s+7|$)/m);
if (section6Match) {
  sections.section6 = section6Match[0].trim();
}

// 8. Section 7. ARTICLES ANNEXES
const section7Match = body.match(/^##\s+7\.\s+ARTICLES\s+ANNEXES[\s\S]*$/m);
if (section7Match) {
  sections.section7 = section7Match[0].trim();
}

// Construire le nouveau contenu dans l'ordre correct
let newBody = '';

// Introduction
if (sections.introduction) {
  newBody += sections.introduction + '\n\n';
}

// 1. FONDAMENTAUX DU SUJET
if (sections.section1) {
  newBody += sections.section1 + '\n\n';
}

// 2. ANALYSE APPROFONDIE
if (sections.section2) {
  newBody += sections.section2 + '\n\n';
}

// 3. STRATÉGIES ET MÉTHODOLOGIES
if (sections.section3) {
  // Nettoyer la section 3 pour enlever les doublons
  let section3 = sections.section3;
  // S'assurer que c'est bien "## 3. STRATÉGIES ET MÉTHODOLOGIES"
  section3 = section3.replace(/^##\s+3\.\s+STRATÉGIES\s+ET\s+MÉTHODOLOGIES.*?\n/m, '## 3. STRATÉGIES ET MÉTHODOLOGIES\n\n');
  newBody += section3 + '\n\n';
}

// 4. OUTILS ET TECHNOLOGIES
if (sections.section4) {
  // Nettoyer la section 4 pour enlever les doublons
  let section4 = sections.section4;
  section4 = section4.replace(/^##\s+4\.\s+OUTILS.*?\n/m, '## 4. OUTILS ET TECHNOLOGIES\n\n');
  // Supprimer les doublons dans la section 4
  section4 = section4.replace(/### Comparatif d'Outils - Retour d'Expérience Personnel[\s\S]*?(?=###|##|$)/g, '');
  newBody += section4 + '\n\n';
}

// 5. DÉFIS ET SOLUTIONS
if (sections.section5) {
  // Nettoyer la section 5
  let section5 = sections.section5;
  section5 = section5.replace(/^##\s+5\.\s+DÉFIS.*?\n/m, '## 5. DÉFIS ET SOLUTIONS\n\n');
  newBody += section5 + '\n\n';
}

// 6. SOURCES ET RÉFÉRENCES
if (sections.section6) {
  newBody += sections.section6 + '\n\n';
}

// 7. ARTICLES ANNEXES
if (sections.section7) {
  newBody += sections.section7 + '\n\n';
}

// Nettoyer les lignes vides multiples
newBody = newBody.replace(/\n{4,}/g, '\n\n\n');

// Écrire le fichier
const newContent = matter.stringify(newBody, data);
fs.writeFileSync(filePath, newContent, 'utf-8');

console.log('✅ Article réorganisé avec succès');
console.log('\nStructure finale:');
console.log('1. Introduction');
console.log('2. 1. FONDAMENTAUX DU SUJET');
console.log('3. 2. ANALYSE APPROFONDIE');
console.log('4. 3. STRATÉGIES ET MÉTHODOLOGIES');
console.log('5. 4. OUTILS ET TECHNOLOGIES');
console.log('6. 5. DÉFIS ET SOLUTIONS');
console.log('7. 6. SOURCES ET RÉFÉRENCES');
console.log('8. 7. ARTICLES ANNEXES');
console.log('\n✅ Terminé\n');

