import React from 'react';

const Projects = () => {
  const projects = [
    {
      title: "🏨 Hotel Management System",
      description: "Full-stack hotel management solution with booking, room management, and reporting features. Supports secure CRUD operations and role-based access.",
      tags: ["Java", "Spring Boot", "MySQL", "AWS"],
      link: "https://github.com/royboker/hotel-management-system",
      borderColor: "neon-border-blue" // Default blue
    },
    {
      title: "📚 Digital Library App",
      description: "Web application for managing digital book collections with user authentication and search. Includes waitlist handling and automated notifications.",
      tags: ["C#", "ASP.NET", "MVC", "SQL Server"],
      link: "https://github.com/royboker/eBookLibrary2",
      borderColor: "neon-border-green"
    },
    {
      title: "🤖 Heart Attack Prediction ML",
      description: "Machine learning model that predicts heart attack risk based on patient health data. Evaluated multiple models for highest accuracy.",
      tags: ["Python", "Scikit-Learn", "Pandas"],
      link: "https://github.com/royboker/Heart-Attack-Prediction-ML",
      borderColor: "neon-border-purple"
    },
    {
      title: "🔬 Wafer Defect Detection",
      description: "Deep learning solution for detecting defects on silicon wafers. Achieved ~93% accuracy using MLP neural networks.",
      tags: ["Python", "TensorFlow", "Keras"],
      link: "https://github.com/royboker/Wafer-Defect-Detection-using-Deep-Learning",
      borderColor: "neon-border-orange"
    },
    {
      title: "📱 BookiT Mobile App",
      description: "Android application revolutionizing library experience for students with one-click borrowing and search.",
      tags: ["Java", "Android", "Firebase"],
      link: "https://github.com/royboker/Bookit",
      borderColor: "neon-border-cyan"
    }
  ];

  return (
    <section id="projects" className="py-20 bg-[#0f172a] relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title text-glow">Featured Projects</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded mb-4"></div>
          <p className="text-slate-400">Some of my recent heavy-lifting</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className={`neon-border ${project.borderColor} group h-full`}>
              <div className="neon-inner p-6 h-full flex flex-col bg-[#1e293b]/50 backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-2">
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">{project.title}</h3>
                <p className="text-slate-400 mb-6 flex-grow text-sm leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium text-sm mt-auto group/link"
                >
                  View on GitHub 
                  <span className="ml-1 transform group-hover/link:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="https://github.com/royboker" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-slate-700 text-slate-300 font-medium hover:border-slate-500 hover:text-white transition-all hover:bg-white/5">
            View More on GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
