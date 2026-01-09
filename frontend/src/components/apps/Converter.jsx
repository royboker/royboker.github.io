import React, { useState, useEffect } from 'react';

const Converter = () => {
  const [category, setCategory] = useState('currency');
  const [amount, setAmount] = useState(1);
  const [fromUnit, setFromUnit] = useState('USD');
  const [toUnit, setToUnit] = useState('EUR');
  const [result, setResult] = useState(0);
  const [rate, setRate] = useState(null);

  // Currency Exchange Rates (Simulated for demo/stability without API key)
  const rates = {
    USD: 1, EUR: 0.92, GBP: 0.79, ILS: 3.75, JPY: 150.2, AUD: 1.52, CAD: 1.35
  };

  useEffect(() => {
    calculate();
  }, [amount, fromUnit, toUnit, category]);

  const calculate = () => {
    let res = 0;
    if (category === 'currency') {
      // Base is USD for simplicity
      const inUSD = amount / rates[fromUnit];
      res = inUSD * rates[toUnit];
    } else if (category === 'temperature') {
        if (fromUnit === toUnit) res = amount;
        else if (fromUnit === 'C') res = toUnit === 'F' ? (amount * 9/5) + 32 : amount + 273.15;
        else if (fromUnit === 'F') res = toUnit === 'C' ? (amount - 32) * 5/9 : ((amount - 32) * 5/9) + 273.15;
        else if (fromUnit === 'K') res = toUnit === 'C' ? amount - 273.15 : (amount - 273.15) * 9/5 + 32;
    } else if (category === 'length') {
        // Simple conversion logic (meters base)
        const factors = { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, ft: 0.3048, in: 0.0254 };
        const inMeters = amount * factors[fromUnit];
        res = inMeters / factors[toUnit];
    }
    setResult(res);
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  // Dynamic Options based on Category
  const renderOptions = () => {
    if (category === 'currency') return Object.keys(rates).map(r => <option key={r} value={r}>{r}</option>);
    if (category === 'temperature') return <>
      <option value="C">Celsius (°C)</option>
      <option value="F">Fahrenheit (°F)</option>
      <option value="K">Kelvin (K)</option>
    </>;
    if (category === 'length') return <>
      <option value="m">Meters (m)</option>
      <option value="km">Kilometers (km)</option>
      <option value="cm">Centimeters (cm)</option>
      <option value="mi">Miles (mi)</option>
      <option value="ft">Feet (ft)</option>
      <option value="in">Inches (in)</option>
    </>;
  };

  // Set default units when category changes
  useEffect(() => {
      if(category === 'currency') { setFromUnit('USD'); setToUnit('EUR'); }
      if(category === 'temperature') { setFromUnit('C'); setToUnit('F'); }
      if(category === 'length') { setFromUnit('m'); setToUnit('ft'); }
  }, [category]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🔄</span> Unit Converter
        </h3>
        <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg">
          {['currency', 'temperature', 'length'].map(cat => (
             <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-md text-sm capitalize transition-all ${category === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
             >
               {cat}
             </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-grow justify-center">
        <div className="flex flex-col md:flex-row gap-4 items-center">
           <div className="flex-1 w-full">
              <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider">From</label>
              <div className="flex gap-2">
                 <input 
                   type="number" 
                   value={amount} 
                   onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                   className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-lg font-mono"
                 />
                 <select 
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-white outline-none w-24 text-sm"
                 >
                    {renderOptions()}
                 </select>
              </div>
           </div>

           <button onClick={handleSwap} className="p-3 bg-slate-700 rounded-full text-white hover:bg-blue-500 transition-colors mt-4 md:mt-0">
             ⇄
           </button>

           <div className="flex-1 w-full">
              <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider">To</label>
               <div className="flex gap-2">
                 <div className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-blue-400 text-lg font-mono font-bold flex items-center">
                    {result.toFixed(2)}
                 </div>
                 <select 
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-white outline-none w-24 text-sm"
                 >
                    {renderOptions()}
                 </select>
              </div>
           </div>
        </div>
        
        {category === 'currency' && (
           <p className="text-center text-xs text-slate-500 mt-2">
             Exchange rates are approximate for demonstration.
           </p>
        )}
      </div>
    </div>
  );
};

export default Converter;

