import './pre-start'; // Must be the first import
import app from '@server';
import wss from '@websocket';
import logger from '@shared/Logger';

// Start the server
const port = Number(process.env.PORT || 9000);
app.listen(port, () => {
  logger.info('Express server started on port: ' + port);
});

// Start the websocket
const wssPort = Number(process.env.SOCKET_PORT || 8080);
wss.listen(wssPort, () => {
  logger.info('Websocket server started on port: ' + wssPort);
});
