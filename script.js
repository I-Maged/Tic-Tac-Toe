const gameController = (() => {
  //all winning possibilities
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const DOMstrings = {
    cells: document.querySelectorAll('.cell'),
    gameBtn: document.querySelector('.game-btn'),
    gameField: document.querySelector('.game-field'),
    gameOverText: document.querySelector('.game-over-text'),
    won: document.querySelector('.won-sound'),
    lost: document.querySelector('.lost-sound'),
    scoreField: document.querySelector('.display-score'),
    playerScoreText: document.querySelector('.player-score'),
    aiScoreText: document.querySelector('.ai-score'),
  };
  const setScore = {
    playerScore: 0,
    aiScore: 0,
    incrementPlayerScore: function () {
      this.playerScore++;
    },
    incrementAIScore: function () {
      this.aiScore++;
    },
  };

  //check if player or ai won
  function checkWinner(moves) {
    let check = null;
    winningCombos.forEach((combo) => {
      if (combo.every((el) => moves.indexOf(el) > -1)) {
        check = combo;
      }
    });
    return check;
  }

  //if player won
  function playerWon(combo) {
    DOMstrings.cells.forEach((cell) => {
      combo.forEach((i) => {
        if (i == cell.id) {
          cell.style.background = '#1919fa';
        }
      });
    });
    setScore.incrementPlayerScore();
    displayScore();
    DOMstrings.gameOverText.innerHTML = 'you won!';
    DOMstrings.won.play();
  }

  //if ai won
  function aiWon(combo) {
    DOMstrings.cells.forEach((cell) => {
      combo.forEach((i) => {
        if (i == cell.id) {
          cell.style.background = '#ff1717';
        }
      });
    });
    setScore.incrementAIScore();
    displayScore();
    DOMstrings.gameOverText.innerHTML = 'you lost!';
    DOMstrings.lost.volume = 0.5;
    DOMstrings.lost.play();
  }

  function draw() {
    DOMstrings.gameOverText.innerHTML = 'draw!';
    displayScore();
  }

  function displayScore() {
    DOMstrings.playerScoreText.innerHTML = setScore.playerScore;
    DOMstrings.aiScoreText.innerHTML = setScore.aiScore;
    DOMstrings.scoreField.style.visibility = 'visible';
    DOMstrings.gameOverText.style.visibility = 'visible';
  }

  return {
    checkWinner,
    playerWon,
    aiWon,
    draw,
    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

const UIController = ((gameCtrl) => {
  const DOM = gameCtrl.getDOMstrings();
  let playerMoves = [];
  let aiMoves = [];
  let playerSign;
  let aiSign;
  let currentSign;
  let checkGameOver;

  //start new game event
  DOM.gameBtn.addEventListener('click', startNewGame);

  //event listener for cell click
  DOM.cells.forEach((cell) => {
    cell.addEventListener('click', handleCellClick);
  });

  function handleCellClick(cell) {
    //check if cell is empty
    if (cell.target.innerHTML != '') {
      return;
    } else if (currentSign == playerSign) {
      //add move to player array
      cell.target.innerHTML = playerSign;
      playerMoves.push(Number(cell.target.id));
      //check if player won
      checkGameOver = gameCtrl.checkWinner(playerMoves);
      if (checkGameOver) {
        //game over if player won
        gameCtrl.playerWon(checkGameOver);
        restart();
      } else {
        //or change sign and continue
        currentSign = aiSign;
      }
    } else if (currentSign == aiSign) {
      //add move to ai array
      cell.target.innerHTML = aiSign;
      aiMoves.push(Number(cell.target.id));
      //check if player won
      checkGameOver = gameCtrl.checkWinner(aiMoves);
      if (checkGameOver) {
        //game over if ai won
        gameCtrl.aiWon(checkGameOver);
        restart();
      } else {
        //or change sign and continue
        currentSign = playerSign;
      }
    }
    if (aiMoves.length + playerMoves.length >= 9 && !checkGameOver) {
      gameCtrl.draw();
      restart();
    }
  }

  function startNewGame() {
    //erase background from start game form
    DOM.gameField.style.background = '';
    //set new signs
    playerSign = document.querySelector('#sign').value;
    aiSign = playerSign == 'x' ? 'o' : 'x';
    currentSign = playerSign;
    //remove event listener from new game button
    DOM.gameBtn.removeEventListener('click', startNewGame, false);
    //empty all cells and restarting event listener
    DOM.cells.forEach((cell) => {
      cell.addEventListener('click', handleCellClick);
      cell.innerHTML = '';
      cell.style.background = '';
    });
    DOM.scoreField.style.visibility = 'hidden';
    DOM.gameOverText.style.visibility = 'hidden';
  }

  function restart() {
    //set background to start game form
    DOM.gameField.style.background = '#666699';
    //remove event listener from cells
    DOM.cells.forEach((cell) => {
      cell.removeEventListener('click', handleCellClick);
    });
    //starting new game button event listener
    document.querySelector('.game-btn').addEventListener('click', startNewGame);

    //erase all current values from variables
    playerMoves = [];
    aiMoves = [];
    playerSign = '';
    aiSign = '';
    currentSign = '';
    checkGameOver = '';
  }

  return {
    restart,
  };
})(gameController);
UIController.restart();
