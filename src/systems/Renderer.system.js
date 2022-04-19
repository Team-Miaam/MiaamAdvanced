import { System, Query } from 'miaam-ecs';
import { Container } from 'pixi.js';
import { Camera, Position, View, Size, Sprite } from '../components/index.js';
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

		this.queries.sprite = new Query({
			components: {
				and: [Sprite, Position],
			},
		});
	}

	init({ components, entities }) {
		const spritesComps = this.queries.sprite.run({ components, entities });
		const spritesContainer = new Container();
		spritesComps.forEach((spriteComp) => {
			const { sprite } = spriteComp[Sprite.name].props;
			spritesContainer.addChild(sprite);
		});

		const viewComp = this.queries.view.run({ components, entities })[0][View.name];
		const view = viewComp.props.map;
		view.addChild(spritesContainer);
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
		this.#camera.follow(position, size);

		const sprites = this.queries.sprite.run({ components, entities });
		sprites.forEach((entity) => {
			const position = entity[Position.name].props;
			const sprite = entity[Sprite.name];
			sprite.position = position;
		});
	}
}

export default Renderer;
