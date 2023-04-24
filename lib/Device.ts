import { RawDeviceParameterKeys, DeviceParameter, RawDeviceParameter } from './DeviceParameter';
import { Properties } from './Properties';
import { AbletonLive } from './AbletonLive';

export enum DeviceType {
	AudioEffect = 'audio_effect',
	Instrument = 'instrument',
	MidiEffect = 'midi_effect',
	Undefined = 'undefined',
}

export interface DeviceGetProperties {
	/**
	 * false for a single device</br>
	 * true for a device Rack
	 */
	can_have_chains: boolean;
	/**
	 * true for Drum Racks
	 */
	can_have_drum_pads: boolean;
	/**
	 * Get the original name of the device (e.g. `Operator`, `Auto Filter`).
	 */
	class_display_name: string;
	/**
	 * Live device type such as `MidiChord` , `Operator` , `Limiter` , `MxDeviceAudioEffect` , or `PluginDevice` .
	 */
	class_name: string;
	/**
	 * false = either the device itself or its enclosing Rack device is off.
	 */
	is_active: boolean;
	/**
	 * This is the string shown in the title bar of the device.
	 */
	name: string;
	/**
	 * The type of the device
	 */
	type: DeviceType;
}

export interface DeviceChildrenProperties {
	/**
	 * Only automatable parameters are accessible. See DeviceParameter to learn how to modify them.
	 */
	parameters: RawDeviceParameter[];
}

export interface DeviceTransformedProperties {
	/**
	 * @inheritdoc DeviceChildrenProperties.parameters
	 */
	parameters: DeviceParameter[];
}

export interface DeviceSetProperties {
	/**
	 * @inheritdoc DeviceGetProperties.name
	 */
	name: string;
	/**
	 * @inheritdoc DeviceGetProperties.is_active
	 */
	is_active: boolean;
}

export interface DeviceObservableProperties {
	/**
	 * @inheritdoc DeviceGetProperties.name
	 */
	name: string;
	/**
	 * @inheritdoc DeviceGetProperties.is_active
	 */
	is_active: boolean;
	// parameters: string;
}

export interface RawDevice {
	id: string;
	path:string;
	name: string;
	type: DeviceType;
	class_name: string;
	class_display_name: string;
}

export const RawDevice = [ 'name', 'type', 'class_name', 'class_display_name' ];

const initialProps = {
	parameters: RawDeviceParameterKeys,
};

/**
 * This class represents a MIDI or audio device in Live.
 *
 * @class Device
 * @extends {Properties<DeviceGetProperties, DeviceChildrenProperties, DeviceTransformedProperties, DeviceSetProperties, DeviceObservableProperties>}
 */
export class Device extends Properties<
	DeviceGetProperties,
	DeviceChildrenProperties,
	DeviceTransformedProperties,
	DeviceSetProperties,
	DeviceObservableProperties
> {
	static path = 'live_set tracks $1 devices';
	private _name: string;
	private _type: DeviceType;
	private _className: string;
	private _classDisplayName: string;

	constructor(ableton: AbletonLive, public raw: RawDevice, path?: string) {
		super(ableton, 'device', path ?? raw.path, initialProps);

		this._id = parseInt(raw.id, 10);
		this._name = raw.name;
		this._type = raw.type;
		this._className = raw.class_name;
		this._classDisplayName = raw.class_display_name;

		this.childrenTransformers = {
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
