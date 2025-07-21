const gameCanvas = document.getElementById('gameCanvas');
const currScoreBoard = document.getElementById('currScoreB');
const gameCtx = gameCanvas.getContext('2d');

const holdCanvas = document.getElementById("holdDisplay");
const holdCtx = holdCanvas.getContext('2d');

const nextCanvas = document.getElementById('nextDisplay');
const nextCtx = nextCanvas.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;


gameCanvas.width = COLS * BLOCK_SIZE;
gameCanvas.height = ROWS * BLOCK_SIZE;

holdCanvas.width = 4 * BLOCK_SIZE;
holdCanvas.height = 4 * BLOCK_SIZE;

nextCanvas.width = holdCanvas.width;
nextCanvas.height = holdCanvas.height;

let isPaused = true;
let usedHold = false;
let enteringName = false;
let score = 0;
let levelScore = 0;
let level = 1;
let gameSpeed = 1000;
let holdingBlock;

const board = Array.from({ length: ROWS}, () => Array(COLS).fill(0));

const tetrominoes = {
    I: {
      shape: [
        [1, 1, 1, 1]
      ],
      color: 'cyan'
    },
    O: {
      shape: [
        [1, 1],
        [1, 1]
      ],
      color: 'yellow'
    },
    T: {
      shape: [
        [0, 1, 0],
        [1, 1, 1]
      ],
      color: 'purple'
    },
    S: {
      shape: [
        [0, 1, 1],
        [1, 1, 0]
      ],
      color: 'green'
    },
    Z: {
      shape: [
        [1, 1, 0],
        [0, 1, 1]
      ],
      color: 'red'
    },
    J: {
      shape: [
        [1, 0, 0],
        [1, 1, 1]
      ],
      color: 'blue'
    },
    L: {
      shape: [
        [0, 0, 1],
        [1, 1, 1]
      ],
      color: 'orange'
    }
  };

  
let nextPiece = createTetromino();
gotoNextPiece();

function createTetromino() {
    const keys = Object.keys(tetrominoes);
    const randKey = keys[Math.floor(Math.random() * keys.length)];
    const tetro = tetrominoes[randKey];
    
    const initPos = getBoxPos(tetro.color);

    return {
      shape: tetro.shape,
      color: tetro.color,
      x: initPos[0],
      y: initPos[1]
    };
}

function getBoxPos(color) {
    if (color === 'cyan') {
        return [0, 1.5];
    }else if (color === 'yellow') {
        return [1, 1];
    } else if (color ==='purple' || color ==='green' || color ==='red' || color === 'blue' || color ==='orange') {
        return [0.5, 1];
    }
}

function drawCurrentPiece() {
    const { shape, color, x, y } = currentPiece;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          drawBlock(x + col, y + row, color, gameCtx);
        }
      }
    }
}


function drawHoldingBlock() {
    holdCtx.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
    const { shape, color, x, y } = holdingBlock;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          drawBlock(x + col, y + row, color, holdCtx);
        }
      }
    }
}

function drawNextPiece() {
    const { shape, color, x, y } = nextPiece;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          drawBlock(x + col, y + row, color, nextCtx);
        }
      }
    }
}

function drawBlock(x, y, color, ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#222';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x] !== 0) {
          drawBlock(x, y, board[y][x], gameCtx);
        }
      }
    }
}

function tetrominoTurn() {
    let turnedArr = [];
    for (let x = 0; x< currentPiece.shape[0].length; x++){
        let eachNewRow = [];
        for (let y = currentPiece.shape.length-1; y >=0; y--) {
            eachNewRow.push(currentPiece.shape[y][x]);
        }
        turnedArr.push(eachNewRow);
    }

    currentPiece.shape = turnedArr;

    if(checkIfBlockBelow()) {
        while(checkIfBlockRight()) {
            if(checkIfBlockLeft()){
                currentPiece.y--;
            } else {
                currentPiece.x--;
            }
        }
        currentPiece.x++;
    }
}

function blockFix() {
    const maxY = currentPiece.shape.length;
    const maxX = currentPiece.shape[0].length;

    for (let x = 0; x < maxX; x++) {
        for (let y= 0; y < maxY; y++){
            if (currentPiece.shape[y][x]){
                board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
            }
        }
    }
}
function checkIfBlockBelow(){
    const blockCoords = getCurrCoords();

    for (let entry of blockCoords) {
        const x = entry.x;
        const y = entry.y;
        if (y >= ROWS-1){
            return true;
        } else if (board[y+1][x]) {
            return true;
        }
    }

    return false;
}
function checkIfBlockRight(){
    const blockCoords = getCurrCoords();

    for (let entry of blockCoords) {
        const x = entry.x;
        const y = entry.y;
        if (x >= COLS-1) {
            return true;
        } else if (board[y][x+1]){
            return true;
        }
    }

    return false;
}
function checkIfBlockLeft(){
    const blockCoords = getCurrCoords();

    for (let entry of blockCoords) {
        const x = entry.x;
        const y = entry.y;
        if (x <= 0) {
            return true;
        } else if (board[y][x-1]){
            return true;
        }
    }

    return false;
}

function getCurrCoords() {
    let coords = [];
    for (let x = 0; x < currentPiece.shape[0].length; x++){
        for (let y = 0; y < currentPiece.shape.length; y++){
            if(currentPiece.shape[y][x]) {
                coords.push({y: currentPiece.y + y, x: currentPiece.x + x});
            }
        }
    }

    return coords;
}

function isRowComplete(y) {
    for (let x = 0; x < COLS; x++) {
        if (!board[y][x]) {
            return false;
        }
    }
    return true;
}

function checkForCompletedRows(){
    let completedRows = [];
    const coords = getCurrCoords();

    for (let entry of coords) {
        if(isRowComplete(entry.y) && (!completedRows.includes(entry.y))) {
            completedRows.push(entry.y);
        }
    }
    return completedRows;
}

function removeRow(arr) {
    for (let row of arr) {
        pullRows(row);
    }
}

function pullRows(removeR) {
    for (let y = removeR; y > 0; y--){
        cvRow((y-1), y);
    }

    //clear first row
    for (let x = 0; x < COLS; x++) {
        board[0][x] = 0;
    }
}

function cvRow(copyR, pasteR) {
    for (let x = 0; x < COLS; x++) {
        board[pasteR][x] = board[copyR][x];
    }
}

document.addEventListener('keydown', function(e) {
    if(!enteringName) {
        if(e.key === 'p') {
            if(isPaused) {
                isPaused = false;
                gameLoop();
            } else {
                isPaused = true;
                clearTimeout(dropTimer);
                updateScore();
            }
        } else if(!isPaused) {
            if (e.key ==='ArrowLeft' && !checkIfBlockLeft()) {
                currentPiece.x--;
                drawBoard();
                drawCurrentPiece();
            } else if (e.key === 'ArrowRight' && !checkIfBlockRight()) {
                currentPiece.x++;
                drawBoard();
                drawCurrentPiece();
            } else if (e.key === 'ArrowDown' && !checkIfBlockBelow()) {
                currentPiece.y++;
                drawBoard();
                drawCurrentPiece();
            } else if (e.key === 'ArrowUp'){
                tetrominoTurn();
                drawBoard();
                drawCurrentPiece();
            } else if (e.key === ' '){
                hardDrop();
            } else if (e.key === 'c') {
                if (usedHold){
                    bgBlinkRed();
                }else{
                    holdBlock();
                }
            }
        } else if (e.key ==='r') {
            // emergency warp
            this.location.replace("https://www.github.com");
        }
    }
});

function gameLoop() {
    updateScore();
    if(!isPaused){
        if (isGameOver()){
            if (highScoreTet < score) {
                alert("New High Score! enter your name");
                addNameEnterDiv();
                enteringName = true;
                isPaused = true;
            } else{
                alert("Game Over! final score: " + score);
                resetGame();
            }
        }
        else if (checkIfBlockBelow()){
            blockHitBot();
        }
        else {
            currentPiece.y++;
        }
        drawBoard();
        drawCurrentPiece();
        dropTimer = setTimeout(gameLoop, gameSpeed);
    }
    // requestAnimationFrame(gameLoop); <-- idk how to set up the framerate so lwk pause
}

function hardDrop(){
    clearTimeout(dropTimer);
    while (!checkIfBlockBelow()) {
        currentPiece.y++;
    }
    blockHitBot();
    gameLoop();
}

function blockHitBot(){
    blockFix();
    const completedRows= checkForCompletedRows();
    if(completedRows.length !== 0){
        // remove rows
        removeRow(completedRows);
        score += completedRows.length*10;
        levelScore += completedRows.length*10;

        if(levelScore >= 100){
            levelUp();
            levelScore = 0;
        } else {
            bgBlink();
        }
    }

    gotoNextPiece();
    usedHold = false;
}

function isGameOver(){
    for (let x = 0; x < COLS; x++) {
        if (board[3][x]){
            return true;
        }
    }
    return false;
}

function resetGame(){
    for (let y = 0; y < ROWS; y++){
        for (let x = 0; x < COLS; x++) {
            board[y][x] = 0;
        }
    }
    score = 0;
    levelScore = 0;
    gameSpeed = 1000;
    level= 1;
    holdingBlock = null;
    updateScore();
    updateSBoard();

    holdCtx.clearRect(0, 0,holdCanvas.width, holdCanvas.height);
    drawBoard();
    drawCurrentPiece();
    isPaused = true;
}

function updateScore() {
    currScoreBoard.innerText= "Score: " + score;

    if(isPaused){
        currScoreBoard.innerText +="\n press p to continue the game";
    } else {
        currScoreBoard.innerText += "\n press p to pause the game";
    }

    currScoreBoard.innerText+= "\n level: " + level;
}

function bgBlink(){
    document.getElementById("mainBD").style.backgroundColor = "#888";
    setTimeout(() => {
        document.getElementById("mainBD").style.backgroundColor = "#555";
    }, 100);
}

function bgBlinkRed(){
    document.getElementById("mainBD").style.backgroundColor = "red";
    setTimeout(() => {
        document.getElementById("mainBD").style.backgroundColor = "#555";
    }, 100);
}

function levelUp(){
    document.getElementById("mainBD").style.backgroundColor = "green";
    setTimeout(() => {
        document.getElementById("mainBD").style.backgroundColor = "#555";
    }, 100);
    gameSpeed -= 80;
    level ++;
}

function holdBlock(){
    clearTimeout(dropTimer);
    usedHold =true;
    currentPiece.x = 1;
    currentPiece.y = 1;

    if(holdingBlock){
        const tempBox = currentPiece;
        currentPiece = holdingBlock;
        currentPiece.x = 3;
        currentPiece.y = 0;
        holdingBlock = tempBox;

        //turning block to orig
        holdingBlock.shape = origShape(holdingBlock);
        boxPos = getBoxPos(holdingBlock.color);
        holdingBlock.x = boxPos[0];
        holdingBlock.y = boxPos[1];
    } else {
        holdingBlock = currentPiece;
        // turning block to orig
        holdingBlock.shape = origShape(holdingBlock);
        boxPos = getBoxPos(holdingBlock.color);
        holdingBlock.x = boxPos[0];
        holdingBlock.y = boxPos[1];

        gotoNextPiece();
    }
    drawHoldingBlock();
    gameLoop();
}

function gotoNextPiece(){
    currentPiece = nextPiece;
    currentPiece.x = 3;
    currentPiece.y = 0;
    nextPiece = createTetromino();
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    drawNextPiece();
}

function origShape(inputPiece){
    const keys = Object.keys(tetrominoes);
    for (let tet of keys) {
        if (tetrominoes[tet].color === inputPiece.color){
            return tetrominoes[tet].shape;
        }
    }
}

updateSBoard();