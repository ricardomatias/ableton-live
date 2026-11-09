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

export type WebSocketPayload = Parameters<WebSocket['send']>[0];

interface WebSocketEvents {
	open: (event: Event) => void;
	message: (event: MessageEvent) => void;
	close: (event: CloseEvent) => void;
	error: (event: Event) => void;
	reconnect: (tries: number) => void;
	ping: () => void;
	pong: () => void;
	all: (event: Event) => void;
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
		super();

		this.maxAttempts = maxAttempts;
		this.timeout = timeout;
	}

	open(url: string, protocols: string | string[] = []): void {
		try {
			this.ws = new WebSocket(url, protocols);
		} catch {
			this.emit('error', new Event('error'));
			return;
		}

		this.url = url;
		this.protocols = protocols;

		this.ws.addEventListener('message', this.onMessage);
		this.ws.addEventListener('open', this.onOpen);
		this.ws.addEventListener('close', this.onClose);
		this.ws.addEventListener('error', this.onError);
	}

	private onMessage = (event: MessageEvent): void => {
		this.emit('message', event);
	};

	private onOpen = (event: Event): void => {
		this.emit('open', event);
		this.num = 0;
		clearTimeout(this.timer);
	};

	private onClose = (event: CloseEvent): void => {
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
	};

	private onError = (event: Event): void => {
		this.emit('error', event);
	};

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

		this.ws.removeEventListener('message', this.onMessage);
		this.ws.removeEventListener('open', this.onOpen);

		this.ws.close(code, reason);

		this.ws.removeEventListener('close', this.onClose);
		this.ws.removeEventListener('error', this.onError);
	}
}
