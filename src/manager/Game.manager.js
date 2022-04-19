import { Application } from 'pixi.js';
import Keyboard from '../input/keyboard/keyboard.js';

import { IntegrationError } from '../error/index.js';

/**
 * @public
 * @class
 */
class GameManager {
	/**
	 * @type {GameManager}
	 */
	static #instance;

	/**
	 * @type {Application}
	 */
	#app;

	index;

	/**
	 * @private
	 * @constructor
	 */
	constructor() {
		this.#resolveGlobals();
		if (!this.index) {
			throw new IntegrationError(
				'Cannot instantiate game manager without miaam-lock file. Please load the lock file first'
			);
		}
		Keyboard.bindEventListener(window);
	}

	/**
	 * @returns {GameManager}
	 */
	static get instance() {
		if (!this.#instance) {
			this.#instance = new GameManager();
		}
		return this.#instance;
	}

	/**
	 * @param {Object} options
	 */
	createApplication = (options) => {
		this.#app = new Application(options);
	};

	#resolveGlobals = () => {
		this.index = window.__MIAAM__.LOCK;
	};

	/**
	 * @returns {Application}
	 */
	get app() {
		return this.#app;
	}

	get window() {
		return this.#app.view;
	}
}

export default {
	get instance() {
		return GameManager.instance;
	},
};
