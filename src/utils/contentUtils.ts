import type { CollectionEntry } from "astro:content";
import type { ThemeKey } from "./themeUtils";
import { mapToStandardTheme } from "./themeUtils";

export function groupByTheme(
  articles: CollectionEntry<"articles">[]
): Record<ThemeKey, CollectionEntry<"articles">[]> {
  const grouped: Record<ThemeKey, CollectionEntry<"articles">[]> = {} as Record<
    ThemeKey,
    CollectionEntry<"articles">[]
  >;

  articles.forEach((article) => {
    const theme =
      article.data.theme ||
      (article.data.tags && article.data.tags.length > 0
        ? article.data.tags[0]
        : "autre");
    const standardTheme = mapToStandardTheme(theme);

    if (!grouped[standardTheme]) {
      grouped[standardTheme] = [];
    }
    grouped[standardTheme].push(article);
  });

  return grouped;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
