import { Properties } from './Properties';
import { AbletonLive } from '.';
import { RawClipKeys, RawClip, Clip } from './Clip';

/**
 * Equals 0 if this is not a clip slot of a Group Track.
 */
export const enum PlayingStatus {
	/**
	 * All clips in tracks within a Group Track stopped or all tracks within a Group Track are empty.<br/>
	 */
	Stop = 0,
	/**
	 * At least one clip in a track within a Group Track is playing.
	 */
	Playing = 1,
	/**
	 * At least one clip in a track within a Group Track is playing or recording
	 */
	PlayingOrRecording = 2,
}

export interface ClipSlotGetProperties {
	/**
	 * true = a clip exists in this clip slot.
	 */
	has_clip: boolean;
	/**
	 * true = this clip stops its track (or tracks within a Group Track).
	 */
	has_stop_button: boolean;
	/**
	 * true = this clip slot is a Group Track slot.
	 */
	is_group_slot: boolean;
	/**
	 * true = playing_status != 0, otherwise false.
	 */
	is_playing: boolean;
	/**
	 * true = playing_status == 2, otherwise false.
	 */
	is_recording: boolean;
	/**
	 * true = clip slot button (Clip Launch, Clip Stop or Clip Record) or button of contained clip are blinking.
	 */
	is_triggered: boolean;
	playing_status: PlayingStatus;
	/**
	 * true for a Group Track slot that has non-deactivated clips in the tracks within its group.
	 * Control of empty clip slots doesn't count.
	 */
	controls_other_clips: boolean;
	/**
	 * true = clip slot will record on start.
	 */
	will_record_on_start: boolean;
	/**
	 * @inheritdoc SceneGetProperties.color
	 */
	color: number;
	/**
	 * @inheritdoc SceneGetProperties.color_index
	 */
	color_index: number;
}

export interface ClipSlotChildrenProperties {
	clip: RawClip[];
}

export interface ClipSlotTransformedProperties {
	clip: Clip;
}

export interface ClipSlotSetProperties {
	/**
	 * @inheritdoc ClipSlotGetProperties.has_stop_button
	 */
	has_stop_button: boolean;
}

export interface ObservableProperties {
	/**
	 * @inheritdoc ClipSlotGetProperties.has_clip
	 */
	has_clip: boolean;
	/**
	 * @inheritdoc ClipSlotGetProperties.has_stop_button
	 */
	has_stop_button: boolean;
	/**
	 * @inheritdoc ClipSlotGetProperties.playing_status
	 */
	playing_status: PlayingStatus;
	/**
	 * @inheritdoc ClipSlotGetProperties.controls_other_clips
	 */
	controls_other_clips: boolean;
	/**
	 * @inheritdoc SceneGetProperties.color
	 */
	color: number;
	/**
	 * @inheritdoc SceneGetProperties.color_index
	 */
	color_index: number;
}

export interface RawClipSlot {
	id: number;
	path: string;
	has_clip: boolean;
	clip: RawClip;
}

/**
 * @private
 */
export const RawClipSlotKeys = [ 'has_clip', { name: 'clip', initialProps: RawClipKeys }];

const initialProperties = {
	clip: RawClipKeys,
};

export class ClipSlot extends Properties<
	ClipSlotGetProperties,
	ClipSlotChildrenProperties,
	ClipSlotTransformedProperties,
	ClipSlotSetProperties,
	ObservableProperties
> {
	static path = 'live_set tracks $1 clip_slots $2';

	private _hasClip: boolean;
	private _playingStatus: PlayingStatus;
	private _clip: Clip;

	/**
	 * Creates an instance of ClipSlot.
	 * @param {AbletonLive} ableton
	 * @param {RawClipSlot} raw
	 * @param {string} [path]
	 * @memberof ClipSlot
	 */
	constructor(ableton: AbletonLive, public raw: RawClipSlot, path?: string) {
		super(ableton, 'clip_slot', path ?? raw.path, initialProperties);

		this._id = raw.id;
		this._hasClip = raw.has_clip;
		this._clip = new Clip(this.ableton, raw.clip);

		this.childrenTransformers = {
			clip: ([ clip ]) => {
				if (clip.id === '0') {
					return null;
				}
				return new Clip(this.ableton, clip);
			},
		};
	}

	/**
	 * If it contains a clip
	 *
	 * @readonly
	 * @type {boolean}
	 * @memberof ClipSlot
	 */
	get hasClip(): boolean {
		return this._hasClip;
	}

	/**
	 * Gets the clip or return's null if there's none
	 * @memberof ClipSlot
	 *
	 * @return {Clip | null}
	 */
	async clip(): Promise<Clip | null> {
		return this._clip ? Promise.resolve(this._clip) : await this.children('clip');
	}

	/**
	 * Creates a new clip
	 * @memberof ClipSlot
	 *
	 * @param {number} [lengthInBeats = 4] In beats, f.ex: 4 beats = 1 bar
	 * @return {null}
	 */
	public async createClip(lengthInBeats = 4): Promise<Clip> {
		await this.call('create_clip', [ lengthInBeats ]);

		return await this.children('clip');
	}

	/**
	 * Deletes the clip
	 * @memberof ClipSlot
	 *
	 * @return {null}
	 */
	public async deleteClip(): Promise<void> {
		return this.call('delete_clip');
	}

	/**
	 * Duplicates the clip into a new clip slot
	 * @memberof ClipSlot
	 *
	 * @param {number} [targetClipSlot] target clip slot
	 * @return {null}
	 */
	public async duplicateClipTo(targetClipSlot?: number): Promise<void> {
		return this.call('create_clip', [ targetClipSlot ]);
	}

	/**
	 * Plays/Triggers a clip
	 * @memberof ClipSlot
	 *
	 * @param {number} [recordLength]
	 * @param {number} [launchQuantization]
	 * @return {null}
	 */
	public async fire(recordLength?: number, launchQuantization?: number): Promise<void> {
		return this.call('fire', [ recordLength, launchQuantization ]);
	}

	/**
	 * Stops a clip
	 * @memberof ClipSlot
	 *
	 * @return {null}
	 */
	public async stop(): Promise<void> {
		return this.call('stop');
	}
}
