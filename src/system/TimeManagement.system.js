import { System } from 'miaam-ecs';
import { PriorityQueue } from '../util/index.js';

class TimeManagement extends System {
	#callbacks;

	constructor() {
		super();
		this.startTime = this.d.getTime();
		this.#callbacks = new PriorityQueue((a, b) => a.time < b.time);
	}

	init() {}

	beforeUpdate() {}

	update() {}

	afterUpdate() {}

	destroy() {}

	registerCallback = ({ callback, time }) => {
		this.#callbacks.push({ callback, time });
	};

	// FIXME
	d = new Date();

	startTime;

	currentTime;

	call = () => {
		this.currentTime = this.d.gettime();
		while (this.#callbacks.size > 0) {
			const item = this.#callbacks.top;
			if (!(this.startTime - this.currentTime >= item.time)) {
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
