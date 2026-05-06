import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');
const files = globSync('**/*.md', { cwd: articlesDir });

console.log(`Vérification de ${files.length} fichiers...\n`);

let errorFiles = [];

files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extraire le frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    console.log(`⚠️  Pas de frontmatter dans ${file}`);
    return;
  }
  
  const frontmatterText = frontmatterMatch[1];
  
  try {
    yaml.load(frontmatterText);
  } catch (error) {
    console.log(`❌ ERREUR YAML dans ${file}:`);
    console.log(`   ${error.message}`);
    console.log(`   Ligne ${error.mark?.line || '?'}, colonne ${error.mark?.column || '?'}\n`);
    errorFiles.push({ file, error, frontmatterText });
  }
});

if (errorFiles.length === 0) {
  console.log('✅ Aucune erreur YAML détectée !');
} else {
  console.log(`\n${errorFiles.length} fichier(s) avec erreur(s) YAML trouvé(s).`);
}

