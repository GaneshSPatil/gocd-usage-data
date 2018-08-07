const path = require('path');
const pg = require('pg');
const UsageData = require(path.resolve('lib/models/usage_data'));

function pgClient(dbName) {
	const connectionString = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/usagedata`;
	const client = new pg.Client({connectionString});
	client.connect();

	return client;
}

const DB = {};

DB.getAllUsageData = () => {
	const client = pgClient();
	const query = `SELECT * FROM usagedata;`;

	return new Promise((fulfil, reject) => {
		client.query(query, (err, res) => {
			client.end();
			if (err) {
				reject('Failed to load all sequences. Reason:' + err);
			} else {
				const data = res.rows.map(UsageData.fromJSON);
				fulfil(data);
			}
		});
	});
};

module.exports = DB;
