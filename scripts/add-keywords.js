#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping des mots-clés par domaine pour le SEO
const keywordMappings = {
  formation: [
    "#formation",
    "#apprentissage",
    "#compétences",
    "#pédagogie",
    "#coaching",
  ],
  commercial: ["#commercial", "#vente", "#marketing", "#client", "#business"],
  gestion: [
    "#gestion",
    "#management",
    "#leadership",
    "#équipe",
    "#performance",
  ],
  projet: ["#projet", "#agile", "#scrum", "#planification", "#suivi"],
  web: ["#web", "#développement", "#javascript", "#react", "#frontend"],
  digital: [
    "#digital",
    "#transformation",
    "#innovation",
    "#technologie",
    "#stratégie",
  ],
  qualité: [
    "#qualité",
    "#processus",
    "#certification",
    "#iso",
    "#amélioration",
  ],
  recrutement: [
    "#recrutement",
    "#talents",
    "#rh",
    "#recrutement",
    "#fidélisation",
  ],
  leadership: [
    "#leadership",
    "#management",
    "#équipe",
    "#performance",
    "#stratégie",
  ],
  performance: [
    "#performance",
    "#optimisation",
    "#efficacité",
    "#productivité",
    "#résultats",
  ],
  agile: ["#agile", "#scrum", "#méthodologie", "#équipe", "#collaboration"],
  react: [
    "#react",
    "#javascript",
    "#performance",
    "#optimisation",
    "#frontend",
  ],
  transformation: [
    "#transformation",
    "#digital",
    "#innovation",
    "#stratégie",
    "#changement",
  ],
  marketing: [
    "#marketing",
    "#digital",
    "#stratégie",
    "#communication",
    "#promotion",
  ],
  télécom: [
    "#télécom",
    "#télécommunications",
    "#infrastructure",
    "#réseau",
    "#connectivité",
  ],
};

// Fonction pour extraire les mots-clés basés sur le titre et les tags
function extractKeywords(title, tags = []) {
  const titleLower = title.toLowerCase();
  const tagsLower = tags.map((tag) => tag.toLowerCase());
  const content = titleLower + " " + tagsLower.join(" ");

  const keywords = new Set();

  // Parcourir les mappings pour trouver des correspondances
  Object.entries(keywordMappings).forEach(([key, values]) => {
    if (content.includes(key)) {
      values.forEach((keyword) => keywords.add(keyword));
    }
  });

  // Ajouter des mots-clés spécifiques basés sur le contenu
  if (content.includes("formation") || content.includes("apprentissage")) {
    keywords.add("#formation");
    keywords.add("#apprentissage");
  }

  if (content.includes("commercial") || content.includes("vente")) {
    keywords.add("#commercial");
    keywords.add("#vente");
  }

  if (content.includes("gestion") || content.includes("management")) {
    keywords.add("#gestion");
    keywords.add("#management");
  }

  if (content.includes("projet") || content.includes("agile")) {
    keywords.add("#projet");
    keywords.add("#agile");
  }

  if (content.includes("web") || content.includes("développement")) {
    keywords.add("#web");
    keywords.add("#développement");
  }

  if (content.includes("digital") || content.includes("transformation")) {
    keywords.add("#digital");
    keywords.add("#transformation");
  }

  if (content.includes("qualité") || content.includes("processus")) {
    keywords.add("#qualité");
    keywords.add("#processus");
  }

  if (content.includes("recrutement") || content.includes("talents")) {
    keywords.add("#recrutement");
    keywords.add("#talents");
  }

  if (content.includes("leadership") || content.includes("équipe")) {
    keywords.add("#leadership");
    keywords.add("#équipe");
  }

  if (content.includes("performance") || content.includes("optimisation")) {
    keywords.add("#performance");
    keywords.add("#optimisation");
  }

  // Limiter à 5 mots-clés maximum pour le SEO
  return Array.from(keywords).slice(0, 5);
}

// Fonction pour traiter un fichier d'article
function processArticle(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");

    // Trouver la fin du frontmatter
    let frontmatterEnd = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === "---") {
        if (frontmatterEnd === -1) {
          frontmatterEnd = i;
        } else {
          frontmatterEnd = i;
          break;
        }
      }
    }

    if (frontmatterEnd === -1) return;

    // Extraire le frontmatter
    const frontmatterLines = lines.slice(0, frontmatterEnd + 1);
    const frontmatterContent = frontmatterLines.join("\n");

    // Parser le frontmatter pour extraire title et tags
    const titleMatch = frontmatterContent.match(/title:\s*["']([^"']+)["']/);
    const tagsMatch = frontmatterContent.match(/tags:\s*\[([^\]]+)\]/);

    if (!titleMatch) return;

    const title = titleMatch[1];
    const tags = tagsMatch
      ? tagsMatch[1].split(",").map((tag) => tag.trim().replace(/['"]/g, ""))
      : [];

    // Vérifier si keywords existe déjà
    if (frontmatterContent.includes("keywords:")) {
      console.log(`Keywords already exist in ${filePath}`);
      return;
    }

    // Extraire les mots-clés
    const keywords = extractKeywords(title, tags);

    if (keywords.length === 0) {
      console.log(`No keywords found for ${filePath}`);
      return;
    }

    // Ajouter les keywords au frontmatter
    const keywordsLine = `keywords: [${keywords.map((k) => `"${k}"`).join(", ")}]`;

    // Insérer avant la dernière ligne du frontmatter
    const newFrontmatterLines = [
      ...frontmatterLines.slice(0, -1),
      keywordsLine,
      frontmatterLines[frontmatterLines.length - 1],
    ];

    // Reconstituer le fichier
    const newContent = [
      ...newFrontmatterLines,
      ...lines.slice(frontmatterEnd + 1),
    ].join("\n");

    // Écrire le fichier modifié
    fs.writeFileSync(filePath, newContent, "utf8");
    console.log(
      `✅ Added keywords to ${path.basename(filePath)}: ${keywords.join(", ")}`
    );
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Fonction principale
function main() {
  const articlesDir = path.join(__dirname, "..", "src", "content", "articles");

  if (!fs.existsSync(articlesDir)) {
    console.error("Articles directory not found");
    return;
  }

  const files = fs
    .readdirSync(articlesDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(articlesDir, file));

  console.log(`Processing ${files.length} articles...`);

  files.forEach(processArticle);

  console.log("✅ Keywords addition completed!");
}

main();
