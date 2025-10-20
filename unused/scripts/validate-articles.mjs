import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Script pour valider les articles
async function validateArticles() {
  console.log("🔍 Validation des articles...\n");

  const articlesDir = path.join(__dirname, "../src/content/articles");
  const errors = [];
  const warnings = [];

  try {
    const files = fs.readdirSync(articlesDir);

    for (const file of files) {
      if (file.endsWith(".md")) {
        const filePath = path.join(articlesDir, file);

        try {
          const content = fs.readFileSync(filePath, "utf-8");

          // Vérifier les séquences d'échappement problématiques
          if (content.includes("\\'")) {
            errors.push(`${file}: Apostrophe échappée détectée`);
          }

          if (content.includes('\\"')) {
            errors.push(`${file}: Guillemet échappé détecté`);
          }

          // Vérifier le frontmatter
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          if (!frontmatterMatch) {
            errors.push(`${file}: Frontmatter manquant ou mal formaté`);
            continue;
          }

          const frontmatter = frontmatterMatch[1];

          // Vérifier les champs requis
          const requiredFields = ["title", "description", "type"];
          for (const field of requiredFields) {
            if (!frontmatter.includes(`${field}:`)) {
              warnings.push(`${file}: Champ '${field}' manquant`);
            }
          }

          // Vérifier les valeurs de type
          if (frontmatter.includes('type: "book"')) {
            warnings.push(
              `${file}: Type 'book' détecté - devrait être 'article'`
            );
          }

          // Vérifier les descriptions trop longues
          const descriptionMatch = frontmatter.match(
            /description:\s*"([^"]+)"/
          );
          if (descriptionMatch && descriptionMatch[1].length > 200) {
            warnings.push(
              `${file}: Description très longue (${descriptionMatch[1].length} caractères)`
            );
          }

          // Vérifier les tags
          if (!frontmatter.includes("tags:")) {
            warnings.push(`${file}: Aucun tag défini`);
          }
        } catch (error) {
          errors.push(`${file}: Erreur de lecture - ${error.message}`);
        }
      }
    }

    // Afficher les résultats
    if (errors.length > 0) {
      console.log("❌ Erreurs détectées:");
      errors.forEach((error) => console.log(`   ${error}`));
      console.log("");
    }

    if (warnings.length > 0) {
      console.log("⚠️  Avertissements:");
      warnings.forEach((warning) => console.log(`   ${warning}`));
      console.log("");
    }

    if (errors.length === 0 && warnings.length === 0) {
      console.log("✅ Tous les articles sont valides !");
    }

    console.log(`📊 Résumé:`);
    console.log(
      `   📝 Articles vérifiés: ${files.filter((f) => f.endsWith(".md")).length}`
    );
    console.log(`   ❌ Erreurs: ${errors.length}`);
    console.log(`   ⚠️  Avertissements: ${warnings.length}`);
  } catch (error) {
    console.error("Erreur lors de la validation:", error);
  }
}

// Exécuter la validation
validateArticles().catch(console.error);
