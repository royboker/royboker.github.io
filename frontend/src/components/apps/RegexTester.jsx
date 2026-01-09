import React, { useState } from 'react';

const RegexTester = () => {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [testString, setTestString] = useState('Contact me at royboker15@gmail.com or visit royboker.github.io');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  const testRegex = () => {
    try {
      setError('');
      const regex = new RegExp(pattern, 'g');
      const matchResults = [];
      let match;
      let index = 0;

      while ((match = regex.exec(testString)) !== null) {
        matchResults.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1)
        });
        if (match.index === regex.lastIndex) regex.lastIndex++;
      }

      setMatches(matchResults);
    } catch (e) {
      setError(`Invalid regex: ${e.message}`);
      setMatches([]);
    }
  };

  React.useEffect(() => {
    if (pattern && testString) {
      testRegex();
    }
  }, [pattern, testString]);


  const examples = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { name: 'URL', pattern: 'https?://[\\w\\-._~:/?#[\\]@!$&\'()*+,;=%]+' },
    { name: 'Phone (IL)', pattern: '\\+972-?[1-9]\\d{1,2}-?\\d{6,7}' },
    { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>⚡</span> Regex Tester
        </h3>
        <div className="flex gap-2 flex-wrap">
          {examples.map(ex => (
            <button
              key={ex.name}
              onClick={() => setPattern(ex.pattern)}
              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-colors"
            >
              {ex.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        <div>
          <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider">Pattern</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="/your-regex-pattern/"
            />
            <button
              onClick={testRegex}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded transition-colors"
            >
              Test
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider">Test String</label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Enter text to test against the pattern..."
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}

        {matches.length > 0 && (
          <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider">
              Found {matches.length} match{matches.length !== 1 ? 'es' : ''}
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {matches.map((match, idx) => (
                <div key={idx} className="p-2 bg-slate-900 rounded border border-yellow-500/30">
                  <span className="text-yellow-400 font-mono text-sm">{match.match}</span>
                  <span className="text-slate-500 text-xs ml-2">at index {match.index}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegexTester;

