import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, "../pages");

// Mappings des remplacements pour les pages restantes
const pageReplacements = [
  // Remplacer les classes de conteneur restantes
  {
    from: /class="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center/g,
    to: 'class="content-container text-center',
  },
  {
    from: /class="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center/g,
    to: 'class="content-container text-center',
  },
  {
    from: /class="w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center/g,
    to: 'class="content-container text-center',
  },

  // Remplacer les conteneurs avec max-w-7xl
  {
    from: /class="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto/g,
    to: 'class="content-container-wide',
  },

  // Remplacer les conteneurs avec max-w-6xl
  {
    from: /class="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto/g,
    to: 'class="content-container',
  },

  // Remplacer les conteneurs avec max-w-5xl
  {
    from: /class="w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto/g,
    to: 'class="content-container',
  },

  // Remplacer les conteneurs avec max-w-4xl
  {
    from: /class="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto/g,
    to: 'class="content-container-narrow',
  },

  // Remplacer les conteneurs avec max-w-3xl
  {
    from: /class="w-full px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto/g,
    to: 'class="content-container-narrow',
  },
];

function updatePageStyles(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    let newContent = content;
    let changes = 0;

    // Appliquer les remplacements
    pageReplacements.forEach((replacement) => {
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

function processPages() {
  try {
    const items = fs.readdirSync(pagesDir);
    let totalChanges = 0;
    let filesChanged = 0;

    for (const item of items) {
      const itemPath = path.join(pagesDir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // Traiter les sous-dossiers
        const subItems = fs.readdirSync(itemPath);
        for (const subItem of subItems) {
          if (subItem.endsWith(".astro")) {
            const subItemPath = path.join(itemPath, subItem);
            const changes = updatePageStyles(subItemPath);
            if (changes > 0) {
              filesChanged++;
              totalChanges += changes;
            }
          }
        }
      } else if (item.endsWith(".astro")) {
        // Traiter les fichiers .astro dans le dossier principal
        const changes = updatePageStyles(itemPath);
        if (changes > 0) {
          filesChanged++;
          totalChanges += changes;
        }
      }
    }

    return { totalChanges, filesChanged };
  } catch (error) {
    console.error("❌ Erreur lors du traitement:", error.message);
    return { totalChanges: 0, filesChanged: 0 };
  }
}

function main() {
  console.log("🔍 Correction des pages restantes...\n");

  const { totalChanges, filesChanged } = processPages();

  console.log(`\n📊 Résumé:`);
  console.log(`   - Fichiers modifiés: ${filesChanged}`);
  console.log(`   - Total de modifications: ${totalChanges}`);

  if (totalChanges === 0) {
    console.log(`\n🎉 Toutes les pages sont déjà corrigées !`);
  } else {
    console.log(
      `\n✨ Correction terminée ! Les pages utilisent maintenant le système unifié.`
    );
  }
}

// Exécuter le script
main();

