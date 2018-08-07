const UsageData = function (info) {
	const self = this;

	self.serverId = () => info.serverid;
	self.pipelineCount = () => info.pipelinecount;
	self.agentCount = () => info.agentcount;
	self.oldestPipelineExecutionTime = () => info.oldestpipelineexecutiontime;
	self.gocdVersion = () => info.gocdversion;
	self.sourceIP = () => info.sourceip;
	self.timestamp = () => info.timestamp;

	this.toJSON = () => info;
};

UsageData.fromJSON = function (json) {
	return new UsageData(json);
};

module.exports = UsageData;
