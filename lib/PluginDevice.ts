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

export interface PluginDeviceGetProperties extends DeviceGetProperties {
	/**
	 * The opened state of the plug-in's editor window.
	 *
	 * Available since Live 12.4.3.
	 */
	is_editor_open: boolean;
	/**
	 * The list of the plug-in's presets.
	 */
	presets: string[];
	/**
	 * The index of the currently selected preset.
	 */
	selected_preset_index: number;
}

export interface PluginDeviceSetProperties extends DeviceSetProperties {
	/**
	 * @inheritdoc PluginDeviceGetProperties.is_editor_open
	 */
	is_editor_open: boolean;
	/**
	 * @inheritdoc PluginDeviceGetProperties.selected_preset_index
	 */
	selected_preset_index: number;
}

export interface PluginDeviceObservableProperties extends DeviceObservableProperties, PluginDeviceSetProperties {
	/**
	 * @inheritdoc PluginDeviceGetProperties.presets
	 */
	presets: string[];
}

/**
 * `class_name`s of plug-in devices (VST and Audio Unit).
 */
export const PluginDeviceClassNames = ['PluginDevice', 'AuPluginDevice'];

/**
 * This class represents a plug-in device.
 *
 * @class PluginDevice
 * @extends {Device}
 */
export class PluginDevice extends Device<
	PluginDeviceGetProperties,
	DeviceChildrenProperties,
	DeviceTransformedProperties,
	PluginDeviceSetProperties,
	PluginDeviceObservableProperties
> {
	/**
	 * Creates an instance of PluginDevice.
	 * @param {AbletonLiveBase} ableton
	 * @param {RawDevice} raw
	 * @param {string} [path]
	 * @memberof PluginDevice
	 */
	constructor(ableton: AbletonLiveBase, raw: RawDevice, path?: string) {
		super(ableton, raw, path);
	}

	/**
	 * Opens the plug-in's editor window.
	 *
	 * Available since Live 12.4.3.
	 *
	 * @memberof PluginDevice
	 * @return {Promise<null>}
	 */
	public async openEditor(): Promise<null> {
		return this.set('is_editor_open', true);
	}

	/**
	 * Closes the plug-in's editor window.
	 *
	 * Available since Live 12.4.3.
	 *
	 * @memberof PluginDevice
	 * @return {Promise<null>}
	 */
	public async closeEditor(): Promise<null> {
		return this.set('is_editor_open', false);
	}

	/** @ignore */
	get [Symbol.toStringTag](): string {
		return `PluginDevice <${this.name}>`;
	}
}
