import { Bodies } from 'matter-js';
import { Component } from 'miaam-ecs';
import { ComplexObject } from '../types/index.js';

const boxSchema = {
	body: { type: ComplexObject },
};

class Box extends Component {
	constructor({ position: { x, y }, size: { width, height } }) {
		const body = Bodies.rectangle(x, y, width, height);
		super({ body });
	}

	get position() {
		return this.props.body.position;
	}
}

Box.setSchema(boxSchema);

export default Box;
