import { Properties } from './Properties';
import { AbletonLive } from '.';
import { RawMixerDevice, MixerDevice } from './MixerDevice';
import { RawClipSlot, ClipSlot } from './ClipSlot';
import { DeviceParameter } from './DeviceParameter';
import { Device, RawDevice } from './Device';

export interface GettableProperties {
	arm: number;
	available_input_routing_channels: number;
	available_input_routing_types: number;
	available_output_routing_channels: number;
	available_output_routing_types: number;
	can_be_armed: number;
	can_be_frozen: number;
	can_show_chains: number;
	color: number;
	color_index: number;
	current_input_routing: number;
	current_input_sub_routing: number;
	current_monitoring_state: number;
	current_output_routing: number;
	current_output_sub_routing: number;
	fired_slot_index: number;
	fold_state: number;
	group_track: number;
	has_audio_input: number;
	has_audio_output: number;
	has_midi_input: number;
	has_midi_output: number;
	implicit_arm: number;
	input_meter_left: number;
	input_meter_level: number;
	input_meter_right: number;
	input_routing_channel: number;
	input_routing_type: number;
	input_routings: number;
	input_sub_routings: number;
	is_foldable: number;
	is_frozen: number;
	is_grouped: number;
	is_part_of_selection: number;
	is_showing_chains: number;
	is_visible: number;
	mixer_device: number;
	mute: number;
	muted_via_solo: number;
	name: number;
	output_meter_left: number;
	output_meter_level: number;
	output_meter_right: number;
	output_routing_channel: number;
	output_routing_type: number;
	output_routings: number;
	output_sub_routings: number;
	playing_slot_index: number;
	solo: number;
	view: number;
}

export interface ChildrenProperties {
	devices: RawDevice[];
	mixer_device: RawMixerDevice;
	clip_slots: RawClipSlot[];
}

export interface TransformedProperties {
	devices: Device[];
	mixer_device: MixerDevice;
	clip_slots: ClipSlot[];
}

export interface SettableProperties {
	arm: number;
	available_input_routing_channels: number;
	available_input_routing_types: number;
	available_output_routing_channels: number;
	available_output_routing_types: number;
	can_be_armed: number;
	can_be_frozen: number;
	can_show_chains: number;
	canonical_parent: number;
	clip_slots: number;
	color: number;
	color_index: number;
	current_input_routing: number;
	current_input_sub_routing: number;
	current_monitoring_state: number;
	current_output_routing: number;
	current_output_sub_routing: number;
	devices: number;
	fired_slot_index: number;
	fold_state: number;
	group_track: number;
	has_audio_input: number;
	has_audio_output: number;
	has_midi_input: number;
	has_midi_output: number;
	implicit_arm: number;
	input_meter_left: number;
	input_meter_level: number;
	input_meter_right: number;
	input_routing_channel: number;
	input_routing_type: number;
	input_routings: number;
	input_sub_routings: number;
	is_foldable: number;
	is_frozen: number;
	is_grouped: number;
	is_part_of_selection: number;
	is_showing_chains: number;
	is_visible: number;
	mixer_device: number;
	mute: number;
	muted_via_solo: number;
	name: number;
	output_meter_left: number;
	output_meter_level: number;
	output_meter_right: number;
	output_routing_channel: number;
	output_routing_type: number;
	output_routings: number;
	output_sub_routings: number;
	playing_slot_index: number;
	solo: number;
	view: number;
}

export interface ObservableProperties {
	arm: number;
	available_input_routing_channels: number;
	available_input_routing_types: number;
	available_output_routing_channels: number;
	available_output_routing_types: number;
	clip_slots: number;
	color_index: number;
	color: number;
	current_input_routing: number;
	current_input_sub_routing: number;
	current_monitoring_state: number;
	current_output_routing: number;
	current_output_sub_routing: number;
	data: number;
	devices: number;
	fired_slot_index: number;
	has_audio_input: number;
	has_audio_output: number;
	has_midi_input: number;
	has_midi_output: number;
	implicit_arm: number;
	input_meter_left: number;
	input_meter_level: number;
	input_meter_right: number;
	input_routing_channel: number;
	input_routing_type: number;
	input_routings: number;
	input_sub_routings: number;
	is_frozen: number;
	is_showing_chains: number;
	mute: number;
	muted_via_solo: number;
	name: number;
	output_meter_left: number;
	output_meter_level: number;
	output_meter_right: number;
	output_routing_channel: number;
	output_routing_type: number;
	output_routings: number;
	output_sub_routings: number;
	playing_slot_index: number;
	solo: number;
}

export const enum TrackType {
	Midi = 'midi',
	Audio = 'audio',
}

export interface RawTrack {
	id: string;
	name: string;
	has_audio_input: boolean;
}

export const RawTrack = [
	'name',
	'has_audio_input',
];

const childrenInitialProps = {
	devices: RawDevice,
	clip_slots: RawClipSlot,
	mixer_device: RawMixerDevice,
};

export class Track extends Properties<
	GettableProperties,
	ChildrenProperties,
	TransformedProperties,
	SettableProperties,
	ObservableProperties
> {
	static path = 'live_set tracks $1';

	static getPath(trackNumber: number): string {
		return Track.path.replace('$1', `${trackNumber}`);
	}

	// TODO: v2
	// static async get<T extends keyof GettableProperties>(
	// 	live: AbletonLive,
	// 	trackNumber: number,
	// 	prop: T,
	// ): Promise<GettableProperties[T]> {
	// 	return await live.get(Track.getPath(trackNumber), prop);
	// }

	private _name: string;
	private _type: TrackType;
	private _mixerDevice: MixerDevice;

	constructor(ableton: AbletonLive, public raw: RawTrack, path?: string) {
		super(ableton, 'track', path ? path : Track.path, childrenInitialProps);

		this._id = parseInt(raw.id, 10);
		this._name = raw.name;
		this._type = raw.has_audio_input ? TrackType.Audio : TrackType.Midi;

		this.transformers = {
			devices: (devices) => devices.map((device) => new Device(this.ableton, device)),
			mixer_device: (mixerDevice) => new MixerDevice(this.ableton, mixerDevice),
			clip_slots: (clipSlots) => clipSlots.map((c) => new ClipSlot(this.ableton, c)),
		};
	}

	/**
	 * The name of the track
	 *
	 * @readonly
	 * @type {string}
	 * @memberof Track
	 */
	get name(): string {
		return this._name;
	}

	/**
	 * The type of track
	 *
	 * @readonly
	 * @type {'audio' | 'midi'}
	 * @memberof Track
	 */
	get type(): TrackType {
		return this._type;
	}

	/**
	* Get the volume of the track
	* @memberof Track
	*
	* @return {Promise<DeviceParameter>}
	*/
	async volume(): Promise<DeviceParameter> {
		const mixerDevice = this._mixerDevice = await this.children('mixer_device');

		return mixerDevice.volume;
	}

	/**
	* Get the panning of the track
	* @memberof Track
	*
	* @return {Promise<DeviceParameter>}
	*/
	async panning(): Promise<DeviceParameter> {
		const mixerDevice = this._mixerDevice = await this.children('mixer_device');

		return mixerDevice.panning;
	}

	/**
	* Delete the device at the given index.
	* @memberof Track
	*
	* @param {number} index
	* @return {null}
	*/
	public async deleteDevice(index: number): Promise<void> {
		return this.call('delete_device', [ index ]);
	}

	/**
	* Works like 'Duplicate' in a clip's context menu.
	* @memberof Track
	*
	* @param {number} index
	* @return {null}
	*/
	public async duplicateClipSlot(index: number): Promise<void> {
		return this.call('duplicate_clip_slot', [ index ]);
	}

	/**
	* Stops all playing and fired clips in this track.
	* @memberof Track
	*
	* @return {null}
	*/
	public async stopAllClips(): Promise<void> {
		return this.call('stop_all_clips');
	}

	get [Symbol.toStringTag](): string {
		return `${this.name}`;
	}
}
