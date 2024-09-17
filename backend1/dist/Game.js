"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startTime = new Date();
        // Initialize the game and send color to players
        this.player1.send(JSON.stringify({
            type: "INIT_GAME",
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: "INIT_GAME",
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        // Check whose turn it is
        console.log(move);
        if (this.board.history().length % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.board.history().length % 2 === 1 && socket !== this.player2) {
            return;
        }
        // Attempt to make the move
        try {
            const result = this.board.move(move);
            if (!result) {
                // Invalid move
                console.error("Invalid move");
                return;
            }
        }
        catch (e) {
            console.error(e);
            return;
        }
        // Check if the game is over
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            this.player1.send(JSON.stringify({
                type: "GAME_OVER",
                payload: {
                    winner: winner
                }
            }));
            this.player2.send(JSON.stringify({
                type: "GAME_OVER",
                payload: {
                    winner: winner
                }
            }));
            return;
        }
        // Notify the other player of the move
        if (this.board.history().length % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: "MOVE",
                payload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: "MOVE",
                payload: move
            }));
        }
    }
}
exports.Game = Game;
