import { Entity } from 'miaam-ecs';
import { View, World } from '../components/index.js';

class Map extends Entity {
	#asset;

	constructor(asset) {
		super();
		this.#asset = asset;
	}

	init() {
		const view = new View({ asset: this.#asset });
		this.addComponent(view);
		const world = new World({ asset: this.#asset });
		this.addComponent(world);
	}
}

export default Map;
