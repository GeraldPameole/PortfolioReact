#!/usr/bin/env node

import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { join } from "path";

// Mapping des domaines vers les couleurs selon les pills de l'image
const domainColorMapping = {
  // Domaines principaux (pills visibles)
  "gestion-projet": "blue",
  "developpement-web": "green",
  "qualite-process": "purple",
  formation: "red",
  "developpement-commercial": "orange",

  // Domaines secondaires (couleurs harmonisées)
  "gestion-talents": "teal",
  "productivite-methodes": "indigo",
  "transformation-digitale": "pink",
  "marketing-communication": "yellow",
  "leadership-management": "purple",
  "innovation-technologies": "cyan",
  "service-client": "emerald",
  "gestion-connaissances": "violet",
  "reconversion-carriere": "rose",
  "outils-techniques": "slate",
  "articles-generaux": "gray",
};

// Fonction pour extraire le domaine depuis le chemin du fichier
function extractDomainFromPath(filePath) {
  const pathParts = filePath.split("/");
  const articlesIndex = pathParts.indexOf("articles");
  if (articlesIndex !== -1 && pathParts[articlesIndex + 1]) {
    return pathParts[articlesIndex + 1];
  }
  return null;
}

// Fonction pour mettre à jour le pillColor dans un fichier
function updatePillColor(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    const domain = extractDomainFromPath(filePath);

    if (!domain || !domainColorMapping[domain]) {
      console.log(`⚠️  Domaine non mappé pour ${filePath}`);
      return false;
    }

    const targetColor = domainColorMapping[domain];

    // Vérifier si le fichier contient pillColor
    if (!content.includes("pillColor:")) {
      console.log(`⚠️  Pas de pillColor trouvé dans ${filePath}`);
      return false;
    }

    // Remplacer pillColor
    const updatedContent = content.replace(
      /pillColor:\s*["']?[a-zA-Z-]+["']?/,
      `pillColor: "${targetColor}"`
    );

    if (content !== updatedContent) {
      writeFileSync(filePath, updatedContent, "utf8");
      console.log(`✅ ${filePath} -> ${targetColor}`);
      return true;
    } else {
      console.log(`ℹ️  ${filePath} déjà à jour (${targetColor})`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Erreur avec ${filePath}:`, error.message);
    return false;
  }
}

// Fonction récursive pour parcourir les dossiers
function processDirectory(dirPath) {
  const items = readdirSync(dirPath);
  let updatedCount = 0;

  for (const item of items) {
    const fullPath = join(dirPath, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      updatedCount += processDirectory(fullPath);
    } else if (item.endsWith(".md")) {
      if (updatePillColor(fullPath)) {
        updatedCount++;
      }
    }
  }

  return updatedCount;
}

// Point d'entrée
console.log("🎨 Harmonisation des couleurs des articles...\n");

const articlesDir = "src/content/articles";
const updatedCount = processDirectory(articlesDir);

console.log(
  `\n✨ ${updatedCount} articles mis à jour avec les couleurs harmonisées !`
);

// Afficher le mapping des couleurs
console.log("\n📋 Mapping des couleurs par domaine :");
Object.entries(domainColorMapping).forEach(([domain, color]) => {
  console.log(`  ${domain}: ${color}`);
});
