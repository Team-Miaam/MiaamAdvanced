import { Container } from 'pixi.js';
import { Component, PrimitiveTypes } from 'miaam-ecs';
import { AssetsManager } from '../../manager/index.js';
import { ComplexObject } from '../../types/index.js';
import layerTypeRendererRegistry from './layerType.js';

const viewSchema = {
	asset: { type: PrimitiveTypes.String },
	map: { type: ComplexObject },
};

class View extends Component {
	constructor(props) {
		super(props);
		this.update({ map: this.#constructTexture() });
	}

	#constructTexture() {
		const map = AssetsManager.instance.getResource(this.props.asset).data;
		const container = new Container();

		map.layers.forEach((layer) => {
			const LayerRenderer = layerTypeRendererRegistry[layer.type];
			if (!LayerRenderer) {
				return;
			}
			const renderedLayerContainer = new LayerRenderer({ layer });
			renderedLayerContainer.constructSprite(map);
			container.addChild(renderedLayerContainer);
		});
		return container;
	}
}

View.setSchema(viewSchema);

export default View;
