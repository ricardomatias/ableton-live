declare module 'osc-js' {
	export default class OSC {
		constructor(options: object);

		close(): any;

		off(eventName: any, subscriptionId: any): any;

		on(eventName: any, callback: any): any;

		open(options?: any): any;

		send(packet: any, options?: any): any;

		status(): any;

		static STATUS: {
			IS_CLOSED: number;
			IS_CLOSING: number;
			IS_CONNECTING: number;
			IS_NOT_INITIALIZED: number;
			IS_OPEN: number;
		};
	}

	export class BridgePlugin {
		constructor(...args: any[]);

		close(): void;

		open(...args: any[]): void;

		registerNotify(fn: any): void;

		send(binary: any, ...args: any[]): void;

		status(): any;
	}

	export class Bundle {
		constructor(...args: any[]);

		add(item: any): void;

		pack(): any;

		timestamp(ms: any): void;

		unpack(dataView: any, ...args: any[]): any;
	}

	export class DatagramPlugin {
		constructor(...args: any[]);

		close(): void;

		open(...args: any[]): void;

		registerNotify(fn: any): void;

		send(binary: any, ...args: any[]): void;

		status(): any;
	}

	export class Message {
		constructor(...args: any[]);
		offset: number;
		address: string;
		types: string;
		args: any[];

		add(item: any): void;

		pack(): any;

		unpack(dataView: any, ...args: any[]): any;
	}

	export class Packet {
		constructor(value: any);

		pack(): any;

		unpack(dataView: any, ...args: any[]): any;
	}

	export class WebsocketClientPlugin {
		constructor(customOptions: any);

		close(): void;

		open(...args: any[]): void;

		registerNotify(fn: any): void;

		send(binary: any): void;

		status(): any;
	}

	export class WebsocketServerPlugin {
		constructor(customOptions: any);

		close(): void;

		open(...args: any[]): void;

		registerNotify(fn: any): void;

		send(binary: any): void;

		status(): any;
	}
}

