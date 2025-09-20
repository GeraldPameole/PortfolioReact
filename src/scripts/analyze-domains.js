import { getCollection } from "astro:content";

// Script pour analyser les domaines de compétences
async function analyzeDomains() {
  console.log("🔍 Analyse des domaines de compétences...\n");

  // Récupérer tous les articles
  const allArticles = await getCollection("articles");

  // Définir les domaines de compétence principaux
  const domainesCompetences = {
    "Formation & Développement": {
      description:
        "Articles sur la formation, le développement des compétences et l'apprentissage continu",
      color: "blue",
      icon: "fas fa-graduation-cap",
    },
    "Gestion des Talents": {
      description:
        "Stratégies et méthodes pour gérer, développer et fidéliser les talents",
      color: "green",
      icon: "fas fa-users",
    },
    "Développement Web": {
      description:
        "Tendances, technologies et bonnes pratiques du développement web moderne",
      color: "purple",
      icon: "fas fa-code",
    },
    Management: {
      description: "Leadership, gestion d'équipe et management de projet",
      color: "orange",
      icon: "fas fa-briefcase",
    },
    "Développement Commercial": {
      description:
        "Marketing digital, stratégies commerciales et développement business",
      color: "red",
      icon: "fas fa-chart-line",
    },
    "Transformation Digitale": {
      description:
        "Innovation technologique et transformation des organisations",
      color: "indigo",
      icon: "fas fa-digital-tachograph",
    },
    "Productivité & Gestion du Temps": {
      description:
        "Méthodes et outils pour optimiser sa productivité et gérer son temps",
      color: "teal",
      icon: "fas fa-clock",
    },
    "Développement Personnel": {
      description: "Développement des soft skills et compétences personnelles",
      color: "pink",
      icon: "fas fa-user-graduate",
    },
    "Formation & Pédagogie": {
      description: "Méthodes pédagogiques et techniques de formation",
      color: "yellow",
      icon: "fas fa-chalkboard-teacher",
    },
    "Ressources Humaines": {
      description: "Gestion RH, évaluation et développement des compétences",
      color: "emerald",
      icon: "fas fa-hands-helping",
    },
  };

  // Analyser les articles par domaine
  const articlesByDomain = {};
  const domainStats = {};

  Object.keys(domainesCompetences).forEach((domain) => {
    const articles = allArticles.filter(
      (article) => article.data.domain === domain
    );
    articlesByDomain[domain] = articles;
    domainStats[domain] = {
      total: articles.length,
      featured: articles.filter((a) => a.data.featured).length,
      recent: articles.filter((a) => {
        const date = new Date(a.data.date);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      }).length,
    };
  });

  // Afficher les statistiques
  console.log("📊 Statistiques par domaine de compétence :\n");

  Object.entries(domainStats).forEach(([domain, stats]) => {
    const articles = articlesByDomain[domain];
    console.log(`🏷️  ${domain}:`);
    console.log(`   📝 Total: ${stats.total} articles`);
    console.log(`   ⭐ Featured: ${stats.featured} articles`);
    console.log(`   📅 Récents (30j): ${stats.recent} articles`);

    if (articles.length > 0) {
      console.log("   📋 Top 5 articles:");
      articles
        .sort((a, b) => {
          if (a.data.featured && !b.data.featured) return -1;
          if (!a.data.featured && b.data.featured) return 1;
          return (
            new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
          );
        })
        .slice(0, 5)
        .forEach((article, index) => {
          const featured = article.data.featured ? " ⭐" : "";
          console.log(`      ${index + 1}. ${article.data.title}${featured}`);
        });
    }
    console.log("");
  });

  // Articles non classés
  const unclassifiedArticles = allArticles.filter(
    (article) => !Object.keys(domainesCompetences).includes(article.data.domain)
  );

  if (unclassifiedArticles.length > 0) {
    console.log("⚠️  Articles non classés dans les domaines principaux:");
    unclassifiedArticles.forEach((article) => {
      console.log(`   - ${article.data.title} (${article.data.domain})`);
    });
    console.log("");
  }

  // Résumé global
  const totalArticles = allArticles.length;
  const totalFeatured = allArticles.filter((a) => a.data.featured).length;
  const totalRecent = allArticles.filter((a) => {
    const date = new Date(a.data.date);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }).length;

  console.log("📈 Résumé global:");
  console.log(`   📝 Total articles: ${totalArticles}`);
  console.log(`   ⭐ Articles featured: ${totalFeatured}`);
  console.log(`   📅 Articles récents (30j): ${totalRecent}`);
  console.log(`   🏷️  Domaines couverts: ${Object.keys(domainStats).length}`);
  console.log("");

  // Recommandations
  console.log("💡 Recommandations:");

  Object.entries(domainStats).forEach(([domain, stats]) => {
    if (stats.total < 5) {
      console.log(
        `   ⚠️  ${domain}: Seulement ${stats.total} articles - besoin de plus de contenu`
      );
    } else if (stats.featured === 0) {
      console.log(
        `   💡 ${domain}: Aucun article featured - considérer mettre en avant un article clé`
      );
    }
  });

  if (unclassifiedArticles.length > 0) {
    console.log(
      `   🔧 ${unclassifiedArticles.length} articles non classés - vérifier les domaines`
    );
  }

  console.log("\n✅ Analyse terminée !");
}

// Exécuter l'analyse
analyzeDomains().catch(console.error);
