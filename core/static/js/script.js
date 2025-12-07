const WORDS = [
  "APPLE", "GRACE", "CRANE", "PLANT", "ABOUT",
  "SMILE", "RIVER", "BRAVE", "MOUSE", "BREAD",
  "TULIP", "STONE", "LIGHT", "HOUSE", "SWEET"
];

const ANSWER = WORDS[Math.floor(Math.random() * WORDS.length)];
const MAX_ROWS = 6, COLS = 5;

const boardEl = document.getElementById("board");
const keyboardEl = document.getElementById("keyboard");
const resultBox = document.getElementById("result-box");
const toast = document.getElementById("toast");

let grid = Array.from({ length: MAX_ROWS }, () => Array(COLS).fill(""));
let row = 0, col = 0, isGameOver = false;

function buildBoard() {
  boardEl.innerHTML = "";
  for (let r = 0; r < MAX_ROWS; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "row";
    for (let c = 0; c < COLS; c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.id = `tile-${r}-${c}`;
      rowEl.appendChild(tile);
    }
    boardEl.appendChild(rowEl);
  }
}

function buildKeyboard() {
  const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
  keys.forEach(k => {
    const btn = document.createElement("button");
    btn.className = "key";
    btn.textContent = k;
    btn.onclick = () => handleKey(k);
    keyboardEl.appendChild(btn);
  });

  let enter = document.createElement("button");
  enter.className = "key";
  enter.textContent = "ENTER";
  enter.onclick = () => handleKey("Enter");
  keyboardEl.appendChild(enter);

  let back = document.createElement("button");
  back.className = "key";
  back.textContent = "⌫";
  back.onclick = () => handleKey("Backspace");
  keyboardEl.appendChild(back);
}

function toastShow(msg) {
  toast.innerText = msg;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 2000);
}

function updateTiles() {
  for (let r = 0; r < MAX_ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      document.getElementById(`tile-${r}-${c}`).textContent = grid[r][c];
    }
  }
}

function handleKey(key) {
  if (isGameOver) return;

  if (key === "Backspace") {
    if (col > 0) {
      col--;
      grid[row][col] = "";
      updateTiles();
    }
    return;
  }

  if (key === "Enter") {
    submitGuess();
    return;
  }

  if (key.length === 1 && col < COLS) {
    grid[row][col] = key.toUpperCase();
    col++;
    updateTiles();
  }
}

function submitGuess() {
  if (col < COLS) return toastShow("Word is incomplete");

  const guess = grid[row].join("");
  const answerChars = ANSWER.split("");
  let status = Array(COLS).fill("absent");
  let taken = Array(COLS).fill(false);

  for (let i = 0; i < COLS; i++) {
    if (guess[i] === answerChars[i]) {
      status[i] = "correct";
      taken[i] = true;
    }
  }

  for (let i = 0; i < COLS; i++) {
    if (status[i] === "correct") continue;
    for (let j = 0; j < COLS; j++) {
      if (!taken[j] && guess[i] === answerChars[j]) {
        status[i] = "present";
        taken[j] = true;
        break;
      }
    }
  }

  for (let i = 0; i < COLS; i++) {
    const tile = document.getElementById(`tile-${row}-${i}`);
    tile.classList.add(status[i]);
  }

  if (guess === ANSWER) {
    isGameOver = true;
    resultBox.className = "result-box win";
    resultBox.innerHTML = `🎉 You Win! The word was: <b>${ANSWER}</b>`;
    resultBox.style.display = "block";
    return;
  }

  row++;
  col = 0;

  if (row === MAX_ROWS) {
    isGameOver = true;
    resultBox.className = "result-box lose";
    resultBox.innerHTML = `❌ You Lost! The word was: <b>${ANSWER}</b>`;
    resultBox.style.display = "block";
  }
}

document.addEventListener("keydown", (e) => {
  let key = e.key.toUpperCase();
  if (e.key === "Enter") handleKey("Enter");
  else if (e.key === "Backspace") handleKey("Backspace");
  else if (key.match(/^[A-Z]$/)) handleKey(key);
});

document.getElementById("btn-reset").onclick = () => location.reload();
document.getElementById("btn-reveal").onclick = () => toastShow(`Word: ${ANSWER}`);

buildBoard();
buildKeyboard();
updateTiles();





