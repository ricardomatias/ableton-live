/**
 * Note Parameters
 * @typedef {object} NoteParameters
 * @memberof Note
 *
 * @property {boolean} muted 1 = the note is deactivated.
 * @property {number} probability the chance that the note will be played
 * @property {number} velocityDeviation the range of velocity values at which the note can be played, -127..127
 * @property {number} releaseVelocity the note release velocity (64 by default).
 * @property {number} id the note id from Live
 */
export type NoteParameters = {
	muted: boolean;
	probability: number;
	velocityDeviation: number;
	releaseVelocity: number;
	id: number | undefined;
};

/**
 * Note
 * @class
 */
export class Note {
	private _id?: number;
	private _pitch: number;
	private _start: number;
	private _duration: number;
	private _velocity: number;
	private _muted: boolean;
	private _probability: number;
	private _velocityDeviation: number;
	private _releaseVelocity: number;

	/**
	 * @private
	 * @static
	 * @memberof Note
	 */
	static MinDuration = 1 / 128;
	/**
	 *Creates an instance of Note.
	 * @param {number} pitch is the MIDI note number, 0...127, 60 is C3.
	 * @param {number} start is the note start time in beats of absolute clip time.
	 * @param {number} duration is the note length in beats.
	 * @param {number} velocity is the note velocity, 1 ... 127.
	 * @param {NoteParameters} parameters extra note parameters
	 * @memberof Note
	 */
	constructor(pitch: number, start: number, duration: number, velocity: number, parameters: Partial<NoteParameters> = {}) {
		const params = Object.assign(
			{
				id: undefined,
				muted: false,
				probability: 1.0,
				velocityDeviation: 0,
				releaseVelocity: 64,
			},
			parameters
		);

		this._pitch = pitch;
		this._start = start;
		this._duration = duration;
		this._velocity = velocity;
		this._muted = params.muted;
		this._probability = params.probability;
		this._velocityDeviation = params.velocityDeviation;
		this._releaseVelocity = params.releaseVelocity;
		this._id = params.id;
	}

	/**
	 * The note id from Live
	 *
	 * @readonly
	 * @type {(number | undefined)}
	 * @memberof Note
	 */
	get id(): number | undefined {
		return this._id;
	}

	/**
	 * The MIDI note number, 0...128, 60 is C3.
	 *
	 * @readonly
	 * @type {number}
	 * @memberof Note
	 */
	get pitch(): number {
		return Math.min(Math.max(this._pitch, 0), 128);
	}

	/**
	 * The note start time in beats of absolute clip time.
	 *
	 * @readonly
	 * @type {number}
	 * @memberof Note
	 */
	get start(): number {
		// we convert to strings with decimals to work around a bug in Max
		// otherwise we get  an invalid syntax error when trying to set notes
		return this._start;
	}

	/**
	 * The note length in beats.
	 *
	 * @readonly
	 * @type {number}
	 * @memberof Note
	 */
	get duration(): number {
		if (this._duration <= Note.MinDuration) return Note.MinDuration;
		return this._duration; // workaround similar bug as with get start()
	}

	/**
	 * The note velocity, 1 ... 127.
	 *
	 * @readonly
	 * @type {number}
	 * @memberof Note
	 */
	get velocity(): number {
		return Math.min(Math.max(this._velocity, 0), 128);
	}

	get muted(): boolean {
		return !!this._muted;
	}

	get probability(): number {
		return this._probability;
	}

	get velocityDeviation(): number {
		return this._velocityDeviation;
	}

	get releaseVelocity(): number {
		return this._releaseVelocity;
	}

	/**
	 * The Note serialized for consumption in Live
	 *
	 * @readonly
	 * @type {SerializedNote}
	 * @memberof Note
	 */
	get serialize(): SerializedNote {
		return {
			pitch: this.pitch,
			start_time: this.start,
			duration: this.duration,
			velocity: this.velocity,
			mute: Number(this.muted),
			probability: this.probability,
			velocity_deviation: this.velocityDeviation,
			release_velocity: this.releaseVelocity,
			note_id: this._id,
		};
	}

	/**
	 * Clones this Note
	 *
	 * @function clone
	 * @memberof Note
	 * @returns {Note}
	 */
	clone() {
		return new Note(this._pitch, this._start, this._duration, this._velocity, {
			id: undefined,
			muted: this._muted,
			probability: this._probability,
			velocityDeviation: this._velocity,
			releaseVelocity: this._releaseVelocity,
		});
	}

	/**
	 * @private
	 * @readonly
	 * @type {string}
	 * @memberof Note
	 */
	get [Symbol.toStringTag](): string {
		return `Note: ${this.pitch} <${this.id}>`;
	}
}

export type SerializedNote = {
	pitch: number;
	start_time: number;
	duration: number;
	velocity: number;
	mute: number;
	probability: number;
	velocity_deviation: number;
	release_velocity: number;
	note_id?: number;
};
