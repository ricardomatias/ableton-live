import { EventEmitter } from './EventEmitter';

// https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
enum WebSocketCloseCode {
	NormalClosure = 1000,
	GoingAway = 1001,
	NoStatusReceived = 1005,
	AbnormalClosure = 1006
}

export enum WebSocketState {
	Connecting = 0,
	Open = 1,
	Closing = 2,
	Closed = 3
}

export interface WebSocketteOptions {
	timeout?: number;
	maxAttempts?: number;
}

export type WebSocketPayload = string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView;

interface ConnectionEvents {
	on(e: 'open', l: (event) => void): void;
	on(e: 'close', l: (event) => void): void;
	on(e: 'message', l: (event) => void): void;
	on(e: 'error', l: (event) => void): void;
	on(e: 'ping', l: (event) => void): void;
	on(e: 'pong', l: (event) => void): void;
}

export class WebSockette extends EventEmitter implements ConnectionEvents {
	ws: WebSocket;
	num = 0;
	timer = 1;
	timeout: number;
	maxAttempts: number;
	private url: string;
	private protocols: string | string[];

	constructor({ maxAttempts = 20, timeout = 1000 }: WebSocketteOptions = {}) {
		super();

		this.maxAttempts = maxAttempts;
		this.timeout = timeout;
	}

	open(url: string, protocols: string | string[] = []): void {
		this.ws = new WebSocket(url, protocols);

		this.url = url;
		this.protocols = protocols;

		this.ws.onmessage = (event) => {
			switch (event.data) {
			case 'ping':
				this.emit('ping');
				this.send('pong');
				break;
			case 'pong':
				this.emit('pong');
				this.send('ping');
				break;
			default:
				this.emit('message', event);
			}
		};

		this.ws.onopen = (event) => {
			this.emit('open', event);
			this.send('pong');
			this.num = 0;
		};

		this.ws.onclose = (event) => {
			console.log('ON CLOSE', event.code);
			switch (event.code) {
			case WebSocketCloseCode.NormalClosure:
			case WebSocketCloseCode.GoingAway:
			case WebSocketCloseCode.NoStatusReceived:
				this.emit('close', event);
				break;
			case WebSocketCloseCode.AbnormalClosure:
			default:
				this.reconnect(event);
			}
		};

		this.ws.onerror = (event) => {
			console.log('ON ERROR', event.type);
			if (event) {
				// this.reconnect(event);
			} else {
				this.emit('error', event);
			}
		};
	}

	get state(): WebSocketState {
		return this.ws.readyState;
	}

	private reconnect(event): void {
		if (this.timer && this.num++ < this.maxAttempts) {
			this.timer = <any>setTimeout(() => {
				this.emit('reconnect', this.num);
				this.open(this.url, this.protocols);
			}, this.timeout || 1e3);
		} else {
			this.emit('close', event);
		}
	}

	json<T>(payload: T): void {
		this.ws.send(JSON.stringify(payload));
	}

	send(payload: WebSocketPayload): void {
		console.log('send ', payload);
		this.ws.send(payload);
	}

	close(code?: number, reason = 'General'): void {
		console.log('close ', code, reason);
		console.log('bufferedAmount: ', this.ws.bufferedAmount);
		this.timer = <any>clearTimeout(this.timer);
		this.ws.close(code, reason);
	}
}

