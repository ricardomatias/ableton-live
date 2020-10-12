import { Properties } from './Properties';
import { AbletonLive } from './index';
import { Track, RawTrack, RawTrackKeys } from './Track';
import { RawSceneKeys, RawScene, Scene } from './Scene';
import { Clip, RawClipKeys, RawClip } from './Clip';
import { ClipSlot, RawClipSlotKeys, RawClipSlot } from './ClipSlot';
import { DeviceParameter, RawDeviceParameterKeys, RawDeviceParameter } from './DeviceParameter';


// TODO Missing properties
// > selected_chain


/**
 * @interface SongViewGetProperties
 */
export interface SongViewGetProperties {
	/**
	 * Reflects the state of the envelope/automation Draw Mode Switch in the transport bar, as toggled with Cmd/Ctrl-B.<br/>
	 * 0 = breakpoint editing (shows arrow), 1 = drawing (shows pencil)
	 */
	draw_mode: boolean;
	/**
	 * Reflects the state of the Follow switch in the transport bar as toggled with Cmd/Ctrl-F.<br/>
	 * 0 = don't follow playback position, 1 = follow playback position
	 */
	follow_song: boolean;
}

/**
 * @interface SongViewChildrenProperties
 */
export interface SongViewChildrenProperties {
	/**
	 * The clip currently displayed in the Live application's Detail View.
	 */
	detail_clip: RawClip[];
	/**
	 * The slot highlighted in the Session View.
	 */
	highlighted_clip_slot: RawClipSlot[];
	/**
	 * The selected parameter, or "id 0"
	 */
	selected_parameter: RawDeviceParameter[];
	selected_scene: RawScene[];
	selected_track: RawTrack[];
}

/**
 * @interface SongViewTransformedProperties
 */
export interface SongViewTransformedProperties {
	/**
	 * @inheritdoc SongViewChildrenProperties.detail_clip
	 */
	detail_clip: Clip;
	/**
	 * @inheritdoc SongViewChildrenProperties.highlighted_clip_slot
	 */
	highlighted_clip_slot: ClipSlot;
	/**
	 * @inheritdoc SongViewChildrenProperties.selected_parameter
	 */
	selected_parameter: DeviceParameter;
	selected_scene: Scene;
	selected_track: Track;
}

/**
 * @interface SongViewSetProperties
 */
export interface SongViewSetProperties {
	/**
	 * @inheritdoc SongViewChildrenProperties.draw_mode
	 */
	draw_mode: boolean;
	/**
	 * @inheritdoc SongViewChildrenProperties.follow_song
	 */
	follow_song: boolean;

	detail_clip: string;
	highlighted_clip_slot: string;
	selected_parameter: string;
	selected_scene: string;
	selected_track: string;
}

/**
 * @interface SongViewObservableProperties
 */
export interface SongViewObservableProperties {
	/**
	 * @inheritdoc SongViewChildrenProperties.detail_clip
	 */
	detail_clip: Clip;
	/**
	 * @inheritdoc SongViewChildrenProperties.highlighted_clip_slot
	 */
	highlighted_clip_slot: ClipSlot;
	/**
	 * @inheritdoc SongViewChildrenProperties.selected_parameter
	 */
	selected_parameter: DeviceParameter;
	selected_scene: Scene;
	selected_track: Track;

	/**
	 * @inheritdoc SongViewChildrenProperties.draw_mode
	 */
	draw_mode: boolean;
	/**
	 * @inheritdoc SongViewChildrenProperties.follow_song
	 */
	follow_song: boolean;
}

const childrenInitialProps = {
	detail_clip: RawClipKeys,
	highlighted_clip_slot: RawClipSlotKeys,
	selected_parameter: RawDeviceParameterKeys,
	selected_scene: RawSceneKeys,
	selected_track: RawTrackKeys,
};

/**
 * This class represents the view aspects of a Live document: the Session and Arrangement Views.
 *
 * @class SongView
 * @extends {Properties<SongViewGetProperties, SongViewChildrenProperties, SongViewTransformedProperties, SongViewSetProperties, SongViewObservableProperties>}
 */
export class SongView extends Properties<
	SongViewGetProperties,
	SongViewChildrenProperties,
	SongViewTransformedProperties,
	SongViewSetProperties,
	SongViewObservableProperties
> {
	static path = 'live_set view';

	/**
	 * Creates an instance of SongView.
	 * @param {AbletonLive} ableton
	 * @memberof SongView
	 */
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
	public async selectTrack(track: Track): Promise<null> {
		return this.set('selected_track', `id ${track.id}`);
	}

	public async selectScene(scene: Scene): Promise<null> {
		return this.set('selected_scene', `id ${scene.id}`);
	}

	public async selectClip(clip: Clip): Promise<null> {
		return this.set('detail_clip', `id ${clip.id}`);
	}

	public async selectParameter(dp: DeviceParameter): Promise<null> {
		return this.set('selected_parameter', `id ${dp.id}`);
	}

	public async selectClipSlot(clipSlot: ClipSlot): Promise<null> {
		return this.set('highlighted_clip_slot', `id ${clipSlot.id}`);
	}

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
	 * @return {Promise<void>}
	 */
	public async selectDevice(id: number): Promise<void> {
		return this.call('select_device', [ `id ${id}` ]);
	}
}
