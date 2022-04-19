import { Bodies, Body, Composite, Events } from 'matter-js';
import PhysicsManager from '../../manager/Physics.manager.js';
import { constructPropertiesMap } from '../../util/layer.js';
import Layer from './layer.js';

// FIXME: Object group
class ObjectGroup extends Layer {
	constructBodies(map) {
		const { objects: objectsArray } = this.data;
		const objectsMap = {};
		objectsArray.forEach((object) => {
			object.properties = constructPropertiesMap(object.properties);
			objectsMap[object.name] = object;
			if (this.properties.physics !== true) {
				return;
			}
			const { x, y, width, height } = object;
			const { isStatic, isSensor } = this.properties;
			const body = Bodies.rectangle(x + (width - map.tilewidth) / 2, y + (height - map.tileheight) / 2, width, height, {
				label: object.name,
				isStatic,
			});
			if (isSensor) {
				Body.set(body, 'isSensor', true);
				Events.on(PhysicsManager.instance.engine, 'collisionStart', (event) => {
					const pairs = event.pairs[0];
					if (pairs.bodyA.label === object.name) {
						const eventTrigger = new CustomEvent(`collisionStart.${object.name}`, { detail: event });
						// setTimeout(() => {
						PhysicsManager.instance.events.dispatchEvent(eventTrigger);
						// }, 0);
					}
				});
				Events.on(PhysicsManager.instance.engine, 'collisionEnd', (event) => {
					const pairs = event.pairs[0];
					if (pairs.bodyA.label === object.name) {
						const eventTrigger = new CustomEvent(`collisionEnd.${object.name}`, { detail: event });
						// setTimeout(() => {
						PhysicsManager.instance.events.dispatchEvent(eventTrigger);
						// }, 0);
					}
				});
			}
			Composite.add(this.composite, body);
		});

		this.data.objects = objectsMap;
	}
}

export default ObjectGroup;
