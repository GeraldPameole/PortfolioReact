import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, "../pages");
const stylesDir = path.join(__dirname, "../styles");

function checkFileForUnifiedSystem(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const issues = [];

    // Vérifier l'utilisation des classes unifiées
    if (content.includes('class="prose')) {
      issues.push("Utilise encore l'ancienne classe 'prose'");
    }

    if (content.includes("mx-auto max-w-")) {
      issues.push("Utilise encore les anciennes classes de conteneur");
    }

    if (content.includes("var(--accent-")) {
      issues.push("Utilise encore les anciennes variables CSS 'accent'");
    }

    if (content.includes("var(--gray-")) {
      issues.push("Utilise encore les anciennes variables CSS 'gray'");
    }

    // Vérifier l'utilisation des nouvelles classes
    const hasUnifiedClasses =
      content.includes("content-container") ||
      content.includes("content-typography") ||
      content.includes("content-container-wide") ||
      content.includes("content-container-narrow");

    if (!hasUnifiedClasses && content.includes("<Content />")) {
      issues.push("Page avec contenu mais sans classes unifiées");
    }

    return issues;
  } catch (error) {
    return [`Erreur de lecture: ${error.message}`];
  }
}

function scanDirectory(dirPath, fileExtensions = [".astro"]) {
  const results = {};

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // Récursivement scanner les sous-dossiers
        const subResults = scanDirectory(itemPath, fileExtensions);
        Object.assign(results, subResults);
      } else if (fileExtensions.some((ext) => item.endsWith(ext))) {
        // Vérifier le fichier
        const issues = checkFileForUnifiedSystem(itemPath);
        if (issues.length > 0) {
          results[item] = issues;
        }
      }
    }
  } catch (error) {
    console.error(`❌ Erreur lors du scan de ${dirPath}:`, error.message);
  }

  return results;
}

function main() {
  console.log("🔍 Vérification du système unifié...\n");

  // Scanner les pages
  console.log("📁 Vérification des pages...");
  const pageIssues = scanDirectory(pagesDir);

  // Scanner les styles
  console.log("🎨 Vérification des styles...");
  const styleIssues = scanDirectory(stylesDir, [".css"]);

  // Afficher les résultats
  if (
    Object.keys(pageIssues).length === 0 &&
    Object.keys(styleIssues).length === 0
  ) {
    console.log("✅ Toutes les pages utilisent le système unifié !");
    return;
  }

  if (Object.keys(pageIssues).length > 0) {
    console.log("\n📄 Pages avec problèmes :");
    Object.entries(pageIssues).forEach(([file, issues]) => {
      console.log(`\n   ${file}:`);
      issues.forEach((issue) => console.log(`     ❌ ${issue}`));
    });
  }

  if (Object.keys(styleIssues).length > 0) {
    console.log("\n🎨 Fichiers de style avec problèmes :");
    Object.entries(styleIssues).forEach(([file, issues]) => {
      console.log(`\n   ${file}:`);
      issues.forEach((issue) => console.log(`     ❌ ${issue}`));
    });
  }

  console.log("\n💡 Recommandations :");
  console.log("   - Utiliser 'content-container', 'content-typography'");
  console.log("   - Remplacer 'var(--accent-*)' par 'var(--color-*)'");
  console.log("   - Remplacer 'var(--gray-*)' par 'var(--color-*)'");
  console.log("   - Utiliser les variables d'espacement '--content-spacing-*'");
}

main();

