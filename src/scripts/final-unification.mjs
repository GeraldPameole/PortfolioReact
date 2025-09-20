import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, "../pages");
const stylesDir = path.join(__dirname, "../styles");

// Mappings des remplacements finaux
const finalReplacements = [
  // Remplacer les variables CSS obsolètes
  {
    from: /var\(--gray-([^)]+)\)/g,
    to: (match, grayValue) => {
      const colorMap = {
        0: "var(--text-light)",
        100: "var(--color-primary-dark)",
        200: "var(--color-primary-dark)",
        300: "var(--color-primary-dark)",
        400: "var(--color-primary-dark)",
        500: "var(--color-primary-dark)",
        600: "var(--color-primary-dark)",
        700: "var(--color-primary-dark)",
        800: "var(--color-primary-dark)",
        900: "var(--color-primary-dark)",
        999: "var(--color-primary-dark)",
        "999_40": "rgba(0, 0, 0, 0.05)",
      };
      return colorMap[grayValue] || "var(--color-primary-dark)";
    },
  },

  // Remplacer les variables accent
  {
    from: /var\(--accent-([^)]+)\)/g,
    to: (match, accentValue) => {
      const colorMap = {
        regular: "var(--color-secondary-warm)",
        light: "var(--color-tertiary-light)",
        dark: "var(--color-primary-dark)",
      };
      return colorMap[accentValue] || "var(--color-secondary-warm)";
    },
  },

  // Remplacer les classes de conteneur restantes
  {
    from: /class="w-full px-4 sm:px-6 lg:px-8 max-w-([^"]+) mx-auto/g,
    to: (match, maxWidth) => {
      const widthMap = {
        "4xl": "content-container-narrow",
        "5xl": "content-container",
        "6xl": "content-container",
        "7xl": "content-container-wide",
      };
      return `class="${widthMap[maxWidth] || "content-container"}`;
    },
  },

  // Remplacer les classes de conteneur simples
  {
    from: /class="max-w-([^"]+) mx-auto/g,
    to: (match, maxWidth) => {
      const widthMap = {
        "4xl": "content-container-narrow",
        "5xl": "content-container",
        "6xl": "content-container",
        "7xl": "content-container-wide",
      };
      return `class="${widthMap[maxWidth] || "content-container"}`;
    },
  },
];

function updateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    let newContent = content;
    let changes = 0;

    // Appliquer tous les remplacements
    finalReplacements.forEach((replacement) => {
      const matches = newContent.match(replacement.from);
      if (matches) {
        newContent = newContent.replace(replacement.from, replacement.to);
        changes += matches.length;
      }
    });

    if (changes > 0) {
      fs.writeFileSync(filePath, newContent, "utf8");
      console.log(`✅ ${path.basename(filePath)}: ${changes} modification(s)`);
      return changes;
    }

    return 0;
  } catch (error) {
    console.error(`❌ Erreur avec ${filePath}:`, error.message);
    return 0;
  }
}

function processDirectory(dirPath, fileExtensions = [".astro", ".css"]) {
  let totalChanges = 0;
  let filesChanged = 0;

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // Récursivement traiter les sous-dossiers
        const subChanges = processDirectory(itemPath, fileExtensions);
        totalChanges += subChanges.totalChanges;
        filesChanged += subChanges.filesChanged;
      } else if (fileExtensions.some((ext) => item.endsWith(ext))) {
        // Traiter le fichier
        const changes = updateFile(itemPath);
        if (changes > 0) {
          filesChanged++;
          totalChanges += changes;
        }
      }
    }
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${dirPath}:`, error.message);
  }

  return { totalChanges, filesChanged };
}

function main() {
  console.log("🔧 Correction finale du système unifié...\n");

  // Traiter les pages
  console.log("📁 Traitement des pages...");
  const pageResults = processDirectory(pagesDir, [".astro"]);

  // Traiter les styles
  console.log("🎨 Traitement des styles...");
  const styleResults = processDirectory(stylesDir, [".css"]);

  const totalChanges = pageResults.totalChanges + styleResults.totalChanges;
  const totalFiles = pageResults.filesChanged + styleResults.filesChanged;

  console.log(`\n📊 Résumé final:`);
  console.log(`   - Fichiers modifiés: ${totalFiles}`);
  console.log(`   - Total de modifications: ${totalChanges}`);

  if (totalChanges === 0) {
    console.log(`\n🎉 Le système est déjà complètement unifié !`);
  } else {
    console.log(`\n✨ Unification finale terminée !`);
    console.log(`\n🚀 Maintenant vous pouvez :`);
    console.log(`   - Tester les pages d'articles : /articles/[nom-article]`);
    console.log(`   - Tester les pages de livres : /books/[nom-livre]`);
    console.log(`   - Tester la page de test : /test-styles`);
    console.log(`   - Vérifier que tout le contenu s'affiche correctement`);
  }
}

main();

