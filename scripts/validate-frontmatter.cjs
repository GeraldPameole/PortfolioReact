#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const glob = require("glob");

const CONTENT_DIR = path.join(process.cwd(), "src/content");
const REQUIRED_FIELDS = {
  article: [
    "title",
    "description",
    "publishDate",
    "type",
    "author",
    "theme",
    "keywords",
    "image",
  ],
  book: [
    "title",
    "description",
    "type",
    "author",
    "keywords",
    "coverImage",
    "note",
  ],
};

// Directories à ignorer
const IGNORE_DIRS = ["work"];

console.log("Validating frontmatter for content files...");

// Get all markdown files in the content directory
const contentFiles = glob.sync(`${CONTENT_DIR}/**/*.{md,mdx}`);

let hasErrors = false;
let ignoredFiles = 0;

contentFiles.forEach((file) => {
  // Ignorer les fichiers dans les répertoires spécifiés
  if (IGNORE_DIRS.some((dir) => file.includes(`/content/${dir}/`))) {
    console.log(`\x1b[33mIgnored: ${file} (in ignored directory)\x1b[0m`);
    ignoredFiles++;
    return;
  }

  try {
    const content = fs.readFileSync(file, "utf8");
    const { data } = matter(content);

    // Determine content type based on directory or type field
    const dirName = path.basename(path.dirname(file));
    let type = data.type;

    if (!type) {
      if (dirName === "articles") type = "article";
      else if (dirName === "books") type = "book";
    }

    if (!type || !REQUIRED_FIELDS[type]) {
      console.error(`\x1b[31mError in ${file}:`);
      console.error(
        `  Invalid or missing content type: ${type || "undefined"}\x1b[0m`
      );
      hasErrors = true;
      return;
    }

    // Check for required fields
    const missingFields = REQUIRED_FIELDS[type].filter((field) => !data[field]);

    if (missingFields.length > 0) {
      console.error(`\x1b[31mError in ${file}:`);
      console.error(
        `  Missing required fields: ${missingFields.join(", ")}\x1b[0m`
      );
      hasErrors = true;
    } else {
      console.log(`\x1b[32mValid: ${file}\x1b[0m`);
    }
  } catch (error) {
    console.error(`\x1b[31mError processing ${file}: ${error.message}\x1b[0m`);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.error(
    "\x1b[31m\nValidation failed. Please fix the above errors before committing.\x1b[0m"
  );
  process.exit(1);
} else {
  console.log(
    `\x1b[32m\nAll content files have valid frontmatter! (${ignoredFiles} files ignored)\x1b[0m`
  );
  process.exit(0);
}
