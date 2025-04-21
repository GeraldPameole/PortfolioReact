import { useEffect, useState } from "react";
import { BiTerminal } from "react-icons/bi";
import { FaCodepen, FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import { IoMdMoon, IoMdSunny } from "react-icons/io";

const Navbar = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== "undefined") {
        setTheme(localStorage.getItem("theme") || "light");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (currentPath === "/") {
        setActivePage("accueil");
      } else if (currentPath.includes("/projets")) {
        setActivePage("projets");
      } else if (currentPath.includes("/blog")) {
        setActivePage("blog");
      } else if (currentPath.includes("/about")) {
        setActivePage("apropos");
      } else if (currentPath.includes("/skills")) {
        setActivePage("competences");
      }
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", newTheme);
    }
    setTheme(newTheme);
  };

  return (
    <header className="w-full py-4 bg-gradient-to-r from-secondary-900 to-secondary-800 dark:from-secondary-950 dark:to-secondary-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo et nom */}
          <div className="flex items-center space-x-2">
            <BiTerminal className="text-accent-500 text-2xl" />
            <span className="font-brand text-xl text-white">
              Gérald Paméole
            </span>
          </div>

          {/* Navigation principale */}
          <nav className="hidden md:block">
            <div className="bg-secondary-800/70 dark:bg-secondary-950/70 rounded-full px-2 py-1 backdrop-blur-sm">
              <ul className="flex space-x-1">
                <li>
                  <a
                    href="/"
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                      activePage === "accueil"
                        ? "bg-accent-600 text-white"
                        : "text-secondary-200 hover:bg-secondary-700/50 hover:text-white"
                    }`}
                  >
                    Accueil
                  </a>
                </li>
                <li>
                  <a
                    href="/projets"
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                      activePage === "projets"
                        ? "bg-accent-600 text-white"
                        : "text-secondary-200 hover:bg-secondary-700/50 hover:text-white"
                    }`}
                  >
                    Projets
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                      activePage === "blog"
                        ? "bg-accent-600 text-white"
                        : "text-secondary-200 hover:bg-secondary-700/50 hover:text-white"
                    }`}
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/skills"
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                      activePage === "competences"
                        ? "bg-accent-600 text-white"
                        : "text-secondary-200 hover:bg-secondary-700/50 hover:text-white"
                    }`}
                  >
                    Compétences
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                      activePage === "apropos"
                        ? "bg-accent-600 text-white"
                        : "text-secondary-200 hover:bg-secondary-700/50 hover:text-white"
                    }`}
                  >
                    À propos
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          {/* Menu mobile (hamburger) */}
          <div className="md:hidden">
            <button
              className="text-white p-2 focus:outline-none"
              aria-label="Ouvrir le menu de navigation"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>

          {/* Icônes sociales et thème */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-3 text-white">
              <a
                href="https://linkedin.com/in/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-400 transition-colors"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-400 transition-colors"
              >
                <FaGithub className="text-xl" />
              </a>
              <a
                href="https://codepen.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-400 transition-colors"
              >
                <FaCodepen className="text-xl" />
              </a>
              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-400 transition-colors"
              >
                <FaYoutube className="text-xl" />
              </a>
            </div>

            <button
              onClick={handleThemeToggle}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary-700 hover:bg-secondary-600 text-white transition-colors duration-200"
              aria-label={
                theme === "light"
                  ? "Activer le mode sombre"
                  : "Activer le mode clair"
              }
            >
              {theme === "light" ? (
                <IoMdMoon className="text-lg" />
              ) : (
                <IoMdSunny className="text-lg" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
