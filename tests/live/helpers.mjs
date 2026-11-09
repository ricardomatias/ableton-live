// Shared setup for the live integration suite.
//
// These tests talk to a real Ableton Live 12 instance running the bundled
// "Live 12 Demo Set" with `external/LiveAPI.amxd` loaded (on the Master track),
// over the WebSocket the device opens on port 9001.
//
// They exercise the *built* Node bundle (`build/esm/node.mjs`), i.e. exactly what
// consumers import, so run `pnpm run build:node` first (`pnpm test:live` does).
import { AbletonLive } from '../../build/esm/node.mjs';

export * from '../../build/esm/node.mjs';

export const HOST = process.env.LIVE_HOST ?? '127.0.0.1';
export const PORT = Number(process.env.LIVE_PORT ?? 9001);

/** What the stock Live 12 Demo Set contains. */
export const DEMO_SET = {
	tracks: [
		'Coffee Leaf',
		'Strum',
		'Drums',
		'The Beat Of History',
		'Mello',
		'Rose Bass',
		'Sub Sub Bass',
		'Guit Layter',
		'Transform Seed',
		'Vacuum',
		'Vocal Main',
		'Vocal Harmony',
		'Vocal Hum',
		'Vocal Adlib',
		'Rainstorm',
	],
	audioTracks: ['Vocal Main', 'Vocal Harmony', 'Vocal Hum', 'Vocal Adlib'],
	scenes: [
		'Intro',
		'Verse 1',
		'Chorus',
		'Verse 2',
		'Chorus',
		'Breakdown',
		'Breakdown',
		'Instrumental',
		'Instrumental',
		'Instrumental',
		'Chorus',
		'Outro',
		'Ending',
	],
	returnTracks: ['A-Reverb', 'B-Delay'],
	cuePoints: 9,
};

/**
 * Opens a connection to the Max for Live device. Fails fast with an actionable
 * message instead of letting every test time out.
 */
export async function connect({ timeoutMs = 5000 } = {}) {
	const live = new AbletonLive({ host: HOST, port: PORT, maxAttempts: 1 });

	let timer;
	const timeout = new Promise((_, reject) => {
		timer = setTimeout(
			() => reject(new Error(`Timed out after ${timeoutMs}ms connecting to ws://${HOST}:${PORT}`)),
			timeoutMs
		);
	});

	try {
		await Promise.race([live.connect(), timeout]);
	} catch (err) {
		throw new Error(
			`Could not reach the LiveAPI device at ws://${HOST}:${PORT}. ` +
				`Is Live open with the Demo Set and LiveAPI.amxd loaded? (${err.message})`,
			{ cause: err }
		);
	} finally {
		clearTimeout(timer);
	}

	return live;
}

/** Resolves once `predicate()` is truthy, polling every `intervalMs`. */
export async function waitFor(predicate, { timeoutMs = 3000, intervalMs = 50, message = 'condition' } = {}) {
	const deadline = Date.now() + timeoutMs;

	while (Date.now() < deadline) {
		if (await predicate()) return;
		await new Promise((resolve) => setTimeout(resolve, intervalMs));
	}

	throw new Error(`Timed out after ${timeoutMs}ms waiting for ${message}`);
}

/**
 * Stops all clips immediately and halts the transport. Goes through the raw
 * `call` with a numeric flag because `Song.stopAllClips()` forwards a boolean,
 * which Live rejects; cleanup must not depend on the code under test.
 */
export async function stopEverything(live) {
	await live.call('live_set', { method: 'stop_all_clips', parameters: [0] });
	await live.song.stopPlaying();
}

/** Live reports floats with float32 precision; compare loosely. */
export function approx(actual, expected, epsilon = 1e-4) {
	return Math.abs(actual - expected) <= epsilon;
}
