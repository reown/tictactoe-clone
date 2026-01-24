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
  started: false,
  ended: false,
};
let test1;

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

  game.els.statusBoardLabel.innerHTML =
    game.player.shape === "✖" ? game.labels.xStart : game.labels.oStart;

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
    game.els.statusBoardLabel.innerHTML =
      game.player.shape === "✖" ? game.labels.xStart : game.labels.oStart;
  }
}

function handleClick(e) {
  if (game.ended === true) {
    resetBoard();
    return;
  }

  if (!game.started && game.computer.shape === "✖") {
    game.started = true;
    computerMove();
    game.els.statusBoardLabel.innerHTML = `${game.player.shape}'s Turn`;
    return;
  }

  if (e.target.id) {
    game.started = true;
    game.boardState[e.target.id] = game.player.shape;
    e.target.textContent = game.player.shape;
    e.target.disabled = true;

    if (checkWin()) {
      return;
    }

    game.els.statusBoardLabel.innerHTML = `${game.computer.shape}'s Turn`;
    setTimeout(() => {
      computerMove();

      if (checkWin()) {
        return;
      }

      game.els.statusBoardLabel.innerHTML = `${game.player.shape}'s Turn`;
    }, 1000);
  }
}

function computerMove() {
  const emptyCells = [];
  for (let i = 0; i < game.boardState.length; i++) {
    if (game.boardState[i] === null) {
      emptyCells.push(i);
    }
  }

  const randomId = Math.floor(Math.random() * emptyCells.length);
  game.boardState[emptyCells[randomId]] = game.computer.shape;
  game.els.board.children[emptyCells[randomId]].textContent =
    game.computer.shape;
  game.els.board.children[emptyCells[randomId]].disabled = true;
}

function checkWin() {
  const hasWin = game.winState.find((item) => {
    return (
      game.boardState[item[0]] != null &&
      game.boardState[item[0]] === game.boardState[item[1]] &&
      game.boardState[item[1]] === game.boardState[item[2]]
    );
  });

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
  }
  return hasWin;
}

window.addEventListener("DOMContentLoaded", init);
