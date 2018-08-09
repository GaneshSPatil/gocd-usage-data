window.renderPipelineCountBarChart = function (stats) {
	const instanceIdentifiers = stats.map(s => s.server_id);

	Highcharts.chart('pipeline_count_bar', {
		chart: {
			type: 'column'
		},
		title: {
			text: 'Highest Number of Pipelines'
		},
		subtitle: {
			text: 'Top 25 Instances'
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
				text: 'Number of Pipelines'
			}
		},
		plotOptions: {
			column: {
				pointPadding: 0.2,
				borderWidth: 0
			}
		},
		series: [{
			name: 'Pipeline count',
			data: stats.map(s => +s.pipeline_count)

		}]
	});
};
