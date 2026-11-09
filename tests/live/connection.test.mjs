import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import { AbletonLive, connect, HOST } from './helpers.mjs';

describe('connection', () => {
	const opened = [];

	after(() => opened.forEach((live) => live.close()));

	it('connects to the LiveAPI device and reports isConnected', async () => {
		const live = await connect();
		opened.push(live);

		assert.equal(live.isConnected, true);
	});

	it('emits "connect" when the socket opens', async () => {
		const live = new AbletonLive({ host: HOST, maxAttempts: 1 });
		opened.push(live);

		let emitted = false;
		live.on('connect', () => (emitted = true));
		await live.connect();

		assert.equal(emitted, true);
	});

	it('round-trips a raw get against live_set', async () => {
		const live = await connect();
		opened.push(live);

		const tempo = await live.get('live_set', 'tempo');

		assert.equal(typeof tempo, 'number');
		assert.ok(tempo >= 20 && tempo <= 999, `tempo out of Live's range: ${tempo}`);
	});

	it('serves many concurrent requests on one socket', async () => {
		const live = await connect();
		opened.push(live);

		const props = ['tempo', 'signature_numerator', 'signature_denominator', 'is_playing', 'loop', 'metronome'];
		const results = await Promise.all(props.map((p) => live.get('live_set', p)));

		assert.equal(results.length, props.length);
		results.forEach((r, i) => assert.notEqual(r, undefined, `${props[i]} came back undefined`));
	});

	it('marks the client disconnected after close() and refuses new requests', async () => {
		const live = await connect();

		let disconnected = false;
		live.on('disconnect', () => (disconnected = true));
		live.close();

		assert.equal(live.isConnected, false);
		assert.equal(disconnected, true);
		await assert.rejects(live.get('live_set', 'tempo'), /not connected/);
	});

	it('rejects connect() when nothing is listening', async () => {
		const live = new AbletonLive({ host: HOST, port: 1, maxAttempts: 0 });

		await assert.rejects(live.connect());
	});
});
