# Ableton Live

A library for communicating with Ableton Live via WebSockets, works both in Node and in the Browser.

## Requirements

* Ableton Live 11
* Max 4 Live


## Installation

1. Install package

```bash
npm install --save ableton-live
```

2. Drag and drop `external/LiveAPI.amxd` to any track in Ableton Live (f.ex, Master Track)

3. Done!

## Usage

### Browser

```js
import { AbletonLive } from 'ableton-live';
```

### NodeJS

```js
// polyfill for a browser API compatible WebSocket
if (process) {
    global.WebSocket = require('ws');
}
```

```js
import { AbletonLive } from 'ableton-live';
// or
const { AbletonLive } = require('ableton-live');
```

## Example

```js
import { AbletonLive } from 'ableton-live';

const live = new AbletonLive();

const main = async () => {
    try {
        await live.connect();

        const tracks = await live.song.children('tracks');
        const clips = await tracks[0].getClips();
        const notes = await clips[0].getNotes();

        notes.forEach(note => console.log(note.pitch));
    } catch (error) {
        console.error(error);
    }
};

main();
```

## Documentation

Found at [https://ricardomatias.net/ableton-live/](https://ricardomatias.net/ableton-live/)

## Credits

A loose fork of ableton-js, which was a great source of inspiration on how to approach handling Live's Object Model.

## Development
When not receiving try running `sudo lsof -i :send_port_number` and make sure only **Max** is using it.
