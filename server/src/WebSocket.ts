import './pre-start'; // Must be the first import
import app from '@server';
import * as http from 'http';
import * as WebSocket from 'ws';

/************************************************************************************
 *                              Websocket server
 ***********************************************************************************/
// initialize a simple http server
const websocketServer = http.createServer(app);
const wss = new WebSocket.Server({ server: websocketServer });

//initialize the WebSocket server instance
wss.on('connection', (ws: WebSocket) => {
  //connection is up, let's add a simple simple event
  ws.on('message', (message: string) => {
    //log the received message and send it back to the client
    console.log('received: %s', message);
    ws.send(
      JSON.stringify(
        `Hello, you sent -> ${message} -> On ${new Date().toLocaleTimeString()}`
      )
    );
  });

  //send immediatly a feedback to the incoming connection
  ws.send(JSON.stringify('Hi there, I am a WebSocket server'));
});

export default websocketServer;
