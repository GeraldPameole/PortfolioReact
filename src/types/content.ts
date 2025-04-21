import type { ThemeKey } from "../utils/themeUtils";

/**
 * Interface pour les données de base d'un élément de contenu
 */
export interface ContentItem {
  title: string;
  description: string;
  author?: string;
  publishDate?: Date;
  updatedDate?: Date;
  image?: string;
  slug: string;
  tags?: string[];
  theme?: string;
}

/**
 * Interface pour les données d'un article
 * Utilise un discriminateur 'type' pour permettre la distinction
 */
export interface ArticleData extends ContentItem {
  type: "article";
  body: string;
  publishDate: Date;
  readingTime?: number;
  featured?: boolean;
}

/**
 * Interface pour les données d'un livre
 * Utilise un discriminateur 'type' pour permettre la distinction
 */
export interface BookData extends ContentItem {
  type: "book";
  author: string;
  profession: string;
  coverImage?: string;
  publishYear?: number;
  note?: number;
  amazonLink?: string;
  category?: string;
  relatedContent?: {
    title: string;
    url: string;
    type?: "article" | "book";
  }[];
}

/**
 * Type union pour représenter soit des données d'article soit des données de livre
 */
export type ContentData = ArticleData | BookData;

/**
 * Type pour un article avec son contenu et ses données
 */
export interface Article {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: ArticleData;
  render: () => Promise<{ Content: any }>;
}

/**
 * Type pour un livre avec son contenu et ses données
 */
export interface Book {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: BookData;
  render: () => Promise<{ Content: any }>;
}

/**
 * Type union pour représenter soit un article soit un livre
 */
export type ContentEntry = Article | Book;

/**
 * Type pour un livre avec des thèmes standards
 */
export interface BookWithTheme extends Book {
  originalTheme: string;
  standardTheme: ThemeKey;
}

/**
 * Type pour un article avec des thèmes standards
 */
export interface ArticleWithTheme extends Article {
  originalTheme: string;
  standardTheme: ThemeKey;
}

/**
 * Type union pour représenter soit un article soit un livre avec thème
 */
export type ContentWithTheme = ArticleWithTheme | BookWithTheme;

/**
 * Type guard pour vérifier si l'élément est un article
 */
export function isArticle(item: ContentEntry): item is Article {
  return item.data.type === "article";
}

/**
 * Type guard pour vérifier si l'élément est un livre
 */
export function isBook(item: ContentEntry): item is Book {
  return item.data.type === "book";
}

/**
 * Type guard pour vérifier si l'élément est un article avec thème
 */
export function isArticleWithTheme(
  item: ContentWithTheme
): item is ArticleWithTheme {
  return item.data.type === "article";
}

/**
 * Type guard pour vérifier si l'élément est un livre avec thème
 */
export function isBookWithTheme(item: ContentWithTheme): item is BookWithTheme {
  return item.data.type === "book";
}
