import { Composite, Engine, Events } from 'matter-js';

class PhysicsManager {
	static #instance;

	#engine;

	#events;

	constructor() {
		this.#engine = Engine.create();
		this.#events = document.createElement('div');
		this.reset();
	}

	static get instance() {
		if (!this.#instance) {
			this.#instance = new PhysicsManager();
		}
		return this.#instance;
	}

	update(delta) {
		Engine.update(this.#engine);
	}

	reset() {
		Events.off(this.engine);
		Composite.clear(this.#engine.world, false, true);
		this.#events = this.#events.cloneNode(true);
	}

	get engine() {
		return this.#engine;
	}

	get events() {
		return this.#events;
	}
}

export default {
	get instance() {
		return PhysicsManager.instance;
	},
};
