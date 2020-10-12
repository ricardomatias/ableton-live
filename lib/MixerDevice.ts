import { DeviceParameter, RawDeviceParameter } from './DeviceParameter';
import { Properties } from './Properties';
import { AbletonLive } from '.';


const enum CrossfadeAssign {
	A = 0,
	none = 1,
	B = 2,
}

const enum PanningMode {
	Stereo = 0,
	SplitStereo = 1,
}

export interface GettableProperties {
	crossfade_assign: CrossfadeAssign;
	panning_mode: PanningMode;
}

export interface ChildrenProperties {
	volume: RawDeviceParameter;
	panning: RawDeviceParameter;
	sends: RawDeviceParameter;
}

export interface TransformedProperties {
	sends: DeviceParameter;
}

export interface SettableProperties {
	crossfade_assign: CrossfadeAssign;
	panning_mode: PanningMode;
}
export interface ObservableProperties {
	crossfade_assign: CrossfadeAssign;
	panning_mode: PanningMode;
}

export interface RawMixerDevice {
	id: number;
	volume: RawDeviceParameter;
	panning: RawDeviceParameter;
}

export const RawMixerDevice = [
	{ name: 'volume', initialProps: RawDeviceParameter },
	{ name: 'panning', initialProps: RawDeviceParameter },
];

const childrenInitialProps = {
	volume: RawDeviceParameter,
	panning: RawDeviceParameter,
};

export class MixerDevice extends Properties<
	GettableProperties,
	ChildrenProperties,
	TransformedProperties,
	SettableProperties,
	ObservableProperties
> {
	static path = 'live_set tracks $1 mixer_device';
	private _volume: DeviceParameter;
	private _panning: DeviceParameter;

	constructor(ableton: AbletonLive, public raw: RawMixerDevice, path?: string) {
		super(ableton, 'mixer_device', path ? path : MixerDevice.path, childrenInitialProps);

		this._id = raw.id;
		this._volume = new DeviceParameter(this.ableton, raw.volume);
		this._panning = new DeviceParameter(this.ableton, raw.panning);

		this.transformers = {
			sends: (deviceParameter) => new DeviceParameter(this.ableton, deviceParameter),
		};
	}

	get volume(): DeviceParameter {
		return this._volume;
	}

	get panning(): DeviceParameter {
		return this._panning;
	}
}
