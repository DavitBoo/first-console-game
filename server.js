import express from 'express'
import {createServer} from "http";
import { Server } from "socket.io";

let app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
    console.log('A new player has joined!')
    socket.emit("your turn")
});

let PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} ...`)
}); 