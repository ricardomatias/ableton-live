import { Properties } from './Properties';
import { AbletonLive } from './index';
import { Track, RawTrackKeys, RawTrack, TrackType } from './Track';
import { RawSceneKeys, RawScene, Scene } from './Scene';

export interface SongGetProperties {
	/**
	 * Get/set the state of the MIDI Arrangement Overdub button.
	 */
	arrangement_overdub: number;
	/**
	 * Get/set the current state of the Back to Arrangement button located in Live's transport bar (1 = highlighted).<br/>
	 * This button is used to indicate that the current state of the playback differs from what is stored in the Arrangement.
	 */
	back_to_arranger: number;
	/**
	 * true = Recently played MIDI material exists that can be captured into a Live Track. See capture_midi.
	 */
	can_capture_midi: number;
	/**
	 * false = there is no cue point to the right of the current one, or none at all.
	 */
	can_jump_to_next_cue: number;
	/**
	 * false = there is no cue point to the left of the current one, or none at all.
	 */
	can_jump_to_prev_cue: number;
	/**
	 * true = there is something in the history to redo.
	 */
	can_redo: number;
	/**
	 * true = there is something in the history to undo.
	 */
	can_undo: number;
	/**
	 * Reflects the quantization setting in the transport bar.
	 */
	clip_trigger_quantization: Quantization;
	/**
	 * The duration of the Metronome's Count-In setting as an index, mapped as follows:<br/>
	 * 0 = None<br/>
	 * 1 = 1 Bar<br/>
	 * 2 = 2 Bars<br/>
	 * 3 = 4 Bars <br/>
	 */
	count_in_duration: number;
	/**
	 * The playing position in the Live Set, in beats.
	 */
	current_song_time: number;
	/**
	 * Current status of the exclusive Arm option set in the Live preferences.
	 */
	exclusive_arm: boolean;
	/**
	 * Current status of the exclusive Solo option set in the Live preferences.
	 */
	exclusive_solo: boolean;
	/**
	 * The groove amount from the current set's groove pool (0. - 1.0).
	 */
	groove_amount: number;
	/**
	 * true = the Metronome is currently counting in.
	 */
	is_counting_in: boolean;
	/**
	 * Get/set if Live's transport is running.
	 */
	is_playing: boolean;
	/**
	 * The beat time of the last event (i.e. automation breakpoint, clip end, cue point, loop end) in the Arrangement.
	 */
	last_event_time: number;
	/**
	 * Get/set the enabled state of the Arrangement loop.
	 */
	loop: number;
	/**
	 * Arrangement loop length in beats.
	 */
	loop_length: number;
	/**
	 * Arrangement loop start in beats.
	 */
	loop_start: number;
	/**
	 * Get/set the enabled state of the metronome.
	 */
	metronome: number;
	/**
	 * Get/set the current Record Quantization value.
	 */
	midi_recording_quantization: RecordingQuantization;
	/**
	 * true = the Tempo Nudge Down button in the transport bar is currently pressed.
	 */
	nudge_down: number;
	/**
	 * true = the Tempo Nudge Up button in the transport bar is currently pressed.
	 */
	nudge_up: number;
	/**
	 * true = MIDI Arrangement Overdub is enabled in the transport.
	 */
	overdub: number;
	/**
	 * true = the Punch-In button is enabled in the transport.
	 */
	punch_in: number;
	/**
	 * true = the Punch-Out button is enabled in the transport.
	 */
	punch_out: number;
	/**
	 * true = the Re-Enable Automation button is on.
	 */
	re_enable_automation_enabled: number;
	/**
	 * true = the Arrangement Record button is on.
	 */
	record_mode: number;
	/**
	 * The root note of the song used for control surfaces.<br/>
	 * The root note can be a number between 0 and 11, where 0 = C and 11 = B.
	 */
	root_note: number;
	/**
	 * The last used scale name used for control surfaces
	 */
	scale_name: ScaleName;
	/**
	 * A list of integers representing the intervals in the current scale, expressed as the interval between the first scale degree and the scale degree at the list index.
	 */
	scale_intervals: number[];
	/**
	 * true = the "Select on Launch" option is set in Live's preferences.
	 */
	select_on_launch: number;
	/**
	 * The state of the Automation Arm button.
	 */
	session_automation_record: number;
	/**
	 * The state of the Session Overdub button.
	 */
	session_record: number;
	/**
	 * Reflects the state of the Session Record button.
	 */
	session_record_status: number;
	signature_denominator: number;
	signature_numerator: number;
	/**
	 * A little more than last_event_time , in beats.
	 */
	song_length: number;
	/**
	 * Range: 0.0 - 1.0; affects MIDI Recording Quantization and all direct calls to `Clip.quantize`.
	 */
	swing_amount: number;
	/**
	 * Current tempo of the Live Set in BPM, 20.0 ... 999.0. The tempo may be automated, so it can change depending on the current song time.
	 */
	tempo: number;

	/**
	 * true = the Tempo Follower controls the tempo.<br/>
	 * The Tempo Follower Toggle must be made visible in the preferences for this property to be effective.
	 */
	tempo_follower_enabled: boolean;
}

/**
 * @interface SongChildrenProperties
 */
export interface SongChildrenProperties {
	// cue_points: RawCuePoint[];
	master_track: RawTrack;
	return_tracks: RawTrack[];
	tracks: RawTrack[];
	scenes: RawScene[];
	/**
	 * A track is visible if it's not part of a folded group. If a track is scrolled out of view it's still considered visible.
	 */
	visible_tracks: RawTrack[];
	// groove_pool: RawGroovePool;
}

export interface SongTransformedProperties {
	// cue_points: RawCuePoint[];
	master_track: Track;
	return_tracks: Track[];
	tracks: Track[];
	scenes: Scene[];
	/**
	 * @inheritdoc SongChildrenProperties.visible_tracks
	 */
	visible_tracks: Track[];
}

export interface SongSetProperties {
	/**
	 * @inheritdoc SongGetProperties.arrangement_overdub
	 */
	arrangement_overdub: number;
	/**
	 * @inheritdoc SongGetProperties.back_to_arranger
	 */
	back_to_arranger: number;
	/**
	 * @inheritdoc SongGetProperties.clip_trigger_quantization
	 */
	clip_trigger_quantization: Quantization;
	/**
	 * @inheritdoc SongGetProperties.count_in_duration
	 */
	count_in_duration: number;
	/**
	 * @inheritdoc SongGetProperties.current_song_time
	 */
	current_song_time: number;
	/**
	 * @inheritdoc SongGetProperties.exclusive_arm
	 */
	exclusive_arm: number;
	/**
	 * @inheritdoc SongGetProperties.exclusive_solo
	 */
	exclusive_solo: number;
	/**
	 * @inheritdoc SongGetProperties.groove_amount
	 */
	groove_amount: number;
	/**
	 * @inheritdoc SongGetProperties.is_counting_in
	 */
	is_counting_in: boolean;
	/**
	 * @inheritdoc SongGetProperties.is_playing
	 */
	is_playing: boolean;
	/**
	 * @inheritdoc SongGetProperties.last_event_time
	 */
	last_event_time: number;
	/**
	 * @inheritdoc SongGetProperties.loop
	 */
	loop: number;
	/**
	 * @inheritdoc SongGetProperties.loop_length
	 */
	loop_length: number;
	/**
	 * @inheritdoc SongGetProperties.loop_start
	 */
	loop_start: number;
	/**
	 * @inheritdoc SongGetProperties.master_track
	 */
	master_track: number;
	/**
	 * @inheritdoc SongGetProperties.metronome
	 */
	metronome: number;
	/**
	 * @inheritdoc SongGetProperties.midi_recording_quantization
	 */
	midi_recording_quantization: RecordingQuantization;
	/**
	 * @inheritdoc SongGetProperties.nudge_down
	 */
	nudge_down: number;
	/**
	 * @inheritdoc SongGetProperties.nudge_up
	 */
	nudge_up: number;
	/**
	 * @inheritdoc SongGetProperties.overdub
	 */
	overdub: number;
	/**
	 * @inheritdoc SongGetProperties.punch_in
	 */
	punch_in: number;
	/**
	 * @inheritdoc SongGetProperties.punch_out
	 */
	punch_out: number;
	/**
	 * @inheritdoc SongGetProperties.re_enable_automation_enabled
	 */
	re_enable_automation_enabled: number;
	/**
	 * @inheritdoc SongGetProperties.record_mode
	 */
	record_mode: number;
	/**
	 * @inheritdoc SongGetProperties.return_tracks
	 */
	return_tracks: number;
	/**
	 * @inheritdoc SongGetProperties.root_note
	 */
	root_note: number;
	/**
	 * @inheritdoc SongGetProperties.scale_name
	 */
	scale_name: ScaleName;
	/**
	 * @inheritdoc SongGetProperties.scenes
	 */
	scenes: number;
	/**
	 * @inheritdoc SongGetProperties.select_on_launch
	 */
	select_on_launch: number;
	/**
	 * @inheritdoc SongGetProperties.session_automation_record
	 */
	session_automation_record: number;
	/**
	 * @inheritdoc SongGetProperties.session_record
	 */
	session_record: number;
	/**
	 * @inheritdoc SongGetProperties.session_record_status
	 */
	session_record_status: number;
	/**
	 * @inheritdoc SongGetProperties.signature_denominator
	 */
	signature_denominator: number;
	/**
	 * @inheritdoc SongGetProperties.signature_numerator
	 */
	signature_numerator: number;
	/**
	 * @inheritdoc SongGetProperties.song_length
	 */
	song_length: number;
	/**
	 * @inheritdoc SongGetProperties.swing_amount
	 */
	swing_amount: number;
	/**
	 * @inheritdoc SongGetProperties.tempo
	 */
	tempo: number;
	/**
	 * @inheritdoc SongGetProperties.tempo_follower_enabled
	 */
	tempo_follower_enabled: boolean;
	/**
	 * @inheritdoc SongGetProperties.visible_tracks
	 */
	visible_tracks: number;
}

export interface SongObservableProperties {
	/**
	 * @inheritdoc SongGetProperties.arrangement_overdub
	 */
	arrangement_overdub: number;
	/**
	 * @inheritdoc SongGetProperties.back_to_arranger
	 */
	back_to_arranger: number;
	/**
	 * @inheritdoc SongGetProperties.can_capture_midi
	 */
	can_capture_midi: number;
	/**
	 * @inheritdoc SongGetProperties.can_jump_to_next_cue
	 */
	can_jump_to_next_cue: number;
	/**
	 * @inheritdoc SongGetProperties.can_jump_to_prev_cue
	 */
	can_jump_to_prev_cue: number;
	/**
	 * @inheritdoc SongGetProperties.count_in_duration
	 */
	count_in_duration: number;
	/**
	 * @inheritdoc SongGetProperties.cue_points
	 */
	cue_points: number;
	/**
	 * @inheritdoc SongGetProperties.current_song_time
	 */
	current_song_time: number;
	/**
	 * @inheritdoc SongGetProperties.data
	 */
	data: number;
	/**
	 * @inheritdoc SongGetProperties.exclusive_arm
	 */
	exclusive_arm: number;
	/**
	 * @inheritdoc SongGetProperties.groove_amount
	 */
	groove_amount: number;
	/**
	 * @inheritdoc SongGetProperties.is_counting_in
	 */
	is_counting_in: boolean;
	/**
	 * @inheritdoc SongGetProperties.is_playing
	 */
	is_playing: boolean;
	/**
	 * @inheritdoc SongGetProperties.loop_length
	 */
	loop_length: number;
	/**
	 * @inheritdoc SongGetProperties.loop
	 */
	loop: number;
	/**
	 * @inheritdoc SongGetProperties.loop_start
	 */
	loop_start: number;
	/**
	 * @inheritdoc SongGetProperties.metronome
	 */
	metronome: number;
	/**
	 * @inheritdoc SongGetProperties.nudge_down
	 */
	nudge_down: number;
	/**
	 * @inheritdoc SongGetProperties.nudge_up
	 */
	nudge_up: number;
	/**
	 * @inheritdoc SongGetProperties.overdub
	 */
	overdub: number;
	/**
	 * @inheritdoc SongGetProperties.punch_in
	 */
	punch_in: number;
	/**
	 * @inheritdoc SongGetProperties.punch_out
	 */
	punch_out: number;
	/**
	 * @inheritdoc SongGetProperties.re_enable_automation_enabled
	 */
	re_enable_automation_enabled: number;
	/**
	 * @inheritdoc SongGetProperties.record_mode
	 */
	record_mode: number;
	/**
	 * @inheritdoc SongGetProperties.scale_name
	 */
	scale_name: ScaleName;
	/**
	 * @inheritdoc SongGetProperties.scale_intervals
	 */
	scale_intervals: number[];
	/**
	 * @inheritdoc SongGetProperties.session_automation_record
	 */
	session_automation_record: number;
	/**
	 * @inheritdoc SongGetProperties.session_record
	 */
	session_record: number;
	/**
	 * @inheritdoc SongGetProperties.session_record_status
	 */
	session_record_status: number;
	/**
	 * @inheritdoc SongGetProperties.signature_denominator
	 */
	signature_denominator: number;
	/**
	 * @inheritdoc SongGetProperties.signature_numerator
	 */
	signature_numerator: number;
	/**
	 * @inheritdoc SongGetProperties.song_length
	 */
	song_length: number;
	/**
	 * @inheritdoc SongGetProperties.swing_amount
	 */
	swing_amount: number;
	/**
	 * @inheritdoc SongGetProperties.tempo
	 */
	tempo: number;
	/**
	 * @inheritdoc SongGetProperties.tempo_follower_enabled
	 */
	tempo_follower_enabled: boolean;
}

/**
 * Quantization values
 *
 * * m = bars (f.ex - "8m" = 8 bars)
 * * n = note (f.ex - "4n")
 * * nt = triplet (f.ex - "4nt")
 */
export enum Quantization {
	none = 0,
	'8m' = 1,
	'4m' = 2,
	'2m' = 3,
	'1m' = 4,
	'2n' = 5,
	'2nt' = 6,
	'4n' = 7,
	'4nt' = 8,
	'8n' = 9,
	'8nt' = 10,
	'16n' = 11,
	'16nt' = 12,
	'32n' = 13,
}

/**
 * Record Quantization values
 *
 * * m = bars (f.ex - "8m" = 8 bars)
 * * n = note (f.ex - "4n")
 * * nt = triplet (f.ex - "4nt")
 */
export enum RecordingQuantization {
	none = 0,
	'4n' = 1,
	'8n' = 2,
	'8nt' = 3,
	/**
	 * 8n + 8t
	 */
	'8n_8nt' = 4,
	'16n' = 5,
	'16nt' = 6,
	/**
	 * 16n + 16nt
	 */
	'16n_16nt' = 7,
	'32n' = 8,
}

/**
 * hours:min:sec:frames [symbol]
 */
export enum SMPTE {
	/**
	 * the frame position shows the milliseconds
	 */
	FramePosition = 0,
	Smpte24 = 1,
	Smpte25 = 2,
	Smpte30 = 3,
	Smpte30Drop = 4,
	Smpte29 = 5,
}

export enum ScaleName {
	'Major' = 'Major',
	'Minor' = 'Minor',
	'Dorian' = 'Dorian',
	'Mixolydian' = 'Mixolydian',
	'Lydian' = 'Lydian',
	'Phrygian' = 'Phrygian',
	'Locrian' = 'Locrian',
	'Diminished' = 'Diminished',
	'Whole-half' = 'Whole-half',
	'Whole Tone' = 'Whole Tone',
	'Minor Blues' = 'Minor Blues',
	'Minor Pentatonic' = 'Minor Pentatonic',
	'Major Pentatonic' = 'Major Pentatonic',
	'Harmonic Minor' = 'Harmonic Minor',
	'Melodic Minor' = 'Melodic Minor',
	'Super Locrian' = 'Super Locrian',
	'Bhairav' = 'Bhairav',
	'Hungarian Minor' = 'Hungarian Minor',
	'Minor Gypsy' = 'Minor Gypsy',
	'Hirojoshi' = 'Hirojoshi',
	'In-Sen' = 'In-Sen',
	'Iwato' = 'Iwato',
	'Kumoi' = 'Kumoi',
	'Pelog' = 'Pelog',
	'Spanish' = 'Spanish',
}

const SongChildrenProperties = {
	scenes: RawSceneKeys,
	tracks: RawTrackKeys,
	master_track: RawTrackKeys,
	return_tracks: RawTrackKeys,
	return_track: RawTrackKeys,
	visible_tracks: RawTrackKeys,
	visible_track: RawTrackKeys,
};

/**
 * This class represents a Live Set
 *
 * @class Song
 * @extends {Properties<SongGetProperties, SongChildrenProperties, SongTransformedProperties, SongSetProperties, SongObservableProperties>}
 */
export class Song extends Properties<
	SongGetProperties,
	SongChildrenProperties,
	SongTransformedProperties,
	SongSetProperties,
	SongObservableProperties
> {
	static path = 'live_set';

	/**
	 * Creates an instance of Song.
	 * @param {AbletonLive} ableton
	 * @memberof Song
	 */
	constructor(ableton: AbletonLive) {
		super(ableton, 'song', Song.path, SongChildrenProperties);

		this.childrenTransformers = {
			master_track: (track) => new Track(this.ableton, track, 'live_set master_track'),
			tracks: (tracks) => tracks.map((t) => new Track(this.ableton, t)),
			scenes: (scenes) => scenes.map((s) => new Scene(this.ableton, s)),
			return_tracks: (tracks) => tracks.map((t) => new Track(this.ableton, t)),
			visible_tracks: (tracks) => tracks.map((t) => new Track(this.ableton, t)),
		};
	}

	// =========================================================================
	// * Custom API
	// =========================================================================
	/**
	 * Find a track by name
	 *
	 * @param {string} trackName
	 * @returns {(Promise<Track | undefined>)}
	 * @memberof Song
	 */
	async findTrackByName(trackName: string): Promise<Track | undefined> {
		const tracks = await this.children('tracks');

		return tracks.find((t) => t.name.includes(trackName));
	}

	/**
	 * Get all the audio tracks
	 *
	 * @returns {(Promise<Track[] | undefined>)}
	 * @memberof Song
	 */
	async getAudioTracks(): Promise<Track[] | undefined> {
		const tracks = await this.children('tracks');

		return tracks.filter((t) => t.type === TrackType.Audio);
	}

	/**
	 * Get all the midi tracks
	 *
	 * @returns {(Promise<Track[] | undefined>)}
	 * @memberof Song
	 */
	async getMidiTracks(): Promise<Track[] | undefined> {
		const tracks = await this.children('tracks');

		return tracks.filter((t) => t.type === TrackType.Midi);
	}

	/**
	 * Start playing a specific scene
	 *
	 * @returns {void}
	 * @memberof Song
	 */
	async playScene(scene: number) {
		const scenes = await this.children('scenes');
		const sn = scenes[scene - 1];

		if (sn) await sn.fire();
	}

	// =========================================================================
	// * Official API
	// =========================================================================

	/**
	 * Capture the currently playing clips and insert them as a new scene below the selected scene.
	 * @memberof Song
	 *
	 * @return {void}
	 */
	public async captureAndInsertScene(): Promise<void> {
		return this.call('capture_and_insert_scene');
	}

	/**
	 * Capture recently played MIDI material from audible tracks into a Live Clip.
	 * If destinaton is not set or it is set to auto, the Clip is inserted into the view currently visible in the focused Live window.
	 * Otherwise, it is inserted into the specified view.
	 * @memberof Song
	 *
	 * @param {0|1|2} destination 0 = auto, 1 = session, 2 = arrangement
	 * @return {void}
	 */
	public async captureMidi(destination = 0): Promise<void> {
		return this.call('capture_midi', [destination]);
	}

	/**
	 * From the current playback position.
	 * @memberof Song
	 *
	 * @return {void}
	 */
	public async continuePlaying(): Promise<void> {
		return this.call('continue_playing');
	}

	/**
	 * Index determines where the track is added, it is only valid between 0 and len(song.tracks).
	 * Using an index of -1 will add the new track at the end of the list.
	 * @memberof Song
	 *
	 * @param {number} index
	 * @return {void}
	 */
	public async createAudioTrack(index = -1): Promise<void> {
		return this.call('create_audio_track', [index]);
	}

	/**
	 * Index determines where the track is added, it is only valid between 0 and len(song.tracks).
	 * Using an index of -1 will add the new track at the end of the list.
	 * @memberof Song
	 *
	 * @param {number} index
	 * @return {void}
	 */
	public async createMidiTrack(index = -1): Promise<void> {
		return this.call('create_midi_track', [index]);
	}

	/**
	 * Adds a new return track at the end.
	 * @memberof Song
	 *
	 * @return {void}
	 */
	public async createReturnTrack(): Promise<void> {
		return this.call('create_return_track');
	}

	/**
	 * Index determines where the scene is added, it is only valid between 0 and len(song.scenes).
	 * Using an index of -1 will add the new scene at the end of the list.
	 * @memberof Song
	 *
	 * @param {number} index
	 * @return {void}
	 */
	public async createScene(index = -1): Promise<void> {
		return this.call('create_scene', [index]);
	}

	/**
	 * Delete the return track at the given index.
	 * @memberof Song
	 *
	 * @param {number} index
	 * @return {void}
	 */
	public async deleteReturnTrack(index: number): Promise<void> {
		return this.call('delete_return_track', [index]);
	}

	/**
	 * Delete the scene at the given index.
	 * @memberof Song
	 *
	 * @param {number} index
	 * @return {void}
	 */
	public async deleteScene(index: number): Promise<void> {
		return this.call('delete_scene', [index]);
	}

	/**
	 * Delete the track at the given index.
	 * @memberof Song
	 *
	 * @param {number} index
	 * @return {void}
	 */
	public async deleteTrack(index: number): Promise<void> {
		return this.call('delete_track', [index]);
	}

	/**
	 * Index determines which scene to duplicate.
	 * @memberof Song
	 *
	 * @param {number} index
	 * @return {void}
	 */
	public async duplicateScene(index: number): Promise<void> {
		return this.call('duplicate_scene', [index]);
	}

	/**
	 * Index determines which track to duplicate.
	 * @memberof Song
	 *
	 * @param {number} index
	 * @return {void}
	 */
	public async duplicateTrack(index: number): Promise<void> {
		return this.call('duplicate_track', [index]);
	}

	/**
	 * Force the Link timeline to jump to Live's current beat time.
	 * @memberof Song
	 *
	 * @return {void}
	 */
	public async forceLinkBeatTime(): Promise<void> {
		return this.call('force_link_beat_time');
	}

	/**
	 * The Arrangement loop length.
	 * @memberof Song
	 *
	 * @return {void} bars.beats.sixteenths.ticks
	 */
	public async getBeatsLoopLength(): Promise<void> {
		return this.call('get_beats_loop_length');
	}

	/**
	 * The Arrangement loop start.
	 * @memberof Song
	 *
	 * @return {void} bars.beats.sixteenths.ticks
	 */
	public async getBeatsLoopStart(): Promise<void> {
		return this.call('get_beats_loop_start');
	}

	/**
	 * The current Arrangement playback position.
	 * @memberof Song
	 *
	 * @return {void} bars.beats.sixteenths.ticks
	 */
	public async getCurrentBeatsSongTime(): Promise<void> {
		return this.call('get_current_beats_song_time');
	}

	/**
	 * The current Arrangement playback position.
	 * @memberof Song
	 *
	 * @param {SMPTE} format
	 * @return {void} hours:min:sec:frames
	 */
	public async getCurrentSmpteSongTime(format: SMPTE): Promise<void> {
		return this.call('get_current_smpte_song_time', [format]);
	}

	/**
	 * If the current Arrangement playback position is at a cue point
	 * @memberof Song
	 *
	 * @return {boolean}
	 */
	public async isCuePointSelected(): Promise<boolean> {
		return this.call('is_cue_point_selected');
	}

	/**
	 * Jump by
	 * @memberof Song
	 *
	 * @param {number} amount is the amount to jump relatively to the current position
	 * @return {void}
	 */
	public async jumpBy(amount: number): Promise<void> {
		return this.call('jump_by', [amount]);
	}

	/**
	 * Jump to the right, if possible.
	 * @memberof Song
	 *
	 * @return {void}
	 */
	public async jumpToNextCue(): Promise<void> {
		return this.call('jump_to_next_cue');
	}

	/**
	 * Jump to the left, if possible.
	 * @memberof Song
	 *
	 * @return {void}
	 */
	public async jumpToPrevCue(): Promise<void> {
		return this.call('jump_to_prev_cue');
	}

	/**
	 * Do nothing if no selection is set in Arrangement, or play the current selection.
	 * @memberof Song
	 *
	 * @return {void}
	 */
	public async playSelection(): Promise<void> {
		return this.call('play_selection');
	}

	/**
	 * Trigger 'Re-Enable Automation', re-activating automation in all running Session clips.
	 * @memberof Song
	 *
	 * @return {void}
	 */
	public async reEnableAutomation(): Promise<void> {
		return this.call('re_enable_automation');
	}

	/**
	 * Causes the Live application to redo the last operation.
	 * @memberof Song
	 *
	 * @return {void}
	 */
	public async redo(): Promise<void> {
		return this.call('redo');
	}

	/**
	 * Same as jump_by , at the moment.
	 * @memberof Song
	 *
	 * @param {number} amount is the amount to scrub relatively to the current position
	 * @return {void}
	 */
	public async scrubBy(amount: number): Promise<void> {
		return this.call('scrub_by', [amount]);
	}

	/**
	 * Toggle cue point at current Arrangement playback position.
	 * @memberof Song
	 *
	 * @return {void}
	 */
	public async setOrDeleteCue(): Promise<void> {
		return this.call('set_or_delete_cue');
	}

	/**
	 * Start playback from the insert marker.
	 * @memberof Song
	 *
	 * @return {void}
	 */
	public async startPlaying(): Promise<void> {
		return this.call('start_playing');
	}

	/**
	 * Calling the function with 0 will stop all clips immediately, independent of the launch quantization. The default is '1'.
	 * @memberof Song
	 *
	 * @param {boolean} quantized
	 * @return {void}
	 */
	public async stopAllClips(quantized = true): Promise<void> {
		return this.call('stop_all_clips', [quantized]);
	}

	/**
	 * Stop the playback.
	 * @memberof Song
	 *
	 * @return {void}
	 */
	public async stopPlaying(): Promise<void> {
		return this.call('stop_playing');
	}

	/**
	 * Same as pressing the Tap Tempo button in the transport bar.
	 * The new tempo is calculated based on the time between subsequent calls of this function.
	 * @memberof Song
	 *
	 * @return {void}
	 */
	public async tapTempo(): Promise<void> {
		return this.call('tap_tempo');
	}

	/**
	 * Starts recording in either the selected slot or the next empty slot, if the track is armed.
	 * If recordLength is provided, the slot will record for the given length in beats.
	 *
	 * If triggered while recording, recording will stop and clip playback will start.
	 * @memberof Song
	 *
	 * @param {number} [recordLength=undefined]
	 * @return {void}
	 */
	public async triggerSessionRecord(recordLength?: number): Promise<void> {
		return this.call('trigger_session_record', recordLength ? [recordLength] : undefined);
	}

	/**
	 * Causes the Live application to undo the last operation.
	 * @memberof Song
	 *
	 * @return {void}
	 */
	public async undo(): Promise<void> {
		return this.call('undo');
	}
}
