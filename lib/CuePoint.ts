import { Properties } from './Properties';
import AbletonLiveBase from './AbletonLiveBase';


export interface CuePointGetProperties {
	name: string;
	/**
	 * Arrangement position of the marker in beats.
	 */
	time: number;
}

export interface CuePointSetProperties {
	/**
	 * @inheritdoc CuePointGetProperties.has_stop_button
	 */
	name: string;
}

export interface ObservableProperties {
	name: string;
	/**
	 * Arrangement position of the marker in beats.
	 */
	time: number;
}

export interface RawCuePoint {
	id: number;
	path: string;
	name: string;
	time: number;
}

/**
 * @private
 */
export const RawCuePointKeys = ['name', 'time'];

export class CuePoint extends Properties<
	CuePointGetProperties,
	null,
	null,
	CuePointSetProperties,
	ObservableProperties
> {
	static path = 'live_set cue_points N';

	/**
	 * Creates an instance of CuePoint.
	 * @param {AbletonLive} ableton
	 * @param {RawCuePoint} raw
	 * @param {string} [path]
	 * @memberof CuePoint
	 */
	constructor(
		ableton: AbletonLiveBase,
		public raw: RawCuePoint,
		path?: string
	) {
		super(ableton, 'cue_points', path ?? raw.path);

		this._id = raw.id;
	}
}
