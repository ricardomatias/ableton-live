import { Properties } from './Properties';
import { AbletonLive } from '.';
import { RawClipSlot, ClipSlot } from './ClipSlot';

export interface GettableProperties {
	name: string;
	color: number;
	color_index: number;
	is_empty: boolean;
	is_triggered: boolean;
	tempo: number;
}

export interface ChildrenProperties {
	clip_slots: RawClipSlot[];
}

export interface TransformedProperties {
	clip_slots: ClipSlot[];
}

export interface SettableProperties {
	name: string;
	color: number;
	color_index: number;
	tempo: number;
}

export interface ObservableProperties {
	name: string;
	color: number;
	color_index: number;
	is_triggered: boolean;
}

export interface RawScene {
	id: string;
	name: string;
	isEmpty: boolean;
}

export const RawScene = [
	'name',
	'isEmpty',
];

const childrenInitialProps = {
	clip_slots: RawClipSlot,
};

export class Scene extends Properties<
	GettableProperties,
	ChildrenProperties,
	TransformedProperties,
	SettableProperties,
	ObservableProperties
	> {
	static path = 'live_set scenes $1';

	static getPath(sceneNumber: number): string {
		return Scene.path.replace('$1', `${sceneNumber}`);
	}

	private _name: string;
	private _isEmpty: boolean;

	constructor(ableton: AbletonLive, public raw: RawScene, path?: string) {
		super(ableton, 'track', path ? path : Scene.path, childrenInitialProps);

		this._id = parseInt(raw.id, 10);
		this._name = raw.name;
		this._isEmpty = raw.isEmpty;

		this.transformers = {
			clip_slots: (clipSlots) => clipSlots.map((c) => new ClipSlot(this.ableton, c)),
		};
	}

	/**
	 * The name of the track
	 *
	 * @readonly
	 * @type {string}
	 * @memberof Scene
	 */
	get name(): string {
		return this._name;
	}

	/**
	* Is the scene empty?
	*
	* @readonly
	* @type {string}
	* @memberof Scene
	*/
	get isEmpty(): boolean {
		return this._isEmpty;
	}


	/**
	* Fire all clip slots contained within the scene and select this scene.
	* Starts recording of armed and empty tracks within a Group Track in this scene if Preferences->Launch->Start Recording on Scene Launch is ON.
	* Calling with force_legato = 1 (default = 0) will launch all clips immediately in Legato, independent of their launch mode.
	* When calling with can_select_scene_on_launch = 0 (default = 1) the scene is fired without selecting it.
	* @memberof Scene
	*
	* @param {boolean} forceLegato
	* @param {boolean} canSelectSceneOnLaunch
	* @return {void}
	*/
	public async fire(forceLegato?: boolean, canSelectSceneOnLaunch?: boolean): Promise<void> {
		return this.call('fire', [ forceLegato, canSelectSceneOnLaunch ]);
	}

	/**
	* Fire the selected scene, then select the next scene.
	* It doesn't matter on which scene you are calling this function.
	* Calling with force_legato = 1 (default = 0) will launch all clips immediately in Legato, independent of their launch mode.
	*
	* set_fire_button_state
	* @memberof Scene
	*
	* @param {boolean} forceLegato
	* @return {void}
	*/
	public async fireAsSelected(forceLegato?: boolean): Promise<void> {
		return this.call('fire_as_selected', [ forceLegato ]);
	}

	/**
	* If the state is set to 1, Live simulates pressing of scene button until the state is set to 0 or until the scene is stopped otherwise.
	* @memberof Scene
	*
	* @param {boolean} state
	* @return {void}
	*/
	public async setFireButtonState(state: boolean): Promise<void> {
		return this.call('set_fire_button_state', [ state ]);
	}

	get [Symbol.toStringTag](): string {
		return `${this.name}`;
	}
}
