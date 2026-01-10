import React, { useEffect, useRef } from 'react';
import JSONFormatter from './apps/JSONFormatter';
import RegexTester from './apps/RegexTester';
import EncoderDecoder from './apps/EncoderDecoder';
import QRCodeGenerator from './apps/QRCodeGenerator';

const AppsSection = () => {
  const appsTracked = useRef({});
  
  const API_URL = import.meta.env.VITE_API_URL || 
                  (window.location.hostname === 'royboker.github.io' 
                    ? 'https://portfolio-backend-1u0v.onrender.com' 
                    : 'http://localhost:8005');

  // Track when user interacts with any app
  const trackAppUsage = (appName) => {
    // Track each app only once per session
    if (appsTracked.current[appName]) return;
    
    appsTracked.current[appName] = true;
    
    // Send notification (non-blocking)
    fetch(`${API_URL}/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        event_type: 'app_used',
        app_name: appName 
      }),
    }).catch(() => {
      // Silently fail - analytics shouldn't break the site
    });
  };

  // Track app usage when component mounts (means user scrolled to this section)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // User scrolled to apps section - could track this if needed
          }
        });
      },
      { threshold: 0.5 }
    );

    const section = document.getElementById('apps');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="apps" className="py-20 bg-[#0f172a] relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title text-glow">Playground</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded mb-4"></div>
          <p className="text-slate-400">Tools I built because I got tired of googling them</p>
        </div>

        {/* Grid Container - 2x2 */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          
          {/* App 1: JSON Formatter */}
          <div 
            className="h-[500px] neon-border group"
            onClick={() => trackAppUsage('JSON Formatter')}
          >
            <div className="neon-inner bg-slate-900/50 backdrop-blur-sm h-full rounded-xl overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-grid-slate-800/[0.2] bg-[size:20px_20px] pointer-events-none"></div>
                <div className="relative z-10 h-full p-6 flex flex-col">
                    <JSONFormatter />
                </div>
            </div>
          </div>

          {/* App 2: Regex Tester */}
          <div 
            className="h-[500px] neon-border neon-border-purple group"
            onClick={() => trackAppUsage('Regex Tester')}
          >
            <div className="neon-inner bg-slate-900/50 backdrop-blur-sm h-full rounded-xl overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-grid-slate-800/[0.2] bg-[size:20px_20px] pointer-events-none"></div>
                 <div className="relative z-10 h-full p-6 flex flex-col">
                    <RegexTester />
                </div>
            </div>
          </div>

          {/* App 3: Encoder/Decoder */}
          <div 
            className="h-[500px] neon-border neon-border-green group"
            onClick={() => trackAppUsage('Encoder/Decoder')}
          >
            <div className="neon-inner bg-slate-900/50 backdrop-blur-sm h-full rounded-xl overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-grid-slate-800/[0.2] bg-[size:20px_20px] pointer-events-none"></div>
                 <div className="relative z-10 h-full p-6 flex flex-col">
                    <EncoderDecoder />
                </div>
            </div>
          </div>

          {/* App 4: QR Code Generator */}
          <div 
            className="h-[500px] neon-border neon-border-orange group"
            onClick={() => trackAppUsage('QR Code Generator')}
          >
            <div className="neon-inner bg-slate-900/50 backdrop-blur-sm h-full rounded-xl overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-grid-slate-800/[0.2] bg-[size:20px_20px] pointer-events-none"></div>
                 <div className="relative z-10 h-full p-6 flex flex-col">
                    <QRCodeGenerator />
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AppsSection;
