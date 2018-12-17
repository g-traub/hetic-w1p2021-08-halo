oxo.screens.loadScreen('game', game);

function game() {
  
  function initGame(){
    const tiles = document.querySelectorAll('.game__tile');
    console.log(tiles);
    const walls = document.querySelectorAll('.game__wall');
    console.log(walls);
    
    let row = 1;
    let column = 1;
    
    tiles.forEach(element => {
      if (column < 9) {
        element.dataset.column = column;
        column++;
        element.dataset.row = row;
      } else {
        element.dataset.column = column;
        element.dataset.row = row;
        column = 1;
        row++;
      }
    })
  }
  initGame();
}



/* const moveTo = player => {
  
}

let player1 = document.querySelector('.player1');
let player2 = document.querySelector('.player2');

player1.addEventListener('click', () => {
  moveTo(player1);
});
player2.addEventListener('click', () => {
  moveTo(player2);
}); */
