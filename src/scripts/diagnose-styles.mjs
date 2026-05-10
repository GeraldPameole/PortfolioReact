import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stylesDir = path.join(__dirname, "../styles");
const globalCSSPath = path.join(stylesDir, "global.css");

function checkFileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function checkCSSImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const imports = content.match(/@import\s+["']([^"']+)["']/g);
    return imports || [];
  } catch (error) {
    return [];
  }
}

function checkCSSVariables(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const variables = content.match(/--[^:]+:/g);
    return variables || [];
  } catch (error) {
    return [];
  }
}

function main() {
  console.log("🔍 Diagnostic du système de styles...\n");

  // Vérifier l'existence des fichiers
  console.log("📁 Vérification des fichiers CSS:");
  const cssFiles = [
    "palette.css",
    "typography.css",
    "content.css",
    "global.css",
  ];

  cssFiles.forEach((file) => {
    const filePath = path.join(stylesDir, file);
    const exists = checkFileExists(filePath);
    console.log(`   ${exists ? "✅" : "❌"} ${file}`);
  });

  // Vérifier les imports dans global.css
  console.log("\n📥 Vérification des imports dans global.css:");
  const imports = checkCSSImports(globalCSSPath);
  if (imports.length > 0) {
    imports.forEach((imp) => console.log(`   ${imp}`));
  } else {
    console.log("   ❌ Aucun import trouvé");
  }

  // Vérifier les variables CSS dans palette.css
  console.log("\n🎨 Vérification des variables CSS dans palette.css:");
  const palettePath = path.join(stylesDir, "palette.css");
  if (checkFileExists(palettePath)) {
    const variables = checkCSSVariables(palettePath);
    console.log(`   ${variables.length} variables CSS trouvées`);

    // Vérifier les variables critiques
    const criticalVars = [
      "--color-primary-dark",
      "--color-secondary-warm",
      "--font-primary",
      "--text-base",
      "--leading-relaxed",
    ];

    const content = fs.readFileSync(palettePath, "utf8");
    criticalVars.forEach((varName) => {
      const hasVar = content.includes(varName);
      console.log(`   ${hasVar ? "✅" : "❌"} ${varName}`);
    });
  }

  // Vérifier la syntaxe CSS
  console.log("\n🔧 Vérification de la syntaxe CSS:");
  try {
    const contentCSSPath = path.join(stylesDir, "content.css");
    if (checkFileExists(contentCSSPath)) {
      const content = fs.readFileSync(contentCSSPath, "utf8");

      // Vérifier les accolades équilibrées
      const openBraces = (content.match(/\{/g) || []).length;
      const closeBraces = (content.match(/\}/g) || []).length;

      if (openBraces === closeBraces) {
        console.log("   ✅ Accolades équilibrées");
      } else {
        console.log(
          `   ❌ Accolades déséquilibrées: {${openBraces} vs }${closeBraces}`
        );
      }

      // Vérifier les points-virgules manquants
      const rules = content.match(/[^;]\s*}/g);
      if (rules && rules.length > 0) {
        console.log(
          `   ⚠️  ${rules.length} règles CSS potentiellement incomplètes`
        );
      } else {
        console.log("   ✅ Syntaxe CSS valide");
      }
    }
  } catch (error) {
    console.log(`   ❌ Erreur lors de la vérification: ${error.message}`);
  }

  console.log("\n✨ Diagnostic terminé !");
}

main();
