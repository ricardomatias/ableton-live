import { RawDeviceParameterKeys, DeviceParameter, RawDeviceParameter } from './DeviceParameter';
import { Properties } from './Properties';
import { AbletonLiveBase } from './AbletonLiveBase';

export enum DeviceType {
	AudioEffect = 'audio_effect',
	Instrument = 'instrument',
	MidiEffect = 'midi_effect',
	Undefined = 'undefined',
}

/** Live reports `type` as a number: 0 = undefined, 1 = instrument, 2 = audio effect, 4 = MIDI effect. */
const LiveDeviceTypes: Record<number, DeviceType> = {
	0: DeviceType.Undefined,
	1: DeviceType.Instrument,
	2: DeviceType.AudioEffect,
	4: DeviceType.MidiEffect,
};

function toDeviceType(type: number | DeviceType): DeviceType {
	return typeof type === 'number' ? (LiveDeviceTypes[type] ?? DeviceType.Undefined) : type;
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
	/**
	 * true = the device supports A/B preset comparison.
	 *
	 * Available since Live 12.3.
	 */
	can_compare_ab: boolean;
	/**
	 * true = the device is currently using preset B of its A/B comparison.
	 *
	 * Available since Live 12.3.
	 */
	is_using_compare_preset_b: boolean;
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
	/**
	 * @inheritdoc DeviceGetProperties.is_using_compare_preset_b
	 */
	is_using_compare_preset_b: boolean;
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
	/**
	 * @inheritdoc DeviceGetProperties.is_using_compare_preset_b
	 */
	is_using_compare_preset_b: boolean;
	// parameters: string;
}

export interface RawDevice {
	id: string;
	path?: string;
	name: string;
	type: DeviceType;
	class_name: string;
	class_display_name: string;
}

export const RawDevice = ['name', 'type', 'class_name', 'class_display_name'];

const initialProps = {
	parameters: RawDeviceParameterKeys,
};

/**
 * This class represents a MIDI or audio device in Live.
 *
 * Specialised devices (racks, Simpler, plug-ins, Looper) extend this class with their own properties.
 * Use `createDevice` to get the right subclass for a raw device.
 *
 * @class Device
 * @extends {Properties<DeviceGetProperties, DeviceChildrenProperties, DeviceTransformedProperties, DeviceSetProperties, DeviceObservableProperties>}
 */
export class Device<
	GP extends DeviceGetProperties = DeviceGetProperties,
	CP extends DeviceChildrenProperties = DeviceChildrenProperties,
	TP extends DeviceTransformedProperties = DeviceTransformedProperties,
	SP extends DeviceSetProperties = DeviceSetProperties,
	OP extends DeviceObservableProperties = DeviceObservableProperties,
> extends Properties<GP, CP, TP, SP, OP> {
	static path = 'live_set tracks $1 devices';
	private _name: string;
	private _type: DeviceType;
	private _className: string;
	private _classDisplayName: string;

	constructor(
		ableton: AbletonLiveBase,
		public raw: RawDevice,
		path?: string
	) {
		super(ableton, 'device', path ?? raw.path ?? Device.path, initialProps as any);

		this._id = raw.id;
		this._name = raw.name;
		this._type = toDeviceType(raw.type);
		this._className = raw.class_name;
		this._classDisplayName = raw.class_display_name;

		this.getterTransformers = {
			type: toDeviceType,
		} as any;

		this.childrenTransformers = {
			parameters: (parameters: RawDeviceParameter[]) =>
				parameters.map((parameter) => new DeviceParameter(this.ableton, parameter)),
		} as any;
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

	/**
	 * Stores the current device state in the A/B comparison slot that is not in use.
	 * Same as "Compare: Copy A to B / Copy B to A" in the device title bar.
	 *
	 * Available since Live 12.3.
	 *
	 * @memberof Device
	 * @return {Promise<void>}
	 */
	public async savePresetToCompareAbSlot(): Promise<void> {
		return this.call('save_preset_to_compare_ab_slot');
	}

	/**
	 * Switches between preset A and preset B of the device's A/B comparison.
	 *
	 * Available since Live 12.3.
	 *
	 * @memberof Device
	 * @param {boolean} useB true = switch to B, false = switch to A
	 * @return {Promise<null>}
	 */
	public async compareAb(useB: boolean): Promise<null> {
		return this.set('is_using_compare_preset_b', useB as SP['is_using_compare_preset_b']);
	}
}
