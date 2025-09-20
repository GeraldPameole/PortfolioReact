import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, "../src/content/articles");

function fixAllFormats(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Fix all format issues
    let fixedContent = content
      // Fix tags format - remove quotes around array
      .replace(/tags:\s*'\[([^\]]*)\]'/g, "tags: [$1]")
      .replace(/tags:\s*"\[([^\]]*)\]"/g, "tags: [$1]")

      // Fix skills format - remove quotes around array
      .replace(/skills:\s*'\[([^\]]*)\]'/g, "skills: [$1]")
      .replace(/skills:\s*"\[([^\]]*)\]"/g, "skills: [$1]")

      // Fix relatedArticles format - remove quotes around array
      .replace(/relatedArticles:\s*'\[([^\]]*)\]'/g, "relatedArticles: [$1]")
      .replace(/relatedArticles:\s*"\[([^\]]*)\]"/g, "relatedArticles: [$1]")

      // Fix publishDate format - remove quotes
      .replace(/publishDate:\s*"([^"]*)"/g, "publishDate: $1");

    fs.writeFileSync(filePath, fixedContent);

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
        if (fixAllFormats(filePath)) {
          fixedCount++;
          console.log(`Fixed formats in: ${file}`);
        }
      }
    }

    console.log(`Fixed formats in ${fixedCount} files.`);
  } catch (error) {
    console.error("Error processing articles:", error);
  }
}

processAllArticles();
