/* eslint-disable no-bitwise */

/**
 * Courtesy: https://stackoverflow.com/a/42919752/10901858
 */

const top = 0;
const parent = (i) => ((i + 1) >>> 1) - 1;
const left = (i) => (i << 1) + 1;
const right = (i) => (i + 1) << 1;

class PriorityQueue {
	#heap;

	#comparator;

	constructor(comparator = (a, b) => a > b) {
		this.#heap = [];
		this.#comparator = comparator;
	}

	get size() {
		return this.#heap.length;
	}

	get empty() {
		return this.size() === 0;
	}

	get top() {
		return this.#heap[top];
	}

	push(...values) {
		values.forEach((value) => {
			this.#heap.push(value);
			this.#siftUp();
		});
		return this.size();
	}

	pop() {
		const poppedValue = this.peek();
		const bottom = this.size() - 1;
		if (bottom > top) {
			this.#swap(top, bottom);
		}
		this.#heap.pop();
		this.#siftDown();
		return poppedValue;
	}

	replace(value) {
		const replacedValue = this.peek();
		this.#heap[top] = value;
		this.#siftDown();
		return replacedValue;
	}

	#greater(i, j) {
		return this.#comparator(this.#heap[i], this.#heap[j]);
	}

	#swap(i, j) {
		[this.#heap[i], this.#heap[j]] = [this.#heap[j], this.#heap[i]];
	}

	#siftUp() {
		let node = this.size() - 1;
		while (node > top && this.#greater(node, parent(node))) {
			this.#swap(node, parent(node));
			node = parent(node);
		}
	}

	#siftDown() {
		let node = top;
		while (
			(left(node) < this.size() && this.#greater(left(node), node)) ||
			(right(node) < this.size() && this.#greater(right(node), node))
		) {
			const maxChild = right(node) < this.size() && this.#greater(right(node), left(node)) ? right(node) : left(node);
			this.#swap(node, maxChild);
			node = maxChild;
		}
	}
}

export default PriorityQueue;
