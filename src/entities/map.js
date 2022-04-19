import { Entity } from 'miaam-ecs';
import { View } from '../components/index.js';

class Map extends Entity {
	#asset;

	constructor(asset) {
		super();
		this.#asset = asset;
	}

	init() {
		const view = new View({ asset: this.#asset });
		this.addComponent(view);
	}
}

export default Map;
