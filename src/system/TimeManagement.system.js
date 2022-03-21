import { System } from 'miaam-ecs';
import { PriorityQueue } from '../util/index.js';

class TimeManagement extends System {
	#callbacks;

	constructor() {
		super();
		this.#callbacks = new PriorityQueue((a, b) => a.time < b.time);
	}

	init() {
		this.#startTime = Date.now();
	}

	// eslint-disable-next-line class-methods-use-this
	beforeUpdate() {}

	// eslint-disable-next-line class-methods-use-this
	update() {}

	// eslint-disable-next-line class-methods-use-this
	afterUpdate() {}

	// eslint-disable-next-line class-methods-use-this
	destroy() {}

	registerCallback = ({ callback, time }) => {
		this.#callbacks.push({ callback, time });
	};

	#startTime;

	call = () => {
		const currentTime = Date.now();
		while (this.#callbacks.size > 0) {
			const item = this.#callbacks.top;
			if (!(this.#startTime - currentTime >= item.time)) {
				break;
			}

			item.callback();
			this.#callbacks.pop();
		}
	};
}

const Invoke = ({ callback, time }) => {
	// FIXME
	TimeManagement.registerCallback({ callback, time });
};

export default TimeManagement;
export { Invoke };
