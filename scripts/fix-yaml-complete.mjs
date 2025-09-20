import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, "../src/content/articles");

function fixYamlComplete(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Split content into frontmatter and body
    const parts = content.split("---");

    if (parts.length < 3) {
      console.log(
        `Invalid frontmatter structure in: ${path.basename(filePath)}`
      );
      return false;
    }

    const frontmatterText = parts[1];
    const body = parts.slice(2).join("---");

    // Extract existing values
    const lines = frontmatterText.split("\n");
    const frontmatter = {};

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && trimmed.includes(":")) {
        const [key, ...valueParts] = trimmed.split(":");
        const value = valueParts.join(":").trim();
        if (value) {
          // Remove quotes if present
          const cleanValue = value.replace(/^["']|["']$/g, "");
          frontmatter[key.trim()] = cleanValue;
        }
      }
    }

    // Create a clean frontmatter with required fields
    const filename = path.basename(filePath, ".md");
    const title =
      frontmatter.title ||
      filename
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    const description = frontmatter.description || "Description de l'article";

    const cleanFrontmatter = `---
draft: ${frontmatter.draft || false}
title: "${title}"
description: "${description}"
author: "${frontmatter.author || "Gérald Pameole"}"
type: "article"
featured: ${frontmatter.featured || false}
readingTime: ${frontmatter.readingTime || 15}
hasMermaid: ${frontmatter.hasMermaid || false}
targetAudience: "${frontmatter.targetAudience || "Professionnels"}"
domain: "${frontmatter.domain || "Général"}"
tags: '["article"]'
pillColor: "${frontmatter.pillColor || "blue"}"
skills: '["Compétences"]'
relatedArticles: '[]'
publishDate: "${frontmatter.publishDate || "2024-01-01"}"
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
        if (fixYamlComplete(filePath)) {
          fixedCount++;
          console.log(`Fixed YAML structure in: ${file}`);
        }
      }
    }

    console.log(`Fixed YAML structure in ${fixedCount} files.`);
  } catch (error) {
    console.error("Error processing articles:", error);
  }
}

processAllArticles();
