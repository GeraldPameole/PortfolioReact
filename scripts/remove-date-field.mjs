import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, "../src/content/articles");

function removeDateField(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Split content into frontmatter and body
    const parts = content.split("---");

    if (parts.length < 3) {
      return false;
    }

    const frontmatterText = parts[1];

    // Remove the date field
    const lines = frontmatterText.split("\n");
    const filteredLines = lines.filter(
      (line) => !line.trim().startsWith("date:")
    );

    const newFrontmatter = filteredLines.join("\n");

    // Reconstruct the file
    const newContent = `---\n${newFrontmatter}\n---\n${parts.slice(2).join("---")}`;
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
        if (removeDateField(filePath)) {
          fixedCount++;
          console.log(`Removed date field from: ${file}`);
        }
      }
    }

    console.log(`Removed date field from ${fixedCount} files.`);
  } catch (error) {
    console.error("Error processing articles:", error);
  }
}

processAllArticles();
