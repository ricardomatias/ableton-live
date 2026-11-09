import { AbletonLiveBase } from './AbletonLiveBase';
import {
	Device,
	DeviceChildrenProperties,
	DeviceGetProperties,
	DeviceObservableProperties,
	DeviceSetProperties,
	DeviceTransformedProperties,
	RawDevice,
} from './Device';
import type { ClipSlot } from './ClipSlot';

export interface LooperDeviceGetProperties extends DeviceGetProperties {
	/**
	 * The length of Looper's buffer.
	 */
	loop_length: number;
	/**
	 * true = Looper switches to overdub after recording a fixed number of bars.
	 * false = it switches to playback without overdubbing.
	 */
	overdub_after_record: boolean;
	/**
	 * The index of the Record Length chooser entry.
	 */
	record_length_index: number;
	/**
	 * The entries of the Record Length chooser.
	 */
	record_length_list: string[];
	/**
	 * The tempo of Looper's buffer.
	 */
	tempo: number;
}

export interface LooperDeviceSetProperties extends DeviceSetProperties {
	/**
	 * @inheritdoc LooperDeviceGetProperties.overdub_after_record
	 */
	overdub_after_record: boolean;
	/**
	 * @inheritdoc LooperDeviceGetProperties.record_length_index
	 */
	record_length_index: number;
}

export interface LooperDeviceObservableProperties extends DeviceObservableProperties, LooperDeviceSetProperties {
	/**
	 * @inheritdoc LooperDeviceGetProperties.loop_length
	 */
	loop_length: number;
	/**
	 * @inheritdoc LooperDeviceGetProperties.tempo
	 */
	tempo: number;
}

/**
 * `class_name` of Looper.
 */
export const LooperDeviceClassName = 'Looper';

/**
 * This class represents a Looper device.
 *
 * @class LooperDevice
 * @extends {Device}
 */
export class LooperDevice extends Device<
	LooperDeviceGetProperties,
	DeviceChildrenProperties,
	DeviceTransformedProperties,
	LooperDeviceSetProperties,
	LooperDeviceObservableProperties
> {
	/**
	 * Creates an instance of LooperDevice.
	 * @param {AbletonLiveBase} ableton
	 * @param {RawDevice} raw
	 * @param {string} [path]
	 * @memberof LooperDevice
	 */
	constructor(ableton: AbletonLiveBase, raw: RawDevice, path?: string) {
		super(ableton, raw, path);
	}

	/**
	 * Exports Looper's content into an empty clip slot of a non-frozen audio track.
	 *
	 * Available since Live 12.1.
	 *
	 * @memberof LooperDevice
	 * @param {ClipSlot} clipSlot an empty clip slot
	 * @return {Promise<void>}
	 */
	public async exportToClipSlot(clipSlot: ClipSlot): Promise<void> {
		return this.call('export_to_clip_slot', [`id ${clipSlot.id}`]);
	}

	/**
	 * Erases Looper's recorded content.
	 * @memberof LooperDevice
	 *
	 * @return {Promise<void>}
	 */
	public async clear(): Promise<void> {
		return this.call('clear');
	}

	/**
	 * Doubles the speed of Looper's playback.
	 * @memberof LooperDevice
	 *
	 * @return {Promise<void>}
	 */
	public async doubleSpeed(): Promise<void> {
		return this.call('double_speed');
	}

	/**
	 * Halves the speed of Looper's playback.
	 * @memberof LooperDevice
	 *
	 * @return {Promise<void>}
	 */
	public async halfSpeed(): Promise<void> {
		return this.call('half_speed');
	}

	/**
	 * Doubles the length of Looper's buffer.
	 * @memberof LooperDevice
	 *
	 * @return {Promise<void>}
	 */
	public async doubleLength(): Promise<void> {
		return this.call('double_length');
	}

	/**
	 * Halves the length of Looper's buffer.
	 * @memberof LooperDevice
	 *
	 * @return {Promise<void>}
	 */
	public async halfLength(): Promise<void> {
		return this.call('half_length');
	}

	/**
	 * Records incoming audio.
	 * @memberof LooperDevice
	 *
	 * @return {Promise<void>}
	 */
	public async record(): Promise<void> {
		return this.call('record');
	}

	/**
	 * Plays back while adding additional layers of incoming audio.
	 * @memberof LooperDevice
	 *
	 * @return {Promise<void>}
	 */
	public async overdub(): Promise<void> {
		return this.call('overdub');
	}

	/**
	 * Plays back without overdubbing.
	 * @memberof LooperDevice
	 *
	 * @return {Promise<void>}
	 */
	public async play(): Promise<void> {
		return this.call('play');
	}

	/**
	 * Stops Looper's playback.
	 * @memberof LooperDevice
	 *
	 * @return {Promise<void>}
	 */
	public async stop(): Promise<void> {
		return this.call('stop');
	}

	/**
	 * Erases everything that was recorded since the last time Overdub was enabled.
	 * @memberof LooperDevice
	 *
	 * @return {Promise<void>}
	 */
	public async undo(): Promise<void> {
		return this.call('undo');
	}

	/** @ignore */
	get [Symbol.toStringTag](): string {
		return `LooperDevice <${this.name}>`;
	}
}
