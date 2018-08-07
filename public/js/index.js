const renderGeneralStats = function (stats) {
	console.log(stats);
	$('.ping .number').text(stats.usage_data_received_count);
	$('.prod-instances-count .number').text(stats.production_instances_count);
	$('.total-instances-count .number').text(stats.hosted_instances_count);
};

const renderVersionPieChart = function (stats) {
	const data = [];
	for (let version in stats) {
		data.push({
			name: 'v' + version,
			y: stats[version]
		});
	}

	Highcharts.chart('version_pie', {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: 'GoCD Version Based Distribution'
		},
		tooltip: {
			pointFormat: '<b>{point.y}</b> instances covering <b>{point.percentage:.1f}%</b> of total.'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false
				},
				showInLegend: true
			}
		},
		series: [{
			colorByPoint: true,
			data
		}]
	});
};

const renderPipelineCountBarChart = function (stats) {
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

		// tooltip: {
		// 	headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
		// 	pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		// 		'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
		// 	footerFormat: '</table>',
		// 	shared: true,
		// 	useHTML: true
		// },
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

window.onload = function () {
	$.get("api/data", function (responseData) {
		renderGeneralStats(responseData.general_stats);
		renderVersionPieChart(responseData.version_based_stats);
		renderPipelineCountBarChart(responseData.pipeline_count_based_stats);
	});
};
