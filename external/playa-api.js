
// *****************************************************************************
// **** UTILS
// *****************************************************************************
function log() {
	for (let i = 0, len = arguments.length; i < len; i++) {
		const message = arguments[i];
		if (message && message.toString) {
			let s = message.toString();
			if (s.indexOf('[object ') >= 0) {
				s = JSON.stringify(message);
			}
			post(s);
		} else if (message === null) {
			post('<null>');
		} else {
			post(message);
		}
	}
	post('\n');
}

// *****************************************************************************
// **** MAIN
// *****************************************************************************

setinletassist(0, 'convert');

/**
 * Entry point for PLAYA -> MIDI clip conversion
 *
 * @param {String} dictName
 * @param {String} property
 * @param {Number} length
 */
function convert(dictName, property, length) {
	const dict = new Dict(dictName);

	const clip = secureClip(dictName, length);

	const obj = JSON.parse(dict.stringify());
	const events = obj[property];

	setNotes(clip.path, events);
}

function secureClip(clipName, length) {
	const parent = new LiveAPI('this_device canonical_parent');
	const parentPath = parent.unquotedpath;
	const clipSlotsLength = parent.getcount('clip_slots');

	let freeSlot = null; let clipSlot;

	// * where can a free clip be created at?
	for (let index = 0; index < clipSlotsLength; index++) {
		clipSlot = new LiveAPI(parentPath + ' clip_slots ' + index);

		if (clipSlot.get('has_clip') != 1) {
			freeSlot = index;

			break;
		}
	}

	// * insert a new scene if necessary
	if (freeSlot === null) {
		const song = new LiveAPI('live_set');

		song.call('create_scene', -1);

		freeSlot = clipSlotsLength + 1;

		return secureClip(dictName);
	}

	// * create clip
	const clipSlotPath = parentPath + ' clip_slots ' + freeSlot;

	clipSlot = new LiveAPI(clipSlotPath);

	clipSlot.call('create_clip', length);

	// * set clip's name
	const clip = new LiveAPI(clipSlotPath + ' clip');

	clip.set('name', clipName);

	return {
		path: parentPath + ' clip_slots ' + freeSlot,
	};
}

function setNotes(path, events) {
	const liveObject = new LiveAPI(path + ' clip');

	liveObject.call('set_notes');

	liveObject.call('notes', events.length);

	events.forEach(function(event) {
		liveObject.call('note', event.midi,
			event.time, event.dur,
			100, // velocity
			0, // muted 1
		);
	});

	liveObject.call('done');
}

// *****************************************************************************
// **** CLIP
// *****************************************************************************

function Clip() {
	const path = 'live_set view highlighted_clip_slot clip';
	this.liveObject = new LiveAPI(path);
}

Clip.prototype.getLength = function() {
	return this.liveObject.get('length');
};

Clip.prototype._parseNoteData = function(data) {
	const notes = [];
	// data starts with "notes"/count and ends with "done" (which we ignore)
	for (let i = 2, len = data.length - 1; i < len; i += 6) {
		// and each note starts with "note" (which we ignore) and is 6 items in the list
		const note = new Note(data[i + 1], data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
		notes.push(note);
	}
	return notes;
};

Clip.prototype.getSelectedNotes = function() {
	const data = this.liveObject.call('get_selected_notes');
	return this._parseNoteData(data);
};


Clip.prototype.getNotes = function(startTime, timeRange, startPitch, pitchRange) {
	if (!startTime) startTime = 0;
	if (!timeRange) timeRange = this.getLength();
	if (!startPitch) startPitch = 0;
	if (!pitchRange) pitchRange = 128;

	const data = this.liveObject.call('get_notes', startTime, startPitch, timeRange, pitchRange);
	return this._parseNoteData(data);
};

Clip.prototype._sendNotes = function(notes) {
	const liveObject = this.liveObject;

	liveObject.call('notes', notes.length);

	notes.forEach(function(note) {
		liveObject.call('note', note.midi,
			note.time, note.dur,
			100, // velocity
			0, // muted 1
		);
	});

	liveObject.call('done');
};

Clip.prototype.replaceSelectedNotes = function(notes) {
	this.liveObject.call('replace_selected_notes');
	this._sendNotes(notes);
};

Clip.prototype.setNotes = function(notes) {
	this.liveObject.call('set_notes');
	this._sendNotes(notes);
};

Clip.prototype.selectAllNotes = function() {
	this.liveObject.call('select_all_notes');
};

Clip.prototype.replaceAllNotes = function(notes) {
	this.selectAllNotes();
	this.replaceSelectedNotes(notes);
};

// *****************************************************************************
// **** NOTE
// *****************************************************************************

function Note(pitch, start, duration, velocity, muted) {
	this.pitch = pitch;
	this.start = start;
	this.duration = duration;
	this.velocity = velocity;
	this.muted = muted;
}

Note.prototype.toString = function() {
	return '{pitch:' + this.pitch +
		', start:' + this.start +
		', duration:' + this.duration +
		', velocity:' + this.velocity +
		', muted:' + this.muted + '}';
};

Note.MIN_DURATION = 1 / 128;

Note.prototype.getPitch = function() {
	if (this.pitch < 0) return 0;
	if (this.pitch > 127) return 127;
	return this.pitch;
};

Note.prototype.getStart = function() {
	// we convert to strings with decimals to work around a bug in Max
	// otherwise we get an invalid syntax error when trying to set notes
	if (this.start <= 0) return '0.0';
	return this.start;
};

Note.prototype.getDuration = function() {
	if (this.duration <= Note.MIN_DURATION) return Note.MIN_DURATION;
	return this.duration; // workaround similar bug as with getStart()
};

Note.prototype.getVelocity = function() {
	if (this.velocity < 0) return 0;
	if (this.velocity > 127) return 127;
	return this.velocity;
};

Note.prototype.getMuted = function() {
	if (this.muted) return 1;
	return 0;
};
