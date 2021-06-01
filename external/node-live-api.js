/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-ignore

// TODO: Migrate to uWebsockets.js
// https://edisonchee.com/writing/intro-to-%C2%B5websockets.js/
const maxApi = require('max-api');
const { WebSocket } = require('@clusterws/cws');
const util = require('util');

const HEARTBEAT_INTERVAL = 5000;

let wss;

const State = {
	Disconnected: 0,
	Connected: 1
};

const args = process.argv.slice(2);

maxApi.addHandler('port', async (port) => {
	if (wss) {
		console.log('Attempting to close server..');

		const closeServer = util.promisify(wss.close.bind(wss));

		await closeServer();
	}
	console.log('Creating server..');

	wss = new WebSocket.Server({ port }, () => {
		console.log(`[WebSockette] Server is running on port ${port}`);

		maxApi.outlet('online', State.Connected);
	});

	wss.on('connection', (ws, req) => {
		console.log('[WebSockette] Client connected');

		maxApi.outlet('connection', State.Connected);

		const responseHandler = (response) => {
			ws.send(response);
		};

		maxApi.addHandler('response', responseHandler);

		ws.isAlive = true;

		ws.on('close', () => {
			maxApi.outlet('close');
			maxApi.outlet('connection', State.Disconnected);
			maxApi.removeHandler('response', responseHandler);
			console.log('[WebSockette] Client disconnected');
		});

		ws.on('message', (msg) => {
			try {
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
		});
	});

	const interval = setInterval(function ping() {
		wss.clients.forEach(function each(ws) {
			if (ws.isAlive === false) {
				console.log('[WebSockette] Client terminated')
				return ws.terminate();
			};

			ws.isAlive = false;
			ws.send('ping');
		});
	}, HEARTBEAT_INTERVAL);

	wss.on('close', function close() {
		console.log('[WebSockette] Server closed');
		clearInterval(interval);
	});

	wss.on('error', function error(err) {
		if (err.message.includes('EADDRINUSE')) {
			maxApi.outlet('error');
			clearInterval(interval);
		}
		console.log('[WebSockette] Server Error', err.message);
	});
});

maxApi.registerShutdownHook(() => {
	maxApi.outlet('online', State.Disconnected);
	maxApi.post('Exiting with code: ', signal);
	if (wss) wss.close();
});

const handlers = {
	[maxApi.MESSAGE_TYPES.ALL]: (handled, ...args) => {
		if (!handled) {
			console.log('Not handled: ', args);
		}
	}
};

maxApi.addHandlers(handlers);
