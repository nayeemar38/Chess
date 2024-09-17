"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const messages_1 = require("./messages"); // Assuming INIT_GAME is defined in messages
class GameManager {
    constructor() {
        this.games = []; // Correctly initialize as an empty array
        this.pendingUser = null;
        this.users = []; // Correctly initialize as an empty array
    }
    addUser(socket) {
        this.users.push(socket); // Add the user socket to the array
        this.addHandler(socket); // Set up the message handler
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
        // You can stop the game or handle cleanup when the user leaves
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            // Handle INIT_GAME
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    // Start a game if there is a pending user
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    // Set pending user if no one is waiting
                    this.pendingUser = socket;
                }
            }
            // Handle MOVE message
            if (message.type === messages_1.MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    // Make the move for the user who sent the message
                    game.makeMove(socket, message.payload.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
