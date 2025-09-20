import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Script pour corriger tous les problèmes YAML
async function fixAllYaml() {
  console.log("🔧 Correction complète des problèmes YAML...\n");

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

          // Corriger les guillemets non échappés dans les descriptions
          const descriptionMatch = content.match(
            /description:\s*"([^"]*)"([^"]*)"([^"]*)"/
          );
          if (descriptionMatch) {
            const newDescription = `description: "${descriptionMatch[1]}${descriptionMatch[2]}${descriptionMatch[3]}"`;
            content = content.replace(
              /description:\s*"[^"]*"[^"]*"[^"]*"/,
              newDescription
            );
            hasChanges = true;
            console.log(
              `   ✅ ${file}: Description avec guillemets multiples corrigée`
            );
          }

          // Corriger les backslashes échappés
          if (content.includes("\\\\")) {
            content = content.replace(/\\\\/g, "\\");
            hasChanges = true;
            console.log(`   ✅ ${file}: Backslashes échappés corrigés`);
          }

          // Corriger les apostrophes dans les descriptions
          const apostropheMatch = content.match(
            /description:\s*"([^"]*'[^"]*)"/
          );
          if (apostropheMatch) {
            const newDescription = `description: "${apostropheMatch[1].replace(/'/g, "\\'")}"`;
            content = content.replace(
              /description:\s*"[^"]*'[^"]*"/,
              newDescription
            );
            hasChanges = true;
            console.log(
              `   ✅ ${file}: Apostrophes dans description échappées`
            );
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
fixAllYaml().catch(console.error);
