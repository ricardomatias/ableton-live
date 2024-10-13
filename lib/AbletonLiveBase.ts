import { EventEmitter, TypedEventEmitter } from './helpers/EventEmitter';

interface ConnectionEvents {
	connect: () => void;
	disconnect: () => void;
}

// interface Command {
// 	path: string;
// 	action: string;
// 	uuid: string;
// 	objectId: number | undefined;
// 	args?: { [k: string]: any };
// }

// enum ResponseEvent {
// 	Success = 'success',
// 	Callback = 'callback',
// 	Error = 'error',
// 	Connect = 'connect',
// 	Disconnect = 'disconnect',
// }

// interface Response {
// 	uuid: string;
// 	event: ResponseEvent | string;
// 	result: any;
// }


abstract class AbletonLiveBase extends (EventEmitter as new () => TypedEventEmitter<ConnectionEvents>) {
	// abstract connect(): void;
	// abstract disconnect(): void;

	abstract get(path: string, prop: string, liveObjectId?: number): Promise<any>;

	abstract getChildren(
		path: string,
		args: { child: string; initialProps: any; index?: number },
		liveObjectId?: number
	): Promise<any>;

	abstract set(path: string, prop: string, value: any, liveObjectId?: number): Promise<any>;

	abstract observe(
		path: string,
		property: string,
		listener: (data: any) => any,
		{ initialProps, liveObjectId }: { initialProps?: any; liveObjectId?: number }
	): Promise<any>;

	abstract call(
		path: string,
		callDescription: { method: string; parameters: any },
		liveObjectId?: number,
		timeout?: number
	): Promise<any>;

	abstract callMultiple(path: string, calls: any[][], liveObjectId?: number, timeout?: number): Promise<any>;
}

export default AbletonLiveBase;
