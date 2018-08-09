const fs = require('fs');
const path = require('path');
const iplocation = require('iplocation');

let regionJSONFilePath = path.resolve('data/region.json');
const regionJSON = require(regionJSONFilePath);

const DB = require(path.resolve('lib/services/db'));

const finder = {};

const fetchAndCacheRegionIfNotPresent = async function (IPs, index) {
	if (IPs.length === index) {
		console.log("Done finding region for all available IPs");
		return;
	}

	const ip = IPs[index];
	const existing = regionJSON[ip];

	if (existing) {
		const neededInformation = {
			"country_name": existing.country_name,
			"region": existing.region
		};

		regionJSON[ip] = neededInformation;
		fs.writeFileSync(regionJSONFilePath, JSON.stringify(regionJSON));

		return fetchAndCacheRegionIfNotPresent(IPs, index + 1);
	}

	console.log("Finding location for new IP:", ip);
	const location = await iplocation(ip.replace('*', '1'));

	const neededInformation = {
		"country_name": location.country_name,
		"region": location.region
	};

	regionJSON[ip] = neededInformation;
	fs.writeFileSync(regionJSONFilePath, JSON.stringify(regionJSON));

	setTimeout(() => fetchAndCacheRegionIfNotPresent(IPs, index + 1), 1000);
};

finder.find = async function () {
	DB.getAllUsageData().then((data) => {
		const allIPs = data.map(d => d.sourceIP());
		fetchAndCacheRegionIfNotPresent(allIPs, 0);
	});
};


module.exports = finder;
