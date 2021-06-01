import mitt, {
	Emitter,
	EventType,
	Handler,
	WildcardHandler,
	EventHandlerMap,
} from 'mitt';

export type Arguments<T> = [T] extends [(...args: infer U) => any]
	? U
	: [T] extends [void] ? [] : [T]

export interface TypedEventEmitter<Events> {
	on<E extends keyof Events>(event: E, listener: Events[E]): void
	off<E extends keyof Events>(event: E, listener: Events[E]): void
	emit<E extends keyof Events>(event: E, ...args: Arguments<Events[E]>): void
}

export class EventEmitter {
	private mitt: Emitter;

	constructor(e?: EventHandlerMap) {
		this.mitt = mitt(e);
	}

	get all(): EventHandlerMap {
		return this.mitt.all;
	}

	on<T>(type: EventType, handler: Handler<T>): void {
		this.mitt.on(type, handler);
	}
	off<T = any>(type: EventType, handler: Handler<T>): void
	off(type: '*', handler: WildcardHandler): void {
		this.mitt.off(type, handler);
	}

	emit<T>(type: EventType, event?: T): void
	emit(type: '*', event?: any): void {
		this.mitt.emit(type, event);
	}
}
