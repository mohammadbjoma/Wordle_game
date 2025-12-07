const WORDS = [
  "APPLE", "GRACE", "CRANE", "PLANT", "ABOUT",
  "SMILE", "RIVER", "BRAVE", "MOUSE", "BREAD",
  "TULIP", "STONE", "LIGHT", "HOUSE", "SWEET"
];

const ANSWER = WORDS[Math.floor(Math.random() * WORDS.length)];
const MAX_ROWS = 6, COLS = 5;

const boardEl = document.getElementById("board");
const keyboardEl = document.getElementById("keyboard");
const toast = document.getElementById("toast");

let grid = Array.from({ length: MAX_ROWS }, () => Array(COLS).fill(""));
let row = 0, col = 0, isGameOver = false;

/* --------------------------------------
   2. BUILD BOARD + KEYBOARD
--------------------------------------- */
function buildBoard() {
  boardEl.innerHTML = "";
  for (let r = 0; r < MAX_ROWS; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "row";
    if (r === 0) rowEl.classList.add("active");
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

/* --------------------------------------
   3. TOAST
--------------------------------------- */
function toastShow(msg) {
  toast.innerText = msg;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 1500);
}

/* --------------------------------------
   4. TILE UPDATE
--------------------------------------- */
function updateTiles() {
  for (let r = 0; r < MAX_ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      document.getElementById(`tile-${r}-${c}`).textContent = grid[r][c];
    }
  }
}

/* --------------------------------------
   5. HANDLE KEY INPUT
--------------------------------------- */
async function handleKey(key) {
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
    await validatedSubmit();
    return;
  }

  if (key.length === 1 && col < COLS) {
    grid[row][col] = key.toUpperCase();
    col++;
    updateTiles();
  }
}

/* --------------------------------------
   6. API WORD VALIDATION
--------------------------------------- */
async function isValidWord(word) {
  const apiUrl = "https://random-word-api.herokuapp.com/word?length=5&number=10000000";

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("API request failed");

    const words = await response.json();
    return words.includes(word.toLowerCase());

  } catch (error) {
    console.error("Error validating word:", error);
    return false;
  }
}

/* --------------------------------------
   7. VALIDATED SUBMIT
--------------------------------------- */
async function validatedSubmit() {
  if (col < COLS) return toastShow("Word is incomplete");

  const guess = grid[row].join("").toLowerCase();

  const valid = await isValidWord(guess);
  if (!valid) return toastShow("Word not in dictionary!");

  checkGuess(grid[row].join("")); // submit real guess
}

/* --------------------------------------
   8. ORIGINAL WORDLE CHECK LOGIC
--------------------------------------- */
function checkGuess(guess) {
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
    toastShow(`🎉 You Win! ${ANSWER}`);
    isGameOver = true;
    return;
  }

  row++;
  col = 0;

  if (row === MAX_ROWS) {
    toastShow(`❌ You Lost! The word was: ${ANSWER}`);
    isGameOver = true;
  }

  document.querySelectorAll(".row").forEach(r => r.classList.remove("active"));
  if (!isGameOver) document.querySelectorAll(".row")[row].classList.add("active");
}

/* --------------------------------------
   9. KEYBOARD & EVENTS
--------------------------------------- */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleKey("Enter");
  else if (e.key === "Backspace") handleKey("Backspace");
  else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
});

document.getElementById("btn-reset").onclick = () => location.reload();
document.getElementById("btn-reveal").onclick = () => toastShow(`Word: ${ANSWER}`);

/* --------------------------------------
   10. INIT
--------------------------------------- */
buildBoard();
buildKeyboard();
updateTiles();