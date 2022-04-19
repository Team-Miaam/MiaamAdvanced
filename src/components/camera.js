import { Component, PrimitiveTypes } from 'miaam-ecs';

class Camera extends Component {}
Camera.setSchema({
	width: { type: PrimitiveTypes.Number },
	height: { type: PrimitiveTypes.Number },
});
