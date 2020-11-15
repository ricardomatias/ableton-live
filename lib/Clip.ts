import { Properties } from './Properties';
import { AbletonLive } from '.';
import { Note } from './Note';


export const enum WarpMode {
	Beats = 0,
	Tones = 1,
	Texture = 2,
	RePitch = 3,
	Complex = 4,
	Rex = 5,
	ComplexPro = 6,
}

export interface GettableProperties {
	name: string;
	playing_position: number;
	color: number;
	color_index: number;
	end_marker: number;
	end_time: number;
	has_envelopes: boolean;
	is_audio_clip: boolean;
	is_midi_clip: boolean;
	is_arrangement_clip: boolean;
	is_overdubbing: boolean;
	is_playing: boolean;
	is_recording: boolean;
	is_triggered: boolean;
	length: number;
	loop_end: number;
	loop_start: number;
	looping: boolean;
	muted: boolean;
	position: number;
	ram_mode: boolean;
	signature_denominator: number;
	signature_numerator: number;
	start_marker: number;
	start_time: number;
	will_record_on_start: number;

	// !IMPORTANT: AUDIO ONLY
	// warp modes

	available_warp_modes: WarpMode[];
	gain: number;
	gain_display_string: string;
	file_path: string;
	warp_mode: WarpMode;
	warping: boolean;
}

export interface TransformedProperties {
	// get_notes: Note[]
}

export interface SettableProperties {
	name: string;
	color: number;
	color_index: number;
	end_marker: number;
	loop_end: number;
	loop_start: number;
	looping: boolean;
	muted: boolean;
	position: number;
	ram_mode: boolean;
	signature_denominator: number;
	signature_numerator: number;
	start_marker: number;

	// !IMPORTANT: AUDIO ONLY
	gain: number;
	pitch_coarse: number;
	pitch_fine: number;
	warp_mode: number;
	warping: boolean;
}

export interface ObservableProperties {
	name: string;
	playing_position: number;
	color: number;
	color_index: number;
	end_marker: number;
	end_time: number;
	has_envelopes: boolean;
	is_audio_clip: boolean;
	is_midi_clip: boolean;
	is_arrangement_clip: boolean;
	is_overdubbing: boolean;
	is_recording: boolean;
	loop_end: number;
	// loop_jump: bang;
	loop_start: number;
	looping: boolean;
	muted: boolean;
	// playing_status: bang;
	position: number;
	ram_mode: boolean;
	signature_denominator: number;
	signature_numerator: number;
	start_marker: number;

	// !IMPORTANT: AUDIO ONLY
	gain: number;
	pitch_coarse: number;
	pitch_fine: number;
	warp_mode: number;
	warping: boolean;
}

export const enum ClipType {
	Midi = 'midi',
	Audio = 'audio',
}

export interface RawClip {
	id: string;
	name: string;
	length: number;
	is_audio_clip: boolean;
}

export const RawClip = [
	'name',
	'is_audio_clip',
	'length',
];


export class Clip extends Properties<
	GettableProperties,
	unknown,
	unknown,
	SettableProperties,
	ObservableProperties
	> {
	static path = 'live_set tracks $1 clip_slots $2 clip';
	private _name: string;
	private _type: ClipType;
	private _length: number;

	constructor(ableton: AbletonLive, public raw: RawClip, path?: string) {
		super(ableton, 'clip', path ? path : Clip.path);

		this._id = parseInt(raw.id, 10);
		this._name = raw.name;
		this._type = raw.is_audio_clip ? ClipType.Midi : ClipType.Audio;
		this._length = raw.length;

		this.transformers = {};
	}

	// =========================================================================
	// * Custom API
	// =========================================================================

	/**
	 * Remove all selected notes
	 *
	 * @memberof Clip
	 * @param {Note[]} notes
	 * @return {(Promise<void>)}
	 */
	async removeSelectedNotes(notes: Note[]): Promise<void> {
		await Promise.all(notes.map((n) => {
			return this.removeNotes(n.start, n.duration, n.pitch, 1);
		}));
	}

	// =========================================================================
	// * Official API
	// =========================================================================

	/**
	 * The name of the clip
	 *
	 * @readonly
	 * @type {string}
	 * @memberof Clip
	 */
	get name(): string {
		return this._name;
	}

	/**
	 * The type of clip
	 *
	 * @readonly
	 * @type {'audio' | 'midi'}
	 * @memberof Clip
	 */
	get type(): ClipType {
		return this._type;
	}

	/**
	 * The clip's length (duration)
	 *
	 * @readonly
	 * @type {string}
	 * @memberof Clip
	 */
	get length(): number {
		return this._length;
	}

	/**
	* Removes all automation in the clip
	* @memberof Clip
	*
	* @return {void}
	*/
	public async clearAllEnvelopes(): Promise<void> {
		return this.call('clear_all_envelopes');
	}


	/**
	* Removes the automation of the clip for the given parameter
	* @memberof Clip
	*
	* @param {number} [deviceParameterId]
	* @return {void}
	*/
	public async clearEnvelope(deviceParameterId: number): Promise<void> {
		return this.call('clear_envelope', [ deviceParameterId ]);
	}

	/**
	* Crops the clip: if the clip is looped, the region outside the loop is removed;
	* if it isn't, the region outside the start and end markers.
	* @memberof Clip
	*
	* @return {void}
	*/
	public async crop(): Promise<void> {
		return this.call('crop');
	}

	/**
	* Call this before replace_selected_notes if you just want to add some notes.
	* For MIDI clips only.
	* @memberof Clip
	*
	* @return {void}
	*/
	public async deselectAllNotes(): Promise<void> {
		return this.call('deselect_all_notes');
	}

	/**
	* Makes the loop two times longer by moving loop_end to the right, and duplicates both the notes and the envelopes.
	* If the clip is not looped, the clip start/end range is duplicated.
	* For MIDI clips only.
	* @memberof Clip
	*
	* @return {void}
	*/
	public async duplicateLoop(): Promise<void> {
		return this.call('duplicate_loop');
	}

	/**
	* Duplicate the notes in the specified region to the destination_time.
	* Only notes of the specified pitch are duplicated or all if pitch is -1.
	* If the transposition_amount is not 0, the notes in the region will be transposed by the transpose_amount of semitones.
	* For MIDI clips only.
	* @memberof Clip
	* @example
	* // duplicates 1 bar to the beginning of the next bar
	* await clip.duplicateRegion(0, 4, 4);
	*
	* @param {number} [regionStart] beats time
	* @param {number} [regionLength] beats time
	* @param {number} [destinationTime] beats time
	* @param {number} [pitch = -1]
	* @param {number} [transpositionAmount = 0]
	* @return {void}
	*/
	public async duplicateRegion(
		regionStart: number,
		regionLength: number,
		destinationTime: number,
		pitch = -1,
		transpositionAmount = 0,
	): Promise<void> {
		return this.call('duplicate_region', [ regionStart, regionLength, destinationTime, pitch, transpositionAmount ]);
	}

	/**
	* Same effect as pressing the Clip Launch button.
	* @memberof Clip
	*
	* @return {void}
	*/
	public async fire(): Promise<void> {
		return this.call('fire');
	}

	/**
	 * Returns a list of notes that start in the given area. The output is similar to get_selected_notes.
	 *
	 * @memberof Clip
	 *
	 * @param {number} [startTime=0]
	 * @param {number} [timeRange=256]
	 * @param {number} [startPitch=0]
	 * @param {number} [pitchRange=127]
	 * @return {void}
	 */
	public async getNotes(startTime = 0, timeRange = 256, startPitch = 0, pitchRange = 127): Promise<Note[]> {
		return this.call('get_notes', [ startTime.toFixed(3), startPitch, timeRange.toFixed(3), pitchRange ])
			.then(this.parseNotes.bind(this));
	}

	/**
	 * Use this if you want to operate on the selected notes
	 *
	 * @memberof Clip
	 *
	 * @return {void}
	 */
	public async getSelectedNotes(): Promise<Note[]> {
		return this.call('get_selected_notes').then(this.parseNotes.bind(this));
	}

	/**
	* Jumps by given amount, unquantized.
	* Unwarped audio clips, recording audio clips and recording non-overdub MIDI clips cannot jump.
	* @memberof Clip
	*
	* @param {number} beats relative jump distance in beats. Negative beats jump backwards.
	*
	* @return {void}
	*/
	public async movePlayingPos(beats: number): Promise<void> {
		return this.call('move_playing_pos', [ beats ]);
	}

	/**
	* Quantizes all notes in the clip to the quantization_grid taking the song's swing_amount into account.
	* @memberof Clip
	*
	* @param {number} quantizationGrid
	* @param {number} amount
	*
	* @return {void}
	*/
	public async quantize(quantizationGrid: number, amount: number): Promise<void> {
		return this.call('quantize', [ quantizationGrid, amount ]);
	}

	/**
	* Same as quantize, but only for notes in the given pitch.
	* @memberof Clip
	*
	* @param {number} pitch
	* @param {number} quantizationGrid
	* @param {number} amount
	*
	* @return {void}
	*/
	public async quantizePitch(pitch: number, quantizationGrid: number, amount: number): Promise<void> {
		return this.call('quantize_pitch', [ pitch, quantizationGrid, amount ]);
	}

	/**
	 * Deletes all notes that start in the given area.
	 *
	 * @memberof Clip
	 *
	 * @param {number} [startTime=0]
	 * @param {number} [timeRange=256]
	 * @param {number} [startPitch=0]
	 * @param {number} [pitchRange=127]
	 * @return {void}
	 */
	public async removeNotes(startTime = 0, timeRange = 256, startPitch = 0, pitchRange = 127): Promise<void> {
		return this.call('remove_notes', [ startTime.toFixed(4), startPitch, timeRange.toFixed(4), pitchRange ]);
	}

	/**
	 * The sequence is the same as in get_selected_notes , the parameters are the same too.
	 * The sequence must always be completed, since the clip waits for the respective calls even if intermediate messages are sent.
	 * If count is zero, this means there are no note calls.
	 *
	 * In Live, notes don't overlap, so if the new notes overlap with unselected notes, the unselected ones are made to fit in the same way as when you edit notes manually.
	 *
	 * For MIDI clips only.
	 *
	 * @memberof Clip
	 *
	 * @param {Array<Note>} notes
	 * @return {void}
	 */
	public async replaceSelectedNotes(notes: Note[]): Promise<void> {
		return this.callMultiple([
			[ 'replace_selected_notes' ],
			[ 'notes', notes.length ],
			...notes.map((note) => [ 'note' ].concat(note.serialize() as any[])),
			[ 'done' ],
		]);
	}

	/**
	* Scrub the clip to a time, specified in beats. This behaves exactly like scrubbing with the mouse;
	* the scrub will respect Global Quantization, starting and looping in time with the transport.
	* The scrub will continue until stopScrub() is called.
	* @memberof Clip
	*
	* @param {number} beatTime
	*
	* @return {void}
	*/
	public async scrub(beatTime: number): Promise<void> {
		return this.call('scrub', [ beatTime ]);
	}

	/**
	* Use this function to process all notes of a clip, independent of the current selection.
	* @memberof Clip
	*
	* @return {void}
	*/
	public async selectAllNotes(): Promise<void> {
		return this.call('select_all_notes');
	}

	/**
	* If the state is set to true, Live simulates pressing the clip start button until the state is set to false,
	* or until the clip is otherwise stopped.
	* @memberof Clip
	*
	* @param {boolean} state
	*
	* @return {void}
	*/
	public async setFireButtonState(state: boolean): Promise<void> {
		return this.call('set_fire_button_state', [ state ]);
	}

	/**
	 * Will apply the given notes to the clip, overwriting existing notes.
	 *
	 * For MIDI clips only.
	 *
	 * @memberof Clip
	 *
	 * @param {Array<Note>} notes
	 * @return {void}
	 */
	public async setNotes(notes: Note[]): Promise<void> {
		return this.callMultiple([
			[ 'set_notes' ],
			[ 'notes', notes.length ],
			...notes.map((note) => [ 'note' ].concat(note.serialize() as any[])),
			[ 'done' ],
		]);
	}

	/**
	* Same effect as pressing the stop button of the track, but only if this clip is actually playing or recording.
	* If this clip is triggered or if another clip in this track is playing, it has no effect.
	* @memberof Clip
	*
	* @return {void}
	*/
	public async stop(): Promise<void> {
		return this.call('stop');
	}

	/**
	* Stops an active scrub on a clip
	* @memberof Clip
	*
	* @return {void}
	*/
	public async stopScrub(): Promise<void> {
		return this.call('stop_scrub');
	}

	private parseNotes(data): Note[] {
		const notes: Note[] = [];
		// data starts with "notes"/count and ends with "done" (which we ignore)
		for (let i = 2, len = data.length - 1; i < len; i += 6) {
			// and each note starts with "note" (which we ignore) and is 6 items in the list
			const note = new Note(data[i + 1], data[i + 2], data[i + 3], data[i + 4], Boolean(data[i + 5]));
			notes.push(note);
		}

		notes.sort((a: Note, b: Note) => a.start - b.start);

		return notes;
	}
}


