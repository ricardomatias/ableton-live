import mitt, {
	Emitter,
	EventType,
	Handler,
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

export class EventEmitter<Events extends Record<EventType, unknown>> {
	private mitt: Emitter<Events>;

	constructor(e?: EventHandlerMap<Events>) {
		this.mitt = mitt(e);
	}

	get all(): EventHandlerMap<Events> {
		return this.mitt.all;
	}

	on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void {
		this.mitt.on(type, handler);
	}

	off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void {
		this.mitt.off(type, handler);
	}

	emit<T>(type: EventType, event?: T): void;
	emit(type: '*', event?: any): void {
		this.mitt.emit(type, event);
	}
}
