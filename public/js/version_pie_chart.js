window.renderVersionPieChart = function (stats) {
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
