"use strict";
//ws in node
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 }); // the websocket will listen at port 8080
wss.on('connection', function connection(ws) {
    ws.on('error', console.error); //logging any error found
    ws.on('message', function message(data) {
        console.log('received: %s', data); //logging the message received
    });
    ws.send('something'); //sending some dummy message to the client
});
