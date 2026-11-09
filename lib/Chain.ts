import { Properties } from './Properties';
import { AbletonLiveBase } from './AbletonLiveBase';
import { Device, RawDevice } from './Device';
import { ChainMixerDevice, RawChainMixerDevice } from './ChainMixerDevice';
import { createDevice } from './createDevice';

// ! DrumChain extends Chain, so both live in this module.
// ! Keeping them together means no `extends` ever crosses the
// ! Chain → createDevice → RackDevice → Chain import cycle.

export interface ChainGetProperties {
	/**
	 * The RGB value of the chain's color in the form `0x00rrggbb`.
	 */
	color: number;
	/**
	 * The color index of the chain.
	 */
	color_index: number;
	/**
	 * true = the chain will always have the color of the containing track or chain.
	 */
	is_auto_colored: boolean;
	has_audio_input: boolean;
	has_audio_output: boolean;
	has_midi_input: boolean;
	has_midi_output: boolean;
	/**
	 * true = muted (Chain Activator off)
	 */
	mute: boolean;
	/**
	 * true = muted due to another chain being soloed.
	 */
	muted_via_solo: boolean;
	/**
	 * The name of the chain.
	 */
	name: string;
	/**
	 * true = soloed (Solo switch on). Does not automatically turn Solo off in other chains.
	 */
	solo: boolean;
}

export interface ChainChildrenProperties {
	devices: RawDevice[];
	mixer_device: RawChainMixerDevice[];
}

export interface ChainTransformedProperties {
	devices: Device[];
	mixer_device: ChainMixerDevice;
}

export interface ChainSetProperties {
	/**
	 * @inheritdoc ChainGetProperties.color
	 */
	color: number;
	/**
	 * @inheritdoc ChainGetProperties.color_index
	 */
	color_index: number;
	/**
	 * @inheritdoc ChainGetProperties.is_auto_colored
	 */
	is_auto_colored: boolean;
	/**
	 * @inheritdoc ChainGetProperties.mute
	 */
	mute: boolean;
	/**
	 * @inheritdoc ChainGetProperties.name
	 */
	name: string;
	/**
	 * @inheritdoc ChainGetProperties.solo
	 */
	solo: boolean;
}

export interface ChainObservableProperties extends ChainSetProperties {
	/**
	 * @inheritdoc ChainGetProperties.muted_via_solo
	 */
	muted_via_solo: boolean;
}

export interface RawChain {
	id: string;
	path: string;
	name: string;
}

/**
 * @private
 */
export const RawChainKeys = ['name'];

/**
 * This class represents a chain inside a Rack device.
 *
 * @class Chain
 * @extends {Properties<ChainGetProperties, ChainChildrenProperties, ChainTransformedProperties, ChainSetProperties, ChainObservableProperties>}
 */
export class Chain<
	GP extends ChainGetProperties = ChainGetProperties,
	SP extends ChainSetProperties = ChainSetProperties,
	OP extends ChainObservableProperties = ChainObservableProperties,
> extends Properties<GP, ChainChildrenProperties, ChainTransformedProperties, SP, OP> {
	static path = 'live_set tracks $1 devices $2 chains $3';

	private _name: string;

	/**
	 * Creates an instance of Chain.
	 * @param {AbletonLiveBase} ableton
	 * @param {RawChain} raw
	 * @param {string} [path]
	 * @memberof Chain
	 */
	constructor(
		ableton: AbletonLiveBase,
		public raw: RawChain,
		path?: string
	) {
		super(ableton, 'chain', path ?? raw.path, {
			devices: RawDevice,
			mixer_device: [],
		});

		this._id = raw.id;
		this._name = raw.name;

		this.childrenTransformers = {
			devices: (devices) => devices.map((device) => createDevice(this.ableton, device)),
			mixer_device: ([mixerDevice]) => new ChainMixerDevice(this.ableton, mixerDevice),
		};
	}

	/**
	 * The name of the chain when it was fetched
	 *
	 * @readonly
	 * @type {string}
	 * @memberof Chain
	 */
	get name(): string {
		return this._name;
	}

	/**
	 * Deletes the device at the given index.
	 * @memberof Chain
	 *
	 * @param {number} index
	 * @return {Promise<void>}
	 */
	public async deleteDevice(index: number): Promise<void> {
		return this.call('delete_device', [index]);
	}

	/**
	 * Inserts a native Live device into this chain, by the name shown in Live's browser.
	 * Max for Live devices and plug-ins are not supported.
	 *
	 * Available since Live 12.3.
	 *
	 * @memberof Chain
	 * @param {string} deviceName f.ex. `Reverb`, `Operator`
	 * @param {number} [targetIndex] position in the chain; appended at the end when omitted
	 * @return {Promise<void>}
	 */
	public async insertDevice(deviceName: string, targetIndex?: number): Promise<void> {
		const parameters: (string | number)[] = [deviceName];
		if (targetIndex !== undefined) parameters.push(targetIndex);

		return this.call('insert_device', parameters);
	}

	/** @ignore */
	get [Symbol.toStringTag](): string {
		return `Chain <${this.name}>`;
	}
}

export interface DrumChainGetProperties extends ChainGetProperties {
	/**
	 * The MIDI note that triggers this chain. `-1` corresponds to "All Notes" in the UI.
	 *
	 * Available since Live 12.3.
	 */
	in_note: number;
	/**
	 * The MIDI note sent to the devices in the chain.
	 */
	out_note: number;
	/**
	 * The chain's choke group.
	 */
	choke_group: number;
}

export interface DrumChainSetProperties extends ChainSetProperties {
	/**
	 * @inheritdoc DrumChainGetProperties.in_note
	 */
	in_note: number;
	/**
	 * @inheritdoc DrumChainGetProperties.out_note
	 */
	out_note: number;
	/**
	 * @inheritdoc DrumChainGetProperties.choke_group
	 */
	choke_group: number;
}

export interface DrumChainObservableProperties extends ChainObservableProperties, DrumChainSetProperties {}

/**
 * This class represents a chain inside a Drum Rack.
 *
 * @class DrumChain
 * @extends {Chain}
 */
export class DrumChain extends Chain<DrumChainGetProperties, DrumChainSetProperties, DrumChainObservableProperties> {
	/** @ignore */
	get [Symbol.toStringTag](): string {
		return `DrumChain <${this.name}>`;
	}
}
