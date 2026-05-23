import { getCollection } from "astro:content";

export async function getAllArticles() {
  const articles = await getCollection("articles");
  return articles.sort((a, b) => {
    return (
      new Date(b.data.publishDate).getTime() -
      new Date(a.data.publishDate).getTime()
    );
  });
}
