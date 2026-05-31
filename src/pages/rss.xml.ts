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
    items: sorted.map((article) => {
      // Image absolutisée pour LinkedIn / Buffer / autres consommateurs RSS
      const rawImg = article.data.image;
      const imgUrl = rawImg
        ? (rawImg.startsWith('http') ? rawImg : `${site}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`)
        : undefined;
      const imgType = imgUrl?.match(/\.webp$/i) ? 'image/webp'
                    : imgUrl?.match(/\.png$/i)  ? 'image/png'
                    : 'image/jpeg';

      return {
        title: article.data.title,
        description: article.data.description,
        pubDate: new Date(article.data.publishDate),
        link: `/blog/${article.slug}`,
        // Auteur (utilisé par Buffer/Hootsuite/etc. pour attribution)
        author: `${article.data.author ?? 'Gérald Paméole'} (${site}/about)`,
        // Tags → catégories RSS → Buffer peut les convertir en hashtags LinkedIn suggérés
        categories: article.data.tags ?? [],
        // Image principale → utilisée par Buffer/MRSS pour le visuel du post LinkedIn (engagement ×3)
        ...(imgUrl && {
          enclosure: {
            url: imgUrl,
            length: 0,           // taille inconnue à la génération, accepté par la plupart des lecteurs
            type: imgType,
          },
        }),
        // Contenu HTML complet → RSS-to-email (Buttondown) ET fallback image (1er <img>) pour Buffer
        content: absolutize(
          sanitizeHtml(parser.render(article.body), {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
            allowedAttributes: {
              ...sanitizeHtml.defaults.allowedAttributes,
              img: ['src', 'alt', 'title', 'width', 'height'],
            },
          })
        ),
      };
    }),
    customData: `<language>fr-FR</language>`,
  });
}
