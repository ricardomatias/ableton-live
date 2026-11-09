import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import * as lib from './helpers.mjs';
import { connect, waitFor, approx, stopEverything, DEMO_SET, Track, Scene, TrackType } from './helpers.mjs';

describe('Song', () => {
	let live;

	before(async () => (live = await connect()));
	after(() => live?.close());

	describe('Demo Set fixture', () => {
		it('has the Demo Set tracks, in order', async () => {
			const tracks = await live.song.children('tracks');

			assert.deepEqual(
				tracks.map((t) => t.name),
				DEMO_SET.tracks
			);
		});

		it('has the Demo Set scenes, in order', async () => {
			const scenes = await live.song.children('scenes');

			assert.deepEqual(
				scenes.map((s) => s.name),
				DEMO_SET.scenes
			);
		});

		it('has the Demo Set return tracks', async () => {
			const returns = await live.song.children('return_tracks');

			assert.deepEqual(
				returns.map((t) => t.name),
				DEMO_SET.returnTracks
			);
		});

		it('has the Demo Set cue points', async () => {
			const cues = await live.song.children('cue_points');

			assert.equal(cues.length, DEMO_SET.cuePoints);
			cues.forEach((c) => {
				assert.equal(typeof c.raw.name, 'string');
				assert.equal(typeof c.raw.time, 'number');
			});
		});

		it('exports the CuePoint class it hands out', async () => {
			const [cue] = await live.song.children('cue_points');

			assert.equal(typeof lib.CuePoint, 'function', 'CuePoint is not exported from the package entry');
			assert.ok(cue instanceof lib.CuePoint);
		});
	});

	describe('properties', () => {
		it('reads the transport and global settings', async () => {
			assert.equal(typeof (await live.song.get('tempo')), 'number');
			assert.equal(await live.song.get('signature_numerator'), 4);
			assert.equal(await live.song.get('signature_denominator'), 4);
			assert.equal(typeof (await live.song.get('is_playing')), 'boolean');
			assert.ok((await live.song.get('song_length')) > 0);
		});

		it('reads the song scale', async () => {
			const root = await live.song.get('root_note');
			const scale = await live.song.get('scale_name');

			assert.ok(Number.isInteger(root) && root >= 0 && root <= 11, `bad root_note: ${root}`);
			assert.equal(typeof scale, 'string');
			assert.ok(scale.length > 0);
		});

		it('sets tempo and restores it', async () => {
			const original = await live.song.get('tempo');

			try {
				await live.song.set('tempo', 123.5);
				assert.ok(approx(await live.song.get('tempo'), 123.5));
			} finally {
				await live.song.set('tempo', original);
			}

			assert.ok(approx(await live.song.get('tempo'), original));
		});

		it('converts booleans when setting (metronome)', async () => {
			const original = await live.song.get('metronome');

			try {
				await live.song.set('metronome', !original);
				assert.equal(await live.song.get('metronome'), !original);
			} finally {
				await live.song.set('metronome', original);
			}
		});
	});

	describe('observers', () => {
		it('notifies tempo changes and stops after unsubscribing', async () => {
			const original = await live.song.get('tempo');
			const seen = [];

			const unsubscribe = await live.song.observe('tempo', (tempo) => seen.push(tempo));

			try {
				await live.song.set('tempo', 140);
				await waitFor(() => seen.some((t) => approx(t, 140)), { message: 'tempo observer to fire' });
			} finally {
				await unsubscribe();
				await live.song.set('tempo', original);
			}

			const countAfterUnsubscribe = seen.length;
			await live.song.set('tempo', original + 1);
			await new Promise((r) => setTimeout(r, 300));
			await live.song.set('tempo', original);

			assert.equal(seen.length, countAfterUnsubscribe, 'observer fired after unsubscribe');
		});
	});

	describe('children', () => {
		it('wraps tracks in Track instances with ids, paths and indices', async () => {
			const tracks = await live.song.children('tracks');

			tracks.forEach((t, i) => {
				assert.ok(t instanceof Track);
				assert.equal(t.index, i);
				assert.ok(t.id, `track ${i} has no id`);
				assert.equal(t.path, `live_set tracks ${i}`);
			});
		});

		it('wraps scenes in Scene instances', async () => {
			const scenes = await live.song.children('scenes');

			scenes.forEach((s, i) => {
				assert.ok(s instanceof Scene);
				assert.equal(s.path, `live_set scenes ${i}`);
			});
		});

		it('fetches a single child by index', async () => {
			const track = await live.song.child('tracks', 2);

			assert.ok(track instanceof Track);
			assert.equal(track.name, DEMO_SET.tracks[2]);
		});

		it('returns the master track as a named Track', async () => {
			const master = await live.song.children('master_track');

			assert.ok(master instanceof Track);
			assert.equal(master.path, 'live_set master_track');
			assert.ok(master.id, 'master track has no id');
			assert.equal(await master.get('name'), 'Main');
		});

		it('finds the LiveAPI device on the master track', async () => {
			const master = await live.song.children('master_track');
			const devices = await master.children('devices');

			assert.ok(
				devices.some((d) => d.name === 'LiveAPI'),
				`devices: ${devices.map((d) => d.name)}`
			);
		});

		it('returns the tuning system', async () => {
			const tuning = await live.song.children('tuning_system');

			assert.ok(tuning, 'no tuning system');
		});
	});

	describe('custom API', () => {
		it('findTrackByName matches case-insensitively and partially', async () => {
			const track = await live.song.findTrackByName('  rose ');

			assert.ok(track);
			assert.equal(track.name, 'Rose Bass');
		});

		it('findTrackByName returns undefined for unknown names', async () => {
			assert.equal(await live.song.findTrackByName('no such track xyz'), undefined);
		});

		it('splits tracks into audio and midi', async () => {
			const audio = await live.song.getAudioTracks();
			const midi = await live.song.getMidiTracks();

			assert.deepEqual(
				audio.map((t) => t.name),
				DEMO_SET.audioTracks
			);
			assert.equal(audio.length + midi.length, DEMO_SET.tracks.length);
			audio.forEach((t) => assert.equal(t.type, TrackType.Audio));
			midi.forEach((t) => assert.equal(t.type, TrackType.Midi));
		});
	});

	describe('transport', () => {
		it('starts and stops playback, observed via is_playing', async () => {
			const states = [];
			const unsubscribe = await live.song.observe('is_playing', (playing) => states.push(playing));

			try {
				await live.song.startPlaying();
				await waitFor(async () => (await live.song.get('is_playing')) === true, { message: 'playback to start' });

				await live.song.stopPlaying();
				await waitFor(async () => (await live.song.get('is_playing')) === false, { message: 'playback to stop' });

				await waitFor(() => states.includes(true) && states.at(-1) === false, {
					message: 'is_playing observer to see start and stop',
				});
			} finally {
				await unsubscribe();
				await stopEverything(live);
			}
		});

		it('stopAllClips() works with its default argument', async () => {
			await live.song.stopAllClips();
		});

		it('stopAllClips(false) stops unquantized', async () => {
			await live.song.stopAllClips(false);
		});
	});

	describe('after structural changes', () => {
		it('child(\'tracks\', i) resolves a track created during the session', async () => {
			await live.song.createMidiTrack(-1);
			const created = (await live.song.children('tracks')).at(-1);

			try {
				const viaIndex = await live.song.child('tracks', created.index);

				assert.equal(viaIndex.id, created.id);
				assert.equal(viaIndex.path, `live_set tracks ${created.index}`);
			} finally {
				const tracks = await live.song.children('tracks');
				await live.song.deleteTrack(tracks.findIndex((t) => t.id === created.id));
			}

			assert.equal((await live.song.children('tracks')).length, DEMO_SET.tracks.length);
		});
	});

	describe('scenes', () => {
		it('creates a scene at the end and deletes it again', async () => {
			const before = await live.song.children('scenes');

			await live.song.createScene(-1);

			try {
				const during = await live.song.children('scenes');
				assert.equal(during.length, before.length + 1);
			} finally {
				await live.song.deleteScene(before.length);
			}

			const after = await live.song.children('scenes');
			assert.deepEqual(
				after.map((s) => s.name),
				before.map((s) => s.name)
			);
		});
	});
});
