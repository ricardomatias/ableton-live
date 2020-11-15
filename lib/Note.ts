/**
 * Note
 * @class
 */
export class Note {
	private _pitch: number;
	private _start: number;
	private _duration: number;
	private _velocity: number;
	private _muted: boolean;

	static MinDuration = 1 / 128;
	/**
	 *Creates an instance of Note.
	* @param {number} pitch is the MIDI note number, 0...127, 60 is C3.
	* @param {number} start is the note start time in beats of absolute clip time.
	* @param {number} duration is the note length in beats.
	* @param {number} velocity is the note velocity, 1 ... 127.
	* @param {boolean} muted 1 = the note is deactivated.
	* @memberof Note
	*/
	constructor(pitch: number, start: number, duration: number, velocity: number, muted = false) {
		this._pitch = pitch;
		this._start = start;
		this._duration = duration;
		this._velocity = velocity;
		this._muted = muted;
	}

	get pitch(): number {
		return Math.min(Math.max(this._pitch, 0), 127);
	}

	get start(): number {
		// we convert to strings with decimals to work around a bug in Max
		// otherwise we get  an invalid syntax error when trying to set notes
		return this._start;
	}

	get duration(): number {
		if (this._duration <= Note.MinDuration) return Note.MinDuration;
		return this._duration; // workaround similar bug as with get start()
	}

	get velocity(): number {
		return Math.min(Math.max(this._velocity, 0), 128);
	}

	get muted(): boolean {
		return !!this._muted;
	}

	get [Symbol.toStringTag](): string {
		return `${this.pitch}`;
	}

	serialize(): Array<string | number | boolean> {
		return [ this.pitch, this.start.toFixed(4), this.duration.toFixed(4), this.velocity, Number(this.muted) ];
	}
}

