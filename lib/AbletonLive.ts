import { EventEmitter, TypedEventEmitter } from './helpers/EventEmitter';
import { WebSockette } from './helpers/WebSockette';
import { nanoid } from 'nanoid';
import { Song } from './Song';

import { SongView } from './SongView';

interface Command {
	path: string;
	action: string;
	uuid: string;
	objectId: number | undefined;
	args?: { [k: string]: any };
}

enum ResponseEvent {
	Success = 'success',
	Callback = 'callback',
	Error = 'error',
	Connect = 'connect',
	Disconnect = 'disconnect',
}

interface Response {
	uuid: string;
	event: ResponseEvent | string;
	result: any;
}

interface ConnectionEvents {
	connect: () => void;
	disconnect: () => void;
}

type Listener = (data: any) => any;
type Callback = (err: Error | null, data?: any) => any;

export interface AbletonLiveOptions {
	/**
	 * @default '127.0.0.1'
	 */
	host?: string;
	/**
	 * @default 9001
	 */
	port?: number;
	/**
	 * Logs every request to and from Live to the console
	 *
	 * @default false
	 */
	logRequests?: boolean;
}

/**
 * The library's entry point.
 *
 * @class AbletonLive
 * @extends {EventEmitter}
 */
export class AbletonLive extends (EventEmitter as new () => TypedEventEmitter<ConnectionEvents>) {
	private client: WebSockette;
	private messageBus = new Map<string, Callback>();
	private eventListeners = new Map<string, Listener>();

	private _isConnected = false;
	private _host: string;
	private _port: number;
	private _logRequests: boolean;
	private _heartbeat: () => void;

	public song = new Song(this);
	public songView = new SongView(this);

	private _heartbeatTimeout: number;
	private _heartbeatInterval: number;
	private _isBrowser: boolean;

	/**
	 * @param {AbletonLiveOptions} [{ host = '127.0.0.1', port = 9000, logRequests = false }={}]
	 * @memberof AbletonLive
	 */
	constructor({ host = '127.0.0.1', port = 9001, logRequests = false }: AbletonLiveOptions = {}) {
		// eslint-disable-next-line constructor-super
		super();

		this._host = host;
		this._port = port;
		this._logRequests = logRequests;

		this._isBrowser = typeof window !== 'undefined';

		if ((!this._isBrowser || window.WebSocket === undefined) && global.WebSocket === undefined) {
			throw new Error('[AbletonLive]: WebSocket implementation not available');
		}

		this.client = new WebSockette();

		this.handleIncoming = this.handleIncoming.bind(this);
		this._heartbeatInterval = 5000 + 500;

		this._heartbeat = () => {
			clearTimeout(this._heartbeatTimeout);

			this._heartbeatTimeout = <any>setTimeout(() => this.client.close(), this._heartbeatInterval);
		};
	}

	/**
	 * Connect to the Max4Live server
	 *
	 * @returns {Promise<void>}
	 * @memberof AbletonLive
	 */
	async connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.client.on('open', () => {
				this._isConnected = true;

				console.log(`[AbletonLive] Listening on ${this._host}:${this._port}`);

				this._heartbeat();

				this.emit('connect');

				resolve();
			});

			this.client.on('ping', this._heartbeat.bind(this));

			this.client.on('error', (err) => {
				// this.close();
				reject(new Error((err as ErrorEvent).message));
			});

			this.client.on('close', (event) => {
				console.log(`[AbletonLive] Disconnected with code ${event.code}`);

				this.closeClient();
			});

			this.client.on('reconnect', (attemptNumber) => {
				console.log(`[AbletonLive] Attempt to reconnect #${attemptNumber}`);
			});

			this.client.on('message', this.handleIncoming);

			this.client.open(`ws://${this._host}:${this._port}`);

			if (this._isBrowser) {
				window.addEventListener('beforeunload', () => {
					console.log('[AbletonLive] Disconnected by reload');

					this.closeClient();
				});
			}
		});
	}

	/**
	 * Returns true if there's a connection with the server
	 *
	 * @readonly
	 * @type {boolean}
	 * @memberof AbletonLive
	 */
	get isConnected(): boolean {
		return this._isConnected;
	}

	private closeClient(): void {
		this._isConnected = false;
		clearTimeout(this._heartbeatTimeout);

		this.client.close();

		this.emit('disconnect');
	}

	close(): void {
		this.messageBus.clear();

		if (this.eventListeners.size) {
			this.sendRaw({ action: 'close' });

			this.eventListeners.clear();
		}

		this._isConnected = false;

		clearInterval(this._heartbeatTimeout);
		this.client.close();

		this.emit('disconnect');
	}

	protected sendRaw<T>(msg: T): void {
		if (!this._isConnected) {
			throw new Error('[Ableton Live]: Client not connected to the server');
		}
		// const message = new Message(action, msg);
		// const bundle = new Bundle([ message ], Date.now());
		this.client.json(msg);
	}

	private handleIncoming(message): void {
		try {
			const data: Response = JSON.parse(message.data);
			const callback = this.messageBus.get(data.uuid);

			if (this._logRequests) console.log(data);

			if (data.event === ResponseEvent.Success && callback) {
				this.messageBus.delete(data.uuid);
				return callback(null, data.result);
			}

			if (data.event === ResponseEvent.Callback && data.result.listeners) {
				data.result.listeners.map((eventId) => {
					const callback = this.eventListeners.get(eventId);

					if (callback) {
						callback(data.result.data);
					}
				});

				return;
			}

			if (data.event === ResponseEvent.Error && callback) {
				this.messageBus.delete(data.uuid);
				return callback(new Error(data.result));
			}

			if (data.event === ResponseEvent.Disconnect) {
				this.close();
				return;
			}
		} catch (err) {
			console.log(`[AbletonLive] ${err.stack}`);
		}
	}

	private async sendCommand(
		action: string,
		path: string,
		objectId?: number,
		args: { [k: string]: any } = {},
		timeout = 2000
	): Promise<any> {
		if (!this._isConnected) {
			throw new Error('[Ableton Live]: Client not connected to the server');
		}

		return new Promise((resolve, reject) => {
			// * remove undefined entries
			Object.keys(args).forEach((key) => args[key] === undefined && delete args[key]);

			const uuid: string = nanoid();
			const cmd = {
				uuid,
				objectId,
				action,
				path,
				args,
			} as Command;

			if (this._logRequests) console.log('Command:', cmd);

			const timeoutId = setTimeout(() => reject(new Error('Timeout')), timeout);

			this.messageBus.set(uuid, (err, data) => {
				if (err) {
					reject(err);
					return;
				}
				clearTimeout(timeoutId);
				resolve(data);
			});

			this.sendRaw(cmd);
		});
	}

	async get(path: string, prop: string, liveObjectId?: number): Promise<any> {
		return this.sendCommand('get', path, liveObjectId, { prop });
	}

	async getChildren(
		path: string,
		args: { child: string; initialProps: any; index?: number },
		liveObjectId?: number
	): Promise<any> {
		return this.sendCommand('children', path, liveObjectId, args);
	}

	async set(path: string, prop: string, value: any, liveObjectId?: number): Promise<any> {
		return this.sendCommand('set', path, liveObjectId, { prop, value });
	}

	async observe(
		path: string,
		property: string,
		listener: (data: any) => any,
		{ initialProps, liveObjectId }: { initialProps?: any; liveObjectId?: number } = {}
	): Promise<any> {
		const eventId = nanoid();
		const objectPath = `${path} ${property}`;
		const result = await this.sendCommand('observe', path, liveObjectId, {
			objectPath,
			property,
			eventId,
			initialProps,
		});

		if (result === eventId) {
			this.eventListeners.set(eventId, listener);
		}

		return async () => await this.removeObserser(path, property, eventId, liveObjectId);
	}

	async call(
		path: string,
		callDescription: { method: string; parameters: any },
		liveObjectId?: number,
		timeout?: number
	): Promise<any> {
		return this.sendCommand('call', path, liveObjectId, callDescription, timeout);
	}

	async callMultiple(path: string, calls: any[][], liveObjectId?: number, timeout?: number): Promise<any> {
		return this.sendCommand('callMultiple', path, liveObjectId, { calls }, timeout);
	}

	private async removeObserser(path: string, property: string, eventId: string, liveObjectId?: number): Promise<void> {
		await this.sendCommand('removeObserver', path, liveObjectId, {
			eventId,
			objectPath: `${path} ${property}`,
		});
		this.eventListeners.delete(eventId);
	}
}
