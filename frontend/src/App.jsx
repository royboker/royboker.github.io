import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience'; // Import new section
import Projects from './components/Projects';
import AppsSection from './components/AppsSection';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
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
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
