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
const WAITING = 'WAITING'

let games = [];

function createNewGame() {
    return {            
        currentPlayer: null,
        gameIsOver: false,
        currentGameState: WAITING, 
        playerXMoves: [
            [0,0,0],
            [0,0,0],
            [0,0,0],
        ],
        playerOMoves: [
            [0,0,0],
            [0,0,0],
            [0,0,0],
        ],
        playerXSocket: null,
        playerOSocket: null
    }
}

let nextSocketId = 0;

io.on("connection", (socket) => {
    let socketId = nextSocketId;
    nextSocketId += 1;
    let waitingGame = games.find(game => game.currentGameState === 'WAITING')
    let game

    if(waitingGame){
        game = waitingGame
        console.log('El segundo jugador de ha unido, comienza el juego...')
        game.playerOSocket = socket
        //en vez de hablarle a una sola conxión(jugador), con io. emites a todos los sockets conectados
        game.playerXSocket.emit('info', `Ya está aquí tu contrincante con Id ${socketId}, comienza la partida... `)
        game.playerOSocket.emit('info', `Eres el segundo jugador, tu Id es ${socketId} y jugaras contra  el jugador${game.playerXId}, la partida empieza ya...`)
        game.playerXId = socketId
             
        startGame(waitingGame);
    }else{
        let newGame = createNewGame();
        game = newGame
        console.log('El primer jugador se ha unid, esperando al segundo...')
        game.playerXSocket = socket
        game.playerXSocket.emit('info', `Eres el primer jugador, tu ID es ${socketId}, estamos esperando al segundo para dar comienzo a la partida...`)
        newGame.playerXId = socketId;
        games.push(game)
    }

    socket.on('new move', input  => {
        let {
            playerOMoves, 
            playerXMoves,
            playerOSocket,
            playerXSocket
            
        } = game;
        let[yMove, xMove] = parseInput(input);
        let currentPlayerMoves = game.currentPlayer === 'Player X'
            ? playerXMoves
            : playerOMoves

        currentPlayerMoves[yMove][xMove] = 1;

        game.currentGameState = getNextGameState(game.playerXMoves, game.playerOMoves);
        game.gameIsOver = [PLAYER_X_WINS, PLAYER_O_WINS, CATS_GAME].includes(game.currentGameState);

        playerXSocket.emit('player moves', {playerXMoves, playerOMoves})
        playerOSocket.emit('player moves', {playerXMoves, playerOMoves})

        game.currentPlayer = game.currentPlayer === 'Player X' ? 'Player O' : 'Player X'; 
        if(!game.gameIsOver){

            if(game.currentPlayer === 'Player X'){
                playerXSocket.emit('your turn')
                playerOSocket.emit('other player turn')
            }else {
                playerOSocket.emit('your turn')
                playerXSocket.emit('other player turn')
            }
        } else{
            if(game.currentGameState === PLAYER_X_WINS){
                playerXSocket.emit('win')
                playerOSocket.emit('lose')
            } else if (game.currentGameState === PLAYER_O_WINS){
                playerOSocket.emit('win')
                playerXSocket.emit('lose')
            } else if(game.currentGameState === CATS_GAME){
                playerOSocket.emit('tie')
                playerXSocket.emit('tie')
            }

            game = games.filter(g => g !== game);    
        }

    })

});

let PORT = process.env.PORT || 3000;

function startGame(game){
    let {
            playerXSocket, 
            playerOSocket,
            playerXMoves,
            playerOMoves
        } = game

    game.currentGameState = "RUNNING"

    console.log('¡La partida ha empezado!') 
    game.currentPlayer = Math.random() > 0.5 ? 'Player X' : 'PLayer O'

    playerXSocket.emit('player moves', {playerXMoves, playerOMoves})
    playerOSocket.emit('player moves', {playerXMoves, playerOMoves})

    if(game.currentPlayer==='Player X') {
        playerXSocket.emit('your turn')
        playerOSocket.emit('Other player turn')
    }
    else {
        playerOSocket.emit('your turn')  
        playerXSocket.emit('Other player turn') 
    }
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
    if(playerXWins) return PLAYER_X_WINS
    
    let playerOWins = isHorizontalWin(oMoves) || isVerticalWin(oMoves) || isDiagonalWin(oMoves) || isCornersWin(oMoves)
    if(playerOWins) return PLAYER_O_WINS
    
    let catsGame = isCatsGame(xMoves, oMoves)
    if(catsGame) return CATS_GAME

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

function isCatsGame (xMoves, oMoves) {
    return xMoves.every((row, rowNumber) => 
        row.every((_, columnNumber) =>
             xMoves[rowNumber][columnNumber] || oMoves[rowNumber][columnNumber])) 
}



httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} ...`)
}); 