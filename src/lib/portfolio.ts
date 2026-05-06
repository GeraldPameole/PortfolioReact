/**
 * portfolio.ts — Fonctions métier centralisées du portfolio
 *
 * Regroupe toutes les opérations sur le contenu (articles, livres, projets)
 * et les utilitaires de présentation (dates, temps de lecture, domaines).
 */

import { getCollection, type CollectionEntry } from "astro:content";
import { mapToStandardTheme } from "../utils/themeUtils";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Article = CollectionEntry<"articles">;
export type Book    = CollectionEntry<"books">;
export type Work    = CollectionEntry<"work">;

// ── Articles ──────────────────────────────────────────────────────────────────

/** Tous les articles triés du plus récent au plus ancien */
export async function getArticles(limit?: number): Promise<Article[]> {
  const articles = await getCollection("articles");
  const sorted = articles.sort(
    (a, b) =>
      new Date(b.data.publishDate).getTime() -
      new Date(a.data.publishDate).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Articles d'un domaine spécifique */
export async function getArticlesByDomain(domain: string, limit?: number): Promise<Article[]> {
  const all = await getArticles();
  const filtered = all.filter((a) => (a.data as any).domain === domain);
  return limit ? filtered.slice(0, limit) : filtered;
}

/** Articles groupés par domaine */
export async function getArticlesGroupedByDomain(): Promise<Record<string, Article[]>> {
  const all = await getArticles();
  return all.reduce<Record<string, Article[]>>((acc, article) => {
    const domain = (article.data as any).domain ?? "autre";
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(article);
    return acc;
  }, {});
}

/** Articles avec un thème spécifique */
export async function getArticlesByTheme(theme: string): Promise<Article[]> {
  const all = await getArticles();
  return all.filter((a) => mapToStandardTheme((a.data as any).theme ?? (a.data as any).domain) === theme);
}

// ── Livres ────────────────────────────────────────────────────────────────────

/** Tous les livres triés par note décroissante */
export async function getBooks(): Promise<Book[]> {
  const books = await getCollection("books");
  return books.sort((a, b) => (b.data.note ?? 0) - (a.data.note ?? 0));
}

/** Livres d'une catégorie (champ profession) */
export async function getBooksByCategory(category: string): Promise<Book[]> {
  const all = await getBooks();
  return all.filter((b) => b.data.profession === category);
}

// ── Projets / Work ────────────────────────────────────────────────────────────

/** Tous les projets triés du plus récent au plus ancien */
export async function getWorks(limit?: number): Promise<Work[]> {
  const works = await getCollection("work");
  const sorted = works.sort(
    (a, b) =>
      new Date(b.data.publishDate).getTime() -
      new Date(a.data.publishDate).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

// ── Utilitaires ───────────────────────────────────────────────────────────────

/** Calcule le temps de lecture en minutes (200 mots/min) */
export function readingTime(body: string): number {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 200));
}

/** Formate une date en français */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(d);
}

/** Formate une date courte (ex: "Jan 2025") */
export function formatDateShort(date: string | Date): string {
  return formatDate(date, { month: "short", year: "numeric" });
}

/** Extrait les domaines uniques de tous les articles */
export async function getAllDomains(): Promise<string[]> {
  const all = await getArticles();
  return [...new Set(all.map((a) => (a.data as any).domain).filter(Boolean))].sort();
}

/** Extrait les tags uniques de tous les articles */
export async function getAllTags(): Promise<string[]> {
  const all = await getArticles();
  const tags = all.flatMap((a) => a.data.tags ?? []);
  return [...new Set(tags)].sort();
}

/** Retourne des statistiques globales du portfolio */
export async function getPortfolioStats() {
  const [articles, books, works] = await Promise.all([
    getArticles(),
    getBooks(),
    getWorks(),
  ]);
  const domains = new Set(articles.map((a) => (a.data as any).domain).filter(Boolean));
  return {
    articleCount: articles.length,
    bookCount:    books.length,
    workCount:    works.length,
    domainCount:  domains.size,
  };
}
