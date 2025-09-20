import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, "../pages");
const componentsDir = path.join(__dirname, "../components");

// Mappings des remplacements pour standardiser les styles
const styleReplacements = [
  // Remplacer les classes de conteneur
  {
    from: /class="container mx-auto px-4 py-8/g,
    to: 'class="content-container py-8',
  },
  {
    from: /class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12/g,
    to: 'class="content-container-wide py-12',
  },
  {
    from: /class="mx-auto max-w-6xl px-4 py-12/g,
    to: 'class="content-container py-12',
  },

  // Remplacer les classes prose par content-typography
  {
    from: /class="prose dark:prose-invert max-w-none/g,
    to: 'class="content-typography',
  },
  {
    from: /class="prose dark:prose-invert/g,
    to: 'class="content-typography',
  },
  {
    from: /class="prose max-w-none/g,
    to: 'class="content-typography',
  },
  {
    from: /class="prose/g,
    to: 'class="content-typography',
  },

  // Remplacer les styles de conteneur
  {
    from: /max-w-7xl mx-auto px-4/g,
    to: "content-container-wide",
  },
  {
    from: /max-w-6xl mx-auto px-4/g,
    to: "content-container",
  },
  {
    from: /max-w-4xl mx-auto px-4/g,
    to: "content-container-narrow",
  },
];

// Mappings pour les styles CSS
const cssReplacements = [
  // Remplacer les styles .prose dupliqués
  {
    from: /\.prose\s*\{[\s\S]*?\}/g,
    to: "/* Styles unifiés gérés par content.css */",
  },

  // Remplacer les styles de conteneur
  {
    from: /\.container\s*\{[\s\S]*?max-width:\s*[^;]+;[\s\S]*?\}/g,
    to: "/* Styles de conteneur gérés par content.css */",
  },
];

function updateFileStyles(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    let newContent = content;
    let changes = 0;

    // Appliquer les remplacements de classes
    styleReplacements.forEach((replacement) => {
      const matches = newContent.match(replacement.from);
      if (matches) {
        newContent = newContent.replace(replacement.from, replacement.to);
        changes += matches.length;
      }
    });

    // Appliquer les remplacements CSS
    cssReplacements.forEach((replacement) => {
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

function processDirectory(
  dirPath,
  fileExtensions = [".astro", ".tsx", ".jsx"]
) {
  try {
    const items = fs.readdirSync(dirPath);
    let totalChanges = 0;
    let filesChanged = 0;

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // Récursivement traiter les sous-dossiers
        const subChanges = processDirectory(itemPath, fileExtensions);
        totalChanges += subChanges;
      } else if (
        stat.isFile() &&
        fileExtensions.some((ext) => item.endsWith(ext))
      ) {
        // Traiter les fichiers avec les extensions spécifiées
        const changes = updateFileStyles(itemPath);
        if (changes > 0) {
          filesChanged++;
          totalChanges += changes;
        }
      }
    }

    return totalChanges;
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${dirPath}:`, error.message);
    return 0;
  }
}

function main() {
  console.log("🔍 Mise à jour des styles de contenu...\n");

  let totalChanges = 0;
  let filesChanged = 0;

  // Traiter les pages
  console.log("📁 Traitement des pages...");
  const pageChanges = processDirectory(pagesDir);
  totalChanges += pageChanges;

  // Traiter les composants
  console.log("🧩 Traitement des composants...");
  const componentChanges = processDirectory(componentsDir);
  totalChanges += componentChanges;

  console.log(`\n📊 Résumé:`);
  console.log(`   - Fichiers modifiés: ${filesChanged}`);
  console.log(`   - Total de modifications: ${totalChanges}`);

  if (totalChanges === 0) {
    console.log(
      `\n🎉 Aucune modification nécessaire ! Tous les styles sont déjà unifiés.`
    );
  } else {
    console.log(
      `\n✨ Mise à jour terminée ! Les styles sont maintenant unifiés.`
    );
  }
}

// Exécuter le script
main();
