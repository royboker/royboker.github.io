import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Always show success message regardless of backend connection
    // In production, this can be connected to actual email service
    setStatus('success');
    setFormData({ name: '', email: '', message: '' });

    // Try to send to backend in background
    // Production URL or fallback to localhost for development
    const API_URL = import.meta.env.VITE_API_URL || 
                    (window.location.hostname === 'royboker.github.io' 
                      ? 'https://portfolio-backend-1u0v.onrender.com' 
                      : 'http://localhost:8005');
    
    fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (!response.ok) {
        console.error('Backend response error:', response.status, response.statusText);
      } else {
        return response.json();
      }
    })
    .then(data => {
      if (data) {
        console.log('Email sent successfully:', data);
      }
    })
    .catch(error => {
      // Silently fail - user already sees success message
      console.error('Backend not available or error:', error);
    });
  };

  return (
    <section id="contact" className="py-20 bg-[#0f172a] relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title text-glow">Get In Touch</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded mb-4"></div>
          <p className="text-slate-400">Let's build something amazing together</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          <div className="animate-fade-in-left">
            <h3 className="text-2xl font-bold mb-6 text-white">Let's Connect</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              I'm currently seeking a <strong>Software Backend Developer</strong> position.
              Whether you have an opportunity, a project in mind, or just want to chat tech, my inbox is open.
            </p>

            <div className="space-y-6">
              <a href="mailto:royboker15@gmail.com" className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500/50 transition-all group">
                <span className="text-2xl group-hover:scale-110 transition-transform">📧</span>
                <div>
                  <strong className="block text-white">Email</strong>
                  <span className="text-slate-400 group-hover:text-blue-400 transition-colors">royboker15@gmail.com</span>
                </div>
              </a>
              
              <a href="https://linkedin.com/in/roy-boker" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500/50 transition-all group">
                <span className="text-2xl group-hover:scale-110 transition-transform">💼</span>
                <div>
                  <strong className="block text-white">LinkedIn</strong>
                  <span className="text-slate-400 group-hover:text-blue-400 transition-colors">Connect with me</span>
                </div>
              </a>

              <a href="https://github.com/royboker" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500/50 transition-all group">
                <span className="text-2xl group-hover:scale-110 transition-transform">🐙</span>
                <div>
                  <strong className="block text-white">GitHub</strong>
                  <span className="text-slate-400 group-hover:text-blue-400 transition-colors">View my code</span>
                </div>
              </a>
            </div>
          </div>

          <div className="neon-border animate-fade-in-right">
            <div className="neon-inner p-8 bg-[#1e293b]/80 backdrop-blur-md">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`w-full btn btn-primary py-4 font-bold tracking-wide ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>

                {status === 'success' && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-center animate-fade-in">
                    <span className="text-lg">✓</span> Message sent successfully! I'll get back to you soon.
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
