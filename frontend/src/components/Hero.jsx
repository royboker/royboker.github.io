import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const texts = ["Backend Developer", "Data Science Enthusiast", "Problem Solver"];

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % texts.length;
      const fullText = texts[i];

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#0f172a] overflow-hidden min-h-screen flex items-center">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6 backdrop-blur-sm animate-fade-in">
              <span className="text-blue-400 font-semibold tracking-wide uppercase text-sm">Welcome to my portfolio</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Roy Boker</span>
              <br />
              <span className="text-3xl md:text-5xl text-slate-400 font-normal h-[1.5em] block mt-2">
                I am a <span className="text-white font-mono border-r-4 border-blue-500 pr-2">{text}</span>
              </span>
            </h1>

            <p className="text-lg text-slate-400 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
              I build scalable backend systems & AI-powered solutions. 4th-year Software Engineering student passionate about creating robust, production-ready applications.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a href="#projects" className="btn btn-primary relative overflow-hidden group">
                <span className="relative z-10">View Projects</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a href="#contact" className="px-8 py-3 rounded-lg border border-slate-700 text-slate-300 font-medium hover:border-slate-500 hover:text-white transition-all hover:bg-white/5">
                Contact Me
              </a>
            </div>
          </div>

          <div className="flex-1 relative group">
            <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
              {/* Glowing LED Border Effect */}
              <div className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-spin-slow opacity-75 blur-sm"></div>
              
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#0f172a] bg-[#0f172a] shadow-2xl">
                 <img 
                src="/assets/images/profile_final.jpg" 
                alt="Roy Boker" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
