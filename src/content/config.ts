import { defineCollection, z } from "astro:content";

const relatedContentSchema = z.object({
  title: z.string(),
  url: z.string(),
  type: z.enum(["article", "book"]).optional(),
});

const articles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string().transform((str) => new Date(str)),
    author: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    theme: z.string().optional(),
    keywords: z.string().optional(),
    note: z.number().min(0).max(5).optional(),
    skills: z.array(z.string()).optional(),
    relatedContent: z.array(relatedContentSchema).optional(),
  }),
});

const books = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    profession: z.string(),
    coverImage: z.string().optional(),
    amazonLink: z.string().optional(),
    publishYear: z.number().optional(),
    note: z.number().min(0).max(5).optional(),
    relatedContent: z.array(relatedContentSchema).optional(),
  }),
});

const work = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string(),
    image: z.string().optional(),
    client: z.string().optional(),
    technologies: z.array(z.string()).optional(),
  }),
});

export const collections = {
  articles,
  books,
  work,
};
