import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0b1120] border-t border-slate-800 text-slate-300 py-12 relative overflow-hidden">
       {/* Background Glow */}
       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-8 pb-8 border-b border-slate-800/50">
          
          <div>
            <a href="#" className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
              <span className="text-2xl">🔥</span>
              <span>Roy Boker</span>
            </a>
            <p className="text-slate-500 leading-relaxed max-w-xs">
              Software Engineering student passionate about backend development and data science.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#about" className="hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="#skills" className="hover:text-blue-400 transition-colors">Skills</a></li>
              <li><a href="#projects" className="hover:text-blue-400 transition-colors">Projects</a></li>
              <li><a href="#apps" className="hover:text-blue-400 transition-colors">Playground</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-4">
          <p className="text-slate-600 text-sm">© {new Date().getFullYear()} Roy Boker. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="mailto:royboker15@gmail.com" className="text-2xl text-slate-400 hover:text-white hover:scale-110 transition-all" aria-label="Email">📧</a>
            <a href="https://linkedin.com/in/roy-boker" target="_blank" rel="noopener noreferrer" className="text-2xl text-slate-400 hover:text-blue-500 hover:scale-110 transition-all" aria-label="LinkedIn">💼</a>
            <a href="https://github.com/royboker" target="_blank" rel="noopener noreferrer" className="text-2xl text-slate-400 hover:text-white hover:scale-110 transition-all" aria-label="GitHub">🐙</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
