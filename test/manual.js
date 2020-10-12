/* eslint-disable @typescript-eslint/no-var-requires */
global.WebSocket = require('ws');

const util = require('util');
const { AbletonLive } = require('../build');
const { Note } = require('../build/Note');
const { Track } = require('../build/Track');
// const {
// 	performance,
// 	PerformanceObserver,
// } = require('perf_hooks');
// const util = require('util');

const live = new AbletonLive({ port: 9001 });

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

		// const removeTempoObserver = await live.song.observe('tempo', async (state) => {
		// 	console.log('tempo', state);
		// });

		// const id = setInterval(async () => {
		// 	const bbs = await live.song.getCurrentBeatsSongTime();
		// 	console.log('bbs', bbs);
		// }, 100);


		// performance.mark('A');

		const scenes = await live.song.children('scenes');
		const scene = scenes[0];

		await scene.fire();

		const tracks = await live.song.children('tracks');

		// console.log(tracks.map((track) => track.name));

		const track = tracks.filter((track) => track.name === 'Node SDK')[0];

		// const clipSlots = await track.children('clip_slots');
		// const devices = await track.children('devices');
		// const channelEq = devices[devices.length - 1];

		// const eqParams = await channelEq.children('parameters');

		const trackMixer = await track.children('mixer_device');

		console.log(trackMixer.volume);
		console.log(trackMixer.panning);

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

