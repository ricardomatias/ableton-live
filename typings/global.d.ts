declare module 'mitt' {
	interface Emitter {
		on(type: 'foo', handler: (e: { bar: string }) => void): void;

		// Won't improve type checking due to existing catch-all typings
		off(type: 'foo', handler: (e: { bar: string }) => void): void;
		// Won't improve type checking due to existing catch-all typings
		emit(type: 'foo', e: { bar: string }): void;
	}
}
