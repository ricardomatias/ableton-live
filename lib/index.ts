import { EventEmitter } from './helpers/EventEmitter';
import { WebSockette } from './helpers/WebSockette';
import { nanoid } from 'nanoid';
import { Song } from './Song';

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
	on(e: 'connect', l: () => void): this;
	on(e: 'disconnect', l: () => void): this;
}

type Listener = (data: any) => any
type Callback = (err: Error | null, data?: any) => any

export class AbletonLive extends EventEmitter implements ConnectionEvents {
	private client: WebSockette;
	private messageBus = new Map<string, Callback>();
	private eventListeners = new Map<string, Listener>();

	private _isConnected = false;
	private _host: string;
	private _port: number;
	private _heartbeat: () => void;

	public song = new Song(this);

	private _heartbeatTimeout: number;
	private _heartbeatInterval: number;

	constructor({
		host = '127.0.0.1',
		port = 9000,
		heartbeatInterval = 5000 + 1000,
	} = {}) {
		super();

		this._host = host;
		this._port = port;

		this.client = new WebSockette();

		this.handleIncoming = this.handleIncoming.bind(this);
		this._heartbeatInterval = heartbeatInterval;

		this._heartbeat = () => {
			clearTimeout(this._heartbeatTimeout);

			this._heartbeatTimeout = <any>setTimeout(() => (this.client.close()), this._heartbeatInterval);
		};
	}

	async connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.client.on('open', () => {
				this._isConnected = true;

				console.log(`[AbletonLive] Listening on ${this._host}:${this._port}`);

				this._heartbeat();

				resolve();
			});

			this.client.on('ping', this._heartbeat.bind(this));

			this.client.on('error', (err) => {
				console.log(err);
				this.close();
				reject(new Error(err.message));
			});

			this.client.on('close', () => {
				console.log(`[AbletonLive] Disconnected`);
				this._isConnected = false;
				clearTimeout(this._heartbeatTimeout);
			});

			this.client.on('reconnect', (attemptNumber) => {
				console.log(`[AbletonLive] Attempt to reconnect #${attemptNumber}`);
			});

			this.client.on('message', this.handleIncoming);

			this.client.open(`ws://${this._host}:${this._port}`);
		});
	}

	isConnected(): boolean {
		return this._isConnected;
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
	}

	sendRaw<T>( msg: T ): void {
		// const message = new Message(action, msg);
		// const bundle = new Bundle([ message ], Date.now());
		this.client.json(msg);
	}

	private handleIncoming(message): void {
		try {
			const data: Response = JSON.parse(message.data);
			const callback = this.messageBus.get(data.uuid);
			console.log(data);

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
		args?: { [k: string]: any },
		timeout = 2000,
	): Promise<any> {
		return new Promise((resolve, reject) => {
			const uuid: string = nanoid();
			const cmd = {
				uuid,
				objectId,
				action,
				path,
				args,
			} as Command;

			console.log('Command:', cmd);

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
		args: any,
		liveObjectId?: number,
	): Promise<any> {
		// * remove undefined entries
		Object.keys(args).forEach((key) => args[key] === undefined && delete args[key]);

		return this.sendCommand('children', path, liveObjectId, args);
	}

	async set(path: string, prop: string, value: any, liveObjectId?: number): Promise<any> {
		return this.sendCommand('set', path, liveObjectId, { prop, value });
	}

	async observe(
		path: string,
		property: string,
		listener: (data: any) => any,
		liveObjectId?: number,
	): Promise<any> {
		const eventId = nanoid();
		const objectPath = `${path} ${property}`;
		const result = await this.sendCommand('observe', path, liveObjectId, {
			objectPath,
			property,
			eventId,
		});

		if (result === eventId) {
			this.eventListeners.set(eventId, listener);
		}

		return async () => (await this.removeObserser(path, property, eventId, liveObjectId));
	}

	async call(
		path: string,
		callDescription: { method: string, parameters: any },
		liveObjectId?: number,
		timeout?: number,
	): Promise<any> {
		return this.sendCommand('call', path, liveObjectId, callDescription, timeout);
	}

	async callMultiple(
		path: string,
		calls: any[][],
		liveObjectId?: number,
		timeout?: number,
	): Promise<any> {
		return this.sendCommand('callMultiple', path, liveObjectId, { calls }, timeout);
	}

	private async removeObserser(
		path: string,
		property: string,
		eventId: string,
		liveObjectId?: number,
	): Promise<void> {
		await this.sendCommand('removeObserver', path, liveObjectId, {
			eventId,
			objectPath: `${path} ${property}`,
		});
		this.eventListeners.delete(eventId);
	}
}

