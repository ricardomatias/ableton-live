/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-ignore

import maxApi from 'max-api';
import { AbletonLiveOffline, Command } from '../../../lib';

const live = new AbletonLiveOffline((command: Command) => {
	console.log('command', command.action);

	maxApi.outlet(command.action, JSON.stringify(command, null, '\t'));
	maxApi.outlet('message', command);
});

maxApi.addHandler('response', live.handleCommandResponse);

maxApi.addHandler('bang', async () => {
	// console.log('got banged');
	let tracks = await live.song.children('tracks');
	console.log('tracks', tracks);

	await live.song.createAudioTrack(-1);
	await live.song.createAudioTrack(-1);
	await live.song.createAudioTrack(-1);
	await live.song.createAudioTrack(-1);

	tracks = await live.song.children('tracks');

	console.log('tracks', tracks);

});

maxApi.registerShutdownHook((signal) => {
	maxApi.post('Exiting with code: ', signal);
});

