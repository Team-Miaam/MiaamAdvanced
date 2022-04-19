/* eslint-disable no-unused-vars */
import { Type } from 'miaam-ecs';

const ComplexObject = new Type({
	name: 'Complex Object',
	validator: (value) => true,
	clone: (value) => undefined,
	defaultValue: {},
	serialize: (value) => undefined,
	deserialize: (value) => undefined,
});

export default ComplexObject;
