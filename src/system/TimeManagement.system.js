import { System } from 'miaam-ecs';

class TimeManagement extends System {
	#callbacks;

	constructor() {
		super();
		this.startTime = this.d.getTime();
		this.#callbacks = [];
	}

	init() {}

	beforeUpdate() {}

	update() {}

	afterUpdate() {}

	destroy() {}

	registerCallback = ({ callback, time }) => {
		this.#callbacks.push({ callback, time });
	};

	d = new Date();

	startTime;

	currentTime;

	call = () => {
		this.currentTime = this.d.gettime();
		this.#callbacks.forEach((item) => {
			if (this.startTime - this.currentTime >= item.time) item.callback();
		});
	};
}

export default TimeManagement;
