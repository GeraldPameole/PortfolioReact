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
  domain: z.string().optional(),
  readingTime: z.number().optional(),
  featured: z.boolean().optional().default(false),
  keywords: z.array(z.string()).optional().default([]),
  pillColor: z.string().optional(),
  relatedArticles: z.array(z.any()).optional(),
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

// Schéma pour les fiches métier (src/content/work/) — utilisé par /metiers/[slug]
const workSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.string(),
  updatedDate: z.string().optional(),
  author: z.string().optional(),
  img: z.string().optional(),
  img_alt: z.string().optional(),
  company: z.string().optional(),
  period: z.string().optional(),
  location: z.string().optional(),
  domain: z.string().optional(),
  technologies: z.array(z.string()).optional().default([]),
  projectType: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});

// Schéma pour les docs internes (src/content/docs/) — guides éditoriaux
const docSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
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
  work: defineCollection({
    type: "content",
    schema: workSchema,
  }),
  docs: defineCollection({
    type: "content",
    schema: docSchema,
  }),
};

export type ArticleSchema = z.infer<typeof articleSchema>;
export type BookSchema = z.infer<typeof bookSchema>;
export type WorkSchema = z.infer<typeof workSchema>;
export type DocSchema = z.infer<typeof docSchema>;
