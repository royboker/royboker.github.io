import React from 'react';

const Experience = () => {
  return (
    <section id="experience" className="py-20 bg-[#0f172a] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-800/[0.05] pointer-events-none"></div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title text-glow">Professional Experience</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded mb-4"></div>
          <p className="text-slate-400">Real-world impact in advanced software environments</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Experience Card */}
          <div className="relative group">
            {/* Animated Border Gradient */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-2xl opacity-75 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all duration-500 animate-gradient-xy"></div>
            
            <div className="relative bg-[#1e293b] rounded-2xl p-8 md:p-10 border border-slate-700 shadow-2xl">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-700 pb-6">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                    Sifft.ai
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider rounded-full border border-purple-500/20">
                      Stealth Mode 🕵️
                    </span>
                  </h3>
                  <p className="text-blue-400 font-medium text-lg">Backend Developer</p>
                  <p className="text-slate-500 text-sm mt-1">(Full-time, Production environment)</p>
                </div>
                <div className="text-slate-400 font-mono bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                  2025 - Present
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                
                {/* Description - Left Col */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Key Responsibilities</h4>
                  <ul className="space-y-3 text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">▹</span>
                      <span>
                        Developed scalable <strong>REST APIs</strong> using <strong>Python & FastAPI</strong>, managing complex endpoints for a SaaS CRM platform tailored for real estate investors.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">▹</span>
                      <span>
                        Architected and deployed <strong>AI Agents</strong> utilizing <strong>Google ADK</strong>, enabling automated data analysis and customer interaction flows.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">▹</span>
                      <span>
                        Managed high-performance data layers with <strong>PostgreSQL</strong>, optimizing queries and schema design for real-time analytics.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">▹</span>
                      <span>
                        Deployed and maintained microservices on <strong>Google Cloud Platform (GCP)</strong>, ensuring high availability and security.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Tech Stack - Right Col */}
                <div className="md:col-span-1">
                  <h4 className="text-lg font-semibold text-white mb-4">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded border border-slate-700 hover:border-blue-500 transition-colors cursor-default">Python</span>
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded border border-slate-700 hover:border-teal-500 transition-colors cursor-default">FastAPI</span>
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded border border-slate-700 hover:border-blue-400 transition-colors cursor-default">PostgreSQL</span>
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded border border-slate-700 hover:border-yellow-500 transition-colors cursor-default">GCP</span>
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded border border-slate-700 hover:border-purple-400 transition-colors cursor-default">Google ADK</span>
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded border border-slate-700 hover:border-orange-500 transition-colors cursor-default">Docker</span>
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded border border-slate-700 hover:border-green-500 transition-colors cursor-default">AI Agents</span>
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded border border-slate-700 hover:border-slate-400 transition-colors cursor-default">GitHub</span>
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded border border-slate-700 hover:border-pink-500 transition-colors cursor-default">Microservices</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

