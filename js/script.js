const game = {
  els: {
    board: null,
    playerShapeLabel: null,
    playerScoreLabel: null,
    computerShapeLabel: null,
    computerScoreLabel: null,
    statusBoardLabel: null,
  },
  player: {
    shape: "✖",
    score: 0,
  },
  computer: {
    shape: "⭘",
    score: 0,
  },
  labels: {
    xStart: "Player to start<br>Click on a square to begin",
    oStart: "Computer to start<br>Click the board to begin",
    xWins: "✖ Wins!<br>Click to continue",
    oWins: "⭘ Wins!<br>Click to continue",
    draw: "Draw!<br>Click to continune",
  },
  winState: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ],
  boardState: [],
  playerTurn: true,
  started: false,
  ended: false,
};

function init() {
  game.els.board = document.querySelector(".gameboard");
  game.els.board.addEventListener("click", handleClick);
  document.getElementById("swap-shape").addEventListener("click", handleSwap);

  game.els.playerShapeLabel = document.getElementById("player-shape");
  game.els.playerScoreLabel = document.getElementById("player-score");
  game.els.computerShapeLabel = document.getElementById("computer-shape");
  game.els.computerScoreLabel = document.getElementById("computer-score");
  game.els.statusBoardLabel = document.getElementById("statusboard");

  game.els.playerShapeLabel.textContent = game.player.shape;
  game.els.computerScoreLabel.textContent = game.computer.shape;
  game.els.playerScoreLabel.textContent = game.player.score;
  game.els.computerScoreLabel.textContent = game.computer.score;

  resetBoard();
}

function resetBoard() {
  game.ended = false;
  game.started = false;
  game.boardState = Array(9).fill(null);

  if (game.player.shape === "✖") {
    game.els.statusBoardLabel.innerHTML = game.labels.xStart;
    game.playerTurn = true;
  } else {
    game.els.statusBoardLabel.innerHTML = game.labels.oStart;
    game.playerTurn = false;
  }

  for (const child of game.els.board.children) {
    child.textContent = "";
    child.disabled = false;
  }
}

function handleSwap() {
  if (!game.started) {
    game.player.shape = game.player.shape === "✖" ? "⭘" : "✖";
    game.computer.shape = game.computer.shape === "✖" ? "⭘" : "✖";
    game.els.playerShapeLabel.textContent = game.player.shape;
    game.els.computerShapeLabel.textContent = game.computer.shape;

    if (game.player.shape === "✖") {
      game.els.statusBoardLabel.innerHTML = game.labels.xStart;
      game.playerTurn = true;
    } else {
      game.els.statusBoardLabel.innerHTML = game.labels.oStart;
      game.playerTurn = false;
    }
  }
}

function handleClick(e) {
  if (game.ended === true) {
    resetBoard();
    return;
  }

  if (!game.started && !game.playerTurn) {
    game.started = true;
    getComputerMove();
    game.playerTurn = true;
    game.els.statusBoardLabel.innerHTML = `${game.player.shape}'s Turn`;
    return;
  }

  if (e.target.id && game.playerTurn) {
    game.started = true;
    game.boardState[e.target.id] = game.player.shape;
    e.target.textContent = game.player.shape;
    e.target.disabled = true;

    if (checkWin()) {
      return;
    }

    game.playerTurn = false;
    game.els.statusBoardLabel.innerHTML = `${game.computer.shape}'s Turn`;

    setTimeout(() => {
      getComputerMove();

      if (checkWin()) {
        return;
      }

      game.playerTurn = true;
      game.els.statusBoardLabel.innerHTML = `${game.player.shape}'s Turn`;
    }, 500);
  }
}

function getComputerMove() {
  let winCells = [];
  let blockCells = [];
  for (const state of game.winState) {
    const boardState = state.map((item) => game.boardState[item]);
    const playerN = boardState.filter(
      (item) => item === game.player.shape,
    ).length;
    const computerN = boardState.filter(
      (item) => item === game.computer.shape,
    ).length;
    const emptyN = boardState.filter((item) => item === null).length;

    if (playerN === 2 && emptyN === 1) {
      blockCells.push(state[boardState.indexOf(null)]);
    }

    if (computerN === 2 && emptyN === 1) {
      winCells.push(state[boardState.indexOf(null)]);
    }
  }

  winCells = [...new Set(winCells)];
  if (winCells.length > 0) {
    const randomWinId = Math.floor(Math.random() * winCells.length);
    playComputerMove(winCells[randomWinId]);
    return;
  }

  blockCells = [...new Set(blockCells)];
  if (blockCells.length > 0) {
    const randomBlockId = Math.floor(Math.random() * blockCells.length);
    playComputerMove(blockCells[randomBlockId]);
    return;
  }

  const emptyCells = [];
  for (let i = 0; i < game.boardState.length; i++) {
    if (game.boardState[i] === null) {
      emptyCells.push(i);
    }
  }

  const randomEmptyId = Math.floor(Math.random() * emptyCells.length);
  playComputerMove(emptyCells[randomEmptyId]);
}

function playComputerMove(cellId) {
  game.boardState[cellId] = game.computer.shape;
  game.els.board.children[cellId].textContent = game.computer.shape;
  game.els.board.children[cellId].disabled = true;
}

function checkWin() {
  const hasWin = game.winState.find((item) => {
    return (
      game.boardState[item[0]] != null &&
      game.boardState[item[0]] === game.boardState[item[1]] &&
      game.boardState[item[1]] === game.boardState[item[2]]
    );
  });
  const hasEmpty = game.boardState.includes(null);

  if (hasWin) {
    game.ended = true;
    game.els.statusBoardLabel.innerHTML =
      game.boardState[hasWin[0]] === "✖"
        ? game.labels.xWins
        : game.labels.oWins;

    if (game.boardState[hasWin[0]] === game.player.shape) {
      game.player.score += 1;
      game.els.playerScoreLabel.textContent = game.player.score;
    } else {
      game.computer.score += 1;
      game.els.computerScoreLabel.textContent = game.computer.score;
    }

    for (const child of game.els.board.children) {
      child.disabled = false;
    }

    return true;
  }

  if (!hasEmpty) {
    game.ended = true;
    game.els.statusBoardLabel.innerHTML = game.labels.draw;

    for (const child of game.els.board.children) {
      child.disabled = false;
    }

    return true;
  }
}

window.addEventListener("DOMContentLoaded", init);
