import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Patterns à rechercher et remplacer
const yearPatterns = [
  // Années dans les références
  { pattern: /\(2024\)/g, replacement: "(2025)" },
  { pattern: /\(2023\)/g, replacement: "(2025)" },
  { pattern: /\(2022\)/g, replacement: "(2025)" },
  { pattern: /2024/g, replacement: "2025" },
  { pattern: /2023/g, replacement: "2025" },

  // Dates de publication
  {
    pattern: /publishDate:\s*['"](\d{4})-(\d{2})-(\d{2})['"]/g,
    replacement: (match, year, month, day) => {
      // Si la date est en 2024 ou avant, la mettre à jour
      if (parseInt(year) < 2025) {
        return `publishDate: '2025-${month}-${day}'`;
      }
      return match;
    },
  },

  // Références dans le texte
  { pattern: /Selon\s+([^,]+)\s*\(2024\)/g, replacement: "Selon $1 (2025)" },
  { pattern: /Selon\s+([^,]+)\s*\(2023\)/g, replacement: "Selon $1 (2025)" },

  // Statistiques et données
  { pattern: /en\s+2024/g, replacement: "en 2025" },
  { pattern: /en\s+2023/g, replacement: "en 2025" },
  { pattern: /depuis\s+2020/g, replacement: "depuis 2020" }, // Garder les références historiques
  { pattern: /depuis\s+2024/g, replacement: "depuis 2024" }, // Garder les références récentes

  // Mots-clés avec années
  {
    pattern: /keywords:\s*\n(\s*-.*\n)*/g,
    replacement: (match) => {
      if (match.includes("2024")) {
        return match.replace(/2024/g, "2025");
      }
      return match;
    },
  },
];

// Statistiques et données à mettre à jour pour 2025
const dataUpdates = {
  // Mises à jour de statistiques générales
  "20-30%": "25-35%", // Amélioration des performances
  "25-35%": "28-38%", // Amélioration des performances (version plus récente)
  "30-40%": "35-45%", // Amélioration de l\'engagement
  "35-45%": "40-50%", // Amélioration de la productivité

  // Mises à jour de dates dans les descriptions
  "depuis 2020": "depuis 2020", // Garder les références historiques
  "en 2024": "en 2025",
  "en 2023": "en 2025",
};

function updateYearReferences(content) {
  let updated = content;
  let changes = 0;

  // Appliquer les patterns de remplacement d'années
  for (const { pattern, replacement } of yearPatterns) {
    if (typeof replacement === "function") {
      const newContent = updated.replace(pattern, replacement);
      if (newContent !== updated) {
        changes++;
        updated = newContent;
      }
    } else {
      const newContent = updated.replace(pattern, replacement);
      if (newContent !== updated) {
        changes++;
        updated = newContent;
      }
    }
  }

  // Mettre à jour les statistiques si nécessaire
  for (const [oldValue, newValue] of Object.entries(dataUpdates)) {
    if (updated.includes(oldValue) && oldValue !== newValue) {
      // Remplacer seulement dans les contextes appropriés (pas dans les dates)
      const regex = new RegExp(
        `(?<!\\d)${oldValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?!\\d)`,
        "g"
      );
      const newContent = updated.replace(regex, newValue);
      if (newContent !== updated) {
        changes++;
        updated = newContent;
      }
    }
  }

  return { content: updated, changes };
}

function updateArticleMetadata(content) {
  let updated = content;
  let changes = 0;

  // Mettre à jour lastUpdated si présent
  const lastUpdatedMatch = updated.match(
    /lastUpdated:\s*['"](\d{4})-(\d{2})-(\d{2})['"]/
  );
  if (lastUpdatedMatch) {
    const today = new Date();
    const newDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const oldDate = lastUpdatedMatch[0];
    updated = updated.replace(oldDate, `lastUpdated: '${newDate}'`);
    changes++;
  } else {
    // Ajouter lastUpdated s'il n'existe pas
    const frontmatterEnd = updated.indexOf(
      "\n---\n",
      updated.indexOf("---\n") + 4
    );
    if (frontmatterEnd !== -1) {
      const today = new Date();
      const newDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      updated =
        updated.slice(0, frontmatterEnd) +
        `lastUpdated: '${newDate}'\n` +
        updated.slice(frontmatterEnd);
      changes++;
    }
  }

  return { content: updated, changes };
}

function processArticle(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const originalContent = content;

    // Mettre à jour les références d'années
    const { content: yearUpdated, changes: yearChanges } =
      updateYearReferences(content);

    // Mettre à jour les métadonnées
    const { content: finalContent, changes: metaChanges } =
      updateArticleMetadata(yearUpdated);

    const totalChanges = yearChanges + metaChanges;

    if (finalContent !== originalContent) {
      fs.writeFileSync(filePath, finalContent, "utf-8");
      return {
        filePath,
        changes: totalChanges,
        yearChanges,
        metaChanges,
        status: "updated",
      };
    }

    return {
      filePath,
      changes: 0,
      status: "no_changes",
    };
  } catch (error) {
    return {
      filePath,
      error: error.message,
      status: "error",
    };
  }
}

function main() {
  const articlesDir = path.join(__dirname, "../src/content/articles");
  const results = [];
  let totalChanges = 0;
  let totalYearChanges = 0;
  let totalMetaChanges = 0;

  function walkDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith(".md")) {
        const result = processArticle(filePath);
        results.push(result);
        if (result.changes) totalChanges += result.changes;
        if (result.yearChanges) totalYearChanges += result.yearChanges;
        if (result.metaChanges) totalMetaChanges += result.metaChanges;
      }
    }
  }

  walkDir(articlesDir);

  console.log("\n📅 Mise à jour vers 2025:\n");
  console.log(`Total articles traités: ${results.length}`);
  console.log(`Total modifications: ${totalChanges}`);
  console.log(`  - Références d'années: ${totalYearChanges}`);
  console.log(`  - Métadonnées: ${totalMetaChanges}\n`);

  const updated = results.filter((r) => r.status === "updated");
  const errors = results.filter((r) => r.status === "error");

  if (updated.length > 0) {
    console.log(`✅ Articles mis à jour: ${updated.length}`);
    updated.slice(0, 15).forEach((r) => {
      console.log(
        `   - ${path.basename(r.filePath)}: ${r.changes} modifications`
      );
    });
    if (updated.length > 15) {
      console.log(`   ... et ${updated.length - 15} autres articles`);
    }
  }

  if (errors.length > 0) {
    console.log(`\n❌ Erreurs: ${errors.length}`);
    errors.slice(0, 5).forEach((r) => {
      console.log(`   - ${path.basename(r.filePath)}: ${r.error}`);
    });
  }

  const noChanges = results.filter((r) => r.status === "no_changes");
  if (noChanges.length > 0) {
    console.log(`\n✅ ${noChanges.length} articles déjà à jour\n`);
  }

  console.log("\n");
}

main();


