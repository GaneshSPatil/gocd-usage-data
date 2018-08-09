const path = require('path');
const express = require('express');

const DB = require(path.resolve('lib/services/db'));
const dataProcessor = require(path.resolve('lib/services/data_processor'));

const app = express();

app.use(express.static('public'));

app.get('/api/data', function (req, res) {
	DB.getAllUsageData().then((data) => {
		res.send({
			'general_stats': dataProcessor.getStats(data),
			'version_based_stats': dataProcessor.getVersionBasedStats(data),
			'pipeline_count_based_stats': dataProcessor.getPipelineCountBasedStats(data),
			'per_year_instances_count_stats': dataProcessor.getPerYearInstancesCountStats(data)
		})
	});
});

console.log(`App is running at http://localhost:${process.env.PORT || 3000}`);
app.listen(process.env.PORT || 3000);
