import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, "../src/content/articles");

function fixYamlIssues(filePath) {
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

    // Fix common YAML issues
    let fixedFrontmatter = frontmatterText
      // Fix boolean values (remove quotes)
      .replace(/draft:\s*"false"/g, "draft: false")
      .replace(/draft:\s*"true"/g, "draft: true")
      .replace(/featured:\s*"false"/g, "featured: false")
      .replace(/featured:\s*"true"/g, "featured: true")
      .replace(/hasMermaid:\s*"false"/g, "hasMermaid: false")
      .replace(/hasMermaid:\s*"true"/g, "hasMermaid: true")

      // Fix numeric values (remove quotes)
      .replace(/readingTime:\s*"(\d+)"/g, "readingTime: $1")

      // Fix apostrophes in titles and descriptions
      .replace(
        /title:\s*"([^"]*)"([^"]*)"([^"]*)"/g,
        (match, before, apostrophe, after) => {
          return `title: "${before}${apostrophe.replace(/"/g, "'")}${after}"`;
        }
      )
      .replace(
        /description:\s*"([^"]*)"([^"]*)"([^"]*)"/g,
        (match, before, apostrophe, after) => {
          return `description: "${before}${apostrophe.replace(/"/g, "'")}${after}"`;
        }
      )

      // Fix array values (use single quotes for outer, double quotes for inner)
      .replace(/tags:\s*"(\[.*\])"/g, (match, arrayContent) => {
        return `tags: '${arrayContent.replace(/"/g, '"')}'`;
      })
      .replace(/skills:\s*"(\[.*\])"/g, (match, arrayContent) => {
        return `skills: '${arrayContent.replace(/"/g, '"')}'`;
      })
      .replace(/relatedArticles:\s*"(\[.*\])"/g, (match, arrayContent) => {
        return `relatedArticles: '${arrayContent.replace(/"/g, '"')}'`;
      })

      // Ensure required fields are present
      .replace(/type:\s*"book"/g, 'type: "article"')
      .replace(/type:\s*undefined/g, 'type: "article"');

    // Add missing required fields if they don't exist
    if (!fixedFrontmatter.includes("type:")) {
      fixedFrontmatter += '\ntype: "article"';
    }
    if (!fixedFrontmatter.includes("publishDate:")) {
      fixedFrontmatter += '\npublishDate: "2024-01-01"';
    }
    if (!fixedFrontmatter.includes("title:")) {
      const filename = path.basename(filePath, ".md");
      const title = filename
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      fixedFrontmatter += `\ntitle: "${title}"`;
    }
    if (!fixedFrontmatter.includes("description:")) {
      fixedFrontmatter += '\ndescription: "Description de l\'article"';
    }

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
        if (fixYamlIssues(filePath)) {
          fixedCount++;
          console.log(`Fixed YAML issues in: ${file}`);
        }
      }
    }

    console.log(`Fixed YAML issues in ${fixedCount} files.`);
  } catch (error) {
    console.error("Error processing articles:", error);
  }
}

processAllArticles();
