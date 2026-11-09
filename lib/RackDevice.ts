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
import { DeviceParameter, RawDeviceParameter, RawDeviceParameterKeys } from './DeviceParameter';
import { Chain, DrumChain, RawChain, RawChainKeys } from './Chain';
import { DrumPad, RawDrumPad, RawDrumPadKeys } from './DrumPad';

export interface RackDeviceGetProperties extends DeviceGetProperties {
	/**
	 * true = the Rack contains an instrument device that is capable of showing its chains in Session View.
	 */
	can_show_chains: boolean;
	/**
	 * true = the device is a Drum Rack with pads. A nested Drum Rack is a Drum Rack without pads.
	 * Only available for Drum Racks.
	 */
	has_drum_pads: boolean;
	/**
	 * true = any of the Rack's Macros are mapped to a parameter.
	 */
	has_macro_mappings: boolean;
	/**
	 * true = the Rack contains an instrument device that is showing its chains in Session View.
	 */
	is_showing_chains: boolean;
	/**
	 * The number of currently stored macro variations.
	 */
	variation_count: number;
	/**
	 * The currently selected macro variation.
	 */
	selected_variation_index: number;
	/**
	 * The number of currently visible macros.
	 */
	visible_macro_count: number;
}

export interface RackDeviceChildrenProperties extends DeviceChildrenProperties {
	/**
	 * Convenience accessor for the Rack's chain selector.
	 */
	chain_selector: RawDeviceParameter[];
	/**
	 * The Rack's chains.
	 */
	chains: RawChain[];
	/**
	 * All 128 Drum Pads for the topmost Drum Rack. Inner Drum Racks return an empty list.
	 */
	drum_pads: RawDrumPad[];
	/**
	 * The Rack's return chains.
	 */
	return_chains: RawChain[];
	/**
	 * All 16 visible Drum Pads for the topmost Drum Rack. Inner Drum Racks return an empty list.
	 */
	visible_drum_pads: RawDrumPad[];
}

export interface RackDeviceTransformedProperties extends DeviceTransformedProperties {
	chain_selector: DeviceParameter | null;
	/**
	 * `DrumChain`s for Drum Racks, `Chain`s for every other Rack.
	 */
	chains: Chain[];
	drum_pads: DrumPad[];
	return_chains: Chain[];
	visible_drum_pads: DrumPad[];
}

export interface RackDeviceSetProperties extends DeviceSetProperties {
	/**
	 * @inheritdoc RackDeviceGetProperties.is_showing_chains
	 */
	is_showing_chains: boolean;
	/**
	 * @inheritdoc RackDeviceGetProperties.selected_variation_index
	 */
	selected_variation_index: number;
}

export interface RackDeviceObservableProperties extends DeviceObservableProperties {
	/**
	 * @inheritdoc RackDeviceGetProperties.has_drum_pads
	 */
	has_drum_pads: boolean;
	/**
	 * @inheritdoc RackDeviceGetProperties.has_macro_mappings
	 */
	has_macro_mappings: boolean;
	/**
	 * @inheritdoc RackDeviceGetProperties.is_showing_chains
	 */
	is_showing_chains: boolean;
	/**
	 * @inheritdoc RackDeviceGetProperties.variation_count
	 */
	variation_count: number;
	/**
	 * @inheritdoc RackDeviceGetProperties.visible_macro_count
	 */
	visible_macro_count: number;
}

/**
 * `class_name`s of the Rack devices.
 */
export const RackDeviceClassNames = [
	'InstrumentGroupDevice',
	'AudioEffectGroupDevice',
	'MidiEffectGroupDevice',
	'DrumGroupDevice',
];

/**
 * This class represents a Rack device (Instrument, Audio Effect, MIDI Effect or Drum Rack).
 *
 * @class RackDevice
 * @extends {Device}
 */
export class RackDevice extends Device<
	RackDeviceGetProperties,
	RackDeviceChildrenProperties,
	RackDeviceTransformedProperties,
	RackDeviceSetProperties,
	RackDeviceObservableProperties
> {
	/**
	 * Creates an instance of RackDevice.
	 * @param {AbletonLiveBase} ableton
	 * @param {RawDevice} raw
	 * @param {string} [path]
	 * @memberof RackDevice
	 */
	constructor(ableton: AbletonLiveBase, raw: RawDevice, path?: string) {
		super(ableton, raw, path);

		this.childrenInitialProps = {
			...this.childrenInitialProps,
			chain_selector: RawDeviceParameterKeys,
			chains: RawChainKeys,
			return_chains: RawChainKeys,
			drum_pads: RawDrumPadKeys,
			visible_drum_pads: RawDrumPadKeys,
		} as any;

		const toDrumPads = (pads: RawDrumPad[]) => pads.map((pad) => new DrumPad(this.ableton, pad));

		this.childrenTransformers = {
			...this.childrenTransformers,
			chain_selector: ([parameter]: RawDeviceParameter[]) =>
				parameter && parameter.id !== '0' ? new DeviceParameter(this.ableton, parameter) : null,
			chains: (chains: RawChain[]) =>
				chains.map((chain) =>
					this.isDrumRack ? new DrumChain(this.ableton, chain) : new Chain(this.ableton, chain)
				),
			return_chains: (chains: RawChain[]) => chains.map((chain) => new Chain(this.ableton, chain)),
			drum_pads: toDrumPads,
			visible_drum_pads: toDrumPads,
		} as any;
	}

	/**
	 * true = this is a Drum Rack
	 *
	 * @readonly
	 * @type {boolean}
	 * @memberof RackDevice
	 */
	get isDrumRack(): boolean {
		return this.className === 'DrumGroupDevice';
	}

	/**
	 * Copies all content of a Drum Rack pad to another pad.
	 * @memberof RackDevice
	 *
	 * @param {number} sourceIndex
	 * @param {number} destinationIndex
	 * @return {Promise<void>}
	 */
	public async copyPad(sourceIndex: number, destinationIndex: number): Promise<void> {
		return this.call('copy_pad', [sourceIndex, destinationIndex]);
	}

	/**
	 * Inserts a new chain into the Rack. In Drum Racks the new chain's `in_note` defaults to -1 ("All Notes").
	 *
	 * Available since Live 12.3.
	 *
	 * @memberof RackDevice
	 * @param {number} [index] position of the new chain; appended at the end when omitted
	 * @return {Promise<void>}
	 */
	public async insertChain(index?: number): Promise<void> {
		return this.call('insert_chain', index === undefined ? [] : [index]);
	}

	/**
	 * Increases the number of visible macro controls.
	 * @memberof RackDevice
	 *
	 * @return {Promise<void>}
	 */
	public async addMacro(): Promise<void> {
		return this.call('add_macro');
	}

	/**
	 * Decreases the number of visible macro controls.
	 * @memberof RackDevice
	 *
	 * @return {Promise<void>}
	 */
	public async removeMacro(): Promise<void> {
		return this.call('remove_macro');
	}

	/**
	 * Randomizes the values of eligible macro controls.
	 * @memberof RackDevice
	 *
	 * @return {Promise<void>}
	 */
	public async randomizeMacros(): Promise<void> {
		return this.call('randomize_macros');
	}

	/**
	 * Stores a new variation of the values of all currently mapped macros.
	 * @memberof RackDevice
	 *
	 * @return {Promise<void>}
	 */
	public async storeVariation(): Promise<void> {
		return this.call('store_variation');
	}

	/**
	 * Recalls the currently selected macro variation.
	 * @memberof RackDevice
	 *
	 * @return {Promise<void>}
	 */
	public async recallSelectedVariation(): Promise<void> {
		return this.call('recall_selected_variation');
	}

	/**
	 * Recalls the macro variation that was recalled most recently.
	 * @memberof RackDevice
	 *
	 * @return {Promise<void>}
	 */
	public async recallLastUsedVariation(): Promise<void> {
		return this.call('recall_last_used_variation');
	}

	/**
	 * Deletes the currently selected macro variation. Does nothing if there is no selected variation.
	 * @memberof RackDevice
	 *
	 * @return {Promise<void>}
	 */
	public async deleteSelectedVariation(): Promise<void> {
		return this.call('delete_selected_variation');
	}

	/** @ignore */
	get [Symbol.toStringTag](): string {
		return `RackDevice <${this.name}>`;
	}
}
