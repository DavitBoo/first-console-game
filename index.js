import * as readline from 'node:readline/promises';  

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let gameIsOver = false;
let currentPlayer = 'Player X';

let playerXMoves = [
    [0,0,0],
    [0,0,0],
    [0,0,0],
]

let playerOMoves = [
    [0,0,0],
    [0,0,0],
    [0,0,0],
]


async function startGame() {

    while(!gameIsOver) {
        drawGrid(playerXMoves, playerOMoves)
        let response = await rl.question(`${currentPlayer}, please enter your next move: `)
        let [yMove, xMove] = response.split(',').map(x => Number(x));
        
        console.log(`${currentPlayer} entered the value ${response}`)
        // MAIN GAME LOGIC !!
        
        let currentPlayerMoves = currentPlayer === 'Player X'
            ? playerXMoves
            : playerOMoves

        currentPlayerMoves[yMove][xMove] = 1;

        currentPlayer = currentPlayer === 'Player X' ? 'Player O' : 'Player X'; 
    }
}

function drawGrid(xMoves, oMoves){
    drawVerticalLines(xMoves[0], oMoves[0]);
    drawHorizontalLines();
    drawVerticalLines(xMoves[1], oMoves[1]);
    drawHorizontalLines();
    drawVerticalLines(xMoves[2], oMoves[2]);
}

function drawVerticalLines(xMoves, oMoves) {
    let space1char = xMoves[0] ? 'X' : oMoves[0] ? 'O' : ' ';
    let space2char = xMoves[1] ? 'X' : oMoves[1] ? 'O' : ' ';
    let space3char = xMoves[2] ? 'X' : oMoves[2] ? 'O' : ' ';

    console.log(` ${space1char} | ${space2char} | ${space3char} `)
}

function drawHorizontalLines(){
    console.log('---+---+---');
}

startGame();