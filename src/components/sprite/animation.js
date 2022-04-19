import { AnimatedSprite, Texture } from 'pixi.js';
import { snip } from '../../util/spritesheet.js';
import { cloneArray } from '../../util/common.js';
import { AssetsManager } from '../../manager/index.js';

class AnimatedSpriteWState extends AnimatedSprite {
	#states;

	#tileset;

	#spritesheet;

	constructor(animationMap) {
		super([Texture.EMPTY]);
		this.#states = { normal: { original: {} } };
		this.#tileset = AssetsManager.instance.getResource(animationMap.tilesets[0].source).data;
		this.#spritesheet = AssetsManager.instance.getResource(this.#tileset.image).texture;
		this.#generateNormalTextures(animationMap);
		this.state = { state: animationMap.layers[0].name };
	}

	#generateNormalTextures(animationMap) {
		const states = animationMap.layers;
		const tileset = this.#tileset;
		const spritesheet = this.#spritesheet;

		states.forEach((state) => {
			this.#states.normal.original[state.name] = [];
			state.data.forEach((gid) => {
				if (gid === 0) {
					return;
				}
				// Figure out the column and row number that the tileset
				// image is on, and then use those values to calculate
				// the x and y pixel position of the image on the tileset
				const tilesetColumn = (gid - 1) % tileset.columns;
				const tilesetRow = Math.floor((gid - 1) / tileset.columns);
				let tilesetX = tilesetColumn * animationMap.tilewidth;
				let tilesetY = tilesetRow * animationMap.tileheight;

				const { spacing } = tileset;
				if (spacing > 0) {
					tilesetX += spacing + spacing * ((gid - 1) % tileset.columns);
					tilesetY += spacing + spacing * Math.floor((gid - 1) / tileset.columns);
				}

				const texture = snip(spritesheet, tilesetX, tilesetY, animationMap.tilewidth, animationMap.tileheight);
				this.#states.normal.original[state.name].push(texture);
			});
		});
	}

	generateRotatedTextures({ from = 'normal', rotationName, rotationGroup }) {
		this.#states[rotationName] = { original: {} };
		const rotatedTextures = this.#states[rotationName].original;
		Object.keys(this.#states[from].original).forEach((state) => {
			const textures = this.#states[from].original[state];
			rotatedTextures[state] = cloneArray(textures);
			rotatedTextures[state].forEach((texture) => {
				texture.rotate = rotationGroup;
			});
		});
	}

	generateFunctionalTextures({ f, rotationName = 'normal', fromFunc = 'original', state }) {
		const textures = this.#states[rotationName][fromFunc][state];
		const texturesClone = cloneArray(textures);
		this.#states[rotationName][f.name] = {};
		this.#states[rotationName][f.name][state] = f(texturesClone);
	}

	set state({ rotationName = 'normal', f = 'original', state, speed, anchor, loop = -1, angle = 0 }) {
		this.textures = this.#states[rotationName][f][state];
		if (anchor !== undefined) {
			this.anchor.set(anchor);
		}
		if (speed !== undefined) {
			this.animationSpeed = speed;
		}
		this.loop = true;
		this.loopCount = loop * this.textures.length - 1;
		this.angle = angle;
		if (loop > 0) {
			this.onFrameChange = () => {
				this.loopCount -= 1;
				if (this.loopCount === 0) {
					this.loop = false;
				}
			};
		}
		if (loop !== 0) {
			this.play();
		}
	}
}

export default AnimatedSpriteWState;
