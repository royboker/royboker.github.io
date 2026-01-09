import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-[#0f172a] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title text-glow">About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded mb-4"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          <div className="w-full md:w-1/3">
             <div className="neon-border">
                <div className="neon-inner p-8 bg-[#1e293b]/50 backdrop-blur-sm text-center">
                  <div className="text-5xl mb-6">🎓</div>
                  <h4 className="text-2xl font-bold mb-2 text-white">SCE College</h4>
                  <p className="text-blue-400 font-medium mb-4">Software Engineering</p>
                  <p className="text-slate-400 mb-6">B.Sc. • 4th Year</p>
                </div>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <h3 className="text-3xl font-bold mb-6 text-white leading-tight">
              Building the <span className="text-blue-500">Future</span>, <br />One Line of Code at a Time
            </h3>
            <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
              <p>
                I'm passionate about creating efficient, scalable backend systems and extracting insights from data.
                My journey in software engineering has equipped me with a strong foundation in multiple programming
                paradigms and a deep understanding of system design principles.
              </p>
              <p>
                Currently seeking a student position where I can apply my skills in <span className="text-blue-400 font-medium">Python</span>, 
                <span className="text-orange-400 font-medium"> Java</span>, and <span className="text-purple-400 font-medium">Machine Learning</span>.
                My recent work involves building advanced <strong>AI Agents</strong> and managing complex <strong>SaaS architectures</strong> for high-growth startups.
                I thrive in collaborative environments and enjoy tackling complex problems that require creative solutions.
              </p>
              <p>
                Beyond coding, I believe in building clean, maintainable software that makes a real impact.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
