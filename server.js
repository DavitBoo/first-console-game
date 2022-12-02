import express from 'express'
import {createServer} from "http";
import { Server } from "socket.io";

let app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, { /* options */ });

let currentPlayer;
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
        console.log(currentPlayer)
        let currentPlayerMoves = currentPlayer === 'Player X'
            ? playerXMoves
            : playerOMoves

        currentPlayerMoves[yMove][xMove] = 1;

        currentGameState = getNextGameState(playerXMoves, playerOMoves);
        gameIsOver = [PLAYER_X_WINS, PLAYER_O_WINS, CATS_GAME].includes(currentGameState);

        playerX.emit('player moves', {playerXMoves, playerOMoves})
        playerO.emit('player moves', {playerXMoves, playerOMoves})

        currentPlayer = currentPlayer === 'Player X' ? 'Player O' : 'Player X'; 
        if(currentPlayer === 'Player X'){
            playerX.emit('your turn')
            console.log('el x')
            playerO.emit('other player turn')
        }else {
            playerO.emit('your turn')
            console.log('el O')
            playerX.emit('other player turn')
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

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} ...`)
}); 