// @ts-nocheck
'use strict';

// * version 0.12.1

var apis = {};
var callbackEvents = {};

var debugMode = false;

inlets = 9;
outlets = 1;

setinletassist(0, 'get');
setinletassist(1, 'children');
setinletassist(2, 'set');
setinletassist(3, 'call');
setinletassist(4, 'callMultiple');
setinletassist(5, 'getThenCall');
setinletassist(6, 'observe');
setinletassist(7, 'removeObserver');
setinletassist(8, 'close');


function sample_callback(args) {
	// do nothing
}

function liveApi(path, id) {
	// * preference for id
	if (id !== undefined) {
		path = 'id ' + id;
	}

	if (debugMode) log(new Error().lineNumber, ' path: ', path);

	if (apis[path]) {
		return apis[path];
	}

	apis[path] = new LiveAPI(null, path);
	return apis[path];
}

function handleLiveOutput(prop, value, type) {
	var result = value;

	if (Array.isArray(value)) {
		if (value.length === 1) {
			result = value[0];
		} else
		if (value.length === 2 && (value[0] === 'id' || value[0] === prop)) {
			result = value[1];
		}
	}

	if (debugMode) log(new Error().lineNumber, prop, result);

	switch (type) {
		case 'bool':
			result = !!result;
			break;
	}

	return result;
}

function apiGet(api, prop) {
	var type = null;

	try {
		// child properties cannot be tracked via api.property
		api.property = prop;
		type = api.proptype;
	} catch (error) {
		// do nothing
	}
	var value = api.get(prop);

	return handleLiveOutput(prop, value, type);
}

function onSuccess(id, data, eventType) {
	var response = {
		uuid: id,
		event: eventType || 'success',
		result: data
	};

	outlet(0, JSON.stringify(response));
}

function onCallback(listeners, data) {
	var response = {
		event: 'callback',
		result: {
			data: data,
			listeners: listeners
		}
	};

	outlet(0, JSON.stringify(response));
}

function onFailure(id, data) {
	var response = {
		uuid: id,
		event: 'error',
	};

	if (data) {
		response.result = data;
	}

	outlet(0, JSON.stringify(response));
}


// Name for callback to ensure it's fully unique
function callbackName(path, id) {
	if (id) {
		return path + '-' + id;
	}
	return path;
}


// **** GET
function get(args) {
	const res = JSON.parse(args);

	// * Request UUID
	var uuid = res.uuid;
	// * Live's object ID
	var objectId = res.objectId;
	var path = res.path;
	var prop = res.args.prop;

	var api = liveApi(path, objectId);

	if (prop) {
		var value = apiGet(api, prop);

		onSuccess(uuid, value);
	} else {
		onSuccess(uuid, api.id);
	}
};

// **** CHILDREN
function getChildProps(childApi, initialProps, childName) {
	if (childName) {
		const objectId = apiGet(childApi, childName);
		childApi = liveApi('', objectId);
	}

	const childData = {
		id: childApi.id,
		path: childApi.path.replace(/"/g, "")
	};

	initialProps.reduce(function(obj, elem) {
		if (typeof elem === 'string') {
			obj[elem] = apiGet(childApi, elem);
		} else {
			obj[elem.name] = getChildProps(childApi, elem.initialProps, elem.name);
		}

		return obj;
	}, childData);

	return childData;
}

function processChildren(ids, initialProps) {
	var children = [];

	// * live returns ["id", 1, "id", 2, ..]
	for (var i = 0; i < ids.length; i += 2) {
		children.push(ids[i + 1]);
	}

	var data = [];

	for (var idx = 0; idx < children.length; idx++) {
		var childId = children[idx];

		var childApi = liveApi('', childId);

		var childData = {
			id: childApi.id,
			path: childApi.path.replace(/"/g, "")
		};

		if (childApi.id === '0') {
			data.push(childData);

			continue;
		}

		if (initialProps) {
			childData = getChildProps(childApi, initialProps || []);
		}

		if (debugMode) log(new Error().lineNumber, ' childData: ', childData);

		data.push(childData);
	}

	return data;
}

function children(args) {
	const res = JSON.parse(args);

	// * Request UUID
	var uuid = res.uuid;
	// * Live's object ID
	var objectId = res.objectId;
	var path = res.path;
	var child = res.args.child;
	var index = res.args.index;
	var initialProps = res.args.initialProps;

	var nsApi = liveApi(path, objectId);

    var childId;
    if (index) {
        var childPath =
            nsApi.path.replace(/"/g, "") + " " + child + " " + index;
        var childApi = liveApi(childPath);
        childId = ["id", childApi.id];
    }

    var ids = childId ? childId : nsApi.get(child);

	const data = processChildren(ids, initialProps);

	return onSuccess(uuid, data);
};



// **** SET
function set(args) {
	const res = JSON.parse(args);

	// * Request UUID
	var uuid = res.uuid;
	// * Live's object ID
	var objectId = res.objectId;
	var path = res.path;
	var prop = res.args.prop;
	var value = res.args.value;

	var api = liveApi(path, objectId);
	api.set(prop, value);

	onSuccess(uuid, value);
};


// **** CALL
function call(args) {
	const res = JSON.parse(args);

	// * Request UUID
	var uuid = res.uuid;
	// * Live's object ID
	var objectId = res.objectId;
	var path = res.path;
	var method = res.args.method;
	var methodArgs = res.args.parameters;

	try {
		var api = liveApi(path, objectId);
		var result = api.call.apply(api, [method].concat(methodArgs));

		log(methodArgs);

		if (debugMode) log(new Error().lineNumber, " call ", method, ":", result);

		if (isError(result)) {
			onFailure(uuid, method);
			return;
		}

		onSuccess(uuid, result);
	} catch(err) {
		log('Error', err);

		onFailure(uuid, err)
	}
};

// **** CALL MULTIPLE
function callMultiple(args) {
	const res = JSON.parse(args);

	// * Request UUID
	var uuid = res.uuid;
	// * Live's object ID
	var objectId = res.objectId;
	var path = res.path;
	var calls = res.args.calls;

	try {
		var api = liveApi(path, objectId);

		for (var index = 0; index < calls.length; index++) {
			const call = calls[index];
			api.call.apply(api, call);

			if (debugMode) log(new Error().lineNumber, " call multiple: ", call);
		}

		onSuccess(uuid);
	} catch (err) {
		log(err);

		onFailure(uuid, err)
	}
};

function callback(objectPath, objectId, property) {
	return function(result) {
		const event = callbackEvents[callbackName(objectPath, objectId)];

		if (event && event.listeners.length) {
			if (debugMode) log(new Error().lineNumber, ' event:', event);

			if (event.initialProps) {
				result.shift() //* result returns ['tracks', 'id', 123, 'id',..]
				result = processChildren(result, event.initialProps);
			}

			const value = handleLiveOutput(property, result, event.type);
			onCallback(event.listeners, value);
		}
	}
};

function observe(args) {
	const res = JSON.parse(args);

	// * Request UUID
	var uuid = res.uuid;
	// * Live's object ID
	var objectId = res.objectId;
	var path = res.path;
	var eventId = res.args.eventId;
	var property = res.args.property;
	var objectPath = res.args.objectPath;
	var initialProps = res.args.initialProps;

	if (objectId !== undefined) {
		path = 'id ' + objectId;
	}

	var cbName = callbackName(objectPath, objectId)

	if (callbackEvents[cbName] !== undefined) {
		callbackEvents[cbName].listeners.push(eventId);

		onSuccess(uuid, eventId);

		return;
	}

	var api = new LiveAPI(callback(objectPath, objectId, property), path);
	api.property = property;

	callbackEvents[cbName] = {
		listeners: [eventId],
		type: api.proptype,
		api: api,
		initialProps: initialProps
	};

	onSuccess(uuid, eventId);
};

function removeObserver(args) {
	const res = JSON.parse(args);

	// * Request UUID
	var uuid = res.uuid;
	var objectId = res.objectId;
	var eventId = res.args.eventId;
	var objectPath = res.args.objectPath;

	var cbName = callbackName(objectPath, objectId)

	if (callbackEvents[cbName] !== undefined) {
		var listeners = callbackEvents[cbName].listeners;
		var idx = listeners.indexOf(eventId);

		listeners.splice(idx, 1);

		if (!listeners.length) {
			const api = callbackEvents[cbName].api;
			api.id = 0;
			delete callbackEvents[cbName];
		}
	}

	onSuccess(uuid);
}


function close() {
	const paths = Object.keys(callbackEvents);
	log('Closing LiveAPI Bridge..');

	for (var index = 0; index < paths.length; index++) {
		const path = paths[index];

		const api = callbackEvents[path].api;
		api.id = 0;
		delete callbackEvents[path];
	}
};

// =============================================================================
// **** UTILS
// =============================================================================
function isError(result) {
	return result === Number.MIN_VALUE;
}

function log() {
	for (var i = 0, len = arguments.length; i < len; i++) {
		var message = arguments[i];
		if (Array.isArray(message)) {
			post(JSON.stringify(message));
		} else
		if (message && message.toString) {
			var s = message.toString();
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
