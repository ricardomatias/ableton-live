import OSC, { DatagramPlugin, Message, Bundle } from 'osc-js';

enum Ports {
	ABLETON = 5775,
	NODE = 5776
}

const osc = new OSC({ plugin: new DatagramPlugin({ send: { port: Ports.ABLETON }}) });

osc.on('open', () => {
	// send only this message to `localhost:9002`
	const now = Date.now();

	// send these messages to `localhost:11245`
	const message = new Message('/first', now);
	const bundle = new Bundle([ message ], now);

	osc.send(bundle);

	osc.send(new Bundle([ new Message('/second', now + 5000.0) ], now + 5000.0));
});

osc.on('error', (message) => {
	console.error(message);
});

osc.open({ port: Ports.NODE });


// const socket = io.connect('http://localhost:5775');

// socket.on('connect', function() {
// 	console.log('connected');
// 	socket.emit('hi!');
// });

// socket.on('message', (...args) => console.log(args));

// socket.on('disconnect', () => {
// 	console.log('Server shutdown, disconnecting..');
// 	process.exit(0);
// });

