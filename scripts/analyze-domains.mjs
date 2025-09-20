import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Script pour analyser les domaines de compétences
async function analyzeDomains() {
  console.log("🔍 Analyse des domaines de compétences...\n");

  // Lire les articles depuis le dossier content
  const articlesDir = path.join(__dirname, "../src/content/articles");
  const articles = [];

  try {
    const files = fs.readdirSync(articlesDir);

    for (const file of files) {
      if (file.endsWith(".md")) {
        const filePath = path.join(articlesDir, file);
        const content = fs.readFileSync(filePath, "utf-8");

        // Extraire les métadonnées frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          const metadata = {};

          // Parser le frontmatter
          frontmatter.split("\n").forEach((line) => {
            const colonIndex = line.indexOf(":");
            if (colonIndex > 0) {
              const key = line.substring(0, colonIndex).trim();
              const value = line
                .substring(colonIndex + 1)
                .trim()
                .replace(/^["']|["']$/g, "");
              metadata[key] = value;
            }
          });

          articles.push({
            slug: file.replace(".md", ""),
            data: metadata,
            body: content.substring(frontmatterMatch[0].length),
          });
        }
      }
    }
  } catch (error) {
    console.error("Erreur lors de la lecture des articles:", error);
    return;
  }

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
    const domainArticles = articles.filter(
      (article) => article.data.domain === domain
    );
    articlesByDomain[domain] = domainArticles;
    domainStats[domain] = {
      total: domainArticles.length,
      featured: domainArticles.filter((a) => a.data.featured === "true").length,
      recent: domainArticles.filter((a) => {
        if (!a.data.date) return false;
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
    const domainArticles = articlesByDomain[domain];
    console.log(`🏷️  ${domain}:`);
    console.log(`   📝 Total: ${stats.total} articles`);
    console.log(`   ⭐ Featured: ${stats.featured} articles`);
    console.log(`   📅 Récents (30j): ${stats.recent} articles`);

    if (domainArticles.length > 0) {
      console.log("   📋 Top 5 articles:");
      domainArticles
        .sort((a, b) => {
          if (a.data.featured === "true" && b.data.featured !== "true")
            return -1;
          if (a.data.featured !== "true" && b.data.featured === "true")
            return 1;
          if (a.data.date && b.data.date) {
            return (
              new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
            );
          }
          return 0;
        })
        .slice(0, 5)
        .forEach((article, index) => {
          const featured = article.data.featured === "true" ? " ⭐" : "";
          console.log(
            `      ${index + 1}. ${article.data.title || "Sans titre"}${featured}`
          );
        });
    }
    console.log("");
  });

  // Articles non classés
  const unclassifiedArticles = articles.filter(
    (article) => !Object.keys(domainesCompetences).includes(article.data.domain)
  );

  if (unclassifiedArticles.length > 0) {
    console.log("⚠️  Articles non classés dans les domaines principaux:");
    unclassifiedArticles.forEach((article) => {
      console.log(
        `   - ${article.data.title || "Sans titre"} (${article.data.domain || "Aucun domaine"})`
      );
    });
    console.log("");
  }

  // Résumé global
  const totalArticles = articles.length;
  const totalFeatured = articles.filter(
    (a) => a.data.featured === "true"
  ).length;
  const totalRecent = articles.filter((a) => {
    if (!a.data.date) return false;
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
