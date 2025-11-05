// Configuration des articles mis en avant par domaine
export const FEATURED_ARTICLES_BY_DOMAIN = {
  "gestion-projet": [
    "agile-scrum-methodologies",
    "gestion-performance-equipe",
    "gestion-performance-evaluation",
  ],
  "developpement-web": [
    "frameworks-javascript-analyse-2024",
    "frameworks-javascript-comparaison-2024",
    "progressive-web-apps-2024",
  ],
  "qualite-process": [
    "gestion-qualite-amelioration",
    "gestion-qualite-certification",
    "gestion-qualite-entreprise",
  ],
  formation: [
    "apprentissage-continu-developpement-competences",
    "formation-adaptation",
    "formation-collaboration",
  ],
  "developpement-commercial": [
    "negocier-salaire-techniques-avancees",
    "recrutement-talents-digitaux",
  ],
  "gestion-talents": [
    "gestion-competences-developpement",
    "gestion-conflits-equipe",
    "gestion-talents-attraction",
  ],
  "productivite-methodes": [
    "gestion-priorites-efficacite",
    "methode-gtd-expliquee",
    "deep-work",
  ],
  "transformation-digitale": [
    "transformation-numerique-entreprise",
    "transformation-digitale-telecom",
    "transformation-numerique-talents",
  ],
  "marketing-communication": [
    "marketing-digital-strategies",
    "strategies-reseaux-sociaux-entreprises",
    "email-marketing-personnalisation",
  ],
  "leadership-management": [
    "formation-leadership",
    "importance-leadership",
    "management-hybride-defis-opportunites",
  ],
  "innovation-technologies": [
    "ia-transformation-societe-2024-analyse",
    "intelligence-artificielle-transformation-marketing",
    "nouvelles-tendances-developpement-web",
  ],
  "service-client": [
    "service-client-excellence",
    "service-client-performance",
    "service-client-strategies",
  ],
  "gestion-connaissances": [
    "gestion-connaissances-organisation",
    "partage-connaissances-equipes",
    "capital-humain-entreprise",
  ],
  "reconversion-carriere": [
    "reconversion-professionnelle-reussie",
    "changement-carriere-opportunites",
    "transition-professionnelle",
  ],
  "outils-techniques": [
    "mermaid-example",
    "visualisations-mermaid",
    "pillcolor-guide",
  ],
} as const;

// Fonction pour obtenir les articles mis en avant d'un domaine
export function getFeaturedArticlesForDomain(domain: string): string[] {
  return (
    FEATURED_ARTICLES_BY_DOMAIN[
      domain as keyof typeof FEATURED_ARTICLES_BY_DOMAIN
    ] || []
  );
}

// Fonction pour vérifier si un article est mis en avant
export function isFeaturedArticle(slug: string, domain: string): boolean {
  const featuredArticles = getFeaturedArticlesForDomain(domain);
  return featuredArticles.includes(slug);
}
