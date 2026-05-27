import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const parser = new MarkdownIt();

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  const sorted = articles.sort(
    (a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime()
  );

  // Base absolue (sans slash final) pour rendre les URLs des images/liens valides en email
  const site = (context.site?.toString() ?? 'https://geraldpameole.vercel.app/').replace(/\/$/, '');
  const absolutize = (html: string) => html.replace(/(src|href)="\/(?!\/)/g, `$1="${site}/`);

  return rss({
    title: 'Gérald Paméole — Blog',
    description:
      'Management, transformation digitale, développement web et productivité — articles hebdomadaires.',
    site: context.site ?? 'https://geraldpameole.vercel.app',
    items: sorted.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: new Date(article.data.publishDate),
      link: `/blog/${article.slug}`,
      // Contenu HTML complet → permet d'envoyer l'article entier par email (RSS-to-email)
      content: absolutize(
        sanitizeHtml(parser.render(article.body), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'title', 'width', 'height'],
          },
        })
      ),
    })),
    customData: `<language>fr-FR</language>`,
  });
}
