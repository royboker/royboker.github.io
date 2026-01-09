import React, { useState } from 'react';

const EncoderDecoder = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('base64-encode'); // base64-encode, base64-decode, url-encode, url-decode

  const encodeBase64 = (text) => btoa(unescape(encodeURIComponent(text)));
  const decodeBase64 = (text) => {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch {
      return 'Invalid Base64 string';
    }
  };

  const encodeURL = (text) => encodeURIComponent(text);
  const decodeURL = (text) => {
    try {
      return decodeURIComponent(text);
    } catch {
      return 'Invalid URL encoded string';
    }
  };

  const process = () => {
    if (!input) {
      setOutput('');
      return;
    }

    switch (mode) {
      case 'base64-encode':
        setOutput(encodeBase64(input));
        break;
      case 'base64-decode':
        setOutput(decodeBase64(input));
        break;
      case 'url-encode':
        setOutput(encodeURL(input));
        break;
      case 'url-decode':
        setOutput(decodeURL(input));
        break;
      default:
        setOutput('');
    }
  };

  React.useEffect(() => {
    process();
  }, [input, mode]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🔐</span> Encoder/Decoder
        </h3>
        <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
          {[
            { id: 'base64-encode', label: 'B64 Encode' },
            { id: 'base64-decode', label: 'B64 Decode' },
            { id: 'url-encode', label: 'URL Encode' },
            { id: 'url-decode', label: 'URL Decode' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                mode === m.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder={mode.includes('encode') ? 'Enter text to encode...' : 'Enter encoded string...'}
          />
        </div>
        
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider">Output</label>
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
              output.includes('Invalid') ? 'border-red-500 text-red-400' : 'border-slate-700 text-green-400'
            }`}
            placeholder="Result will appear here..."
          />
        </div>
      </div>
    </div>
  );
};

export default EncoderDecoder;

