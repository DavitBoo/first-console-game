import express from 'express'
import {createServer} from "http";
import { Server } from "socket.io";

let app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, { /* options */ });

const RUNNING = 'RUNNING';
const PLAYER_X_WINS = 'PLAYER_X_WINS';
const PLAYER_O_WINS = 'PLAYER_O_WINS'
const CATS_GAME = 'CATS_GAME'

let currentPlayer;
let gameIsOver = false;
let currentGameState = RUNNING;
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

let playerX;
let playerO;


io.on("connection", (socket) => {
    if(playerX){
        console.log('El segundo jugador de ha unido, comienza el juego...')
        playerO = socket
        //en vez de hablarle a una sola conxión(jugador), con io. emites a todos los sockets conectados
        playerX.emit('info', 'Ya está aquí tu contrincante, comienza la partida...')
        playerO.emit('info', 'Eres el segundo jugaro, la partida empieza ya...')
        

        startGame();


    }else{
        console.log('El primer jugador se ha unid, esperando al segundo...')
        playerX = socket
        playerX.emit('info', 'Eres el primer jugador, estamos esperando al segundo para dar comienzo a la partida...')
    }

    socket.on('new move', input  => {
        let[yMove, xMove] = parseInput(input);
        let currentPlayerMoves = currentPlayer === 'Player X'
            ? playerXMoves
            : playerOMoves

        currentPlayerMoves[yMove][xMove] = 1;

        currentGameState = getNextGameState(playerXMoves, playerOMoves);
        gameIsOver = [PLAYER_X_WINS, PLAYER_O_WINS, CATS_GAME].includes(currentGameState);

        playerX.emit('player moves', {playerXMoves, playerOMoves})
        playerO.emit('player moves', {playerXMoves, playerOMoves})

        currentPlayer = currentPlayer === 'Player X' ? 'Player O' : 'Player X'; 
        if(!gameIsOver){

            if(currentPlayer === 'Player X'){
                playerX.emit('your turn')
                console.log('el x')
                playerO.emit('other player turn')
            }else {
                playerO.emit('your turn')
                console.log('el O')
                playerX.emit('other player turn')
            }
        } else{
            if(currentGameState === PLAYER_X_WINS){
                playerX.emit('win')
                playerO.emit('lose')
            } else if (currentGameState === PLAYER_O_WINS){
                playerO.emit('win')
                playerX.emit('lose')
            } else {
                playerO.emit('tie')
                playerX.emit('tie')
            }
        }

    })

});

let PORT = process.env.PORT || 3000;

function startGame(){
    console.log('¡La partida ha empezado!') 
    currentPlayer = Math.random() > 0.5 ? 'Player X' : 'PLayer O'

    playerX.emit('player moves', {playerXMoves, playerOMoves})
    playerO.emit('player moves', {playerXMoves, playerOMoves})

    if(currentPlayer==='Player X') playerX.emit('your turn')
    else playerO.emit('your turn')
}

function parseInput(input){
    let [letter, number] = input.split('');
    return [
        //con estas linea, lo que haces es pedir el index en el que se encuentra letter y number, que ya sabes que van a ser uno de los valores del array
        ['A', 'B', 'C'].indexOf(letter),
        ['1', '2', '3'].indexOf(number)
    ]
}


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
    return [0, 1, 2].some(columnNumber => moves.every(row => row[columnNumber]
        ))
}

function isDiagonalWin(moves) {
   return (moves[0][0]  && moves[1][1] && moves[2][2]) 
    || (moves[2][0]  && moves[1][1] && moves[0][2]) 

}

function isCornersWin(moves) {
    return (moves[0][0] && moves[0][2] && moves[2][2] && moves[2][0])
}



httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} ...`)
}); 