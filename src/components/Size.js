import { Component, PrimitiveTypes } from 'miaam-ecs';

class Size extends Component {}

Size.setSchema({
	width: { type: PrimitiveTypes.Number },
	height: { type: PrimitiveTypes.Number },
});

export default Size;
