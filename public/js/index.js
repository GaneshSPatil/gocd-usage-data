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

window.onload = function () {
	$.get("api/data", function (responseData) {
		renderGeneralStats(responseData.general_stats);
		renderVersionPieChart(responseData.version_based_stats)
	});
};
