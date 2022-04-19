import { Composite } from 'matter-js';
import { Query, System } from 'miaam-ecs';
import { Box, Position, World } from '../components/index.js';
import { PhysicsManager } from '../manager/index.js';

class PhysicsSystem extends System {
	constructor() {
		super();

		this.queries.world = new Query({
			components: {
				and: [World],
			},
		});

		this.queries.bodies = new Query({
			components: {
				and: [Box, Position],
			},
		});
	}

	init({ components, entities }) {
		const bodiesComposite = Composite.create();
		const bodies = this.queries.bodies.run({ components, entities });
		bodies.forEach((entity) => {
			const { body } = entity[Box.name].props;
			Composite.add(bodiesComposite, body);
		});

		const worldComp = this.queries.world.run({ components, entities })[0][World.name];
		const worldComposite = worldComp.props.composite;
		Composite.add(worldComposite, bodiesComposite);

		PhysicsManager.instance.engine.world = worldComposite;
		PhysicsManager.instance.engine.gravity.y = 0.5;
	}

	update({ delta, components, entities }) {
		PhysicsManager.instance.update(delta);
		const bodies = this.queries.bodies.run({ components, entities });
		bodies.forEach((entity) => {
			const box = entity[Box.name];
			const position = entity[Position.name];
			position.update(box.position);
			console.log(box.position);
		});
	}
}

export default PhysicsSystem;
