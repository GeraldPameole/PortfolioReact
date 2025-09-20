import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, "../src/content/articles");

function fixYamlQuotes(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Split content into frontmatter and body
    const parts = content.split("---");

    if (parts.length < 3) {
      return false;
    }

    const frontmatterText = parts[1];

    // Fix the specific problematic patterns
    let fixedFrontmatter = frontmatterText
      // Fix title with apostrophe
      .replace(
        /title:\s*"([^"]*)"([^"]*)"([^"]*)"/g,
        (match, before, apostrophe, after) => {
          return `title: "${before}${apostrophe.replace(/"/g, '\\"')}${after}"`;
        }
      )
      // Fix description with apostrophe
      .replace(
        /description:\s*"([^"]*)"([^"]*)"([^"]*)"/g,
        (match, before, apostrophe, after) => {
          return `description: "${before}${apostrophe.replace(/"/g, '\\"')}${after}"`;
        }
      )
      // Fix any other fields with apostrophes
      .replace(
        /(\w+):\s*"([^"]*)"([^"]*)"([^"]*)"/g,
        (match, field, before, apostrophe, after) => {
          return `${field}: "${before}${apostrophe.replace(/"/g, '\\"')}${after}"`;
        }
      );

    // Reconstruct the file
    const newContent = `---\n${fixedFrontmatter}\n---\n${parts.slice(2).join("---")}`;
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
        if (fixYamlQuotes(filePath)) {
          fixedCount++;
          console.log(`Fixed quotes in: ${file}`);
        }
      }
    }

    console.log(`Fixed quotes in ${fixedCount} files.`);
  } catch (error) {
    console.error("Error processing articles:", error);
  }
}

processAllArticles();
