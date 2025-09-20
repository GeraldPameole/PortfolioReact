import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, "../src/content/articles");

function fixApostrophes(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Split content into frontmatter and body
    const parts = content.split("---");

    if (parts.length < 3) {
      return false;
    }

    const frontmatterText = parts[1];

    // Fix apostrophes in titles and descriptions
    let fixedFrontmatter = frontmatterText
      .replace(
        /title:\s*"([^"]*)"([^"]*)"([^"]*)"/g,
        (match, before, apostrophe, after) => {
          return `title: "${before}${apostrophe.replace(/"/g, '\\"')}${after}"`;
        }
      )
      .replace(
        /description:\s*"([^"]*)"([^"]*)"([^"]*)"/g,
        (match, before, apostrophe, after) => {
          return `description: "${before}${apostrophe.replace(/"/g, '\\"')}${after}"`;
        }
      )
      .replace(
        /title:\s*'([^']*)'([^']*)'([^']*)'/g,
        (match, before, apostrophe, after) => {
          return `title: "${before}${apostrophe.replace(/'/g, "\\'")}${after}"`;
        }
      )
      .replace(
        /description:\s*'([^']*)'([^']*)'([^']*)'/g,
        (match, before, apostrophe, after) => {
          return `description: "${before}${apostrophe.replace(/'/g, "\\'")}${after}"`;
        }
      );

    // Fix any remaining unescaped apostrophes in quoted strings
    fixedFrontmatter = fixedFrontmatter.replace(
      /([^\\])"([^"]*)"([^"]*)"([^"]*)"([^"]*)/g,
      (match, before, part1, apostrophe, part2, after) => {
        return `${before}"${part1}${apostrophe.replace(/"/g, '\\"')}${part2}"${after}`;
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
        if (fixApostrophes(filePath)) {
          fixedCount++;
          console.log(`Fixed apostrophes in: ${file}`);
        }
      }
    }

    console.log(`Fixed apostrophes in ${fixedCount} files.`);
  } catch (error) {
    console.error("Error processing articles:", error);
  }
}

processAllArticles();
