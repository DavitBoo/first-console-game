import express from 'express'
import {createServer} from "http";
import { Server } from "socket.io";

let app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, { /* options */ });

let playerX;
let playerO;


io.on("connection", (socket) => {
    if(playerX){
        console.log('El segundo jugador de ha unido, comienza el juego...')
        playerO = socket
        //en vez de hablarle a una sola conxión(jugador), con io. emites a todos los sockets conectados
        playerX.emit('info', 'Ya está aquí tu contrincante, comienza la partida...')
        playerO.emit('info', 'Eres el segundo jugaro, la partida empieza ya...')
    }else{
        console.log('El primer jugador se ha unid, esperando al segundo...')
        playerX = socket
        playerX.emit('info', 'Eres el primer jugador, estamos esperando al segundo para dar comienzo a la partida...')
    }

    console.log('A new player has joined!')
    socket.emit("your turn")
});

let PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} ...`)
}); 