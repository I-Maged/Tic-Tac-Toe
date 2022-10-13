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
const player = 'o';
const cells = document.querySelectorAll('.cell');

let playerMoves = [];

cells.forEach((cell) => {
  cell.addEventListener('click', handleCellClick);
});

function handleCellClick(cell) {
  if (cell.target.innerHTML != '') {
    return;
  } else {
    cell.target.innerHTML = player;
    playerMoves.push(Number(cell.srcElement.id));
    checkWinner(playerMoves);
  }
}
function checkWinner(playerMoves) {
  for (let i = 0; i < winningCombos.length; i++) {
    if (winningCombos[i].every((elem) => playerMoves.indexOf(elem) > -1)) {
      gameOver(i);
    }
  }
}
function gameOver(index) {
  cells.forEach((cell) => {
    cell.removeEventListener('click', handleCellClick, false);
  });
  cells.forEach((cell) => {
    winningCombos[index].forEach((combo) => {
      if (combo == Number(cell.id)) {
        cell.style.background = 'blue';
      }
    });
  });
}
