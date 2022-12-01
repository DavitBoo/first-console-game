import socketIoClient from 'socket.io-client'
import * as readline from 'node:readline/promises'

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const socket = socketIoClient("https://first-console-game.onrender.com/")


socket.on("your turn", async () => {
    let respone = await rl.question('It\' is your turn, please enter your next move: ')
  });

socket.on('info', message => {
    console.log(message)
})