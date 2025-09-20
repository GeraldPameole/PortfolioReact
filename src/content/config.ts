import { defineCollection, z } from "astro:content";

// Schéma commun pour tous les contenus
const baseSchema = {
  title: z.string(),
  description: z.string(),
  author: z.string().optional(),
  publishDate: z.string().optional(),
  updatedDate: z.string().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  theme: z.string().optional(),
};

// Schéma pour les articles
const articleSchema = z.object({
  ...baseSchema,
  type: z.literal("article"),
  publishDate: z.string(),
  readingTime: z.number().optional(),
  featured: z.boolean().optional().default(false),
});

// Schéma pour les livres
const bookSchema = z.object({
  ...baseSchema,
  type: z.literal("book"),
  author: z.string(),
  profession: z.string(),
  coverImage: z.string().optional(),
  publishYear: z.number().optional(),
  note: z.number().optional(),
  amazonLink: z.string().optional(),
  category: z.string().optional(),
  relatedContent: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
        type: z.enum(["article", "book"]).optional(),
      })
    )
    .optional(),
});

// Définition des collections
export const collections = {
  articles: defineCollection({
    type: "content",
    schema: articleSchema,
  }),
  books: defineCollection({
    type: "content",
    schema: bookSchema,
  }),
};

export type ArticleSchema = z.infer<typeof articleSchema>;
export type BookSchema = z.infer<typeof bookSchema>;
