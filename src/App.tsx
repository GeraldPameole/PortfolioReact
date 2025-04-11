import Contact from "./components/Contact";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

function App() {
  return (
    <div className="bg-black text-white">
      <nav className="fixed w-full bg-gray-900 bg-opacity-90 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <a href="#" className="text-xl font-bold text-white">
              GP
            </a>
            <div className="hidden md:flex space-x-8">
              <a
                href="#skills"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Compétences
              </a>
              <a
                href="#portfolio"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Projets
              </a>
              <a
                href="#contact"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 Gerald Pameole. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
