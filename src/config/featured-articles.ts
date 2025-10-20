// Configuration des articles mis en avant par domaine
export const FEATURED_ARTICLES_BY_DOMAIN = {
  "gestion-projet": [
    "agile-scrum-methodologies",
    "gestion-projet-agile-meilleures-pratiques", 
    "gestion-risques-projet"
  ],
  "developpement-web": [
    "frameworks-javascript-analyse-2024",
    "react-performance-optimisation",
    "progressive-web-apps-2024"
  ],
  "qualite-process": [
    "gestion-qualite-certification",
    "optimisation-processus-entreprise",
    "gestion-qualite-strategie"
  ],
  "formation": [
    "formation-professionnelle-continue",
    "mentoring-developpement-professionnel",
    "apprentissage-continu-developpement-competences"
  ],
  "developpement-commercial": [
    "negocier-salaire-techniques-avancees",
    "recrutement-talents-digitaux"
  ],
  "gestion-talents": [
    "gestion-talents-developpement",
    "leadership-equipes-performance",
    "management-diversite-inclusion"
  ],
  "productivite-methodes": [
    "gestion-temps-professionnels",
    "methode-gtd-expliquee",
    "deep-work"
  ],
  "transformation-digitale": [
    "ia-transformation-societe-2024",
    "transformation-numerique-entreprise",
    "nouvelles-tendances-developpement-web"
  ],
  "marketing-communication": [
    "marketing-digital-strategies",
    "strategies-reseaux-sociaux-entreprises",
    "email-marketing-personnalisation"
  ],
  "leadership-management": [
    "formation-leadership",
    "importance-leadership",
    "management-hybride-defis-opportunites"
  ],
  "innovation-technologies": [
    "ia-transformation-societe-2024-analyse",
    "intelligence-artificielle-transformation-marketing",
    "nouvelles-tendances-developpement-web"
  ],
  "service-client": [
    "service-client-excellence",
    "service-client-performance"
  ],
  "gestion-connaissances": [
    "gestion-connaissances-organisation"
  ],
  "reconversion-carriere": [
    "reconversion-professionnelle-reussie"
  ],
  "outils-techniques": [
    "mermaid-example",
    "visualisations-mermaid",
    "pillcolor-guide"
  ]
} as const;

// Fonction pour obtenir les articles mis en avant d'un domaine
export function getFeaturedArticlesForDomain(domain: string): string[] {
  return FEATURED_ARTICLES_BY_DOMAIN[domain as keyof typeof FEATURED_ARTICLES_BY_DOMAIN] || [];
}

// Fonction pour vérifier si un article est mis en avant
export function isFeaturedArticle(slug: string, domain: string): boolean {
  const featuredArticles = getFeaturedArticlesForDomain(domain);
  return featuredArticles.includes(slug);
}
