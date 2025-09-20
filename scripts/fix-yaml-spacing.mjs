import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, "../src/content/articles");

function fixYamlSpacing(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Split content into frontmatter and body
    const parts = content.split("---");

    if (parts.length < 3) {
      return false;
    }

    const frontmatterText = parts[1];
    const body = parts.slice(2).join("---");

    // Clean up the frontmatter
    const lines = frontmatterText.split("\n");
    const cleanLines = lines
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const cleanFrontmatter = cleanLines.join("\n");

    // Create the new content with proper spacing
    const newContent = `---\n${cleanFrontmatter}\n---\n\n${body}`;
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
        if (fixYamlSpacing(filePath)) {
          fixedCount++;
          console.log(`Fixed YAML spacing in: ${file}`);
        }
      }
    }

    console.log(`Fixed YAML spacing in ${fixedCount} files.`);
  } catch (error) {
    console.error("Error processing articles:", error);
  }
}

processAllArticles();
