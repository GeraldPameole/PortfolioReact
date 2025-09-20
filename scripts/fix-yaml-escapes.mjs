import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Script pour corriger les séquences d'échappement YAML
async function fixYamlEscapes() {
  console.log("🔧 Correction des séquences d'échappement YAML...\n");

  const articlesDir = path.join(__dirname, "../src/content/articles");
  let fixedCount = 0;
  let errorCount = 0;

  try {
    const files = fs.readdirSync(articlesDir);

    for (const file of files) {
      if (file.endsWith(".md")) {
        const filePath = path.join(articlesDir, file);

        try {
          let content = fs.readFileSync(filePath, "utf-8");
          let hasChanges = false;

          // Corriger les apostrophes échappées
          if (content.includes("\\'")) {
            content = content.replace(/\\'/g, "'");
            hasChanges = true;
            console.log(`   ✅ ${file}: Apostrophes échappées corrigées`);
          }

          // Corriger les guillemets échappés
          if (content.includes('\\"')) {
            content = content.replace(/\\"/g, '"');
            hasChanges = true;
            console.log(`   ✅ ${file}: Guillemets échappés corrigés`);
          }

          // Corriger les backslashes échappés
          if (content.includes("\\\\")) {
            content = content.replace(/\\\\/g, "\\");
            hasChanges = true;
            console.log(`   ✅ ${file}: Backslashes échappés corrigés`);
          }

          // Sauvegarder si des changements ont été faits
          if (hasChanges) {
            fs.writeFileSync(filePath, content, "utf-8");
            fixedCount++;
          }
        } catch (error) {
          console.error(`   ❌ ${file}: Erreur - ${error.message}`);
          errorCount++;
        }
      }
    }

    console.log(`\n📊 Résumé:`);
    console.log(`   ✅ Fichiers corrigés: ${fixedCount}`);
    console.log(`   ❌ Erreurs: ${errorCount}`);

    if (fixedCount > 0) {
      console.log(
        "\n🎉 Correction terminée ! Le serveur devrait maintenant fonctionner correctement."
      );
    } else {
      console.log("\n✨ Aucune correction nécessaire.");
    }
  } catch (error) {
    console.error("Erreur lors de la correction:", error);
  }
}

// Exécuter la correction
fixYamlEscapes().catch(console.error);
