import { Loader } from 'pixi.js';
import TilemapLoader from 'miaam-assets/loaders/runtime/tilemap';
import TilesetLoader from 'miaam-assets/loaders/runtime/tileset';

import GameManager from './Game.manager.js';
import IllegalArgumentError from '../error/IllegalArgument.error.js';

/**
 * @public
 * @class
 */
class AssetsManager {
	/**
	 * @type {AssetsManager}
	 */
	static #instance;

	index;

	#chunkDependencyMemo;

	#loader;

	#middlewares;

	/**
	 * @private
	 * @constructor
	 */
	constructor() {
		const { assets, chunks } = GameManager.instance.index;
		this.index = { assets, chunks };
		this.#chunkDependencyMemo = {};
		this.#loader = new Loader();
		this.#middlewares = [];

		this.#getDefaultMiddlewares().forEach((middleware) => this.use(middleware));
	}

	/**
	 * @returns {AssetsManager}
	 */
	static get instance() {
		if (!this.#instance) {
			this.#instance = new AssetsManager();
		}

		return this.#instance;
	}

	importChunk = async ({ chunk, onProgress }) => {
		const chunkName = chunk.source.substring(1).replaceAll(/[/\\.]/gm, '_');

		try {
			await this.importChunkAssets({ chunkName, onProgress });
			const module = await chunk.load();
			return module;
		} catch (errors) {
			if (errors.length) {
				// eslint-disable-next-line no-console
				errors.forEach((error) => console.error(error));
			} else {
				// eslint-disable-next-line no-console
				console.error(errors);
			}

			return undefined;
		}
	};

	importChunkAssets = async ({ chunkName, onProgress }) => {
		const dependencies = this.#resolveChunkDependencies(chunkName);

		const newDependencies = dependencies.filter((dependency) => !this.#loader.resources[dependency]);
		newDependencies.forEach(
			(dependency) => !this.#loader.resources[dependency] && this.#loader.add(dependency, dependency)
		);

		this.#loader.onProgress.add((_loader, resource) => {
			onProgress(this.#loader.progress, resource);
		});

		const assetsPromise = new Promise((resolve, reject) => {
			const errors = [];
			this.#loader.onComplete.add(() => {
				this.#detachLoaderListener();
				if (errors.length) {
					this.#loader.reset();
					reject(errors);
					return;
				}

				newDependencies.forEach((dependency) => {
					const resource = this.#loader.resources[dependency];
					this.#middlewares.forEach((middleware) => middleware.use(resource, () => {}));
				});

				resolve();
			});

			this.#loader.onError.add((_error, _loader, resource) => {
				errors.push(`Cannot load ${resource.name}`);
			});

			this.#loader.load();
		});

		return assetsPromise;
	};

	#resolveChunkDependencies = (chunkName) => {
		if (this.#chunkDependencyMemo[chunkName]) {
			return this.#chunkDependencyMemo[chunkName];
		}

		const dependencies = new Set();
		const visited = {};
		const chunkDependencies = this.index.chunks[chunkName];
		if (!chunkDependencies) {
			throw new IllegalArgumentError('Requested chunk cannot be found');
		}

		chunkDependencies.forEach((chunkDependency) => {
			if (visited[chunkDependency]) return;

			const resolveAssetDependency = (file) => {
				visited[file] = true;
				const fileDependencies = this.index.assets[file];
				if (fileDependencies) {
					fileDependencies.forEach(
						(fileDependency) => !visited[fileDependency] && resolveAssetDependency(fileDependency)
					);
				}
				dependencies.add(file);
			};

			resolveAssetDependency(chunkDependency);
		});

		this.#chunkDependencyMemo[chunkName] = [...dependencies];
		return this.#chunkDependencyMemo[chunkName];
	};

	getResource = (resourcePath) => this.#loader.resources[resourcePath];

	use = (loaderPlugin) => {
		loaderPlugin.add(this.#loader);
		this.#middlewares.push(loaderPlugin);
	};

	detachAllMiddlewares = () => {
		this.#middlewares = [];
	};

	/* ================================ UTILITIES ================================ */

	#detachLoaderListener = () => {
		this.#loader.onProgress.detachAll();
		this.#loader.onComplete.detachAll();
		this.#loader.onError.detachAll();
	};

	#getDefaultMiddlewares = () => [new TilemapLoader({}), new TilesetLoader({})];
}

export default {
	get instance() {
		return AssetsManager.instance;
	},
};
