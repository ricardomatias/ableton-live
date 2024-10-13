import { nanoid } from 'nanoid';
import { Song } from './Song';
import { SongView } from './SongView';
import AbletonLiveBase from './AbletonLiveBase';

type Listener = (data: any) => any;
type Callback = (err: Error | null, data?: any) => any;

interface Response {
	uuid: string;
	event: ResponseEvent | string;
	result: any;
}
enum ResponseEvent {
	Success = 'success',
	Callback = 'callback',
	Error = 'error',
	Connect = 'connect',
	Disconnect = 'disconnect',
}
export interface Command {
	path: string;
	action: string;
	uuid: string;
	objectId: number | undefined;
	args?: { [k: string]: any };
}

type LiveCallback = (msg: Command) => void;

/**
 * The library's entry point.
 *
 * @class AbletonLive
 * @extends {EventEmitter}
 */
export class AbletonLiveOffline extends AbletonLiveBase {
	private messageBus = new Map<string, Callback>();
	private eventListeners = new Map<string, Listener>();
	private liveCallback: LiveCallback = () => {};
	private _logRequests = false;

	public song = new Song(this);
	public songView = new SongView(this);

	/**
	 * @param {AbletonLiveOptions} [{ host = '127.0.0.1', port = 9000, logRequests = false }={}]
	 * @memberof AbletonLive
	 */
	constructor(callback: LiveCallback) {
		// eslint-disable-next-line constructor-super
		super();

		this.liveCallback = callback;

		this.handleCommandResponse = this.handleCommandResponse.bind(this);
	}

	protected sendRaw(msg: Command): void {
		this.liveCallback(msg);
	}

	handleCommandResponse(message): void {
		try {
			const data: Response = JSON.parse(message);

			console.log("data", data);
			console.log('message', message);
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
		} catch (err: any) {
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
