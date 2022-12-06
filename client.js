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


async function getNextMove(prompt) {
    let inputValid = false;
    let response;
    while(!inputValid){
        response = await rl.question(prompt)
        inputValid = isValidInput(response);
        if(!inputValid) {
            console.log('Invalid input, please enter a capital letter followed by a number')
        }
    }    
    socket.emit('new move', response)
}

socket.on('position taken', () => {
    console.log('Lo siento, ese posición ya la ha marcado tu contrincante.')
    getNextMove('Introduce una posición nueva: ')
})

socket.on("your turn", () => {
    getNextMove('It is your turn, please enter your next move: ' );

  });

socket.on('player moves', ({playerXMoves, playerOMoves}) => {
    drawGrid(playerXMoves, playerOMoves)
})


socket.on('info', message => {
    console.log(message)
})

socket.on('other player turn', () => {
    console.log('waiting for the other players input')
})

socket.on('win', () => {
    console.log('Se acabó la partida, has ganado!')
    rl.close();
    socket.disconnect();
})

socket.on('lose', () => {
    console.log('Se acabó la partida, has perdido!')
    rl.close();
    socket.disconnect();
})

socket.on('tie', () => {
    console.log('Se acabó la partida, habeis quedado empate!')
    rl.close();
    socket.disconnect();
})


function isValidInput(input) {
    let [letter, number] = input.split('');
    //estamos comprobando a la inversa a ver si el A,B,C contiene la letra de nuestra variable letter, y lo mismo con number y 1,2,3
    return ['A', 'B', 'C'].includes(letter) && ['1', '2', '3'].includes(number);
}

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