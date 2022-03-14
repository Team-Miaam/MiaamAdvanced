import { System } from 'miaam-ecs';

class InvokeSystem extends System {
	#callbacks;

	constructor() {
		super();

		this.#callbacks = [];
	}

	init() {}

	beforeUpdate() {}

	update() {}

	afterUpdate() {}

	destroy() {}

	registerCallback = ({ callback }) => {
		this.#callbacks.push(callback);
	};

	call = () => {
		this.#callbacks.forEach((item) => {
			item();
		});
	};
}
