// Configuration centralisée des domaines de compétences
export const DOMAINS_CONFIG = {
  "gestion-projet": {
    name: "Gestion de Projet Télécom",
    icon: "fas fa-tasks",
    color: "blue",
    colorClass:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    description:
      "Pilotage de projets stratégiques multi-millions d'euros dans les télécommunications. Coordination d'équipes internationales, optimisation des infrastructures critiques et transformation digitale.",
    impact: "ROI +35% • 15+ projets • 40% réduction coûts",
    technologies: ["PMP", "Agile", "Scrum", "Prince2", "ITIL"],
  },
  "developpement-web": {
    name: "Développement Web",
    icon: "fas fa-laptop-code",
    color: "green",
    colorClass:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    description:
      "Architecture d'applications web scalables et développement full-stack. Conception de solutions innovantes, optimisation des performances et sécurité renforcée.",
    impact: "40% réduction temps • +60% satisfaction • 95% performance",
    technologies: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
  },
  "qualite-process": {
    name: "Qualité & Process",
    icon: "fas fa-check-circle",
    color: "purple",
    colorClass:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    description:
      "Certification ISO 9001 et mise en place de processus qualité avancés. Audits, conformité et tableaux de bord KPIs en temps réel.",
    impact: "50% efficacité • 30% non-conformités • ISO 9001",
    technologies: ["ISO 9001", "Six Sigma", "Lean", "Jira", "Confluence"],
  },
  formation: {
    name: "Formation & Pédagogie",
    icon: "fas fa-graduation-cap",
    color: "red",
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    description:
      "Formation certifiante de 200+ professionnels et programmes sur mesure. Coaching d'équipes et évaluation des performances.",
    impact: "200+ formés • 95% réussite • +45% performance",
    technologies: ["Moodle", "Zoom", "Teams", "Kahoot", "Articulate"],
  },
  "developpement-commercial": {
    name: "Développement Commercial",
    icon: "fas fa-handshake",
    color: "orange",
    colorClass:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    description:
      "Stratégies commerciales B2B et développement de partenariats stratégiques. Techniques de vente consultative et relation client premium.",
    impact: "+45% CA • 90% rétention • 25+ partenariats",
    technologies: ["CRM Salesforce", "HubSpot", "LinkedIn Sales", "Pipedrive"],
  },
} as const;

// Couleurs unifiées
export const COLOR_CLASSES = {
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  purple:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  orange:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
} as const;

// Couleurs pour les textes et icônes
export const TEXT_COLORS = {
  blue: "text-blue-600 dark:text-blue-400",
  green: "text-green-600 dark:text-green-400",
  purple: "text-purple-600 dark:text-purple-400",
  red: "text-red-600 dark:text-red-400",
  orange: "text-orange-600 dark:text-orange-400",
  indigo: "text-indigo-600 dark:text-indigo-400",
} as const;

// Couleurs pour les icônes
export const ICON_COLORS = {
  blue: "text-blue-600 dark:text-blue-400",
  green: "text-green-600 dark:text-green-400",
  purple: "text-purple-600 dark:text-purple-400",
  red: "text-red-600 dark:text-red-400",
  orange: "text-orange-600 dark:text-orange-400",
  indigo: "text-indigo-600 dark:text-indigo-400",
} as const;

// Icônes unifiées
export const ICONS = {
  "gestion-projet": "fas fa-tasks",
  "developpement-web": "fas fa-laptop-code",
  "qualite-process": "fas fa-check-circle",
  formation: "fas fa-graduation-cap",
  "developpement-commercial": "fas fa-handshake",
} as const;
