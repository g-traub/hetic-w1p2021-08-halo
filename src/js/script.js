oxo.screens.loadScreen('game', game);

function game() {
  //Joueur 1 joue en premier
  let turn = 'player1';
  
  let player1 = document.querySelector('.player1');
  let player2 = document.querySelector('.player2');
  const tiles = document.querySelectorAll('.game__tile');
  const walls = document.querySelectorAll('.game__wall');

  function initGame() {
    let row = 1;
    let column = 1;
    vertical = true;

    //numérote les cases
    tiles.forEach(element => {
      /* let random = Math.floor(Math.random() * ( 5 - 1 +1)) + 1;
      element.classList.add(`tile${random}`); */
      element.addEventListener('click', function () {
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

    row = 1;
    column = 1;
    //numérote les cases murs
    walls.forEach(item => {
      // vertical permet de changer le nombre de colonnes qui n'est pas le même d'une ligne a l'autre.
      if (vertical) {
        item.classList.add('game__wall--vertical');
        if (column < 8) {
          item.dataset.column = column;
          column++;
          item.dataset.row = row;
        } else {
          item.dataset.column = column;
          item.dataset.row = row;
          column = 1;
          row++;
          vertical = false;
        }
      } else {
        item.classList.add('game__wall--horizontal');
        if (column < 9) {
          item.dataset.column = column;
          column++;
          item.dataset.row = row;
        } else {
          item.dataset.column = column;
          item.dataset.row = row;
          column = 1;
          row++;
          vertical = true;
        }
      }
    });
  }

  //Vérifie l'accessibilité des cases autour du personnage
  function checkAround(player) {
    let x = player.parentElement.dataset.row;
    let y = player.parentElement.dataset.column;

    let tileAbove = document.querySelector(`.game__tile[data-column='${y}'][data-row='${parseInt(x) - 1}']`);
    let tileBeneath = document.querySelector(`.game__tile[data-column='${y}'][data-row='${parseInt(x) + 1}']`);
    let tileLeft = document.querySelector(`.game__tile[data-column='${parseInt(y) - 1}'][data-row='${x}']`);
    let tileRight = document.querySelector(`.game__tile[data-column='${parseInt(y) + 1}'][data-row='${x}']`);

    //test l'existence des cases pour éviter erreurs
    if (tileAbove && !player.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.contains('game__wall--clicked')) {
      if (tileAbove.firstElementChild != null) {
        let tileAboveX = tileAbove.dataset.row;
        let tileAboveY = tileAbove.dataset.column;
        document.querySelector(`.game__tile[data-column='${tileAboveY}'][data-row='${parseInt(tileAboveX) - 1}']`).classList.add('game__tile--accessible');
        document.querySelector(`.game__tile[data-column='${tileAboveY}'][data-row='${parseInt(tileAboveX) - 1}']`).classList.add('--special');
      } else {
        tileAbove.classList.add('game__tile--accessible');
      }
    }
    if (tileBeneath && !player.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.contains('game__wall--clicked')) {
      if (tileBeneath.firstElementChild != null) {
        let tileBeneathX = tileBeneath.dataset.row;
        let tileBeneathY = tileBeneath.dataset.column;
        document.querySelector(`.game__tile[data-column='${tileBeneathY}'][data-row='${parseInt(tileBeneathX) + 1}']`).classList.add('game__tile--accessible');
        document.querySelector(`.game__tile[data-column='${tileBeneathY}'][data-row='${parseInt(tileBeneathX) + 1}']`).classList.add('--special');
      }
      else {
        tileBeneath.classList.add('game__tile--accessible');
      }
    }
    if (tileLeft && !player.parentElement.previousElementSibling.classList.contains('game__wall--clicked')) {
      if (tileLeft.firstElementChild != null) {
        let tileLeftX = tileLeft.dataset.row;
        let tileLeftY = tileLeft.dataset.column;
        document.querySelector(`.game__tile[data-column='${parseInt(tileLeftY) - 1}'][data-row='${tileLeftX}']`).classList.add('game__tile--accessible');
        document.querySelector(`.game__tile[data-column='${parseInt(tileLeftY) - 1}'][data-row='${tileLeftX}']`).classList.add('--special');
      }
      else {
        tileLeft.classList.add('game__tile--accessible')
      }
    }
    if (tileRight && !player.parentElement.nextElementSibling.classList.contains('game__wall--clicked')) {
      if (tileRight.firstElementChild != null) {
        let tileRightX = tileRight.dataset.row;
        let tileRightY = tileRight.dataset.column;
        document.querySelector(`.game__tile[data-column='${parseInt(tileRightY) + 1}'][data-row='${tileRightX}']`).classList.add('game__tile--accessible');
        document.querySelector(`.game__tile[data-column='${parseInt(tileRightY) + 1}'][data-row='${tileRightX}']`).classList.add('--special');
      }
      else {
        tileRight.classList.add('game__tile--accessible');
      }
    }
  }

  //Gère le mouvement
  function move(player, tile, mouvement) {
    let i = 1;
    let sens = '';
    if (parseInt(player.parentElement.dataset.row) > parseInt(tile.dataset.row)) {
      sens = '-y';
    }
    else if (parseInt(player.parentElement.dataset.row) < parseInt(tile.dataset.row)) {
      sens = '+y';
    }
    else if (parseInt(player.parentElement.dataset.column) > parseInt(tile.dataset.column)) {
      sens = '-x';
    }
    else if (parseInt(player.parentElement.dataset.column) < parseInt(tile.dataset.column)) {
      sens = '+x';
    }
    if (mouvement == 'walk') {
      let slider = setInterval(function () {

        slide(i, sens);
        i++;
        if (i > 67) {
          clearInterval(slider);
        }
      }
        , 10);
      //gestion de l'animation de slide
      function slide(i, sens) {
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
    }
    else if (mouvement == 'jump') {
      switch (sens) {
        case '+x':
          player.classList.add('--jumpRight');
          player.style.zIndex = 1;
          setTimeout(function () {
            player.style.transform = 'translate(0,0)';
            tile.appendChild(player);
            player.classList.remove('--jumpRight');
          },
            820);
          break;
        case '-x':
          player.classList.add('--jumpLeft');
          setTimeout(function () {
            player.style.transform = 'translate(0,0)';
            tile.appendChild(player);
            player.classList.remove('--jumpLeft');
          },
            820);
          break;
        case '+y':
          player.classList.add('--jumpDown');
          setTimeout(function () {
            player.style.transform = 'translate(0,0)';
            tile.appendChild(player);
            player.classList.remove('--jumpDown');
          },
            820);
          break;
        case '-y':
          player.classList.add('--jumpUp');
          setTimeout(function () {
            player.style.zIndex = 1;
            player.classList.remove('--jumpUp');
            player.style.transform = 'translate(0,0)';
            tile.appendChild(player);
          },
            820);
          break;
      }
    }

    //Retire les cases accessibles
    let accessibleTiles = document.querySelectorAll('.game__tile.game__tile--accessible');
    accessibleTiles.forEach(element => {
      element.classList.remove('game__tile--accessible');
      element.classList.remove('--special');
    });

    return true;
  }
  //Gère le placement des murs

  for (let i = 0; i < walls.length; i++) {
    let wall = walls[i];
    let testRow = wall.dataset.row;
    let testColumn = wall.dataset.column;

    //True = pas de collisions
    function collide() {
      if (wall.classList.contains('game__wall--clicked') || wall.dataset.row > 16 || wall.dataset.column > 8) {
        return false;
      }
      //Lignes
      if (wall.dataset.row % 2 == 0) {
        if (walls[i - 8].classList.contains('game__wall--clicked') && walls[i + 9].classList.contains('game__wall--clicked')) {
          return false;
        }
        else if (walls[i + 1].classList.contains('game__wall--clicked')) {
          return false;
        }
        else {
          return true;
        }
      } else { // Colonnes
        if (walls[i + 8].classList.contains('game__wall--clicked') && (walls[i + 9].classList.contains('game__wall--clicked'))) {
          return false;
        }
        else if (walls[i + 17].classList.contains('game__wall--clicked')) {
          return false;
        }
        else {
          return true;
        }
      }
    }

    function hover() {
      wall.addEventListener('mouseover', function () {
        if (wall.dataset.column > 8) {
          wall.classList.add('--hover');
          walls[i - 1].classList.add('--hover');
        }
        else if (wall.dataset.row > 16) {
          wall.classList.add('--hover');
          walls[i - 17].classList.add('--hover');

        }
        else if (collide()) {
          if (!wall.classList.contains('game__wall--clicked')) { //fonctionnement collide (éviter le double modificateur)
            wall.classList.add('--hover');
            if (wall.dataset.row % 2 == 0) { // Permet de savoir si il s'agit d'un mur vertical ou horizontal
              walls[i + 1].classList.add('--hover');
            } else {
              walls[i + 17].classList.add('--hover');
            }
          }
        }
      });

      wall.addEventListener('mouseout', function () {
        if (wall.dataset.column > 8) {
          wall.classList.remove('--hover');
          walls[i - 1].classList.remove('--hover');
        }
        else if (wall.dataset.row > 16) {
          wall.classList.remove('--hover');
          walls[i - 17].classList.remove('--hover');

        }
        else if (collide()) {
          wall.classList.remove('--hover');
          if (wall.dataset.row % 2 == 0) { // Permet de savoir si il s'agit d'un mur vertical ou horizontal
            walls[i + 1].classList.remove('--hover');
          } else {
            walls[i + 17].classList.remove('--hover');
          }
        }
      });
    }

    function click() {
      wall.addEventListener('click', function () {
        if (wall.dataset.column > 8) {
          wall.classList.add('game__wall--clicked');
          walls[i - 1].classList.add('game__wall--clicked');
          wall.classList.remove('--hover');
          walls[i - 1].classList.remove('--hover');
        }
        else if (wall.dataset.row > 16) {
          wall.classList.add('game__wall--clicked');
          walls[i - 17].classList.add('game__wall--clicked');
          wall.classList.remove('--hover');
          walls[i - 17].classList.remove('--hover');

        }
        else if (collide()) {
          wall.classList.add('game__wall--clicked');
          wall.classList.remove('--hover');

          if (wall.dataset.row % 2 == 0) {
            walls[i + 1].classList.add('game__wall--clicked');
            walls[i + 1].classList.remove('--hover');

          } else {
            walls[i + 17].classList.add('game__wall--clicked');
            walls[i + 17].classList.remove('--hover');
          }
        }
      });
    };
    click();
    hover();
  }

  //GESTION DU CLIC
  function clickHandler(clicked) {
    if (turn === 'player1') {
      if (clicked.firstElementChild == player1) {
        checkAround(player1);
      }
      else if (clicked.classList.contains('game__tile--accessible')) {
        if (clicked.classList.contains('--special')) {
          move(player1, clicked, 'jump');
        }
        move(player1, clicked, 'walk');

        //change le tour
        if (move(player1, clicked, 'walk')) {
          turn = 'player2';
        }
      }
    }
    if (turn === 'player2') {
      if (clicked.firstElementChild == player2) {
        checkAround(player2);
      }
      else if (clicked.classList.contains('game__tile--accessible')) {
        if (clicked.classList.contains('--special')) {
          move(player2, clicked, 'jump');
        }
        move(player2, clicked, 'walk');

        if (move(player2, clicked, 'walk')) {
          turn = 'player1';
        }
      }
    }
  }
  initGame();
}
