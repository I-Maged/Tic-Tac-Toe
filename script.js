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

  const cells = document.querySelectorAll('.cell');

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
    cells.forEach((cell) => {
      combo.forEach((i) => {
        if (i == cell.id) {
          cell.style.background = '#1919fa';
        }
      });
    });
    document.querySelector('.won-sound').play();
  }

  //if ai won
  function aiWon(combo) {
    cells.forEach((cell) => {
      combo.forEach((i) => {
        if (i == cell.id) {
          cell.style.background = '#ff1717';
        }
      });
    });
    document.querySelector('.lost-sound').play();
  }

  return { checkWinner, playerWon, aiWon };
})();

const UIController = ((gameCtrl) => {
  const cells = document.querySelectorAll('.cell');
  const gameBtn = document.querySelector('.game-btn');
  const gameField = document.querySelector('.game-field');
  let playerMoves = [];
  let aiMoves = [];
  let playerSign;
  let aiSign;
  let currentSign;
  let checkGameOver;

  //start new game event
  gameBtn.addEventListener('click', startNewGame);

  //event listener for cell click
  cells.forEach((cell) => {
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
  }

  function startNewGame() {
    //erase background from start game form
    gameField.style.background = '';
    //set new signs
    playerSign = document.querySelector('#sign').value;
    aiSign = playerSign == 'x' ? 'o' : 'x';
    currentSign = playerSign;
    //remove event listener from new game button
    gameBtn.removeEventListener('click', startNewGame, false);
    //empty all cells and restarting event listener
    cells.forEach((cell) => {
      cell.addEventListener('click', handleCellClick);
      cell.innerHTML = '';
      cell.style.background = '';
    });
  }

  function restart() {
    //set background to start game form
    gameField.style.background = '#666699';
    //remove event listener from cells
    cells.forEach((cell) => {
      cell.removeEventListener('click', handleCellClick);
    });
    //starting new game button event listener
    document.querySelector('.game-btn').addEventListener('click', startNewGame);

    //erase allcurrent values from variables
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
