const path = require('path');
const regionJSON = require(path.resolve('data/region.json'));

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
		const reports = serverIdToUsageData[serverId];
		if (reports[reports.length - 1].oldestPipelineExecutionTime().getUTCFullYear() > 1970) {
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

processor.getRegionBasedStats = function (data) {
	const serverIdToUsageDataMap = getProductionInstances(data);

	const regionToCountMap = {};

	Object.keys(serverIdToUsageDataMap).forEach(serverId => {
		const ip = serverIdToUsageDataMap[serverId][0].sourceIP();

		const regionInformation = regionJSON[ip];
		if (!regionInformation) return;

		const region = regionInformation.country_name;
		regionToCountMap[region] = regionToCountMap[region] || 0;
		regionToCountMap[region] = regionToCountMap[region] + 1;
	});

	return regionToCountMap;
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

processor.getPerYearInstancesCountStats = function (data) {
	const serverIdToUsageDataMap = getProductionInstances(data);
	const yearToInstanceCountMap = {};
	for (let serverId in serverIdToUsageDataMap) {
		const year = serverIdToUsageDataMap[serverId][serverIdToUsageDataMap[serverId].length - 1].oldestPipelineExecutionTime().getUTCFullYear();
		yearToInstanceCountMap[year] = yearToInstanceCountMap[year] || 0;
		yearToInstanceCountMap[year] = yearToInstanceCountMap[year] + 1;
	}

	return yearToInstanceCountMap;
};

module.exports = processor;
