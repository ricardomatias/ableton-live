import { Properties } from './Properties';
import { AbletonLive } from '.';
import { RawClipKeys, RawClip, Clip } from './Clip';

export const enum PlayingStatus {
	STOP = 0,
	PLAYING = 1,
	PLAYING_OR_RECORDING = 2,
}

export interface GettableProperties {
	has_clip: boolean;
	has_stop_button: boolean;
	is_group_slot: boolean;
	is_playing: boolean;
	is_recording: boolean;
	is_triggered: boolean;
	playing_status: PlayingStatus;
	controls_other_clips: boolean;
	will_record_on_start: boolean;
	color: number;
	color_index: number;
}

export interface ChildrenProperties {
	clip: RawClip[];
}

export interface TransformedProperties {
	clip: Clip;
}

export interface SettableProperties {
	has_stop_button: boolean;
}

export interface ObservableProperties {
	has_clip: boolean;
	has_stop_button: boolean;
	playing_status: PlayingStatus;
	controls_other_clips: boolean;
	color: number;
	color_index: number;
}

export interface RawClipSlot {
	id: number;
	has_clip: boolean;
	clip: RawClip;
}

/**
 * @private
 */
export const RawClipSlotKeys = [
	'has_clip',
	{ name: 'clip', initialProps: RawClipKeys },
];

const initialProperties = {
	clip: RawClipKeys,
};

export class ClipSlot extends Properties<
	GettableProperties,
	ChildrenProperties,
	TransformedProperties,
	SettableProperties,
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
		super(ableton, 'clip_slot', path ? path : ClipSlot.path, initialProperties);

		this._id = raw.id;
		this._hasClip = raw.has_clip;
		this._clip = new Clip(this.ableton, raw.clip);

		this.transformers = {
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
