import { Container } from 'pixi.js';

class Layer extends Container {
	data;

	constructor({ layer }) {
		super();
		this.data = layer;
	}

	// eslint-disable-next-line class-methods-use-this
	constructSprite() {}
}

export default Layer;
