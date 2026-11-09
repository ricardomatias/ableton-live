import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import {
	connect,
	approx,
	Device,
	DeviceParameter,
	DeviceType,
	RackDevice,
	SimplerDevice,
	DrumPad,
} from './helpers.mjs';

describe('Device', () => {
	let live;
	let tracks;

	before(async () => {
		live = await connect();
		tracks = await live.song.children('tracks');
	});
	after(() => live?.close());

	const devicesOf = async (trackName) => tracks.find((t) => t.name === trackName).children('devices');

	describe('createDevice', () => {
		it('builds a RackDevice for instrument, audio-effect and drum racks', async () => {
			const [strumRack] = await devicesOf('Strum');
			const [drumRack] = await devicesOf('Drums');
			const coffee = await devicesOf('Coffee Leaf');
			const fxRack = coffee.find((d) => d.className === 'AudioEffectGroupDevice');

			assert.ok(strumRack instanceof RackDevice);
			assert.ok(drumRack instanceof RackDevice);
			assert.ok(fxRack instanceof RackDevice);
			assert.equal(drumRack.isDrumRack, true);
			assert.equal(strumRack.isDrumRack, false);
		});

		it('builds a SimplerDevice for Simpler', async () => {
			const [simpler] = await devicesOf('Transform Seed');

			assert.ok(simpler instanceof SimplerDevice);
			assert.equal(simpler.className, 'OriginalSimpler');
		});

		it('builds a plain Device for everything else', async () => {
			const [drift] = await devicesOf('Mello');

			assert.ok(drift instanceof Device);
			assert.ok(!(drift instanceof RackDevice));
			assert.equal(drift.className, 'Drift');
		});
	});

	describe('properties', () => {
		it('exposes name, class name and class display name', async () => {
			const reverb = (await devicesOf('Vocal Hum')).find((d) => d.className === 'Reverb');

			assert.ok(reverb);
			assert.equal(reverb.name, 'Reverb');
			assert.equal(reverb.classDisplayName, 'Reverb');
			assert.equal(await reverb.get('class_name'), 'Reverb');
		});

		it('reports type using the DeviceType enum', async () => {
			const [drift] = await devicesOf('Mello');
			const reverb = (await devicesOf('Vocal Hum')).find((d) => d.className === 'Reverb');

			assert.equal(drift.type, DeviceType.Instrument);
			assert.equal(reverb.type, DeviceType.AudioEffect);
			assert.equal(await drift.get('type'), DeviceType.Instrument);
		});
	});

	describe('parameters', () => {
		it('lists parameters as DeviceParameters, starting with "Device On"', async () => {
			const reverb = (await devicesOf('Vocal Hum')).find((d) => d.className === 'Reverb');
			const params = await reverb.children('parameters');

			assert.ok(params.length > 1);
			params.forEach((p) => assert.ok(p instanceof DeviceParameter));
			assert.equal(params[0].name, 'Device On');
			assert.equal(params[0].isQuantized, true);
		});

		it('reads parameter bounds', async () => {
			const reverb = (await devicesOf('Vocal Hum')).find((d) => d.className === 'Reverb');
			const [, param] = (await reverb.children('parameters')).filter((p) => !p.isQuantized);

			const min = await param.get('min');
			const max = await param.get('max');
			const value = await param.get('value');

			assert.ok(min < max);
			assert.ok(value >= min && value <= max);
		});

		it('sets a continuous parameter and restores it', async () => {
			const reverb = (await devicesOf('Vocal Hum')).find((d) => d.className === 'Reverb');
			const param = (await reverb.children('parameters')).find((p) => !p.isQuantized);
			const original = await param.get('value');
			const min = await param.get('min');
			const max = await param.get('max');
			const target = min + (max - min) / 2;

			try {
				await param.set('value', target);
				assert.ok(approx(await param.get('value'), target, (max - min) * 1e-3));
			} finally {
				await param.set('value', original);
			}

			assert.ok(approx(await param.get('value'), original, (max - min) * 1e-3));
		});

		it('toggles a device off and on via "Device On"', async () => {
			const reverb = (await devicesOf('Vocal Hum')).find((d) => d.className === 'Reverb');
			const [deviceOn] = await reverb.children('parameters');
			const original = await deviceOn.get('value');

			try {
				await deviceOn.set('value', 0);
				assert.equal(await reverb.get('is_active'), false);
			} finally {
				await deviceOn.set('value', original);
			}

			assert.equal(await deviceOn.get('value'), original);
		});
	});

	describe('racks', () => {
		it('lists chains of an instrument rack', async () => {
			const [rack] = await devicesOf('Strum');
			const chains = await rack.children('chains');

			assert.ok(chains.length > 0);
			chains.forEach((c) => assert.equal(typeof c.name, 'string'));
		});

		it('lists the visible drum pads of the Drum Rack', async () => {
			const [drumRack] = await devicesOf('Drums');
			const pads = await drumRack.children('visible_drum_pads');

			assert.equal(pads.length, 16);
			pads.forEach((p) => assert.ok(p instanceof DrumPad));
		});
	});
});
