import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { connect, stopEverything, DEMO_SET, ClipSlot, Track, Scene } from './helpers.mjs';

describe('Scene', () => {
	let live;
	let scenes;

	before(async () => {
		live = await connect();
		scenes = await live.song.children('scenes');
	});
	after(() => live?.close());

	it('reads scene properties', async () => {
		const [intro] = scenes;

		assert.equal(await intro.get('name'), 'Intro');
		assert.equal(typeof (await intro.get('color')), 'number');
		assert.equal(typeof (await intro.get('is_empty')), 'boolean');
	});

	it('has one clip slot per track', async () => {
		const slots = await scenes[0].children('clip_slots');

		assert.equal(slots.length, DEMO_SET.tracks.length);
		slots.forEach((s) => assert.ok(s instanceof ClipSlot));
	});

	it('renames a scene and restores it', async () => {
		const scene = scenes[1];

		try {
			await scene.set('name', 'Verse 1 (test)');
			assert.equal(await scene.get('name'), 'Verse 1 (test)');
		} finally {
			await scene.set('name', 'Verse 1');
		}

		assert.equal(await scene.get('name'), 'Verse 1');
	});

	it('fires a scene, starting the transport, then stops everything', async () => {
		try {
			await scenes[0].fire();

			const deadline = Date.now() + 3000;
			while (!(await live.song.get('is_playing')) && Date.now() < deadline) {
				await new Promise((r) => setTimeout(r, 50));
			}

			assert.equal(await live.song.get('is_playing'), true);
		} finally {
			await stopEverything(live);
		}
	});
});

describe('SongView', () => {
	let live;
	let originalTrack;
	let originalScene;

	before(async () => {
		live = await connect();
		originalTrack = await live.songView.children('selected_track');
		originalScene = await live.songView.children('selected_scene');
	});

	after(async () => {
		if (!live) return;

		try {
			if (originalTrack?.id) await live.songView.selectTrack(originalTrack);
			if (originalScene?.id) await live.songView.selectScene(originalScene);
		} finally {
			live.close();
		}
	});

	it('reads the selected track and scene', () => {
		assert.ok(originalTrack instanceof Track);
		assert.ok(originalScene instanceof Scene);
	});

	it('selects a track', async () => {
		const track = await live.song.findTrackByName('Vacuum');
		await live.songView.selectTrack(track);

		const selected = await live.songView.children('selected_track');
		assert.equal(selected.id, track.id);
		assert.equal(selected.name, 'Vacuum');
	});

	it('selects a scene', async () => {
		const scene = await live.song.child('scenes', 2);
		await live.songView.selectScene(scene);

		const selected = await live.songView.children('selected_scene');
		assert.equal(selected.id, scene.id);
		assert.equal(selected.name, 'Chorus');
	});

	it('selects a device', async () => {
		const track = await live.song.findTrackByName('Vacuum');
		const [device] = await track.children('devices');

		await live.songView.selectTrack(track);
		await live.songView.selectDevice(device.id);

		const selectedDevice = await live.get(`${track.path} view`, 'selected_device');
		assert.equal(selectedDevice, Number(device.id));
	});
});
