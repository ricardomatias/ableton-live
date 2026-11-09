import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { connect, approx, DEMO_SET, ClipSlot, Clip, ClipType, DeviceParameter, TrackType } from './helpers.mjs';

describe('Track', () => {
	let live;
	let tracks;

	before(async () => {
		live = await connect();
		tracks = await live.song.children('tracks');
	});
	after(() => live?.close());

	const byName = (name) => tracks.find((t) => t.name === name);

	describe('properties', () => {
		it('reads name, color and state flags', async () => {
			const drums = byName('Drums');

			assert.equal(await drums.get('name'), 'Drums');
			assert.equal(typeof (await drums.get('color')), 'number');
			assert.equal(typeof (await drums.get('mute')), 'boolean');
			assert.equal(typeof (await drums.get('solo')), 'boolean');
			assert.equal(await drums.get('has_midi_input'), true);
			assert.equal(await drums.get('has_audio_input'), false);
		});

		it('derives type from has_audio_input', () => {
			assert.equal(byName('Drums').type, TrackType.Midi);
			assert.equal(byName('Vocal Main').type, TrackType.Audio);
		});

		it('toggles mute and restores it', async () => {
			const track = byName('Mello');
			const original = await track.get('mute');

			try {
				await track.set('mute', !original);
				assert.equal(await track.get('mute'), !original);
			} finally {
				await track.set('mute', original);
			}

			assert.equal(await track.get('mute'), original);
		});

		it('renames a track and restores the name', async () => {
			const track = byName('Mello');

			try {
				await track.set('name', 'Mello (test)');
				assert.equal(await track.get('name'), 'Mello (test)');
			} finally {
				await track.set('name', 'Mello');
			}

			assert.equal(await track.get('name'), 'Mello');
		});

		it('is not a group track', async () => {
			assert.equal(await byName('Drums').get('is_foldable'), false);
		});
	});

	describe('mixer', () => {
		it('exposes volume and panning as DeviceParameters', async () => {
			const track = byName('Rose Bass');
			const volume = await track.volume();
			const panning = await track.panning();

			assert.ok(volume instanceof DeviceParameter);
			assert.ok(panning instanceof DeviceParameter);
			assert.equal(volume.name, 'Track Volume');
			assert.equal(panning.name, 'Track Panning');
			assert.ok(volume.value >= 0 && volume.value <= 1);
			assert.ok(panning.value >= -1 && panning.value <= 1);
		});

		it('sets volume through its DeviceParameter and restores it', async () => {
			const volume = await byName('Rose Bass').volume();
			const original = await volume.get('value');

			try {
				await volume.set('value', 0.5);
				assert.ok(approx(await volume.get('value'), 0.5));
			} finally {
				await volume.set('value', original);
			}

			assert.ok(approx(await volume.get('value'), original));
		});

		it('formats parameter values as strings', async () => {
			const volume = await byName('Rose Bass').volume();

			assert.match(await volume.str(), /dB|inf/);
			assert.match(await volume.strForValue(0.85), /dB/);
		});
	});

	describe('clip slots', () => {
		it('has one clip slot per scene', async () => {
			for (const track of tracks) {
				const slots = await track.children('clip_slots');

				assert.equal(slots.length, DEMO_SET.scenes.length, `${track.name}`);
				slots.forEach((s) => assert.ok(s instanceof ClipSlot));
			}
		});

		it('getClips returns only populated slots', async () => {
			const track = byName('Rainstorm');
			const slots = await track.children('clip_slots');
			const clips = await track.getClips();

			assert.equal(clips.length, slots.filter((s) => s.hasClip).length);
			clips.forEach((c) => assert.ok(c instanceof Clip));
		});

		it('getClip is 1-based and returns the clip in that scene', async () => {
			const track = byName('Rainstorm');
			const slots = await track.children('clip_slots');
			const clip = await track.getClip(1);

			assert.ok(clip instanceof Clip);
			assert.equal(clip.id, (await slots[0].clip()).id);
		});

		it('getClip rejects out-of-range scenes', async () => {
			const track = byName('Rainstorm');

			await assert.rejects(track.getClip(0));
			await assert.rejects(track.getClip(DEMO_SET.scenes.length + 1));
		});

		it('ClipSlot.clip() resolves to null for an empty slot', async () => {
			const track = byName('Coffee Leaf');
			const slots = await track.children('clip_slots');
			const empty = slots.find((s) => !s.hasClip);

			assert.ok(empty, 'expected Coffee Leaf to have an empty slot');
			assert.equal(await empty.clip(), null);
		});

		it('audio tracks hold audio clips, midi tracks hold midi clips', async () => {
			const [audioClip] = await byName('Vocal Main').getClips();
			const [midiClip] = await byName('Drums').getClips();

			assert.equal(audioClip.type, ClipType.Audio);
			assert.equal(midiClip.type, ClipType.Midi);
		});
	});
});
