import socketIoClient from 'socket.io-client'
import * as readline from 'node:readline/promises'

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

let serverUrl = process.env.IS_DEV
    ? 'http://127.0.0.1:3000'
    : 'https://first-console-game.onrender.com/'

const socket = socketIoClient(serverUrl)


socket.on("your turn", async () => {
    let respone = await rl.question('It\' is your turn, please enter your next move: ')
  });

socket.on('player moves', ({playerXMoves, playerOMoves}) => {
    drawGrid(playerXMoves, playerOMoves)
})

socket.on('info', message => {
    console.log(message)
})

function drawGrid(xMoves, oMoves){
    console.log()
    drawLNumberLabels(),
    drawVerticalLines(xMoves[0], oMoves[0], 'A');
    drawHorizontalLines();
    drawVerticalLines(xMoves[1], oMoves[1], 'B');
    drawHorizontalLines();
    drawVerticalLines(xMoves[2], oMoves[2], 'C');
    console.log()
}

function drawLNumberLabels(){
    console.log('   1   2   3')
}

function drawVerticalLines(xMoves, oMoves, label) {
    let space1char = xMoves[0] ? 'X' : oMoves[0] ? 'O' : ' ';
    let space2char = xMoves[1] ? 'X' : oMoves[1] ? 'O' : ' ';
    let space3char = xMoves[2] ? 'X' : oMoves[2] ? 'O' : ' ';

    console.log(`${label}  ${space1char} | ${space2char} | ${space3char} `)
}

function drawHorizontalLines(){
    console.log('  ---+---+---');
}