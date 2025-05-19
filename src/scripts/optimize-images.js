const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');

// Configuration
const config = {
  inputDir: 'src/assets/images',
  outputDir: 'public/images',
  formats: ['webp', 'avif'],
  quality: 80,
  sizes: [320, 640, 960, 1280],
  skipExisting: true,
};

// Fonction pour optimiser une image
async function optimizeImage(inputPath, outputPath, format, size) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Calculer les nouvelles dimensions
    const ratio = size / Math.max(metadata.width, metadata.height);
    const width = Math.round(metadata.width * ratio);
    const height = Math.round(metadata.height * ratio);

    // Créer le dossier de sortie si nécessaire
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Optimiser l'image
    await image
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFormat(format, {
        quality: config.quality,
        effort: 6,
      })
      .toFile(outputPath);

    console.log(`✅ Optimisé: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'optimisation de ${inputPath}:`, error);
  }
}

// Fonction principale
async function optimizeImages() {
  try {
    // Créer le dossier de sortie
    await fs.mkdir(config.outputDir, { recursive: true });

    // Trouver toutes les images
    const images = glob.sync(`${config.inputDir}/**/*.{jpg,jpeg,png,gif}`);

    console.log(`📁 Trouvé ${images.length} images à optimiser`);

    // Traiter chaque image
    for (const imagePath of images) {
      const relativePath = path.relative(config.inputDir, imagePath);
      const baseName = path.basename(relativePath, path.extname(relativePath));

      // Générer les versions optimisées
      for (const format of config.formats) {
        for (const size of config.sizes) {
          const outputPath = path.join(config.outputDir, `${baseName}-${size}.${format}`);

          // Vérifier si le fichier existe déjà
          if (config.skipExisting) {
            try {
              await fs.access(outputPath);
              console.log(`⏩ Déjà optimisé: ${outputPath}`);
              continue;
            } catch {
              // Le fichier n'existe pas, on continue
            }
          }

          await optimizeImage(imagePath, outputPath, format, size);
        }
      }
    }

    console.log('✨ Optimisation terminée !');
  } catch (error) {
    console.error("❌ Erreur lors de l'optimisation:", error);
    process.exit(1);
  }
}

// Exécuter le script
optimizeImages();
