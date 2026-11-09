import { Properties } from './Properties';
import { AbletonLiveBase } from './AbletonLiveBase';
import { DrumChain, RawChain, RawChainKeys } from './Chain';

export interface DrumPadGetProperties {
	/**
	 * true = muted
	 */
	mute: boolean;
	/**
	 * The name of the pad.
	 */
	name: string;
	/**
	 * The MIDI note of the pad.
	 */
	note: number;
	/**
	 * true = soloed (Solo switch on). Does not automatically turn Solo off in other chains.
	 */
	solo: boolean;
}

export interface DrumPadChildrenProperties {
	chains: RawChain[];
}

export interface DrumPadTransformedProperties {
	chains: DrumChain[];
}

export interface DrumPadSetProperties {
	/**
	 * @inheritdoc DrumPadGetProperties.mute
	 */
	mute: boolean;
	/**
	 * @inheritdoc DrumPadGetProperties.solo
	 */
	solo: boolean;
}

export interface DrumPadObservableProperties extends DrumPadSetProperties {
	/**
	 * @inheritdoc DrumPadGetProperties.name
	 */
	name: string;
}

export interface RawDrumPad {
	id: string;
	path: string;
	name: string;
	note: number;
}

/**
 * @private
 */
export const RawDrumPadKeys = ['name', 'note'];

/**
 * This class represents a pad of a Drum Rack.
 *
 * @class DrumPad
 * @extends {Properties<DrumPadGetProperties, DrumPadChildrenProperties, DrumPadTransformedProperties, DrumPadSetProperties, DrumPadObservableProperties>}
 */
export class DrumPad extends Properties<
	DrumPadGetProperties,
	DrumPadChildrenProperties,
	DrumPadTransformedProperties,
	DrumPadSetProperties,
	DrumPadObservableProperties
> {
	static path = 'live_set tracks $1 devices $2 drum_pads $3';

	private _name: string;
	private _note: number;

	/**
	 * Creates an instance of DrumPad.
	 * @param {AbletonLiveBase} ableton
	 * @param {RawDrumPad} raw
	 * @param {string} [path]
	 * @memberof DrumPad
	 */
	constructor(
		ableton: AbletonLiveBase,
		public raw: RawDrumPad,
		path?: string
	) {
		super(ableton, 'drum_pad', path ?? raw.path, { chains: RawChainKeys });

		this._id = raw.id;
		this._name = raw.name;
		this._note = raw.note;

		this.childrenTransformers = {
			chains: (chains) => chains.map((chain) => new DrumChain(this.ableton, chain)),
		};
	}

	/**
	 * The name of the pad when it was fetched
	 *
	 * @readonly
	 * @type {string}
	 * @memberof DrumPad
	 */
	get name(): string {
		return this._name;
	}

	/**
	 * The MIDI note of the pad
	 *
	 * @readonly
	 * @type {number}
	 * @memberof DrumPad
	 */
	get note(): number {
		return this._note;
	}

	/**
	 * Deletes all chains of this pad.
	 * @memberof DrumPad
	 *
	 * @return {Promise<void>}
	 */
	public async deleteAllChains(): Promise<void> {
		return this.call('delete_all_chains');
	}

	/** @ignore */
	get [Symbol.toStringTag](): string {
		return `DrumPad <${this.note} ${this.name}>`;
	}
}
