import { Composite } from 'matter-js';
import { Component, PrimitiveTypes } from 'miaam-ecs';
import { AssetsManager } from '../../manager/index.js';
import layerTypeRendererRegistry from './layerType.js';
import ComplexObject from '../../types/ComplexObject.js';
import { constructPropertiesMap } from '../../util/layer.js';

const worldSchema = {
	asset: { type: PrimitiveTypes.String },
	composite: { type: ComplexObject },
};

class World extends Component {
	#composite;

	#layers;

	constructor(props) {
		super(props);
		this.update({ composite: this.#constructComposites() });
	}

	#constructComposites() {
		const map = AssetsManager.instance.getResource(this.props.asset).data;
		const composite = Composite.create();

		map.layers.forEach((layer) => {
			const properties = constructPropertiesMap(layer.properties);
			if (properties.physics === undefined) {
				return;
			}

			const renderedLayerComposite = new layerTypeRendererRegistry[layer.type]({
				layer,
			});

			renderedLayerComposite.constructBodies(map);
			Composite.add(composite, renderedLayerComposite.composite);
		});

		return composite;
	}

	addObjectToLayer({ layer: layerName, object }) {
		const layer = this.#layers[layerName];
		if (object.body !== undefined) {
			Composite.add(layer.composite, object.body);
		}
	}

	get composite() {
		return this.#composite;
	}
}

World.setSchema(worldSchema);

export default World;
