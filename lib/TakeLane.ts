import { Properties } from './Properties';
import { AbletonLiveBase } from './AbletonLiveBase';
import { Clip, RawClip, RawClipKeys } from './Clip';

export interface TakeLaneGetProperties {
	/**
	 * The name as shown in the take lane header.
	 */
	name: string;
}

export interface TakeLaneChildrenProperties {
	/**
	 * The take lane's Arrangement View clips.
	 */
	arrangement_clips: RawClip[];
}

export interface TakeLaneTransformedProperties {
	/**
	 * @inheritdoc TakeLaneChildrenProperties.arrangement_clips
	 */
	arrangement_clips: Clip[];
}

export interface TakeLaneSetProperties {
	/**
	 * @inheritdoc TakeLaneGetProperties.name
	 */
	name: string;
}

export interface TakeLaneObservableProperties {
	/**
	 * @inheritdoc TakeLaneGetProperties.name
	 */
	name: string;
}

export interface RawTakeLane {
	id: string;
	path: string;
	name: string;
}

/**
 * @private
 */
export const RawTakeLaneKeys = ['name'];

/**
 * This class represents a take lane of an Arrangement track.
 *
 * Available since Live 12.2.
 *
 * @class TakeLane
 * @extends {Properties<TakeLaneGetProperties, TakeLaneChildrenProperties, TakeLaneTransformedProperties, TakeLaneSetProperties, TakeLaneObservableProperties>}
 */
export class TakeLane extends Properties<
	TakeLaneGetProperties,
	TakeLaneChildrenProperties,
	TakeLaneTransformedProperties,
	TakeLaneSetProperties,
	TakeLaneObservableProperties
> {
	static path = 'live_set tracks $1 take_lanes $2';

	private _name: string;

	/**
	 * Creates an instance of TakeLane.
	 * @param {AbletonLiveBase} ableton
	 * @param {RawTakeLane} raw
	 * @param {string} [path]
	 * @memberof TakeLane
	 */
	constructor(
		ableton: AbletonLiveBase,
		public raw: RawTakeLane,
		path?: string
	) {
		super(ableton, 'take_lane', path ?? raw.path, { arrangement_clips: RawClipKeys });

		this._id = raw.id;
		this._name = raw.name;

		this.childrenTransformers = {
			arrangement_clips: (clips) => clips.map((clip) => new Clip(this.ableton, clip)),
		};
	}

	/**
	 * The name of the take lane when it was fetched
	 *
	 * @readonly
	 * @type {string}
	 * @memberof TakeLane
	 */
	get name(): string {
		return this._name;
	}

	/**
	 * Creates an audio clip in this take lane.
	 * @memberof TakeLane
	 *
	 * @param {string} filePath absolute path to a valid audio file
	 * @param {number} startTime position in the Arrangement, in beats
	 * @return {Promise<void>}
	 */
	public async createAudioClip(filePath: string, startTime: number): Promise<void> {
		return this.call('create_audio_clip', [filePath, startTime]);
	}

	/**
	 * Creates an empty MIDI clip in this take lane.
	 * @memberof TakeLane
	 *
	 * @param {number} startTime position in the Arrangement, in beats
	 * @param {number} length length of the clip, in beats
	 * @return {Promise<void>}
	 */
	public async createMidiClip(startTime: number, length: number): Promise<void> {
		return this.call('create_midi_clip', [startTime, length]);
	}

	/** @ignore */
	get [Symbol.toStringTag](): string {
		return `TakeLane <${this.name}>`;
	}
}
