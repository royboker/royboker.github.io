import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience'; // Import new section
import Projects from './components/Projects';
import AppsSection from './components/AppsSection';
import ChatBot from './components/ChatBot';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  // Track website visit once on mount
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 
                    (window.location.hostname === 'royboker.github.io' 
                      ? 'https://portfolio-backend-1u0v.onrender.com' 
                      : 'http://localhost:8005');
    
    // Send visit event (non-blocking, don't wait for response)
    fetch(`${API_URL}/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'visit' }),
    }).catch(() => {
      // Silently fail - analytics shouldn't break the site
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience /> {/* Moved here: Immediately after About */}
        <Skills />
        <Projects />
        <AppsSection />
        <ChatBot />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
