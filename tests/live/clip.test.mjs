import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { connect, approx, waitFor, DEMO_SET, Clip, ClipType, Note } from './helpers.mjs';

describe('Clip (Demo Set content, read-only)', () => {
	let live;
	let tracks;

	before(async () => {
		live = await connect();
		tracks = await live.song.children('tracks');
	});
	after(() => live?.close());

	const byName = (name) => tracks.find((t) => t.name === name);

	it('exposes name, type and length on existing clips', async () => {
		const [clip] = await byName('Drums').getClips();

		assert.equal(typeof clip.name, 'string');
		assert.equal(clip.type, ClipType.Midi);
		assert.ok(clip.length > 0);
		assert.equal(await clip.get('length'), clip.length);
	});

	it('reads the notes of a drum clip', async () => {
		const [clip] = await byName('Drums').getClips();
		const notes = await clip.getNotes();

		assert.ok(notes.length > 0, 'expected the first Drums clip to contain notes');
		notes.forEach((n) => {
			assert.ok(n instanceof Note);
			assert.equal(typeof n.id, 'number');
			assert.ok(n.pitch >= 0 && n.pitch <= 127);
			assert.ok(n.velocity > 0 && n.velocity <= 127);
			assert.ok(n.duration > 0);
		});

		const starts = notes.map((n) => n.start);
		assert.deepEqual(starts, [...starts].sort((a, b) => a - b), 'notes are not sorted by start');
	});

	it('narrows getNotes by time and pitch range', async () => {
		const [clip] = await byName('Drums').getClips();
		const all = await clip.getNotes();
		const pitch = all[0].pitch;

		const onePitch = await clip.getNotes(0, 256, pitch, 1);
		const firstBeat = await clip.getNotes(0, 1);

		assert.ok(onePitch.length > 0);
		onePitch.forEach((n) => assert.equal(n.pitch, pitch));
		firstBeat.forEach((n) => assert.ok(n.start < 1));
	});

	it('fetches notes by id', async () => {
		const [clip] = await byName('Drums').getClips();
		const notes = await clip.getNotes();
		const ids = notes.slice(0, 3).map((n) => n.id);

		const byId = await clip.getNotesById(ids);

		assert.deepEqual(byId.map((n) => n.id).sort(), [...ids].sort());
	});

	it('reads audio clip properties', async () => {
		const [clip] = await byName('Vocal Main').getClips();

		assert.equal(clip.type, ClipType.Audio);
		assert.equal(await clip.get('is_audio_clip'), true);
		assert.equal(typeof (await clip.get('warping')), 'boolean');
		assert.equal(typeof (await clip.get('file_path')), 'string');
	});
});

describe('Clip (scratch track, read-write)', () => {
	const SCRATCH = 'ableton-live test scratch';
	let live;
	let track;
	let clip;

	before(async () => {
		live = await connect();

		await live.song.createMidiTrack(-1);

		track = (await live.song.children('tracks')).at(-1);
		await track.set('name', SCRATCH);

		clip = await track.getOrCreateClip(1, 8);
	});

	after(async () => {
		if (!live) return;

		try {
			// Delete by id so a half-finished before() (track created, not yet renamed) is still cleaned up.
			const tracks = await live.song.children('tracks');
			const scratch = track ? tracks.findIndex((t) => t.id === track.id) : -1;
			if (scratch >= 0) await live.song.deleteTrack(scratch);

			const remaining = await live.song.children('tracks');
			assert.equal(remaining.length, DEMO_SET.tracks.length, 'scratch track was not cleaned up');
		} finally {
			live.close();
		}
	});

	it('created a MIDI clip of the requested length', async () => {
		assert.ok(clip instanceof Clip);
		assert.equal(clip.type, ClipType.Midi);
		assert.equal(await clip.get('length'), 8);
		assert.deepEqual(await clip.getNotes(), []);
	});

	it('getOrCreateClip returns the existing clip the second time', async () => {
		const again = await track.getOrCreateClip(1, 4);

		assert.equal(again.id, clip.id);
	});

	it('renames the clip', async () => {
		await clip.set('name', 'test clip');

		assert.equal(await clip.get('name'), 'test clip');
	});

	it('adds notes and reads them back with all note parameters', async () => {
		const ids = await clip.addNewNotes([
			new Note(60, 0, 1, 100),
			new Note(64, 1, 0.5, 90, { probability: 0.5, velocityDeviation: 10, releaseVelocity: 40 }),
			new Note(67, 2, 2, 80, { muted: true }),
		]);

		assert.equal(ids.length, 3);

		const notes = await clip.getNotes();

		assert.deepEqual(
			notes.map((n) => [n.pitch, n.start, n.duration, n.velocity, n.muted]),
			[
				[60, 0, 1, 100, false],
				[64, 1, 0.5, 90, false],
				[67, 2, 2, 80, true],
			]
		);

		const e = notes[1];
		assert.ok(approx(e.probability, 0.5));
		assert.ok(approx(e.velocityDeviation, 10));
		assert.ok(approx(e.releaseVelocity, 40));
	});

	it('modifies notes in place with applyNoteModifications', async () => {
		const notes = await clip.getNotes();
		notes.forEach((n) => (n.velocity = 33));

		await clip.applyNoteModifications(notes);

		(await clip.getNotes()).forEach((n) => assert.equal(n.velocity, 33));
	});

	it('selects all notes and reads the selection', async () => {
		await clip.selectAllNotes();
		const selected = await clip.getSelectedNotes();

		assert.equal(selected.length, 3);

		await clip.deselectAllNotes();
		assert.equal((await clip.getSelectedNotes()).length, 0);
	});

	it('quantizes notes onto the grid', async () => {
		await clip.removeNotes();
		await clip.addNewNotes([new Note(72, 0.1, 0.25, 100)]);

		// 5 = 1/16 in Live's quantization grid enum
		await clip.quantize(5, 1);

		const [note] = await clip.getNotes(0, 256, 72, 1);
		assert.ok(approx(note.start, 0), `start is ${note.start}`);
	});

	it('removes notes by id', async () => {
		const before = await clip.getNotes();
		await clip.removeNotesById([before[0].id]);

		const after = await clip.getNotes();
		assert.equal(after.length, before.length - 1);
		assert.ok(!after.some((n) => n.id === before[0].id));
	});

	it('removes notes by range', async () => {
		await clip.removeNotes();

		assert.deepEqual(await clip.getNotes(), []);
	});

	it('changes loop points', async () => {
		await clip.set('looping', true);
		await clip.set('loop_end', 4);

		assert.equal(await clip.get('loop_end'), 4);
	});

	it('fires and stops the clip', async () => {
		try {
			await clip.fire();
			await waitFor(async () => (await clip.get('is_triggered')) || (await clip.get('is_playing')), {
				message: 'clip to be triggered',
			});
		} finally {
			await clip.stop();
			await live.song.stopPlaying();
		}
	});

	it('deletes the clip from its slot', async () => {
		const [slot] = await track.children('clip_slots');
		await slot.deleteClip();

		const [after] = await track.children('clip_slots');
		assert.equal(after.hasClip, false);
	});

	it('creates an arrangement MIDI clip', async () => {
		await track.createMidiClip(0, 4);

		const arrangementClips = await track.children('arrangement_clips');

		assert.equal(arrangementClips.length, 1);
		assert.ok(arrangementClips[0].id);
		assert.equal(await live.get('', 'length', arrangementClips[0].id), 4);
	});
});
