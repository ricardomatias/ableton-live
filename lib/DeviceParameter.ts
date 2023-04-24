import { AbletonLive } from '.';
import { Properties } from './Properties';

export enum AutomationState {
	None = 'none',
	Overridden = 'overridden',
	Playing = 'playing',
}

export enum ParameterState {
	/**
	 * the parameter is active and can be changed
	 */
	Disabled = 'disabled',
	/**
	 * the parameter can be changed but isn't active, so changes won't have an audible effect.
	 */
	Enabled = 'enabled',
	/**
	 *  the parameter cannot be changed.
	 */
	Irrelevant = 'irrelevant',
}

export interface DeviceParameterGetProperties {
	/**
	 * Get the automation state of the parameter.
	 */
	automation_state: AutomationState;
	/**
	 * Get the default value for this parameter.
	 * Only available for parameters that aren't quantized (see `is_quantized`).
	 */
	default_value: string;
	/**
	 * 1 = the parameter value can be modified directly by the user, by sending set to a live.object , by automation or by an assigned MIDI message or keystroke.
	 * Parameters can be disabled because they are macro-controlled, or they are controlled by a live-remote~ object, or because Live thinks that they should not be moved.
	 */
	is_enabled: boolean;
	/**
	 * 1 for booleans and enums </br>
	 * 0 for int/float parameters </br>
	 * Although parameters like MidiPitch.Pitch appear quantized to the user, they actually have an `is_quantized` value of 0.
	 */
	is_quantized: boolean;
	/**
	 * Lowest allowed value.
	 */
	max: number;
	/**
	 * Largest allowed value.
	 */
	min: number;
	/**
	 * The short parameter name as shown in the (closed) automation chooser.
	 */
	name: string;
	/**
	 * The name of a Macro parameter before its assignment.
	 */
	original_name: string;
	/**
	 * The active state of the parameter.
	 */
	state: ParameterState;
	/**
	 * Linear-to-GUI value between min and max.
	 */
	value: number;
	/**
	 * Get a list of the possible values for this parameter.
	 * Only available for parameters that are quantized (see `is_quantized`).
	 */
	value_items: string[];
}

// export interface ChildrenProperties { }

// export interface TransformedProperties { }

export interface DeviceParameterSetProperties {
	/**
	 * @inheritdoc DeviceParameterGetProperties.value
	 */
	value: number;
}

export interface DeviceParameterObservableProperties {
	/**
	 * @inheritdoc DeviceParameterGetProperties.automation_state
	 */
	automation_state: AutomationState;
	/**
	 * @inheritdoc DeviceParameterGetProperties.name
	 */
	name: string;
	/**
	 * @inheritdoc DeviceParameterGetProperties.state
	 */
	state: ParameterState;
	/**
	 * @inheritdoc DeviceParameterGetProperties.value
	 */
	value: number;
}

export interface RawDeviceParameter {
	id: number;
	path:string;
	name: string;
	value: number;
	is_quantized: boolean;
}

export const RawDeviceParameterKeys = [ 'name', 'value', 'is_quantized' ];

/**
 * This class represents an (automatable) parameter within a MIDI or audio device.
 *  To modify a device parameter, set its value property.
 *
 * @class DeviceParameter
 * @extends {Properties<DeviceParameterGetProperties, null, null, DeviceParameterSetProperties, DeviceParameterObservableProperties>}
 */
export class DeviceParameter extends Properties<
	DeviceParameterGetProperties,
	null,
	null,
	DeviceParameterSetProperties,
	DeviceParameterObservableProperties
> {
	static path = 'live_set tracks N devices M parameters L';
	private _name: string;
	private _value: number;
	private _isQuantized: boolean;

	/**
	 * Creates an instance of DeviceParameter.
	 * @param {AbletonLive} ableton
	 * @param {RawDeviceParameter} raw
	 * @param {string} [path]
	 * @memberof DeviceParameter
	 */
	constructor(ableton: AbletonLive, public raw: RawDeviceParameter, path?: string) {
		super(ableton, 'device_parameter', path ?? raw.path);

		this._id = raw.id;

		this._name = raw.name;
		this._value = raw.value;
		this._isQuantized = raw.is_quantized;
	}

	get name(): string {
		return this._name;
	}

	get value(): number {
		return this._value;
	}

	get isQuantized(): boolean {
		return this._isQuantized;
	}

	/**
	 * Re-enable automation for this parameter.
	 *
	 * @returns {Promise<void>}
	 * @memberof DeviceParameter
	 */
	public async reEnableAutomation(): Promise<void> {
		return this.call('re_enable_automation', []);
	}

	/**
	 *  Returns: [symbol] String representation of the specified value.
	 *
	 * @returns {Promise<string>}
	 * @memberof DeviceParameter
	 */
	public async strForValue(value: number): Promise<string> {
		return this.call('str_for_value', [ value ]);
	}

	/**
	 *  Returns: [symbol] String representation of the current parameter value.
	 *
	 * @returns {Promise<string>}
	 * @memberof DeviceParameter
	 */
	public async str(): Promise<string> {
		return this.call('__str__', []);
	}
}
