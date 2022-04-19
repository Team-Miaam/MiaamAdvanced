import { Component, PrimitiveTypes } from 'miaam-ecs';

class Position extends Component {}

Position.setSchema({
	x: { type: PrimitiveTypes.Number },
	y: { type: PrimitiveTypes.Number },
});

export default Position;
