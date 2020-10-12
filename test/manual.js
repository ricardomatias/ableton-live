/* eslint-disable @typescript-eslint/no-var-requires */
global.WebSocket = require('ws');

const util = require('util');
const { AbletonLive, Note } = require('../build/cjs');
// const {
// 	performance,
// 	PerformanceObserver,
// } = require('perf_hooks');
// const util = require('util');

const live = new AbletonLive({ port: 9002, logRequests: true });

const log = (...args) => console.log(...args);

const exit = () => {
	live.close();
	process.exit(0);
};

const wait = (time, fn) => {
	setTimeout(fn, time);
};

const test = async () => {
	try {
		const time = 0;
		await live.connect();

		// const removeMetronomeObserver = await live.song.observe('metronome', (state) => {
		// 	console.log('metronome', state);
		// });

		// await live.song.observe('tracks', async (tracks) => {
		// 	if (tracks.length) {
		// 		tracks.forEach((t) => console.log(t.name));
		// 	}
		// });
		// const tracks = await live.song.children('tracks');
		// console.log(tracks);

		const track = await live.song.findTrackByName('Bass');

		const clipSlots = await track.children('clip_slots');

		const clip = await clipSlots[1].clip();

		const notes = await clip.getSelectedNotes();
		console.log(notes);

		// await clip.addNewNotes([
		// 	new Note(70, 0.0, 0.5, 100),
		// 	new Note(52, 0.5, 1.0, 64),
		// 	new Note(84, 1.0, 2.0, 127),
		// ]);

		// const ids = await clip.getNotesById(notes.slice(0, 3).map(n => n.id));

		// await live.observe('live_set tracks 1 clip_slots 0 clip', 'playing_position', (pos) => {
		// 	console.log(pos);
		// });
		// const id = setInterval(async () => {
		// 	const bbs = await live.song.getCurrentBeatsSongTime();
		// 	console.log('bbs', bbs);
		// }, 250);


		// wait(2001, () => (clearInterval(id)));
		// performance.mark('A');

		// const tracks = await live.song.children('tracks');

		// console.log(tracks.map((track) => `${track}`));

		// const track = tracks.filter((track) => track.name === 'Node SDK')[0];

		// const clipSlots = await track.children('clip_slots');
		// const devices = await track.children('devices');
		// const channelEq = devices[devices.length - 1];

		// const eqParams = await channelEq.children('parameters');

		// const trackMixer = await track.children('mixer_device');

		// const clip = await clipSlots[0].clip();

		// const notes = await clip.getNotes();

		// console.log(notes);

		// const emptyClipSlots = clipSlots.filter((clipSlot) => !clipSlot.raw.has_clip);
		// console.log(`Empty clip slots: ${emptyClipSlots.length}`);
		// const emptySlot = emptyClipSlots[0];
		// const foo = await emptySlot.createClip(4);
		// console.log(foo);

		// const emptyClip = await emptySlot.clip();

		// console.log(emptyClip);
		// console.log('notes', notes);

		// emptyClip.setNotes([
		// 	new Note(60, 0.0, 0.5, 100),
		// 	new Note(62, 0.5, 0.5, 64),
		// ]);

		// const notes = await clip.getNotes(0, 1);
		// console.log(notes);

		// const result = await clipSlot.fire();
		// const result = await clipSlot.createClip(4);

		// wait(1000, async () => (await clipSlot.stop()));

		// performance.mark('B');

		// performance.measure('Performance', 'A', 'B');
		// wait(time += 2000, async () => {
		// 	// clearInterval(id);

		// 	live.close();

		// 	// await live.song.undo();
		// 	exit();
		// });
	} catch (error) {
		console.log('WE CAUGHT IT! ARRR');
		console.error(error);
		exit();
	}
};

process.on('SIGINT', (code) => {
	console.log('Process beforeExit event with code: ', code);
	live.close();
	process.exit(0);
});

test();

// const obs = new PerformanceObserver((items) => {
// 	const measurement = items.getEntriesByType('measure')[0];

// 	console.log(measurement);
// 	performance.clearMarks();
// });

// obs.observe({ entryTypes: ['measure'] });

