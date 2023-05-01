import { Properties } from './Properties';
import { AbletonLive } from '.';

/**
 * @interface ClipViewGetProperties
 */
export interface ClipViewGetProperties {
	/**
	 * Get whether the clip is displayed with a triplet grid.
	 */
	grid_is_triplet: boolean;
}

/**
 * @interface ClipSetProperties
 */
export interface ClipViewSetProperties {
	/**
	 * Set whether the clip is displayed with a triplet grid.
	 */
	grid_is_triplet: boolean;
}

/**
 * Representing the view aspects of a Clip.
 *
 * @class ClipView
 * @extends {Properties<ClipViewGetProperties, unknown, unknown, ClipViewSetProperties, ClipViewObservableProperties>}
 */
export class ClipView extends Properties<ClipViewGetProperties, unknown, unknown, ClipViewSetProperties, unknown> {
	static path = 'live_set tracks $1 clip_slots $2 clip view';

	static getPath(trackNumber: number, clipSlotNumber: number): string {
		return ClipView.path.replace('$1', `${trackNumber}`).replace('$2', `${clipSlotNumber}`);
	}

	/**
	 * Creates an instance of ClipView.
	 * @private
	 * @param {AbletonLive} ableton
	 * @memberof Clip
	 */
	constructor(ableton: AbletonLive) {
		super(ableton, 'clip view', ClipView.path);
	}

	// =========================================================================
	// * Custom API
	// =========================================================================

	// =========================================================================
	// * Official API
	// =========================================================================

	/**
	 * Hide the Envelopes box
	 *
	 * @memberof ClipView
	 * @return {void}
	 */
	public async hideEnvelope(): Promise<void> {
		return this.call('hide_envelope');
	}

	/**
	 * Show the Envelopes box
	 *
	 * @memberof ClipView
	 * @param {number} deviceParam Select the specified device parameter in the Envelopes box.
	 * @return {void}
	 */
	public async showEnvelope(): Promise<void> {
		return this.call('show_envelope');
	}

	/**
	 * If the clip is visible in Live's Detail View, this function will make the current loop visible there.
	 *
	 * @memberof ClipView
	 * @return {void}
	 */
	public async showLoop(): Promise<void> {
		return this.call('show_loop');
	}
}
