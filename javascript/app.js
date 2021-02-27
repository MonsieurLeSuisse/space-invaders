const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results');
const startMessage = document.querySelector(".start");

let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let laserId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;
let newGame = true;
let paused = false;
let playAgain = false;
let resultChache = '';
let infoVisible = false;
let infoText;

for (let i = 0; i < 225; i++){
    const square = document.createElement('div');
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll('.grid div'));

const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39 
];

function draw() {
    for (let i = 0; i < alienInvaders.length; i++){
        if(!aliensRemoved.includes(i)){
            squares[alienInvaders[i]].classList.add('invader');
            }
    }
}

(function drawGround() {
    for (let i = 210; i < squares.length; i++){
        squares[i].classList.add('ground');
    }
})();

const infoBox = squares[224];
//infoBox.parentNode.replaceChild(info, infoBox);
infoBox.classList.add('info');
const infoImg = document.createElement("img");
infoImg.src = "./images/info.png";
infoImg.classList.add('infoImg');
infoBox.appendChild(infoImg);
//.src = 'info.png';




function showInfo() {
    infoText = infoBox.appendChild(document.createElement("div"));
    infoText.classList.add('infoText');
    infoText.innerHTML = `<h3>Goal</h3><span>Shot all the evil invaders down. If you make it you are a hero, you saved the world! If you fail, may God have mercy on you.</span>
        <h3>Start Game</h3><span>a) Press the RETURN button, or<br/>b) Click on that silly moving text.<br/></span>
        <h3>Control the Defense Ship</h3>
        <span><b>Firing</b>: Press the SPACE key to fire or alterantively use the ARROW - UP key.<br/></span>
        <span><b>Controls</b>: Use the ARROW_LEFT and ARROW-RIGHT keys to navigate the Defense Unit in the right direction.<br/></span>
        <span><b>Pause</b>: Press the CTRL or ALT or SHIFT key, press it again to resume.<br/></span>

        <h3>Credits</h3><ul><li><a href="https://www.youtube.com/channel/UC5DNytAJ6_FISueUfzZCVsw" target="_blank">Ania Kubów</a></li>
        <li><a href="https://en.wikipedia.org/wiki/Tomohiro_Nishikado" target="_blank">Tomohiro Nishikado</a></li>`;
 infoVisible = true;
}

function hideInfo() {
    const infoTextDiv = document.querySelector('.infoText');
    infoTextDiv.parentNode.removeChild(infoTextDiv);
    infoVisible = false;
}



/* If hover event is preferred:
 infoBox.addEventListener("mouseover", showInfo);
infoBox.addEventListener("mouseout", hideInfo); */
infoBox.addEventListener("click", () => {infoVisible ? hideInfo() : showInfo();});



function remove() {
    for (let i = 0; i < alienInvaders.length; i++){
        squares[alienInvaders[i]].classList.remove('invader')
    }
}

function startGame(e) {
    if ((e.key === "Enter" || e.type === "click") && newGame) {
        playAgain ? document.location.reload() : null;
        document.body.contains(startMessage)
         ? startMessage.parentNode.removeChild(startMessage)
         : null;
        draw();
        newGame = false; 
        invadersId = setInterval(moveInvaders, 300);
    }    
}


squares[currentShooterIndex].classList.add('shooter');

function moveShooter(e) {
    if (!playAgain && !document.body.contains(startMessage) && !paused) {
      squares[currentShooterIndex].classList.remove("shooter");
      switch (e.key) {
        case "ArrowLeft":
          if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
          break;
        case "ArrowRight":
          if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
          break;
      }
      squares[currentShooterIndex].classList.add("shooter");
    }
    
}

document.addEventListener('keydown', moveShooter);


function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    remove();

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++){
            alienInvaders[i] += width + 1;
            direction = -1;
            goingRight = false;
        }
    } else if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++){
            alienInvaders[i] += width - 1;
            direction = 1;
            goingRight = true;
        }
    }

    for (let i = 0; i < alienInvaders.length; i++){
        alienInvaders[i] += direction;
    }
    if (!newGame) {
       draw(); 
    }
    
    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        resultsDisplay.innerHTML = "GAME OVER!";
        clearInterval(invadersId);
        newGame = true;
        playAgain = true;
    }

    for (let i = 0; i < alienInvaders.length; i++){
        if (alienInvaders[i] > 208) {
            resultsDisplay.innerHTML = "GAME OVER!";
            clearInterval(invadersId);
            newGame = true;
            playAgain = true;
        }
    }
    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = "YOU WIN";
        clearInterval(invadersId);
        newGame = true;
        playAgain = true;
    }
}



function shoot(e) {
    if (!playAgain && !document.body.contains(startMessage) && !paused) {
      let laserId;
      let currentLaserIndex = currentShooterIndex;
      function moveLaser() {
        squares[currentLaserIndex]
          ? squares[currentLaserIndex].classList.remove("laser")
          : null;
        currentLaserIndex -= width;
        squares[currentLaserIndex]
          ? squares[currentLaserIndex].classList.add("laser")
          : null;

        if (
          squares[currentLaserIndex] &&
          squares[currentLaserIndex].classList.contains("invader")
        ) {
          squares[currentLaserIndex].classList.remove("laser");
          squares[currentLaserIndex].classList.remove("invader");
          squares[currentLaserIndex].classList.add("boom");

          setTimeout(
            () => squares[currentLaserIndex].classList.remove("boom"),
            300
          );
          clearInterval(laserId);
          const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
          aliensRemoved.push(alienRemoved);
          results++;
          resultsDisplay.innerHTML =
            results > 1 ? "HITS: " + results : "HIT: " + results;
        }
      }
      switch (e.key) {
        case "ArrowUp":
          laserId = setInterval(moveLaser, 300);
          break;
        case " ":
          laserId = setInterval(moveLaser, 300);
          break;
      }
    }
}

function pause(e) {
    if (e.key === "Alt" || e.key === "Control" || e.key === "Shift") {
        console.log("Paused: ", paused);
        if (!paused) {
            clearInterval(invadersId);
            paused = true;
            resultChache = resultsDisplay.innerHTML;
            resultsDisplay.innerHTML = "GAME PAUSED";
        } else {
            invadersId = setInterval(moveInvaders, 300);
            paused = false;
            resultsDisplay.innerHTML = resultChache;
        }   
    } 
}


document.addEventListener('keydown', shoot);

document.addEventListener('keydown', pause);
document.addEventListener("keydown", startGame);
startMessage.addEventListener("click", startGame);


function msgClick(e) {
  startMessage.innerHTML =
    "> > > &nbsp; CLICK TO START &nbsp; < < <";
}

function msgStart(e) {
  startMessage.innerHTML = "<span>INSERT COIN or HIT ENTER</span>";
}

startMessage.addEventListener("mouseover", msgClick);
startMessage.addEventListener("mouseout", msgStart);