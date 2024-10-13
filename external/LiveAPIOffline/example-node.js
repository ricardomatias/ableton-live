"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// example-node.ts
var import_max_api = __toESM(require("max-api"));

// ../../../node_modules/mitt/dist/mitt.mjs
function mitt_default(n) {
  return { all: n = n || /* @__PURE__ */ new Map(), on: function(t, e) {
    var i = n.get(t);
    i ? i.push(e) : n.set(t, [e]);
  }, off: function(t, e) {
    var i = n.get(t);
    i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []));
  }, emit: function(t, e) {
    var i = n.get(t);
    i && i.slice().map(function(n2) {
      n2(e);
    }), (i = n.get("*")) && i.slice().map(function(n2) {
      n2(t, e);
    });
  } };
}

// ../../../lib/helpers/EventEmitter.ts
var EventEmitter = class {
  constructor(e) {
    this.mitt = mitt_default(e);
  }
  get all() {
    return this.mitt.all;
  }
  on(type, handler) {
    this.mitt.on(type, handler);
  }
  off(type, handler) {
    this.mitt.off(type, handler);
  }
  emit(type, event) {
    this.mitt.emit(type, event);
  }
};

// ../../../node_modules/nanoid/index.js
var import_node_crypto = require("node:crypto");

// ../../../node_modules/nanoid/url-alphabet/index.js
var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

// ../../../node_modules/nanoid/index.js
var POOL_SIZE_MULTIPLIER = 128;
var pool;
var poolOffset;
function fillPool(bytes) {
  if (!pool || pool.length < bytes) {
    pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
    import_node_crypto.webcrypto.getRandomValues(pool);
    poolOffset = 0;
  } else if (poolOffset + bytes > pool.length) {
    import_node_crypto.webcrypto.getRandomValues(pool);
    poolOffset = 0;
  }
  poolOffset += bytes;
}
function nanoid(size = 21) {
  fillPool(size -= 0);
  let id = "";
  for (let i = poolOffset - size; i < poolOffset; i++) {
    id += urlAlphabet[pool[i] & 63];
  }
  return id;
}

// ../../../lib/Properties.ts
var Properties = class {
  constructor(ableton, ns, _path, childrenInitialProps5, _id) {
    this.ableton = ableton;
    this.ns = ns;
    this._path = _path;
    this.childrenInitialProps = childrenInitialProps5;
    this._id = _id;
    this._state = /* @__PURE__ */ new Map();
    /**
     * @private
     * Under construction
     */
    // state<T extends keyof GP | keyof TP>(
    // 	key: T
    // ): T extends keyof TP ? undefined | TP[T] : T extends keyof GP ? undefined | GP[T] : any {
    // 	return this._state.get(key);
    // }
    this.getterTransformers = {};
    this.childrenTransformers = {};
  }
  get id() {
    return this._id;
  }
  get path() {
    return this._path;
  }
  async get(prop) {
    const result = await this.ableton.get(this.path, prop, this._id);
    const transformer = this.getterTransformers[prop];
    let value = result;
    if (result !== null && transformer) {
      value = transformer(result);
    }
    return value;
  }
  async children(child, childProps, index) {
    let initialProps2;
    if (this.childrenInitialProps) {
      initialProps2 = this.childrenInitialProps[child];
    }
    if (childProps) {
      initialProps2 = initialProps2.concat(childProps);
    }
    const result = await this.ableton.getChildren(this.path, { child, initialProps: initialProps2, index }, this._id);
    const transformer = this.childrenTransformers[child];
    if (result !== null && transformer) {
      return transformer(result);
    } else {
      return result;
    }
  }
  async child(child, index, childProps) {
    const result = await this.children(child, childProps, index);
    return (result ?? [])[0];
  }
  async set(prop, value) {
    return this.ableton.set(this.path, prop, value, this._id);
  }
  async observe(prop, listener) {
    const child = prop;
    const childTransformer = this.childrenTransformers[child];
    const getterTransformer = this.getterTransformers[child];
    let initialProps2;
    const callback = (data) => {
      if (data !== null && childTransformer) {
        listener(childTransformer(data));
      } else if (data !== null && getterTransformer) {
        listener(getterTransformer(data));
      } else {
        listener(data);
      }
    };
    if (this.childrenInitialProps) {
      initialProps2 = this.childrenInitialProps[child];
      return this.ableton.observe(this.path, prop, callback, {
        initialProps: initialProps2,
        liveObjectId: this._id
      });
    } else {
      return this.ableton.observe(this.path, prop, callback, {
        liveObjectId: this._id
      });
    }
  }
  async call(method, parameters, timeout) {
    return this.ableton.call(this.path, { parameters, method }, this._id, timeout);
  }
  async callMultiple(calls, timeout) {
    return this.ableton.callMultiple(this.path, calls, this._id, timeout);
  }
};

// ../../../lib/DeviceParameter.ts
var RawDeviceParameterKeys = ["name", "value", "is_quantized"];
var DeviceParameter = class _DeviceParameter extends Properties {
  /**
   * Creates an instance of DeviceParameter.
   * @param {AbletonLive} ableton
   * @param {RawDeviceParameter} raw
   * @param {string} [path]
   * @memberof DeviceParameter
   */
  constructor(ableton, raw, path) {
    super(ableton, "device_parameter", path ? path : _DeviceParameter.path);
    this.raw = raw;
    this._id = raw.id;
    this._name = raw.name;
    this._value = raw.value;
    this._isQuantized = raw.is_quantized;
  }
  static {
    this.path = "live_set tracks N devices M parameters L";
  }
  get name() {
    return this._name;
  }
  get value() {
    return this._value;
  }
  get isQuantized() {
    return this._isQuantized;
  }
  /**
   * Re-enable automation for this parameter.
   *
   * @returns {Promise<void>}
   * @memberof DeviceParameter
   */
  async reEnableAutomation() {
    return this.call("re_enable_automation", []);
  }
  /**
   *  Returns: [symbol] String representation of the specified value.
   *
   * @returns {Promise<string>}
   * @memberof DeviceParameter
   */
  async strForValue(value) {
    return this.call("str_for_value", [value]);
  }
  /**
   *  Returns: [symbol] String representation of the current parameter value.
   *
   * @returns {Promise<string>}
   * @memberof DeviceParameter
   */
  async str() {
    return this.call("__str__", []);
  }
};

// ../../../lib/MixerDevice.ts
var RawMixerDeviceKeys = [
  { name: "volume", initialProps: RawDeviceParameterKeys },
  { name: "panning", initialProps: RawDeviceParameterKeys }
];
var childrenInitialProps = {
  volume: RawDeviceParameterKeys,
  panning: RawDeviceParameterKeys,
  sends: RawDeviceParameterKeys
};
var MixerDevice = class _MixerDevice extends Properties {
  constructor(ableton, raw, path) {
    super(ableton, "mixer_device", path ? path : _MixerDevice.path, childrenInitialProps);
    this.raw = raw;
    this._id = raw.id;
    this._volume = new DeviceParameter(this.ableton, raw.volume);
    this._panning = new DeviceParameter(this.ableton, raw.panning);
    this.childrenTransformers = {
      sends: (parameters) => parameters.map((deviceParameter) => new DeviceParameter(this.ableton, deviceParameter))
    };
  }
  static {
    this.path = "live_set tracks $1 mixer_device";
  }
  get volume() {
    return this._volume;
  }
  get panning() {
    return this._panning;
  }
};

// ../../../lib/Note.ts
var Note = class _Note {
  static {
    /**
     * @private
     * @static
     * @memberof Note
     */
    this.MinDuration = 1 / 128;
  }
  /**
   *Creates an instance of Note.
   * @param {number} pitch is the MIDI note number, 0...127, 60 is C3.
   * @param {number} start is the note start time in beats of absolute clip time.
   * @param {number} duration is the note length in beats.
   * @param {number} velocity is the note velocity, 1 ... 127.
   * @param {NoteParameters} parameters extra note parameters
   * @memberof Note
   */
  constructor(pitch, start, duration, velocity, parameters = {}) {
    const params = Object.assign(
      {
        id: void 0,
        muted: false,
        probability: 1,
        velocityDeviation: 0,
        releaseVelocity: 64
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
  get id() {
    return this._id;
  }
  /**
   * The MIDI note number, 0...128, 60 is C3.
   *
   * @readonly
   * @type {number}
   * @memberof Note
   */
  get pitch() {
    return Math.min(Math.max(this._pitch, 0), 128);
  }
  /**
   * The note start time in beats of absolute clip time.
   *
   * @readonly
   * @type {number}
   * @memberof Note
   */
  get start() {
    return this._start;
  }
  /**
   * The note length in beats.
   *
   * @readonly
   * @type {number}
   * @memberof Note
   */
  get duration() {
    if (this._duration <= _Note.MinDuration)
      return _Note.MinDuration;
    return this._duration;
  }
  /**
   * The note velocity, 1 ... 127.
   *
   * @readonly
   * @type {number}
   * @memberof Note
   */
  get velocity() {
    return Math.min(Math.max(this._velocity, 0), 128);
  }
  get muted() {
    return !!this._muted;
  }
  get probability() {
    return this._probability;
  }
  get velocityDeviation() {
    return this._velocityDeviation;
  }
  get releaseVelocity() {
    return this._releaseVelocity;
  }
  /**
   * The Note serialized for consumption in Live
   *
   * @readonly
   * @type {SerializedNote}
   * @memberof Note
   */
  get serialize() {
    return {
      pitch: this.pitch,
      start_time: this.start,
      duration: this.duration,
      velocity: this.velocity,
      mute: Number(this.muted),
      probability: this.probability,
      velocity_deviation: this.velocityDeviation,
      release_velocity: this.releaseVelocity,
      note_id: this._id
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
    return new _Note(this._pitch, this._start, this._duration, this._velocity, {
      id: void 0,
      muted: this._muted,
      probability: this._probability,
      velocityDeviation: this._velocity,
      releaseVelocity: this._releaseVelocity
    });
  }
  /**
   * @private
   * @readonly
   * @type {string}
   * @memberof Note
   */
  get [Symbol.toStringTag]() {
    return `Note: ${this.pitch} <${this.id}>`;
  }
};

// ../../../lib/ClipView.ts
var ClipView = class _ClipView extends Properties {
  static {
    this.path = "live_set tracks $1 clip_slots $2 clip view";
  }
  static getPath(trackNumber, clipSlotNumber) {
    return _ClipView.path.replace("$1", `${trackNumber}`).replace("$2", `${clipSlotNumber}`);
  }
  /**
   * Creates an instance of ClipView.
   * @private
   * @param {AbletonLive} ableton
   * @memberof Clip
   */
  constructor(ableton) {
    super(ableton, "clip view", _ClipView.path);
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
  async hideEnvelope() {
    return this.call("hide_envelope");
  }
  /**
   * Show the Envelopes box
   *
   * @memberof ClipView
   * @param {number} deviceParam Select the specified device parameter in the Envelopes box.
   * @return {void}
   */
  async showEnvelope() {
    return this.call("show_envelope");
  }
  /**
   * If the clip is visible in Live's Detail View, this function will make the current loop visible there.
   *
   * @memberof ClipView
   * @return {void}
   */
  async showLoop() {
    return this.call("show_loop");
  }
};

// ../../../lib/Clip.ts
var RawClipKeys = ["name", "is_audio_clip", "length"];
var Clip = class _Clip extends Properties {
  /**
   * Creates an instance of Clip.
   * @private
   * @param {AbletonLive} ableton
   * @param {RawClip} raw
   * @param {string} [path]
   * @memberof Clip
   */
  constructor(ableton, raw, path) {
    super(ableton, "clip", path ?? raw.path);
    this.raw = raw;
    this._id = parseInt(raw.id, 10);
    this._name = raw.name;
    this._type = raw.is_audio_clip ? "midi" /* Midi */ : "audio" /* Audio */;
    this._length = raw.length;
    this.childrenTransformers = {
      clipView: () => new ClipView(this.ableton)
    };
  }
  static {
    this.sessionPath = "live_set tracks $1 clip_slots $2 clip";
  }
  static {
    this.arrangementPath = "live_set tracks $1 arrangement_clips $2 clip";
  }
  static getSessionPath(trackNumber, clipSlotNumber) {
    return _Clip.sessionPath.replace("$1", `${trackNumber}`).replace("$2", `${clipSlotNumber}`);
  }
  static getArrangementPath(trackNumber, clipSlotNumber) {
    return _Clip.arrangementPath.replace("$1", `${trackNumber}`).replace("$2", `${clipSlotNumber}`);
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
  async removeSelectedNotes(notes) {
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
  get name() {
    return this._name;
  }
  /**
   * The type of clip
   *
   * @readonly
   * @type {'audio' | 'midi'}
   * @memberof Clip
   */
  get type() {
    return this._type;
  }
  /**
   * The clip's length (duration)
   *
   * @readonly
   * @type {string}
   * @memberof Clip
   */
  get length() {
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
  async addNewNotes(notes) {
    return this.call("add_new_notes", [this.prepareNotes(notes)]);
  }
  /**
   * Add new notes to a clip. For MIDI clips only.
   *
   * @memberof Clip
   *
   * @param {Array<Note>} notes as returned from getNotesExtended
   * @return {void}
   */
  async applyNoteModifications(notes) {
    return this.call("apply_note_modifications", [this.prepareNotes(notes)]);
  }
  /**
   * Removes all automation in the clip
   * @memberof Clip
   *
   * @return {void}
   */
  async clearAllEnvelopes() {
    return this.call("clear_all_envelopes");
  }
  /**
   * Removes the automation of the clip for the given parameter
   * @memberof Clip
   *
   * @param {number} [deviceParameterId]
   * @return {void}
   */
  async clearEnvelope(deviceParameterId) {
    return this.call("clear_envelope", [deviceParameterId]);
  }
  /**
   * Crops the clip: if the clip is looped, the region outside the loop is removed;
   * if it isn't, the region outside the start and end markers.
   * @memberof Clip
   *
   * @return {void}
   */
  async crop() {
    return this.call("crop");
  }
  /**
   * Call this before replace_selected_notes if you just want to add some notes.
   * For MIDI clips only.
   * @memberof Clip
   *
   * @return {void}
   */
  async deselectAllNotes() {
    return this.call("deselect_all_notes");
  }
  /**
   * Makes the loop two times longer by moving loop_end to the right, and duplicates both the notes and the envelopes.
   * If the clip is not looped, the clip start/end range is duplicated.
   * For MIDI clips only.
   * @memberof Clip
   *
   * @return {void}
   */
  async duplicateLoop() {
    return this.call("duplicate_loop");
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
  async duplicateRegion(regionStart, regionLength, destinationTime, pitch = -1, transpositionAmount = 0) {
    return this.call("duplicate_region", [regionStart, regionLength, destinationTime, pitch, transpositionAmount]);
  }
  /**
   * Same effect as pressing the Clip Launch button.
   * @memberof Clip
   *
   * @return {void}
   */
  async fire() {
    return this.call("fire");
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
  async getNotes(startTime = 0, timeRange = 256, startPitch = 0, pitchRange = 127) {
    return this.call("get_notes_extended", [startPitch, pitchRange, startTime.toFixed(3), timeRange.toFixed(3)]).then(
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
  async getNotesById(ids) {
    return this.call("get_notes_by_id", [...ids]).then(this.parseNotes.bind(this));
  }
  /**
   * Use this if you want to operate on the selected notes
   *
   * @memberof Clip
   *
   * @return {void}
   */
  async getSelectedNotes() {
    return this.call("get_selected_notes_extended").then(this.parseNotes.bind(this));
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
  async movePlayingPos(beats) {
    return this.call("move_playing_pos", [beats]);
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
  async quantize(quantizationGrid, amount) {
    return this.call("quantize", [quantizationGrid, amount]);
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
  async quantizePitch(pitch, quantizationGrid, amount) {
    return this.call("quantize_pitch", [pitch, quantizationGrid, amount]);
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
  async removeNotes(startTime = 0, timeRange = 256, startPitch = 0, pitchRange = 127) {
    return this.call("remove_notes_extended", [startPitch, pitchRange, startTime.toFixed(4), timeRange.toFixed(4)]);
  }
  /**
   * Deletes all notes associated with the provided IDs.
   *
   * @memberof Clip
   *
   * @param {Array<string>} ids note ids
   * @return {void}
   */
  async removeNotesById(ids) {
    return this.call("remove_notes_by_id", [...ids]);
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
  async scrub(beatTime) {
    return this.call("scrub", [beatTime]);
  }
  /**
   * Use this function to process all notes of a clip, independent of the current selection.
   * @memberof Clip
   *
   * @return {void}
   */
  async selectAllNotes() {
    return this.call("select_all_notes");
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
  async setFireButtonState(state) {
    return this.call("set_fire_button_state", [state]);
  }
  /**
   * Same effect as pressing the stop button of the track, but only if this clip is actually playing or recording.
   * If this clip is triggered or if another clip in this track is playing, it has no effect.
   * @memberof Clip
   *
   * @return {void}
   */
  async stop() {
    return this.call("stop");
  }
  /**
   * Stops an active scrub on a clip
   * @memberof Clip
   *
   * @return {void}
   */
  async stopScrub() {
    return this.call("stop_scrub");
  }
  prepareNotes(notes) {
    return { notes: notes.map((n) => n.serialize) };
  }
  parseNotes(data) {
    const notes = JSON.parse(data).notes.map((n) => {
      return new Note(n.pitch, n.start_time, n.duration, n.velocity, {
        id: n.note_id,
        muted: Boolean(n.mute),
        probability: n.probability,
        velocityDeviation: n.velocity_deviation,
        releaseVelocity: n.release_velocity
      });
    });
    notes.sort((a, b) => a.start - b.start);
    return notes;
  }
};

// ../../../lib/ClipSlot.ts
var RawClipSlotKeys = ["has_clip", { name: "clip", initialProps: RawClipKeys }];
var initialProperties = {
  clip: RawClipKeys
};
var ClipSlot = class extends Properties {
  /**
   * Creates an instance of ClipSlot.
   * @param {AbletonLive} ableton
   * @param {RawClipSlot} raw
   * @param {string} [path]
   * @memberof ClipSlot
   */
  constructor(ableton, raw, path) {
    super(ableton, "clip_slot", path ?? raw.path, initialProperties);
    this.raw = raw;
    this._id = raw.id;
    this._hasClip = raw.has_clip;
    this._clip = new Clip(this.ableton, raw.clip);
    this.childrenTransformers = {
      clip: ([clip]) => {
        if (clip.id === "0") {
          return null;
        }
        return new Clip(this.ableton, clip);
      }
    };
  }
  static {
    this.path = "live_set tracks $1 clip_slots $2";
  }
  /**
   * If it contains a clip
   *
   * @readonly
   * @type {boolean}
   * @memberof ClipSlot
   */
  get hasClip() {
    return this._hasClip;
  }
  /**
   * Gets the clip or return's null if there's none
   * @memberof ClipSlot
   *
   * @return {Clip | null}
   */
  async clip() {
    return this._clip ? Promise.resolve(this._clip) : await this.children("clip");
  }
  /**
   * Creates a new clip
   * @memberof ClipSlot
   *
   * @param {number} [lengthInBeats = 4] In beats, f.ex: 4 beats = 1 bar
   * @return {null}
   */
  async createClip(lengthInBeats = 4) {
    await this.call("create_clip", [lengthInBeats]);
    return await this.children("clip");
  }
  /**
   * Deletes the clip
   * @memberof ClipSlot
   *
   * @return {null}
   */
  async deleteClip() {
    return this.call("delete_clip");
  }
  /**
   * Duplicates the clip into a new clip slot
   * @memberof ClipSlot
   *
   * @param {number} [targetClipSlot] target clip slot
   * @return {null}
   */
  async duplicateClipTo(targetClipSlot) {
    return this.call("create_clip", [targetClipSlot]);
  }
  /**
   * Plays/Triggers a clip
   * @memberof ClipSlot
   *
   * @param {number} [recordLength]
   * @param {number} [launchQuantization]
   * @return {null}
   */
  async fire(recordLength, launchQuantization) {
    return this.call("fire", [recordLength, launchQuantization]);
  }
  /**
   * Stops a clip
   * @memberof ClipSlot
   *
   * @return {null}
   */
  async stop() {
    return this.call("stop");
  }
};

// ../../../lib/Device.ts
var RawDevice = ["name", "type", "class_name", "class_display_name"];
var initialProps = {
  parameters: RawDeviceParameterKeys
};
var Device = class _Device extends Properties {
  constructor(ableton, raw, path) {
    super(ableton, "device", path ? path : _Device.path, initialProps);
    this.raw = raw;
    this._id = parseInt(raw.id, 10);
    this._name = raw.name;
    this._type = raw.type;
    this._className = raw.class_name;
    this._classDisplayName = raw.class_display_name;
    this.childrenTransformers = {
      parameters: (parameters) => parameters.map((parameter) => new DeviceParameter(this.ableton, parameter))
    };
  }
  static {
    this.path = "live_set tracks $1 devices";
  }
  /**
   * This is the string shown in the title bar of the device
   *
   * @readonly
   * @type {string}
   * @memberof Device
   */
  get name() {
    return this._name;
  }
  /**
   * Live device type such as MidiChord , Operator , Limiter , MxDeviceAudioEffect , or PluginDevice.
   *
   * @readonly
   * @type {string}
   * @memberof Device
   */
  get className() {
    return this._className;
  }
  /**
   * Get the original name of the device (e.g. Operator, Auto Filter)
   *
   * @readonly
   * @type {string}
   * @memberof Device
   */
  get classDisplayName() {
    return this._classDisplayName;
  }
  /**
   * The type of device
   *
   * @readonly
   * @type {'audio_effect' | 'instrument' | 'midi_effect'}
   * @memberof Device
   */
  get type() {
    return this._type;
  }
};

// ../../../lib/Track.ts
var RawTrackKeys = ["name", "has_audio_input"];
var childrenInitialProps2 = {
  devices: RawDevice,
  clip_slots: RawClipSlotKeys,
  mixer_device: RawMixerDeviceKeys
};
function routingGetter(prop) {
  return (details) => {
    if (typeof details === "number")
      return details;
    return JSON.parse(details)[prop];
  };
}
var Track = class _Track extends Properties {
  /**
   * Creates an instance of Track.
   * @param {AbletonLive} ableton
   * @param {RawTrack} raw
   * @param {string} [path]
   * @memberof Track
   */
  constructor(ableton, raw, path) {
    super(ableton, "track", path ?? raw.path, childrenInitialProps2);
    this.raw = raw;
    this._id = parseInt(raw.id, 10);
    this._name = raw.name;
    this._type = raw.has_audio_input ? "audio" /* Audio */ : "midi" /* Midi */;
    this.getterTransformers = {
      available_input_routing_channels: routingGetter("available_input_routing_channels"),
      available_input_routing_types: routingGetter("available_input_routing_types"),
      available_output_routing_channels: routingGetter("available_output_routing_channels"),
      available_output_routing_types: routingGetter("available_output_routing_types")
    };
    this.childrenTransformers = {
      devices: (devices) => devices.map((device) => new Device(this.ableton, device)),
      mixer_device: ([mixerDevice]) => new MixerDevice(this.ableton, mixerDevice),
      clip_slots: (clipSlots) => clipSlots.map((c) => new ClipSlot(this.ableton, c))
    };
  }
  static {
    this.path = "live_set tracks $1";
  }
  static getPath(trackNumber) {
    return _Track.path.replace("$1", `${trackNumber}`);
  }
  // =========================================================================
  // * Custom API
  // =========================================================================
  /**
   * Get all clips in a track
   *
   * @memberof Track
   * @return {(Promise<(Clip | null)[]>)}
   */
  async getClips() {
    const clipSlots = await this.children("clip_slots");
    return await Promise.all(clipSlots.filter((cs) => cs.hasClip).map(async (cs) => await cs.clip()));
  }
  /**
   * Get a specific clip based on Scene number
   *
   * @memberof Track
   * @return {(Promise<(Clip | null)>)}
   */
  async getClip(scene) {
    const clipSlots = await this.children("clip_slots");
    if (scene < 1 || scene > clipSlots.length)
      return Promise.reject(null);
    const clipSlot = clipSlots[scene - 1];
    return await clipSlot.clip();
  }
  /**
   * Get a specific clip based on Scene number and creates one if there's none
   *
   * @memberof Track
   * @param {number} scene - 1 based
   * @param {number} [length=4]
   * @return {(Promise<Clip>)}
   */
  async getOrCreateClip(scene, length = 4) {
    const clipSlots = await this.children("clip_slots");
    console.log(scene, clipSlots.length);
    if (scene < 1 || scene > clipSlots.length)
      return Promise.reject(null);
    const clipSlot = clipSlots[scene - 1];
    if (!clipSlot.hasClip)
      return await clipSlot.createClip(length);
    return await clipSlot.clip();
  }
  /**
   * Is the track a group track
   *
   * @memberof Track
   * @return {(Promise<boolean>)}
   */
  async isGroupTrack() {
    const groupTrackId = await this.get("available_input_routing_channels");
    return typeof groupTrackId === "number";
  }
  // =========================================================================
  // * Official API
  // =========================================================================
  /**
   * The name of the track
   *
   * @readonly
   * @type {string}
   * @memberof Track
   */
  get name() {
    return this._name;
  }
  /**
   * The type of track
   *
   * @readonly
   * @type {'audio' | 'midi'}
   * @memberof Track
   */
  get type() {
    return this._type;
  }
  /**
   * Get the volume of the track
   * @memberof Track
   *
   * @return {Promise<DeviceParameter>}
   */
  async volume() {
    const mixerDevice = this._mixerDevice = await this.children("mixer_device");
    return mixerDevice.volume;
  }
  /**
   * Get the panning of the track
   * @memberof Track
   *
   * @return {Promise<DeviceParameter>}
   */
  async panning() {
    const mixerDevice = this._mixerDevice = await this.children("mixer_device");
    return mixerDevice.panning;
  }
  /**
   * Delete the device at the given index.
   * @memberof Track
   *
   * @param {number} index
   * @return {null}
   */
  async deleteDevice(index) {
    return this.call("delete_device", [index]);
  }
  /**
   * Works like 'Duplicate' in a clip's context menu.
   * @memberof Track
   *
   * @param {number} index
   * @return {null}
   */
  async duplicateClipSlot(index) {
    return this.call("duplicate_clip_slot", [index]);
  }
  /**
   * Stops all playing and fired clips in this track.
   * @memberof Track
   *
   * @return {null}
   */
  async stopAllClips() {
    return this.call("stop_all_clips");
  }
  /**
   * @ignore
   * @private
   *
   * Deletes a clip from this track.
   * @memberof Track
   *
   * @param {Clip} clip
   * @return {null}
   */
  async deleteClip(clip) {
    return this.call("delete_clip", [`id ${clip.id}`]);
  }
  /**
   * @ignore
   * @private
   *
   * Duplicates a clip to the arrangement.
   * @memberof Track
   *
   * @param {Clip} clip
   * @param {number} destinationTime in beats
   * @return {null}
   */
  async duplicateClipToArrangement(clip, destinationTime) {
    return this.call("duplicate_clip_to_arrangement", [`id ${clip.id}`, destinationTime]);
  }
  /**
   * Jumps to a running session clip in this track.
   * @memberof Track
   *
   * @param {number} beats
   * @return {null}
   */
  async jumpInRunningSessionClip(beats) {
    return this.call("jump_in_running_session_clip", [beats]);
  }
  /** @ignore */
  get [Symbol.toStringTag]() {
    return `Track <${this.name}>`;
  }
};

// ../../../lib/Scene.ts
var RawSceneKeys = ["name", "isEmpty"];
var childrenInitialProps3 = {
  clip_slots: RawClipSlotKeys
};
var Scene = class _Scene extends Properties {
  /**
   * Creates an instance of Scene.
   * @param {AbletonLive} ableton
   * @param {RawScene} raw
   * @param {string} [path]
   * @memberof Scene
   */
  constructor(ableton, raw, path) {
    super(ableton, "scene", path ?? raw.path, childrenInitialProps3);
    this.raw = raw;
    this._id = parseInt(raw.id, 10);
    this._name = raw.name;
    this._isEmpty = raw.isEmpty;
    this.childrenTransformers = {
      clip_slots: (clipSlots) => clipSlots.map((c) => new ClipSlot(this.ableton, c))
    };
  }
  static {
    this.path = "live_set scenes $1";
  }
  static getPath(sceneNumber) {
    return _Scene.path.replace("$1", `${sceneNumber}`);
  }
  /**
   * The name of the track
   *
   * @readonly
   * @type {string}
   * @memberof [[Scene]]
   */
  get name() {
    return this._name;
  }
  /**
   * Is the scene empty?
   *
   * @readonly
   * @type {string}
   * @memberof [[Scene]]
   */
  get isEmpty() {
    return this._isEmpty;
  }
  /**
   * Fire all clip slots contained within the scene and select this scene.</br>
   * Starts recording of armed and empty tracks within a Group Track in this scene if Preferences->Launch->Start Recording on Scene Launch is ON.</br>
   * Calling with force_legato = 1 (default = 0) will launch all clips immediately in Legato, independent of their launch mode.</br>
   * When calling with can_select_scene_on_launch = 0 (default = 1) the scene is fired without selecting it.</br>
   *
   * @memberof [[Scene]]
   *
   * @param {boolean} forceLegato
   * @param {boolean} canSelectSceneOnLaunch
   * @return {void}
   */
  async fire(forceLegato, canSelectSceneOnLaunch) {
    return this.call("fire", [forceLegato, canSelectSceneOnLaunch]);
  }
  /**
   * Fire the selected scene, then select the next scene.</br>
   * It doesn't matter on which scene you are calling this function.</br>
   * Calling with force_legato = 1 (default = 0) will launch all clips immediately in Legato, independent of their launch mode.</br>
   *
   * set_fire_button_state
   * @memberof Scene
   *
   * @param {boolean} forceLegato
   * @return {void}
   */
  async fireAsSelected(forceLegato) {
    return this.call("fire_as_selected", [forceLegato]);
  }
  /**
   * If the state is set to 1, Live simulates pressing of scene button until the state is set to 0 or until the scene is stopped otherwise.
   * @memberof Scene
   *
   * @param {boolean} state
   * @return {void}
   */
  async setFireButtonState(state) {
    return this.call("set_fire_button_state", [state]);
  }
  /**
   * @private
   * @readonly
   * @type {string}
   * @memberof Scene
   */
  get [Symbol.toStringTag]() {
    return `${this.name}`;
  }
};

// ../../../lib/CuePoint.ts
var RawCuePointKeys = ["name", "time"];
var CuePoint = class extends Properties {
  /**
   * Creates an instance of CuePoint.
   * @param {AbletonLive} ableton
   * @param {RawCuePoint} raw
   * @param {string} [path]
   * @memberof CuePoint
   */
  constructor(ableton, raw, path) {
    super(ableton, "cue_points", path ?? raw.path);
    this.raw = raw;
    this._id = raw.id;
  }
  static {
    this.path = "live_set cue_points N";
  }
};

// ../../../lib/Song.ts
var SongChildrenProperties = {
  scenes: RawSceneKeys,
  tracks: RawTrackKeys,
  master_track: RawTrackKeys,
  return_tracks: RawTrackKeys,
  return_track: RawTrackKeys,
  visible_tracks: RawTrackKeys,
  visible_track: RawTrackKeys,
  cue_points: RawCuePointKeys
};
var Song = class _Song extends Properties {
  static {
    this.path = "live_set";
  }
  /**
   * Creates an instance of Song.
   * @param {AbletonLive} ableton
   * @memberof Song
   */
  constructor(ableton) {
    super(ableton, "song", _Song.path, SongChildrenProperties);
    this.childrenTransformers = {
      master_track: (track) => new Track(this.ableton, track, "live_set master_track"),
      tracks: (tracks) => tracks.map((t) => new Track(this.ableton, t)),
      scenes: (scenes) => scenes.map((s) => new Scene(this.ableton, s)),
      return_tracks: (tracks) => tracks.map((t) => new Track(this.ableton, t)),
      visible_tracks: (tracks) => tracks.map((t) => new Track(this.ableton, t)),
      cue_points: (cuePoints) => cuePoints.map((c) => new CuePoint(this.ableton, c))
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
  async findTrackByName(trackName) {
    const tracks = await this.children("tracks");
    return tracks.find((t) => t.name.includes(trackName));
  }
  /**
   * Get all the audio tracks
   *
   * @returns {(Promise<Track[] | undefined>)}
   * @memberof Song
   */
  async getAudioTracks() {
    const tracks = await this.children("tracks");
    return tracks.filter((t) => t.type === "audio" /* Audio */);
  }
  /**
   * Get all the midi tracks
   *
   * @returns {(Promise<Track[] | undefined>)}
   * @memberof Song
   */
  async getMidiTracks() {
    const tracks = await this.children("tracks");
    return tracks.filter((t) => t.type === "midi" /* Midi */);
  }
  /**
   * Start playing a specific scene
   *
   * @returns {void}
   * @memberof Song
   */
  async playScene(scene) {
    const scenes = await this.children("scenes");
    const sn = scenes[scene - 1];
    if (sn)
      await sn.fire();
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
  async captureAndInsertScene() {
    return this.call("capture_and_insert_scene");
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
  async captureMidi(destination = 0) {
    return this.call("capture_midi", [destination]);
  }
  /**
   * From the current playback position.
   * @memberof Song
   *
   * @return {void}
   */
  async continuePlaying() {
    return this.call("continue_playing");
  }
  /**
   * Index determines where the track is added, it is only valid between 0 and len(song.tracks).
   * Using an index of -1 will add the new track at the end of the list.
   * @memberof Song
   *
   * @param {number} index
   * @return {void}
   */
  async createAudioTrack(index = -1) {
    return this.call("create_audio_track", [index]);
  }
  /**
   * Index determines where the track is added, it is only valid between 0 and len(song.tracks).
   * Using an index of -1 will add the new track at the end of the list.
   * @memberof Song
   *
   * @param {number} index
   * @return {void}
   */
  async createMidiTrack(index = -1) {
    return this.call("create_midi_track", [index]);
  }
  /**
   * Adds a new return track at the end.
   * @memberof Song
   *
   * @return {void}
   */
  async createReturnTrack() {
    return this.call("create_return_track");
  }
  /**
   * Index determines where the scene is added, it is only valid between 0 and len(song.scenes).
   * Using an index of -1 will add the new scene at the end of the list.
   * @memberof Song
   *
   * @param {number} index
   * @return {void}
   */
  async createScene(index = -1) {
    return this.call("create_scene", [index]);
  }
  /**
   * Delete the return track at the given index.
   * @memberof Song
   *
   * @param {number} index
   * @return {void}
   */
  async deleteReturnTrack(index) {
    return this.call("delete_return_track", [index]);
  }
  /**
   * Delete the scene at the given index.
   * @memberof Song
   *
   * @param {number} index
   * @return {void}
   */
  async deleteScene(index) {
    return this.call("delete_scene", [index]);
  }
  /**
   * Delete the track at the given index.
   * @memberof Song
   *
   * @param {number} index
   * @return {void}
   */
  async deleteTrack(index) {
    return this.call("delete_track", [index]);
  }
  /**
   * Index determines which scene to duplicate.
   * @memberof Song
   *
   * @param {number} index
   * @return {void}
   */
  async duplicateScene(index) {
    return this.call("duplicate_scene", [index]);
  }
  /**
   * Index determines which track to duplicate.
   * @memberof Song
   *
   * @param {number} index
   * @return {void}
   */
  async duplicateTrack(index) {
    return this.call("duplicate_track", [index]);
  }
  /**
   * Force the Link timeline to jump to Live's current beat time.
   * @memberof Song
   *
   * @return {void}
   */
  async forceLinkBeatTime() {
    return this.call("force_link_beat_time");
  }
  /**
   * The Arrangement loop length.
   * @memberof Song
   *
   * @return {void} bars.beats.sixteenths.ticks
   */
  async getBeatsLoopLength() {
    return this.call("get_beats_loop_length");
  }
  /**
   * The Arrangement loop start.
   * @memberof Song
   *
   * @return {void} bars.beats.sixteenths.ticks
   */
  async getBeatsLoopStart() {
    return this.call("get_beats_loop_start");
  }
  /**
   * The current Arrangement playback position.
   * @memberof Song
   *
   * @return {void} bars.beats.sixteenths.ticks
   */
  async getCurrentBeatsSongTime() {
    return this.call("get_current_beats_song_time");
  }
  /**
   * The current Arrangement playback position.
   * @memberof Song
   *
   * @param {SMPTE} format
   * @return {void} hours:min:sec:frames
   */
  async getCurrentSmpteSongTime(format) {
    return this.call("get_current_smpte_song_time", [format]);
  }
  /**
   * If the current Arrangement playback position is at a cue point
   * @memberof Song
   *
   * @return {boolean}
   */
  async isCuePointSelected() {
    return this.call("is_cue_point_selected");
  }
  /**
   * Jump by
   * @memberof Song
   *
   * @param {number} amount is the amount to jump relatively to the current position
   * @return {void}
   */
  async jumpBy(amount) {
    return this.call("jump_by", [amount]);
  }
  /**
   * Jump to the right, if possible.
   * @memberof Song
   *
   * @return {void}
   */
  async jumpToNextCue() {
    return this.call("jump_to_next_cue");
  }
  /**
   * Jump to the left, if possible.
   * @memberof Song
   *
   * @return {void}
   */
  async jumpToPrevCue() {
    return this.call("jump_to_prev_cue");
  }
  /**
   * Do nothing if no selection is set in Arrangement, or play the current selection.
   * @memberof Song
   *
   * @return {void}
   */
  async playSelection() {
    return this.call("play_selection");
  }
  /**
   * Trigger 'Re-Enable Automation', re-activating automation in all running Session clips.
   * @memberof Song
   *
   * @return {void}
   */
  async reEnableAutomation() {
    return this.call("re_enable_automation");
  }
  /**
   * Causes the Live application to redo the last operation.
   * @memberof Song
   *
   * @return {void}
   */
  async redo() {
    return this.call("redo");
  }
  /**
   * Same as jump_by , at the moment.
   * @memberof Song
   *
   * @param {number} amount is the amount to scrub relatively to the current position
   * @return {void}
   */
  async scrubBy(amount) {
    return this.call("scrub_by", [amount]);
  }
  /**
   * Toggle cue point at current Arrangement playback position.
   * @memberof Song
   *
   * @return {void}
   */
  async setOrDeleteCue() {
    return this.call("set_or_delete_cue");
  }
  /**
   * Start playback from the insert marker.
   * @memberof Song
   *
   * @return {void}
   */
  async startPlaying() {
    return this.call("start_playing");
  }
  /**
   * Calling the function with 0 will stop all clips immediately, independent of the launch quantization. The default is '1'.
   * @memberof Song
   *
   * @param {boolean} quantized
   * @return {void}
   */
  async stopAllClips(quantized = true) {
    return this.call("stop_all_clips", [quantized]);
  }
  /**
   * Stop the playback.
   * @memberof Song
   *
   * @return {void}
   */
  async stopPlaying() {
    return this.call("stop_playing");
  }
  /**
   * Same as pressing the Tap Tempo button in the transport bar.
   * The new tempo is calculated based on the time between subsequent calls of this function.
   * @memberof Song
   *
   * @return {void}
   */
  async tapTempo() {
    return this.call("tap_tempo");
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
  async triggerSessionRecord(recordLength) {
    return this.call("trigger_session_record", recordLength ? [recordLength] : void 0);
  }
  /**
   * Causes the Live application to undo the last operation.
   * @memberof Song
   *
   * @return {void}
   */
  async undo() {
    return this.call("undo");
  }
};

// ../../../lib/SongView.ts
var childrenInitialProps4 = {
  detail_clip: RawClipKeys,
  highlighted_clip_slot: RawClipSlotKeys,
  selected_parameter: RawDeviceParameterKeys,
  selected_scene: RawSceneKeys,
  selected_track: RawTrackKeys
};
var SongView = class _SongView extends Properties {
  static {
    this.path = "live_set view";
  }
  /**
   * Creates an instance of SongView.
   * @param {AbletonLive} ableton
   * @memberof SongView
   */
  constructor(ableton) {
    super(ableton, "song", _SongView.path, childrenInitialProps4);
    this.childrenTransformers = {
      selected_track: (t) => new Track(this.ableton, Array.isArray(t) ? t[0] : t),
      selected_scene: (s) => new Scene(this.ableton, Array.isArray(s) ? s[0] : s),
      selected_parameter: (dp) => new DeviceParameter(this.ableton, Array.isArray(dp) ? dp[0] : dp),
      highlighted_clip_slot: (cs) => new ClipSlot(this.ableton, Array.isArray(cs) ? cs[0] : cs),
      detail_clip: (c) => new Clip(this.ableton, Array.isArray(c) ? c[0] : c)
    };
  }
  // =========================================================================
  // * Custom API
  // =========================================================================
  async selectTrack(track) {
    return this.set("selected_track", `id ${track.id}`);
  }
  async selectScene(scene) {
    return this.set("selected_scene", `id ${scene.id}`);
  }
  async selectClip(clip) {
    return this.set("detail_clip", `id ${clip.id}`);
  }
  async selectParameter(dp) {
    return this.set("selected_parameter", `id ${dp.id}`);
  }
  async selectClipSlot(clipSlot) {
    return this.set("highlighted_clip_slot", `id ${clipSlot.id}`);
  }
  // =========================================================================
  // * Official API
  // =========================================================================
  /**
   * Selects the given device object in its track.
   * You may obtain the id using a live.path or by using get devices on a track, for example.
   * The track containing the device will not be shown automatically, and the device gets the appointed device (blue hand) only if its track is selected.
   * @memberof SongView
   *
   * @param {number} id
   * @return {Promise<void>}
   */
  async selectDevice(id) {
    return this.call("select_device", [`id ${id}`]);
  }
};

// ../../../lib/AbletonLiveBase.ts
var AbletonLiveBase = class extends EventEmitter {
};
var AbletonLiveBase_default = AbletonLiveBase;

// ../../../lib/AbletonLiveOffline.ts
var AbletonLiveOffline = class extends AbletonLiveBase_default {
  /**
   * @param {AbletonLiveOptions} [{ host = '127.0.0.1', port = 9000, logRequests = false }={}]
   * @memberof AbletonLive
   */
  constructor(callback) {
    super();
    this.messageBus = /* @__PURE__ */ new Map();
    this.eventListeners = /* @__PURE__ */ new Map();
    this.liveCallback = () => {
    };
    this._logRequests = false;
    this.song = new Song(this);
    this.songView = new SongView(this);
    this.liveCallback = callback;
    this.handleCommandResponse = this.handleCommandResponse.bind(this);
  }
  sendRaw(msg) {
    this.liveCallback(msg);
  }
  handleCommandResponse(message) {
    try {
      const data = JSON.parse(message);
      console.log("data", data);
      console.log("message", message);
      const callback = this.messageBus.get(data.uuid);
      if (this._logRequests)
        console.log(data);
      if (data.event === "success" /* Success */ && callback) {
        this.messageBus.delete(data.uuid);
        return callback(null, data.result);
      }
      if (data.event === "callback" /* Callback */ && data.result.listeners) {
        data.result.listeners.map((eventId) => {
          const callback2 = this.eventListeners.get(eventId);
          if (callback2) {
            callback2(data.result.data);
          }
        });
        return;
      }
      if (data.event === "error" /* Error */ && callback) {
        this.messageBus.delete(data.uuid);
        return callback(new Error(data.result));
      }
    } catch (err) {
      console.log(`[AbletonLive] ${err.stack}`);
    }
  }
  async sendCommand(action, path, objectId, args = {}, timeout = 2e3) {
    return new Promise((resolve, reject) => {
      Object.keys(args).forEach((key) => args[key] === void 0 && delete args[key]);
      const uuid = nanoid();
      const cmd = {
        uuid,
        objectId,
        action,
        path,
        args
      };
      if (this._logRequests)
        console.log("Command:", cmd);
      this.messageBus.set(uuid, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
      this.sendRaw(cmd);
    });
  }
  async get(path, prop, liveObjectId) {
    return this.sendCommand("get", path, liveObjectId, { prop });
  }
  async getChildren(path, args, liveObjectId) {
    return this.sendCommand("children", path, liveObjectId, args);
  }
  async set(path, prop, value, liveObjectId) {
    return this.sendCommand("set", path, liveObjectId, { prop, value });
  }
  async observe(path, property, listener, { initialProps: initialProps2, liveObjectId } = {}) {
    const eventId = nanoid();
    const objectPath = `${path} ${property}`;
    const result = await this.sendCommand("observe", path, liveObjectId, {
      objectPath,
      property,
      eventId,
      initialProps: initialProps2
    });
    if (result === eventId) {
      this.eventListeners.set(eventId, listener);
    }
    return async () => await this.removeObserser(path, property, eventId, liveObjectId);
  }
  async call(path, callDescription, liveObjectId, timeout) {
    return this.sendCommand("call", path, liveObjectId, callDescription, timeout);
  }
  async callMultiple(path, calls, liveObjectId, timeout) {
    return this.sendCommand("callMultiple", path, liveObjectId, { calls }, timeout);
  }
  async removeObserser(path, property, eventId, liveObjectId) {
    await this.sendCommand("removeObserver", path, liveObjectId, {
      eventId,
      objectPath: `${path} ${property}`
    });
    this.eventListeners.delete(eventId);
  }
};

// example-node.ts
var live = new AbletonLiveOffline((command) => {
  console.log("command", command.action);
  import_max_api.default.outlet(command.action, JSON.stringify(command, null, "	"));
  import_max_api.default.outlet("message", command);
});
import_max_api.default.addHandler("response", live.handleCommandResponse);
import_max_api.default.addHandler("bang", async () => {
  let tracks = await live.song.children("tracks");
  console.log("tracks", tracks);
  await live.song.createAudioTrack(-1);
  await live.song.createAudioTrack(-1);
  await live.song.createAudioTrack(-1);
  await live.song.createAudioTrack(-1);
  tracks = await live.song.children("tracks");
  console.log("tracks", tracks);
});
import_max_api.default.registerShutdownHook((signal) => {
  import_max_api.default.post("Exiting with code: ", signal);
});
