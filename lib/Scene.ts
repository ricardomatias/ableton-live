import { Properties } from './Properties';
import { AbletonLive } from '.';
import { RawClipSlotKeys, ClipSlot, RawClipSlot } from './ClipSlot';

/**
 * @interface SceneGetProperties
 */
export interface SceneGetProperties {
	/**
	 * May contain BPM and signature commands (like "128 BPM 3/4" ).
	 */
	name: string;
	/**
	 * The RGB value of the scene's color in the form 0x00rrggbb or (2^16 * red) + (2^8) * green + blue, where red, green and blue are values from 0 (dark) to 255 (light).<br />
	 * When setting the RGB value, the nearest color from the Scene color chooser is taken. </br>
	 */
	color: number;
	/**
	 * The color index of the scene.
	 */
	color_index: number;
	/**
	 * true = none of the slots in the scene is filled.
	 */
	is_empty: boolean;
	/**
	 * true = scene is blinking.
	 */
	is_triggered: boolean;
	/**
	 * Tempo in BPM as found by Live in the name.
	 */
	tempo: number;
}

/**
 * @interface SceneChildrenProperties
 */
export interface SceneChildrenProperties {
	/**
	 * @type {ClipSlot[]}
	 * @memberof SceneTransformedProperties
	 */
	clip_slots: RawClipSlot[];
}

/**
 * @interface SceneTransformedProperties
 */
export interface SceneTransformedProperties {
	/**
	 * @type {ClipSlot[]}
	 * @memberof SceneTransformedProperties
	 */
	clip_slots: ClipSlot[];
}

/**
 * @interface SceneSetProperties
 */
export interface SceneSetProperties {
	/**
	 * @inheritdoc SceneGetProperties.name
	 */
	name: string;
	/**
	 * @inheritdoc SceneGetProperties.color
	 */
	color: number;
	/**
	 * @inheritdoc SceneGetProperties.color_index
	 */
	color_index: number;
	/**
	 * @inheritdoc SceneGetProperties.tempo
	 */
	tempo: number;
}

export interface SceneObservableProperties {
	/**
	 * @inheritdoc SceneGetProperties.name
	 */
	name: string;
	/**
	 * @inheritdoc SceneGetProperties.color
	 */
	color: number;
	/**
	 * @inheritdoc SceneGetProperties.color_index
	 */
	color_index: number;
	/**
	 * @inheritdoc SceneGetProperties.is_triggered
	 */
	is_triggered: boolean;
}

export interface RawScene {
	id: string;
	path:string;
	name: string;
	isEmpty: boolean;
}

/**
 * @private
 */
export const RawSceneKeys = [ 'name', 'isEmpty' ];

const childrenInitialProps = {
	clip_slots: RawClipSlotKeys,
};

/**
 * This class represents a series of clip slots in Live's Session View matrix.
 *
 * @class Scene
 * @extends {Properties<SceneGetProperties, SceneChildrenProperties, SceneTransformedProperties, SceneSetProperties, SceneObservableProperties>}
 */
export class Scene extends Properties<
	SceneGetProperties,
	SceneChildrenProperties,
	SceneTransformedProperties,
	SceneSetProperties,
	SceneObservableProperties
> {
	static path = 'live_set scenes $1';

	static getPath(sceneNumber: number): string {
		return Scene.path.replace('$1', `${sceneNumber}`);
	}

	private _name: string;
	private _isEmpty: boolean;

	/**
	 * Creates an instance of Scene.
	 * @param {AbletonLive} ableton
	 * @param {RawScene} raw
	 * @param {string} [path]
	 * @memberof Scene
	 */
	constructor(ableton: AbletonLive, public raw: RawScene, path?: string) {
		super(ableton, 'scene', path ?? raw.path, childrenInitialProps);

		this._id = parseInt(raw.id, 10);
		this._name = raw.name;
		this._isEmpty = raw.isEmpty;

		this.childrenTransformers = {
			clip_slots: (clipSlots) => clipSlots.map((c) => new ClipSlot(this.ableton, c)),
		};
	}

	/**
	 * The name of the track
	 *
	 * @readonly
	 * @type {string}
	 * @memberof [[Scene]]
	 */
	get name(): string {
		return this._name;
	}

	/**
	 * Is the scene empty?
	 *
	 * @readonly
	 * @type {string}
	 * @memberof [[Scene]]
	 */
	get isEmpty(): boolean {
		return this._isEmpty;
	}

	/**
	 * Fire all clip slots contained within the scene and select this scene.</br>
	 * Starts recording of armed and empty tracks within a Group Track in this scene if Preferences->Launch->Start Recording on Scene Launch is ON.</br>
	 * Calling with force_legato = 1 (default = 0) will launch all clips immediately in Legato, independent of their launch mode.</br>
	 * When calling with can_select_scene_on_launch = 0 (default = 1) the scene is fired without selecting it.</br>
	 *
	 * @memberof [[Scene]]
	 *
	 * @param {boolean} forceLegato
	 * @param {boolean} canSelectSceneOnLaunch
	 * @return {void}
	 */
	public async fire(forceLegato?: boolean, canSelectSceneOnLaunch?: boolean): Promise<void> {
		return this.call('fire', [ forceLegato, canSelectSceneOnLaunch ]);
	}

	/**
	 * Fire the selected scene, then select the next scene.</br>
	 * It doesn't matter on which scene you are calling this function.</br>
	 * Calling with force_legato = 1 (default = 0) will launch all clips immediately in Legato, independent of their launch mode.</br>
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
	/**
	 * @private
	 * @readonly
	 * @type {string}
	 * @memberof Scene
	 */
	get [Symbol.toStringTag](): string {
		return `${this.name}`;
	}
}
