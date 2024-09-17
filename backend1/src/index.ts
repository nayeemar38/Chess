//ws in node

import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const wss = new WebSocketServer({port: 8080});// the websocket will listen at port

const gameManager = new GameManager();


wss.on('connection', function connection(ws) {
    gameManager.addUser(ws)
    ws.on("disconnect", () => gameManager.removeUser(ws))
});