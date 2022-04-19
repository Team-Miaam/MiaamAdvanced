import { Query, System } from 'miaam-ecs';
import { Box, Position } from '../components/index.js';
import { PhysicsManager } from '../manager/index.js';

class PhysicsSystem extends System {
	constructor() {
		super();

		this.queries.bodies = new Query({
			components: {
				and: [Box, Position],
			},
		});
	}

	update({ delta, components, entities }) {
		PhysicsManager.instance.update(delta);
		const bodies = this.queries.bodies.run({ components, entities });
		bodies.forEach((entity) => {
			const box = entity[Box.name];
			const position = entity[Position.name];
			position.update(box.position);
		});
	}
}

export default PhysicsSystem;
