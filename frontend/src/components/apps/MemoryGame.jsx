import React, { useState, useEffect } from 'react';

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

  const initializeGame = () => {
    const duplicated = [...emojis, ...emojis];
    const shuffled = duplicated.sort(() => Math.random() - 0.5).map((emoji, index) => ({
      id: index,
      emoji,
    }));
    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setWon(false);
    setDisabled(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleClick = (id) => {
    if (disabled || flipped.includes(id) || solved.includes(id)) return;

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      setFlipped([...flipped, id]);
      setMoves(moves + 1);
      
      const firstCard = cards.find(c => c.id === flipped[0]);
      const secondCard = cards.find(c => c.id === id);

      if (firstCard.emoji === secondCard.emoji) {
        setSolved(prev => [...prev, flipped[0], id]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [solved, cards]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🎮</span> Memory Match
        </h3>
        <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">Moves: <span className="text-white font-mono">{moves}</span></div>
            <button 
                onClick={initializeGame} 
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-lg transition-colors"
            >
                Restart
            </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 flex-grow">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleClick(card.id)}
            className={`
                aspect-square rounded-lg cursor-pointer transition-all duration-300 transform perspective-1000 relative
                ${(flipped.includes(card.id) || solved.includes(card.id)) ? 'rotate-y-180' : ''}
            `}
          >
             <div className={`
                w-full h-full flex items-center justify-center text-3xl select-none rounded-lg border-2 transition-all
                ${flipped.includes(card.id) || solved.includes(card.id) 
                   ? 'bg-slate-700 border-blue-500/50 text-white' 
                   : 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-500/20 hover:scale-105 shadow-lg shadow-blue-900/20'
                }
             `}>
               {(flipped.includes(card.id) || solved.includes(card.id)) ? card.emoji : '❓'}
             </div>
          </div>
        ))}
      </div>

      {won && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-xl animate-fade-in">
          <div className="text-center p-8 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl transform scale-100 animate-slide-up">
            <div className="text-6xl mb-4">🏆</div>
            <h4 className="text-2xl font-bold text-white mb-2">You Won!</h4>
            <p className="text-slate-400 mb-6">Completed in {moves} moves</p>
            <button 
                onClick={initializeGame} 
                className="btn btn-primary w-full"
            >
                Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;

