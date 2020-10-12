/* eslint-disable import/named */
import mitt, {
	Emitter,
	EventType,
	Handler,
	WildcardHandler,
	EventHandlerMap,
} from 'mitt';

export class EventEmitter {
	private mitt: Emitter;

	constructor(e?: EventHandlerMap) {
		this.mitt = mitt(e);
	}

	all: EventHandlerMap;
	on<T = any>(type: EventType, handler: Handler<T>): this
	on(type: '*', handler: WildcardHandler): this {
		this.mitt.on(type, handler);
		return this;
	}
	off<T = any>(type: EventType, handler: Handler<T>): void
	off(type: '*', handler: WildcardHandler): void {
		this.mitt.off(type, handler);
	}

	emit<T = any>(type: EventType, event?: T): void
	emit(type: '*', event?: any): void {
		this.mitt.emit(type, event);
	}
}
