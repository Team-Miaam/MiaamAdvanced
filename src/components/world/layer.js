import { Composite } from 'matter-js';
import { constructPropertiesMap } from '../../util/layer.js';

class Layer {
	/**
	 * @type {Composite}
	 */
	#composite;

	data;

	constructor({ layer }) {
		this.data = layer;
		this.#composite = Composite.create({ label: layer.name });
		this.properties = constructPropertiesMap(layer.properties);
	}

	// eslint-disable-next-line class-methods-use-this
	constructBodies() {}

	get composite() {
		return this.#composite;
	}
}

export default Layer;
