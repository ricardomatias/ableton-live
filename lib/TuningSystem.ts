import { Properties } from './Properties';
import { AbletonLiveBase } from './AbletonLiveBase';

/**
 * Live returns dictionaries for most tuning properties. The exact keys are defined by Live.
 */
export type TuningSystemDictionary = Record<string, any>;

export interface TuningSystemGetProperties {
	/**
	 * The name of the currently active tuning system.
	 */
	name: string;
	/**
	 * The pseudo octave in cents of the currently active tuning system.
	 */
	pseudo_octave_in_cents: number;
	/**
	 * The note index within the pseudo octave and octave of the lowest note.
	 */
	lowest_note: TuningSystemDictionary;
	/**
	 * The note index within the pseudo octave and octave of the highest note.
	 */
	highest_note: TuningSystemDictionary;
	/**
	 * The reference pitch of the current tuning system.
	 */
	reference_pitch: TuningSystemDictionary;
	/**
	 * The relative note tunings of the tuning system in cents.
	 */
	note_tunings: TuningSystemDictionary;
}

export interface TuningSystemSetProperties {
	/**
	 * @inheritdoc TuningSystemGetProperties.name
	 */
	name: string;
	/**
	 * @inheritdoc TuningSystemGetProperties.lowest_note
	 */
	lowest_note: TuningSystemDictionary;
	/**
	 * @inheritdoc TuningSystemGetProperties.highest_note
	 */
	highest_note: TuningSystemDictionary;
	/**
	 * @inheritdoc TuningSystemGetProperties.reference_pitch
	 */
	reference_pitch: TuningSystemDictionary;
	/**
	 * @inheritdoc TuningSystemGetProperties.note_tunings
	 */
	note_tunings: TuningSystemDictionary;
}

export type TuningSystemObservableProperties = TuningSystemSetProperties;

export interface RawTuningSystem {
	id: string;
	path: string;
	name: string;
}

/**
 * @private
 */
export const RawTuningSystemKeys = ['name'];

function dictionaryGetter(value: unknown): TuningSystemDictionary {
	if (typeof value !== 'string') return value as TuningSystemDictionary;

	try {
		return JSON.parse(value);
	} catch {
		return value as unknown as TuningSystemDictionary;
	}
}

/**
 * This class represents the tuning system of a Live Set.
 *
 * Available since Live 12.1.
 *
 * @class TuningSystem
 * @extends {Properties<TuningSystemGetProperties, null, null, TuningSystemSetProperties, TuningSystemObservableProperties>}
 */
export class TuningSystem extends Properties<
	TuningSystemGetProperties,
	null,
	null,
	TuningSystemSetProperties,
	TuningSystemObservableProperties
> {
	static path = 'live_set tuning_system';

	private _name: string;

	/**
	 * Creates an instance of TuningSystem.
	 * @param {AbletonLiveBase} ableton
	 * @param {RawTuningSystem} raw
	 * @param {string} [path]
	 * @memberof TuningSystem
	 */
	constructor(
		ableton: AbletonLiveBase,
		public raw: RawTuningSystem,
		path?: string
	) {
		super(ableton, 'tuning_system', path ?? raw.path ?? TuningSystem.path);

		this._id = raw.id;
		this._name = raw.name;

		this.getterTransformers = {
			lowest_note: dictionaryGetter,
			highest_note: dictionaryGetter,
			reference_pitch: dictionaryGetter,
			note_tunings: dictionaryGetter,
		};
	}

	/**
	 * The name of the tuning system when it was fetched
	 *
	 * @readonly
	 * @type {string}
	 * @memberof TuningSystem
	 */
	get name(): string {
		return this._name;
	}
}
