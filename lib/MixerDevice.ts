import { DeviceParameter, RawDeviceParameter, RawDeviceParameterKeys } from './DeviceParameter';
import { Properties } from './Properties';
import { AbletonLive } from '.';

// TODO Missing properties
// > cue_volume

/**
 *  [not in master track]
 */
export const enum CrossfadeAssign {
	A = 0,
	none = 1,
	B = 2,
}

export const enum PanningMode {
	Stereo = 0,
	SplitStereo = 1,
}

export interface MixerDeviceGetProperties {
	crossfade_assign: CrossfadeAssign;
	/**
	 * Access to the Track mixer's pan mode
	 */
	panning_mode: PanningMode;
}

export interface MixerDeviceChildrenProperties {
	/**
	 * One send per return track.
	 */
	sends: RawDeviceParameter[];
	/**
	 * [in master track only]
	 */
	cue_volume: RawDeviceParameter[];
	/**
	 * [in master track only]
	 */
	crossfader: RawDeviceParameter[];
	/**
	 * The Track's Left Split Stereo Pan Parameter.
	 */
	left_split_stereo: RawDeviceParameter[];
	/**
	 * The Track's Left Split Stereo Pan Parameter.
	 */
	right_split_stereo: RawDeviceParameter[];
	panning: RawDeviceParameter[];
	/**
	 * [in master track only]
	 */
	song_tempo: RawDeviceParameter[];
	volume: RawDeviceParameter[];
	track_activator: RawDeviceParameter[];
}

export interface MixerDeviceTransformedProperties {
	sends: DeviceParameter;
	cue_volume: DeviceParameter;
	crossfader: DeviceParameter;
	left_split_stereo: DeviceParameter;
	right_split_stereo: DeviceParameter;
	panning: DeviceParameter;
	song_tempo: DeviceParameter;
	volume: DeviceParameter;
	track_activator: DeviceParameter;
}

export interface MixerDeviceSetProperties {
	crossfade_assign: CrossfadeAssign;
	/**
	 * @inheritdoc MixerDeviceGetProperties.panning_mode
	 */
	panning_mode: PanningMode;
}
export interface MixerDeviceObservableProperties {
	crossfade_assign: CrossfadeAssign;
	/**
	 * @inheritdoc MixerDeviceGetProperties.panning_mode
	 */
	panning_mode: PanningMode;
}

export interface RawMixerDevice {
	id: number;
	path:string;
	volume: RawDeviceParameter;
	panning: RawDeviceParameter;
}

export const RawMixerDeviceKeys = [
	{ name: 'volume', initialProps: RawDeviceParameterKeys },
	{ name: 'panning', initialProps: RawDeviceParameterKeys },
];

const childrenInitialProps = {
	volume: RawDeviceParameterKeys,
	panning: RawDeviceParameterKeys,
	sends: RawDeviceParameterKeys,
};

/**
 * This class represents a mixer device in Live.
 * It provides access to volume, panning and other DeviceParameter objects.
 * See [[DeviceParameter]] to learn how to modify them.
 *
 * @class MixerDevice
 * @extends {Properties<MixerDeviceGetProperties, MixerDeviceChildrenProperties, MixerDeviceTransformedProperties, MixerDeviceSetProperties, MixerDeviceObservableProperties>}
 */
export class MixerDevice extends Properties<
	MixerDeviceGetProperties,
	MixerDeviceChildrenProperties,
	MixerDeviceTransformedProperties,
	MixerDeviceSetProperties,
	MixerDeviceObservableProperties
> {
	static path = 'live_set tracks $1 mixer_device';
	private _volume: DeviceParameter;
	private _panning: DeviceParameter;

	constructor(ableton: AbletonLive, public raw: RawMixerDevice, path?: string) {
		super(ableton, 'mixer_device', path ?? raw.path, childrenInitialProps);

		this._id = raw.id;
		this._volume = new DeviceParameter(this.ableton, raw.volume);
		this._panning = new DeviceParameter(this.ableton, raw.panning);

		this.childrenTransformers = {
			sends: (parameters) => (parameters.map((deviceParameter) => new DeviceParameter(this.ableton, deviceParameter))),
		};
	}

	get volume(): DeviceParameter {
		return this._volume;
	}

	get panning(): DeviceParameter {
		return this._panning;
	}
}
