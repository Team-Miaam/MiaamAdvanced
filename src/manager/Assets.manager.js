import { Loader } from 'pixi.js';
import IllegalArgumentError from '../error/IllegalArgument.error.js';
import GameManager from './Game.manager.js';
// import IntegrationError from '../error/Integration.error.js';

/**
 * @public
 * @class
 */
class AssetsManager {
	/**
	 * @type {AssetsManager}
	 */
	static #instance;

	/**
	 * @private
	 */
	#loader;

	index;

	#chunkDependencyMemo;

	#middlewares;

	/**
	 * @private
	 * @constructor
	 */
	constructor() {
		// if (!GameManager.instance.app) {
		// 	throw new IntegrationError('Cannot start resource manager before creating application');
		// }
		const { assets, chunks } = GameManager.instance.index;
		this.index = { assets, chunks };
		this.#loader = new Loader();
		this.#chunkDependencyMemo = {};
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

	// Dynamic Import

	importChunk = async ({ source, onProgress }) => {
		const chunkName = source.substring(1).replaceAll(/[/\\.]/gm, '_');
		try {
			await this.importChunkAssets({ chunkName, onProgress });
			console.log(this.#loader);
			const module = await __webpack_require__
				.e(chunkName)
				.then(__webpack_require__.bind(__webpack_require__, `.${source}`));
			return module;
		} catch (errors) {
			if (errors.length) {
				errors.forEach((error) => console.error(error));
			} else {
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
		this.#loader.onProgress.add((_loader, resource) => onProgress(this.#loader.progress, resource));

		const assetsPromise = new Promise((resolve, reject) => {
			const errors = [];
			this.#loader.onComplete.add(() => {
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
}

export default {
	get instance() {
		return AssetsManager.instance;
	},
};
