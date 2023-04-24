import { Properties } from './Properties';
import { AbletonLive } from '.';
import { RawMixerDeviceKeys, MixerDevice, RawMixerDevice } from './MixerDevice';
import { RawClipSlotKeys, RawClipSlot, ClipSlot } from './ClipSlot';
import { DeviceParameter } from './DeviceParameter';
import { Device, RawDevice } from './Device';
import { Clip } from './Clip';

// TODO Missing properties
// > input_routing_channel: dictionary;
// > input_routing_type: dictionary;
// > output_routing_channel: dictionary;
// > output_routing_type: dictionary;

/**
 * @interface TrackGetProperties
 */
export interface TrackGetProperties {
	/**
	 * true = track is armed for recording. [not in return/master tracks]
	 */
	arm: boolean;
	/**
	 * The list of available source channels for the track's input routing.
	 * Only available on MIDI and audio tracks.
	 */
	available_input_routing_channels: string | number;
	/**
	 * The list of available source types for the track's input routing
	 * Only available on MIDI and audio tracks.
	 */
	available_input_routing_types: string | number;
	/**
	 * The list of available source channels for the track's ouput routing.
	 * Only available on MIDI and audio tracks.
	 */
	available_output_routing_channels: string | number;
	/**
	 * The list of available source types for the track's ouput routing.
	 * Only available on MIDI and audio tracks.
	 */
	available_output_routing_types: string | number;
	/**
	 * false for return and master tracks.
	 */
	can_be_armed: boolean;
	/**
	 * true = the track can be frozen, false = otherwise.
	 */
	can_be_frozen: boolean;
	/**
	 * true = the track contains an Instrument Rack device that can show chains in Session View.
	 */
	can_show_chains: boolean;
	/**
	 * @inheritdoc SceneGetProperties.color
	 */
	color: number;
	/**
	 * @inheritdoc SceneGetProperties.color_index
	 */
	color_index: number;
	current_monitoring_state: TrackMonitoringState;
	/**
	 * Reflects the blinking clip slot.<br/>
	 * -1 = no slot fired, -2 = Clip Stop Button fired<br/>
	 * First clip slot has index 0.<br/>
	 * [not in return/master tracks]
	 */
	fired_slot_index: number;
	fold_state: TrackFoldState;
	/**
	 * true for audio tracks.
	 */
	has_audio_input: boolean;
	/**
	 * true for audio tracks and MIDI tracks with instruments.
	 */
	has_audio_output: boolean;
	/**
	 * true for MIDI tracks.
	 */
	has_midi_input: boolean;
	/**
	 * true for MIDI tracks with no instruments and no audio effects.
	 */
	has_midi_output: boolean;
	/**
	 * A second arm state, only used by Push so far.
	 */
	implicit_arm: boolean;
	/**
	 * Smoothed momentary peak value of left channel input meter, 0.0 to 1.0. For tracks with audio output only.
	 * This value corresponds to the meters shown in Live.</br>
	 * Please take into account that the left/right audio meters put a significant load onto the GUI part of Live.
	 */
	input_meter_left: number;
	/**
	 * Hold peak value of input meters of audio and MIDI tracks, 0.0 ... 1.0. For audio tracks it is the maximum of the left and right channels. The hold time is 1 second.
	 */
	input_meter_level: number;
	/**
	 * Smoothed momentary peak value of right channel input meter, 0.0 to 1.0. For tracks with audio output only. This value corresponds to the meters shown in Live.
	 */
	input_meter_right: number;
	// input_routing_channel: dictionary;
	// input_routing_type: dictionary;
	/**
	 * true = track can be (un)folded to hide or reveal the contained tracks. This is currently the case for Group Tracks. Instrument and Drum Racks return 0 although they can be opened/closed. This will be fixed in a later release.
	 */
	is_foldable: boolean;
	/**
	 * true = the track is currently frozen.
	 */
	is_frozen: boolean;
	/**
	 * true = the track is contained within a Group Track.
	 */
	is_grouped: boolean;
	is_part_of_selection: boolean;
	/**
	 * Get or set whether a track with an Instrument Rack device is currently showing its chains in Session View.
	 */
	is_showing_chains: boolean;
	/**
	 * false = track is hidden in a folded Group Track.
	 */
	is_visible: boolean;
	/**
	 * [not in master track]
	 */
	mute: boolean;
	/**
	 * true = the track or chain is muted due to Solo being active on at least one other track.
	 */
	muted_via_solo: boolean;
	/**
	 * As shown in track header.
	 */
	name: string;
	/**
	 * Smoothed momentary peak value of left channel output meter, 0.0 to 1.0. For tracks with audio output only.
	 * This value corresponds to the meters shown in Live.
	 * Please take into account that the left/right audio meters add a significant load to Live GUI resource usage.
	 */
	output_meter_left: number;
	/**
	 * Hold peak value of output meters of audio and MIDI tracks, 0.0 to 1.0.
	 * For audio tracks, it is the maximum of the left and right channels. The hold time is 1 second.
	 */
	output_meter_level: number;
	/**
	 * Smoothed momentary peak value of right channel output meter, 0.0 to 1.0.
	 * For tracks with audio output only. This value corresponds to the meters shown in Live.
	 */
	output_meter_right: number;
	// output_routing_channel: dictionary;
	// output_routing_type: dictionary;
	/**
	 * First slot has index 0, -2 = Clip Stop slot fired in Session View, -1 = Arrangement recording with no Session clip playing. [not in return/master tracks]
	 */
	playing_slot_index: number;
	/**
	 * Remark: when setting this property, the exclusive Solo logic is bypassed, so you have to unsolo the other tracks yourself. [not in master track]
	 */
	solo: boolean;
}

/**
 * @interface TrackChildrenProperties
 */
export interface TrackChildrenProperties {
	/**
	 * Includes mixer device.
	 */
	devices: RawDevice[];
	mixer_device: RawMixerDevice[];
	clip_slots: RawClipSlot[];
	/**
	 * The Group Track, if the Track is grouped. If it is not, id 0 is returned.
	 */
	group_track: RawTrack;
	/**
	 * The list of this track's Arrangement View clip IDs
	 */
	arrangement_clips: RawClipSlot[];
}

/**
 * @interface TrackTransformedProperties
 */
export interface TrackTransformedProperties {
	available_input_routing_channels: TrackRoutingType[] | number;
	available_input_routing_types: TrackRoutingType[] | number;
	available_output_routing_channels: TrackRoutingType[] | number;
	available_output_routing_types: TrackRoutingType[] | number;
	/**
	 * @inheritdoc TrackChildrenProperties.devices
	 */
	devices: Device[];
	mixer_device: MixerDevice;
	clip_slots: ClipSlot[];
	/**
	 * @inheritdoc TrackChildrenProperties.group_track
	 */
	group_track: RawTrack;
	/**
	 * @inheritdoc TrackChildrenProperties.arrangement_clips
	 */
	arrangement_clips: ClipSlot[];
}

/**
 * @interface TrackSetProperties
 */
export interface TrackSetProperties {
	/**
	 * @inheritdoc TrackGetProperties.arm
	 */
	arm: number;
	/**
	 * @inheritdoc TrackGetProperties.available_input_routing_channels
	 */
	available_input_routing_channels: string | number;
	/**
	 * @inheritdoc TrackGetProperties.available_input_routing_types
	 */
	available_input_routing_types: string | number;
	/**
	 * @inheritdoc TrackGetProperties.available_output_routing_channels
	 */
	available_output_routing_channels: string | number;
	/**
	 * @inheritdoc TrackGetProperties.available_output_routing_types
	 */
	available_output_routing_types: string | number;
	/**
	 * @inheritdoc TrackGetProperties.color
	 */
	color: number;
	/**
	 * @inheritdoc TrackGetProperties.color_index
	 */
	color_index: number;
	/**
	 * @inheritdoc TrackGetProperties.current_monitoring_state
	 */
	current_monitoring_state: TrackMonitoringState;
	/**
	 * @inheritdoc TrackGetProperties.fold_state
	 */
	fold_state: TrackFoldState;
	/**
	 * @inheritdoc TrackGetProperties.implicit_arm
	 */
	implicit_arm: boolean;
	// input_routing_channel: dictionary;
	// input_routing_type: dictionary;
	/**
	 * @inheritdoc TrackGetProperties.is_showing_chains
	 */
	is_showing_chains: boolean;
	/**
	 * @inheritdoc TrackGetProperties.mute
	 */
	mute: boolean;
	/**
	 * @inheritdoc TrackGetProperties.name
	 */
	name: string;
	// output_routing_channel: dictionary;
	// output_routing_type: dictionary;
	/**
	 * @inheritdoc TrackGetProperties.solo
	 */
	solo: boolean;
}

/**
 * @interface TrackObservableProperties
 */
export interface TrackObservableProperties {
	/**
	 * @inheritdoc TrackGetProperties.arm
	 */
	arm: number;
	// available_input_routing_channels: dictionary;
	// available_input_routing_types: dictionary;
	// available_output_routing_channels: dictionary;
	// available_output_routing_types: dictionary;
	/**
	 * @inheritdoc TrackGetProperties.color_index
	 */
	color_index: number;
	/**
	 * @inheritdoc TrackGetProperties.color
	 */
	color: number;
	/**
	 * @inheritdoc TrackGetProperties.current_monitoring_state
	 */
	current_monitoring_state: TrackMonitoringState;
	/**
	 * @inheritdoc TrackGetProperties.fired_slot_index
	 */
	fired_slot_index: number;
	/**
	 * @inheritdoc TrackGetProperties.implicit_arm
	 */
	implicit_arm: boolean;
	/**
	 * @inheritdoc TrackGetProperties.input_meter_left
	 */
	input_meter_left: number;
	/**
	 * @inheritdoc TrackGetProperties.input_meter_level
	 */
	input_meter_level: number;
	/**
	 * @inheritdoc TrackGetProperties.input_meter_right
	 */
	input_meter_right: number;
	// input_routing_channel: dictionary;
	// input_routing_type: dictionary;
	/**
	 * @inheritdoc TrackGetProperties.is_frozen
	 */
	is_frozen: boolean;
	/**
	 * @inheritdoc TrackGetProperties.is_showing_chains
	 */
	is_showing_chains: boolean;
	/**
	 * @inheritdoc TrackGetProperties.mute
	 */
	mute: boolean;
	/**
	 * @inheritdoc TrackGetProperties.muted_via_solo
	 */
	muted_via_solo: boolean;
	/**
	 * @inheritdoc TrackGetProperties.name
	 */
	name: string;
	/**
	 * @inheritdoc TrackGetProperties.output_meter_left
	 */
	output_meter_left: number;
	/**
	 * @inheritdoc TrackGetProperties.output_meter_level
	 */
	output_meter_level: number;
	/**
	 * @inheritdoc TrackGetProperties.output_meter_right
	 */
	output_meter_right: number;
	// output_routing_channel: dictionary;
	// output_routing_type: dictionary;
	/**
	 * @inheritdoc TrackGetProperties.playing_slot_index
	 */
	playing_slot_index: number;
	/**
	 * @inheritdoc TrackGetProperties.solo
	 */
	solo: boolean;
}

/**
 * 0 = In, 1 = Auto, 2 = Off [not in return/master tracks]
 */
export const enum TrackMonitoringState {
	In = 0,
	Auto = 1,
	Off = 2,
}

/**
 * 0 = tracks within the Group Track are visible, 1 = Group Track is folded and the tracks within the Group Track are hidden</br>
 * [only available if is_foldable = 1]
 */
export const enum TrackFoldState {
	Visible = 0,
	Hidden = 1,
}

export const enum TrackType {
	Midi = 'midi',
	Audio = 'audio',
}

export type TrackRoutingType = { display_name: string; identifier: number };

/**
 * @interface RawTrack
 */
export interface RawTrack {
	id: string;
	path:string;
	name: string;
	has_audio_input: boolean;
}

/**
 * @private
 */
export const RawTrackKeys = ['name', 'has_audio_input'];

const childrenInitialProps = {
	devices: RawDevice,
	clip_slots: RawClipSlotKeys,
	mixer_device: RawMixerDeviceKeys,
};

function routingGetter<T extends keyof TrackTransformedProperties>(prop: T) {
	return (details): TrackTransformedProperties[T] => {
		if (typeof details === 'number') return details as TrackTransformedProperties[T];
		return JSON.parse(details)[prop];
	};
}

/**
 * This class represents a track in Live. It can either be an audio track, a MIDI track, a return track or the master track.
 * The master track and at least one Audio or MIDI track will be always present. Return tracks are optional.</br>
 *
 * Not all properties are supported by all types of tracks. The properties are marked accordingly.
 *
 * @class Track
 * @extends {Properties<TrackGetProperties, TrackChildrenProperties, TrackTransformedProperties, TrackSetProperties, TrackObservableProperties>}
 */
export class Track extends Properties<
	TrackGetProperties,
	TrackChildrenProperties,
	TrackTransformedProperties,
	TrackSetProperties,
	TrackObservableProperties
> {
	static path = 'live_set tracks $1';

	static getPath(trackNumber: number): string {
		return Track.path.replace('$1', `${trackNumber}`);
	}

	// TODO: v2
	// static async get<T extends keyof TrackGetProperties>(
	// 	live: AbletonLive,
	// 	trackNumber: number,
	// 	prop: T,
	// ): Promise<TrackGetProperties[T]> {
	// 	return await live.get(Track.getPath(trackNumber), prop);
	// }

	private _name: string;
	private _type: TrackType;
	private _mixerDevice: MixerDevice;

	/**
	 * Creates an instance of Track.
	 * @param {AbletonLive} ableton
	 * @param {RawTrack} raw
	 * @param {string} [path]
	 * @memberof Track
	 */
	constructor(ableton: AbletonLive, public raw: RawTrack, path?: string) {
		super(ableton, 'track', path ?? raw.path, childrenInitialProps);

		this._id = parseInt(raw.id, 10);
		this._name = raw.name;
		this._type = raw.has_audio_input ? TrackType.Audio : TrackType.Midi;

		this.getterTransformers = {
			available_input_routing_channels: routingGetter('available_input_routing_channels'),
			available_input_routing_types: routingGetter('available_input_routing_types'),
			available_output_routing_channels: routingGetter('available_output_routing_channels'),
			available_output_routing_types: routingGetter('available_output_routing_types'),
		};

		this.childrenTransformers = {
			devices: (devices) => devices.map((device) => new Device(this.ableton, device)),
			mixer_device: ([mixerDevice]) => new MixerDevice(this.ableton, mixerDevice),
			clip_slots: (clipSlots) => clipSlots.map((c) => new ClipSlot(this.ableton, c)),
		};
	}

	// =========================================================================
	// * Custom API
	// =========================================================================

	/**
	 * Get all clips in a track
	 *
	 * @memberof Track
	 * @return {(Promise<(Clip | null)[]>)}
	 */
	async getClips(): Promise<(Clip | null)[]> {
		const clipSlots = await this.children('clip_slots');

		return await Promise.all(clipSlots.filter((cs) => cs.hasClip).map(async (cs) => await cs.clip()));
	}

	/**
	 * Is the track a group track
	 *
	 * @memberof Track
	 * @return {(Promise<boolean>)}
	 */
	async isGroupTrack(): Promise<boolean> {
		const groupTrackId = await this.get('available_input_routing_channels');
		return typeof groupTrackId === 'number';
	}

	// =========================================================================
	// * Official API
	// =========================================================================

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
		const mixerDevice = (this._mixerDevice = await this.children('mixer_device'));

		return mixerDevice.volume;
	}

	/**
	 * Get the panning of the track
	 * @memberof Track
	 *
	 * @return {Promise<DeviceParameter>}
	 */
	async panning(): Promise<DeviceParameter> {
		const mixerDevice = (this._mixerDevice = await this.children('mixer_device'));

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
		return this.call('delete_device', [index]);
	}

	/**
	 * Works like 'Duplicate' in a clip's context menu.
	 * @memberof Track
	 *
	 * @param {number} index
	 * @return {null}
	 */
	public async duplicateClipSlot(index: number): Promise<void> {
		return this.call('duplicate_clip_slot', [index]);
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
		return `Track <${this.name}>`;
	}
}
