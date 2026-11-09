import { Properties } from './Properties';
import { AbletonLiveBase } from './AbletonLiveBase';
import { DeviceParameter, RawDeviceParameter, RawDeviceParameterKeys } from './DeviceParameter';

export interface ChainMixerDeviceChildrenProperties {
	/**
	 * Send parameters. Only in Drum Racks; empty for other Racks.
	 */
	sends: RawDeviceParameter[];
	/**
	 * The chain's activator (on/off) parameter.
	 */
	chain_activator: RawDeviceParameter[];
	/**
	 * Only in Audio Effect Racks and Instrument Racks.
	 */
	panning: RawDeviceParameter[];
	/**
	 * Only in Audio Effect Racks and Instrument Racks.
	 */
	volume: RawDeviceParameter[];
}

export interface ChainMixerDeviceTransformedProperties {
	sends: DeviceParameter[];
	chain_activator: DeviceParameter;
	panning: DeviceParameter;
	volume: DeviceParameter;
}

export interface RawChainMixerDevice {
	id: string;
	path: string;
}

/**
 * This class represents the mixer of a Rack chain.
 *
 * @class ChainMixerDevice
 * @extends {Properties<null, ChainMixerDeviceChildrenProperties, ChainMixerDeviceTransformedProperties, null, null>}
 */
export class ChainMixerDevice extends Properties<
	null,
	ChainMixerDeviceChildrenProperties,
	ChainMixerDeviceTransformedProperties,
	null,
	null
> {
	static path = 'live_set tracks $1 devices $2 chains $3 mixer_device';

	/**
	 * Creates an instance of ChainMixerDevice.
	 * @param {AbletonLiveBase} ableton
	 * @param {RawChainMixerDevice} raw
	 * @param {string} [path]
	 * @memberof ChainMixerDevice
	 */
	constructor(
		ableton: AbletonLiveBase,
		public raw: RawChainMixerDevice,
		path?: string
	) {
		super(ableton, 'chain_mixer_device', path ?? raw.path, {
			sends: RawDeviceParameterKeys,
			chain_activator: RawDeviceParameterKeys,
			panning: RawDeviceParameterKeys,
			volume: RawDeviceParameterKeys,
		});

		this._id = raw.id;

		const single = ([parameter]: RawDeviceParameter[]) =>
			parameter && parameter.id !== '0' ? new DeviceParameter(this.ableton, parameter) : null;

		this.childrenTransformers = {
			sends: (parameters) => parameters.map((parameter) => new DeviceParameter(this.ableton, parameter)),
			chain_activator: single,
			panning: single,
			volume: single,
		};
	}
}
