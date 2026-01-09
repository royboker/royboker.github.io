// Memory Match Game

class MemoryGame {
  constructor() {
    this.emojis = [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
      '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
      '🐧', '🐦', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗',
      '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜'
    ];

    this.board = document.getElementById('game-board');
    this.movesEl = document.getElementById('moves');
    this.timerEl = document.getElementById('timer');
    this.pairsFoundEl = document.getElementById('pairs-found');
    this.totalPairsEl = document.getElementById('total-pairs');
    this.bestScoreEl = document.getElementById('best-score');
    this.winModal = document.getElementById('win-modal');
    this.newRecordEl = document.getElementById('new-record');
    this.finalMovesEl = document.getElementById('final-moves');
    this.finalTimeEl = document.getElementById('final-time');

    this.gridSize = 4;
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.timer = null;
    this.seconds = 0;
    this.isLocked = false;
    this.gameStarted = false;

    this.init();
  }

  init() {
    this.bindEvents();
    this.loadBestScore();
    this.newGame();
  }

  bindEvents() {
    // Difficulty buttons
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.gridSize = parseInt(btn.dataset.size);
        this.newGame();
      });
    });

    // New game button
    document.getElementById('new-game-btn').addEventListener('click', () => this.newGame());

    // Play again button
    document.getElementById('play-again-btn').addEventListener('click', () => {
      this.winModal.classList.remove('active');
      this.newGame();
    });

    // Mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileMenuBtn && mobileNav) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
      });
    }
  }

  newGame() {
    // Reset state
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.seconds = 0;
    this.isLocked = false;
    this.gameStarted = false;

    // Stop timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // Update UI
    this.movesEl.textContent = '0';
    this.timerEl.textContent = '0:00';
    this.pairsFoundEl.textContent = '0';
    this.totalPairsEl.textContent = (this.gridSize * this.gridSize) / 2;

    // Generate cards
    this.generateCards();
  }

  generateCards() {
    const numPairs = (this.gridSize * this.gridSize) / 2;
    const selectedEmojis = this.shuffle([...this.emojis]).slice(0, numPairs);
    const cardValues = this.shuffle([...selectedEmojis, ...selectedEmojis]);

    // Update board size
    this.board.setAttribute('data-size', this.gridSize);
    this.board.innerHTML = '';

    // Create cards
    cardValues.forEach((emoji, index) => {
      const cardContainer = document.createElement('div');
      cardContainer.className = 'card-container';

      const card = document.createElement('div');
      card.className = 'game-card';
      card.dataset.value = emoji;
      card.dataset.index = index;

      card.innerHTML = `
        <div class="card-front"></div>
        <div class="card-back">${emoji}</div>
      `;

      card.addEventListener('click', () => this.flipCard(card));

      cardContainer.appendChild(card);
      this.board.appendChild(cardContainer);
      this.cards.push(card);
    });
  }

  flipCard(card) {
    // Prevent flipping if locked, already flipped, or matched
    if (this.isLocked || card.classList.contains('flipped') || card.classList.contains('matched')) {
      return;
    }

    // Start timer on first flip
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.startTimer();
    }

    // Flip the card
    card.classList.add('flipped');
    this.flippedCards.push(card);

    // Check for match when two cards are flipped
    if (this.flippedCards.length === 2) {
      this.moves++;
      this.movesEl.textContent = this.moves;
      this.checkMatch();
    }
  }

  checkMatch() {
    const [card1, card2] = this.flippedCards;
    const match = card1.dataset.value === card2.dataset.value;

    if (match) {
      this.handleMatch(card1, card2);
    } else {
      this.handleMismatch(card1, card2);
    }
  }

  handleMatch(card1, card2) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    this.matchedPairs++;
    this.pairsFoundEl.textContent = this.matchedPairs;
    this.flippedCards = [];

    // Check for win
    if (this.matchedPairs === (this.gridSize * this.gridSize) / 2) {
      this.handleWin();
    }
  }

  handleMismatch(card1, card2) {
    this.isLocked = true;

    // Add shake animation
    setTimeout(() => {
      card1.classList.add('wrong');
      card2.classList.add('wrong');
    }, 500);

    // Flip cards back
    setTimeout(() => {
      card1.classList.remove('flipped', 'wrong');
      card2.classList.remove('flipped', 'wrong');
      this.flippedCards = [];
      this.isLocked = false;
    }, 1000);
  }

  handleWin() {
    // Stop timer
    clearInterval(this.timer);

    // Calculate score (lower is better)
    const score = this.moves;

    // Update modal
    this.finalMovesEl.textContent = this.moves;
    this.finalTimeEl.textContent = this.formatTime(this.seconds);

    // Check for new record
    const storageKey = `memory-best-${this.gridSize}`;
    const bestScore = localStorage.getItem(storageKey);

    if (!bestScore || score < parseInt(bestScore)) {
      localStorage.setItem(storageKey, score);
      this.bestScoreEl.textContent = `${score} moves`;
      this.newRecordEl.style.display = 'block';
    } else {
      this.newRecordEl.style.display = 'none';
    }

    // Show modal
    setTimeout(() => {
      this.winModal.classList.add('active');
    }, 500);
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.seconds++;
      this.timerEl.textContent = this.formatTime(this.seconds);
    }, 1000);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  loadBestScore() {
    const storageKey = `memory-best-${this.gridSize}`;
    const bestScore = localStorage.getItem(storageKey);
    if (bestScore) {
      this.bestScoreEl.textContent = `${bestScore} moves`;
    }
  }

  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MemoryGame();
});
