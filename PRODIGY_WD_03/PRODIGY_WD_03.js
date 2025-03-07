const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const resetBtn = document.querySelector('.reset-btn');
const playerScoreDisplay = document.querySelector('.player-score');
const computerScoreDisplay = document.querySelector('.computer-score');
const modeToggle = document.getElementById('modeToggle');
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playerScore = 0;
let computerScore = 0;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Minimax Algorithm for AI
function minimax(board, depth, isMaximizing) {
  const scores = {
    X: -1,
    O: 1,
    draw: 0
  };

  if (checkWin('O')) return scores.O;
  if (checkWin('X')) return scores.X;
  if (board.every(cell => cell !== '')) return scores.draw;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function computerMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < gameState.length; i++) {
    if (gameState[i] === '') {
      gameState[i] = 'O';
      let score = minimax(gameState, 0, false);
      gameState[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  gameState[move] = 'O';
  cells[move].classList.add('o');
  updateStatus();

  if (checkWin('O')) {
    computerScore++;
    computerScoreDisplay.textContent = `AI (O): ${computerScore}`;
    statusText.textContent = 'AI Wins!';
    confetti();
    gameActive = false;
    return;
  }

  if (gameState.every(cell => cell !== '')) {
    statusText.textContent = 'Draw!';
    gameActive = false;
    return;
  }

  currentPlayer = 'X';
  statusText.textContent = "Player X's Turn";
}

function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[clickedCellIndex] !== '' || !gameActive) return;

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.classList.add(currentPlayer.toLowerCase());
  updateStatus();

  if (checkWin(currentPlayer)) {
    if (currentPlayer === 'X') {
      playerScore++;
      playerScoreDisplay.textContent = `Player (X): ${playerScore}`;
    }
    statusText.textContent = `${currentPlayer === 'X' ? 'Player' : 'AI'} Wins!`;
    confetti();
    gameActive = false;
    return;
  }

  if (gameState.every(cell => cell !== '')) {
    statusText.textContent = 'Draw!';
    gameActive = false;
    return;
  }

  currentPlayer = 'O';
  statusText.textContent = "AI's Turn";
  setTimeout(computerMove, 1000); // Delay for AI move
}

function checkWin(player) {
  return winningConditions.some(condition => {
    return condition.every(index => {
      return gameState[index] === player;
    });
  });
}

function updateStatus() {
  statusText.textContent = `${currentPlayer === 'X' ? "Player X's Turn" : "AI's Turn"}`;
}

function resetGame() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  cells.forEach(cell => {
    cell.classList.remove('x', 'o');
    cell.textContent = '';
  });
  statusText.textContent = "Player X's Turn";
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);

// Dark/Light Mode Toggle
modeToggle.addEventListener('change', () => {
  document.body.setAttribute('data-theme', modeToggle.checked ? 'light' : 'dark');
});