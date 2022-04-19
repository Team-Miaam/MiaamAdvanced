import { System, Query } from 'miaam-ecs';
import { Camera, Position, View } from '../components/index.js';

class Renderer extends System {
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
		const views = this.queries.views.run({ components, entities });
		for (let { value: view, done: vDone } = views.next(); !vDone; { value: view, done: vDone } = views.next()) {
			const cameras = this.queries.camera.run({ components, entities });
			for (let { value: camera, done } = cameras.next(); !done; { value: camera, done } = cameras.next()) {
				console.log(delta, view, camera);
			}
		}
	}
}

export default Renderer;
