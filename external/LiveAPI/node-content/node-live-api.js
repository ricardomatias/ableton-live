/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-ignore

// TODO: Migrate to uWebsockets.js
// https://edisonchee.com/writing/intro-to-%C2%B5websockets.js/
const maxApi = require('max-api');
const uWS = require('uWebSockets.js');
const { nanoid } = require('nanoid');

let SOCKETS = [];

let uws;

const State = {
	Disconnected: 0,
	Connected: 1,
};

/* We store the listen socket here, so that we can shut it down later */
let listenSocket;

maxApi.addHandler('port', async (port) => {
	try {
		if (uws) {
			console.log('Attempting to close server..');

			if (listenSocket) uWS.us_listen_socket_close(listenSocket);
		}

		console.log('Creating server..');

		uws = uWS.App().ws('/ableton-live', {
			idleTimeout: 12,
			// maxPayloadLength: 16 * 1024 * 1024,
			// maxBackpressure: 1024,

			open: (ws) => {
				ws.id = nanoid();

				console.log(`[uWebSockets] Client <${ws.id}> connected`);

				maxApi.outlet('connection', State.Connected);

				const responseHandler = (response) => {
					ws.send(response);
				};

				ws.maxResponseHandler = responseHandler;
				ws.isAlive = true;

				maxApi.addHandler('response', responseHandler);

				ws.ping();

				SOCKETS.push(ws);
			},
			close: (ws, code) => {
				maxApi.outlet('close');
				maxApi.outlet('connection', State.Disconnected);

				const socket = SOCKETS.find((socket) => {
					return socket && socket.id === ws.id;
				});

				maxApi.removeHandler('response', socket.maxResponseHandler);

				SOCKETS.splice(SOCKETS.indexOf(socket), 1);

				console.log('[uWebSockets] Client disconnected');
			},
			message: (ws, message, isBinary) => {
				/* Ok is false if backpressure was built up, wait for drain */
				try {
					const msg = Buffer.from(message).toString();

					if (msg === 'pong') {
						ws.isAlive = true;
					} else {
						const payload = JSON.parse(msg);

						maxApi.outlet('message', payload);

						maxApi.outlet(payload.action, msg);
					}
				} catch (error) {
					console.error(error);
				}
			},
		});

		uws.listen(port, (token) => {
			/* Save the listen socket for later shut down */
			listenSocket = token;

			/* Did we even manage to listen? */
			if (token) {
				console.log(`[uWebSockets] Server is running on port ${port}`);

				maxApi.outlet('online', State.Connected);
			} else {
				console.log('[uWebSockets] Failed to listen to port ' + port);
			}
		});
	} catch (err) {
		console.log('[uWebSockets] Generic Error');
		console.error(err);
	}
});

maxApi.registerShutdownHook((signal) => {
	maxApi.outlet('online', State.Disconnected);
	maxApi.post('Exiting with code: ', signal);

	if (uws && listenSocket) {
		/* This function is provided directly by µSockets */
		uWS.us_listen_socket_close(listenSocket);
		listenSocket = null;
	}
});

const handlers = {
	[maxApi.MESSAGE_TYPES.ALL]: (handled, ...args) => {
		if (!handled) {
			console.log('Not handled: ', args);
		}
	},
};

maxApi.addHandlers(handlers);
