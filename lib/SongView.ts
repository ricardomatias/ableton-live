import { Properties } from './Properties';
import { AbletonLive } from './index';
import { Track, RawTrack, TrackType } from './Track';
import { RawScene, Scene } from './Scene';
import { Clip, RawClip } from './Clip';
import { ClipSlot, RawClipSlot } from './ClipSlot';
import { DeviceParameter, RawDeviceParameter } from './DeviceParameter';


export interface GettableProperties {
	draw_mode: boolean;
	follow_song: boolean;
}

export interface ChildrenProperties {
	detail_clip: RawClip[];
	highlighted_clip_slot: RawClipSlot[];
	selected_parameter: RawDeviceParameter[];
	selected_scene: RawScene[];
	selected_track: RawTrack[];
}

export interface TransformedProperties {
	detail_clip: Clip;
	highlighted_clip_slot: ClipSlot;
	selected_parameter: DeviceParameter;
	selected_scene: Scene;
	selected_track: Track;
}

export interface SettableProperties {
	draw_mode: boolean;
	follow_song: boolean;
}

export interface ObservableProperties {
	detail_clip: RawClip;
	highlighted_clip_slot: RawClipSlot;
	selected_parameter: RawDeviceParameter;
	selected_scene: RawScene;
	selected_track: RawTrack;

	draw_mode: boolean;
	follow_song: boolean;
}

const childrenInitialProps = {
	detail_clip: RawClip,
	highlighted_clip_slot: RawClipSlot,
	selected_parameter: RawDeviceParameter,
	selected_scene: RawScene,
	selected_track: RawTrack,
};

export class SongView extends Properties<
	GettableProperties,
	ChildrenProperties,
	TransformedProperties,
	SettableProperties,
	ObservableProperties
> {
	static path = 'live_set view';

	constructor(ableton: AbletonLive) {
		super(ableton, 'song', SongView.path, childrenInitialProps);

		this.transformers = {
			selected_track: (t) => new Track(this.ableton, Array.isArray(t) ? t[0] : t),
			selected_scene: (s) => new Scene(this.ableton, Array.isArray(s) ? s[0] : s),
			selected_parameter: (dp) => new DeviceParameter(this.ableton, Array.isArray(dp) ? dp[0] : dp),
			highlighted_clip_slot: (cs) => new ClipSlot(this.ableton, Array.isArray(cs) ? cs[0] : cs),
			detail_clip: (c) => new Clip(this.ableton, Array.isArray(c) ? c[0] : c),
		};
	}

	// =========================================================================
	// * Custom API
	// =========================================================================


	// =========================================================================
	// * Official API
	// =========================================================================

	/**
	* Selects the given device object in its track.
	* You may obtain the id using a live.path or by using get devices on a track, for example.
	* The track containing the device will not be shown automatically, and the device gets the appointed device (blue hand) only if its track is selected.
	* @memberof SongView
	*
	* @param {number} id
	* @return {void}
	*/
	public async selectDevice(id: number): Promise<void> {
		return this.call('select_device', [ `id ${id}` ]);
	}
}
