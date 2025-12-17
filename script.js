let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let isVsComputer = false;

let scores = {
  X: 0,
  O: 0,
  tie: 0,
};

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// DOM elements
const cells = document.querySelectorAll(".cell");
const currentPlayerDisplay = document.getElementById("currentPlayer");
const gameStatus = document.getElementById("gameStatus");
const resetBtn = document.getElementById("resetBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreTie = document.getElementById("scoreTie");
const modeSelection = document.getElementById("modeSelection");
const gameContainer = document.getElementById("gameContainer");
const pvcBtn = document.getElementById("pvcBtn");
const pvpBtn = document.getElementById("pvpBtn");

// Event Listeners for Mode Selection
pvcBtn.addEventListener("click", () => startGame(true));
pvpBtn.addEventListener("click", () => startGame(false));

function startGame(vsComputer) {
  isVsComputer = vsComputer;
  gameActive = true;
  modeSelection.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  resetGameBoard();
}

// Event Handlers
function handleCellClick(index) {
  if (!gameActive || board[index] !== "") return;
  if (isVsComputer && currentPlayer === "O") return;

  makeMove(index);

  // If it's vs Computer and still active, trigger computer move
  if (gameActive && isVsComputer && currentPlayer === "O") {
    setTimeout(computerMove, 600);
  }
}

function makeMove(index) {
  board[index] = currentPlayer;
  updateCell(index);

  if (checkWin()) {
    endGame(`Player ${currentPlayer} Wins!`);
    scores[currentPlayer]++;
    highlightWinningCells();
    updateScoreDisplay();
  } else if (checkTie()) {
    endGame(`It's a Tie!`);
    scores.tie++;
    updateScoreDisplay();
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateDisplay();
  }
}

// Computer Logic (Random Move)
function computerMove() {
  if (!gameActive) return;

  // 1. Find all empty cells
  let emptyIndices = [];
  board.forEach((cell, index) => {
    if (cell === "") emptyIndices.push(index);
  });

  // 2. Pick a random empty spot
  if (emptyIndices.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyIndices.length);
    const moveIndex = emptyIndices[randomIndex];
    makeMove(moveIndex);
  }
}

function updateCell(index) {
  const cell = cells[index];
  cell.textContent = currentPlayer;
  cell.classList.add("taken", currentPlayer.toLowerCase());
}

function checkWin() {
  return winPatterns.some((pattern) => {
    const [a, b, c] = pattern;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function checkTie() {
  return board.every((cell) => cell !== "");
}

function highlightWinningCells() {
  const winPattern = winPatterns.find((pattern) => {
    const [a, b, c] = pattern;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });

  winPattern.forEach((index) => {
    cells[index].classList.add("winner");
  });
}

function endGame(message) {
  gameActive = false;
  gameStatus.textContent = message;
  gameStatus.style.color = "#fff";
  currentPlayerDisplay.textContent = "Game Over";
}

function resetGameBoard() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.className = "cell";
  });

  gameStatus.textContent = "";
  updateDisplay();
}

function goToMainMenu() {
  gameActive = false;
  gameContainer.classList.add("hidden");
  modeSelection.classList.remove("hidden");
  resetGameBoard();
}

function resetScore() {
  scores = {
    X: 0,
    O: 0,
    tie: 0,
  };
  updateScoreDisplay();
  resetGameBoard();
}

function updateDisplay() {
  currentPlayerDisplay.textContent = `Player ${currentPlayer}'s Turn`;
  currentPlayerDisplay.style.color =
    currentPlayer === "X" ? "#ff0055" : "#00f3ff";
}

function updateScoreDisplay() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreTie.textContent = scores.tie;
}

function initializeGame() {
  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(index));
  });

  resetBtn.addEventListener("click", goToMainMenu);
  resetScoreBtn.addEventListener("click", resetScore);
}

document.addEventListener("DOMContentLoaded", initializeGame);
