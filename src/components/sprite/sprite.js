import { Component, PrimitiveTypes } from 'miaam-ecs';
import { ComplexObject } from '../../types/index.js';
import { AssetsManager } from '../../manager/index.js';
import AnimatedSpriteWState from './animation.js';

const spriteSchema = {
	asset: { type: PrimitiveTypes.String },
	sprite: { type: ComplexObject },
};

class Sprite extends Component {
	constructor(props) {
		super(props);
		const animationData = AssetsManager.instance.getResource(this.props.asset).data;
		this.update({ sprite: new AnimatedSpriteWState(animationData) });
	}

	set state(newState) {
		this.props.sprite.state = newState;
	}

	set position({ x, y }) {
		this.props.sprite.x = x;
		this.props.sprite.y = y;
	}
}

Sprite.setSchema(spriteSchema);

export default Sprite;
