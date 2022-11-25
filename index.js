import * as readline from 'node:readline/promises';  

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let gameIsOver = false;
let currentPlayer = 'Player 1';


async function startGame() {

    while(!gameIsOver) {
        let response = await rl.question(`${currentPlayer}, please enter your next move: `)
        
        console.log(`${currentPlayer} entered the value ${response}`)
        // MAIN GAME LOGIC !!
        
        currentPlayer = currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1'; 
    }
}

startGame();