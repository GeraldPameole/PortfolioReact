import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, "../content/articles");

function fixHeadingPunctuation(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Regex pour trouver les titres de sections avec des deux points à la fin
    // Capture les #, ##, ###, ####, #####, ###### suivis de texte et de :
    const headingRegex = /^(#{1,6})\s+(.+?)\s*:\s*$/gm;

    let newContent = content;
    let changes = 0;

    // Remplacer les titres avec : par des titres sans :
    newContent = newContent.replace(headingRegex, (match, hashes, title) => {
      changes++;
      return `${hashes} ${title.trim()}`;
    });

    if (changes > 0) {
      fs.writeFileSync(filePath, newContent, "utf8");
      console.log(
        `✅ ${path.basename(filePath)}: ${changes} titre(s) corrigé(s)`
      );
      return changes;
    }

    return 0;
  } catch (error) {
    console.error(`❌ Erreur avec ${filePath}:`, error.message);
    return 0;
  }
}

function processAllArticles() {
  try {
    const files = fs.readdirSync(articlesDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    console.log(
      `\n🔍 Traitement de ${mdFiles.length} fichiers d'articles...\n`
    );

    let totalChanges = 0;
    let filesChanged = 0;

    for (const file of mdFiles) {
      const filePath = path.join(articlesDir, file);
      const changes = fixHeadingPunctuation(filePath);

      if (changes > 0) {
        filesChanged++;
        totalChanges += changes;
      }
    }

    console.log(`\n📊 Résumé:`);
    console.log(`   - Fichiers modifiés: ${filesChanged}`);
    console.log(`   - Total de corrections: ${totalChanges}`);

    if (totalChanges === 0) {
      console.log(
        `\n🎉 Aucune correction nécessaire ! Tous les titres sont déjà conformes.`
      );
    }
  } catch (error) {
    console.error("❌ Erreur lors du traitement:", error.message);
  }
}

// Exécuter le script
processAllArticles();

