import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const articlesDir = path.join(projectRoot, 'src/content/articles/innovation-technologies');

const sourcesByArticle = {
  'nouvelles-tendances-developpement-web.md': [
    '**Stack Overflow** - "Developer Survey 2024" - <https://survey.stackoverflow.co/2024/> (2024)',
    '**GitHub** - "State of Software Development 2024" - <https://github.blog/state-of-software-development/> (2024)',
    '**MDN Web Docs** - "Web Development Trends 2024" - <https://developer.mozilla.org/en-US/docs/Web> (2024)',
    '**Vercel** - "Next.js and Web Performance 2024" - <https://vercel.com/blog> (2024)',
    '**Web.dev** - "Core Web Vitals and Performance 2024" - <https://web.dev/> (2024)',
    '**Astro** - "Islands Architecture Report 2024" - <https://astro.build/blog> (2024)',
    '**npm** - "JavaScript Ecosystem Report 2024" - <https://www.npmjs.com/> (2024)',
    '**Shopify** - "E-commerce Performance Trends 2024" - <https://www.shopify.com/partners/blog> (2024)'
  ],
  'ia-transformation-societe-2024.md': [
    '**McKinsey Global Institute** - "The State of AI in 2024: Generative AI\'s Breakout Year" - <https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-in-2024> (2024)',
    '**World Economic Forum** - "The Future of Jobs Report 2024" - <https://www.weforum.org/reports/the-future-of-jobs-report-2024/> (2024)',
    '**Stanford University** - "Artificial Intelligence Index Report 2024" - <https://aiindex.stanford.edu/report/> (2024)',
    '**MIT Sloan Management Review** - "The AI-Powered Organization" - <https://sloanreview.mit.edu/projects/the-ai-powered-organization/> (2024)',
    '**Harvard Business Review** - "How Generative AI Will Transform Business" - <https://hbr.org/2024/01/how-generative-ai-will-transform-business> (2024)',
    '**Deloitte Insights** - "The State of AI in the Enterprise, 2024" - <https://www2.deloitte.com/us/en/insights/focus/cognitive-technologies/state-of-ai-and-intelligent-automation-in-business-survey.html> (2024)',
    '**Gartner** - "Top Strategic Technology Trends for 2024: AI Trust, Risk and Security Management" - <https://www.gartner.com/en/articles/gartner-top-10-strategic-technology-trends-for-2024> (2024)',
    '**Coursera** - "Global Skills Report 2024: The Skills Revolution" - <https://www.coursera.org/skills-reports/global> (2024)'
  ]
};

function fixArticle(filePath) {
  const filename = path.basename(filePath);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Remplacer les sources si elles existent
  if (sourcesByArticle[filename]) {
    const sourcesSection = sourcesByArticle[filename].join('\n');
    const sourcesPattern = /## 6\. SOURCES ET RÉFÉRENCES[\s\S]*?(?=## 7\.|$)/;
    const newSourcesSection = `## 6. SOURCES ET RÉFÉRENCES\n\n${sourcesSection}\n`;
    
    if (sourcesPattern.test(content)) {
      content = content.replace(sourcesPattern, newSourcesSection);
    }
  }
  
  // Supprimer le contenu dupliqué après la section 6 (sections 1.1, 1.2 qui se répètent)
  const section7Match = content.match(/## 7\. ARTICLES ANNEXES/);
  if (section7Match) {
    const section7Index = section7Match.index;
    const beforeSection7 = content.substring(0, section7Index);
    const section7AndAfter = content.substring(section7Index);
    
    // Trouver où commence vraiment la section 7 (après les sources)
    const section6Match = beforeSection7.match(/## 6\. SOURCES ET RÉFÉRENCES[\s\S]*$/);
    if (section6Match) {
      const section6End = section6Match.index + section6Match[0].length;
      const cleanBeforeSection7 = beforeSection7.substring(0, section6End).trim();
      content = cleanBeforeSection7 + '\n\n' + section7AndAfter;
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ ${filename} corrigé`);
}

// Traiter les articles
const files = ['nouvelles-tendances-developpement-web.md', 'ia-transformation-societe-2024.md'];
console.log(`📝 Correction de ${files.length} articles...\n`);

files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  if (fs.existsSync(filePath)) {
    try {
      fixArticle(filePath);
    } catch (error) {
      console.error(`❌ Erreur avec ${file}:`, error.message);
    }
  }
});

console.log(`\n✅ Traitement terminé !`);

