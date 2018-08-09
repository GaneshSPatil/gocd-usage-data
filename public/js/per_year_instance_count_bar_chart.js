window.renderPerYearInstancesCountBarChart = function (stats) {
	const instanceIdentifiers = Object.keys(stats);

	Highcharts.chart('per_year_instances_count_bar', {
		chart: {
			type: 'column'
		},
		title: {
			text: 'Per Year Instances Count Distribution'
		},
		xAxis: {
			categories: instanceIdentifiers,
			crosshair: true,
			labels: {
				formatter: function () {
					return this.value.substr(0, 7);
				}
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Number of Instances'
			}
		},
		plotOptions: {
			column: {
				pointPadding: 0.2,
				borderWidth: 0
			}
		},
		series: [{
			name: 'Instance Count',
			data: Object.keys(stats).map(s => stats[s])

		}]
	});
};
