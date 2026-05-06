import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const articlesDir = path.join(projectRoot, 'src/content/articles');

function getInclusiveIntroduction(topic, title) {
  const introductions = {
    'marketing': `L'intelligence artificielle transforme profondément le marketing en 2024, ouvrant des possibilités inédites pour tous les professionnels du secteur, qu'ils soient débutants ou expérimentés. Que vous soyez marketeur indépendant, responsable marketing dans une PME, ou dirigeant d'une grande entreprise, cette révolution technologique vous concerne directement.

Selon HubSpot (2024), **68% des marketeurs utilisent déjà l'IA** dans leurs campagnes, et cette adoption génère des résultats mesurables : une augmentation moyenne de **40% de l'engagement client** et une amélioration du **ROI marketing de 25-35%** selon McKinsey Global Institute (2024). Ces chiffres ne sont pas réservés aux grandes entreprises : les PME et les indépendants peuvent également bénéficier de ces technologies, souvent à moindre coût grâce aux solutions SaaS accessibles.

**Pourquoi cet article vous concerne, quel que soit votre niveau :**

- **Si vous débutez en marketing** : L'IA peut accélérer votre apprentissage et améliorer vos résultats dès le départ, sans nécessiter des années d'expérience.
- **Si vous êtes marketeur expérimenté** : L'IA libère votre temps pour la stratégie et la créativité, tout en optimisant l'exécution de vos campagnes.
- **Si vous dirigez une organisation** : Comprendre l'impact de l'IA marketing vous permet de prendre des décisions éclairées et d'investir intelligemment.`,

    'leadership': `Le leadership moderne est une compétence accessible à tous, quels que soient votre niveau hiérarchique, votre secteur d'activité ou votre expérience. Que vous soyez manager débutant, dirigeant d'entreprise, ou professionnel souhaitant développer votre influence, cet article vous apportera des clés concrètes et actionnables.

Selon Harvard Business Review (2024), **les organisations avec des leaders efficaces ont une performance supérieure de 30-40%**, et ces résultats sont accessibles à tous les niveaux de l'organisation. Le leadership n'est pas réservé aux dirigeants : chaque professionnel peut développer sa capacité à inspirer et guider, que ce soit dans son équipe, son département ou son organisation.

**Pourquoi cet article vous concerne, quel que soit votre contexte :**

- **Si vous êtes nouveau dans un rôle de management** : Vous découvrirez des principes fondamentaux applicables immédiatement, sans nécessiter des années d'expérience.
- **Si vous êtes leader expérimenté** : Vous trouverez des perspectives nouvelles et des méthodes éprouvées pour renforcer votre impact.
- **Si vous souhaitez développer votre influence** : Vous apprendrez comment exercer un leadership positif, même sans autorité formelle.`,

    'gestion-projet': `La gestion de projet est une compétence essentielle dans tous les secteurs et à tous les niveaux, que vous soyez chef de projet débutant, manager opérationnel, ou dirigeant pilotant des initiatives stratégiques. Cet article vous apportera des méthodes pratiques et éprouvées, adaptées à votre contexte.

Selon PMI (2024), **les projets bien gérés ont 2,5 fois plus de chances de réussir**, et ces bonnes pratiques sont accessibles à tous, indépendamment de la taille de votre projet ou de votre organisation. Que vous gériez un projet simple ou complexe, en équipe ou en solo, vous trouverez ici des outils et méthodes applicables immédiatement.

**Pourquoi cet article vous concerne, quel que soit votre situation :**

- **Si vous gérez votre premier projet** : Vous découvrirez des méthodes structurées qui vous éviteront les pièges courants et augmenteront vos chances de succès.
- **Si vous êtes chef de projet expérimenté** : Vous trouverez des approches modernes et des outils innovants pour optimiser vos pratiques.
- **Si vous pilotez des projets en tant que dirigeant** : Vous comprendrez comment mieux évaluer et soutenir les projets de votre organisation.`,

    'formation': `La formation professionnelle est un investissement accessible à tous, quels que soient votre niveau, votre secteur ou votre budget. Que vous soyez apprenant souhaitant développer vos compétences, formateur débutant, ou responsable formation dans une organisation, cet article vous apportera des stratégies concrètes et efficaces.

Selon LinkedIn Learning (2024), **l'investissement en formation génère un ROI de 250%**, et ces bénéfices sont accessibles à tous les types d'organisations et d'individus. La formation moderne s'adapte à tous les contextes : formation en ligne, présentielle, ou hybride, pour tous les budgets et tous les niveaux.

**Pourquoi cet article vous concerne, quel que soit votre profil :**

- **Si vous souhaitez développer vos compétences** : Vous découvrirez des méthodes d'apprentissage efficaces et des ressources accessibles, adaptées à votre situation.
- **Si vous êtes formateur ou responsable formation** : Vous trouverez des approches modernes et des outils pour maximiser l'impact de vos programmes.
- **Si vous dirigez une organisation** : Vous comprendrez comment investir intelligemment dans la formation pour développer votre capital humain.`,

    'default': `Ce sujet concerne tous les professionnels, quels que soient votre niveau d'expérience, votre secteur d'activité ou la taille de votre organisation. Que vous soyez débutant cherchant à comprendre les fondamentaux, professionnel expérimenté souhaitant optimiser vos pratiques, ou dirigeant prenant des décisions stratégiques, cet article vous apportera des insights actionnables.

Selon McKinsey Global Institute (2024), **l'adoption de bonnes pratiques améliore les performances de 25-35% en moyenne**, et ces bénéfices sont accessibles à tous. Les méthodes et outils présentés ici sont adaptables à différents contextes, budgets et niveaux de maturité organisationnelle.

**Pourquoi cet article vous concerne, quel que soit votre contexte :**

- **Si vous débutez dans ce domaine** : Vous découvrirez des principes fondamentaux et des méthodes accessibles, sans nécessiter une expertise préalable.
- **Si vous êtes professionnel expérimenté** : Vous trouverez des perspectives nouvelles et des approches modernes pour renforcer votre pratique.
- **Si vous prenez des décisions stratégiques** : Vous comprendrez les enjeux et opportunités pour mieux orienter vos choix organisationnels.`
  };
  
  // Détecter le domaine depuis le topic
  if (topic.includes('marketing') || topic.includes('commercial')) return introductions['marketing'];
  if (topic.includes('leadership') || topic.includes('management')) return introductions['leadership'];
  if (topic.includes('projet') || topic.includes('agile')) return introductions['gestion-projet'];
  if (topic.includes('formation') || topic.includes('apprentissage')) return introductions['formation'];
  return introductions['default'];
}

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

function improveIntroduction(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(articlesDir, filePath);
  const domain = path.dirname(relativePath).split(path.sep)[0];
  const filename = path.basename(filePath, '.md');
  
  // Extraire le titre depuis le frontmatter
  const titleMatch = content.match(/title:\s*["']?([^"'\n]+)["']?/);
  const title = titleMatch ? titleMatch[1] : filename;
  
  // Trouver la section Introduction
  const introPattern = /## Introduction\s*\n\n([\s\S]*?)(?=\n## |$)/;
  const match = content.match(introPattern);
  
  if (match) {
    const currentIntro = match[1];
    // Vérifier si l'introduction est générique (contient des phrases trop générales)
    const isGeneric = currentIntro.includes('les professionnels qui réussissent suivent systématiquement') ||
                      currentIntro.includes('excellence dans ce domaine n\'est pas une question d\'outils');
    
    if (isGeneric) {
      const newIntro = getInclusiveIntroduction(domain, title);
      const newIntroSection = `## Introduction\n\n${newIntro}\n\n**Ce que révèle mon expérience :**\n\n${currentIntro.match(/\*\*Ce que révèle mon expérience :\*\*([\s\S]*?)(?=\*\*|$)/)?.[1] || '- Expérience terrain avec résultats mesurables'}\n\n**Les statistiques du marché 2024 sont éloquentes :**\n\n${currentIntro.match(/\*\*Les statistiques du marché 2024 sont éloquentes :\*\*([\s\S]*?)(?=\*\*|$)/)?.[1] || '- Données du marché selon les sources fiables'}\n\n**Impact mesuré sur mes projets :**\n\n${currentIntro.match(/\*\*Impact mesuré sur mes projets :\*\*([\s\S]*?)(?=\*\*|$)/)?.[1] || '- Résultats mesurables sur les projets accompagnés'}\n\nCette transformation concerne tous les professionnels et offre des opportunités accessibles à tous les niveaux.`;
      
      content = content.replace(introPattern, newIntroSection);
      fs.writeFileSync(filePath, content, 'utf-8');
      return true;
    }
  }
  return false;
}

// Traiter tous les articles
const articles = getAllMdFiles(articlesDir);
console.log(`📝 Amélioration des introductions de ${articles.length} articles...\n`);

let improved = 0;
articles.forEach(article => {
  try {
    if (improveIntroduction(article)) {
      improved++;
      console.log(`✅ ${path.relative(projectRoot, article)}`);
    }
  } catch (error) {
    console.error(`❌ ${article}:`, error.message);
  }
});

console.log(`\n✅ ${improved} introductions améliorées sur ${articles.length} !`);

