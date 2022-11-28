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
    let currentGameState = RUNNING;

    console.log()
    while(!gameIsOver) {
        
        let response = await rl.question(`${currentPlayer}, please enter your next move: `)
        let [yMove, xMove] = response.split(',').map(x => Number(x));
        
        console.log(`${currentPlayer} entered the value ${response}`)
        // MAIN GAME LOGIC !!
        
        let currentPlayerMoves = currentPlayer === 'Player X'
            ? playerXMoves
            : playerOMoves

        currentPlayerMoves[yMove][xMove] = 1;

        currentPlayer = currentPlayer === 'Player X' ? 'Player O' : 'Player X'; 

        currentGameState = getNextGameState(playerXMoves, playerOMoves);
        gameIsOver = [PLAYER_X_WINS, PLAYER_O_WINS, CATS_GAME].includes(currentGameState);

        console.log()
        drawGrid(playerXMoves, playerOMoves)
        console.log()
    }

    if (currentGameState === PLAYER_X_WINS) {
        console.log('Player X is the winner!')
    }

    if(currentGameState === PLAYER_O_WINS){
        console.log('Player O is the winner!')
    }

    if(currentGameState === CATS_GAME){
        console.log('It\'s a tie!')
    }

    rl.close();
}

const RUNNING = 'RUNNING';
const PLAYER_X_WINS = 'PLAYER_X_WINS';
const PLAYER_O_WINS = 'PLAYER_O_WINS'
const CATS_GAME = 'CATS_GAME'

function getNextGameState(xMoves, oMoves){
    let playerXWins = isHorizontalWin(xMoves) || isVerticalWin(xMoves) || isDiagonalWin(xMoves) || isCornersWin(xMoves) 
    let playerOWins = isHorizontalWin(oMoves) || isVerticalWin(oMoves) || isDiagonalWin(oMoves) || isCornersWin(oMoves)

    if(playerXWins) return PLAYER_X_WINS
    if(playerOWins) return PLAYER_O_WINS
    return RUNNING
}

function isHorizontalWin(moves){
    return moves.some(row => row.every(x => x));
}

function isVerticalWin(moves){
    return [0, 1, 2].some(columnNumber => moves.every(row => row[columnNumber]))
}

function isDiagonalWin(moves) {
   return (moves[0][0]  && moves[1][1] && moves[2][2]) 
    || (moves[2][0]  && moves[1][1] && moves[0][2]) 

}

function isCornersWin(params) {
    retur (moves[0][0] && moves[0][2] && moves[2][2] && moves[2][0])
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