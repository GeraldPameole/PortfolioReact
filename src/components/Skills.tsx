const skills = [
  { name: "React/Next.js", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "Node.js/Express", level: 85 },
  { name: "MongoDB/PostgreSQL", level: 80 },
  { name: "AWS/Cloud", level: 75 },
  { name: "Docker/Kubernetes", level: 70 },
  { name: "CI/CD", level: 75 },
  { name: "Tests (Jest/Cypress)", level: 80 },
];

const Skills = () => {
  return (
    <section id="skills" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-4">
          Compétences Techniques
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Expertise dans le développement d'applications web modernes et
          scalables
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between mb-2">
                <span className="text-white font-medium">{skill.name}</span>
                <span className="text-gray-400">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
