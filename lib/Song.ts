import { Properties } from './Properties';
import { AbletonLive } from './index';
import { Track, RawTrack, TrackType } from './Track';
import { RawScene, Scene } from './Scene';


export interface GettableProperties {
	arrangement_overdub: number;
	back_to_arranger: number;
	can_capture_midi: number;
	can_jump_to_next_cue: number;
	can_jump_to_prev_cue: number;
	can_redo: number;
	can_undo: number;
	clip_trigger_quantization: Quantization;
	count_in_duration: number;
	current_song_time: number;
	exclusive_arm: boolean;
	exclusive_solo: boolean;
	groove_amount: number;
	is_counting_in: boolean;
	is_playing: boolean;
	last_event_time: number;
	loop: number;
	loop_length: number;
	loop_start: number;
	master_track: RawTrack;
	metronome: number;
	midi_recording_quantization: RecordingQuantization;
	nudge_down: number;
	nudge_up: number;
	overdub: number;
	punch_in: number;
	punch_out: number;
	re_enable_automation_enabled: number;
	record_mode: number;
	root_note: number;
	scale_name: number;
	select_on_launch: number;
	session_automation_record: number;
	session_record: number;
	session_record_status: number;
	signature_denominator: number;
	signature_numerator: number;
	song_length: number;
	swing_amount: number;
	tempo: number;
	view: number;
}

export interface ChildrenProperties {
	// cue_points: RawCuePoint[];
	master_track: RawTrack;
	return_tracks: RawTrack[];
	tracks: RawTrack[];
	scenes: RawScene[];
	visible_tracks: RawTrack[];
}

export interface TransformedProperties {
	// cue_points: RawCuePoint[];
	master_track: Track;
	return_tracks: Track[];
	tracks: Track[];
	scenes: Scene[];
	visible_tracks: Track[];
}

export interface SettableProperties {
	arrangement_overdub: number;
	back_to_arranger: number;
	clip_trigger_quantization: Quantization;
	count_in_duration: number;
	current_song_time: number;
	exclusive_arm: number;
	exclusive_solo: number;
	groove_amount: number;
	is_counting_in: boolean;
	is_playing: boolean;
	last_event_time: number;
	loop: number;
	loop_length: number;
	loop_start: number;
	master_track: number;
	metronome: number;
	midi_recording_quantization: RecordingQuantization;
	nudge_down: number;
	nudge_up: number;
	overdub: number;
	punch_in: number;
	punch_out: number;
	re_enable_automation_enabled: number;
	record_mode: number;
	return_tracks: number;
	root_note: number;
	scale_name: number;
	scenes: number;
	select_on_launch: number;
	session_automation_record: number;
	session_record: number;
	session_record_status: number;
	signature_denominator: number;
	signature_numerator: number;
	song_length: number;
	swing_amount: number;
	tempo: number;
	visible_tracks: number;
}

export interface ObservableProperties {
	arrangement_overdub: number;
	back_to_arranger: number;
	can_capture_midi: number;
	can_jump_to_next_cue: number;
	can_jump_to_prev_cue: number;
	count_in_duration: number;
	cue_points: number;
	current_song_time: number;
	data: number;
	exclusive_arm: number;
	groove_amount: number;
	is_counting_in: boolean;
	is_playing: boolean;
	loop_length: number;
	loop: number;
	loop_start: number;
	metronome: number;
	nudge_down: number;
	nudge_up: number;
	overdub: number;
	punch_in: number;
	punch_out: number;
	re_enable_automation_enabled: number;
	record_mode: number;
	// return_tracks: RawTrack[];
	// scenes: number;
	session_automation_record: number;
	session_record: number;
	session_record_status: number;
	signature_denominator: number;
	signature_numerator: number;
	song_length: number;
	swing_amount: number;
	tempo: number;
	// tracks: RawTrack[];
}

export enum Quantization {
	none = 0,
	q_8_bars = 1,
	q_4_bars = 2,
	q_2_bars = 3,
	q_1_bar = 4,
	q_2n = 5,
	q_2nt = 6,
	q_4n = 7,
	q_4nt = 8,
	q_8n = 9,
	q_8nt = 10,
	q_16n = 11,
	q_16nt = 12,
	q_32n = 13,
}

export enum RecordingQuantization {
	none = 0,
	q_4n = 1,
	q_8n = 2,
	q_8nt = 3,
	q_8n_8nt = 4,
	q_16n = 5,
	q_16nt = 6,
	q_16n_16nt = 7,
	q_32n = 8,
}

export enum SMPTE {
	// the frame position shows the milliseconds
	FramePosition = 0,
	Smpte24 = 1,
	Smpte25 = 2,
	Smpte30 = 3,
	Smpte30Drop = 4,
	Smpte29 = 5,
}

const childrenProperties = {
	scenes: RawScene,
	tracks: RawTrack,
	master_track: RawTrack,
	return_tracks: RawTrack,
	return_track: RawTrack,
	visible_tracks: RawTrack,
	visible_track: RawTrack,
};

export class Song extends Properties<
	GettableProperties,
	ChildrenProperties,
	TransformedProperties,
	SettableProperties,
	ObservableProperties
> {
	static path = 'live_set';

	constructor(ableton: AbletonLive) {
		super(ableton, 'song', Song.path, childrenProperties);

		this.transformers = {
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
	async findTrackByName(name: string): Promise<Track | undefined > {
		const tracks = await this.children('tracks');

		return tracks.find((t) => t.name.includes(name));
	}

	async getAudioTracks(): Promise<Track[] | undefined> {
		const tracks = await this.children('tracks');

		return tracks.filter((t) => t.type === TrackType.Audio);
	}

	async getMidiTracks(): Promise<Track[] | undefined> {
		const tracks = await this.children('tracks');

		return tracks.filter((t) => t.type === TrackType.Midi);
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
		return this.call('capture_midi', [ destination ]);
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
		return this.call('create_audio_track', [ index ]);
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
		return this.call('create_midi_track', [ index ]);
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
		return this.call('create_scene', [ index ]);
	}

	/**
	* Delete the return track at the given index.
	* @memberof Song
	*
	* @param {number} index
	* @return {void}
	*/
	public async deleteReturnTrack(index: number): Promise<void> {
		return this.call('delete_return_track', [ index ]);
	}

	/**
	* Delete the scene at the given index.
	* @memberof Song
	*
	* @param {number} index
	* @return {void}
	*/
	public async deleteScene(index: number): Promise<void> {
		return this.call('delete_scene', [ index ]);
	}

	/**
	* Delete the track at the given index.
	* @memberof Song
	*
	* @param {number} index
	* @return {void}
	*/
	public async deleteTrack(index: number): Promise<void> {
		return this.call('delete_track', [ index ]);
	}

	/**
	* Index determines which scene to duplicate.
	* @memberof Song
	*
	* @param {number} index
	* @return {void}
	*/
	public async duplicateScene(index: number): Promise<void> {
		return this.call('duplicate_scene', [ index ]);
	}

	/**
	* Index determines which track to duplicate.
	* @memberof Song
	*
	* @param {number} index
	* @return {void}
	*/
	public async duplicateTrack(index: number): Promise<void> {
		return this.call('duplicate_track', [ index ]);
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
		return this.call('get_current_smpte_song_time', [ format ]);
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
		return this.call('jump_by', [ amount ]);
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
		return this.call('scrub_by', [ amount ]);
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
		return this.call('stop_all_clips', [ quantized ]);
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
		return this.call('trigger_session_record', recordLength ? [ recordLength ] : undefined);
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
