const processor = {};

const getServerIdToUsageDataMap = function (data) {
	const serverIdToUsageDataMap = {};

	data.forEach(d => {
		serverIdToUsageDataMap[d.serverId()] = serverIdToUsageDataMap[d.serverId()] || [];
		serverIdToUsageDataMap[d.serverId()].push(d);
	});

	return serverIdToUsageDataMap;
};

const getProductionInstances = function (data) {
	const serverIdToUsageData = getServerIdToUsageDataMap(data);
	const productionInstances = {};

	for (let serverId in serverIdToUsageData) {
		if (serverIdToUsageData[serverId].length > 1) {
			productionInstances[serverId] = serverIdToUsageData[serverId];
		}
	}

	return productionInstances;
};

processor.getStats = function (data) {
	const totalPingReceived = data.length;
	const serverIdToUsageDataMap = getServerIdToUsageDataMap(data);

	return {
		'usage_data_received_count': totalPingReceived,
		'hosted_instances_count': Object.keys(serverIdToUsageDataMap).length,
		'production_instances_count': Object.keys(getProductionInstances(data)).length
	};
};

processor.getVersionBasedStats = function (data) {
	const versionsToCountMap = {};
	const serverIdToUsageDataMap = getProductionInstances(data);

	for (let serverId in serverIdToUsageDataMap) {
		const usageData = serverIdToUsageDataMap[serverId][serverIdToUsageDataMap[serverId].length - 1];

		versionsToCountMap[usageData.gocdVersion()] = versionsToCountMap[usageData.gocdVersion()] || 0;
		versionsToCountMap[usageData.gocdVersion()] = versionsToCountMap[usageData.gocdVersion()] + 1;
	}

	return versionsToCountMap;
};

processor.getPipelineCountBasedStats = function (data) {
	const serverIdToUsageDataMap = getProductionInstances(data);
	const serverIdToPipelineCount = [];
	for (let serverId in serverIdToUsageDataMap) {
		serverIdToPipelineCount.push({
			'server_id': serverId,
			'pipeline_count': serverIdToUsageDataMap[serverId][serverIdToUsageDataMap[serverId].length - 1].pipelineCount()
		});
	}
	serverIdToPipelineCount.sort(function (a, b) {
		return ((+b.pipeline_count) - (+a.pipeline_count));
	});

	return serverIdToPipelineCount.slice(0, 25);
};

module.exports = processor;
