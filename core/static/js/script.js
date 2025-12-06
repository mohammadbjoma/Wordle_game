(function () {
  const meta = document.querySelector('meta[name="server-word"]');
  const SERVER_WORD = meta && meta.content ? meta.content.trim().toUpperCase() : null;

  const WORDS = [
    "APPLE","GRACE","CRANE","PLANT","ABOUT","RIVER","SMILE","BREAD","MOUSE","BRICK","AMONG","TULIP"
  ];

  const ANSWER = SERVER_WORD || WORDS[Math.floor(Date.now() / 86400000) % WORDS.length];
  const MAX_ROWS = 6, COLS = 5;

  const boardEl = document.getElementById("board");
  const keyboardEl = document.getElementById("keyboard");
  const toast = document.getElementById("toast");

  let grid = Array.from({ length: MAX_ROWS }, () => Array.from({ length: COLS }, () => ""));
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
    keyboardEl.innerHTML = "";
    const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
    keys.forEach((k) => {
      const btn = document.createElement("button");
      btn.className = "key";
      btn.textContent = k;
      btn.dataset.key = k;
      btn.addEventListener("click", () => handleKey(k));
      keyboardEl.appendChild(btn);
    });

    const enter = document.createElement("button");
    enter.className = "key";
    enter.textContent = "ENTER";
    enter.addEventListener("click", () => handleKey("Enter"));
    keyboardEl.appendChild(enter);

    const back = document.createElement("button");
    back.className = "key";
    back.textContent = "⌫";
    back.addEventListener("click", () => handleKey("Backspace"));
    keyboardEl.appendChild(back);
  }

  function toastShow(msg, ms = 2000) {
    toast.textContent = msg;
    toast.style.display = "block";
    setTimeout(() => (toast.style.display = "none"), ms);
  }

  function updateTiles() {
    for (let r = 0; r < MAX_ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const tile = document.getElementById(`tile-${r}-${c}`);
        tile.textContent = grid[r][c] || "";
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

    if (typeof key === "string" && key.length === 1 && col < COLS) {
      grid[row][col] = key.toUpperCase();
      col++;
      updateTiles();
    }
  }

  function submitGuess() {
    if (col < COLS) return toastShow("الكلمة ناقصة");

    const guess = grid[row].join("");

    // (تصحيح شرط كان غلط عندك)
    if (!WORDS.includes(guess) && guess !== ANSWER) {
      // لو بدك تمنع الكلمات غير الموجودة، فعّل السطرين:
      // toastShow("هذه الكلمة غير موجودة في القاموس");
      // return;
    }

    const answerChars = ANSWER.split("");
    const status = Array(COLS).fill("absent");
    const taken = Array(COLS).fill(false);

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
      toastShow("مبروك! حليت الكلمة 🎉", 3500);
      isGameOver = true;
      return;
    }

    row++;
    col = 0;

    if (row >= MAX_ROWS) {
      isGameOver = true;
      toastShow(`انتهت محاولاتك — الكلمة: ${ANSWER}`, 5000);
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleKey("Enter");
    else if (e.key === "Backspace") handleKey("Backspace");
    else {
      const k = e.key.toUpperCase();
      if (k.match(/^[A-Z]$/)) handleKey(k);
    }
  });

  document.getElementById("btn-reset").addEventListener("click", () => location.reload());
  document.getElementById("btn-reveal").addEventListener("click", () => toastShow(`الكلمة: ${ANSWER}`, 4000));

  buildBoard();
  buildKeyboard();
  updateTiles();

  window.__WORDLE = { ANSWER, grid };
})();
