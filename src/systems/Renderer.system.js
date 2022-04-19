import { System, Query } from 'miaam-ecs';
import { Container } from 'pixi.js';
import { Camera, Position, View } from '../components/index.js';
import GameManager from '../manager/index.js';
import SingleCamera from './singleCamera.js';

class Renderer extends System {
	#camera;

	constructor() {
		super();

		this.queries.camera = new Query({
			components: {
				and: [Camera, Position],
			},
		});

		this.queries.view = new Query({
			components: {
				and: [View],
			},
		});
	}

	update({ delta, components, entities }) {
		const container = new Container();
		const views = this.queries.view.run({ components, entities });
		const cameras = this.queries.camera.run({ components, entities });
		views.forEach((view) => {
			cameras.forEach((camera) => {
				console.log(view, camera);
			});
		});
		// console.log(views, cameras);
	}
}

export default Renderer;
