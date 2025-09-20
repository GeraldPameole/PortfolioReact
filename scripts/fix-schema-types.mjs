import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, "../src/content/articles");

function fixSchemaTypes(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Split content into frontmatter and body
    const parts = content.split("---");

    if (parts.length < 3) {
      return false;
    }

    const frontmatterText = parts[1];
    const body = parts.slice(2).join("---");

    // Extract title from filename
    const filename = path.basename(filePath, ".md");
    const title = filename
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Create clean frontmatter with correct types
    const cleanFrontmatter = `---
draft: false
title: "${title}"
description: "Description de l'article ${title}"
author: "Gérald Pameole"
type: "article"
featured: false
readingTime: 15
hasMermaid: false
targetAudience: "Professionnels"
domain: "Général"
tags: ["article"]
pillColor: "blue"
skills: ["Compétences"]
relatedArticles: []
publishDate: 2024-01-01
---`;

    // Write the new content
    const newContent = cleanFrontmatter + "\n\n" + body;
    fs.writeFileSync(filePath, newContent);

    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processAllArticles() {
  try {
    const files = fs.readdirSync(articlesDir);
    let fixedCount = 0;

    for (const file of files) {
      if (file.endsWith(".md")) {
        const filePath = path.join(articlesDir, file);
        if (fixSchemaTypes(filePath)) {
          fixedCount++;
          console.log(`Fixed schema types in: ${file}`);
        }
      }
    }

    console.log(`Fixed schema types in ${fixedCount} files.`);
  } catch (error) {
    console.error("Error processing articles:", error);
  }
}

processAllArticles();
