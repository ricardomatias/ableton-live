import { Properties } from './Properties';
import { AbletonLive } from '.';
import { Note, SerializedNote } from './Note';


// TODO Missing properties
// > groove
// > has_groove
// > loop_jump
// > notes (bang)
// > warp_markers (bang)
// > playing_status (bang)


export const enum WarpMode {
	Beats = 0,
	Tones = 1,
	Texture = 2,
	RePitch = 3,
	Complex = 4,
	Rex = 5,
	ComplexPro = 6,
}

export const enum LaunchMode {
	Trigger = 0,
	Gate = 1,
	Toggle = 2,
	Repeat = 3,
}

export enum LaunchQuantization {
	global = 0,
	none = 1,
	'8m' = 2,
	'4m' = 3,
	'2m' = 4,
	'1m' = 5,
	'2n' = 6,
	'2nt' = 7,
	'4n' = 8,
	'4nt' = 9,
	'8n' = 10,
	'8nt' = 11,
	'16n' = 12,
	'16nt' = 13,
	'32n' = 14,
}

/**
 * @interface ClipGetProperties
 */
export interface ClipGetProperties {
	name: string;
	/**
	 * Current playing position of the clip.</br>
	 * </br>
	 * For MIDI and warped audio clips, the value is given in beats of absolute clip time.</br>
	 * </br>
	 * The clip's beat time of 0 is where 1 is shown in the bar/beat/16th time scale at the top of the clip view.</br>
	 * </br>
	 * For unwarped audio clips, the position is given in seconds, according to the time scale shown at the bottom of the clip view.</br>
	 * Stopped clips have a playing position of 0.</br>
	 */
	playing_position: number;
	/**
	 * @inheritdoc SceneGetProperties.color
	 */
	color: number;
	/**
	 * @inheritdoc SceneGetProperties.color_index
	 */
	color_index: number;
	/**
	 * The end marker of the clip in beats, independent of the loop state. Cannot be set before the start marker.
	 */
	end_marker: number;
	/**
	 * The end time of the clip. For Session View clips, if Loop is on, this is the Loop End, otherwise it's the End Marker.
	 * For Arrangement View clips, this is always the position of the clip's rightmost edge in the Arrangement.
	 */
	end_time: number;
	/**
	 * Get/observe whether the clip has any automation.
	 */
	has_envelopes: boolean;
	/**
	 * false = MIDI clip, true = audio clip
	 */
	is_audio_clip: boolean;
	/**
	 * The end marker of the clip in beats, independent of the loop state. Cannot be set before the start marker.
	 */
	is_midi_clip: boolean;
	/**
	 * true = The clip is an Arrangement clip.
	 * A clip can be either an Arrangement or a Session clip.
	 */
	is_arrangement_clip: boolean;
	/**
	 * true = clip is overdubbing.
	 */
	is_overdubbing: boolean;
	/**
	 * true = clip is playing or recording.
	 */
	is_playing: boolean;
	/**
	 * true = clip is recording.
	 */
	is_recording: boolean;
	/**
	 * true = Clip Launch button is blinking.
	 */
	is_triggered: boolean;
	/**
	 * The end marker of the clip in beats, independent of the loop state. Cannot be set before the start marker.
	 */
	launch_mode: LaunchMode;
	/**
	 * The end marker of the clip in beats, independent of the loop state. Cannot be set before the start marker.
	 */
	launch_quantization: LaunchQuantization;
	/**
	 * For looped clips: loop length in beats. Otherwise it's the distance in beats from start to end marker.
	 * Makes no sense for unwarped audio clips.
	 */
	length: number;
	/**
	 * true = Legato Mode switch in the Clip's Launch settings is on.
	 */
	legato: boolean;
	/**
	 * For looped clips: loop end.
	 * For unlooped clips: clip end.
	 */
	loop_end: number;
	/**
	 * For looped clips: loop start.</br>
	 * For unlooped clips: clip start.</br>
	 *
	 * loop_start and loop_end are in absolute clip beat time if clip is MIDI or warped. The 1.1.1 position has beat time 0.
	 * If the clip is unwarped audio, they are given in seconds, 0 is the time of the first sample in the audio material.
	 */
	loop_start: number;
	/**
	 * true = clip is looped. Unwarped audio cannot be looped.
	 */
	looping: boolean;
	/**
	 * true = muted (i.e. the Clip Activator button of the clip is off).
	 */
	muted: boolean;
	/**
	 * Get and set the clip's loop position.
	 * The value will always equal loop_start, however setting this property, unlike setting loop_start, preserves the loop length.
	 */
	position: number;
	/**
	 * true1 = an audio clip’s RAM switch is enabled.
	 */
	ram_mode: boolean;
	signature_denominator: number;
	signature_numerator: number;
	/**
	 * The start marker of the clip in beats, independent of the loop state. Cannot be set behind the end marker.
	 */
	start_marker: number;
	/**
	 * The start time of the clip, relative to the global song time. For Session View clips, this is the time the clip was started.
	 * For Arrangement View clips, this is the offset within the arrangement. The value is in beats.
	 */
	start_time: number;
	/**
	 * How much the velocity of the note that triggers the clip affects its volume, 0 = no effect, 1 = full effect.
	 */
	velocity_amount: number;
	/**
	 * true for MIDI clips which are in triggered state, with the track armed and MIDI Arrangement Overdub on.
	 */
	will_record_on_start: number;

	// !IMPORTANT: AUDIO ONLY
	// warp modes

	/**
	 * Returns the list of indexes of the Warp Modes available for the clip. Only valid for audio clips.
	 */
	available_warp_modes: WarpMode[];
	/**
	 * The gain of the clip (range is 0.0 to 1.0)
	 */
	gain: number;
	/**
	 * Get the gain display value of the clip as a string (e.g. "1.3 dB").
	 */
	gain_display_string: string;
	/**
	 * Get the location of the audio file represented by the clip
	 */
	file_path: string;
	/**
	 * Pitch shift in semitones ("Transpose"), -48 ... 48.
	 * Available for audio clips only.
	 */
	pitch_coarse: number;
	/**
	 * Extra pitch shift in cents ("Detune"), -50 ... 49.
	 * Available for audio clips only.
	 */
	pitch_fine: number;
	warp_mode: WarpMode;
	/**
	 * true = Warp switch is on.
	 */
	warping: boolean;
}

/**
 * @interface ClipSetProperties
 */
export interface ClipSetProperties {
	name: string;
	/**
	 * @inheritdoc SceneGetProperties.color
	 */
	color: number;
	/**
	 * @inheritdoc SceneGetProperties.color_index
	 */

	color_index: number;
	/**
	 * @inheritdoc ClipGetProperties.end_marker
	 */
	end_marker: number;
	/**
	 * @inheritdoc ClipGetProperties.launch_mode
	 */
	launch_mode: LaunchMode;
	/**
	 * @inheritdoc ClipGetProperties.launch_quantization
	 */
	launch_quantization: LaunchQuantization;
	/**
	 * @inheritdoc ClipGetProperties.legato
	 */
	legato: boolean;
	/**
	 * @inheritdoc ClipGetProperties.loop_end
	 */
	loop_end: number;
	/**
	 * @inheritdoc ClipGetProperties.loop_start
	 */
	loop_start: number;
	/**
	 * @inheritdoc ClipGetProperties.looping
	 */
	looping: boolean;
	/**
	 * @inheritdoc ClipGetProperties.is_playing
	 */
	is_playing: boolean;
	/**
	 * @inheritdoc ClipGetProperties.muted
	 */
	muted: boolean;
	/**
	 * @inheritdoc ClipGetProperties.position
	 */
	position: number;
	/**
	 * @inheritdoc ClipGetProperties.ram_mode
	 */
	ram_mode: boolean;
	/**
	 * @inheritdoc ClipGetProperties.signature_denominator
	 */
	signature_denominator: number;
	/**
	 * @inheritdoc ClipGetProperties.signature_numerator
	 */
	signature_numerator: number;
	/**
	 * @inheritdoc ClipGetProperties.start_marker
	 */
	start_marker: number;
	/**
	 * @inheritdoc ClipGetProperties.velocity_amount
	 */
	velocity_amount: number;

	// !IMPORTANT: AUDIO ONLY
	/**
	 * @inheritdoc ClipGetProperties.gain
	 */
	gain: number;
	/**
	 * @inheritdoc ClipGetProperties.pitch_coarse
	 */
	pitch_coarse: number;
	/**
	 * @inheritdoc ClipGetProperties.pitch_fine
	 */
	pitch_fine: number;
	/**
	 * @inheritdoc ClipGetProperties.warp_mode
	 */
	warp_mode: WarpMode;
	/**
	 * @inheritdoc ClipGetProperties.warping
	 */
	warping: boolean;
}

/**
 * @interface ClipObservableProperties
 */
export interface ClipObservableProperties {
	name: string;
	/**
	 * @inheritdoc ClipGetProperties.playing_position
	 */
	playing_position: number;
	/**
	 * @inheritdoc SceneGetProperties.color
	 */
	color: number;
	/**
	 * @inheritdoc SceneGetProperties.color_index
	 */
	color_index: number;
	/**
	 * @inheritdoc ClipGetProperties.end_marker
	 */
	end_marker: number;
	/**
	 * @inheritdoc ClipGetProperties.end_time
	 */
	end_time: number;
	/**
	 * @inheritdoc ClipGetProperties.has_envelopes
	 */
	has_envelopes: boolean;
	/**
	 * @inheritdoc ClipGetProperties.is_audio_clip
	 */
	is_audio_clip: boolean;
	/**
	 * @inheritdoc ClipGetProperties.is_midi_clip
	 */
	is_midi_clip: boolean;
	/**
	 * @inheritdoc ClipGetProperties.is_arrangement_clip
	 */
	is_arrangement_clip: boolean;
	/**
	 * @inheritdoc ClipGetProperties.is_overdubbing
	 */
	is_overdubbing: boolean;
	/**
	 * @inheritdoc ClipGetProperties.is_recording
	 */
	is_recording: boolean;
	/**
	 * @inheritdoc ClipGetProperties.launch_mode
	 */
	launch_mode: LaunchMode;
	/**
	 * @inheritdoc ClipGetProperties.launch_quantization
	 */
	launch_quantization: LaunchQuantization;
	/**
	 * @inheritdoc ClipGetProperties.legato
	 */
	legato: boolean;
	/**
	 * @inheritdoc ClipGetProperties.loop_end
	 */
	loop_end: number;
	/**
	 * @inheritdoc ClipGetProperties.loop_start
	 */
	loop_start: number;
	/**
	 * @inheritdoc ClipGetProperties.looping
	 */
	looping: boolean;
	/**
	 * @inheritdoc ClipGetProperties.muted
	 */
	muted: boolean;
	/**
	 * @inheritdoc ClipGetProperties.position
	 */
	position: number;
	/**
	 * @inheritdoc ClipGetProperties.ram_mode
	 */
	ram_mode: boolean;
	/**
	 * @inheritdoc ClipGetProperties.signature_denominator
	 */
	signature_denominator: number;
	/**
	 * @inheritdoc ClipGetProperties.signature_numerator
	 */
	signature_numerator: number;
	/**
	 * @inheritdoc ClipGetProperties.start_marker
	 */
	start_marker: number;
	/**
	 * @inheritdoc ClipGetProperties.velocity_amount
	 */
	velocity_amount: number;

	// !IMPORTANT: AUDIO ONLY
	/**
	 * @inheritdoc ClipGetProperties.gain
	 */
	gain: number;
	/**
	 * @inheritdoc ClipGetProperties.pitch_coarse
	 */
	pitch_coarse: number;
	/**
	 * @inheritdoc ClipGetProperties.pitch_fine
	 */
	pitch_fine: number;
	/**
	 * @inheritdoc ClipGetProperties.warp_mode
	 */
	warp_mode: number;
	/**
	 * @inheritdoc ClipGetProperties.warping
	 */
	warping: boolean;
}

export const enum ClipType {
	Midi = 'midi',
	Audio = 'audio',
}

export interface RawClip {
	id: string;
	path:string;
	name: string;
	length: number;
	is_audio_clip: boolean;
}

/**
 * @private
 */
export const RawClipKeys = [ 'name', 'is_audio_clip', 'length' ];

type NotesResponse = {
	notes: SerializedNote[];
};

/**
 * This class represents a clip in Live. It can be either an audio clip or a MIDI clip in the Arrangement or Session View, depending on the track / slot it lives in.
 *
 * @class Clip
 * @extends {Properties<ClipGetProperties, unknown, unknown, ClipSetProperties, ClipObservableProperties>}
 */
export class Clip extends Properties<ClipGetProperties, unknown, unknown, ClipSetProperties, ClipObservableProperties> {
	static sessionPath = 'live_set tracks $1 clip_slots $2 clip';
	static arrangementPath = 'live_set tracks $1 arrangement_clips $2 clip';

	static getSessionPath(trackNumber: number, clipSlotNumber: number): string {
		return Clip.sessionPath.replace('$1', `${trackNumber}`).replace('$2', `${clipSlotNumber}`);
	}

	static getArrangementPath(trackNumber: number, clipSlotNumber: number, ): string {
		return Clip.arrangementPath.replace('$1', `${trackNumber}`).replace('$2', `${clipSlotNumber}`);
	}

	private _name: string;
	private _type: ClipType;
	private _length: number;

	/**
	 * Creates an instance of Clip.
	 * @private
	 * @param {AbletonLive} ableton
	 * @param {RawClip} raw
	 * @param {string} [path]
	 * @memberof Clip
	 */
	constructor(ableton: AbletonLive, public raw: RawClip, path?: string) {
		super(ableton, 'clip', path ?? raw.path );

		this._id = parseInt(raw.id, 10);
		this._name = raw.name;
		this._type = raw.is_audio_clip ? ClipType.Midi : ClipType.Audio;
		this._length = raw.length;

		this.childrenTransformers = {};
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
		await Promise.all(
			notes.map((n) => {
				return this.removeNotes(n.start, n.duration, n.pitch, 1);
			})
		);
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
	 * Add new notes to a clip. For MIDI clips only.
	 *
	 * @memberof Clip
	 *
	 * @param {Array<Note>} notes
	 * @return {void}
	 */
	public async addNewNotes(notes: Note[]): Promise<void> {
		return this.call('add_new_notes', [ this.prepareNotes(notes) ]);
	}

	/**
	 * Add new notes to a clip. For MIDI clips only.
	 *
	 * @memberof Clip
	 *
	 * @param {Array<Note>} notes as returned from getNotesExtended
	 * @return {void}
	 */
	public async applyNoteModifications(notes: Note[]): Promise<void> {
		return this.call('apply_note_modifications', [ this.prepareNotes(notes) ]);
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
		transpositionAmount = 0
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
		return this.call('get_notes_extended', [ startPitch, pitchRange, startTime.toFixed(3), timeRange.toFixed(3) ]).then(
			this.parseNotes.bind(this)
		);
	}

	/**
	 * Provided note IDs must be associated with existing notes in the clip. Existing notes can be queried with getNotw.
	 *
	 * @memberof Clip
	 *
	 * @param {Array<string>} ids note ids
	 * @return {void}
	 */
	public async getNotesById(ids: number[]): Promise<Note[]> {
		return this.call('get_notes_by_id', [ ...ids ]).then(this.parseNotes.bind(this));
	}

	/**
	 * Use this if you want to operate on the selected notes
	 *
	 * @memberof Clip
	 *
	 * @return {void}
	 */
	public async getSelectedNotes(): Promise<Note[]> {
		return this.call('get_selected_notes_extended').then(this.parseNotes.bind(this));
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
		return this.call('remove_notes_extended', [ startPitch, pitchRange, startTime.toFixed(4), timeRange.toFixed(4) ]);
	}

	/**
	 * Deletes all notes associated with the provided IDs.
	 *
	 * @memberof Clip
	 *
	 * @param {Array<string>} ids note ids
	 * @return {void}
	 */
	public async removeNotesById(ids: number[]): Promise<void> {
		return this.call('remove_notes_by_id', [ ...ids ]);
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

	private prepareNotes(notes: Note[]): { notes: SerializedNote[] } {
		return { notes: notes.map((n) => n.serialize) };
	}

	private parseNotes(data: string): Note[] {
		const notes: Note[] = (<NotesResponse>JSON.parse(data)).notes.map((n) => {
			return new Note(n.pitch, n.start_time, n.duration, n.velocity, {
				id: n.note_id,
				muted: Boolean(n.mute),
				probability: n.probability,
				velocityDeviation: n.velocity_deviation,
				releaseVelocity: n.release_velocity,
			});
		});
		// note_id

		notes.sort((a: Note, b: Note) => a.start - b.start);

		return notes;
	}
}
