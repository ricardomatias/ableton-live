import { EventEmitter, TypedEventEmitter } from './EventEmitter';

// https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
enum WebSocketCloseCode {
	NormalClosure = 1000,
	GoingAway = 1001,
	NoStatusReceived = 1005,
	AbnormalClosure = 1006,
}

export enum WebSocketState {
	Connecting = 0,
	Open = 1,
	Closing = 2,
	Closed = 3,
}

export interface WebSocketteOptions {
	timeout?: number;
	maxAttempts?: number;
}

export type WebSocketPayload = string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView;

interface WebSocketEvents {
	open: (event: Event) => void;
	message: (event: MessageEvent) => void;
	close: (event: CloseEvent) => void;
	error: (event: Event) => void;
	reconnect: (tries: number) => void;
	ping: () => void;
	pong: () => void;
}

export class WebSockette extends (EventEmitter as new () => TypedEventEmitter<WebSocketEvents>) {
	ws: WebSocket;
	num = 0;
	timer: number | undefined;
	timeout: number;
	maxAttempts: number;
	private url: string;
	private protocols: string | string[];

	constructor({ maxAttempts = 20, timeout = 1000 }: WebSocketteOptions = {}) {
		// eslint-disable-next-line constructor-super
		super();

		this.maxAttempts = maxAttempts;
		this.timeout = timeout;
	}

	open(url: string, protocols: string | string[] = []): void {
		try {
			this.ws = new WebSocket(url, protocols);
		} catch (err) {
			this.emit('error', new Event('error'));
			return;
		}

		this.url = url;
		this.protocols = protocols;

		this.ws.addEventListener('message', (event: MessageEvent) => {
			this.emit('message', event);
		});

		this.ws.addEventListener('open', (event) => {
			this.emit('open', event);
			this.num = 0;
			clearTimeout(this.timer);
		});

		this.ws.addEventListener('close', (event) => {
			switch (event.code) {
				case WebSocketCloseCode.NormalClosure:
				case WebSocketCloseCode.GoingAway:
				case WebSocketCloseCode.NoStatusReceived:
					this.emit('close', event);
					clearTimeout(this.timer);
					break;
				case WebSocketCloseCode.AbnormalClosure:
				default:
					if (this.num === 0) {
						this.emit('close', event);
					}

					this.reconnect(event);
			}
		});

		this.ws.addEventListener('error', (event) => {
			this.emit('error', event);
		});
	}

	get state(): WebSocketState {
		return this.ws.readyState;
	}

	private reconnect(event): void {
		if (this.num++ < this.maxAttempts) {
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
		this.ws.send(payload);
	}

	close(code = WebSocketCloseCode.NormalClosure, reason = 'General'): void {
		console.log('[AbletonLive] Closing Connection');

		if (this.timer) {
			clearTimeout(this.timer);
		}

		this.ws.close(code, reason);
	}
}
