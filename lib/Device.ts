import { RawDeviceParameter, DeviceParameter } from './DeviceParameter';
import { Properties } from './Properties';
import { AbletonLive } from '.';

export interface GettableProperties {
	can_have_chains: boolean;
	can_have_drum_pads: boolean;
	class_display_name: string;
	class_name: string;
	is_active: boolean;
	name: string;
	type: DeviceType;
}

export interface ChildrenProperties {
	parameters: RawDeviceParameter[];
}

export interface TransformedProperties {
	parameters: DeviceParameter[];
}

export interface SettableProperties {
	name: string;
	is_active: boolean;
}

export interface ObservableProperties {
	is_active: boolean;
	name: string;
	parameters: string;
}

export interface RawDevice {
	id: string;
	name: string;
	type: DeviceType;
	class_name: string;
	class_display_name: string;
}

export const RawDevice = [
	'name',
	'type',
	'class_name',
	'class_display_name',
];

export enum DeviceType {
	AudioEffect = 'audio_effect',
	Instrument = 'instrument',
	MidiEffect = 'midi_effect',
	Undefined = 'undefined',
}

const initialProps = {
	parameters: RawDeviceParameter,
};

export class Device extends Properties<
	GettableProperties,
	ChildrenProperties,
	TransformedProperties,
	SettableProperties,
	ObservableProperties
	> {
	static path = 'live_set tracks $1 devices';
	private _name: string;
	private _type: DeviceType;
	private _className: string;
	private _classDisplayName: string;

	constructor(ableton: AbletonLive, public raw: RawDevice, path?: string) {
		super(ableton, 'device', path ? path : Device.path, initialProps);

		this._id = parseInt(raw.id, 10);
		this._name = raw.name;
		this._type = raw.type;
		this._className = raw.class_name;
		this._classDisplayName = raw.class_display_name;

		this.transformers = {
			parameters: (parameters) => parameters.map((parameter) => new DeviceParameter(this.ableton, parameter)),
		};
	}

	/**
	 * This is the string shown in the title bar of the device
	 *
	 * @readonly
	 * @type {string}
	 * @memberof Device
	 */
	get name(): string {
		return this._name;
	}

	/**
	 * Live device type such as MidiChord , Operator , Limiter , MxDeviceAudioEffect , or PluginDevice.
	 *
	 * @readonly
	 * @type {string}
	 * @memberof Device
	 */
	get className(): string {
		return this._className;
	}

	/**
	 * Get the original name of the device (e.g. Operator, Auto Filter)
	 *
	 * @readonly
	 * @type {string}
	 * @memberof Device
	 */
	get classDisplayName(): string {
		return this._classDisplayName;
	}

	/**
	 * The type of device
	 *
	 * @readonly
	 * @type {'audio_effect' | 'instrument' | 'midi_effect'}
	 * @memberof Device
	 */
	get type(): DeviceType {
		return this._type;
	}
}
