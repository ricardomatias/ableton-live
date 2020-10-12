import { AbletonLive } from '.';
import { Properties } from './Properties';


export interface GettableProperties {
	automation_state: AutomationState;
	default_value: string;
	is_enabled: boolean;
	is_quantized: boolean;
	max: number;
	min: number;
	name: string;
	original_name: string;
	state: ParameterState;
	value: number;
	value_items: string[];
}

export interface ChildrenProperties { }

export interface TransformedProperties { }

export interface SettableProperties {
	value: number;
}

export interface ObservableProperties {
	automation_state: AutomationState;
	name: string;
	state: ParameterState;
	value: number;
}

export interface RawDeviceParameter {
	id: number;
	name: string;
	value: number;
	is_quantized: boolean;
}

export const RawDeviceParameter = [
	'name',
	'value',
	'is_quantized',
];

export enum AutomationState {
	None = 'none',
	Overridden = 'overridden',
	Playing = 'playing',
}

export enum ParameterState {
	Disabled = 'disabled',
	Enabled = 'enabled',
	Irrelevant = 'irrelevant',
}

export class DeviceParameter extends Properties<
	GettableProperties,
	ChildrenProperties,
	TransformedProperties,
	SettableProperties,
	ObservableProperties
	> {
	static path = 'live_set tracks N devices M parameters L';
	private _name: string;
	private _value: number;
	private _isQuantized: boolean;

	constructor(ableton: AbletonLive, public raw: RawDeviceParameter, path?: string) {
		super(ableton, 'device_parameter', path ? path : DeviceParameter.path);

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
}
