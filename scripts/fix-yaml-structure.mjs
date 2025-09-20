import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, "../src/content/articles");

function fixYamlStructure(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Check if the file starts with publishDate before ---
    if (content.startsWith('publishDate: "2024-01-01"')) {
      console.log(`Fixing YAML structure in: ${path.basename(filePath)}`);

      // Remove the publishDate from the beginning
      let fixedContent = content.replace(/^publishDate: "2024-01-01"\n/, "");

      // Ensure the frontmatter has all required fields
      if (!fixedContent.includes('type: "article"')) {
        // Find the end of frontmatter and add type field
        const frontmatterEnd = fixedContent.indexOf("---", 3);
        if (frontmatterEnd !== -1) {
          const beforeEnd = fixedContent.substring(0, frontmatterEnd);
          const afterEnd = fixedContent.substring(frontmatterEnd);
          fixedContent = beforeEnd + 'type: "article"\n' + afterEnd;
        }
      }

      // Ensure publishDate is in the frontmatter
      if (!fixedContent.includes("publishDate:")) {
        const frontmatterEnd = fixedContent.indexOf("---", 3);
        if (frontmatterEnd !== -1) {
          const beforeEnd = fixedContent.substring(0, frontmatterEnd);
          const afterEnd = fixedContent.substring(frontmatterEnd);
          fixedContent = beforeEnd + 'publishDate: "2024-01-01"\n' + afterEnd;
        }
      }

      // Ensure title and description are present
      if (!fixedContent.includes("title:")) {
        const frontmatterEnd = fixedContent.indexOf("---", 3);
        if (frontmatterEnd !== -1) {
          const beforeEnd = fixedContent.substring(0, frontmatterEnd);
          const afterEnd = fixedContent.substring(frontmatterEnd);
          const filename = path.basename(filePath, ".md");
          const title = filename
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          fixedContent = beforeEnd + `title: "${title}"\n` + afterEnd;
        }
      }

      if (!fixedContent.includes("description:")) {
        const frontmatterEnd = fixedContent.indexOf("---", 3);
        if (frontmatterEnd !== -1) {
          const beforeEnd = fixedContent.substring(0, frontmatterEnd);
          const afterEnd = fixedContent.substring(frontmatterEnd);
          fixedContent =
            beforeEnd + 'description: "Description de l\'article"\n' + afterEnd;
        }
      }

      fs.writeFileSync(filePath, fixedContent);
      return true;
    }

    return false;
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
        if (fixYamlStructure(filePath)) {
          fixedCount++;
        }
      }
    }

    console.log(`Fixed YAML structure in ${fixedCount} files.`);
  } catch (error) {
    console.error("Error processing articles:", error);
  }
}

processAllArticles();
