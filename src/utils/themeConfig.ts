export interface ThemeConfig {
  image: string;
  color: string;
  icon: string;
  label: string;
  description: string;
}

export const themeConfigs: Record<string, ThemeConfig> = {
  developpement: {
    image: "/assets/themes/development.webp",
    color: "#3498db",
    icon: "fa-solid fa-code",
    label: "Développement",
    description:
      "Articles sur le développement logiciel et les bonnes pratiques",
  },
  technologie: {
    image: "/assets/themes/technology.webp",
    color: "#2ecc71",
    icon: "fa-solid fa-microchip",
    label: "Technologie",
    description: "Actualités et analyses des nouvelles technologies",
  },
  carriere: {
    image: "/assets/themes/career.webp",
    color: "#e74c3c",
    icon: "fa-solid fa-briefcase",
    label: "Carrière",
    description: "Conseils et retours d'expérience sur la carrière en tech",
  },
  formation: {
    image: "/assets/themes/education.webp",
    color: "#f39c12",
    icon: "fa-solid fa-graduation-cap",
    label: "Formation",
    description: "Ressources et guides d'apprentissage",
  },
  autre: {
    image: "/assets/themes/other.webp",
    color: "#9b59b6",
    icon: "fa-solid fa-circle-info",
    label: "Autre",
    description: "Articles divers et variés",
  },
};

export function getThemeConfig(theme: string): ThemeConfig {
  return themeConfigs[theme.toLowerCase()] || themeConfigs.autre;
}
