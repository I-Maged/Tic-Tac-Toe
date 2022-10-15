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

  //get all dom strings
  const DOMstrings = {
    cells: document.querySelectorAll('.cell'),
    cellsArray: Array.from(document.querySelectorAll('.cell')),
    gameBtn: document.querySelector('.game-btn'),
    gameField: document.querySelector('.game-field'),
    gameOverText: document.querySelector('.game-over-text'),
    won: document.querySelector('.won-sound'),
    lost: document.querySelector('.lost-sound'),
    scoreField: document.querySelector('.display-score'),
    playerScoreText: document.querySelector('.player-score'),
    aiScoreText: document.querySelector('.ai-score'),
  };
  //set all input variables
  const setGameInput = {
    playerMoves: [],
    aiMoves: [],
    playerSign: '',
    aiSign: '',
    currentSign: '',
    checkGameOver: '',
  };

  //to handle score
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

  //generate random move for easy mode
  function easyMode() {
    let move = 0;
    for (let index = 0; index < 100; index++) {
      move = Math.floor(Math.random() * 9);
      if (DOMstrings.cellsArray[move].innerHTML == '') {
        break;
      }
    }
    return move;
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

  //if ended in a draw
  function draw() {
    DOMstrings.gameOverText.innerHTML = 'draw!';
    displayScore();
  }

  //handles displaying score after game over
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
    easyMode,
    getDOMstrings: function () {
      return DOMstrings;
    },
    getGameInput: function () {
      return setGameInput;
    },
  };
})();

const UIController = ((gameCtrl) => {
  //get dom strings
  const DOM = gameCtrl.getDOMstrings();
  //get input variables
  const INPUT = gameCtrl.getGameInput();

  //start new game event
  DOM.gameBtn.addEventListener('click', startNewGame);

  //event listener for cell click
  DOM.cells.forEach((cell) => {
    cell.addEventListener('click', handleCellClick);
  });

  //handles player's click
  function handleCellClick(cell) {
    //check if cell is empty
    if (cell.target.innerHTML != '') {
      return;
    } else if (INPUT.currentSign == INPUT.playerSign) {
      //add move to UI & player array
      cell.target.innerHTML = INPUT.playerSign;
      INPUT.playerMoves.push(Number(cell.target.id));
      //check if player won
      INPUT.checkGameOver = gameCtrl.checkWinner(INPUT.playerMoves);
      if (INPUT.checkGameOver) {
        //game over if player won
        gameCtrl.playerWon(INPUT.checkGameOver);
        restart();
        return;
      } else {
        //or change sign and continue
        INPUT.currentSign = INPUT.aiSign;
      }
    }
    //check for draw
    if (
      INPUT.aiMoves.length + INPUT.playerMoves.length >= 9 &&
      !INPUT.checkGameOver
    ) {
      gameCtrl.draw();
      restart();
      return;
    }
    easyturn();
  }

  //handles ai turn
  function easyturn() {
    //get random number for an empty cell
    let esayMove = gameCtrl.easyMode();

    //add move to UI & ai array
    DOM.cellsArray[esayMove].innerHTML = INPUT.aiSign;
    INPUT.aiMoves.push(esayMove);
    //check if ai won
    INPUT.checkGameOver = gameCtrl.checkWinner(INPUT.aiMoves);
    if (INPUT.checkGameOver) {
      //game over if ai won
      gameCtrl.aiWon(INPUT.checkGameOver);
      restart();
      return;
    } else {
      //or change sign and continue
      INPUT.currentSign = INPUT.playerSign;
    }
    //check for draw
    if (
      INPUT.aiMoves.length + INPUT.playerMoves.length >= 9 &&
      !INPUT.checkGameOver
    ) {
      gameCtrl.draw();
      restart();
      return;
    }
  }
  function startNewGame() {
    //erase background from start game form
    DOM.gameField.style.background = '';
    //set new signs
    INPUT.playerSign = document.querySelector('#sign').value;
    INPUT.aiSign = INPUT.playerSign == 'x' ? 'o' : 'x';
    INPUT.currentSign = INPUT.playerSign;
    //remove event listener from new game button
    DOM.gameBtn.removeEventListener('click', startNewGame, false);
    //empty all cells and restarting event listener
    DOM.cells.forEach((cell) => {
      cell.addEventListener('click', handleCellClick);
      cell.innerHTML = '';
      cell.style.background = '';
    });

    //hides score and after after staarting new game
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
    INPUT.playerMoves = [];
    INPUT.aiMoves = [];
    INPUT.playerSign = '';
    INPUT.aiSign = '';
    INPUT.currentSign = '';
    INPUT.checkGameOver = '';
  }

  return {
    restart,
  };
})(gameController);
UIController.restart();
