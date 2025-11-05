import { getCollection } from 'astro:content';

const articles = await getCollection('articles');

console.log('📊 Vérification des slugs d\'articles:\n');

// Prendre les 5 premiers articles pour tester
articles.slice(0, 5).forEach((article, idx) => {
  console.log(`Article ${idx + 1}:`);
  console.log(`  ID: ${article.id}`);
  console.log(`  Slug: ${article.slug}`);
  console.log(`  URL attendue: /blog/${article.slug}`);
  console.log('');
});

// Vérifier si les slugs contiennent des préfixes de dossier
const slugsWithFolders = articles.filter(a => a.slug.includes('/'));
console.log(`\nSlugs avec préfixes de dossier: ${slugsWithFolders.length}/${articles.length}`);

if (slugsWithFolders.length > 0) {
  console.log('\nPremiers exemples:');
  slugsWithFolders.slice(0, 3).forEach(a => {
    console.log(`  - ${a.slug}`);
  });
}

