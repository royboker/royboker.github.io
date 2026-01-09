import React from 'react';
import Converter from './apps/Converter';
import MemoryGame from './apps/MemoryGame';

const AppsSection = () => {
  return (
    <section id="apps" className="py-20 bg-[#0f172a] relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title text-glow">Interactive Playground</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded mb-4"></div>
          <p className="text-slate-400">Live React components running directly in the browser</p>
        </div>

        {/* Grid Container */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* App 1: Converter */}
          <div className="h-[600px] neon-border group">
            <div className="neon-inner bg-slate-900/50 backdrop-blur-sm h-full rounded-xl overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-grid-slate-800/[0.2] bg-[size:20px_20px] pointer-events-none"></div>
                <div className="relative z-10 h-full p-6 flex flex-col">
                    <Converter />
                </div>
            </div>
          </div>

          {/* App 2: Memory Game */}
          <div className="h-[600px] neon-border-purple group">
            <div className="neon-inner bg-slate-900/50 backdrop-blur-sm h-full rounded-xl overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-grid-slate-800/[0.2] bg-[size:20px_20px] pointer-events-none"></div>
                 <div className="relative z-10 h-full p-6 flex flex-col">
                    <MemoryGame />
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AppsSection;
