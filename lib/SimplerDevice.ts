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

export const enum SimplerPlaybackMode {
	Classic = 0,
	OneShot = 1,
	Slicing = 2,
}

export const enum SimplerSlicingPlaybackMode {
	Mono = 0,
	Poly = 1,
	Thru = 2,
}

export interface SimplerDeviceGetProperties extends DeviceGetProperties {
	/**
	 * true = `warpAs` is available.
	 */
	can_warp_as: boolean;
	/**
	 * true = `warpDouble` is available.
	 */
	can_warp_double: boolean;
	/**
	 * true = `warpHalf` is available.
	 */
	can_warp_half: boolean;
	/**
	 * true = Simpler is in multisample mode.
	 */
	multi_sample_mode: boolean;
	/**
	 * true = slices can be added in Slicing Mode by playing notes which are not yet assigned to existing slices.
	 */
	pad_slicing: boolean;
	/**
	 * 0 = Classic Mode, 1 = One-Shot Mode, 2 = Slicing Mode
	 */
	playback_mode: SimplerPlaybackMode;
	/**
	 * The current playing position in the sample, a value between 0 and 1.
	 */
	playing_position: number;
	/**
	 * true = Simpler is playing back the sample and showing the playing position.
	 */
	playing_position_enabled: boolean;
	/**
	 * true = Retrigger is enabled.
	 */
	retrigger: boolean;
	/**
	 * Playback mode in Slicing Mode: 0 = Mono, 1 = Poly, 2 = Thru
	 */
	slicing_playback_mode: SimplerSlicingPlaybackMode;
	/**
	 * The number of voices.
	 */
	voices: number;
}

export interface SimplerDeviceSetProperties extends DeviceSetProperties {
	/**
	 * @inheritdoc SimplerDeviceGetProperties.pad_slicing
	 */
	pad_slicing: boolean;
	/**
	 * @inheritdoc SimplerDeviceGetProperties.playback_mode
	 */
	playback_mode: SimplerPlaybackMode;
	/**
	 * @inheritdoc SimplerDeviceGetProperties.retrigger
	 */
	retrigger: boolean;
	/**
	 * @inheritdoc SimplerDeviceGetProperties.slicing_playback_mode
	 */
	slicing_playback_mode: SimplerSlicingPlaybackMode;
	/**
	 * @inheritdoc SimplerDeviceGetProperties.voices
	 */
	voices: number;
}

export interface SimplerDeviceObservableProperties extends DeviceObservableProperties, SimplerDeviceSetProperties {
	/**
	 * @inheritdoc SimplerDeviceGetProperties.can_warp_as
	 */
	can_warp_as: boolean;
	/**
	 * @inheritdoc SimplerDeviceGetProperties.can_warp_double
	 */
	can_warp_double: boolean;
	/**
	 * @inheritdoc SimplerDeviceGetProperties.can_warp_half
	 */
	can_warp_half: boolean;
	/**
	 * @inheritdoc SimplerDeviceGetProperties.multi_sample_mode
	 */
	multi_sample_mode: boolean;
	/**
	 * @inheritdoc SimplerDeviceGetProperties.playing_position
	 */
	playing_position: number;
	/**
	 * @inheritdoc SimplerDeviceGetProperties.playing_position_enabled
	 */
	playing_position_enabled: boolean;
}

/**
 * `class_name` of Simpler.
 */
export const SimplerDeviceClassName = 'OriginalSimpler';

/**
 * This class represents a Simpler device.
 *
 * @class SimplerDevice
 * @extends {Device}
 */
export class SimplerDevice extends Device<
	SimplerDeviceGetProperties,
	DeviceChildrenProperties,
	DeviceTransformedProperties,
	SimplerDeviceSetProperties,
	SimplerDeviceObservableProperties
> {
	/**
	 * Creates an instance of SimplerDevice.
	 * @param {AbletonLiveBase} ableton
	 * @param {RawDevice} raw
	 * @param {string} [path]
	 * @memberof SimplerDevice
	 */
	constructor(ableton: AbletonLiveBase, raw: RawDevice, path?: string) {
		super(ableton, raw, path);
	}

	/**
	 * Replaces the sample loaded into Simpler.
	 *
	 * Available since Live 12.4.
	 *
	 * @memberof SimplerDevice
	 * @param {string} filePath absolute path to a valid audio file
	 * @return {Promise<void>}
	 */
	public async replaceSample(filePath: string): Promise<void> {
		return this.call('replace_sample', [filePath]);
	}

	/**
	 * Crops the loaded sample to the active region between the start and end markers.
	 * @memberof SimplerDevice
	 *
	 * @return {Promise<void>}
	 */
	public async crop(): Promise<void> {
		return this.call('crop');
	}

	/**
	 * An estimated beat time for the playback length between the start and end markers.
	 * @memberof SimplerDevice
	 *
	 * @return {Promise<number>}
	 */
	public async guessPlaybackLength(): Promise<number> {
		return this.call('guess_playback_length');
	}

	/**
	 * Reverses the loaded sample.
	 * @memberof SimplerDevice
	 *
	 * @return {Promise<void>}
	 */
	public async reverse(): Promise<void> {
		return this.call('reverse');
	}

	/**
	 * Warps the active region between the start and end markers as the given number of beats.
	 * @memberof SimplerDevice
	 *
	 * @param {number} beats
	 * @return {Promise<void>}
	 */
	public async warpAs(beats: number): Promise<void> {
		return this.call('warp_as', [beats]);
	}

	/**
	 * Doubles the playback tempo of the active region.
	 * @memberof SimplerDevice
	 *
	 * @return {Promise<void>}
	 */
	public async warpDouble(): Promise<void> {
		return this.call('warp_double');
	}

	/**
	 * Halves the playback tempo of the active region.
	 * @memberof SimplerDevice
	 *
	 * @return {Promise<void>}
	 */
	public async warpHalf(): Promise<void> {
		return this.call('warp_half');
	}

	/** @ignore */
	get [Symbol.toStringTag](): string {
		return `SimplerDevice <${this.name}>`;
	}
}
