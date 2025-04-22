/**
 * Script d'optimisation des performances pour le portfolio
 * Ce script se charge d'optimiser le chargement des ressources et d'améliorer les performances
 */

// Vérifier que nous sommes dans un environnement navigateur
const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

// Ne pas exécuter le code côté serveur
if (!isBrowser) {
  // Si nous sommes côté serveur, définir des fonctions vides
  const optimizeImageLoading = () => {};
  const setupScrollAnimations = () => {};
  const deferNonCriticalResources = () => {};
  const optimizeAstroTransitions = () => {};
} else {
  // Nous sommes dans le navigateur, le code peut s'exécuter normalement

  // Optimisation du lazy loading des images
  function optimizeImageLoading() {
    // Utiliser l'Intersection Observer API pour un lazy loading efficace
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.getAttribute("data-src");

              if (src) {
                // Précacher l'image
                const imgPreload = new Image();
                imgPreload.onload = () => {
                  img.src = src;
                  img.removeAttribute("data-src");
                  img.classList.add("loaded");
                };
                imgPreload.src = src;
              }

              // Ne plus observer cet élément
              imageObserver.unobserve(img);
            }
          });
        },
        {
          rootMargin: "200px", // Charger 200px avant que l'image soit visible
          threshold: 0.01,
        }
      );

      // Observer toutes les images avec data-src
      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
      document.querySelectorAll("img[data-src]").forEach((img) => {
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
      });
    }
  }

  // Optimiser l'animation au défilement
  function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll(".animate-on-scroll");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      animatedElements.forEach((element) => {
        observer.observe(element);
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
      animatedElements.forEach((element) => {
        element.classList.add("visible");
      });
    }
  }

  // Différer le chargement des ressources non critiques
  function deferNonCriticalResources() {
    // Charger les polices non essentielles après le chargement de la page
    if (document.fonts) {
      document.fonts.ready.then(() => {
        // Charger les polices supplémentaires
        const fontLink = document.createElement("link");
        fontLink.rel = "stylesheet";
        fontLink.href =
          "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap";
        document.head.appendChild(fontLink);
      });
    }

    // Charger les scripts non essentiels après le chargement de la page
    window.addEventListener("load", () => {
      // Ajouter un délai pour les scripts non critiques
      setTimeout(() => {
        const scripts = [
          // Liste des scripts à charger différé
          // Suppression des références aux scripts manquants
        ];

        scripts.forEach((scriptSrc) => {
          if (scriptSrc) {
            // Vérifier que le script existe
            const script = document.createElement("script");
            script.src = scriptSrc;
            script.async = true;
            document.body.appendChild(script);
          }
        });
      }, 1000);
    });
  }

  // Optimisation des transitions Astro
  function optimizeAstroTransitions() {
    document.addEventListener("astro:page-load", () => {
      // Réinitialiser les optimisations après chaque changement de page
      optimizeImageLoading();
      setupScrollAnimations();

      // Appliquer les animations aux éléments qui doivent être animés
      const elements = document.querySelectorAll(".fade-in");
      elements.forEach((el, index) => {
        el.style.setProperty("--animation-order", index.toString());
      });
    });

    // Gérer les erreurs de transition
    document.addEventListener("astro:after-swap", () => {
      // Résolution des problèmes de FOUC (Flash Of Unstyled Content)
      document.documentElement.classList.add("loaded");
    });
  }

  // Initialisation - uniquement si le DOM est prêt
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      optimizeImageLoading();
      setupScrollAnimations();
      deferNonCriticalResources();
      optimizeAstroTransitions();

      // Indiquer que la page est chargée
      document.documentElement.classList.add("loaded");
    });
  } else {
    // Le DOM est déjà chargé
    optimizeImageLoading();
    setupScrollAnimations();
    deferNonCriticalResources();
    optimizeAstroTransitions();
    document.documentElement.classList.add("loaded");
  }

  // Rendre les fonctions disponibles globalement si nécessaire
  window.portfolioPerformance = {
    deferNonCriticalResources,
    optimizeAstroTransitions,
    optimizeImageLoading,
    setupScrollAnimations,
  };
}
