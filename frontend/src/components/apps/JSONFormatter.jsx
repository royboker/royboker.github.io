import React, { useState } from 'react';

const JSONFormatter = () => {
  const [input, setInput] = useState('{"name":"Roy","skills":["Python","FastAPI"],"experience":1}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isMinified, setIsMinified] = useState(false);

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError('');
      setIsMinified(false);
    } catch (e) {
      setError(`Invalid JSON: ${e.message}`);
      setOutput('');
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
      setIsMinified(true);
    } catch (e) {
      setError(`Invalid JSON: ${e.message}`);
      setOutput('');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🔍</span> JSON Formatter
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={formatJSON}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition-colors"
          >
            Format
          </button>
          <button 
            onClick={minifyJSON}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded transition-colors"
          >
            Minify
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Input JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder='{"key": "value"}'
          />
        </div>
        
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider">
              {isMinified ? 'Minified' : 'Formatted'} Output
            </label>
            {output && (
              <button
                onClick={() => copyToClipboard(output)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                📋 Copy
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            className={`flex-1 bg-slate-900 border rounded-lg px-4 py-3 font-mono text-sm outline-none resize-none ${
              error ? 'border-red-500 text-red-400' : 'border-slate-700 text-green-400'
            }`}
            placeholder="Formatted JSON will appear here..."
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default JSONFormatter;

