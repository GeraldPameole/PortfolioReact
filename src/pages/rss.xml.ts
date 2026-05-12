import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  const sorted = articles.sort(
    (a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime()
  );

  return rss({
    title: 'Gérald Paméole — Blog',
    description: 'Management, transformation digitale, développement web et productivité — articles hebdomadaires.',
    site: context.site ?? 'https://geraldpameole.fr',
    items: sorted.map(article => ({
      title:       article.data.title,
      description: article.data.description,
      pubDate:     new Date(article.data.publishDate),
      link:        `/blog/${article.slug}`,
    })),
    customData: `<language>fr-FR</language>`,
  });
}
