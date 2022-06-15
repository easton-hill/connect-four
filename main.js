class Cell {
  constructor(color, x, y) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.div = document.createElement("div");
    this.setupCell();
  }

  setupCell() {
    this.div.classList.add("cell");
    this.div.setAttribute("id", `${this.x}${this.y}`);
    const row = document.getElementById(`row-${this.x}`);
    row.appendChild(this.div);
  }

  drawCell() {
    if (this.color) {
      this.div.classList.add(`cell-${this.color}`);
    }
  }
}

class Board {
  constructor() {
    this.cells = [];
    this.color = "yellow";
    this.gameOver = false;
    this.setupBoard();
  }

  setupBoard() {
    this.gameOver = false;

    const board = document.createElement("div");
    board.setAttribute("id", "board");

    const main = document.getElementById("main");
    main.innerHTML = "";
    main.appendChild(board);

    this.cells.length = 0;
    for (let i = 0; i < 6; i++) {
      const rowDiv = document.createElement("div");
      rowDiv.setAttribute("id", `row-${i}`);
      rowDiv.classList.add("row");
      board.appendChild(rowDiv);

      const row = [];
      for (let j = 0; j < 7; j++) {
        const cell = new Cell(null, i, j);
        cell.div.addEventListener("click", this.handleClick.bind(this));
        row.push(cell);
      }
      this.cells.push(row);
    }
  }

  handleClick(e) {
    if (this.gameOver) {
      return;
    }

    const id = e.target.id;
    const col = parseInt(id[1]);

    this.highlightCell(col);
  }

  highlightCell(col) {
    // check column from bottom up, place in first empty space
    for (let i = 5; i >= 0; i--) {
      const cell = this.cells[i][col];
      if (!cell.color) {
        cell.color = this.color;
        cell.drawCell();

        // change the color each turn
        if (this.color === "yellow") {
          this.color = "red";
        } else {
          this.color = "yellow";
        }

        this.checkWinner();
        break;
      }
    }
  }

  checkWinner() {
    // vertical
    for (let col = 0; col < 7; col++) {
      let consecutive = 1;
      let prevColor = null;

      for (let row = 0; row < 6; row++) {
        const color = this.cells[row][col].color;
        if (color && color === prevColor) {
          consecutive++;
        } else {
          consecutive = 1;
          prevColor = color;
        }

        if (consecutive === 4) {
          this.displayWinner(color);
          return;
        }
      }
    }

    // horizontal
    for (let row = 0; row < 6; row++) {
      let consecutive = 1;
      let prevColor = null;

      for (let col = 0; col < 7; col++) {
        const color = this.cells[row][col].color;
        if (color && color === prevColor) {
          consecutive++;
        } else {
          consecutive = 1;
          prevColor = color;
        }

        if (consecutive === 4) {
          this.displayWinner(color);
          return;
        }
      }
    }

    // diagonol
    const diagonols = [
      // left-to-right
      ["2 0", "3 1", "4 2", "5 3"],
      ["1 0", "2 1", "3 2", "4 3", "5 4"],
      ["0 0", "1 1", "2 2", "3 3", "4 4", "5 5"],
      ["0 1", "1 2", "2 3", "3 4", "4 5", "5 6"],
      ["0 2", "1 3", "2 4", "3 5", "4 6"],
      ["0 3", "1 4", "2 5", "3 6"],
      // right-to-left
      ["2 6", "3 5", "4 4", "5 3"],
      ["1 6", "2 5", "3 4", "4 3", "5 2"],
      ["0 6", "1 5", "2 4", "3 3", "4 2", "5 1"],
      ["0 5", "1 4", "2 3", "3 2", "4 1", "5 0"],
      ["0 4", "1 3", "2 2", "3 1", "4 0"],
      ["0 3", "1 2", "2 1", "3 0"],
    ];

    for (let i = 0; i < diagonols.length; i++) {
      let consecutive = 1;
      let prevColor = null;

      for (let j = 0; j < diagonols[i].length; j++) {
        const [row, col] = diagonols[i][j].split(" ");
        const color = this.cells[row][col].color;
        if (color && color === prevColor) {
          consecutive++;
        } else {
          consecutive = 1;
          prevColor = color;
        }

        if (consecutive === 4) {
          this.displayWinner(color);
          return;
        }
      }
    }

    // check for tie
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        const color = this.cells[i][j].color;
        if (!color) {
          return;
        }
      }
    }

    this.displayWinner("tie");
  }

  displayWinner(color) {
    this.gameOver = true;

    const winnerDiv = document.createElement("div");
    winnerDiv.setAttribute("id", "winner");

    if (color === "tie") {
      winnerDiv.innerText = "TIE!";
    } else {
      winnerDiv.innerText = `${color.toUpperCase()} WINS!`;
    }

    const resetButton = document.createElement("button");
    resetButton.onclick = this.setupBoard.bind(this);
    resetButton.setAttribute("id", "reset");
    resetButton.innerText = "Reset";
    winnerDiv.appendChild(resetButton);

    const main = document.getElementById("main");
    main.appendChild(winnerDiv);
  }
}

const main = () => {
  const board = new Board();
};

main();
