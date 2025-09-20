import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, "../pages");

// Mappings des remplacements pour uniformiser les en-têtes
const headerReplacements = [
  // Remplacer les couleurs de texte par #111827
  {
    from: /text-gray-800/g,
    to: "text-[#111827]",
  },
  {
    from: /text-gray-900/g,
    to: "text-[#111827]",
  },
  {
    from: /text-gray-600/g,
    to: "text-[#111827]",
  },

  // Ajouter des en-têtes uniformes pour les pages qui n'en ont pas
  {
    from: /<BaseLayout([^>]*)>\s*<div class="content-container py-8">/g,
    to: (match, layoutProps) => {
      return `${match.replace(
        '<div class="content-container py-8">',
        `
  <!-- En-tête de page -->
  <section class="py-16 md:py-24 bg-gradient-to-r from-indigo-600/5 to-violet-600/5">
    <div class="content-container text-center">
      <h1 class="text-4xl font-bold mb-6 text-[#111827] dark:text-white">Articles</h1>
      <p class="text-lg text-[#111827] dark:text-gray-300 mb-8">
        Découvrez mes articles sur le développement web, la gestion de projet, la formation et bien plus encore.
      </p>
    </div>
  </section>

  <div class="content-container py-8">`
      )}`;
    },
  },
];

function updateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    let newContent = content;
    let changes = 0;

    // Appliquer tous les remplacements
    headerReplacements.forEach((replacement) => {
      const matches = newContent.match(replacement.from);
      if (matches) {
        if (typeof replacement.to === "function") {
          newContent = newContent.replace(replacement.from, replacement.to);
          changes += matches.length;
        } else {
          newContent = newContent.replace(replacement.from, replacement.to);
          changes += matches.length;
        }
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

function processDirectory(dirPath) {
  let totalChanges = 0;
  let filesChanged = 0;

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // Récursivement traiter les sous-dossiers
        const subChanges = processDirectory(itemPath);
        totalChanges += subChanges.totalChanges;
        filesChanged += subChanges.filesChanged;
      } else if (item.endsWith(".astro")) {
        // Traiter le fichier Astro
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
  console.log(
    "🎨 Uniformisation des en-têtes de page avec la couleur #111827...\n"
  );

  const results = processDirectory(pagesDir);

  console.log(`\n📊 Résumé:`);
  console.log(`   - Fichiers modifiés: ${results.filesChanged}`);
  console.log(`   - Total de modifications: ${results.totalChanges}`);

  if (results.totalChanges === 0) {
    console.log(`\n🎉 Tous les en-têtes sont déjà uniformisés !`);
  } else {
    console.log(`\n✨ Uniformisation terminée !`);
    console.log(`\n🚀 Maintenant toutes les pages ont :`);
    console.log(`   - Couleur de texte principale : #111827`);
    console.log(`   - En-têtes avec bannière uniforme`);
    console.log(`   - Style cohérent sur tout le site`);
  }
}

main();
