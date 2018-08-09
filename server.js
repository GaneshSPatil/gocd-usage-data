const path = require('path');
const express = require('express');

const DB = require(path.resolve('lib/services/db'));
const dataProcessor = require(path.resolve('lib/services/data_processor'));
const locationFinder = require(path.resolve('lib/services/location_finder'));

const app = express();

app.use(express.static('public'));

app.get('/api/data', function (req, res) {
	DB.getAllUsageData().then((data) => {
		let stats = {
			'general_stats': dataProcessor.getStats(data),
			'version_based_stats': dataProcessor.getVersionBasedStats(data),
			'region_based_stats': dataProcessor.getRegionBasedStats(data),
			'pipeline_count_based_stats': dataProcessor.getPipelineCountBasedStats(data),
			'per_year_instances_count_stats': dataProcessor.getPerYearInstancesCountStats(data)
		};

		res.send(stats);
	});
});

//every hour check if we need to find the region of any new instances
setInterval(locationFinder.find, 1000 * 60 * 60);

console.log(`App is running at http://localhost:${process.env.PORT || 3000}`);
app.listen(process.env.PORT || 3000);
