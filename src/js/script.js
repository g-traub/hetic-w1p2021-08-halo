function credits() {
  let credits = document.querySelector(".credits");
  document
    .querySelector(".button__credits")
    .addEventListener("click", function() {
      credits.style.display = "flex";
    });
  //Ajouter le truc pour fermer
  document
    .querySelector(".credits__exit")
    .addEventListener("click", function() {
      credits.style.display = "none";
    });
}

function musicHandler() {
  //Gestion du son
  let playPromise = document.querySelector("#audioPlayer").play();
  let soundOn = document.querySelector(".footer__soundOn");
  let soundOff = document.querySelector(".footer__soundOff");

  if (playPromise !== undefined) {
    playPromise
      .then(function() {
        soundOff.style.display = "none";
        soundOn.style.display = "block";
      })
      .catch(function(error) {});
  }

  soundOn.addEventListener("click", function() {
    soundOn.style.display = "none";
    soundOff.style.display = "block";
    document.querySelector("#audioPlayer").pause();
  });
  soundOff.addEventListener("click", function() {
    soundOff.style.display = "none";
    soundOn.style.display = "block";
    document.querySelector("#audioPlayer").play();
  });
}

let winner;

oxo.screens.loadScreen("home", initHome);

let selectedPlayer1;
let selectedPlayer2;

function initHome() {
  let count;
  let startButton = document.querySelector(".button__start");
  let mortys = document.querySelectorAll(".select__morty");

  musicHandler();
  credits();

  //Gestion des règles
  let rules = document.querySelector(".rules");
  document
    .querySelector(".button__rules")
    .addEventListener("click", function() {
      rules.style.display = "flex";
    });
  document.querySelector(".rules__exit").addEventListener("click", function() {
    rules.style.display = "none";
  });

  startButton.addEventListener("mouseover", function() {
    let count = 0;
    counter = setInterval(function() {
      count++;
      if (count === 5) {
        document.querySelector(".easteregg__rick").classList.add("easteregg__rick--visible");
      }
    }, 1000);
  });
  startButton.addEventListener("mouseout", function() {
    clearInterval(counter);
    document.querySelector(".easteregg__rick").classList.remove("easteregg__rick--visible");
  });

  //Gestion du carousel pour les règles
  var index = 0;
  let arrowLeft = document.querySelector(".rules__arrow--left");
  let arrowRight = document.querySelector(".rules__arrow--right");
  let list = document.querySelectorAll(".rules__rule");
  let dots = document.querySelectorAll(".dot");

  function navigation(index) {
    arrowLeft.classList.toggle("arrow--hidden", index === 0);
    arrowRight.classList.toggle("arrow--hidden", index === 3);

    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.remove("dot--active");
    }
    dots[index].classList.add("dot--active");
  }

  function jump(to) {
    list[index].classList.remove("rule--visible");
    index = to;
    if (index > 3) index = 3;
    if (index < 0) index = 0;
    list[index].classList.add("rule--visible");
    navigation(index);
  }

  arrowLeft.addEventListener("click", function() {
    jump(index - 1);
  });
  arrowRight.addEventListener("click", function() {
    jump(index + 1);
  });

  for (let i = 0; i < dots.length; i++) {
    dots[i].addEventListener("click", function() {
      jump(i);
    });
  }
  navigation(0);

  //Gestion choix des persos
  function mortysEvent(e) {
    e.target.classList.add("select__morty--blocked");
    let player = document.querySelector(".select__player").innerHTML;
    if (player == "Player 1") {
      selectedPlayer1 = e.target.name;
      e.target.removeEventListener("click", mortysEvent);
      document.querySelector(".select__player").innerHTML = "Player 2";
    } else {
      selectedPlayer2 = e.target.name;
      e.target.removeEventListener("click", mortysEvent);
      e.target;
      document.querySelector(".select__player").style.visibility = "hidden";
      startButton.classList.remove("button__start--inactive");
      startButton.classList.add("button__start--active");
      startButton.addEventListener("click", function() {
        clearInterval(counter);
        oxo.screens.loadScreen("game", game);
      });
    }
  }

  mortys.forEach(element => {
    element.addEventListener("click", mortysEvent);
  });
}

function game() {
  musicHandler();
  let intervalRick = setInterval(function(){
    let random = Math.floor(Math.random() * ( 6 - 1 +1)) + 1;
    document.getElementById(`${random}`).play();
  },
  10000)
  //Listener de la flèche
  document
    .querySelector(".backButton__img")
    .addEventListener("click", function() {
      clearInterval(intervalRick);
      oxo.screens.loadScreen("home", initHome);
    });

  //Gère la selection des personnage
  let player1Picture = document.querySelector(".player1__picture");
  let player2Picture = document.querySelector(".player2__picture");

  function characterSelection(selected, player) {
    switch (selected) {
      case "morty":
        player.classList.add("morty");
        break;
      case "roux":
        player.classList.add("red");
        break;
      case "martien":
        player.classList.add("martien");
        break;
      case "choubab":
        player.classList.add("choubab");
        break;
    }
  }

  characterSelection(selectedPlayer1, player1Picture);
  characterSelection(selectedPlayer2, player2Picture);

  //Joueur 1 joue en premier
  let turn = "player1";

  let player1 = document.querySelector(".player1");
  let player2 = document.querySelector(".player2");

  const tiles = document.querySelectorAll(".game__tile");
  const walls = document.querySelectorAll(".game__wall");

  function changeTurn() {
    setTimeout(function() {
    timer = 31;      
      if (turn === "player1") {
        turn = "player2";
        player2.classList.add("--playing");
        player1.classList.remove("--playing");
      } else {
        turn = "player1";
        player1.classList.add("--playing");
        player2.classList.remove("--playing");
      }
      let accessibleTiles = document.querySelectorAll(
        ".game__tile.game__tile--accessible"
      );
      accessibleTiles.forEach(element => {
        element.classList.remove("game__tile--accessible");
      }); 
    }, 900);
  }

  var timer;
  var timeLeft;
  let timerDisplay = document.querySelector(".timer__number");

  timer = 30;
  timerDisplay.innerHTML = timer;

  timeLeft = setInterval(function() {
    if  (timer > 0){
      timer--;
    }
    else {
      changeTurn();
    }
    timerDisplay.innerHTML = timer;
  }, 1000);

  function initGame() {
    let row = 1;
    let column = 1;
    vertical = true;

    //numérote les cases
    tiles.forEach(element => {
      element.addEventListener("click", function() {
        clickHandler(element);
      });
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
    });

    row = 1;
    column = 1;
    //numérote les cases murs
    walls.forEach(item => {
      // vertical permet de changer le nombre de colonnes qui n'est pas le même d'une ligne a l'autre.
      if (vertical) {
        item.classList.add("game__wall--vertical");
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
        item.classList.add("game__wall--horizontal");
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

    let tileAbove = document.querySelector(
      `.game__tile[data-column='${y}'][data-row='${parseInt(x) - 1}']`
    );
    let tileBeneath = document.querySelector(
      `.game__tile[data-column='${y}'][data-row='${parseInt(x) + 1}']`
    );
    let tileLeft = document.querySelector(
      `.game__tile[data-column='${parseInt(y) - 1}'][data-row='${x}']`
    );
    let tileRight = document.querySelector(
      `.game__tile[data-column='${parseInt(y) + 1}'][data-row='${x}']`
    );

    //test l'existence des cases pour éviter erreurs
    if (
      tileAbove &&
      !player.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.contains(
        "game__wall--clicked"
      )
    ) {
      if (tileAbove.firstElementChild != null) {
        let tileAboveX = tileAbove.dataset.row;
        let tileAboveY = tileAbove.dataset.column;
        document
          .querySelector(
            `.game__tile[data-column='${tileAboveY}'][data-row='${parseInt(
              tileAboveX
            ) - 1}']`
          )
          .classList.add("game__tile--accessible");
        document
          .querySelector(
            `.game__tile[data-column='${tileAboveY}'][data-row='${parseInt(
              tileAboveX
            ) - 1}']`
          )
          .classList.add("--special");
      } else {
        tileAbove.classList.add("game__tile--accessible");
      }
    }
    if (
      tileBeneath &&
      !player.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.contains(
        "game__wall--clicked"
      )
    ) {
      if (tileBeneath.firstElementChild != null) {
        let tileBeneathX = tileBeneath.dataset.row;
        let tileBeneathY = tileBeneath.dataset.column;
        document
          .querySelector(
            `.game__tile[data-column='${tileBeneathY}'][data-row='${parseInt(
              tileBeneathX
            ) + 1}']`
          )
          .classList.add("game__tile--accessible");
        document
          .querySelector(
            `.game__tile[data-column='${tileBeneathY}'][data-row='${parseInt(
              tileBeneathX
            ) + 1}']`
          )
          .classList.add("--special");
      } else {
        tileBeneath.classList.add("game__tile--accessible");
      }
    }
    if (
      tileLeft &&
      !player.parentElement.previousElementSibling.classList.contains(
        "game__wall--clicked"
      )
    ) {
      if (tileLeft.firstElementChild != null) {
        let tileLeftX = tileLeft.dataset.row;
        let tileLeftY = tileLeft.dataset.column;
        document
          .querySelector(
            `.game__tile[data-column='${parseInt(tileLeftY) -
              1}'][data-row='${tileLeftX}']`
          )
          .classList.add("game__tile--accessible");
        document
          .querySelector(
            `.game__tile[data-column='${parseInt(tileLeftY) -
              1}'][data-row='${tileLeftX}']`
          )
          .classList.add("--special");
      } else {
        tileLeft.classList.add("game__tile--accessible");
      }
    }
    if (
      tileRight &&
      !player.parentElement.nextElementSibling.classList.contains(
        "game__wall--clicked"
      )
    ) {
      if (tileRight.firstElementChild != null) {
        let tileRightX = tileRight.dataset.row;
        let tileRightY = tileRight.dataset.column;
        document
          .querySelector(
            `.game__tile[data-column='${parseInt(tileRightY) +
              1}'][data-row='${tileRightX}']`
          )
          .classList.add("game__tile--accessible");
        document
          .querySelector(
            `.game__tile[data-column='${parseInt(tileRightY) +
              1}'][data-row='${tileRightX}']`
          )
          .classList.add("--special");
      } else {
        tileRight.classList.add("game__tile--accessible");
      }
    }
  }

  function sandbox(player) {
    let countOut = 0; //arrête l'algo si >404
    let direction = 0; //teste une direction selon sa valeur

    let x = player1.parentElement.dataset.row;
    let y = player1.parentElement.dataset.column;

    if (turn == "player2") {
      x = player2.parentElement.dataset.row;
      y = player2.parentElement.dataset.column;
    }

    let tileAbove = document.querySelector(
      `.game__tile[data-column='${y}'][data-row='${parseInt(x) - 1}']`
    );
    let tileBeneath = document.querySelector(
      `.game__tile[data-column='${y}'][data-row='${parseInt(x) + 1}']`
    );
    let tileLeft = document.querySelector(
      `.game__tile[data-column='${parseInt(y) - 1}'][data-row='${x}']`
    );
    let tileRight = document.querySelector(
      `.game__tile[data-column='${parseInt(y) + 1}'][data-row='${x}']`
    );
    let currentTile = document.querySelector(
      `.game__tile[data-column='${y}'][data-row='${x}']`
    );

    function update() {
      //Met a jour la vérification des tuiles
      tileAbove = document.querySelector(
        `.game__tile[data-column='${y}'][data-row='${parseInt(x) - 1}']`
      );
      tileBeneath = document.querySelector(
        `.game__tile[data-column='${y}'][data-row='${parseInt(x) + 1}']`
      );
      tileLeft = document.querySelector(
        `.game__tile[data-column='${parseInt(y) - 1}'][data-row='${x}']`
      );
      tileRight = document.querySelector(
        `.game__tile[data-column='${parseInt(y) + 1}'][data-row='${x}']`
      );
      currentTile = document.querySelector(
        `.game__tile[data-column='${y}'][data-row='${x}']`
      );
    }

    function checkAbove() {
      //if true: dispo
      if (
        x < 9 &&
        tileAbove &&
        !currentTile.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.contains(
          "game__wall--clicked"
        )
      ) {
        return true;
      } else {
        return false;
      }
    }

    function checkBeneath() {
      if (
        x > 0 &&
        tileBeneath &&
        !currentTile.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.contains(
          "game__wall--clicked"
        )
      ) {
        return true;
      } else {
        return false;
      }
    }

    function checkLeft() {
      if (
        tileLeft &&
        !currentTile.previousElementSibling.classList.contains(
          "game__wall--clicked"
        )
      ) {
        return true;
      } else {
        return false;
      }
    }

    function checkRight() {
      if (
        tileRight &&
        !currentTile.nextElementSibling.classList.contains(
          "game__wall--clicked"
        )
      ) {
        return true;
      } else {
        return false;
      }
    }

    /* function success() { //check si possible d'atteindre l'opposé
    if (y == 9) {
      return true;
      } else {
        return false;
      }
    } */

    function mazeSolver() {
      if (turn === "player2") {
        while (y !== 1 && countOut < 404) {
          // to recursive switch

          switch (direction) {
            case 0:
              if (checkLeft(player)) {
                y--;
                update();
                countOut++;
                break;
              } else {
                direction++;
                countOut++;
                break;
              }
            case 1:
              if (checkLeft(player)) {
                y--;
                update();
                direction--;
                countOut++;
                break;
              } else if (checkAbove(player)) {
                x--;
                update();
                countOut++;
                break;
              } else {
                countOut++;
                direction++;
                break;
              }

            case 2:
              if (checkAbove(player)) {
                x--;
                update();
                direction--;
                countOut++;
                break;
              } else if (checkRight(player)) {
                y++;
                update();
                countOut++;
                break;
              } else {
                direction++;
                countOut++;
                break;
              }
            case 3:
              if (checkRight(player)) {
                y++;
                update();
                direction--;
                countOut++;
                break;
              } else if (checkBeneath(player)) {
                x++;
                update();
                countOut++;
                break;
              } else {
                direction++;
                break;
              }
            case 4:
              if (checkLeft(player)) {
                y--;
                update();
                break;
              } else if (checkBeneath()) {
                x++;
                update();
                direction--;
                break;
              } else {
                return true;
              }
          } //switch end
        } //while end
      } // if end
      else {
        while (y !== 9 && countOut < 404) {
          // to recursive switch
          switch (direction) {
            case 0:
              if (checkRight(player)) {
                y++;
                update();
                countOut++;
                break;
              } else {
                direction++;
                countOut++;
                break;
              }
            case 1:
              if (checkRight(player)) {
                y++;
                update();
                direction--;
                countOut++;
                break;
              } else if (checkAbove(player)) {
                x--;
                update();
                countOut++;
                break;
              } else {
                countOut++;
                direction++;
                break;
              }

            case 2:
              if (checkAbove(player)) {
                x--;
                update();
                direction--;
                countOut++;
                break;
              } else if (checkLeft(player)) {
                y--;
                update();
                countOut++;
                break;
              } else {
                direction++;
                countOut++;
                break;
              }
            case 3:
              if (checkLeft(player)) {
                y--;
                update();
                direction--;
                countOut++;
                break;
              } else if (checkBeneath(player)) {
                x++;
                update();
                countOut++;
                break;
              } else {
                direction++;
                break;
              }
            case 4:
              if (checkRight(player)) {
                y++;
                update();
                break;
              } else if (checkBeneath()) {
                x++;
                update();
                direction--;
                break;
              } else {
                return true;
              }
          } //switch end
        } //while end
      }
    } //mazeSolver end

    mazeSolver();
    if (mazeSolver()) {
      return true;
    } else {
      return false;
    }
  } //sandbox end

  //Gère le mouvement
  function move(player, tile, mouvement) {
    let i = 1;
    let sens = "";
    if (
      parseInt(player.parentElement.dataset.row) > parseInt(tile.dataset.row)
    ) {
      sens = "-y";
    } else if (
      parseInt(player.parentElement.dataset.row) < parseInt(tile.dataset.row)
    ) {
      sens = "+y";
    } else if (
      parseInt(player.parentElement.dataset.column) >
      parseInt(tile.dataset.column)
    ) {
      sens = "-x";
    } else if (
      parseInt(player.parentElement.dataset.column) <
      parseInt(tile.dataset.column)
    ) {
      sens = "+x";
    }
    if (mouvement == "walk") {
      let slider = setInterval(function() {
        slide(i, sens);
        i++;
        if (i > 67) {
          clearInterval(slider);
        }
      }, 10);
      //gestion de l'animation de slide
      function slide(i, sens) {
        //gère la direction du slide
        switch (sens) {
          case "+x":
            i++;
            player.style.transform = `translateX(${i}px)`;
            break;
          case "-x":
            i--;
            player.style.transform = `translateX(-${i}px)`;
            break;
          case "+y":
            i++;
            player.style.transform = `translateY(${i}px)`;
            break;
          case "-y":
            i--;
            player.style.transform = `translateY(-${i}px)`;
            break;
        }
        //les deux setTimeout suivant intervertissent la position du personnage de la "fausse" à la "vraie" case en 10ms
        setTimeout(function() {
          player.style.transform = `translate(0px, 0px)`;
        }, 990);
      }

      setTimeout(function() {
        //
        tile.appendChild(player);
        //Vérifie la victoire
        if (player1.parentNode.dataset.column == 9) {
          winner = "Player 1";
          clearInterval(counter);
          oxo.screens.loadScreen("end", initEnd);
        }
        if (player2.parentNode.dataset.column == 1) {
          winner = "Player 2";
          clearInterval(counter);
          oxo.screens.loadScreen("end", initEnd);
        }
      }, 1000);
    } else if (mouvement == "jump") {
      switch (sens) {
        case "+x":
          player.classList.add("--jumpRight");
          player.style.zIndex = 1;
          setTimeout(function() {
            player.style.transform = "translate(0,0)";
            tile.appendChild(player);
            player.classList.remove("--jumpRight");
          }, 820);
          break;
        case "-x":
          player.classList.add("--jumpLeft");
          setTimeout(function() {
            player.style.transform = "translate(0,0)";
            tile.appendChild(player);
            player.classList.remove("--jumpLeft");
          }, 820);
          break;
        case "+y":
          player.classList.add("--jumpDown");
          setTimeout(function() {
            player.style.transform = "translate(0,0)";
            tile.appendChild(player);
            player.classList.remove("--jumpDown");
          }, 820);
          break;
        case "-y":
          player.classList.add("--jumpUp");
          setTimeout(function() {
            player.style.zIndex = 1;
            player.classList.remove("--jumpUp");
            player.style.transform = "translate(0,0)";
            tile.appendChild(player);
          }, 820);
          break;
      }
    }

    //Retire les cases accessibles
    let accessibleTiles = document.querySelectorAll(
      ".game__tile.game__tile--accessible"
    );
    accessibleTiles.forEach(element => {
      element.classList.remove("game__tile--accessible");
      element.classList.remove("--special");
    });

    return true;
  }
  //Gère le placement des murs

  function placeWalls() {
    for (let i = 0; i < walls.length; i++) {
      let wall = walls[i];
      let testRow = wall.dataset.row;
      let testColumn = wall.dataset.column;

      //True = pas de collisions
      function collide() {
        if (
          wall.classList.contains("game__wall--clicked") ||
          wall.dataset.row > 16 ||
          wall.dataset.column > 8
        ) {
          return false;
        }
        //Lignes
        if (wall.dataset.row % 2 == 0) {
          if (
            walls[i - 8].classList.contains("game__wall--clicked") &&
            walls[i + 9].classList.contains("game__wall--clicked")
          ) {
            return false;
          } else if (walls[i + 1].classList.contains("game__wall--clicked")) {
            return false;
          } else {
            return true;
          }
        } else {
          // Colonnes
          if (
            walls[i + 8].classList.contains("game__wall--clicked") &&
            walls[i + 9].classList.contains("game__wall--clicked")
          ) {
            return false;
          } else if (walls[i + 17].classList.contains("game__wall--clicked")) {
            return false;
          } else {
            return true;
          }
        }
      }

      function hover() {
        wall.addEventListener("mouseover", function() {
          if (collide()) {
            if (wall.dataset.column > 8) {
              wall.classList.add("--hover");
              walls[i - 1].classList.add("--hover");
            } else if (wall.dataset.row > 16) {
              wall.classList.add("--hover");
              walls[i - 17].classList.add("--hover");
            }

            if (!wall.classList.contains("game__wall--clicked")) {
              //fonctionnement collide (éviter le double modificateur)
              wall.classList.add("--hover");
              if (wall.dataset.row % 2 == 0) {
                // Permet de savoir si il s'agit d'un mur vertical ou horizontal
                walls[i + 1].classList.add("--hover");
              } else {
                walls[i + 17].classList.add("--hover");
              }
            }
          }
        });

        wall.addEventListener("mouseout", function() {
          if (collide()) {
            if (wall.dataset.column > 8) {
              wall.classList.remove("--hover");
              walls[i - 1].classList.remove("--hover");
            } else if (wall.dataset.row > 16) {
              wall.classList.remove("--hover");
              walls[i - 17].classList.remove("--hover");
            }
            wall.classList.remove("--hover");
            if (wall.dataset.row % 2 == 0) {
              // Permet de savoir si il s'agit d'un mur vertical ou horizontal
              walls[i + 1].classList.remove("--hover");
            } else {
              walls[i + 17].classList.remove("--hover");
            }
          }
        });
      }

      function click() {
        wall.addEventListener("click", function() {
          if (collide()) {
            if (wall.dataset.column > 8) {
              wall.classList.add("game__wall--clicked");
              walls[i - 1].classList.add("game__wall--clicked");
            } else if (wall.dataset.row > 16) {
              wall.classList.add("game__wall--clicked");
              walls[i - 17].classList.add("game__wall--clicked");
            }

            wall.classList.add("game__wall--clicked");
            wall.classList.remove("--hover");

            if (wall.dataset.row % 2 == 0) {
              walls[i + 1].classList.add("game__wall--clicked");
              walls[i + 1].classList.remove("--hover");
            } else {
              walls[i + 17].classList.add("game__wall--clicked");
              walls[i + 17].classList.remove("--hover");
            }
            changeTurn();
            sandbox();
            if (sandbox(player1) == true) {
              wall.classList.remove("game__wall--clicked");
              alert("impo..po...possible Morty!");
            }
          }
        });
      }
      click();
      hover();
    }
  }
  placeWalls();

  //GESTION DU CLIC
  function clickHandler(clicked) {
    if (turn === "player1") {
      if (clicked.firstElementChild == player1) {
        checkAround(player1);
        for (i = 0; i < walls.length; i++) {
          walls[i].classList.remove("--hover");
        }
      } else if (clicked.classList.contains("game__tile--accessible")) {
        if (clicked.classList.contains("--special")) {
          move(player1, clicked, "jump");
        }
        move(player1, clicked, "walk");

        //change le tour
        if (move(player1, clicked, "walk")) {
          changeTurn();
        }
      } else {
        let accessibleTiles = document.querySelectorAll(
          ".game__tile.game__tile--accessible"
        );
        accessibleTiles.forEach(element => {
          element.classList.remove("game__tile--accessible");
        });
      }
    }
    if (turn === "player2") {
      if (clicked.firstElementChild == player2) {
        checkAround(player2);
      } else if (clicked.classList.contains("game__tile--accessible")) {
        if (clicked.classList.contains("--special")) {
          move(player2, clicked, "jump");
        }
        move(player2, clicked, "walk");

        if (move(player2, clicked, "walk")) {
          changeTurn();
        }
      }
    }
  }
  initGame();
}

function initEnd() {
  musicHandler();
  credits();
  document.querySelector(".end__winner").innerHTML += winner;
  document
    .querySelector(".button__restart")
    .addEventListener("click", function() {
      oxo.screens.loadScreen("game", game);
    });
  document.querySelector(".button__menu").addEventListener("click", function() {
    oxo.screens.loadScreen("home", initHome);
  });
}
