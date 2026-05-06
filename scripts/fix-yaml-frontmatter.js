const fs = require('fs');
const path = require('path');
const glob = require('glob');

const articlesDir = path.join(__dirname, '../src/content/articles');

// Trouver tous les fichiers markdown
const files = glob.sync('**/*.md', { cwd: articlesDir });

let fixedCount = 0;
let errorCount = 0;

files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Vérifier si le fichier a un frontmatter mal formaté
  if (content.match(/^description >-\s*$/m)) {
    try {
      // Extraire le frontmatter
      const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
      if (!frontmatterMatch) {
        console.log(`⚠️  Pas de frontmatter trouvé dans ${file}`);
        return;
      }

      let frontmatter = frontmatterMatch[1];
      const restOfContent = content.substring(frontmatterMatch[0].length);

      // Corriger le format description >- avec -
      if (frontmatter.match(/^description >-\s*$/m)) {
        // Extraire la description
        const descMatch = frontmatter.match(/^description >-\s*\n\s*-\s*\n\s*(.*?)(?=\n\s*[a-zA-Z])/ms);
        if (descMatch) {
          const descText = descMatch[1].trim();
          
          // Remplacer la description mal formatée
          frontmatter = frontmatter.replace(
            /^description >-\s*\n\s*-\s*\n\s*.*?(?=\n\s*[a-zA-Z])/ms,
            `description: >-\n  ${descText.split('\n').join('\n  ')}`
          );

          // Corriger les champs indentés qui suivent
          frontmatter = frontmatter.replace(/\n\s{2}(author|type|featured|readingTime|hasMermaid|targetAudience|domain|tags|relatedArticles|pillColor|theme|keywords|lastUpdated|publishDate|wordCount|enriched|skills|draft|title):/g, '\n$1:');

          modified = true;
        }
      }

      // Corriger les autres problèmes courants
      // 1. Corriger les mots collés ensemble (ex: "modernelastUpdated")
      frontmatter = frontmatter.replace(/([a-z])([A-Z])(lastUpdated|publishDate|wordCount|enriched|skills|draft|title|author|type|featured|readingTime|hasMermaid|targetAudience|domain|tags|relatedArticles|pillColor|theme|keywords):/g, '$1\n$2$3:');

      // 2. Corriger les domaines dupliqués
      const domainMatches = frontmatter.match(/^domain:\s*(.+)$/gm);
      if (domainMatches && domainMatches.length > 1) {
        // Garder seulement le premier
        let firstDomain = true;
        frontmatter = frontmatter.replace(/^domain:\s*(.+)$/gm, (match, value) => {
          if (firstDomain) {
            firstDomain = false;
            return match;
          }
          return '';
        });
        modified = true;
      }

      // 3. Corriger les tags mal formatés
      if (frontmatter.includes('tags:\nrelatedArticles:')) {
        frontmatter = frontmatter.replace(/tags:\nrelatedArticles:/g, 'tags:\n  - tag1\nrelatedArticles:');
        modified = true;
      }

      // 4. Nettoyer les lignes vides multiples
      frontmatter = frontmatter.replace(/\n{3,}/g, '\n\n');

      if (modified) {
        // Reconstruire le contenu
        content = `---\n${frontmatter.trim()}\n---\n${restOfContent}`;
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Corrigé: ${file}`);
        fixedCount++;
      }
    } catch (error) {
      console.error(`❌ Erreur dans ${file}:`, error.message);
      errorCount++;
    }
  }
});

console.log(`\n📊 Résumé:`);
console.log(`   ✅ Fichiers corrigés: ${fixedCount}`);
console.log(`   ❌ Erreurs: ${errorCount}`);
console.log(`   📁 Total fichiers traités: ${files.length}`);
