import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, "../src/content/articles");

function validateAndFixYaml(filePath) {
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

    try {
      // Try to parse the YAML
      const frontmatter = yaml.load(frontmatterText);

      // Check required fields
      const requiredFields = ["title", "description", "publishDate", "type"];
      const missingFields = requiredFields.filter(
        (field) => !frontmatter[field]
      );

      if (missingFields.length > 0) {
        console.log(
          `Missing required fields in ${path.basename(filePath)}: ${missingFields.join(", ")}`
        );

        // Add missing fields
        let updatedFrontmatter = frontmatterText;

        if (!frontmatter.title) {
          const filename = path.basename(filePath, ".md");
          const title = filename
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          updatedFrontmatter += `\ntitle: "${title}"`;
        }

        if (!frontmatter.description) {
          updatedFrontmatter += '\ndescription: "Description de l\'article"';
        }

        if (!frontmatter.publishDate) {
          updatedFrontmatter += '\npublishDate: "2024-01-01"';
        }

        if (!frontmatter.type) {
          updatedFrontmatter += '\ntype: "article"';
        }

        // Reconstruct the file
        const newContent = `---\n${updatedFrontmatter}\n---\n${parts.slice(2).join("---")}`;
        fs.writeFileSync(filePath, newContent);

        return true;
      }

      return false;
    } catch (yamlError) {
      console.log(
        `YAML parsing error in ${path.basename(filePath)}: ${yamlError.message}`
      );

      // Try to fix common YAML issues
      let fixedFrontmatter = frontmatterText
        .replace(/^\s+/, "") // Remove leading whitespace
        .replace(/\s+$/g, "") // Remove trailing whitespace
        .replace(/\n\s*\n/g, "\n") // Remove empty lines
        .replace(/:\s*"([^"]*)"\s*\n/g, ': "$1"\n') // Fix quotes
        .replace(/:\s*'([^']*)'\s*\n/g, ': "$1"\n'); // Fix single quotes

      // Ensure proper structure
      const lines = fixedFrontmatter.split("\n").filter((line) => line.trim());
      const fixedLines = [];

      for (const line of lines) {
        if (line.includes(":")) {
          const [key, ...valueParts] = line.split(":");
          const value = valueParts.join(":").trim();
          if (value && !value.startsWith('"') && !value.startsWith("'")) {
            fixedLines.push(`${key.trim()}: "${value.replace(/"/g, '\\"')}"`);
          } else {
            fixedLines.push(line);
          }
        } else {
          fixedLines.push(line);
        }
      }

      const newFrontmatter = fixedLines.join("\n");

      // Reconstruct the file
      const newContent = `---\n${newFrontmatter}\n---\n${parts.slice(2).join("---")}`;
      fs.writeFileSync(filePath, newContent);

      return true;
    }
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
        if (validateAndFixYaml(filePath)) {
          fixedCount++;
        }
      }
    }

    console.log(`Validated and fixed ${fixedCount} files.`);
  } catch (error) {
    console.error("Error processing articles:", error);
  }
}

processAllArticles();
