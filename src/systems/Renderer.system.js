import { System, Query } from 'miaam-ecs';
import { Camera, Position, View, Size } from '../components/index.js';
import { GameManager, AssetsManager } from '../manager/index.js';
import SingleCamera from './singleCamera.js';

class Renderer extends System {
	#camera;

	constructor() {
		super();

		this.queries.camera = new Query({
			components: {
				and: [Camera, Position, Size],
			},
		});

		this.queries.view = new Query({
			components: {
				and: [View],
			},
		});
	}

	init({ components, entities }) {
		const viewComp = this.queries.view.run({ components, entities })[0][View.name];
		const view = viewComp.props.map;
		const map = AssetsManager.instance.getResource(viewComp.props.asset);

		const cameraComp = this.queries.camera.run({ components, entities })[0];
		const followPosition = cameraComp[Position.name].props;
		const followSize = cameraComp[Size.name].props;
		const size = cameraComp[Camera.name].props;

		this.#camera = new SingleCamera({ view, map, size });
		this.#camera.centerOver({ position: followPosition, size: followSize });
		GameManager.instance.app.stage.addChild(view);
	}

	update({ delta, components, entities }) {
		const cameraComp = this.queries.camera.run({ components, entities })[0];
		const position = cameraComp[Position.name].props;
		const size = cameraComp[Size.name].props;
		this.#camera.follow({ position, size });
	}
}

export default Renderer;
