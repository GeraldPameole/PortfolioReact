import fs from 'fs';
import path from 'path';

// Simuler comment Astro structure les IDs
const articlesDir = './src/content/articles';

function getAllMdFiles(dir, baseDir = dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllMdFiles(filePath, baseDir, fileList);
    } else if (file.endsWith('.md')) {
      const relativePath = path.relative(baseDir, filePath);
      fileList.push({
        id: relativePath.replace(/\\/g, '/'), // Format Astro style
        slug: file.replace('.md', ''),
        domain: path.basename(path.dirname(filePath))
      });
    }
  });
  return fileList;
}

const allFiles = getAllMdFiles(articlesDir);
console.log('📋 Structure des IDs d\'articles Astro (premiers 5):\n');
allFiles.slice(0, 5).forEach(file => {
  console.log(`ID: ${file.id}`);
  console.log(`  Slug: ${file.slug}`);
  console.log(`  Domaine (dossier): ${file.domain}`);
  console.log('');
});

console.log('\n🔍 Test de correspondance pour "formation":\n');
const formationFiles = allFiles.filter(f => 
  f.id.toLowerCase().includes('formation') || 
  f.domain === 'formation'
);
console.log(`Articles trouvés pour "formation": ${formationFiles.length}`);
formationFiles.slice(0, 3).forEach(f => {
  console.log(`  - ${f.slug} (ID: ${f.id})`);
});

