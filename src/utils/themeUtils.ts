// Définition des thèmes standardisés avec leurs images associées
export type ThemeKey =
  | "developpement"
  | "technologie"
  | "carriere"
  | "formation"
  | "gestion"
  | "qualite";

export interface ThemeConfig {
  label: string;
  icon: string;
  gradient: string;
  bg: string;
  text: string;
  image: string;
}

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
    label: "Technologies",
    icon: "fas fa-microchip",
    gradient: "from-purple-500 to-indigo-500",
    bg: "bg-purple-100",
    text: "text-purple-800",
    image: "/assets/themes/tech.webp",
  },
  carriere: {
    label: "Carrière",
    icon: "fas fa-briefcase",
    gradient: "from-green-500 to-emerald-500",
    bg: "bg-green-100",
    text: "text-green-800",
    image: "/assets/themes/career.webp",
  },
  formation: {
    label: "Formation",
    icon: "fas fa-graduation-cap",
    gradient: "from-yellow-500 to-amber-500",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    image: "/assets/themes/education.webp",
  },
  gestion: {
    label: "Gestion de Projet",
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
  autre: {
    label: "Autres Sujets",
    icon: "fas fa-ellipsis-h",
    gradient: "from-gray-500 to-slate-500",
    bg: "bg-gray-100",
    text: "text-gray-800",
    image: "/assets/themes/other.webp",
  },
};

// Fonction pour mapper des thèmes personnalisés vers des thèmes standardisés
export function mapToStandardTheme(
  customTheme: string | null | undefined
): ThemeKey {
  if (!customTheme) return "autre";

  const themeMap: Record<string, ThemeKey> = {
    web: "developpement",
    frontend: "developpement",
    backend: "developpement",
    javascript: "technologie",
    react: "technologie",
    vue: "technologie",
    angular: "technologie",
    node: "technologie",
    python: "technologie",
    ia: "technologie",
    ml: "technologie",
    devops: "technologie",
    cloud: "technologie",
    carriere: "carriere",
    emploi: "carriere",
    recrutement: "carriere",
    formation: "formation",
    apprentissage: "formation",
    gestion: "gestion",
    projet: "gestion",
    management: "gestion",
    qualite: "qualite",
    process: "qualite",
    agile: "qualite",
    scrum: "qualite",
  };

  return themeMap[customTheme.toLowerCase()] || "autre";
}

// Fonction pour calculer le temps de lecture
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Fonction pour grouper les articles par thème
export function groupByTheme<T extends { data: { tags?: string[] } }>(
  items: T[]
): Record<ThemeKey, T[]> {
  return items.reduce(
    (acc, item) => {
      const theme = mapToStandardTheme(item.data.tags?.[0] || "autre");
      if (!acc[theme]) {
        acc[theme] = [];
      }
      acc[theme].push(item);
      return acc;
    },
    {} as Record<ThemeKey, T[]>
  );
}
