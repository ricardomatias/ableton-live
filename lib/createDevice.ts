import { AbletonLiveBase } from './AbletonLiveBase';
import { Device, RawDevice } from './Device';
import { RackDevice, RackDeviceClassNames } from './RackDevice';
import { SimplerDevice, SimplerDeviceClassName } from './SimplerDevice';
import { PluginDevice, PluginDeviceClassNames } from './PluginDevice';
import { LooperDevice, LooperDeviceClassName } from './LooperDevice';

/**
 * Creates the most specific Device class for a raw device, based on its `class_name`.
 * Devices without a dedicated class are returned as a plain `Device`.
 *
 * @param {AbletonLiveBase} ableton
 * @param {RawDevice} raw
 * @param {string} [path]
 * @return {Device}
 */
export function createDevice(ableton: AbletonLiveBase, raw: RawDevice, path?: string): Device<any, any, any, any, any> {
	const className = raw.class_name;

	if (RackDeviceClassNames.includes(className)) return new RackDevice(ableton, raw, path);
	if (className === SimplerDeviceClassName) return new SimplerDevice(ableton, raw, path);
	if (PluginDeviceClassNames.includes(className)) return new PluginDevice(ableton, raw, path);
	if (className === LooperDeviceClassName) return new LooperDevice(ableton, raw, path);

	return new Device(ableton, raw, path);
}
