import React from 'react';

const Skills = () => {
  const categories = [
    {
      title: "Languages",
      skills: [
        { name: "Python", icon: "🐍", color: "from-blue-400 to-blue-600" },
        { name: "Java", icon: "☕", color: "from-orange-400 to-red-500" },
        { name: "SQL", icon: "🗃️", color: "from-slate-300 to-slate-500" },
      ]
    },
    {
      title: "Backend & Cloud",
      skills: [
        { name: "FastAPI", icon: "⚡", color: "from-teal-300 to-teal-500" },
        { name: "Django", icon: "🎸", color: "from-green-400 to-green-700" },
        { name: "Spring Boot", icon: "🍃", color: "from-green-400 to-green-600" },
        { name: "Docker", icon: "🐳", color: "from-blue-400 to-blue-600" },
        { name: "GCP", icon: "☁️", color: "from-blue-400 to-red-500" },
        { name: "AWS", icon: "☁️", color: "from-orange-300 to-orange-500" },
        { name: "Microservices", icon: "🧩", color: "from-purple-400 to-pink-500" },
      ]
    },
    {
      title: "Data & Tools",
      skills: [
        { name: "MySQL", icon: "🐬", color: "from-blue-300 to-blue-500" },
        { name: "Pandas", icon: "🐼", color: "from-slate-200 to-slate-400" },
        { name: "Scikit-Learn", icon: "🔬", color: "from-orange-400 to-orange-600" },
        { name: "Git/GitHub", icon: "📁", color: "from-slate-300 to-slate-500" },
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 bg-[#0f172a] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title text-glow">Skills & Technologies</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded mb-4"></div>
          <p className="text-slate-400">The arsenal I use to build scalable solutions</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.title} className="neon-border group h-full">
              <div className="neon-inner p-6 h-full bg-[#1e293b]/50 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-slate-700 pb-2">{category.title}</h3>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill) => (
                    <span 
                      key={skill.name} 
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium transition-all hover:border-slate-500 hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 cursor-default`}
                    >
                      <span className="text-lg">{skill.icon}</span>
                      <span>{skill.name}</span>
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

export default Skills;
