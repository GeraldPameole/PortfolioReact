const projects = [
  {
    title: "Plateforme E-learning",
    description:
      "Application web complète pour la gestion de cours en ligne avec système de paiement intégré, suivi des progrès et interface interactive.",
    technologies: ["Next.js", "TypeScript", "MongoDB", "Stripe"],
    image: "/projects/e-learning.jpg",
    link: "https://github.com/yourusername/e-learning",
  },
  {
    title: "Dashboard Analytics",
    description:
      "Tableau de bord en temps réel pour la visualisation de données complexes avec filtres dynamiques et export de rapports.",
    technologies: ["React", "D3.js", "Node.js", "PostgreSQL"],
    image: "/projects/dashboard.jpg",
    link: "https://github.com/yourusername/analytics-dashboard",
  },
  {
    title: "Application de Gestion",
    description:
      "Système de gestion d'entreprise avec authentification, gestion des utilisateurs et génération de rapports automatisés.",
    technologies: ["React", "Express", "MongoDB", "JWT"],
    image: "/projects/management.jpg",
    link: "https://github.com/yourusername/management-app",
  },
];

const Projects = () => {
  return (
    <section id="portfolio" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-4">
          Projets Réalisés
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Découvrez mes dernières réalisations et projets personnels
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
            >
              <div className="relative h-48">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Voir le projet
                  </a>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
