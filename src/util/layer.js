const constructPropertiesMap = (properties) => {
	const propertiesMap = {};
	if (properties !== undefined) {
		properties.forEach(({ name, value }) => {
			propertiesMap[name] = value;
		});
	}

	return propertiesMap;
};

export { constructPropertiesMap };
