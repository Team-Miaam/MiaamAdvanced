import { Loader } from 'pixi.js';
import IllegalArgumentError from '../error/IllegalArgument.error.js';
import GameManager from './Game.manager.js';

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
		dependencies.forEach(
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

	use = (middleware) => {
		this.#middlewares.push(middleware);
	};

	/* ================================ UTILITIES ================================ */

	#detachLoaderListener = () => {
		this.#loader.onProgress.detachAll();
		this.#loader.onComplete.detachAll();
		this.#loader.onError.detachAll();
	};
}

export default {
	get instance() {
		return AssetsManager.instance;
	},
};
