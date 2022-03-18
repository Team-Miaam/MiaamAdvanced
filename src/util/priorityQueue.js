class Heap {
	constructor(comparator = (a, b) => a.time - b.time) {
		this.array = [];
		this.comparator = (i1, i2) => {
			const value = comparator(this.array[i1].time, this.array[i2].time);
			if (Number.isNaN(value)) {
				throw new Error(
					`Comparator should evaluate to a number. Got ${value} when comparing ${this.array[i1].time} with ${this.array[i2].time}`
				);
			}
			return value;
		};
	}

	/**
	 * Insert element
	 * @param {any} value
	 */
	add(value) {
		this.array.push(value);
		this.bubbleUp();
	}

	/**
	 * Retrieves, but does not remove, the head of this heap
	 */
	peek() {
		return this.array[0];
	}

	/**
	 * Retrieves and removes the head of this heap, or returns null if this heap is empty.
	 */
	remove(index = 0) {
		if (!this.size) return null;
		this.swap(index, this.size - 1); // swap with last
		const value = this.array.pop(); // remove element
		this.bubbleDown(index);
		return value;
	}

	/**
	 * Returns the number of elements in this collection.
	 */
	get size() {
		return this.array.length;
	}

	/**
	 * Move new element upwards on the heap, if it's out of order
	 */
	bubbleUp() {
		let index = this.size - 1;
		const parent = (i) => Math.ceil(i / 2 - 1);
		while (parent(index) >= 0 && this.comparator(parent(index), index) > 0) {
			this.swap(parent(index), index);
			index = parent(index);
		}
	}

	/**
	 * After removal, moves element downwards on the heap, if it's out of order
	 */
	bubbleDown(index = 0) {
		let curr = index;
		const left = (i) => 2 * i + 1;
		const right = (i) => 2 * i + 2;
		const getTopChild = (i) => (right(i) < this.size && this.comparator(left(i), right(i)) > 0 ? right(i) : left(i));

		while (left(curr) < this.size && this.comparator(curr, getTopChild(curr)) > 0) {
			const next = getTopChild(curr);
			this.swap(curr, next);
			curr = next;
		}
	}

	/**
	 * Swap elements on the heap
	 * @param {number} i1 index 1
	 * @param {number} i2 index 2
	 */
	swap(i1, i2) {
		[this.array[i1], this.array[i2]] = [this.array[i2], this.array[i1]];
	}
}

// aliases
Heap.prototype.poll = Heap.prototype.remove;
Heap.prototype.offer = Heap.prototype.add;
Heap.prototype.element = Heap.prototype.peek;

module.exports = Heap;
