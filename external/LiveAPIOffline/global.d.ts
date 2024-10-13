declare module 'max-api' {
	export function addHandler(name: string, handler: (...args: any[]) => void): void;

	export function removeHandler(name: string): void;

	export function outlet(...args: any[]): void;

	export function post(...args: any[]): void;

	export function error(...args: any[]): void;

	export function setDict(dict: object): void;

	export function getDict(): object;

	export function setInletAssist(assist: string): void;

	export function setOutletAssist(assist: string): void;

	export function declareInlets(num: number): void;

	export function declareOutlets(num: number): void;
}
