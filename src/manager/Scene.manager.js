import { Scene } from 'miaam-ecs';
import { TilingSprite } from 'pixi.js';
import GameManager from './Game.manager.js';
import PhysicsManager from './Physics.manager.js';

/**
 * @public
 * @class
 */
class SceneManager {
	/**
	 * @type {SceneManager}
	 */
	static #instance;

	#currentScene;

	#sharedTicker;

	/**
	 * @private
	 * @constructor
	 */
	constructor() {}

	/**
	 * @returns {SceneManager}
	 */
	static get instance() {
		if (!this.#instance) {
			this.#instance = new SceneManager();
		}
		return this.#instance;
	}

	set scene(scene) {
		if (!this.#currentScene) {
			this.#sharedTicker = GameManager.instance.app.ticker;
			this.#sharedTicker.add((delta) => {
				this.#currentScene.update(delta);
			});
			this.#sharedTicker.autoStart = false;
		}

		this.pause();
		GameManager.instance.clearStage();
		PhysicsManager.instance.reset();
		this.#currentScene = scene;
		scene.init();
		this.start();
	}

	start() {
		this.#sharedTicker.start();
	}

	pause() {
		this.#sharedTicker.stop();
	}
}

export default {
	get instance() {
		return SceneManager.instance;
	},
};
