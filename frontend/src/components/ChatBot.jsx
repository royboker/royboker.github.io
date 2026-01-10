import React, { useState, useRef, useEffect } from 'react';

const ChatBot = () => {
  const [sessionId, setSessionId] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionsRemaining, setQuestionsRemaining] = useState(10);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 
                  (window.location.hostname === 'royboker.github.io' 
                    ? 'https://portfolio-backend-1u0v.onrender.com' 
                    : 'http://localhost:8005');

  // Auto-scroll to bottom when new messages arrive (only inside messages container)
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, loading]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessages([]);
    
    // Track chatbot usage
    fetch(`${API_URL}/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        event_type: 'chatbot_used',
        details: 'Document uploaded'
      }),
    }).catch(() => {
      // Silently fail - analytics shouldn't break the site
    });
    
    // Show loading message
    setMessages([{
      type: 'system',
      text: `📤 Uploading "${file.name}" and analyzing document...`
    }]);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/chat/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.status === 'success') {
        setSessionId(data.session_id);
        
        // Prepare initial messages
        const initialMessages = [{
          type: 'system',
          text: `📄 Document "${file.name}" uploaded successfully!`
        }];
        
        // If we got an automatic summary, add it
        if (data.auto_summary) {
          initialMessages.push({
            type: 'assistant',
            text: data.auto_summary
          });
        } else {
          initialMessages.push({
            type: 'system',
            text: 'Document uploaded. You can now ask questions about it.'
          });
        }
        
        setMessages(initialMessages);
        setQuestionsRemaining(data.questions_remaining);
      } else {
        setMessages([{ type: 'error', text: data.message }]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessages([{ type: 'error', text: 'Error uploading file. Please try again.' }]);
    } finally {
      setUploading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    if (!question.trim() || !sessionId || loading || questionsRemaining === 0) return;

    const userQuestion = question;
    setQuestion('');
    setLoading(true);
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: userQuestion }]);

    try {
      const response = await fetch(`${API_URL}/chat/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          question: userQuestion
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setMessages(prev => [...prev, { type: 'assistant', text: data.answer }]);
        setQuestionsRemaining(data.questions_remaining);
      } else {
        setMessages(prev => [...prev, { type: 'error', text: data.message }]);
        if (data.message.includes('limit reached') || data.message.includes('expired')) {
          setQuestionsRemaining(0);
        }
      }
    } catch (error) {
      console.error('Ask question error:', error);
      setMessages(prev => [...prev, { type: 'error', text: 'Error asking question. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSessionId(null);
    setMessages([]);
    setFile(null);
    setQuestionsRemaining(10);
    setQuestion('');
  };

  return (
    <section id="chatbot" className="py-20 bg-[#0f172a] relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white text-glow">
            🤖 AI Document Chat
          </h2>
          <p className="text-gray-400 text-lg">
            Upload a PDF or TXT file and ask questions about it
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Free to use • Up to 10 questions per document
          </p>
        </div>

        {/* File Upload */}
        {!sessionId && (
          <div className="bg-gray-800/50 rounded-xl p-8 mb-6 neon-border-purple border-2">
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Upload Document (PDF or TXT)
                </label>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-300 
                    file:mr-4 file:py-3 file:px-6 
                    file:rounded-lg file:border-0 
                    file:text-sm file:font-semibold 
                    file:bg-purple-600 file:text-white 
                    hover:file:bg-purple-700 
                    file:cursor-pointer
                    cursor-pointer"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: PDF, TXT • Max size: 10MB
                </p>
              </div>
              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full bg-purple-600 hover:bg-purple-700 
                  text-white font-semibold py-3 px-6 rounded-lg 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200"
              >
                {uploading ? '📤 Uploading...' : '📤 Upload Document'}
              </button>
            </form>
          </div>
        )}

        {/* Chat Interface */}
        {sessionId && (
          <div className="space-y-4">
            {/* Questions Remaining */}
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 
              border border-blue-500/50 rounded-xl p-4 text-center
              neon-border-cyan">
              <p className="text-blue-300 text-lg">
                Questions remaining: <span className="font-bold text-cyan-400">{questionsRemaining}</span>
              </p>
            </div>

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="bg-gray-800/50 rounded-xl p-6 h-96 overflow-y-auto space-y-4
              border border-gray-700/50 scrollbar-thin scrollbar-thumb-purple-600"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 shadow-lg ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                        : msg.type === 'error'
                        ? 'bg-red-900/50 text-red-200 border border-red-500/50'
                        : msg.type === 'system'
                        ? 'bg-blue-900/50 text-blue-200 border border-blue-500/50'
                        : 'bg-gray-700/80 text-gray-100 border border-gray-600/50'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700/80 rounded-lg p-4 border border-gray-600/50">
                    <div className="flex items-center space-x-2">
                      <div className="animate-pulse flex space-x-1">
                        <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                        <div className="h-2 w-2 bg-purple-400 rounded-full delay-75"></div>
                        <div className="h-2 w-2 bg-purple-400 rounded-full delay-150"></div>
                      </div>
                      <p className="text-gray-300">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Question Input */}
            <form onSubmit={handleAskQuestion} className="flex gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={questionsRemaining === 0 ? "Question limit reached. Upload a new document." : "Ask a question about the document..."}
                className="flex-1 bg-gray-800/80 text-white rounded-lg px-4 py-3 
                  border border-gray-700 focus:border-purple-500 focus:outline-none
                  placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || questionsRemaining === 0}
              />
              <button
                type="submit"
                disabled={loading || questionsRemaining === 0 || !question.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold 
                  px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200"
              >
                {loading ? '...' : 'Ask'}
              </button>
            </form>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full bg-gray-700/50 hover:bg-gray-700/80 text-white 
                font-semibold py-3 px-4 rounded-lg transition-colors duration-200
                border border-gray-600/50"
            >
              📄 Upload New Document
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChatBot;

