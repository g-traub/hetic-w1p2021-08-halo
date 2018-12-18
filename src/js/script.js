oxo.screens.loadScreen('game', game);

function game() {
  //Joueur 1 joue en premier
  let turn = 'player1';
  
  let player1 = document.querySelector('.player1');
  let player2 = document.querySelector('.player2');

  function initGame (){
    const tiles = document.querySelectorAll('.game__tile');
    const walls = document.querySelectorAll('.game__wall');
    
    //intialise les coordoonées
    let row = 1;
    let column = 1;
    
    //numérote les cases
    tiles.forEach(element => {
      element.addEventListener('click', function(){
        clickHandler(element);
      })
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
  
  //Vérifie l'accessibilité des cases autour du personnage
  function checkAround(player){
    let x = player.parentElement.dataset.row;
    let y = player.parentElement.dataset.column;

    let tile1 = document.querySelector(`.game__tile[data-column='${y}'][data-row='${parseInt(x)-1}']`);
    let tile2 = document.querySelector(`.game__tile[data-column='${y}'][data-row='${parseInt(x)+1}']`);
    let tile3 = document.querySelector(`.game__tile[data-column='${parseInt(y)-1}'][data-row='${x}']`);
    let tile4 = document.querySelector(`.game__tile[data-column='${parseInt(y)+1}'][data-row='${x}']`);
    
    //test l'existence des cases pour éviter erreurs
    if (tile1 && !player.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.contains('game__wall--clicked')){
      
      tile1.classList.add('game__tile--accessible');
    }
    if (tile2 && !player.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.contains('game__wall--clicked')){
      
      tile2.classList.add('game__tile--accessible');
    }
    if (tile3 && !player.parentElement.previousElementSibling.classList.contains('game__wall--clicked')){
      tile3.classList.add('game__tile--accessible');
    }
    if (tile4 && !player.parentElement.nextElementSibling.classList.contains('game__wall--clicked')){
      tile4.classList.add('game__tile--accessible');
    }
  }
  
  //Gère le mouvement
  function move(player,tile){
    let i = 1;
    let sens ='';
    if (parseInt(player.parentElement.dataset.row)>parseInt(tile.dataset.row)){
      sens = '-y';
    }
    else if (parseInt(player.parentElement.dataset.row)<parseInt(tile.dataset.row)){
      sens = '+y';
    }
    else if (parseInt(player.parentElement.dataset.column)>parseInt(tile.dataset.column)){
     sens = '-x';
   }
   else if (parseInt(player.parentElement.dataset.column)<parseInt(tile.dataset.column)){
     sens = '+x';
   }
    let slider = setInterval(function(){
    
       slide(i, sens);
       i++;
       if (i>67){
        clearInterval(slider);
      }
     }
       , 10);
    //gestion de l'animation de slide
    function slide(i,sens){
      //gère la direction du slide
      switch (sens) {
        case '+x':
          i++;
          player.style.transform = `translateX(${i}px)`;
          break;
        case '-x':
          i--;
          player.style.transform = `translateX(-${i}px)`;
          break;
        case '+y':
          i++;
          player.style.transform = `translateY(${i}px)`;
          break;
        case '-y':
          i--;
          player.style.transform = `translateY(-${i}px)`;
        break;
      }
      //les deux setTimeout suivant intervertissent la position du personnage de la "fausse" à la "vraie" case en 10ms
      setTimeout(function () {
        player.style.transform = `translate(0px, 0px)`
      }, 990);
    }
    
    setTimeout(function () {
      //
      tile.appendChild(player);
      //Vérifie la victoire
      if (player1.parentNode.dataset.column == 9) {
          oxo.screens.loadScreen('end');
      }
      if (player2.parentNode.dataset.column == 1) {
          oxo.screens.loadScreen('end');
      };
    }, 1000);

    //Retire les cases accessibles
    let accessibleTiles = document.querySelectorAll('.game__tile.game__tile--accessible');
    accessibleTiles.forEach(element => {
      element.classList.remove('game__tile--accessible');
    });

    return true;
  }

  //GESTION DU CLIC
  function clickHandler(clicked) {
    
    if (turn === 'player1') {
      if (clicked.firstElementChild == player1) {
        checkAround(player1);
      }
      else if (clicked.classList.contains('game__tile--accessible')) {
        move(player1, clicked);
        
        //change le tour
        if (move(player1, clicked)) {
          turn = 'player2';
        }
      }
    }
    if (turn === 'player2') {
      if (clicked.firstElementChild == player2) {
        checkAround(player2);
      }
      else if (clicked.classList.contains('game__tile--accessible')) {
        move(player2, clicked);
        
        if (move(player2, clicked)) {
          turn = 'player1';
        }
      }
    }
  }
  initGame();
}
