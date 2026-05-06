import type { CollectionEntry } from "astro:content";

// ── Types ────────────────────────────────────────────────────────────────────

export type ThemeKey =
  | "developpement"
  | "technologie"
  | "carriere"
  | "formation"
  | "gestion"
  | "qualite"
  | "marketing"
  | "innovation"
  | "management"
  | "commercial"
  | "autre";

export interface ThemeConfig {
  label: string;
  icon: string;
  gradient: string;
  bg: string;
  text: string;
  image: string;
}

// ── Thèmes standardisés ───────────────────────────────────────────────────────

export const standardThemes: Record<ThemeKey, ThemeConfig> = {
  developpement: {
    label: "Développement Web",
    icon: "fas fa-code",
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-100",
    text: "text-blue-800",
    image: "/assets/themes/coding.webp",
  },
  technologie: {
    label: "Technologies & IA",
    icon: "fas fa-microchip",
    gradient: "from-purple-500 to-indigo-500",
    bg: "bg-purple-100",
    text: "text-purple-800",
    image: "/assets/themes/tech.webp",
  },
  carriere: {
    label: "Carrière & Reconversion",
    icon: "fas fa-briefcase",
    gradient: "from-green-500 to-emerald-500",
    bg: "bg-green-100",
    text: "text-green-800",
    image: "/assets/themes/career.webp",
  },
  formation: {
    label: "Formation & Pédagogie",
    icon: "fas fa-graduation-cap",
    gradient: "from-yellow-500 to-amber-500",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    image: "/assets/themes/education.webp",
  },
  gestion: {
    label: "Gestion & Productivité",
    icon: "fas fa-tasks",
    gradient: "from-red-500 to-pink-500",
    bg: "bg-red-100",
    text: "text-red-800",
    image: "/assets/themes/management.webp",
  },
  qualite: {
    label: "Qualité & Process",
    icon: "fas fa-clipboard-check",
    gradient: "from-teal-500 to-cyan-500",
    bg: "bg-teal-100",
    text: "text-teal-800",
    image: "/assets/themes/quality.webp",
  },
  marketing: {
    label: "Marketing & Communication",
    icon: "fas fa-bullhorn",
    gradient: "from-pink-500 to-rose-500",
    bg: "bg-pink-100",
    text: "text-pink-800",
    image: "/assets/themes/marketing.webp",
  },
  innovation: {
    label: "Innovation & Digital",
    icon: "fas fa-rocket",
    gradient: "from-violet-500 to-purple-500",
    bg: "bg-violet-100",
    text: "text-violet-800",
    image: "/assets/themes/innovation.webp",
  },
  management: {
    label: "Leadership & Management",
    icon: "fas fa-users",
    gradient: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-100",
    text: "text-indigo-800",
    image: "/assets/themes/leadership.webp",
  },
  commercial: {
    label: "Développement Commercial",
    icon: "fas fa-handshake",
    gradient: "from-orange-500 to-amber-500",
    bg: "bg-orange-100",
    text: "text-orange-800",
    image: "/assets/themes/sales.webp",
  },
  autre: {
    label: "Autres Sujets",
    icon: "fas fa-ellipsis-h",
    gradient: "from-gray-500 to-slate-500",
    bg: "bg-gray-100",
    text: "text-gray-800",
    image: "/assets/themes/other.webp",
  },
};

// ── Mapping thème/domaine → ThemeKey ─────────────────────────────────────────

const THEME_MAP: Record<string, ThemeKey> = {
  // Développement web
  web: "developpement", frontend: "developpement", backend: "developpement",
  javascript: "developpement", react: "developpement", vue: "developpement",
  angular: "developpement", node: "developpement", "developpement-web": "developpement",
  // Technologie / IA
  python: "technologie", ia: "technologie", ml: "technologie",
  devops: "technologie", cloud: "technologie", technologie: "technologie",
  "innovation-technologies": "technologie", "outils-techniques": "technologie",
  outils: "technologie", technique: "technologie",
  // Carrière
  carriere: "carriere", emploi: "carriere", "reconversion-carriere": "carriere",
  // Formation
  formation: "formation", apprentissage: "formation", pedagogie: "formation",
  mentorat: "formation",
  // Gestion / Productivité / Projet
  gestion: "gestion", projet: "gestion", agile: "gestion", scrum: "gestion",
  "gestion-projet": "gestion", planning: "gestion", productivite: "gestion",
  "productivite-methodes": "gestion", methode: "gestion", organisation: "gestion",
  temps: "gestion",
  // Qualité
  qualite: "qualite", process: "qualite", "qualite-process": "qualite",
  lean: "qualite", "six-sigma": "qualite",
  // Marketing
  marketing: "marketing", communication: "marketing",
  "marketing-communication": "marketing", seo: "marketing", content: "marketing",
  // Innovation / Digital
  innovation: "innovation", "transformation-digitale": "innovation",
  digital: "innovation", numerique: "innovation",
  // Management / Leadership / Talents
  management: "management", leadership: "management",
  "leadership-management": "management", equipe: "management",
  "gestion-talents": "management", talents: "management", rh: "management",
  "service-client": "management", "gestion-connaissances": "management",
  // Commercial
  commercial: "commercial", vente: "commercial", negociation: "commercial",
  "developpement-commercial": "commercial", b2b: "commercial",
};

export function mapToStandardTheme(customTheme: string | null | undefined): ThemeKey {
  if (!customTheme) return "autre";
  return THEME_MAP[customTheme.toLowerCase()] ?? "autre";
}

// ── Groupement par thème ──────────────────────────────────────────────────────

export function groupByTheme(
  articles: CollectionEntry<"articles">[]
): Record<ThemeKey, CollectionEntry<"articles">[]> {
  const grouped = {} as Record<ThemeKey, CollectionEntry<"articles">[]>;
  articles.forEach((article) => {
    const raw = (article.data as any).theme || (article.data as any).domain || article.data.tags?.[0] || "autre";
    const theme = mapToStandardTheme(raw);
    if (!grouped[theme]) grouped[theme] = [];
    grouped[theme].push(article);
  });
  return grouped;
}

// ── Utilitaires ───────────────────────────────────────────────────────────────

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "long", day: "numeric" }).format(d);
}

export function calculateReadingTime(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}
