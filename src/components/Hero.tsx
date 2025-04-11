const Hero = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Gerald Pameole
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Développeur Full Stack Passionné
          </p>
          <p className="text-lg text-gray-400 mb-8">
            Spécialisé dans la création d'applications web modernes et
            performantes
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#contact"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold transition-colors"
            >
              Discutons de votre projet
            </a>
            <a
              href="#portfolio"
              className="px-8 py-3 border border-white hover:bg-white hover:text-black rounded-full font-semibold transition-colors"
            >
              Découvrir mes réalisations
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
