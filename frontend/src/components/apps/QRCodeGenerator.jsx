import React, { useState, useEffect } from 'react';

const QRCodeGenerator = () => {
  const [text, setText] = useState('https://royboker.github.io');
  const [size, setSize] = useState(200);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    generateQR();
  }, [text, size]);

  const generateQR = () => {
    if (!text) {
      setQrCodeUrl('');
      return;
    }
    
    // Using a free QR code API
    const encodedText = encodeURIComponent(text);
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&bgcolor=0f172a&color=3b82f6`;
    setQrCodeUrl(apiUrl);
  };

  const downloadQR = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-code-${Date.now()}.png`;
    link.click();
  };

  const examples = [
    'https://royboker.github.io',
    'https://github.com/royboker',
    'mailto:royboker15@gmail.com',
    'WIFI:T:WPA;S:NetworkName;P:Password;;'
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📱</span> QR Code Generator
        </h3>
        {qrCodeUrl && (
          <button
            onClick={downloadQR}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded transition-colors"
          >
            ⬇️ Download
          </button>
        )}
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6">
        <div className="flex flex-col space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider">Text / URL</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Enter text or URL to encode..."
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider">
              Size: {size}px
            </label>
            <input
              type="range"
              min="100"
              max="400"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider">Quick Examples</label>
            <div className="flex flex-col gap-2">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setText(example)}
                  className="text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700 transition-colors truncate"
                  title={example}
                >
                  {example.length > 40 ? `${example.substring(0, 40)}...` : example}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <label className="text-xs text-slate-400 mb-4 uppercase tracking-wider">Preview</label>
          {qrCodeUrl ? (
            <div className="p-6 bg-white rounded-lg border-2 border-slate-700">
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-full h-auto max-w-xs"
              />
            </div>
          ) : (
            <div className="w-48 h-48 bg-slate-800 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center">
              <span className="text-slate-600 text-sm">Enter text to generate QR code</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;

